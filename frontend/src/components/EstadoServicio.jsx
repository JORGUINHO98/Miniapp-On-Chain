import { useState } from 'react';
import { API_URL } from '../config';

function EstadoServicio({ onEstadoActualizado }) {
  const [servicioId, setServicioId] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('0');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [servicioInfo, setServicioInfo] = useState(null);

  const estados = [
    { value: '0', label: 'Pendiente', icon: '⏳' },
    { value: '1', label: 'En Proceso', icon: '⚙️' },
    { value: '2', label: 'Completado', icon: '✅' },
    { value: '3', label: 'Cancelado', icon: '❌' },
  ];

  // 🔍 Cargar un servicio específico por ID
  const cargarServicio = async () => {
    if (!servicioId) {
      setMessage('⚠️ Por favor ingresa un ID de servicio');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/servicio/${servicioId}`);
      const data = await response.json();

      if (response.ok) {
        setServicioInfo(data.servicio);
        setMessage('');
      } else {
        setMessage('❌ Error al cargar servicio: ' + (data.message || data.error));
        setServicioInfo(null);
      }
    } catch (error) {
      console.error('Error al cargar servicio:', error);
      setMessage('❌ Error al cargar servicio: ' + error.message);
      setServicioInfo(null);
    }
  };

  // ⚙️ Actualizar el estado del servicio
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!servicioId) {
      setMessage('⚠️ Por favor ingresa un ID de servicio');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/api/actualizar-estado`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: servicioId,
          nuevoEstado: parseInt(nuevoEstado),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Estado actualizado exitosamente!');
        if (onEstadoActualizado) onEstadoActualizado(data);
        cargarServicio();
      } else {
        setMessage('❌ Error: ' + (data.message || data.error));
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      setMessage('❌ Error al actualizar estado: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Colores según estado
  const getEstadoColor = (estado) => {
    const colores = {
      'Pendiente': 'bg-gradient-to-r from-yellow-400 to-orange-500',
      'EnProceso': 'bg-gradient-to-r from-blue-400 to-cyan-500',
      'Completado': 'bg-gradient-to-r from-green-400 to-emerald-500',
      'Cancelado': 'bg-gradient-to-r from-red-400 to-pink-500',
    };
    return colores[estado] || 'bg-gray-400';
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300">
      {/* 🔸 Título */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          Actualizar Estado del Servicio
        </h2>
      </div>

      {/* 🆔 Campo para buscar servicio */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-purple-200 mb-2">
          ID del Servicio
        </label>
        <div className="flex gap-3">
          <input
            type="number"
            value={servicioId}
            onChange={(e) => setServicioId(e.target.value)}
            className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
            placeholder="Ingresa el ID del servicio"
          />
          <button
            onClick={cargarServicio}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🔍 Buscar
          </button>
        </div>
      </div>

      {/* 📋 Información del servicio */}
      {servicioInfo && (
        <div className="mb-6 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl">
          <h3 className="font-bold text-purple-200 mb-4 text-lg">📋 Información del Servicio</h3>
          <div className="space-y-3">
            <p className="text-sm text-purple-100">
              <span className="font-semibold text-purple-200">Descripción:</span> {servicioInfo.descripcion}
            </p>
            <p className="text-sm text-purple-100">
              <span className="font-semibold text-purple-200">Creador:</span>{' '}
              <span className="font-mono text-purple-300 bg-black/20 px-2 py-1 rounded">
                {servicioInfo.creador}
              </span>
            </p>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-purple-200">Estado actual:</span>
              <span
                className={`px-4 py-2 rounded-full text-xs font-bold text-white shadow-lg ${getEstadoColor(servicioInfo.estado)}`}
              >
                {servicioInfo.estado}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 📝 Formulario de actualización */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-purple-200 mb-2">
            Nuevo Estado
          </label>
          <select
            value={nuevoEstado}
            onChange={(e) => setNuevoEstado(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
          >
            {estados.map((estado) => (
              <option key={estado.value} value={estado.value} className="bg-purple-900">
                {estado.icon} {estado.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !servicioId}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          {loading ? '⏳ Actualizando...' : '✨ Actualizar Estado'}
        </button>
      </form>

      {/* 📢 Mensajes */}
      {message && (
        <div
          className={`mt-6 p-4 rounded-xl backdrop-blur-sm border ${
            message.includes('Error') || message.includes('Por favor') || message.includes('❌') || message.includes('⚠️')
              ? 'bg-red-500/20 text-red-200 border-red-400/30'
              : 'bg-green-500/20 text-green-200 border-green-400/30'
          }`}
        >
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}
    </div>
  );
}

export default EstadoServicio;
