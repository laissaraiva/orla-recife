import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { beaches, getStatusLabel } from '@/data/mockBeaches';
import { toast } from 'sonner';

export const useBeachNotifications = () => {
  const { user } = useAuth();

  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast.error('Seu navegador não suporta notificações');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Notificações ativadas! Você será avisado sobre mudanças nas praias favoritas.');
        return true;
      }
    }

    toast.error('Permissão de notificação negada');
    return false;
  }, []);

  const sendNotification = useCallback((beachName: string, oldStatus: string, newStatus: string) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(`🌊 ${beachName}`, {
        body: `Status mudou de "${oldStatus}" para "${newStatus}"`,
        icon: '/favicon.ico',
        tag: `beach-${beachName}`,
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }, []);

  // Subscribe to beach status changes (simulated - in production this would be real-time from DB)
  useEffect(() => {
    if (!user) return;

    // Request permission when user is logged in
    requestNotificationPermission();

    // In a real implementation, you would:
    // 1. Subscribe to a beaches table with real-time updates
    // 2. Check if the changed beach is in user's favorites
    // 3. Send notification if status changed
    
    // Example real-time subscription (uncomment when beaches are in DB):
    // const channel = supabase
    //   .channel('beach-status-changes')
    //   .on(
    //     'postgres_changes',
    //     { event: 'UPDATE', schema: 'public', table: 'beaches' },
    //     async (payload) => {
    //       const { data: likes } = await supabase
    //         .from('beach_likes')
    //         .select('beach_id')
    //         .eq('user_id', user.id)
    //         .eq('beach_id', payload.new.id);
    //       
    //       if (likes && likes.length > 0) {
    //         sendNotification(
    //           payload.new.name,
    //           getStatusLabel(payload.old.status),
    //           getStatusLabel(payload.new.status)
    //         );
    //       }
    //     }
    //   )
    //   .subscribe();
    // 
    // return () => {
    //   supabase.removeChannel(channel);
    // };
  }, [user, requestNotificationPermission, sendNotification]);

  // Function to manually trigger notification (for testing)
  const simulateStatusChange = useCallback((beachId: string) => {
    const beach = beaches.find(b => b.id === beachId);
    if (beach) {
      sendNotification(beach.name, 'Atenção', 'Própria para banho');
      toast.info(`Notificação de teste enviada para ${beach.name}`);
    }
  }, [sendNotification]);

  return {
    requestNotificationPermission,
    simulateStatusChange,
    notificationsEnabled: Notification.permission === 'granted',
  };
};
