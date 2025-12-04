import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
} from '@mui/material';
import { Logout, ShoppingBag, ArrowBack } from '@mui/icons-material';
import ProtectedRoute from '../components/ui/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

const Account = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <ProtectedRoute>
      <Container 
        maxWidth="md" 
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
          My Account
        </Typography>

        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1">{user?.name}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{user?.email}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Mobile Number
              </Typography>
              <Typography variant="body1">
                {user?.mobileNumber || 'Not provided'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<ShoppingBag />}
              onClick={() => navigate('/orders')}
              sx={{ borderColor: 'primary.main', color: 'primary.main' }}
            >
              My Orders
            </Button>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{ bgcolor: 'error.main', mt: 2 }}
            >
              Logout
            </Button>
          </Box>
        </Paper>
      </Container>
    </ProtectedRoute>
  );
};

export default Account;

