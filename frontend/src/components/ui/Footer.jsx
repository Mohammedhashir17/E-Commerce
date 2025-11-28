import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: { xs: 3, sm: 4, md: 6 },
        mt: { xs: 4, sm: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Grid container spacing={{ xs: 3, sm: 4, md: 4 }}>
          {/* About Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography 
              variant="h6" 
              gutterBottom 
              fontWeight="bold"
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              E-Commerce
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: { xs: 1.5, sm: 2 }, 
                opacity: 0.9,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              Your one-stop shop for all your needs. Quality products at great prices.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <IconButton
                size="small"
                sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Home
              </Link>
              <Link href="/products" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Products
              </Link>
              <Link href="/cart" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Cart
              </Link>
              <Link href="/wishlist" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Wishlist
              </Link>
              <Link href="/orders" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                My Orders
              </Link>
            </Box>
          </Grid>

          {/* Categories */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/products?category=Electronics" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Electronics
              </Link>
              <Link href="/products?category=Fashion & Clothing" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Fashion & Clothing
              </Link>
              <Link href="/products?category=Home & Furniture" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Home & Furniture
              </Link>
              <Link href="/products?category=Beauty & Personal Care" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Beauty & Personal Care
              </Link>
              <Link href="/products?category=Gaming" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Gaming
              </Link>
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: { xs: 18, sm: 20 } }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.9,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  support@ecommerce.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: { xs: 18, sm: 20 } }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.9,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  +1 234 567 8900
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <LocationOn sx={{ fontSize: { xs: 18, sm: 20 }, mt: 0.5 }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.9,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  123 Commerce Street, City, State 12345
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            mt: { xs: 3, sm: 4 },
            pt: { xs: 2, sm: 3 },
            textAlign: 'center',
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              opacity: 0.8,
              fontSize: { xs: '0.7rem', sm: '0.875rem' }
            }}
          >
            © {new Date().getFullYear()} E-Commerce. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

