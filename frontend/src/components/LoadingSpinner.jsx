export const LoadingSpinner = ({ mensaje = "Cargando..." }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
    <p className="text-purple-200 text-lg">{mensaje}</p>
  </div>
);