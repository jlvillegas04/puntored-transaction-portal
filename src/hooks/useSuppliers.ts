import { useState, useEffect } from 'react';
import { Supplier } from '@/types';
import { rechargeService } from '@/services/rechargeService';
import { useAuthStore } from '@/store/authStore';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isTokenValid } = useAuthStore();

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);

      const pointOfSale = import.meta.env.VITE_POINT_OF_SALE;
      const response = await rechargeService.findSuppliers(pointOfSale);

      if (response.success && response.data) {
        setSuppliers(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch suppliers');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return { suppliers, loading, error, refetch: fetchSuppliers };
};