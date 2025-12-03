import React, { useState } from 'react';
import {
  TextField,
  InputAdornment,
  Box,
  Popover,
  MenuList,
  MenuItem,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Slider,
  Rating,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Search, FilterList, Close } from '@mui/icons-material';

const SearchWithFilters = ({ filters, onFilterChange, categories, brands }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleOpenFilters = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseFilters = () => {
    setAnchorEl(null);
    // Apply filters when closing
    onFilterChange(localFilters);
  };

  const handleFilterUpdate = (field, value) => {
    const updated = { ...localFilters, [field]: value };
    setLocalFilters(updated);
  };

  const handleClearFilters = () => {
    const cleared = {
      search: localFilters.search,
      category: '',
      minPrice: '',
      maxPrice: '',
      brand: '',
      minRating: '',
      inStock: false,
    };
    setLocalFilters(cleared);
    onFilterChange(cleared);
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 4, width: '100%' }}>
      <TextField
        fullWidth
        placeholder="Search products..."
        value={localFilters.search || ''}
        onChange={(e) => {
          const updated = { ...localFilters, search: e.target.value };
          setLocalFilters(updated);
          onFilterChange(updated);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {(localFilters.category || localFilters.brand || localFilters.minRating || localFilters.inStock) && (
                  <Close
                    sx={{ cursor: 'pointer', fontSize: 18, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.2)' } }}
                    onClick={handleClearFilters}
                  />
                )}
                <FilterList
                  sx={{ 
                    cursor: 'pointer', 
                    color: open ? 'primary.main' : 'inherit',
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'rotate(90deg)', color: 'primary.main' }
                  }}
                  onClick={handleOpenFilters}
                />
              </Box>
            </InputAdornment>
          ),
        }}
        sx={{ 
          flexGrow: 1,
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.3s',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.7)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 1px rgba(94, 43, 151, 0.6), 0 10px 20px rgba(0, 0, 0, 0.8)',
            },
          },
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
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
          sx: { width: 300, p: 2, maxHeight: '80vh', overflow: 'auto' },
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
            value={localFilters.category || ''}
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
            value={localFilters.brand || ''}
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
              value={localFilters.minPrice || ''}
              onChange={(e) => handleFilterUpdate('minPrice', e.target.value)}
              size="small"
            />
            <TextField
              fullWidth
              label="Max"
              type="number"
              value={localFilters.maxPrice || ''}
              onChange={(e) => handleFilterUpdate('maxPrice', e.target.value)}
              size="small"
            />
          </Box>
        </Box>

        {/* Rating Filter */}
        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>Minimum Rating</Typography>
          <Rating
            value={parseFloat(localFilters.minRating) || 0}
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
              checked={localFilters.inStock || false}
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
              borderColor: '#5E2B97',
              color: '#FFFFFF',
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
            onClick={handleCloseFilters}
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
    </Box>
  );
};

export default SearchWithFilters;

