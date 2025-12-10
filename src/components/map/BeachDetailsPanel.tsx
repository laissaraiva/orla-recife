import { Beach, getStatusLabel, getStatusColor, getSharkRiskLabel, getSharkRiskColor } from '@/hooks/useBeaches';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Waves, Thermometer, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BeachDetailsPanelProps {
  beach: Beach;
  distance?: number;
  likeCount: number;
  userLiked: boolean;
  onToggleLike: (id: string) => void;
  onClose: () => void;
}

export const BeachDetailsPanel = ({
  beach,
  distance,
  likeCount,
  userLiked,
  onToggleLike,
  onClose,
}: BeachDetailsPanelProps) => {
  return (
    <div className="bg-card border-t border-border p-4 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge
              className={cn(
                'text-xs font-medium text-white border-0',
                getStatusColor(beach.status)
              )}
            >
              {getStatusLabel(beach.status)}
            </Badge>
            {distance && (
              <span className="text-xs text-muted-foreground">
                {distance.toFixed(1)} km
              </span>
            )}
          </div>
          <h3 className="font-semibold text-lg text-foreground">{beach.name}</h3>
          <p className="text-sm text-muted-foreground">{beach.neighborhood}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleLike(beach.id)}
            className="shrink-0 flex items-center gap-1 px-2"
          >
            <Heart
              className={cn(
                'w-5 h-5 transition-all',
                userLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-muted-foreground hover:text-red-400'
              )}
            />
            <span className={cn(
              'text-sm font-medium',
              userLiked ? 'text-red-500' : 'text-muted-foreground'
            )}>
              {likeCount}
            </span>
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* CPRH Data */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="bg-muted rounded-lg p-3 text-center">
          <Waves className="w-4 h-4 mx-auto mb-1 text-primary" />
          <p className="text-xs text-muted-foreground">Ondas</p>
          <p className="font-semibold text-foreground">{beach.waveHeight}m</p>
        </div>
        <div className="bg-muted rounded-lg p-3 text-center">
          <AlertTriangle className={cn('w-4 h-4 mx-auto mb-1', getSharkRiskColor(beach.sharkRisk))} />
          <p className="text-xs text-muted-foreground">Tubarões</p>
          <p className={cn('font-semibold', getSharkRiskColor(beach.sharkRisk))}>
            {getSharkRiskLabel(beach.sharkRisk)}
          </p>
        </div>
        <div className="bg-muted rounded-lg p-3 text-center">
          <Thermometer className="w-4 h-4 mx-auto mb-1 text-orange-500" />
          <p className="text-xs text-muted-foreground">Água</p>
          <p className="font-semibold text-foreground">{beach.waterTemperature}°C</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{beach.description}</p>
      
      <p className="text-xs text-muted-foreground mt-2">
        Fonte: CPRH • Atualizado: {new Date(beach.lastUpdate).toLocaleDateString('pt-BR')}
      </p>
    </div>
  );
};
