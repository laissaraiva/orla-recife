import { AppLayout } from '@/components/layout/AppLayout';
import { BeachStatusSummary } from '@/components/beach/BeachStatusSummary';
import { WeatherAlert } from '@/components/weather/WeatherAlert';
import { NewsCard } from '@/components/news/NewsCard';
import { BeachCard } from '@/components/beach/BeachCard';
import { useBeaches } from '@/hooks/useBeaches';
import { useBeachLikes } from '@/hooks/useBeachLikes';
import { useNews } from '@/hooks/useNews';
import { useNavigate } from 'react-router-dom';
import { Star, Loader2 } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { beaches } = useBeaches();
  const { likedBeachIds } = useBeachLikes();
  const { news, loading: newsLoading } = useNews();
  
  // Get user's liked beaches
  const favoriteBeaches = beaches.filter((b) => likedBeachIds.includes(b.id));

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        {/* Status Summary */}
        <BeachStatusSummary />

        {/* Weather Alert */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            Previsão do Tempo
          </h2>
          <WeatherAlert />
        </section>

        {/* Favorite Beaches */}
        {favoriteBeaches.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-status-warning fill-status-warning" />
              <h2 className="text-lg font-semibold text-foreground">
                Suas Praias Favoritas
              </h2>
            </div>
            <div className="space-y-3">
              {favoriteBeaches.map((beach) => (
                <BeachCard
                  key={beach.id}
                  beach={beach}
                  isFavorite
                  compact
                  onClick={() => navigate(`/mapa?beach=${beach.id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* News Section */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            Notícias e Alertas
          </h2>
          <div className="space-y-3">
            {newsLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : news.length > 0 ? (
              news.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))
            ) : (
              <p className="text-muted-foreground text-sm">Nenhuma notícia disponível.</p>
            )}
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Home;
