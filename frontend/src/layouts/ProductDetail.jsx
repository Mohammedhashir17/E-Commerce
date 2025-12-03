import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  IconButton,
  TextField,
  Alert,
  Chip,
  Rating,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  ArrowBack,
  Add,
  Remove,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import Footer from '../components/ui/Footer';
import {
  getProductById,
  addToCart,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from '../services/backend-service';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
    if (user) {
      checkWishlist();
    }
  }, [id, user]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    try {
      const wishlist = await getWishlist();
      setIsWishlisted(wishlist.products.some((p) => p._id === id));
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id);
        setIsWishlisted(false);
        showNotification('Removed from wishlist', 'info');
      } else {
        await addToWishlist(product._id);
        setIsWishlisted(true);
        showNotification('Added to wishlist', 'success');
      }
      // Dispatch custom event to update wishlist count
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      showNotification('Error updating wishlist', 'error');
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(product._id, quantity);
      showNotification(`Added ${quantity} item(s) to cart`, 'success');
      // Dispatch custom event to update cart count
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Error adding to cart', 'error');
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography>Product not found</Typography>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        mt: { xs: 2, sm: 3, md: 4 }, 
        mb: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 }
      }}
    >
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>


      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: { xs: 1, sm: 2 } }}>
            <Box
              component="img"
              src={product.image || '/placeholder.jpg'}
              alt={product.name}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: { xs: 1, sm: 2 },
                objectFit: 'cover',
                maxHeight: { xs: '300px', sm: '400px', md: '500px' }
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{ fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' } }}
          >
            {product.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Rating value={product.rating || 0} readOnly precision={0.5} />
            <Typography variant="body2" color="text.secondary">
              ({product.numReviews || 0} reviews)
            </Typography>
          </Box>
          <Typography 
            variant="h5" 
            color="primary.main" 
            sx={{ 
              mb: { xs: 1.5, sm: 2 }, 
              fontWeight: 'bold',
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
            }}
          >
            ₹{product.price}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            {product.description}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Category: <Chip label={product.categoryName} size="small" />
            </Typography>
            {product.brand && (
              <Typography variant="subtitle2" gutterBottom>
                Brand: {product.brand}
              </Typography>
            )}
            <Typography variant="subtitle2">
              Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 2 }, 
            mb: { xs: 2, sm: 3 }, 
            alignItems: 'center',
            flexWrap: { xs: 'wrap', sm: 'nowrap' }
          }}>
            <Typography 
              variant="subtitle1"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              Quantity:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
              <IconButton
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                size="small"
                sx={{ p: { xs: 0.5, sm: 1 } }}
              >
                <Remove sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
              </IconButton>
              <TextField
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, max: product.stock }}
                sx={{ width: { xs: 60, sm: 80 } }}
                size="small"
              />
              <IconButton
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                size="small"
                sx={{ p: { xs: 0.5, sm: 1 } }}
              >
                <Add sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 2 },
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              sx={{ 
                flex: 1, 
                bgcolor: 'primary.main',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                py: { xs: 1, sm: 1.5 }
              }}
            >
              Add to Cart
            </Button>
            <IconButton
              onClick={handleWishlistToggle}
              sx={{
                border: '2px solid',
                borderColor: 'primary.main',
                color: isWishlisted ? 'error.main' : 'primary.main',
                width: { xs: '100%', sm: 'auto' },
                height: { xs: '48px', sm: 'auto' }
              }}
            >
              {isWishlisted ? (
                <Favorite sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
              ) : (
                <FavoriteBorder sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
              )}
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      <Footer />
    </Container>
  );
};

export default ProductDetail;

