export const Alert = ({ tipo, mensaje, onClose }) => {
  const config = {
    success: { bg: 'bg-green-500/20', border: 'border-green-400/30', text: 'text-green-200', icon: '✅' },
    error: { bg: 'bg-red-500/20', border: 'border-red-400/30', text: 'text-red-200', icon: '❌' },
    warning: { bg: 'bg-yellow-500/20', border: 'border-yellow-400/30', text: 'text-yellow-200', icon: '⚠️' },
    info: { bg: 'bg-blue-500/20', border: 'border-blue-400/30', text: 'text-blue-200', icon: 'ℹ️' }
  };

  const { bg, border, text, icon } = config[tipo] || config.info;

  return (
    <div className={`${bg} ${border} ${text} p-4 rounded-xl backdrop-blur-sm mb-4 flex justify-between items-center animate-fade-in`}>
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <p className="font-medium">{mensaje}</p>
      </div>
      {onClose && (
        <button 
          onClick={onClose} 
          className="text-lg hover:opacity-70 transition-opacity"
          aria-label="Cerrar alerta"
        >
          ×
        </button>
      )}
    </div>
  );
};