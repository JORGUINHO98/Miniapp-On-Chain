import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { formatearWallet, formatearFecha } from '../utils/helpers';
import { Alert } from './Alert';
import { LoadingSpinner } from './LoadingSpinner';

function ListaServicios({ refreshTrigger }) {
  const [servicios, setServicios] = useState([]);
  const [serviciosFiltrados, setServiciosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [paginaActual, setPaginaActual] = useState(1);
  const [serviciosPorPagina] = useState(6);

  // Estadísticas
  const estadisticas = {
    total: servicios.length,
    pendientes: servicios.filter(s => s.estado === 'Pendiente').length,
    enProceso: servicios.filter(s => s.estado === 'EnProceso').length,
    completados: servicios.filter(s => s.estado === 'Completado').length,
    cancelados: servicios.filter(s => s.estado === 'Cancelado').length,
  };

  const cargarServicios = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/servicios`);
      const data = await response.json();

      if (response.ok) {
        setServicios(data.servicios || []);
        setServiciosFiltrados(data.servicios || []);
      } else {
        // Manejo de error mejorado para mostrar la sugerencia de la API optimizada
        let mensajeError = '❌ Error al cargar servicios: ' + (data.message || data.error);
        if (data.sugerencia) {
          mensajeError += `\n\nSugerencia: ${data.sugerencia}`;
        }
        setError(mensajeError);
      }
    } catch (error) {
      console.error('Error al cargar servicios:', error);
      setError('❌ Error de conexión al cargar servicios: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros y búsqueda
  useEffect(() => {
    let resultados = servicios;

    // Aplicar búsqueda
    if (terminoBusqueda) {
      resultados = resultados.filter(servicio =>
        servicio.descripcion.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        servicio.creador.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        servicio.id.toString().includes(terminoBusqueda)
      );
    }

    // Aplicar filtro por estado
    if (filtroEstado !== 'todos') {
      resultados = resultados.filter(servicio => servicio.estado === filtroEstado);
    }

    setServiciosFiltrados(resultados);
    setPaginaActual(1); // Resetear a primera página cuando cambian los filtros
  }, [servicios, terminoBusqueda, filtroEstado]);

  useEffect(() => {
    cargarServicios();
  }, [refreshTrigger]);

  // Paginación
  const indexUltimoServicio = paginaActual * serviciosPorPagina;
  const indexPrimerServicio = indexUltimoServicio - serviciosPorPagina;
  const serviciosActuales = serviciosFiltrados.slice(indexPrimerServicio, indexUltimoServicio);
  const totalPaginas = Math.ceil(serviciosFiltrados.length / serviciosPorPagina);

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
        <LoadingSpinner mensaje="Cargando servicios..." />
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
      {/* Encabezado con estadísticas */}
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

      {/* Panel de Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-400/30 text-center">
          <p className="text-2xl font-bold text-white">{estadisticas.total}</p>
          <p className="text-blue-200 text-sm">Total</p>
        </div>
        <div className="bg-yellow-500/20 p-4 rounded-xl border border-yellow-400/30 text-center">
          <p className="text-2xl font-bold text-white">{estadisticas.pendientes}</p>
          <p className="text-yellow-200 text-sm">Pendientes</p>
        </div>
        <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-400/30 text-center">
          <p className="text-2xl font-bold text-white">{estadisticas.enProceso}</p>
          <p className="text-blue-200 text-sm">En Proceso</p>
        </div>
        <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30 text-center">
          <p className="text-2xl font-bold text-white">{estadisticas.completados}</p>
          <p className="text-green-200 text-sm">Completados</p>
        </div>
        <div className="bg-red-500/20 p-4 rounded-xl border border-red-400/30 text-center">
          <p className="text-2xl font-bold text-white">{estadisticas.cancelados}</p>
          <p className="text-red-200 text-sm">Cancelados</p>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-purple-200 mb-2">
            🔍 Buscar servicios
          </label>
          <input
            type="text"
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            placeholder="Buscar por descripción, creador o ID..."
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-purple-200 mb-2">
            📊 Filtrar por estado
          </label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
          >
            <option value="todos" className="bg-purple-900">Todos los estados</option>
            <option value="Pendiente" className="bg-purple-900">⏳ Pendiente</option>
            <option value="EnProceso" className="bg-purple-900">⚙️ En Proceso</option>
            <option value="Completado" className="bg-purple-900">✅ Completado</option>
            <option value="Cancelado" className="bg-purple-900">❌ Cancelado</option>
          </select>
        </div>
      </div>

      {error && (
        <Alert 
          tipo="error" 
          mensaje={error} 
          onClose={() => setError('')}
        />
      )}

      {/* Información de resultados */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-purple-200 text-sm">
          Mostrando {serviciosActuales.length} de {serviciosFiltrados.length} servicios
          {terminoBusqueda && ` para "${terminoBusqueda}"`}
          {filtroEstado !== 'todos' && ` en estado "${filtroEstado}"`}
        </p>
        {serviciosFiltrados.length > serviciosPorPagina && (
          <p className="text-purple-200 text-sm">
            Página {paginaActual} de {totalPaginas}
          </p>
        )}
      </div>

      {serviciosFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block p-6 bg-white/10 rounded-full mb-4">
            <svg className="w-16 h-16 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-xl text-purple-200 font-medium">
            {servicios.length === 0 
              ? "No hay servicios registrados aún." 
              : "No se encontraron servicios con los filtros aplicados."}
          </p>
          <p className="text-purple-300 mt-2">
            {servicios.length === 0 
              ? "Crea tu primer servicio para comenzar" 
              : "Intenta con otros términos de búsqueda o filtros."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serviciosActuales.map((servicio) => (
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
                      {formatearWallet(servicio.creador)}
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
                  <span>{formatearFecha(servicio.fechaCreacion)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPaginaActual(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>
              
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(numero => (
                <button
                  key={numero}
                  onClick={() => setPaginaActual(numero)}
                  className={`w-10 h-10 font-bold rounded-xl transition-all duration-300 ${
                    paginaActual === numero
                      ? 'bg-cyan-500 text-white shadow-lg'
                      : 'bg-white/10 text-purple-200 hover:bg-white/20'
                  }`}
                >
                  {numero}
                </button>
              ))}
              
              <button
                onClick={() => setPaginaActual(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className="bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ListaServicios;
