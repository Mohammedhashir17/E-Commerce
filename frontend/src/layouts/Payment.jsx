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
  Grid,
  Divider,
  Chip,
} from '@mui/material';
import {
  CheckCircle,
  Error as ErrorIcon,
  ArrowBack,
  CreditCard,
  LocalShipping,
} from '@mui/icons-material';
import ProtectedRoute from '../components/ui/ProtectedRoute';
import { useNotification } from '../contexts/NotificationContext';
import { createOrder, createPaymentOrder, verifyPayment } from '../services/backend-service';

// Payment methods can be extended by appending new entries here and mapping them in `handleContinue`.
const paymentOptions = [
  {
    value: 'online',
    title: 'Online Payment',
    description: 'Pay instantly via Razorpay (UPI, cards, netbanking).',
    icon: <CreditCard />,
  },
  {
    value: 'cod',
    title: 'Cash on Delivery',
    description: 'Pay with cash when the package arrives.',
    icon: <LocalShipping />,
  },
];

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const { shippingAddress, pricing } = location.state || {};

  const [order, setOrder] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('online');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending | online-success | cod-success | failed

  useEffect(() => {
    if (!shippingAddress || !pricing) {
      navigate('/checkout', { replace: true });
    }
  }, [shippingAddress, pricing, navigate]);

  useEffect(() => {
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

  const totalPrice = pricing?.totalPrice || 0;

  const getMethodLabel = (method) => (method?.toLowerCase() === 'cod' ? 'Cash on Delivery' : 'Online Payment');

  const createOrderForMethod = async (methodKey) => {
    const targetMethod = methodKey === 'cod' ? 'COD' : 'razorpay';
    if (order && order.paymentMethod?.toLowerCase() === targetMethod.toLowerCase()) {
      return order;
    }
    const createdOrder = await createOrder(shippingAddress, targetMethod);
    setOrder(createdOrder);
    return createdOrder;
  };

  const handleCODPayment = async () => {
    setLoading(true);
    setError('');
    try {
      const createdOrder = await createOrderForMethod('cod');
      setPaymentStatus('cod-success');
      setOrder(createdOrder);
      showNotification('Order placed with Cash on Delivery', 'success');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Unable to place COD order';
      setError(errorMsg);
      setPaymentStatus('failed');
      showNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    setLoading(true);
    setError('');
    try {
      const createdOrder = await createOrderForMethod('online');
      setOrder(createdOrder);

      if (!window.Razorpay) {
        throw new Error('Payment service is not ready. Please try again.');
      }

      const paymentOrder = await createPaymentOrder(totalPrice);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RnDMVX13aHmoPA',
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: 'ZUKA',
        description: `Order #${createdOrder._id}`,
        order_id: paymentOrder.id,
        handler: async (response) => {
          try {
            const verification = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: createdOrder._id,
            });

            if (verification.success) {
              setPaymentStatus('online-success');
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
          name: createdOrder.shippingAddress?.fullName || '',
          email: createdOrder.user?.email || '',
          contact: createdOrder.shippingAddress?.phone || '',
        },
        theme: {
          color: '#6C2BD9',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error initiating payment';
      setError(errorMsg);
      setPaymentStatus('failed');
      showNotification(errorMsg, 'error');
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (selectedMethod === 'cod') {
      handleCODPayment();
    } else {
      handleOnlinePayment();
    }
  };

  const renderSuccessState = (isCOD = false) => (
    <ProtectedRoute>
      <Container
        maxWidth="sm"
        sx={{
          mt: { xs: 4, sm: 6, md: 8 },
          mb: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: { xs: 60, sm: 80 }, color: 'success.main', mb: 2 }} />
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}
          >
            {isCOD ? 'Order Confirmed!' : 'Payment Successful!'}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              color: 'var(--text-muted)',
            }}
          >
            {isCOD
              ? 'Your order has been placed with Cash on Delivery. Please keep the payment ready at delivery.'
              : 'Your order has been placed successfully. We will start preparing it right away.'}
          </Typography>

          {order && (
            <Box
              sx={{
                bgcolor: 'rgba(108, 43, 217, 0.08)',
                borderRadius: 2,
                p: 2,
                mb: { xs: 2, sm: 3 },
                border: '1px solid rgba(108, 43, 217, 0.3)',
              }}
            >
              <Typography variant="subtitle2" sx={{ color: 'var(--text-muted)' }}>
                Order ID
              </Typography>
              <Typography variant="h6" sx={{ color: 'var(--text-primary)' }} gutterBottom>
                #{order._id?.slice(-8)}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'var(--text-muted)' }}>
                Payment Method
              </Typography>
              <Typography variant="body1" sx={{ color: 'var(--text-primary)' }}>
                {isCOD ? 'Cash on Delivery' : 'Online Payment'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'var(--text-muted)' }}>
                Expected delivery within 5-7 business days.
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/orders')}
              sx={{
                bgcolor: 'primary.main',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                py: { xs: 1, sm: 1.5 },
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
                py: { xs: 1, sm: 1.5 },
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Paper>
      </Container>
    </ProtectedRoute>
  );

  if (!shippingAddress || !pricing) {
    return null;
  }

  if (paymentStatus === 'online-success') {
    return renderSuccessState(false);
  }

  if (paymentStatus === 'cod-success') {
    return renderSuccessState(true);
  }

  if (paymentStatus === 'failed') {
    return (
      <ProtectedRoute>
        <Container
          maxWidth="sm"
          sx={{
            mt: { xs: 4, sm: 6, md: 8 },
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, textAlign: 'center' }}>
            <ErrorIcon sx={{ fontSize: { xs: 60, sm: 80 }, color: 'error.main', mb: 2 }} />
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}
            >
              Something went wrong
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                {error}
              </Alert>
            )}
            <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={() => {
                  setPaymentStatus('pending');
                  setError('');
                }}
                sx={{
                  bgcolor: 'primary.main',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  py: { xs: 1, sm: 1.5 },
                }}
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/checkout')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  py: { xs: 1, sm: 1.5 },
                }}
              >
                Back to Checkout
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
        maxWidth="lg"
        sx={{
          mt: { xs: 3, sm: 4, md: 5 },
          mb: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/checkout')}
          sx={{
            mb: { xs: 2, sm: 3 },
            alignSelf: 'flex-start',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            px: 2.5,
            py: 1,
            '&:hover': {
              borderColor: 'var(--accent-purple)',
              backgroundColor: 'var(--bg-surface)',
            },
          }}
        >
          Back to Checkout
        </Button>

        <Typography
          variant="h4"
          gutterBottom
          sx={{
            mb: { xs: 2, sm: 3 },
            color: 'var(--text-primary)',
            fontSize: { xs: '1.35rem', sm: '1.85rem', md: '2.25rem' },
          }}
        >
          Choose Payment Method
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} md={7}>
            <Paper
              sx={{
                p: { xs: 2, sm: 3 },
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--text-primary)' }}>
                Payment Options
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {paymentOptions.map((option) => {
                  const isSelected = selectedMethod === option.value;
                  return (
                    <Box
                      key={option.value}
                      onClick={() => setSelectedMethod(option.value)}
                      sx={{
                        display: 'flex',
                        gap: 2,
                        p: { xs: 2, sm: 2.5 },
                        borderRadius: 2,
                        border: isSelected
                          ? '1px solid var(--accent-purple)'
                          : '1px solid var(--border-subtle)',
                        backgroundColor: 'rgba(13, 13, 22, 0.8)',
                        boxShadow: isSelected ? '0 0 20px rgba(108, 43, 217, 0.25)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isSelected ? 'var(--accent-purple)' : 'var(--text-muted)',
                          flexShrink: 0,
                        }}
                      >
                        {option.icon}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: 'var(--text-primary)' }}>
                          {option.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                          {option.description}
                        </Typography>
                        {isSelected && (
                          <Typography
                            variant="caption"
                            sx={{ color: 'var(--accent-purple)', mt: 0.5, display: 'inline-block' }}
                          >
                            Selected
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleContinue}
                disabled={loading}
                sx={{
                  mt: { xs: 3, sm: 4 },
                  bgcolor: 'primary.main',
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Processing...
                  </>
                ) : selectedMethod === 'cod' ? (
                  'Place COD Order'
                ) : (
                  'Continue to Online Payment'
                )}
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper
              sx={{
                p: { xs: 2, sm: 3 },
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--text-primary)' }}>
                Order Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="var(--text-muted)">Items:</Typography>
                <Typography>₹{pricing.itemsPrice?.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="var(--text-muted)">Shipping:</Typography>
                <Typography>₹{pricing.shippingPrice?.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="var(--text-muted)">Tax:</Typography>
                <Typography>₹{pricing.taxPrice?.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary.main">
                  ₹{totalPrice.toFixed(2)}
                </Typography>
              </Box>

              <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--text-primary)' }}>
                Delivery Address
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                }}
              >
                <Typography variant="body1" fontWeight={600}>
                  {shippingAddress.fullName}
                </Typography>
                <Typography variant="body2" color="var(--text-muted)">
                  {shippingAddress.address}, {shippingAddress.city}
                </Typography>
                <Typography variant="body2" color="var(--text-muted)">
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </Typography>
                <Typography variant="body2" color="var(--text-muted)">
                  Phone: {shippingAddress.phone}
                </Typography>
              </Box>

              {order && (
                <Chip
                  label={`Pending Order #${order._id.slice(-8)}`}
                  sx={{ mt: 2, backgroundColor: 'rgba(108,43,217,0.15)', color: 'var(--text-primary)' }}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ProtectedRoute>
  );
};

export default Payment;
