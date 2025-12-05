import { MapPin, Clock, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Beach, getStatusLabel, getStatusColor } from '@/data/mockBeaches';
import { cn } from '@/lib/utils';

interface BeachCardProps {
  beach: Beach;
  isFavorite?: boolean;
  onToggleFavorite?: (beachId: string) => void;
  onClick?: () => void;
  compact?: boolean;
}

export const BeachCard = ({
  beach,
  isFavorite = false,
  onToggleFavorite,
  onClick,
  compact = false,
}: BeachCardProps) => {
  const statusColor = getStatusColor(beach.status);
  const statusLabel = getStatusLabel(beach.status);

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-soft border-border/50',
        compact ? 'p-3' : ''
      )}
      onClick={onClick}
    >
      <CardContent className={cn('p-4', compact && 'p-0')}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge
                className={cn(
                  'text-xs font-medium text-white border-0',
                  statusColor
                )}
              >
                {statusLabel}
              </Badge>
            </div>
            <h3 className="font-semibold text-foreground truncate">
              {beach.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="w-3 h-3" />
              <span>{beach.neighborhood}</span>
            </div>
            {!compact && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <Clock className="w-3 h-3" />
                <span>
                  Atualizado:{' '}
                  {new Date(beach.lastUpdate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
          </div>
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(beach.id);
              }}
            >
              <Star
                className={cn(
                  'w-5 h-5 transition-colors',
                  isFavorite
                    ? 'fill-status-warning text-status-warning'
                    : 'text-muted-foreground'
                )}
              />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
