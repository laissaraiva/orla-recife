import { useEffect, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'safe':
      return 'Própria para banho';
    case 'warning':
      return 'Atenção';
    case 'danger':
      return 'Imprópria para banho';
    default:
      return status;
  }
};

export const useBeachNotifications = () => {
  const { user } = useAuth();
  const [likedBeachIds, setLikedBeachIds] = useState<string[]>([]);

  // Fetch user's liked beaches
  useEffect(() => {
    if (!user) {
      setLikedBeachIds([]);
      return;
    }

    const fetchLikedBeaches = async () => {
      const { data } = await supabase
        .from('beach_likes')
        .select('beach_id')
        .eq('user_id', user.id);
      
      if (data) {
        setLikedBeachIds(data.map(like => like.beach_id));
      }
    };

    fetchLikedBeaches();
  }, [user]);

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
        body: `Status mudou de "${getStatusLabel(oldStatus)}" para "${getStatusLabel(newStatus)}"`,
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

  // Subscribe to beach status notification changes
  useEffect(() => {
    if (!user) return;

    // Request permission when user is logged in
    requestNotificationPermission();

    // Subscribe to beach_status_notifications table
    const channel = supabase
      .channel('beach-notifications')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'beach_status_notifications' 
        },
        async (payload) => {
          console.log('Status notification received:', payload);
          
          const notification = payload.new as {
            beach_id: string;
            old_status: string;
            new_status: string;
          };

          // Check if user liked this beach
          if (likedBeachIds.includes(notification.beach_id)) {
            // Get beach name
            const { data: beach } = await supabase
              .from('beaches')
              .select('name')
              .eq('id', notification.beach_id)
              .maybeSingle();

            if (beach) {
              sendNotification(
                beach.name,
                notification.old_status,
                notification.new_status
              );
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, likedBeachIds, requestNotificationPermission, sendNotification]);

  // Function to manually trigger notification (for testing)
  const simulateStatusChange = useCallback(async (beachId: string) => {
    const { data: beach } = await supabase
      .from('beaches')
      .select('name')
      .eq('id', beachId)
      .maybeSingle();
      
    if (beach) {
      sendNotification(beach.name, 'warning', 'safe');
      toast.info(`Notificação de teste enviada para ${beach.name}`);
    }
  }, [sendNotification]);

  return {
    requestNotificationPermission,
    simulateStatusChange,
    notificationsEnabled: Notification.permission === 'granted',
  };
};
