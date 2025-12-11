import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'alert' | 'news' | 'weather';
  imageUrl?: string;
  publishedAt: string;
}

interface DbNews {
  id: string;
  title: string;
  summary: string;
  category: string;
  image_url: string | null;
  published_at: string;
}

const mapDbNewsToNews = (dbNews: DbNews): NewsItem => ({
  id: dbNews.id,
  title: dbNews.title,
  summary: dbNews.summary,
  category: dbNews.category as NewsItem['category'],
  imageUrl: dbNews.image_url || undefined,
  publishedAt: dbNews.published_at,
});

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false });

        if (error) throw error;

        setNews((data as DbNews[]).map(mapDbNewsToNews));
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Erro ao carregar notícias');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('news-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'news',
        },
        (payload) => {
          console.log('News updated:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newItem = mapDbNewsToNews(payload.new as DbNews);
            setNews((prev) => [newItem, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedItem = mapDbNewsToNews(payload.new as DbNews);
            setNews((prev) =>
              prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
            );
          } else if (payload.eventType === 'DELETE') {
            setNews((prev) => prev.filter((item) => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { news, loading, error };
};
