// Configuración de la aplicación
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x9d61A644429216B573348Ba42B213cc884FEa9DE';
export const PROVIDER_URL = import.meta.env.VITE_PROVIDER_URL || '';

// Verificar que la dirección del contrato esté configurada
if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '') {
  console.warn('⚠️ CONTRACT_ADDRESS no está configurada. Por favor, configura VITE_CONTRACT_ADDRESS en el archivo .env');
}
