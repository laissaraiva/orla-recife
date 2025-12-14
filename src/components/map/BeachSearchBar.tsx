import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Beach } from '@/hooks/useBeaches';
import { cn } from '@/lib/utils';

interface BeachSearchBarProps {
  beaches: Beach[];
  onSelectBeach: (beach: Beach) => void;
}

export const BeachSearchBar = ({ beaches, onSelectBeach }: BeachSearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredBeaches = query.trim()
    ? beaches.filter((beach) =>
        beach.name.toLowerCase().includes(query.toLowerCase()) ||
        beach.neighborhood.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (beach: Beach) => {
    onSelectBeach(beach);
    setQuery('');
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-md"
    >
      <div className="relative">
        {/* Search Input */}
        <div className="flex items-center bg-card rounded-full shadow-card px-4 py-3 border border-border/50">
          <Search className="w-5 h-5 text-muted-foreground mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Buscar praia..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
          />
        </div>

        {/* Suggestions Dropdown */}
        {isOpen && filteredBeaches.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden z-30">
            <ul className="py-2 max-h-60 overflow-y-auto">
              {filteredBeaches.map((beach) => (
                <li
                  key={beach.id}
                  onClick={() => handleSelect(beach)}
                  className={cn(
                    'px-4 py-3 cursor-pointer transition-colors',
                    'hover:bg-accent/50'
                  )}
                >
                  <p className="text-sm font-medium text-foreground">{beach.name}</p>
                  <p className="text-xs text-muted-foreground">{beach.neighborhood}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
