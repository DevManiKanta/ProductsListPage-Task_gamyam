// Individual product card component - shows product info in a nice card layout
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Edit, Package, Tag } from 'lucide-react';

export function ProductCard({ product, onEdit }) {
  // Format price in Indian Rupees - could easily be made configurable for other currencies
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0, // No decimal places for cleaner look
    }).format(price);
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-card-hover animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Product name with truncation for long names */}
            <h3 className="font-semibold text-foreground truncate text-lg">
              {product.name}
            </h3>
            {/* Category badge */}
            <Badge variant="secondary" className="mt-2">
              {product.category}
            </Badge>
          </div>
          {/* Active/Inactive status - different colors for visual distinction */}
          <Badge 
            variant={product.isActive ? "default" : "outline"}
            className={product.isActive ? "bg-success text-success-foreground" : ""}
          >
            {product.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Description with fallback text and line clamping */}
        <p className="text-muted-foreground text-sm line-clamp-2 min-h-[40px]">
          {product.description || 'No description available'}
        </p>
        
        {/* Price and stock info */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Package className="h-4 w-4" />
            <span className="text-sm font-medium">{product.stock} in stock</span>
          </div>
        </div>

        {/* Tags section - only show if there are tags */}
        {product.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
            {/* Show first 3 tags, then indicate if there are more */}
            {product.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {product.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{product.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        {/* Edit button with hover effect */}
        <Button 
          variant="outline" 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          onClick={() => onEdit(product)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Product
        </Button>
      </CardFooter>
    </Card>
  );
}