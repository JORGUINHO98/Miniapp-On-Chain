import { useState, useEffect } from 'react';
import { API_URL } from '../config';

function ListaServicios({ refreshTrigger }) {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarServicios = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/servicios`);
      const data = await response.json();

      if (response.ok) {
        setServicios(data.servicios || []);
      } else {
        setError('❌ Error al cargar servicios: ' + (data.message || data.error));
      }
    } catch (error) {
      console.error('Error al cargar servicios:', error);
      setError('❌ Error al cargar servicios: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarServicios();
  }, [refreshTrigger]);

  const getEstadoColor = (estado) => {
    const colores = {
      'Pendiente': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
      'EnProceso': 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white',
      'Completado': 'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
      'Cancelado': 'bg-gradient-to-r from-red-400 to-pink-500 text-white',
    };
    return colores[estado] || 'bg-gray-400 text-white';
  };

  const getEstadoIcon = (estado) => {
    const iconos = {
      'Pendiente': '⏳',
      'EnProceso': '⚙️',
      'Completado': '✅',
      'Cancelado': '❌',
    };
    return iconos[estado] || '❓';
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
          <p className="ml-4 text-purple-200 text-lg">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Lista de Servicios
          </h2>
        </div>
        <button
          onClick={cargarServicios}
          className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          🔄 Actualizar
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 text-red-200 border border-red-400/30 rounded-xl backdrop-blur-sm">
          {error}
        </div>
      )}

      {servicios.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block p-6 bg-white/10 rounded-full mb-4">
            <svg className="w-16 h-16 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-xl text-purple-200 font-medium">No hay servicios registrados aún.</p>
          <p className="text-purple-300 mt-2">Crea tu primer servicio para comenzar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {servicios.map((servicio) => (
            <div
              key={servicio.id}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:border-white/40 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                    Servicio #{servicio.id}
                  </h3>
                  <p className="text-xs text-purple-300 font-mono bg-black/20 px-2 py-1 rounded">
                    {servicio.creador}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg ${getEstadoColor(servicio.estado)}`}
                >
                  {getEstadoIcon(servicio.estado)} {servicio.estado}
                </span>
              </div>
              <p className="text-purple-100 mb-4 leading-relaxed">{servicio.descripcion}</p>
              <div className="flex items-center gap-2 text-xs text-purple-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{new Date(servicio.fechaCreacion).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaServicios;
