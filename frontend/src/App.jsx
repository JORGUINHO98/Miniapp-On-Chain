import { useState } from 'react';
import RegistroUsuario from './components/RegistroUsuario';
import CrearServicio from './components/CrearServicio';
import ListaServicios from './components/ListaServicios';
import EstadoServicio from './components/EstadoServicio';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUsuarioRegistrado = () => {
    console.log('Usuario registrado');
  };

  const handleServicioCreado = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEstadoActualizado = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full mb-6 shadow-2xl">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
            Registro de Servicios On-Chain
          </h1>
          <p className="text-xl text-purple-200 font-medium">
            Gestiona usuarios y servicios en la blockchain de forma descentralizada
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-sm text-purple-200">🔗 Blockchain</span>
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-sm text-purple-200">⚡ Rápido</span>
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-sm text-purple-200">🔒 Seguro</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <RegistroUsuario onUsuarioRegistrado={handleUsuarioRegistrado} />
          <CrearServicio onServicioCreado={handleServicioCreado} />
        </div>

        <div className="mb-8">
          <EstadoServicio onEstadoActualizado={handleEstadoActualizado} />
        </div>

        <ListaServicios refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}

export default App;
