import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Paper } from '@mui/material';

// Category images mapping
const CATEGORY_IMAGES = {
  'Jewellery & Accessories': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&auto=format&q=80',
  'Toys & Kids Products': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format&q=80',
  'Fragrances & Perfumes': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&auto=format&q=80',
  'Home Decor & Decorative Items': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&auto=format&q=80',
  'Watches & Timewear': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format&q=80',
  'Bags & Travel Accessories': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&auto=format&q=80',
};

const CategoryGrid = ({ categories }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <Box sx={{ mb: { xs: 4, sm: 5, md: 6 }, mt: { xs: 3, sm: 4 } }}>
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
        {categories.map((category) => {
          const imageUrl = CATEGORY_IMAGES[category.name] || 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop&auto=format&q=80';
          
          return (
            <Grid item xs={6} sm={4} md={3} lg={2} key={category._id}>
              <Paper
                elevation={0}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  p: { xs: 1.5, sm: 2 },
                  transition: 'all 0.3s ease',
                  bgcolor: 'transparent',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    '& .category-image': {
                      transform: 'scale(1.05)',
                    },
                    '& .category-name': {
                      color: 'primary.main',
                    },
                  },
                }}
                onClick={() => handleCategoryClick(category.name)}
              >
                <Box
                  sx={{
                    width: { xs: 80, sm: 100, md: 120 },
                    height: { xs: 80, sm: 100, md: 120 },
                    borderRadius: '50%',
                    overflow: 'hidden',
                    mb: { xs: 1, sm: 1.5 },
                    border: '3px solid',
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 12px rgba(94, 43, 151, 0.3)',
                    transition: 'transform 0.3s ease',
                  }}
                  className="category-image"
                >
                  <Box
                    component="img"
                    src={imageUrl}
                    alt={category.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop&auto=format&q=80';
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  className="category-name"
                  sx={{
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                    color: 'text.primary',
                    transition: 'color 0.3s ease',
                    wordBreak: 'break-word',
                    px: 0.5,
                  }}
                >
                  {category.name}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CategoryGrid;

