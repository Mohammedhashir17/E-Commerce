import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import ProductCard from '../components/ui/ProductCard';
import Footer from '../components/ui/Footer';
import { getAllProducts, getWishlist } from '../services/backend-service';

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    brand: searchParams.get('brand') || '',
    minRating: searchParams.get('minRating') || '',
    inStock: searchParams.get('inStock') === 'true',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const brand = searchParams.get('brand') || '';
    const minRating = searchParams.get('minRating') || '';
    const inStock = searchParams.get('inStock') === 'true';
    
    setFilters({
      search: search,
      category: category,
      minPrice: minPrice,
      maxPrice: maxPrice,
      brand: brand,
      minRating: minRating,
      inStock: inStock,
    });
    fetchWishlist();
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts(filters);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const wishlist = await getWishlist();
      const ids = new Set((wishlist.products || []).map(p => p._id));
      setWishlistIds(ids);
    } catch (error) {
      // User might not be logged in, ignore
    }
  };

  return (
    <>
      <Container 
        maxWidth="xl" 
        sx={{ 
          mt: { xs: 2, sm: 3, md: 4 }, 
          mb: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1, sm: 2, md: 3 }
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => window.history.back()}
          sx={{ mb: 2, color: 'white' }}
        >
          Back
        </Button>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: { xs: 2, sm: 3 }, 
            color: 'primary.main',
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
          }}
        >
          {filters.category ? `${filters.category} Products` : 'All Products'}
        </Typography>

        {/* Products Grid */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography>Loading products...</Typography>
          </Box>
        ) : products.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography>No products found</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <ProductCard 
                  product={product} 
                  isWishlisted={wishlistIds.has(product._id)}
                  onWishlistChange={fetchWishlist}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default ProductListing;
