// Main product management page - this is where all the magic happens
import { useState, useMemo } from 'react';
import { initialProducts } from '@/data/products';
import { useDebounce } from '@/hooks/useDebounce';
import { ProductCard } from '@/components/ProductCard';
import { ProductTable } from '@/components/ProductTable';
import { ProductForm } from '@/components/ProductForm';
import { Pagination } from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import { ViewToggle } from '@/components/ViewToggle';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Package } from 'lucide-react';

// How many products to show per page - found 8 works well for most screen sizes
const ITEMS_PER_PAGE = 8;

const Index = () => {
  // Main state - start with our sample data
  const [products, setProducts] = useState(initialProducts);
  const [view, setView] = useState('grid'); // 'grid' or 'list' view
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = adding new, object = editing existing
  const { toast } = useToast();

  // Debounce the search so we don't filter on every single keystroke
  // 500ms feels about right - responsive but not too eager
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Filter products based on search - only searches product names for now
  // Could easily extend this to search descriptions, categories, etc.
  const filteredProducts = useMemo(() => {
    if (!debouncedSearch.trim()) return products;
    
    const query = debouncedSearch.toLowerCase();
    return products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
  }, [products, debouncedSearch]);

  // Figure out pagination - which products to show on current page
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Reset to first page whenever search changes - otherwise you might end up on page 5 of 2
  useMemo(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Open the form for adding a new product
  const handleAddProduct = () => {
    setEditingProduct(null); // null means we're adding, not editing
    setIsFormOpen(true);
  };

  // Open the form for editing an existing product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  // Handle form submission - works for both adding and editing
  const handleFormSubmit = (data, id) => {
    if (id) {
      // Editing existing product - find it and update it
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, ...data } // Spread the new data over the existing product
            : p
        )
      );
      toast({
        title: 'Product updated',
        description: `"${data.name}" has been updated successfully.`,
      });
    } else {
      // Adding new product - create a new object with a unique ID
      const newProduct = {
        ...data,
        id: Math.max(...products.map((p) => p.id)) + 1, // Simple ID generation
        description: data.description || '', // Handle empty descriptions
        createdAt: new Date().toISOString(),
        isActive: true, // New products are active by default
        tags: [], // No tags for now, but the structure is there
      };
      setProducts((prev) => [newProduct, ...prev]); // Add to the beginning
      toast({
        title: 'Product added',
        description: `"${data.name}" has been added successfully.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header with branding and main action */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo and title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Product Manager</h1>
              </div>
            </div>
            {/* Main call-to-action */}
            <Button onClick={handleAddProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="container py-6">
        {/* Search and view controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <div className="flex items-center gap-4">
            {/* Show count with proper pluralization */}
            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </span>
            <ViewToggle view={view} onViewChange={setView} />
          </div>
        </div>

        {/* Products display - handles empty states nicely */}
        {paginatedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Get started by adding your first product'}
            </p>
            {/* Only show the add button if there's no search - otherwise it's confusing */}
            {!searchQuery && (
              <Button onClick={handleAddProduct}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            )}
          </div>
        ) : view === 'grid' ? (
          // Grid view - responsive columns that look good on all screen sizes
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEditProduct}
              />
            ))}
          </div>
        ) : (
          // Table view - better for lots of data
          <ProductTable
            products={paginatedProducts}
            onEdit={handleEditProduct}
          />
        )}

        {/* Pagination - only show if there are multiple pages */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>

      {/* Modal form for adding/editing products */}
      <ProductForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        product={editingProduct}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default Index;