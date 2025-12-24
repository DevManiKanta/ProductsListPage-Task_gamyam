// Search bar component with clear functionality
// Simple but effective - includes a clear button when there's text
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SearchBar({ value, onChange }) {
  return (
    <div className="relative flex-1 max-w-md">
      {/* Search icon on the left */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      
      {/* Main search input */}
      <Input
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10" // Extra padding for the icons
      />
      
      {/* Clear button - only show when there's text to clear */}
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={() => onChange('')}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}