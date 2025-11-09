import { useState } from 'react';
import { ethers } from 'ethers';
import { API_URL, CONTRACT_ADDRESS } from '../config';
import contractABI from '../abi.json';
import { formatearWallet, validarEmail } from '../utils/helpers';
import { Alert } from './Alert';
import { LoadingSpinner } from './LoadingSpinner';

function RegistroUsuario({ onUsuarioRegistrado }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
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

    if (!nombre.trim()) {
      mostrarMensaje('⚠️ Por favor ingresa tu nombre', 'warning');
      return false;
    }

    if (!email.trim()) {
      mostrarMensaje('⚠️ Por favor ingresa tu email', 'warning');
      return false;
    }

    if (!validarEmail(email)) {
      mostrarMensaje('⚠️ Por favor ingresa un email válido', 'warning');
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
    mostrarMensaje('⏳ Procesando registro...', 'info');

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.registrarUsuario(nombre, email);
      mostrarMensaje('⏳ Transacción enviada, esperando confirmación...', 'info');
      
      await tx.wait();
      
      mostrarMensaje(`✅ Usuario registrado exitosamente! TX: ${tx.hash.substring(0, 10)}...`, 'success');
      setNombre('');
      setEmail('');
      
      if (onUsuarioRegistrado) {
        onUsuarioRegistrado({ transactionHash: tx.hash });
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      mostrarMensaje('❌ Error: ' + (error.reason || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Registrar Usuario
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
            Nombre Completo
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            minLength="2"
            maxLength="50"
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            placeholder="Ingresa tu nombre completo"
          />
          <p className="text-xs text-purple-300 mt-1">
            {nombre.length}/50 caracteres
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-purple-200 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            placeholder="tu@email.com"
          />
          {email && !validarEmail(email) && (
            <p className="text-xs text-red-300 mt-1">
              ⚠️ Por favor ingresa un email válido
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !wallet}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          {loading ? '⏳ Registrando...' : '✨ Registrar Usuario'}
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

export default RegistroUsuario;