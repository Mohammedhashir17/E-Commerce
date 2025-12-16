import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import {
  Facebook,
  Instagram,
  Email,
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
        <Grid container spacing={{ xs: 2, sm: 4, md: 4 }}>
          {/* Left Side - Mobile: ZUKA, Social Media, Quick Links */}
          <Grid item xs={6} sm={3} md={3}>
            {/* About Section */}
            <Box sx={{ mb: { xs: 2, sm: 0 } }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                fontWeight="bold"
                sx={{ fontSize: { xs: '0.875rem', sm: '1.25rem' } }}
              >
                ZUKA
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: { xs: 1.5, sm: 2 }, 
                  opacity: 0.9,
                  fontSize: { xs: '0.7rem', sm: '0.875rem' }
                }}
              >
                Your one-stop shop for all your needs. Quality products at great prices.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <IconButton
                  size="small"
                  component="a"
                  href="https://www.facebook.com/share/1CrVLYiPAq/"
                  target="_blank"
                  rel="noopener noreferrer"
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
                  component="a"
                  href="https://www.instagram.com/zuka_store1?igsh=cGtidWxiMzN3MDVv"
                  target="_blank"
                  rel="noopener noreferrer"
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
              </Box>
            </Box>

            {/* Quick Links - Mobile only in left column */}
            <Box sx={{ mt: { xs: 2, sm: 0 }, display: { xs: 'block', sm: 'none', md: 'none' } }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ fontSize: '0.875rem' }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link href="/" color="inherit" underline="hover" sx={{ fontSize: '0.7rem' }}>
                  Home
                </Link>
                <Link href="/products" color="inherit" underline="hover" sx={{ fontSize: '0.7rem' }}>
                  Products
                </Link>
                <Link href="/cart" color="inherit" underline="hover" sx={{ fontSize: '0.7rem' }}>
                  Cart
                </Link>
                <Link href="/wishlist" color="inherit" underline="hover" sx={{ fontSize: '0.7rem' }}>
                  Wishlist
                </Link>
                <Link href="/orders" color="inherit" underline="hover" sx={{ fontSize: '0.7rem' }}>
                  My Orders
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Mobile: Categories and Contact Us */}
          <Grid item xs={6} sm={3} md={3}>
            {/* Categories */}
            <Box sx={{ mb: { xs: 2, sm: 0 } }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Categories
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Link href="/products?category=Jewellery%20%26%20Accessories" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.8rem' } }}>
                  Jewellery & Accessories
                </Link>
                <Link href="/products?category=Toys%20%26%20Kids%20Products" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.8rem' } }}>
                  Toys & Kids Products
                </Link>
                <Link href="/products?category=Fragrances%20%26%20Perfumes" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.8rem' } }}>
                  Fragrances & Perfumes
                </Link>
                <Link href="/products?category=Home%20Decor%20%26%20Decorative%20Items" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.8rem' } }}>
                  Home Decor & Decorative Items
                </Link>
                <Link href="/products?category=Watches%20%26%20Timewear" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.8rem' } }}>
                  Watches & Timewear
                </Link>
                <Link href="/products?category=Bags%20%26%20Travel%20Accessories" color="inherit" underline="hover" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.8rem' } }}>
                  Bags & Travel Accessories
                </Link>
              </Box>
            </Box>

            {/* Contact - Mobile only in right column */}
            <Box sx={{ mt: { xs: 2, sm: 0 }, display: { xs: 'block', sm: 'none', md: 'none' } }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ fontSize: '0.875rem' }}>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ fontSize: 16 }} />
                  <Link
                    href="mailto:zukastore786@gmail.com"
                    color="inherit"
                    underline="hover"
                    sx={{ 
                      opacity: 0.9,
                      fontSize: '0.7rem'
                    }}
                  >
                    zukastore786@gmail.com
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                  <LocationOn sx={{ fontSize: 16, mt: 0.5 }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      opacity: 0.9,
                      fontSize: '0.7rem',
                      lineHeight: 1.6
                    }}
                  >
                    12/14, Allah Bakhash Street,<br />
                    Tirupattur – 635601,<br />
                    Tirupattur District, Tamil Nadu,<br />
                    India.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links - Desktop only */}
          <Grid item xs={12} sm={3} md={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
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

          {/* Contact - Desktop only */}
          <Grid item xs={12} sm={3} md={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: { xs: 18, sm: 20 } }} />
                <Link
                  href="mailto:zukastore786@gmail.com"
                  color="inherit"
                  underline="hover"
                  sx={{ 
                    opacity: 0.9,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  zukastore786@gmail.com
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <LocationOn sx={{ fontSize: { xs: 18, sm: 20 }, mt: 0.5 }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.9,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    lineHeight: 1.6
                  }}
                >
                  12/14, Allah Bakhash Street,<br />
                  Tirupattur – 635601,<br />
                  Tirupattur District, Tamil Nadu,<br />
                  India.
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
            © {new Date().getFullYear()} ZUKA. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

