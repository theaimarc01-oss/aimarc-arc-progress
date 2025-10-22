import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePremiumStatus = () => {
  return useQuery({
    queryKey: ['premium-status'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { isPremium: false, inFreeTrial: false, tier: 'free' };
      }

      const { data, error } = await supabase.functions.invoke('check-premium-status');
      
      if (error) {
        console.error('Error checking premium status:', error);
        return { isPremium: false, inFreeTrial: false, tier: 'free' };
      }
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1,
  });
};
