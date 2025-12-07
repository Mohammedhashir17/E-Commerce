import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  Grid,
  Divider,
  TextField,
} from '@mui/material';
import {
  Delete,
  Add,
  Remove,
  ShoppingCart,
  ArrowForward,
  ArrowBack,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import Footer from '../components/ui/Footer';
import {
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../services/backend-service';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      if (user) {
        const data = await getCart();
        setCart(data);
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart({ items: localCart, totalPrice: calculateTotal(localCart) });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      if (user) {
        await updateCartItem(itemId, newQuantity);
        await fetchCart();
        showNotification('Cart updated', 'success');
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = localCart.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        );
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart({ items: updatedCart, totalPrice: calculateTotal(updatedCart) });
        showNotification('Cart updated', 'success');
      }
      // Dispatch custom event to update cart count
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error updating cart:', error);
      showNotification('Error updating cart', 'error');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      if (user) {
        await removeFromCart(itemId);
        await fetchCart();
        showNotification('Item removed from cart', 'info');
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = localCart.filter((item) => item._id !== itemId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart({ items: updatedCart, totalPrice: calculateTotal(updatedCart) });
        showNotification('Item removed from cart', 'info');
      }
      // Dispatch custom event to update cart count
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error removing item:', error);
      showNotification('Error removing item', 'error');
    }
  };

  const handleClearCart = async () => {
    try {
      if (user) {
        await clearCart();
      } else {
        localStorage.setItem('cart', '[]');
      }
      setCart({ items: [], totalPrice: 0 });
      showNotification('Cart cleared', 'info');
      // Dispatch custom event to update cart count
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error clearing cart:', error);
      showNotification('Error clearing cart', 'error');
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography>Loading cart...</Typography>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/products')}
            sx={{ mt: 2, bgcolor: 'primary.main' }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  const shippingPrice = cart.totalPrice > 1000 ? 0 : 50;
  const taxPrice = cart.totalPrice * 0.18;
  const totalPrice = cart.totalPrice + shippingPrice + taxPrice;

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
        Shopping Cart
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} md={8}>
          {cart.items.map((item) => {
            const productId = item.product?._id || item.productId || item._id;
            return (
              <Paper 
                key={item._id || item.product?._id} 
                sx={{ 
                  p: { xs: 1.5, sm: 2 }, 
                  mb: { xs: 1.5, sm: 2 },
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)'
                  }
                }}
                onClick={() => {
                  if (productId) {
                    navigate(`/products/${productId}`);
                  }
                }}
              >
                <Grid container spacing={{ xs: 1.5, sm: 2 }} alignItems="center">
                  <Grid item xs={4} sm={3}>
                    <Box
                      component="img"
                      src={item.product?.image || item.image || '/placeholder.jpg'}
                      alt={item.product?.name || item.name}
                      sx={{ 
                        width: '100%', 
                        borderRadius: 1,
                        aspectRatio: '1/1',
                        objectFit: 'cover'
                      }}
                    />
                  </Grid>
                  <Grid item xs={8} sm={4}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        fontWeight: { xs: 600, sm: 700 },
                        mb: { xs: 0.5, sm: 1 },
                        lineHeight: 1.3
                      }}
                    >
                      {item.product?.name || item.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        fontSize: { xs: '0.7rem', sm: '0.875rem' } 
                      }}
                    >
                      ₹{item.price} each
                    </Typography>
                  </Grid>
                <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'center' } }}>
                  <Box 
                    onClick={(e) => e.stopPropagation()}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: 0.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      width: 'fit-content',
                      mx: 'auto',
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateQuantity(
                          item._id || item.product?._id,
                          (item.quantity || 1) - 1
                        );
                      }}
                      disabled={item.quantity <= 1}
                      sx={{ 
                        borderRadius: '4px 0 0 4px',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <Remove fontSize="small" />
                    </IconButton>
                    <TextField
                      type="number"
                      value={item.quantity || 1}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleUpdateQuantity(
                          item._id || item.product?._id,
                          parseInt(e.target.value) || 1
                        );
                      }}
                      onClick={(e) => e.stopPropagation()}
                      inputProps={{ 
                        min: 1,
                        style: { textAlign: 'center', padding: '8px 4px' }
                      }}
                      sx={{ 
                        width: 60,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                          '& fieldset': { border: 'none' },
                        },
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateQuantity(
                          item._id || item.product?._id,
                          (item.quantity || 1) + 1
                        );
                      }}
                      sx={{ 
                        borderRadius: '0 4px 4px 0',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box 
                    onClick={(e) => e.stopPropagation()}
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      gap: 1,
                      flexDirection: { xs: 'row', sm: 'row' }
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        fontWeight: { xs: 600, sm: 700 }
                      }}
                    >
                      ₹{item.price * (item.quantity || 1)}
                    </Typography>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(item._id || item.product?._id);
                      }}
                    >
                      <Delete sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            );
          })}

          <Button
            variant="outlined"
            color="error"
            onClick={handleClearCart}
            sx={{ mt: 2 }}
          >
            Clear Cart
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: { xs: 2, sm: 3 }, 
            position: { xs: 'static', md: 'sticky' }, 
            top: { md: 20 } 
          }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Subtotal:</Typography>
              <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>₹{cart.totalPrice.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Shipping:</Typography>
              <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>₹{shippingPrice.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Tax:</Typography>
              <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>₹{taxPrice.toFixed(2)}</Typography>
            </Box>
            <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6"
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                Total:
              </Typography>
              <Typography 
                variant="h6" 
                color="primary.main"
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                ₹{totalPrice.toFixed(2)}
              </Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              size="large"
              endIcon={<ArrowForward sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
              onClick={() => navigate('/checkout')}
              disabled={!user}
              sx={{ 
                bgcolor: 'primary.main',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                py: { xs: 1, sm: 1.5 }
              }}
            >
              {user ? 'Proceed to Checkout' : 'Login to Checkout'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
      <Footer />
    </Container>
  );
};

export default Cart;

