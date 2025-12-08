import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
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
  FilterList,
  Close,
} from '@mui/icons-material';
import {
  Popover,
  MenuList,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Rating,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useCartWishlist } from '../../contexts/CartWishlistContext';
import { getAllCategories, getAllProducts } from '../../services/backend-service';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const { cartCount, wishlistCount } = useCartWishlist();
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    brand: '',
    minRating: '',
    inStock: false,
  });

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    
    // Sync filters with URL
    const categoryFromUrl = searchParams.get('category') || '';
    const searchFromUrl = searchParams.get('search') || '';
    const minPriceFromUrl = searchParams.get('minPrice') || '';
    const maxPriceFromUrl = searchParams.get('maxPrice') || '';
    const brandFromUrl = searchParams.get('brand') || '';
    const minRatingFromUrl = searchParams.get('minRating') || '';
    const inStockFromUrl = searchParams.get('inStock') === 'true';
    
    setSearchQuery(searchFromUrl);
    setFilters({
      search: searchFromUrl,
      category: categoryFromUrl,
      minPrice: minPriceFromUrl,
      maxPrice: maxPriceFromUrl,
      brand: brandFromUrl,
      minRating: minRatingFromUrl,
      inStock: inStockFromUrl,
    });
  }, [user, location, searchParams]);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const products = await getAllProducts();
      const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
      setBrands(uniqueBrands);
    } catch (error) {
      console.error('Error fetching brands:', error);
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
      applyFilters({ ...filters, search: searchQuery });
    }
  };

  const handleOpenFilters = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleCloseFilters = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterUpdate = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    const cleared = {
      search: searchQuery,
      category: '',
      minPrice: '',
      maxPrice: '',
      brand: '',
      minRating: '',
      inStock: false,
    };
    setFilters(cleared);
    applyFilters(cleared);
  };

  const applyFilters = (filterData) => {
    const params = new URLSearchParams();
    if (filterData.search) params.set('search', filterData.search);
    if (filterData.category) params.set('category', filterData.category);
    if (filterData.minPrice) params.set('minPrice', filterData.minPrice);
    if (filterData.maxPrice) params.set('maxPrice', filterData.maxPrice);
    if (filterData.brand) params.set('brand', filterData.brand);
    if (filterData.minRating) params.set('minRating', filterData.minRating);
    if (filterData.inStock) params.set('inStock', 'true');
    
    navigate(`/products?${params.toString()}`);
  };


  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: 'var(--layout-chrome-bg)',
          boxShadow: '0 14px 30px rgba(0, 0, 0, 0.8)',
          borderBottom: '1px solid var(--border-subtle)',
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
                endAdornment: (
                  <InputAdornment position="end">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {(filters.category || filters.brand || filters.minRating || filters.inStock || filters.minPrice || filters.maxPrice) && (
                        <Close
                          sx={{ 
                            cursor: 'pointer', 
                            fontSize: 16, 
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'scale(1.2)' }
                          }}
                          onClick={handleClearFilters}
                        />
                      )}
                      <FilterList
                        sx={{ 
                          cursor: 'pointer', 
                          color: filterAnchorEl ? 'primary.main' : 'inherit',
                          transition: 'all 0.2s',
                          fontSize: { xs: '1.2rem', sm: '1.5rem' },
                          '&:hover': { transform: 'rotate(90deg)', color: 'primary.main' }
                        }}
                        onClick={handleOpenFilters}
                      />
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{
                bgcolor: 'var(--bg-surface)',
                borderRadius: '25px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '25px',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  '& fieldset': {
                    borderColor: 'var(--border-subtle)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--accent-purple)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--accent-purple-soft)',
                    boxShadow: '0 0 0 1px rgba(108, 43, 217, 0.7)',
                  },
                },
              }}
            />
          </Box>

          {/* Filter Popover */}
          <Popover
            open={Boolean(filterAnchorEl)}
            anchorEl={filterAnchorEl}
            onClose={handleCloseFilters}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: { 
                width: 300, 
                p: 2, 
                maxHeight: '80vh', 
                overflow: 'auto',
                bgcolor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
              },
            }}
          >
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Category Filter */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category || ''}
                label="Category"
                onChange={(e) => handleFilterUpdate('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Brand Filter */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Brand</InputLabel>
              <Select
                value={filters.brand || ''}
                label="Brand"
                onChange={(e) => handleFilterUpdate('brand', e.target.value)}
              >
                <MenuItem value="">All Brands</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Price Range */}
            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>Price Range</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Min"
                  type="number"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterUpdate('minPrice', e.target.value)}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Max"
                  type="number"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterUpdate('maxPrice', e.target.value)}
                  size="small"
                />
              </Box>
            </Box>

            {/* Rating Filter */}
            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>Minimum Rating</Typography>
              <Rating
                value={parseFloat(filters.minRating) || 0}
                onChange={(event, newValue) => {
                  handleFilterUpdate('minRating', newValue ? newValue.toString() : '');
                }}
                precision={0.5}
              />
            </Box>

            {/* Availability Filter */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.inStock || false}
                  onChange={(e) => handleFilterUpdate('inStock', e.target.checked)}
                />
              }
              label="In Stock Only"
            />

            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Box
                component="button"
                onClick={handleClearFilters}
                sx={{
                  flex: 1,
                  py: 1,
                  border: '1px solid',
                  borderColor: 'primary.main',
                  color: 'var(--text-primary)',
                  bgcolor: 'transparent',
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(94, 43, 151, 0.5)' },
                }}
              >
                Clear
              </Box>
              <Box
                component="button"
                onClick={() => {
                  applyFilters({ ...filters, search: searchQuery });
                  handleCloseFilters();
                }}
                sx={{
                  flex: 1,
                  py: 1,
                  bgcolor: 'primary.main',
                  color: 'white',
                  border: 'none',
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                Apply
              </Box>
            </Box>
          </Popover>

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
              <Badge badgeContent={wishlistCount} color="error">
                <Favorite sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
              </Badge>
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
