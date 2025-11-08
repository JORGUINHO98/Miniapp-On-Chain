// Formatear wallet address
export const formatearWallet = (wallet) => {
  if (!wallet || wallet.length < 10) return wallet;
  return `${wallet.substring(0, 6)}...${wallet.substring(wallet.length - 4)}`;
};

// Formatear fecha legible
export const formatearFecha = (fechaISO) => {
  return new Date(fechaISO).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Validar email
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validar descripción
export const validarDescripcion = (descripcion) => {
  return descripcion.length >= 10 && descripcion.length <= 500;
};

// Contador de caracteres
export const contadorCaracteres = (texto, max) => {
  return `${texto.length}/${max} caracteres`;
};