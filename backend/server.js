import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ===========================
// 📦 CONFIGURACIÓN DEL CONTRATO
// ===========================

// Cargar ABI
const abiPath = path.join(__dirname, 'abi.json');
const contractABI = JSON.parse(fs.readFileSync(abiPath, 'utf8'));

// Conectar a red y contrato
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);

// Estados del servicio (según enum del contrato)
const ESTADOS = {
  0: 'Pendiente',
  1: 'EnProceso',
  2: 'Completado',
  3: 'Cancelado'
};

// ===========================
// 🧩 FUNCIONES AUXILIARES
// ===========================

function formatearServicio(servicio) {
  return {
    id: servicio.id?.toString() ?? '',
    creador: servicio.creador ?? '',
    descripcion: servicio.descripcion ?? '',
    fechaCreacion: new Date(Number(servicio.fechaCreacion) * 1000).toISOString(),
    estado: ESTADOS[servicio.estado] || 'Desconocido',
    estadoNum: Number(servicio.estado)
  };
}

function formatearUsuario(usuario) {
  return {
    wallet: usuario.wallet ?? '',
    nombre: usuario.nombre ?? '',
    email: usuario.email ?? '',
    registrado: usuario.registrado ?? false
  };
}

// ===========================
// 🛠️ RUTAS API
// ===========================

// 🧍 Registrar usuario
app.post('/api/registrar', async (req, res) => {
  try {
    const { nombre, email, walletAddress } = req.body;

    if (!nombre || !email || !walletAddress)
      return res.status(400).json({ error: 'Faltan campos requeridos' });

    if (!ethers.isAddress(walletAddress))
      return res.status(400).json({ error: 'Dirección de wallet inválida' });

    const tx = await contract.registrarUsuario(nombre, email);
    await tx.wait();

    res.json({
      success: true,
      message: '✅ Usuario registrado exitosamente',
      transactionHash: tx.hash
    });
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario', message: error.message });
  }
});

// 🧾 Crear servicio
app.post('/api/crear-servicio', async (req, res) => {
  try {
    const { descripcion, walletAddress } = req.body;

    if (!descripcion || !walletAddress)
      return res.status(400).json({ error: 'Faltan campos requeridos' });

    if (!ethers.isAddress(walletAddress))
      return res.status(400).json({ error: 'Dirección de wallet inválida' });

    const tx = await contract.crearServicio(descripcion);
    const receipt = await tx.wait();

    // Buscar evento "ServicioCreado"
    let servicioId = null;
    for (const log of receipt.logs) {
      try {
        const parsed = contract.interface.parseLog(log);
        if (parsed.name === 'ServicioCreado') {
          servicioId = parsed.args.id.toString();
          break;
        }
      } catch {}
    }

    res.json({
      success: true,
      message: '✅ Servicio creado exitosamente',
      servicioId,
      transactionHash: tx.hash
    });
  } catch (error) {
    console.error('❌ Error al crear servicio:', error);
    res.status(500).json({ error: 'Error al crear servicio', message: error.message });
  }
});

// 🔄 Actualizar estado de servicio
app.post('/api/actualizar-estado', async (req, res) => {
  try {
    const { id, nuevoEstado } = req.body;

    if (id === undefined || nuevoEstado === undefined)
      return res.status(400).json({ error: 'Faltan campos requeridos' });

    if (nuevoEstado < 0 || nuevoEstado > 3)
      return res.status(400).json({ error: 'Estado inválido (0-3)' });

    const tx = await contract.actualizarEstadoServicio(id, nuevoEstado);
    await tx.wait();

    res.json({
      success: true,
      message: '✅ Estado actualizado correctamente',
      transactionHash: tx.hash
    });
  } catch (error) {
    console.error('❌ Error al actualizar estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado', message: error.message });
  }
});

// 🔍 Obtener servicio por ID
app.get('/api/servicio/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await contract.obtenerServicio(id);
    res.json({ success: true, servicio: formatearServicio(servicio) });
  } catch (error) {
    console.error('❌ Error al obtener servicio:', error);
    res.status(500).json({ error: 'Error al obtener servicio', message: error.message });
  }
});

// 👤 Obtener usuario por wallet
app.get('/api/usuario/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;
    if (!ethers.isAddress(wallet))
      return res.status(400).json({ error: 'Dirección de wallet inválida' });

    const usuario = await contract.obtenerUsuario(wallet);
    res.json({ success: true, usuario: formatearUsuario(usuario) });
  } catch (error) {
    console.error('❌ Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario', message: error.message });
  }
});

// 📋 Obtener todos los servicios
app.get('/api/servicios', async (req, res) => {
  try {
    const contador = await contract.contadorServicios();
    const total = Number(contador);
    const servicios = [];

    for (let i = 0; i < total; i++) {
      try {
        const servicio = await contract.obtenerServicio(i);
        servicios.push(formatearServicio(servicio));
      } catch (error) {
        console.error(`⚠️ Error al obtener servicio ${i}:`, error.message);
      }
    }

    res.json({ success: true, total: servicios.length, servicios });
  } catch (error) {
    console.error('❌ Error al obtener servicios:', error);
    res.status(500).json({ error: 'Error al obtener servicios', message: error.message });
  }
});

// 🩺 Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend funcionando correctamente ✅' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(`❌ Ruta no encontrada: ${req.originalUrl}`);
});

// ===========================
// 🚀 INICIO DEL SERVIDOR
// ===========================
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`📋 Contrato conectado: ${process.env.CONTRACT_ADDRESS}`);
});
