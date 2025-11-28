import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Image as ImageIcon,
} from '@mui/icons-material';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    categoryName: '',
    image: '',
    stock: '',
    brand: '',
    rating: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleOpen = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category?._id || '',
        categoryName: product.categoryName,
        image: product.image,
        stock: product.stock,
        brand: product.brand || '',
        rating: product.rating || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        categoryName: '',
        image: '',
        stock: '',
        brand: '',
        rating: '',
      });
    }
    setOpen(true);
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      categoryName: '',
      image: '',
      stock: '',
      brand: '',
      rating: '',
    });
  };

  const handleSubmit = async () => {
    try {
      setError('');
      if (editingProduct) {
        await updateProduct(editingProduct._id, formData);
        setSuccess('Product updated successfully!');
      } else {
        await createProduct(formData);
        setSuccess('Product created successfully!');
      }
      fetchProducts();
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setSuccess('Product deleted successfully!');
        fetchProducts();
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting product');
      }
    }
  };

  const handleCategoryChange = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    setFormData({
      ...formData,
      category: categoryId,
      categoryName: category?.name || '',
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'primary.main' }}>
          Products Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ bgcolor: 'primary.main' }}
        >
          Add Product
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <Box
                    component="img"
                    src={product.image}
                    alt={product.name}
                    sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  <Chip label={product.categoryName} size="small" />
                </TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell>
                  <Chip
                    label={product.stock}
                    color={product.stock > 0 ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{product.brand || 'N/A'}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpen(product)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(product._id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  required
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
                InputProps={{
                  startAdornment: <ImageIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            {formData.image && (
              <Grid item xs={12}>
                <Box
                  component="img"
                  src={formData.image}
                  alt="Preview"
                  sx={{ width: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 1 }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=Invalid+Image';
                  }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: 'primary.main' }}>
            {editingProduct ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;

