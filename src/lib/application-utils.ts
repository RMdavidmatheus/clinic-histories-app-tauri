"use client";

import { Patient } from "@/models/patients/patient-model";
import axios from "axios";
import { create } from "zustand";
import { useEffect, useRef, useState, useCallback } from "react";
import { API_CONFIG, buildApiUrl } from "@/config/api";

type EntityState = {
  entity: string;
  setEntity: (value: string) => void;
};

export const useEntityStore = create<EntityState>((set) => ({
  entity: "",
  setEntity: (value: string) => {
    localStorage.setItem("entity", value);
    set({ entity: value });
  },
}));

// Función para obtener un hash simple de los datos para comparar cambios
export const getDataHash = (data: Patient[]): string => {
  if (!data || data.length === 0) return '';
  
  // Crear un hash basado en IDs y longitud para detectar cambios
  const hashData = {
    length: data.length,
    ids: data.map(patient => patient.id).sort(),
    // Si tienes campos de timestamp, agrégalos aquí para mejor detección
    lastUpdate: data.map(p => p.id).join(',')
  };
  
  return JSON.stringify(hashData);
};

// Función genérica para verificar si hay cambios en los datos
export const hasDataChanged = <T>(oldData: T | null, newData: T | null, compareFunction?: (oldData: T, newData: T) => boolean): boolean => {
  if (!oldData && !newData) return false;
  if (!oldData || !newData) return true;
  
  // Si hay una función de comparación personalizada, usarla
  if (compareFunction) {
    return compareFunction(oldData, newData);
  }
  
  // Para arrays, comparar longitud y contenido
  if (Array.isArray(oldData) && Array.isArray(newData)) {
    if (oldData.length !== newData.length) return true;
    
    // Si son arrays de objetos con ID, usar comparación específica
    if (oldData.length > 0 && typeof oldData[0] === 'object' && oldData[0] !== null && 'id' in oldData[0]) {
      const oldHash = getDataHash(oldData as Patient[]);
      const newHash = getDataHash(newData as Patient[]);
      return oldHash !== newHash;
    }
    
    // Para otros arrays, comparar JSON
    return JSON.stringify(oldData) !== JSON.stringify(newData);
  }
  
  // Para objetos simples, comparar JSON
  return JSON.stringify(oldData) !== JSON.stringify(newData);
};

// Hook personalizado para fetch continuo con performance (GENÉRICO)
export const useContinuousFetch = <T>(
  fetchFunction: () => Promise<T | null>,
  interval: number = 30000, // 30 segundos por defecto
  enabled: boolean = true,
  compareFunction?: (oldData: T, newData: T) => boolean // Función de comparación personalizada
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isPolling, setIsPolling] = useState(enabled); // Estado explícito del polling
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataRef = useRef<T | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  // Usar ref para la función de fetch para evitar re-creaciones
  const fetchFunctionRef = useRef(fetchFunction);
  fetchFunctionRef.current = fetchFunction;

  const fetchData = useCallback(async () => {
    if (!enabled || !mountedRef.current) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Cancelar request anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Crear nuevo controller para este request
      abortControllerRef.current = new AbortController();
      
      const response = await fetchFunctionRef.current();
      
      // Verificar si el componente sigue montado y el request no fue cancelado
      if (!mountedRef.current || abortControllerRef.current.signal.aborted) return;
      
      if (response !== null) {
        // Solo actualizar si hay cambios reales
        const hasChanged = lastDataRef.current === null || 
          hasDataChanged(lastDataRef.current, response, compareFunction);
        
        if (hasChanged || lastDataRef.current === null) {
          setData(response);
          lastDataRef.current = response;
        }
        
        // Resetear contador de reintentos en caso de éxito
        setRetryCount(0);
      }
    } catch (err) {
      if (!mountedRef.current) return;
      
      if (err instanceof Error && err.name !== 'AbortError') {
        const errorMessage = err.message || 'Error desconocido';
        setError(errorMessage);
        
        // Lógica de reintentos (máximo 3 intentos)
        if (retryCount < 3) {
          const delay = 1000 * Math.pow(2, retryCount); // Backoff exponencial
          setTimeout(() => {
            if (mountedRef.current) {
              setRetryCount(prev => prev + 1);
              fetchData();
            }
          }, delay);
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [enabled, retryCount, compareFunction]); // Removido fetchFunction

  // Función para forzar un refresh manual
  const refresh = useCallback(() => {
    setRetryCount(0);
    fetchData();
  }, [fetchData]);

  // Función para pausar/reanudar el polling
  const togglePolling = useCallback(() => {
    if (isPolling) {
      // Si está activo, pausarlo
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPolling(false);
    } else {
      // Si está pausado, iniciarlo
      if (enabled && mountedRef.current) {
        intervalRef.current = setInterval(fetchData, interval);
        setIsPolling(true);
      }
    }
  }, [isPolling, interval, enabled, fetchData]);

  useEffect(() => {
    mountedRef.current = true;
    
    if (enabled) {
      // Fetch inicial
      fetchData();
      
      // Configurar intervalo
      intervalRef.current = setInterval(fetchData, interval);
      setIsPolling(true);
    }
    
    // Cleanup al desmontar
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setIsPolling(false);
    };
  }, [enabled, interval, fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    togglePolling,
    isPolling,
    retryCount
  };
};

export const CalculateAge = (birthDate: string): number => {
  if(!birthDate) return 0;
  
  const today = new Date();
  const birthDateDate = new Date(birthDate);
  let age = today.getFullYear() - birthDateDate.getFullYear();
  const m = today.getMonth() - birthDateDate.getMonth();
  if(m < 0 || (m === 0 && today.getDate() < birthDateDate.getDate())) {
    age--;
  }
  return age;
}

// ============================================
// EJEMPLOS DE USO DEL HOOK GENÉRICO
// ============================================

// Función genérica para fetch de cualquier endpoint
export const createFetchFunction = <T>(endpoint: string) => {
  return async (): Promise<T | null> => {
    try {
      const fullUrl = buildApiUrl(endpoint);
      
      const response = await axios.get<T>(fullUrl, {
        timeout: API_CONFIG.TIMEOUT
      });
      
      if (response.status !== 200) return null;
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return null;
    }
  };
};

// Funcion generica para crear un post
export const createPostFunction = <T>(endpoint: string) => {
  return async (body: T): Promise<T | null> => {
    try {
      const fullUrl = buildApiUrl(endpoint);
      
      const response = await axios.post<T>(fullUrl, body, {
        timeout: API_CONFIG.TIMEOUT
      });
      
      if (response.status !== 201) return null;
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return null;
    }
  };
};