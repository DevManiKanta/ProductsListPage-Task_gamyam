// View toggle component - switches between grid and list views
// Nice visual feedback with active states
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ViewToggle({ view, onViewChange }) {
  return (
    <div className="flex items-center border rounded-lg p-1 bg-muted/50">
      {/* Grid view button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('grid')}
        className={cn(
          'h-8 px-3 transition-all',
          view === 'grid' && 'bg-background shadow-sm' // Active state styling
        )}
      >
        <LayoutGrid className="h-4 w-4 mr-1.5" />
        {/* Hide text on small screens to save space */}
        <span className="hidden sm:inline">Grid</span>
      </Button>
      
      {/* List view button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('list')}
        className={cn(
          'h-8 px-3 transition-all',
          view === 'list' && 'bg-background shadow-sm' // Active state styling
        )}
      >
        <List className="h-4 w-4 mr-1.5" />
        {/* Hide text on small screens to save space */}
        <span className="hidden sm:inline">List</span>
      </Button>
    </div>
  );
}