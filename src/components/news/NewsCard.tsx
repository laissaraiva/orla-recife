import { Cloud, Newspaper, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewsItem } from '@/hooks/useNews';
import { cn } from '@/lib/utils';

interface NewsCardProps {
  news: NewsItem;
}

const getCategoryIcon = (category: NewsItem['category']) => {
  switch (category) {
    case 'weather':
      return Cloud;
    case 'alert':
      return AlertCircle;
    default:
      return Newspaper;
  }
};

const getCategoryStyle = (category: NewsItem['category']) => {
  switch (category) {
    case 'weather':
      return 'bg-ocean-light text-white';
    case 'alert':
      return 'bg-status-danger text-white';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
};

const getCategoryLabel = (category: NewsItem['category']) => {
  switch (category) {
    case 'weather':
      return 'Clima';
    case 'alert':
      return 'Alerta';
    default:
      return 'Notícia';
  }
};

export const NewsCard = ({ news }: NewsCardProps) => {
  const Icon = getCategoryIcon(news.category);
  const categoryStyle = getCategoryStyle(news.category);
  const categoryLabel = getCategoryLabel(news.category);

  return (
    <Card className="border-border/50 hover:shadow-soft transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
              categoryStyle
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {categoryLabel}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(news.publishedAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
              {news.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {news.summary}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
