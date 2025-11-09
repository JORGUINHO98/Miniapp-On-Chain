import { useState } from 'react';
import { ethers } from 'ethers';
import { API_URL, CONTRACT_ADDRESS } from '../config';
import contractABI from '../abi.json';
import { formatearWallet, validarDescripcion, contadorCaracteres } from '../utils/helpers';
import { Alert } from './Alert';
import { LoadingSpinner } from './LoadingSpinner';

function CrearServicio({ onServicioCreado }) {
  const [descripcion, setDescripcion] = useState('');
  const [wallet, setWallet] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const mostrarMensaje = (mensaje, tipo = 'info') => {
    setMessage(mensaje);
    setMessageType(tipo);
  };

  const conectarWallet = async () => {
    try {
      if (window.ethereum) {
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        await ethProvider.send('eth_requestAccounts', []);
        const ethSigner = await ethProvider.getSigner();
        const address = await ethSigner.getAddress();
        setWallet(address);
        setProvider(ethProvider);
        setSigner(ethSigner);
        mostrarMensaje('✅ Wallet conectada exitosamente', 'success');
      } else {
        mostrarMensaje('❌ Por favor instala MetaMask', 'error');
      }
    } catch (error) {
      console.error('Error al conectar wallet:', error);
      mostrarMensaje('❌ Error al conectar wallet: ' + error.message, 'error');
    }
  };

  const validarFormulario = () => {
    if (!wallet || !signer) {
      mostrarMensaje('⚠️ Por favor conecta tu wallet primero', 'warning');
      return false;
    }

    if (!descripcion.trim()) {
      mostrarMensaje('⚠️ Por favor ingresa una descripción', 'warning');
      return false;
    }

    if (!validarDescripcion(descripcion)) {
      mostrarMensaje('⚠️ La descripción debe tener entre 10 y 500 caracteres', 'warning');
      return false;
    }

    if (!CONTRACT_ADDRESS) {
      mostrarMensaje('❌ Error: Dirección del contrato no configurada', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    setLoading(true);
    mostrarMensaje('⏳ Creando servicio...', 'info');

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.crearServicio(descripcion);
      mostrarMensaje('⏳ Transacción enviada, esperando confirmación...', 'info');
      
      const receipt = await tx.wait();
      
      let servicioId = null;
      if (receipt.logs) {
        const evento = receipt.logs.find(log => {
          try {
            const parsed = contract.interface.parseLog(log);
            return parsed && parsed.name === 'ServicioCreado';
          } catch {
            return false;
          }
        });
        
        if (evento) {
          const parsed = contract.interface.parseLog(evento);
          servicioId = parsed.args.id.toString();
        }
      }
      
      mostrarMensaje(
        `✅ Servicio creado exitosamente! ${servicioId ? `ID: ${servicioId}` : ''} TX: ${tx.hash.substring(0, 10)}...`, 
        'success'
      );
      setDescripcion('');
      
      if (onServicioCreado) {
        onServicioCreado({ transactionHash: tx.hash, servicioId });
      }
    } catch (error) {
      console.error('Error al crear servicio:', error);
      mostrarMensaje('❌ Error: ' + (error.reason || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const descripcionValida = validarDescripcion(descripcion);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Crear Servicio
        </h2>
      </div>
      
      {!wallet && (
        <button
          onClick={conectarWallet}
          className="w-full mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          🔗 Conectar Wallet
        </button>
      )}

      {wallet && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-400/20 to-emerald-400/20 backdrop-blur-sm border border-green-400/30 rounded-xl">
          <p className="text-sm text-green-200 font-medium mb-1">✅ Wallet conectada:</p>
          <p className="text-sm font-mono text-green-300 break-all bg-black/20 p-2 rounded">
            {formatearWallet(wallet)}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-purple-200 mb-2">
            Descripción del Servicio
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            minLength="10"
            maxLength="500"
            rows={4}
            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none ${
              descripcion && !descripcionValida 
                ? 'border-red-400/50' 
                : 'border-white/20'
            }`}
            placeholder="Describe detalladamente el servicio que deseas crear (mínimo 10 caracteres)..."
          />
          <div className={`text-xs mt-1 ${
            descripcion && !descripcionValida ? 'text-red-300' : 'text-purple-300'
          }`}>
            {contadorCaracteres(descripcion, 500)}
            {descripcion && !descripcionValida && (
              <span className="block">⚠️ Mínimo 10 caracteres requeridos</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !wallet || !descripcionValida}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          {loading ? '⏳ Creando...' : '✨ Crear Servicio'}
        </button>
      </form>

      {message && (
        <Alert 
          tipo={messageType} 
          mensaje={message} 
          onClose={() => setMessage('')}
        />
      )}
    </div>
  );
}

export default CrearServicio;