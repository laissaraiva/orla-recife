import { useState, useRef, useEffect } from 'react';
import { Search, Loader2, Database, MapPin } from 'lucide-react';
import { UnifiedBeach } from '@/types/beach';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface BeachSearchBarProps {
  searchResults: UnifiedBeach[];
  isSearching: boolean;
  onSearch: (query: string) => void;
  onSelectBeach: (beach: UnifiedBeach) => void;
  onClear: () => void;
}

export const BeachSearchBar = ({
  searchResults,
  isSearching,
  onSearch,
  onSelectBeach,
  onClear,
}: BeachSearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsOpen(true);

    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.trim()) {
      debounceRef.current = setTimeout(() => {
        onSearch(value);
      }, 300);
    } else {
      onClear();
    }
  };

  const handleSelect = (beach: UnifiedBeach) => {
    onSelectBeach(beach);
    setQuery('');
    setIsOpen(false);
    onClear();
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

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const getSourceIcon = (source: UnifiedBeach['source']) => {
    switch (source) {
      case 'supabase':
      case 'enriched':
        return <Database className="w-3 h-3 text-primary" />;
      case 'mapbox':
        return <MapPin className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const getSourceBadge = (source: UnifiedBeach['source']) => {
    if (source === 'supabase' || source === 'enriched') {
      return (
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary">
          Dados CPRH
        </Badge>
      );
    }
    return null;
  };

  const getStatusColor = (status?: UnifiedBeach['status']) => {
    switch (status) {
      case 'safe': return 'bg-status-safe';
      case 'warning': return 'bg-status-warning';
      case 'danger': return 'bg-status-danger';
      default: return 'bg-muted';
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-md"
    >
      <div className="relative">
        {/* Search Input */}
        <div className="flex items-center bg-card rounded-full shadow-card px-4 py-3 border border-border/50">
          {isSearching ? (
            <Loader2 className="w-5 h-5 text-muted-foreground mr-3 shrink-0 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-muted-foreground mr-3 shrink-0" />
          )}
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Buscar praia..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
          />
        </div>

        {/* Suggestions Dropdown */}
        {isOpen && (query.trim() || searchResults.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden z-30">
            {isSearching && searchResults.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Buscando praias...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <ul className="py-2 max-h-72 overflow-y-auto">
                {searchResults.map((beach) => (
                  <li
                    key={beach.id}
                    onClick={() => handleSelect(beach)}
                    className={cn(
                      'px-4 py-3 cursor-pointer transition-colors',
                      'hover:bg-accent/50'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Status indicator */}
                      <div className={cn(
                        'w-3 h-3 rounded-full mt-1.5 shrink-0',
                        getStatusColor(beach.status)
                      )} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-medium text-foreground truncate">
                            {beach.name}
                          </p>
                          {getSourceBadge(beach.source)}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {beach.address || beach.neighborhood}
                        </p>
                      </div>

                      {/* Source icon */}
                      <div className="shrink-0 mt-1">
                        {getSourceIcon(beach.source)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : query.trim() ? (
              <div className="px-4 py-6 text-center">
                <MapPin className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Nenhuma praia encontrada</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
