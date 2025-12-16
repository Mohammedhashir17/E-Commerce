import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import HeroSlider from '../components/ui/HeroSlider';
import CategoryGrid from '../components/ui/CategoryGrid';
import Footer from '../components/ui/Footer';
import { getAllProducts, getAllCategories, getProductsByCategory, getWishlist } from '../services/backend-service';

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProductsByCategory();
    fetchWishlist();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProductsByCategory = async () => {
    try {
      setLoading(true);
      const categoriesData = await getAllCategories();
      const productsByCat = {};

      for (const category of categoriesData) {
        try {
          const products = await getProductsByCategory(category.name);
          // Get only first 4 products per category
          productsByCat[category.name] = products.slice(0, 4);
        } catch (error) {
          console.error(`Error fetching products for ${category.name}:`, error);
          productsByCat[category.name] = [];
        }
      }

      setCategoryProducts(productsByCat);
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
        {/* Hero Slider */}
        <HeroSlider />

        {/* Category Grid */}
        {categories.length > 0 && <CategoryGrid categories={categories} />}

        {/* Products by Category */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography>Loading products...</Typography>
          </Box>
        ) : (
          categories.map((category) => {
            const products = categoryProducts[category.name] || [];
            if (products.length === 0) return null;

            return (
              <Box key={category._id} sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: { xs: 2, sm: 3 },
                  flexDirection: 'row',
                  gap: 1
                }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 'bold',
                      fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                      animation: 'fadeIn 0.5s ease-in',
                      flex: 1,
                      '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'translateY(-10px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                      },
                    }}
                  >
                    {category.name}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
                    sx={{
                      bgcolor: 'var(--border-subtle)',
                      color: 'white',
                      border: '1px solid var(--border-subtle)',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      px: { xs: 1.5, sm: 2 },
                      py: { xs: 0.5, sm: 0.75 },
                      flexShrink: 0,
                      '&:hover': {
                        bgcolor: '#2a2a3e',
                        borderColor: 'var(--accent-purple)',
                        color: 'white',
                        transform: { xs: 'none', sm: 'translateY(-2px)' },
                        boxShadow: '0 4px 12px rgba(108, 43, 217, 0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    View All
                  </Button>
                </Box>
                {/* Mobile: Horizontal Scrollable - 2 products per row */}
                <Box
                  sx={{
                    display: { xs: 'flex', sm: 'none' },
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    gap: 2,
                    pb: 1,
                    scrollSnapType: 'x mandatory',
                    '&::-webkit-scrollbar': {
                      height: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(94, 43, 151, 0.3)',
                      borderRadius: '2px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: 'rgba(94, 43, 151, 0.5)',
                    },
                  }}
                >
                  {products.map((product, index) => (
                    <Box
                      key={product._id}
                      sx={{
                        minWidth: 'calc((100% - 16px) / 2)',
                        width: 'calc((100% - 16px) / 2)',
                        maxWidth: 'calc((100% - 16px) / 2)',
                        flexShrink: 0,
                        scrollSnapAlign: 'start',
                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                        '@keyframes fadeInUp': {
                          from: { 
                            opacity: 0, 
                            transform: 'translateY(20px)' 
                          },
                          to: { 
                            opacity: 1, 
                            transform: 'translateY(0)' 
                          },
                        },
                      }}
                    >
                      <ProductCard 
                        product={product} 
                        isWishlisted={wishlistIds.has(product._id)}
                        onWishlistChange={fetchWishlist}
                      />
                    </Box>
                  ))}
                </Box>

                {/* Desktop: Grid Layout */}
                <Grid 
                  container 
                  spacing={3}
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                  {products.map((product, index) => (
                    <Grid 
                      item 
                      xs={12} 
                      sm={6} 
                      md={3}
                      key={product._id}
                      sx={{
                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                        '@keyframes fadeInUp': {
                          from: { 
                            opacity: 0, 
                            transform: 'translateY(20px)' 
                          },
                          to: { 
                            opacity: 1, 
                            transform: 'translateY(0)' 
                          },
                        },
                      }}
                    >
                      <ProductCard 
                        product={product} 
                        isWishlisted={wishlistIds.has(product._id)}
                        onWishlistChange={fetchWishlist}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            );
          })
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Home;
