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
  MenuItem,
  InputAdornment,
  Select,
  FormControl,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import ProtectedRoute from '../components/ui/ProtectedRoute';
import { useNotification } from '../contexts/NotificationContext';
import { getCart, createOrder } from '../services/backend-service';

// Country codes list
const countryCodes = [
  { code: '+1', country: 'US/CA' },
  { code: '+91', country: 'India' },
  { code: '+44', country: 'UK' },
  { code: '+86', country: 'China' },
  { code: '+81', country: 'Japan' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+39', country: 'Italy' },
  { code: '+34', country: 'Spain' },
  { code: '+61', country: 'Australia' },
  { code: '+7', country: 'Russia' },
  { code: '+82', country: 'South Korea' },
  { code: '+55', country: 'Brazil' },
  { code: '+52', country: 'Mexico' },
  { code: '+971', country: 'UAE' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+65', country: 'Singapore' },
  { code: '+60', country: 'Malaysia' },
  { code: '+62', country: 'Indonesia' },
  { code: '+27', country: 'South Africa' },
];

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
    countryCode: '+91', // Default to India
    phone: '',
  });
  const [phoneError, setPhoneError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
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
    const { name, value } = e.target;
    
    // Handle phone number - only allow digits
    if (name === 'phone') {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      // Limit to 15 digits (max phone number length)
      const limitedDigits = digitsOnly.slice(0, 15);
      
      setShippingAddress({
        ...shippingAddress,
        phone: limitedDigits,
      });
      
      // Validate phone number length
      if (limitedDigits.length > 0 && limitedDigits.length < 10) {
        setPhoneError('Phone number must be at least 10 digits');
      } else if (limitedDigits.length > 15) {
        setPhoneError('Phone number cannot exceed 15 digits');
      } else {
        setPhoneError('');
      }
    } else {
      setShippingAddress({
        ...shippingAddress,
        [name]: value,
      });
    }
  };

  const handleCountryCodeChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      countryCode: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPhoneError('');
    setFieldErrors({
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    });

    if (!cart || cart.items.length === 0) {
      setError('Cart is empty');
      return;
    }

    // Validate all required fields
    const errors = {};
    if (!shippingAddress.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    if (!shippingAddress.address.trim()) {
      errors.address = 'Address is required';
    }
    if (!shippingAddress.city.trim()) {
      errors.city = 'City is required';
    }
    if (!shippingAddress.postalCode.trim()) {
      errors.postalCode = 'Postal code is required';
    }
    if (!shippingAddress.country.trim()) {
      errors.country = 'Country is required';
    }
    
    let hasPhoneError = false;
    if (!shippingAddress.phone || shippingAddress.phone.length < 10) {
      setPhoneError('Phone number must be at least 10 digits');
      hasPhoneError = true;
    } else if (shippingAddress.phone.length > 15) {
      setPhoneError('Phone number cannot exceed 15 digits');
      hasPhoneError = true;
    }

    if (Object.keys(errors).length > 0 || hasPhoneError) {
      setFieldErrors(errors);
      return;
    }

    try {
      const shippingPrice = cart.totalPrice > 1000 ? 0 : 50;
      const taxPrice = cart.totalPrice * 0.18;
      const totalPrice = cart.totalPrice + shippingPrice + taxPrice;

      // Combine country code and phone number for storage
      const fullPhoneNumber = `${shippingAddress.countryCode}${shippingAddress.phone}`;
      const orderData = {
        ...shippingAddress,
        phone: fullPhoneNumber,
      };

      const order = await createOrder(orderData, 'razorpay');
      showNotification('Order created successfully', 'success');
      navigate('/payment', { state: { order, totalPrice } });
    } catch (err) {
      // Parse backend validation errors
      const errorMsg = err.response?.data?.message || 'Error creating order';
      const errors = {};
      
      // Check if error message contains field-specific errors
      if (errorMsg.includes('shippingAddress.')) {
        const errorParts = errorMsg.split(',').map(part => part.trim());
        errorParts.forEach(part => {
          if (part.includes('fullName')) {
            errors.fullName = 'Full name is required';
          } else if (part.includes('address')) {
            errors.address = 'Address is required';
          } else if (part.includes('city')) {
            errors.city = 'City is required';
          } else if (part.includes('postalCode')) {
            errors.postalCode = 'Postal code is required';
          } else if (part.includes('country')) {
            errors.country = 'Country is required';
          }
        });
        setFieldErrors(errors);
      } else {
        setError(errorMsg);
      }
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
                      error={!!fieldErrors.fullName}
                      helperText={fieldErrors.fullName}
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
                      error={!!fieldErrors.address}
                      helperText={fieldErrors.address}
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
                      error={!!fieldErrors.city}
                      helperText={fieldErrors.city}
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
                      error={!!fieldErrors.postalCode}
                      helperText={fieldErrors.postalCode}
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
                      error={!!fieldErrors.country}
                      helperText={fieldErrors.country}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      required
                      error={!!phoneError}
                      helperText={phoneError || 'Enter 10-15 digits'}
                      inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        maxLength: 15,
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FormControl variant="standard" sx={{ minWidth: 100 }}>
                              <Select
                                value={shippingAddress.countryCode}
                                onChange={handleCountryCodeChange}
                                sx={{
                                  '& .MuiSelect-select': {
                                    py: 0.5,
                                    px: 1,
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    border: 'none',
                                  },
                                  '&:before': {
                                    borderBottom: 'none',
                                  },
                                  '&:after': {
                                    borderBottom: 'none',
                                  },
                                  '&:hover:not(.Mui-disabled):before': {
                                    borderBottom: 'none',
                                  },
                                }}
                              >
                                {countryCodes.map((country) => (
                                  <MenuItem key={country.code} value={country.code}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <span>{country.code}</span>
                                      <span>{country.country}</span>
                                    </Box>
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </InputAdornment>
                        ),
                      }}
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

