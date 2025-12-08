import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Phone } from 'lucide-react';

interface EmergencyContact {
  name: string;
  number: string;
  emoji: string;
  description: string;
}

const emergencyContacts: EmergencyContact[] = [
  {
    name: 'Polícia Militar',
    number: '190',
    emoji: '🚔',
    description: 'Emergências de segurança pública',
  },
  {
    name: 'Corpo de Bombeiros',
    number: '193',
    emoji: '🚒',
    description: 'Afogamentos e resgates',
  },
  {
    name: 'SAMU',
    number: '192',
    emoji: '🚑',
    description: 'Emergências médicas',
  },
];

export const EmergencyButton = () => {
  const [open, setOpen] = useState(false);

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          className="shadow-lg hover:scale-105 transition-transform"
          aria-label="Emergência"
        >
          <span className="text-lg">⚠️</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <span>⚠️</span> Números de Emergência
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {emergencyContacts.map((contact) => (
            <button
              key={contact.number}
              onClick={() => handleCall(contact.number)}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-left"
            >
              <span className="text-3xl">{contact.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{contact.name}</p>
                <p className="text-xs text-muted-foreground">{contact.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="font-bold text-primary text-lg">{contact.number}</span>
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Toque para ligar diretamente
        </p>
      </DialogContent>
    </Dialog>
  );
};
