import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import ProtectedRoute from '../components/ui/ProtectedRoute';
import { useNotification } from '../contexts/NotificationContext';
import { createPaymentOrder, verifyPayment } from '../services/backend-service';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const { order, totalPrice } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');

  useEffect(() => {
    if (!order) {
      navigate('/checkout');
    }
  }, [order, navigate]);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      console.log('Razorpay script loaded');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!order) return;

    setLoading(true);
    setError('');

    try {
      // Create Razorpay order
      const paymentOrder = await createPaymentOrder(totalPrice);
      
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_key', // Replace with your key
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: 'E-Commerce Store',
        description: `Order #${order._id}`,
        order_id: paymentOrder.id,
        handler: async function (response) {
          try {
            const verification = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            });

            if (verification.success) {
              setPaymentStatus('success');
              showNotification('Payment successful! Order placed.', 'success');
            } else {
              setPaymentStatus('failed');
              setError('Payment verification failed');
              showNotification('Payment verification failed', 'error');
            }
          } catch (err) {
            setPaymentStatus('failed');
            setError('Error verifying payment');
            showNotification('Error verifying payment', 'error');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: order.shippingAddress?.fullName || '',
          email: order.user?.email || '',
          contact: order.shippingAddress?.phone || '',
        },
        theme: {
          color: '#835DC2',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error initiating payment';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      setLoading(false);
    }
  };

  if (!order) {
    return null;
  }

  if (paymentStatus === 'success') {
    return (
      <ProtectedRoute>
        <Container 
          maxWidth="sm" 
          sx={{ 
            mt: { xs: 4, sm: 6, md: 8 }, 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 2, sm: 3 }
          }}
        >
          <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: { xs: 60, sm: 80 }, color: 'success.main', mb: 2 }} />
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}
            >
              Payment Successful!
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Your order has been placed successfully.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={() => navigate('/orders')}
                sx={{ 
                  bgcolor: 'primary.main',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  py: { xs: 1, sm: 1.5 }
                }}
              >
                View Orders
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                sx={{ 
                  borderColor: 'primary.main', 
                  color: 'primary.main',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  py: { xs: 1, sm: 1.5 }
                }}
              >
                Continue Shopping
              </Button>
            </Box>
          </Paper>
        </Container>
      </ProtectedRoute>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <ProtectedRoute>
        <Container 
          maxWidth="sm" 
          sx={{ 
            mt: { xs: 4, sm: 6, md: 8 }, 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 2, sm: 3 }
          }}
        >
          <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, textAlign: 'center' }}>
            <ErrorIcon sx={{ fontSize: { xs: 60, sm: 80 }, color: 'error.main', mb: 2 }} />
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}
            >
              Payment Failed
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                {error}
              </Alert>
            )}
            <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={handlePayment}
                sx={{ 
                  bgcolor: 'primary.main',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  py: { xs: 1, sm: 1.5 }
                }}
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/cart')}
                sx={{ 
                  borderColor: 'primary.main', 
                  color: 'primary.main',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  py: { xs: 1, sm: 1.5 }
                }}
              >
                Back to Cart
              </Button>
            </Box>
          </Paper>
        </Container>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Container 
        maxWidth="sm" 
        sx={{ 
          mt: { xs: 4, sm: 6, md: 8 }, 
          mb: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3 }
        }}
      >
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            align="center" 
            sx={{ 
              color: 'primary.main', 
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
            }}
          >
            Payment
          </Typography>

          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Order Summary
            </Typography>
            <Typography 
              variant="body1"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              Order ID: {order._id}
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mt: { xs: 1.5, sm: 2 }, 
                color: 'primary.main',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
              }}
            >
              Total: ₹{totalPrice?.toFixed(2) || order.totalPrice?.toFixed(2)}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handlePayment}
            disabled={loading}
            sx={{ 
              bgcolor: 'primary.main', 
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Processing...
              </>
            ) : (
              'Pay with Razorpay'
            )}
          </Button>

          <Typography 
            variant="body2" 
            align="center" 
            sx={{ 
              mt: { xs: 1.5, sm: 2 }, 
              color: 'text.secondary',
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            You will be redirected to Razorpay for secure payment
          </Typography>
        </Paper>
      </Container>
    </ProtectedRoute>
  );
};

export default Payment;

