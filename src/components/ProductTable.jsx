// Product table component - shows products in a data table format
// Better for viewing lots of products at once with sortable columns
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit } from 'lucide-react';

export function ProductTable({ products, onEdit }) {
  // Format price consistently with the card view
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format dates in a readable way
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="rounded-lg border bg-card overflow-hidden animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold text-right">Price</TableHead>
            <TableHead className="font-semibold text-center">Stock</TableHead>
            <TableHead className="font-semibold text-center">Status</TableHead>
            <TableHead className="font-semibold">Created</TableHead>
            <TableHead className="font-semibold text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow 
              key={product.id} 
              className="hover:bg-muted/30 transition-colors"
            >
              {/* Product name and description */}
              <TableCell>
                <div>
                  <p className="font-medium text-foreground">{product.name}</p>
                  {/* Truncated description for table view */}
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {product.description}
                  </p>
                </div>
              </TableCell>
              
              {/* Category badge */}
              <TableCell>
                <Badge variant="secondary">{product.category}</Badge>
              </TableCell>
              
              {/* Price - right aligned for better scanning */}
              <TableCell className="text-right font-semibold text-primary">
                {formatPrice(product.price)}
              </TableCell>
              
              {/* Stock with warning color for low stock */}
              <TableCell className="text-center">
                <span className={product.stock < 10 ? 'text-destructive font-medium' : ''}>
                  {product.stock}
                </span>
              </TableCell>
              
              {/* Active/Inactive status */}
              <TableCell className="text-center">
                <Badge 
                  variant={product.isActive ? "default" : "outline"}
                  className={product.isActive ? "bg-success text-success-foreground" : ""}
                >
                  {product.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              
              {/* Creation date */}
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(product.createdAt)}
              </TableCell>
              
              {/* Edit action */}
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(product)}
                  className="hover:bg-primary hover:text-primary-foreground"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}