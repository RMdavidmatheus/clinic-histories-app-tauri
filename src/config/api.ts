// Configuración de la API
export const API_CONFIG = {
  // URL base de la API
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  
  // Timeout para las peticiones (en milisegundos)
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  
  // Intervalo de polling por defecto (en milisegundos)
  DEFAULT_POLLING_INTERVAL: parseInt(process.env.NEXT_PUBLIC_POLLING_INTERVAL || '20000'),
  
  // Endpoints
  ENDPOINTS: {
    PATIENTS: '/patients',
    CLINICAL_HISTORIES: '/clinic-histories',
  }
} as const;

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Validar configuración al inicializar
if (typeof window !== 'undefined') {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.warn('⚠️ NEXT_PUBLIC_API_URL no está definida en las variables de entorno');
  }
}
