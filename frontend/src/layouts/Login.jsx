import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Tab,
  Tabs,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import {
  sendOTPForLogin,
  verifyOTPAndLogin,
  sendOTPForRegister,
  verifyOTPAndRegister,
} from '../services/backend-service';

const Login = () => {
  const navigate = useNavigate();
  const { login, setUserFromToken } = useAuth();
  const { showNotification } = useNotification();
  const [tab, setTab] = useState(0);
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    otp: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateGmail = (email) => {
    const emailRegex = /^[^\s@]+@gmail\.com$/i;
    return emailRegex.test(email);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email) {
      setError('Please enter your email');
      return;
    }

    if (!validateGmail(formData.email)) {
      setError('Please use a valid Gmail address');
      return;
    }

    setLoading(true);

    try {
      if (tab === 0) {
        // Login
        await sendOTPForLogin(formData.email);
        setOtpSent(true);
        setStep('otp');
        showNotification('OTP sent to your email! Check your inbox.', 'success');
      } else {
        // Register - validate all fields
        if (!formData.name || !formData.password) {
          setError('Please fill all fields');
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        await sendOTPForRegister(formData.email);
        setOtpSent(true);
        setStep('otp');
        showNotification('OTP sent to your email! Check your inbox.', 'success');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to send OTP';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.otp || formData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      if (tab === 0) {
        // Login
        const userData = await verifyOTPAndLogin(formData.email, formData.otp);
        localStorage.setItem('token', userData.token);
        setUserFromToken(userData);
        showNotification('Login successful!', 'success');
        navigate('/');
      } else {
        // Register
        const userData = await verifyOTPAndRegister(
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          },
          formData.otp
        );
        localStorage.setItem('token', userData.token);
        setUserFromToken(userData);
        showNotification('Registration successful!', 'success');
        navigate('/');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid OTP. Please try again.';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('email');
    setOtpSent(false);
    setFormData({ ...formData, otp: '' });
    setError('');
  };

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    setStep('email');
    setOtpSent(false);
    setFormData({ name: '', email: '', password: '', otp: '' });
    setError('');
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        mt: { xs: 4, sm: 6, md: 8 }, 
        mb: { xs: 2, sm: 3, md: 4 },
        px: { xs: 2, sm: 3 }
      }}
    >
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom 
          sx={{ 
            color: 'primary.main', 
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
          }}
        >
          {tab === 0 ? 'Login' : 'Register'}
        </Typography>

        <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}


        {step === 'email' ? (
          <Box component="form" onSubmit={handleSendOTP}>
            {tab === 1 && (
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                margin="normal"
              />
            )}
            <TextField
              fullWidth
              label="Gmail Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              margin="normal"
              placeholder="example@gmail.com"
              helperText="Only Gmail addresses are allowed"
            />
            {tab === 1 && (
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                margin="normal"
                helperText="Minimum 6 characters"
              />
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: 'primary.main', py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Send OTP'}
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleVerifyOTP}>
            <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
              OTP sent to {formData.email}
            </Typography>
            <TextField
              fullWidth
              label="Enter 6-digit OTP"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              required
              margin="normal"
              inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
              placeholder="000000"
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleBack}
                sx={{ borderColor: 'primary.main', color: 'primary.main' }}
              >
                Back
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ bgcolor: 'primary.main', py: 1.5 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
              </Button>
            </Box>
            <Button
              fullWidth
              variant="text"
              onClick={handleSendOTP}
              sx={{ mt: 1 }}
              disabled={loading}
            >
              Resend OTP
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Login;
