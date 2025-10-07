import { useState, useEffect } from 'react';
import { Supplier } from '@/types';
import { rechargeService } from '@/services/rechargeService';
import { useAuthStore } from '@/store/authStore';
import { storageService } from '@/services/storageService';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingCache, setUsingCache] = useState(false);
  const { isTokenValid } = useAuthStore();

  const fetchSuppliers = async () => {
   
    const cachedSuppliers = storageService.getSuppliers();
    if (cachedSuppliers && cachedSuppliers.length > 0) {
      setSuppliers(cachedSuppliers);
      setUsingCache(true);
      // Still try to fetch fresh data, but don't block on it
      setLoading(false);
    }
    
    try {
      setError(null);

      const pointOfSale = import.meta.env.VITE_POINT_OF_SALE;
      const response = await rechargeService.findSuppliers(pointOfSale);

      if (response.success && response.data) {
        setSuppliers(response.data);
        storageService.setSuppliers(response.data); // Cache the fresh data
        setUsingCache(false);
      } else {
        throw new Error(response.message || 'Failed to fetch suppliers');
      }
    } catch (err: any) {
      if (cachedSuppliers && cachedSuppliers.length > 0) {
        setSuppliers(cachedSuppliers);
        setUsingCache(true);
        setError(null);
      } else {
        setError(err.message || 'No se pudieron cargar los proveedores. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return { suppliers, loading, error, refetch: fetchSuppliers, usingCache };
};