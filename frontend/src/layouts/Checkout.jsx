import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import ProtectedRoute from '../components/ui/ProtectedRoute';
import { useNotification } from '../contexts/NotificationContext';
import { getCart, createOrder } from '../services/backend-service';

const Checkout = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Error loading cart');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!cart || cart.items.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      const shippingPrice = cart.totalPrice > 1000 ? 0 : 50;
      const taxPrice = cart.totalPrice * 0.18;
      const totalPrice = cart.totalPrice + shippingPrice + taxPrice;

      const order = await createOrder(shippingAddress, 'razorpay');
      showNotification('Order created successfully', 'success');
      navigate('/payment', { state: { order, totalPrice } });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error creating order';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">Your cart is empty</Alert>
        <Button onClick={() => navigate('/cart')} sx={{ mt: 2 }}>
          Go to Cart
        </Button>
      </Container>
    );
  }

  const shippingPrice = cart.totalPrice > 1000 ? 0 : 50;
  const taxPrice = cart.totalPrice * 0.18;
  const totalPrice = cart.totalPrice + shippingPrice + taxPrice;

  return (
    <ProtectedRoute>
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
          onClick={() => navigate('/cart')}
          sx={{ mb: 2 }}
        >
          Back to Cart
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
          Checkout
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                Shipping Address
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleInputChange}
                      required
                      multiline
                      rows={3}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Postal Code"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Country"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              {cart.items.map((item) => (
                <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>
                    {item.product?.name || item.name} x {item.quantity}
                  </Typography>
                  <Typography>₹{item.price * item.quantity}</Typography>
                </Box>
              ))}
            </Paper>
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
                <Typography>Subtotal:</Typography>
                <Typography>₹{cart.totalPrice.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping:</Typography>
                <Typography>₹{shippingPrice.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax:</Typography>
                <Typography>₹{taxPrice.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary.main">
                  ₹{totalPrice.toFixed(2)}
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={handleSubmit}
                sx={{ bgcolor: 'primary.main' }}
              >
                Proceed to Payment
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ProtectedRoute>
  );
};

export default Checkout;

