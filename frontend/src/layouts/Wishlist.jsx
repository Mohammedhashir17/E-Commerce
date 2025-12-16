import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
} from '@mui/material';
import { Favorite, ShoppingBag, ArrowBack } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/ui/ProductCard';
import Footer from '../components/ui/Footer';
import { getWishlist, removeFromWishlist } from '../services/backend-service';

const Wishlist = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      navigate('/login');
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await getWishlist();
      setWishlist(data.products || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistChange = () => {
    fetchWishlist();
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography>Loading wishlist...</Typography>
      </Container>
    );
  }

  if (wishlist.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Favorite sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Button
            variant="contained"
            startIcon={<ShoppingBag />}
            onClick={() => navigate('/products')}
            sx={{ mt: 2, bgcolor: 'primary.main' }}
          >
            Start Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        mt: { xs: 2, sm: 3, md: 4 }, 
        mb: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 }
      }}
    >
        <Button
          startIcon={<ArrowBack sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
          onClick={() => navigate(-1)}
          sx={{ 
            mb: { xs: 1.5, sm: 2 }, 
            color: 'white',
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
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
        My Wishlist
      </Typography>
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
        {wishlist.map((product) => (
          <Box
            key={product._id}
            sx={{
              minWidth: 'calc((100% - 16px) / 2)',
              width: 'calc((100% - 16px) / 2)',
              maxWidth: 'calc((100% - 16px) / 2)',
              flexShrink: 0,
              scrollSnapAlign: 'start',
            }}
          >
            <ProductCard
              product={product}
              isWishlisted={true}
              onWishlistChange={handleWishlistChange}
            />
          </Box>
        ))}
      </Box>

      {/* Desktop: Grid Layout */}
      <Grid 
        container 
        spacing={{ xs: 1.5, sm: 2, md: 3 }}
        sx={{ display: { xs: 'none', sm: 'flex' } }}
      >
        {wishlist.map((product) => (
          <Grid item xs={6} sm={6} md={4} lg={3} key={product._id}>
            <ProductCard
              product={product}
              isWishlisted={true}
              onWishlistChange={handleWishlistChange}
            />
          </Grid>
        ))}
      </Grid>
      <Footer />
    </Container>
  );
};

export default Wishlist;

