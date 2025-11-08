# 🚀 Proyecto Fullstack On-Chain - Registro de Servicios

Proyecto fullstack para gestionar usuarios y servicios en la blockchain usando Node.js, Express, React, Vite, Tailwind CSS y Ethers.js.

## 📁 Estructura del Proyecto

```
proyecto-onchain/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── .env
│   └── abi.json
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── config.js
        ├── abi.json
        └── components/
            ├── RegistroUsuario.jsx
            ├── CrearServicio.jsx
            ├── ListaServicios.jsx
            └── EstadoServicio.jsx
```

## 🛠️ Instalación

### Backend

1. Navega a la carpeta backend:
```bash
cd backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno en `.env`:
```env
CONTRACT_ADDRESS=0xTU_CONTRATO
PROVIDER_URL=https://sepolia.infura.io/v3/TU_INFURA_KEY
PRIVATE_KEY=TU_PRIVATE_KEY
PORT=3000
```

4. Inicia el servidor:
```bash
npm start
```

### Frontend

1. Navega a la carpeta frontend:
```bash
cd frontend
```

2. **IMPORTANTE**: Si tienes problemas con node_modules, elimínalo primero:
```bash
# En WSL/Linux:
rm -rf node_modules package-lock.json
npm install

# O en Windows PowerShell (desde WSL):
wsl bash -c "cd /home/user23/proyectos/frontend && rm -rf node_modules package-lock.json && npm install"
```

3. Instala las dependencias:
```bash
npm install
```

4. Crea un archivo `.env` en la carpeta frontend (opcional):
```env
VITE_API_URL=http://localhost:3000
VITE_CONTRACT_ADDRESS=0xTU_CONTRATO
VITE_PROVIDER_URL=https://sepolia.infura.io/v3/TU_INFURA_KEY
```

5. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 🎯 Funcionalidades

### Backend API

- `POST /registrar` - Registra un usuario (nombre, email)
- `POST /crear-servicio` - Crea un servicio
- `POST /actualizar-estado` - Admin actualiza el estado de un servicio
- `GET /servicio/:id` - Obtiene datos de un servicio
- `GET /usuario/:wallet` - Obtiene datos de un usuario
- `GET /servicios` - Obtiene todos los servicios
- `GET /health` - Health check

### Frontend

- **RegistroUsuario**: Permite registrar usuarios en la blockchain usando MetaMask
- **CrearServicio**: Permite crear servicios on-chain
- **ListaServicios**: Muestra todos los servicios registrados
- **EstadoServicio**: Permite actualizar el estado de un servicio (solo admin)

## 🔐 Configuración

### Variables de Entorno Backend

- `CONTRACT_ADDRESS`: Dirección del contrato inteligente desplegado
- `PROVIDER_URL`: URL del provider (Infura, Alchemy, etc.)
- `PRIVATE_KEY`: Clave privada de la wallet del admin (para actualizar estados)
- `PORT`: Puerto del servidor (default: 3000)

### Variables de Entorno Frontend

- `VITE_API_URL`: URL del backend API (default: http://localhost:3000)
- `VITE_CONTRACT_ADDRESS`: Dirección del contrato inteligente
- `VITE_PROVIDER_URL`: URL del provider (opcional, se usa MetaMask por defecto)

## 📝 Notas Importantes

1. **MetaMask**: El frontend requiere MetaMask para firmar transacciones
2. **Red**: Asegúrate de estar conectado a la red correcta (Sepolia, Mainnet, etc.)
3. **Gas**: Las transacciones requieren ETH para pagar gas fees
4. **Admin**: Solo la wallet configurada como admin en el contrato puede actualizar estados

## 🚀 Uso

1. Inicia el backend: `cd backend && npm start`
2. Inicia el frontend: `cd frontend && npm run dev`
3. Abre el navegador en `http://localhost:5173`
4. Conecta tu wallet MetaMask
5. ¡Comienza a usar la aplicación!

## 📦 Dependencias Principales

### Backend
- express
- cors
- dotenv
- ethers

### Frontend
- react
- react-dom
- ethers
- tailwindcss
- vite

