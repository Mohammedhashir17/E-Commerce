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
        bgcolor: 'var(--layout-chrome-bg)',
        color: 'var(--text-primary)',
        borderTop: '1px solid var(--border-subtle)',
        boxShadow: '0 -14px 30px rgba(0, 0, 0, 0.8)',
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
                sx={{
                  color: 'var(--text-primary)',
                  border: '1px solid transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.08)',
                    borderColor: 'var(--border-subtle)',
                  },
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'var(--text-primary)',
                  border: '1px solid transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.08)',
                    borderColor: 'var(--border-subtle)',
                  },
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'var(--text-primary)',
                  border: '1px solid transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.08)',
                    borderColor: 'var(--border-subtle)',
                  },
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'var(--text-primary)',
                  border: '1px solid transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.08)',
                    borderColor: 'var(--border-subtle)',
                  },
                }}
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
              <Link href="/products?category=Jewellery%20%26%20Accessories" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Jewellery & Accessories
              </Link>
              <Link href="/products?category=Toys%20%26%20Kids%20Products" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Toys & Kids Products
              </Link>
              <Link href="/products?category=Fragrances%20%26%20Perfumes" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Fragrances & Perfumes
              </Link>
              <Link href="/products?category=Home%20Decor%20%26%20Decorative%20Items" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Home Decor & Decorative Items
              </Link>
              <Link href="/products?category=Watches%20%26%20Timewear" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Watches & Timewear
              </Link>
              <Link href="/products?category=Bags%20%26%20Travel%20Accessories" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Bags & Travel Accessories
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
            borderTop: '1px solid var(--border-subtle)',
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

