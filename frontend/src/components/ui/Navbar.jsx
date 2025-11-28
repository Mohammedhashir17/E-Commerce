import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  Avatar,
  TextField,
  InputAdornment,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  Search,
  Menu as MenuIcon,
  PhoneAndroid,
  ShoppingBag,
  Home,
  Spa,
  Toys,
  SportsEsports,
  MenuBook,
  FitnessCenter,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { getCart, getAllCategories } from '../../services/backend-service';

// Category icons mapping
const getCategoryIcon = (categoryName) => {
  const iconMap = {
    'Electronics': <PhoneAndroid sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} />,
    'Fashion & Clothing': <ShoppingBag sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} />,
    'Home & Furniture': <Home sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} />,
    'Beauty & Personal Care': <Spa sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} />,
    'Toys & Baby Products': <Toys sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} />,
    'Sports & Fitness': <FitnessCenter sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} />,
    'Books & Stationary': <MenuBook sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} />,
    'Gaming': <SportsEsports sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} />,
  };
  return iconMap[categoryName] || <ShoppingBag sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} />;
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchCartCount = async () => {
      if (user) {
        try {
          const cart = await getCart();
          const count = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
          setCartCount(count);
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = localCart.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      }
    };
    fetchCartCount();
    fetchCategories();
  }, [user, location]);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: 'primary.main',
          boxShadow: '0 4px 12px rgba(131, 93, 194, 0.3)',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{ 
          py: { xs: 1, sm: 1.5 }, 
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          gap: { xs: 1, sm: 0 }
        }}>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileMenuOpen(true)}
            sx={{ display: { xs: 'block', md: 'none' }, mr: 1 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 0, 
              mr: { xs: 1, sm: 2, md: 4 }, 
              cursor: 'pointer', 
              fontWeight: 700,
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
            onClick={() => navigate('/')}
          >
            E-Commerce
          </Typography>

          {/* Search Bar in Header */}
          <Box sx={{ 
            order: { xs: 3, md: 0 },
            flexGrow: { xs: 1, sm: 1, md: 0 }, 
            width: { xs: '100%', sm: 'auto', md: '400px' },
            mx: { xs: 0, sm: 'auto', md: 0 },
            mr: { xs: 0, sm: 0, md: 2 },
            minWidth: { xs: '100%', sm: '250px', md: '400px' },
            maxWidth: { xs: '100%', sm: '400px', md: '400px' }
          }}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search 
                      sx={{ 
                        color: 'primary.main', 
                        cursor: 'pointer',
                        fontSize: { xs: '1.2rem', sm: '1.5rem' }
                      }} 
                      onClick={handleSearch} 
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                bgcolor: 'white',
                borderRadius: '25px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '25px',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none',
                    boxShadow: '0 0 0 2px rgba(131, 93, 194, 0.2)',
                  },
                },
              }}
            />
          </Box>

          {/* Icons and User Menu - Right Aligned */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 0.5, sm: 1 },
            order: { xs: 2, md: 0 },
            ml: { xs: 'auto', sm: 'auto', md: 'auto' },
            flexShrink: 0
          }}>
            <IconButton 
              color="inherit" 
              onClick={() => navigate('/wishlist')}
              sx={{ 
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.1)' },
                p: { xs: 0.75, sm: 1 }
              }}
            >
              <Favorite sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
            </IconButton>

            <IconButton 
              color="inherit" 
              onClick={() => navigate('/cart')}
              sx={{ 
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.1)' },
                p: { xs: 0.75, sm: 1 }
              }}
            >
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCart sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
              </Badge>
            </IconButton>

            {user ? (
              <>
                <IconButton onClick={handleMenuOpen} color="inherit" sx={{ p: { xs: 0.75, sm: 1 } }}>
                  <Avatar sx={{ 
                    width: { xs: 28, sm: 32 }, 
                    height: { xs: 28, sm: 32 }, 
                    bgcolor: 'secondary.main', 
                    color: 'primary.main' 
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => { navigate('/account'); handleMenuClose(); }}>
                    Account
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/orders'); handleMenuClose(); }}>
                    My Orders
                  </MenuItem>
                  {user.role === 'admin' && (
                    <MenuItem onClick={() => { navigate('/admin'); handleMenuClose(); }}>
                      Admin Panel
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button 
                color="inherit" 
                onClick={() => navigate('/login')}
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 2 }
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>

        {/* Categories Horizontal List with Icons */}
        <Box
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            px: { xs: 1, sm: 2 },
            py: 1,
            display: 'flex',
            gap: { xs: 0.75, sm: 1 },
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              height: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'rgba(255,255,255,0.3)',
              borderRadius: '2px',
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'transparent',
            },
          }}
        >
          <Chip
            icon={<Home sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} />}
            label="All"
            onClick={() => {
              setSelectedCategory('');
              navigate('/products');
            }}
            sx={{
              bgcolor: selectedCategory === '' ? 'white' : 'transparent',
              color: selectedCategory === '' ? 'primary.main' : 'white',
              border: '1px solid white',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.2)',
              },
              whiteSpace: 'nowrap',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              height: { xs: 32, sm: 36 },
              '& .MuiChip-icon': {
                color: selectedCategory === '' ? 'primary.main' : 'white',
              },
            }}
          />
          {categories.map((category) => (
            <Chip
              key={category._id}
              icon={getCategoryIcon(category.name)}
              label={category.name}
              onClick={() => handleCategoryClick(category.name)}
              sx={{
                bgcolor: selectedCategory === category.name ? 'white' : 'transparent',
                color: selectedCategory === category.name ? 'primary.main' : 'white',
                border: '1px solid white',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                },
                whiteSpace: 'nowrap',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                height: { xs: 32, sm: 36 },
                '& .MuiChip-icon': {
                  color: selectedCategory === category.name ? 'primary.main' : 'white',
                },
              }}
            />
          ))}
        </Box>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname === '/'}
                onClick={() => {
                  navigate('/');
                  setMobileMenuOpen(false);
                }}
              >
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname === '/products'}
                onClick={() => {
                  navigate('/products');
                  setMobileMenuOpen(false);
                }}
              >
                <ListItemText primary="Categories" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/wishlist'); setMobileMenuOpen(false); }}>
                <ListItemText primary="Wishlist" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/cart'); setMobileMenuOpen(false); }}>
                <ListItemText primary="Cart" />
              </ListItemButton>
            </ListItem>
            {user && (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => { navigate('/account'); setMobileMenuOpen(false); }}>
                    <ListItemText primary="Account" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => { navigate('/orders'); setMobileMenuOpen(false); }}>
                    <ListItemText primary="My Orders" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
