import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface LikesData {
  [beachId: string]: {
    count: number;
    userLiked: boolean;
  };
}

export const useBeachLikes = () => {
  const { user } = useAuth();
  const [likesData, setLikesData] = useState<LikesData>({});
  const [loading, setLoading] = useState(true);

  const fetchLikes = async () => {
    try {
      // Get all likes grouped by beach
      const { data: allLikes, error: likesError } = await supabase
        .from('beach_likes')
        .select('beach_id, user_id');

      if (likesError) throw likesError;

      const newLikesData: LikesData = {};

      allLikes?.forEach((like) => {
        if (!newLikesData[like.beach_id]) {
          newLikesData[like.beach_id] = { count: 0, userLiked: false };
        }
        newLikesData[like.beach_id].count++;
        if (user && like.user_id === user.id) {
          newLikesData[like.beach_id].userLiked = true;
        }
      });

      setLikesData(newLikesData);
    } catch (error) {
      console.error('Error fetching likes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [user]);

  const toggleLike = async (beachId: string) => {
    if (!user) {
      toast.error('Faça login para curtir praias');
      return;
    }

    const currentData = likesData[beachId] || { count: 0, userLiked: false };
    const isCurrentlyLiked = currentData.userLiked;

    // Optimistic update
    setLikesData((prev) => ({
      ...prev,
      [beachId]: {
        count: isCurrentlyLiked ? currentData.count - 1 : currentData.count + 1,
        userLiked: !isCurrentlyLiked,
      },
    }));

    try {
      if (isCurrentlyLiked) {
        const { error } = await supabase
          .from('beach_likes')
          .delete()
          .eq('beach_id', beachId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('beach_likes')
          .insert({ beach_id: beachId, user_id: user.id });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert on error
      setLikesData((prev) => ({
        ...prev,
        [beachId]: currentData,
      }));
      toast.error('Erro ao curtir praia');
    }
  };

  const getLikeData = (beachId: string) => {
    return likesData[beachId] || { count: 0, userLiked: false };
  };

  const likedBeachIds = Object.keys(likesData).filter(
    (beachId) => likesData[beachId].userLiked
  );

  return { getLikeData, toggleLike, loading, refetch: fetchLikes, likedBeachIds };
};
