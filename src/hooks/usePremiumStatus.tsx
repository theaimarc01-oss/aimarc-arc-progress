import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePremiumStatus = () => {
  return useQuery({
    queryKey: ['premium-status'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('check-premium-status');
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
