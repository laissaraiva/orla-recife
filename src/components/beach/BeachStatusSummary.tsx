import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { beaches } from '@/data/mockBeaches';

export const BeachStatusSummary = () => {
  const safeCount = beaches.filter((b) => b.status === 'safe').length;
  const warningCount = beaches.filter((b) => b.status === 'warning').length;
  const dangerCount = beaches.filter((b) => b.status === 'danger').length;

  return (
    <Card className="bg-gradient-ocean text-primary-foreground border-0 shadow-soft overflow-hidden">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3">Resumo de Hoje</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-3 rounded-lg bg-white/10 backdrop-blur-sm">
            <CheckCircle className="w-6 h-6 mb-1 text-green-300" />
            <span className="text-2xl font-bold">{safeCount}</span>
            <span className="text-xs opacity-80">Próprias</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-white/10 backdrop-blur-sm">
            <AlertTriangle className="w-6 h-6 mb-1 text-yellow-300" />
            <span className="text-2xl font-bold">{warningCount}</span>
            <span className="text-xs opacity-80">Atenção</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-white/10 backdrop-blur-sm">
            <XCircle className="w-6 h-6 mb-1 text-red-300" />
            <span className="text-2xl font-bold">{dangerCount}</span>
            <span className="text-xs opacity-80">Impróprias</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
