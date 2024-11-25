import * as React from 'react';
import { useDebounce } from 'use-debounce';
import useSWR from 'swr';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Profesor } from '../profesores/columns';
import { getfetcher } from '@/api/axios';

interface SearchProps {
  selectedResult?: Profesor;
  onSelectResult: (profesor: Profesor) => void;
}

export function Search({ selectedResult, onSelectResult }: SearchProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSelectResult = (profesor: Profesor) => {
    onSelectResult(profesor);
  };

  return (
    <Command
      shouldFilter={false}
      className="h-auto rounded-lg border border-b-0 shadow-md"
    >
      <CommandInput
        value={searchQuery}
        onValueChange={setSearchQuery}
        placeholder="Buscar profesor..."
      />

      <SearchResults
        query={searchQuery}
        selectedResult={selectedResult}
        onSelectResult={handleSelectResult}
      />
    </Command>
  );
}

interface SearchResultsProps {
  query: string;
  selectedResult: SearchProps['selectedResult'];
  onSelectResult: SearchProps['onSelectResult'];
}

function SearchResults({
  query,
  selectedResult,
  onSelectResult,
}: SearchResultsProps) {
  const [debouncedSearchQuery] = useDebounce(query, 300);

  const shouldFetch = Boolean(debouncedSearchQuery);

  const { data, error, isLoading } = useSWR<Profesor[]>(
    shouldFetch ? `/profesor/search/name?query=${debouncedSearchQuery}` : null,
    getfetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true
    }
  );

  // Early return if no search query
  if (!shouldFetch) {
    return null;
  }

  // Ensure we have a valid array of professors
  const profesores = Array.isArray(data) ? data : [];

  return (
    <CommandList>
      {isLoading && (
        <div className="p-4 text-sm">Buscando...</div>
      )}
      
      {error && (
        <div className="p-4 text-sm text-red-500">
          Ocurrió un error al buscar
        </div>
      )}

      {!error && !isLoading && profesores.length === 0 && (
        <div className="p-4 text-sm">No se encontraron profesores</div>
      )}

      {profesores.map((profesor) => (
        <CommandItem
          key={profesor.id}
          onSelect={() => onSelectResult(profesor)}
          value={profesor.nombre}
        >
          <Check
            className={cn(
              'mr-2 h-4 w-4',
              selectedResult?.id === profesor.id ? 'opacity-100' : 'opacity-0'
            )}
          />
          {profesor.nombre}
        </CommandItem>
      ))}
    </CommandList>
  );
}

export default Search;