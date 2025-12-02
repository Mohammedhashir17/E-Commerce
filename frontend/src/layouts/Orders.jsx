import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import { Visibility, ShoppingBag, ArrowBack } from '@mui/icons-material';
import ProtectedRoute from '../components/ui/ProtectedRoute';
import { getUserOrders } from '../services/backend-service';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getUserOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (isPaid, isDelivered) => {
    if (isDelivered) return 'success';
    if (isPaid) return 'info';
    return 'warning';
  };

  const getStatusText = (isPaid, isDelivered) => {
    if (isDelivered) return 'Delivered';
    if (isPaid) return 'Processing';
    return 'Pending';
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography>Loading orders...</Typography>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <ProtectedRoute>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <ShoppingBag sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No orders yet
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/products')}
              sx={{ mt: 2, bgcolor: 'primary.main' }}
            >
              Start Shopping
            </Button>
          </Paper>
        </Container>
      </ProtectedRoute>
    );
  }

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
          startIcon={<ArrowBack sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
          onClick={() => navigate(-1)}
          sx={{ 
            mb: { xs: 1.5, sm: 2 }, 
            color: 'primary.main',
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
          My Orders
        </Typography>

        {orders.map((order) => (
          <Paper key={order._id} sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
              <Box>
                <Typography variant="h6">Order #{order._id.slice(-8)}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Chip
                label={getStatusText(order.isPaid, order.isDelivered)}
                color={getStatusColor(order.isPaid, order.isDelivered)}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              {order.orderItems?.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      gap: 2,
                      cursor: 'pointer',
                      '&:hover': { opacity: 0.8 }
                    }}
                    onClick={() => {
                      // Handle both populated (object) and non-populated (string) product references
                      const productId = item.product?._id || item.product || item.productId || item._id;
                      if (productId) {
                        navigate(`/products/${productId}`);
                      }
                    }}
                  >
                    <Box
                      component="img"
                      src={item.image || item.product?.image || '/placeholder.jpg'}
                      alt={item.name || item.product?.name}
                      sx={{ width: 80, height: 80, borderRadius: 1, objectFit: 'cover' }}
                    />
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {item.name || item.product?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>
                      <Typography variant="body2" color="primary.main" fontWeight="bold">
                        ₹{item.price * item.quantity}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Total: ₹{order.totalPrice?.toFixed(2)}
              </Typography>
              {order.orderItems && order.orderItems.length > 0 && (
                <Button
                  variant="outlined"
                  startIcon={<Visibility />}
                  onClick={() => {
                    // Navigate to the first product in the order
                    const firstItem = order.orderItems[0];
                    // Handle both populated (object) and non-populated (string) product references
                    const productId = firstItem.product?._id || firstItem.product || firstItem.productId || firstItem._id;
                    if (productId) {
                      navigate(`/products/${productId}`);
                    }
                  }}
                  sx={{ borderColor: 'primary.main', color: 'primary.main' }}
                >
                  View Details
                </Button>
              )}
            </Box>
          </Paper>
        ))}
      </Container>
    </ProtectedRoute>
  );
};

export default Orders;

