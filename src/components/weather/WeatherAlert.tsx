import { CloudRain, Sun, CloudSun } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const WeatherAlert = () => {
  // Mock weather data
  const weather = {
    condition: 'partly_cloudy',
    temperature: 28,
    rainChance: 40,
    alert: 'Possibilidade de chuvas isoladas no período da tarde.',
  };

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-status-warning" />;
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-ocean-medium" />;
      default:
        return <CloudSun className="w-8 h-8 text-ocean-light" />;
    }
  };

  return (
    <Card className="bg-sand-light border-sand-dark/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="shrink-0">{getWeatherIcon()}</div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-foreground">
                {weather.temperature}°C
              </span>
              <span className="text-sm text-muted-foreground">
                {weather.rainChance}% chance de chuva
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{weather.alert}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
