import { useState } from 'react';
import { ethers } from 'ethers';
import { API_URL, CONTRACT_ADDRESS } from '../config';
import contractABI from '../abi.json';

function RegistroUsuario({ onUsuarioRegistrado }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [wallet, setWallet] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
        setMessage('✅ Wallet conectada exitosamente');
      } else {
        setMessage('❌ Por favor instala MetaMask');
      }
    } catch (error) {
      console.error('Error al conectar wallet:', error);
      setMessage('❌ Error al conectar wallet: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wallet || !signer) {
      setMessage('⚠️ Por favor conecta tu wallet primero');
      return;
    }

    if (!CONTRACT_ADDRESS) {
      setMessage('❌ Error: Dirección del contrato no configurada');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.registrarUsuario(nombre, email);
      setMessage('⏳ Transacción enviada, esperando confirmación...');
      
      await tx.wait();
      
      setMessage(`✅ Usuario registrado exitosamente! TX: ${tx.hash.substring(0, 10)}...`);
      setNombre('');
      setEmail('');
      
      if (onUsuarioRegistrado) {
        onUsuarioRegistrado({ transactionHash: tx.hash });
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setMessage('❌ Error: ' + (error.reason || error.message));
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
          <p className="text-sm font-mono text-green-300 break-all bg-black/20 p-2 rounded">{wallet}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-purple-200 mb-2">
            Nombre
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            placeholder="Ingresa tu nombre"
          />
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
        <div className={`mt-6 p-4 rounded-xl backdrop-blur-sm border ${
          message.includes('Error') || message.includes('Por favor') || message.includes('❌') || message.includes('⚠️')
            ? 'bg-red-500/20 text-red-200 border-red-400/30'
            : 'bg-green-500/20 text-green-200 border-green-400/30'
        }`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}
    </div>
  );
}

export default RegistroUsuario;
