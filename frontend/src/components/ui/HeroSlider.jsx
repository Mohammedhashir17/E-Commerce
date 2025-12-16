import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { ShoppingBag, ArrowBack, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    title: 'Welcome to ZUKA',
    subtitle: 'Discover Amazing Products at Great Prices',
    description: 'Special Offer: Get 20% off on all products! Limited time only.',
    buttonText: 'Shop Now',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Fresh collections in jewellery, toys, bags and more',
    description: 'Explore our newest collection of trendy products',
    buttonText: 'Explore Now',
  },
  {
    title: 'Flash Sale',
    subtitle: 'Up to 50% Off',
    description: "Don't miss out on our biggest sale of the year!",
    buttonText: 'Shop Sale',
  },
];

const HeroSlider = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Scroll to current slide on mobile when it changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const slideWidth = container.clientWidth;
      isScrollingRef.current = true;
      container.scrollTo({
        left: currentSlide * slideWidth,
        behavior: 'smooth',
      });
      // Reset the flag after scroll animation completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 600);
    }
  }, [currentSlide]);

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const slideWidth = container.clientWidth;
      isScrollingRef.current = true;
      container.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth',
      });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '250px', sm: '350px', md: '400px', lg: '500px' },
        overflow: { xs: 'hidden', sm: 'hidden' },
        borderRadius: { xs: 2, sm: 3 },
        mb: { xs: 2, sm: 3, md: 4 },
        boxShadow: '0 18px 40px rgba(0, 0, 0, 0.75)',
        backgroundColor: 'var(--bg-surface)',
      }}
    >
      {/* Mobile: Horizontal Scrollable Container */}
      <Box
        ref={scrollContainerRef}
        sx={{
          display: { xs: 'flex', sm: 'none' },
          width: '100%',
          height: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
        }}
        onScroll={(e) => {
          if (isScrollingRef.current) return;
          const scrollLeft = e.target.scrollLeft;
          const slideWidth = e.target.clientWidth;
          const newIndex = Math.round(scrollLeft / slideWidth);
          if (newIndex !== currentSlide && newIndex >= 0 && newIndex < slides.length) {
            setCurrentSlide(newIndex);
          }
        }}
      >
        {slides.map((slide, index) => (
          <Box
            key={index}
            sx={{
              minWidth: '100%',
              width: '100%',
              height: '100%',
              background:
                'radial-gradient(circle at top left, rgba(108, 43, 217, 0.35) 0, transparent 55%),' +
                'radial-gradient(circle at bottom right, rgba(139, 92, 246, 0.25) 0, transparent 60%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              color: 'white',
              p: 4,
              flexShrink: 0,
              scrollSnapAlign: 'start',
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
                bgcolor: '#5E2B97',
                color: '#FFFFFF',
                '&:hover': { bgcolor: '#7C3ECD' },
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 0.75, sm: 1, md: 1.5 },
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
              }}
            >
              {slide.buttonText}
            </Button>
          </Box>
        ))}
      </Box>

      {/* Desktop: Absolute Positioned Slides */}
      {slides.map((slide, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background:
              'radial-gradient(circle at top left, rgba(108, 43, 217, 0.35) 0, transparent 55%),' +
              'radial-gradient(circle at bottom right, rgba(139, 92, 246, 0.25) 0, transparent 60%)',
            display: { xs: 'none', sm: 'flex' },
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
              bgcolor: '#5E2B97',
              color: '#FFFFFF',
              '&:hover': { bgcolor: '#7C3ECD' },
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
          bgcolor: 'rgba(0,0,0,0.6)',
          color: 'white',
          zIndex: 2,
          '&:hover': { bgcolor: 'rgba(94, 43, 151, 0.9)' },
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
          bgcolor: 'rgba(0,0,0,0.6)',
          color: 'white',
          zIndex: 2,
          '&:hover': { bgcolor: 'rgba(94, 43, 151, 0.9)' },
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
              bgcolor: index === currentSlide ? '#5E2B97' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': { bgcolor: '#7C3ECD' },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HeroSlider;

