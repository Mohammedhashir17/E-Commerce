import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { ShoppingBag, ArrowBack, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    title: 'Welcome to E-Commerce',
    subtitle: 'Discover Amazing Products at Great Prices',
    description: 'Special Offer: Get 20% off on all products! Limited time only.',
    buttonText: 'Shop Now',
    bgColor: 'linear-gradient(135deg, #835DC2 0%, #A78BFA 100%)',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Latest Fashion & Electronics',
    description: 'Explore our newest collection of trendy products',
    buttonText: 'Explore Now',
    bgColor: 'linear-gradient(135deg, #A78BFA 0%, #835DC2 100%)',
  },
  {
    title: 'Flash Sale',
    subtitle: 'Up to 50% Off',
    description: 'Don\'t miss out on our biggest sale of the year!',
    buttonText: 'Shop Sale',
    bgColor: 'linear-gradient(135deg, #DDD6FE 0%, #835DC2 100%)',
  },
];

const HeroSlider = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '250px', sm: '350px', md: '400px', lg: '500px' },
        overflow: 'hidden',
        borderRadius: { xs: 2, sm: 3 },
        mb: { xs: 2, sm: 3, md: 4 },
        boxShadow: '0 8px 24px rgba(131, 93, 194, 0.2)',
      }}
    >
      {slides.map((slide, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: slide.bgColor,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            color: 'white',
            p: 4,
            opacity: index === currentSlide ? 1 : 0,
            transform: `translateX(${(index - currentSlide) * 100}%)`,
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            zIndex: index === currentSlide ? 1 : 0,
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            fontWeight="bold"
            sx={{ 
              fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.5rem', lg: '3rem' },
              px: { xs: 2, sm: 0 }
            }}
          >
            {slide.title}
          </Typography>
          <Typography
            variant="h5"
            sx={{ 
              mb: { xs: 1.5, sm: 2, md: 3 }, 
              opacity: 0.9, 
              fontSize: { xs: '0.875rem', sm: '1.1rem', md: '1.3rem', lg: '1.5rem' },
              px: { xs: 2, sm: 0 }
            }}
          >
            {slide.subtitle}
          </Typography>
          <Typography
            variant="body1"
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 }, 
              opacity: 0.8, 
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.95rem', lg: '1rem' },
              px: { xs: 2, sm: 0 },
              display: { xs: 'none', sm: 'block' }
            }}
          >
            {slide.description}
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingBag sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
            onClick={() => navigate('/products')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 0.75, sm: 1, md: 1.5 },
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
            }}
          >
            {slide.buttonText}
          </Button>
        </Box>
      ))}

      {/* Navigation Arrows */}
      <IconButton
        onClick={handlePrevious}
        sx={{
          position: 'absolute',
          left: { xs: 8, sm: 16 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255,255,255,0.3)',
          color: 'white',
          zIndex: 2,
          '&:hover': { bgcolor: 'rgba(255,255,255,0.5)' },
          display: { xs: 'none', sm: 'flex' },
          p: { xs: 0.5, sm: 1 }
        }}
      >
        <ArrowBack sx={{ fontSize: { xs: '1rem', sm: '1.5rem' } }} />
      </IconButton>
      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          right: { xs: 8, sm: 16 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255,255,255,0.3)',
          color: 'white',
          zIndex: 2,
          '&:hover': { bgcolor: 'rgba(255,255,255,0.5)' },
          display: { xs: 'none', sm: 'flex' },
          p: { xs: 0.5, sm: 1 }
        }}
      >
        <ArrowForward sx={{ fontSize: { xs: '1rem', sm: '1.5rem' } }} />
      </IconButton>

      {/* Dots Indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 2,
        }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => goToSlide(index)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.8)' },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HeroSlider;

