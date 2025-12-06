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
  IconButton,
  Link,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import {
  loginUser,
  sendOTPForLogin,
  verifyOTPAndLogin,
  sendOTPForRegister,
  verifyOTPAndRegister,
  sendForgotPasswordOTP,
  resetPasswordWithOTP,
} from '../services/backend-service';

const Login = () => {
  const navigate = useNavigate();
  const { login, setUserFromToken } = useAuth();
  const { showNotification } = useNotification();
  const [tab, setTab] = useState(0);
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [step, setStep] = useState('form'); // 'form', 'otp', 'forgot-password', 'reset-password'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    mobileNumber: '',
    otp: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [maskedMobile, setMaskedMobile] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateGmail = (email) => {
    const emailRegex = /^[^\s@]+@gmail\.com$/i;
    return emailRegex.test(email);
  };

  // Email/Password Login
  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email) {
      setError('Please enter your email');
      showNotification('Please enter your email', 'error');
      return;
    }

    if (!formData.password) {
      setError('Please enter your password');
      showNotification('Please enter your password', 'error');
      return;
    }

    if (!validateGmail(formData.email)) {
      setError('Please use a valid Gmail address (e.g., example@gmail.com)');
      showNotification('Please use a valid Gmail address', 'error');
      return;
    }

    setLoading(true);

    try {
      const userData = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem('token', userData.token);
      setUserFromToken(userData);
      showNotification('Login successful!', 'success');
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Invalid email or password';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // OTP Login
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email) {
      setError('Please enter your email');
      showNotification('Please enter your email', 'error');
      return;
    }

    if (!validateGmail(formData.email)) {
      setError('Please use a valid Gmail address (e.g., example@gmail.com)');
      showNotification('Please use a valid Gmail address', 'error');
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
        if (!formData.name || !formData.password || !formData.mobileNumber) {
          setError('Please fill all fields');
          showNotification('Please fill all fields', 'error');
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          showNotification('Password must be at least 6 characters', 'error');
          setLoading(false);
          return;
        }
        // Validate mobile number (10 digits)
        const cleanedMobile = formData.mobileNumber.replace(/\D/g, '');
        if (cleanedMobile.length !== 10) {
          setError('Please enter a valid 10-digit mobile number');
          showNotification('Please enter a valid 10-digit mobile number', 'error');
          setLoading(false);
          return;
        }
        await sendOTPForRegister(formData.email);
        setOtpSent(true);
        setStep('otp');
        showNotification('OTP sent to your email! Check your inbox.', 'success');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to send OTP. Please try again.';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      console.error('OTP send error:', err);
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
        const cleanedMobile = formData.mobileNumber.replace(/\D/g, '');
        const userData = await verifyOTPAndRegister(
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            mobileNumber: cleanedMobile,
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

  // Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email) {
      setError('Please enter your email');
      showNotification('Please enter your email', 'error');
      return;
    }

    if (!validateGmail(formData.email)) {
      setError('Please use a valid Gmail address');
      showNotification('Please use a valid Gmail address', 'error');
      return;
    }

    setLoading(true);

    try {
      const result = await sendForgotPasswordOTP(formData.email);
      setMaskedMobile(result.mobileNumber);
      setStep('reset-password');
      showNotification('OTP sent to your registered mobile number!', 'success');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to send OTP. Please try again.';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.otp || formData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    if (!formData.newPassword) {
      setError('Please enter a new password');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await resetPasswordWithOTP(formData.email, formData.otp, formData.newPassword);
      showNotification('Password reset successfully! Please login with your new password.', 'success');
      setStep('form');
      setLoginMethod('password');
      setFormData({ ...formData, otp: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to reset password. Please try again.';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'reset-password') {
      setStep('forgot-password');
      setFormData({ ...formData, otp: '', newPassword: '', confirmPassword: '' });
    } else {
      setStep('form');
      setOtpSent(false);
      setFormData({ ...formData, otp: '' });
    }
    setError('');
  };

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    setStep('form');
    setLoginMethod('password');
    setOtpSent(false);
    setFormData({ name: '', email: '', password: '', newPassword: '', confirmPassword: '', mobileNumber: '', otp: '' });
    setError('');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const renderLoginForm = () => {
    if (step === 'forgot-password') {
      return (
        <Box component="form" onSubmit={handleForgotPassword}>
          <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
            Enter your email to receive OTP on your registered mobile number
          </Typography>
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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: 'primary.main', py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Send OTP'}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => {
              setStep('form');
              setError('');
            }}
            sx={{ mt: 1 }}
          >
            Back to Login
          </Button>
        </Box>
      );
    }

    if (step === 'reset-password') {
      return (
        <Box component="form" onSubmit={handleResetPassword}>
          <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
            OTP sent to {maskedMobile}
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
          <TextField
            fullWidth
            label="New Password"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            required
            margin="normal"
            helperText="Minimum 6 characters"
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            margin="normal"
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
              {loading ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>
          </Box>
        </Box>
      );
    }

    if (step === 'otp') {
      return (
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
      );
    }

    // Main login form
    if (tab === 0) {
      return (
        <Box component="form" onSubmit={loginMethod === 'password' ? handleEmailPasswordLogin : handleSendOTP}>
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
          {loginMethod === 'password' && (
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              margin="normal"
            />
          )}
          {loginMethod === 'password' && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => {
                  setStep('forgot-password');
                  setError('');
                }}
                sx={{ cursor: 'pointer' }}
              >
                Forgot Password?
              </Link>
            </Box>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: 'primary.main', py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : loginMethod === 'password' ? 'Login' : 'Send OTP'}
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={() => {
                setLoginMethod(loginMethod === 'password' ? 'otp' : 'password');
                setError('');
                setFormData({ ...formData, password: '', otp: '' });
              }}
              sx={{ cursor: 'pointer' }}
            >
              {loginMethod === 'password' ? 'Login with OTP instead' : 'Login with Password instead'}
            </Link>
          </Box>
        </Box>
      );
    } else {
      // Registration form
      return (
        <Box component="form" onSubmit={handleSendOTP}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            margin="normal"
          />
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
          <TextField
            fullWidth
            label="Mobile Number"
            name="mobileNumber"
            type="tel"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
            margin="normal"
            placeholder="1234567890"
            helperText="Enter 10-digit mobile number"
            inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
          />
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
      );
    }
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
      <Box sx={{ mb: 2 }}>
        <IconButton
          onClick={handleGoBack}
          sx={{
            color: 'text.primary',
            '&:hover': {
              bgcolor: 'rgba(108, 43, 217, 0.1)',
            },
          }}
        >
          <ArrowBack />
        </IconButton>
      </Box>
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
          {step === 'forgot-password' ? 'Forgot Password' : 
           step === 'reset-password' ? 'Reset Password' : 
           tab === 0 ? 'Login' : 'Register'}
        </Typography>

        {step !== 'forgot-password' && step !== 'reset-password' && (
          <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {renderLoginForm()}
      </Paper>
    </Container>
  );
};

export default Login;
