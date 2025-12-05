import { Waves } from 'lucide-react';

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-gradient-ocean text-primary-foreground shadow-soft">
      <div className="flex items-center justify-center gap-2 h-14 px-4">
        <Waves className="w-6 h-6 animate-wave" />
        <h1 className="text-xl font-bold tracking-wide">Orla</h1>
      </div>
    </header>
  );
};
