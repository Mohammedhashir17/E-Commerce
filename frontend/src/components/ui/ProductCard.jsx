import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import { Favorite, FavoriteBorder, ShoppingCart } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { addToWishlist, removeFromWishlist, addToCart } from '../../services/backend-service';

const ProductCard = ({ product, isWishlisted = false, onWishlistChange }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id);
        showNotification('Removed from wishlist', 'info');
      } else {
        await addToWishlist(product._id);
        showNotification('Added to wishlist', 'success');
      }
      if (onWishlistChange) onWishlistChange();
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      showNotification('Error updating wishlist', 'error');
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(product._id, 1);
      showNotification('Added to cart', 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Error adding to cart', 'error');
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        borderRadius: { xs: 2, sm: 3 },
        '&:hover': {
          '@media (min-width: 600px)': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 12px 24px rgba(131, 93, 194, 0.3)',
            '& .product-image': {
              transform: 'scale(1.1)',
            },
          },
        },
      }}
      onClick={() => navigate(`/products/${product._id}`)}
    >
      <Box sx={{ position: 'relative', width: '100%', paddingTop: '75%', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={product.image || '/placeholder.jpg'}
          alt={product.name}
          className="product-image"
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease-in-out',
          }}
        />
        <IconButton
          sx={{
            position: 'absolute',
            top: { xs: 4, sm: 8 },
            right: { xs: 4, sm: 8 },
            bgcolor: 'rgba(255,255,255,0.9)',
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            p: { xs: 0.5, sm: 1 },
            zIndex: 1,
          }}
          onClick={handleWishlistToggle}
        >
          {isWishlisted ? (
            <Favorite color="error" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
          ) : (
            <FavoriteBorder sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
          )}
        </IconButton>
        {product.stock === 0 && (
          <Chip
            label="Out of Stock"
            color="error"
            size="small"
            sx={{ 
              position: 'absolute', 
              top: { xs: 4, sm: 8 }, 
              left: { xs: 4, sm: 8 },
              fontSize: { xs: '0.65rem', sm: '0.75rem' },
              height: { xs: 20, sm: 24 }
            }}
          />
        )}
      </Box>

      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        p: { xs: 1.5, sm: 2 },
        '&:last-child': { pb: { xs: 1.5, sm: 2 } }
      }}>
        <Typography 
          variant="h6" 
          component="h3" 
          gutterBottom 
          sx={{
            fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' },
            fontWeight: { xs: 600, sm: 700 },
            lineHeight: { xs: 1.3, sm: 1.4 },
            mb: { xs: 0.5, sm: 1 },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.name}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: { xs: 1, sm: 1.5 }, 
            flexGrow: 1,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            lineHeight: { xs: 1.4, sm: 1.5 },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: { xs: 2, sm: 3 },
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.description}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mt: 'auto',
          gap: { xs: 1, sm: 2 },
          flexWrap: { xs: 'wrap', sm: 'nowrap' }
        }}>
          <Typography 
            variant="h6" 
            color="primary.main" 
            fontWeight="bold"
            sx={{
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
            }}
          >
            ₹{product.price}
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<ShoppingCart sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} />}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            sx={{ 
              bgcolor: 'primary.main',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1.5, sm: 2 },
              py: { xs: 0.5, sm: 0.75 },
              minWidth: { xs: 'auto', sm: '80px' }
            }}
          >
            Add
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
