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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
} from '@mui/icons-material';
import { getProducts, updateProduct } from '../services/api';

const Offers = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [offerData, setOfferData] = useState({
    discountPercent: '',
    offerPrice: '',
    offerValidUntil: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleOpenOffer = (product) => {
    setSelectedProduct(product);
    setOfferData({
      discountPercent: product.discountPercent || '',
      offerPrice: product.offerPrice || '',
      offerValidUntil: product.offerValidUntil || '',
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setOfferData({
      discountPercent: '',
      offerPrice: '',
      offerValidUntil: '',
    });
  };

  const handleSaveOffer = async () => {
    try {
      const discount = parseFloat(offerData.discountPercent);
      const originalPrice = selectedProduct.price;
      const calculatedOfferPrice = originalPrice * (1 - discount / 100);

      await updateProduct(selectedProduct._id, {
        ...selectedProduct,
        discountPercent: discount,
        offerPrice: calculatedOfferPrice,
        offerValidUntil: offerData.offerValidUntil,
        hasOffer: true,
      });

      fetchProducts();
      handleClose();
    } catch (error) {
      console.error('Error saving offer:', error);
    }
  };

  const handleRemoveOffer = async (productId) => {
    try {
      const product = products.find(p => p._id === productId);
      await updateProduct(productId, {
        ...product,
        discountPercent: null,
        offerPrice: null,
        offerValidUntil: null,
        hasOffer: false,
      });
      fetchProducts();
    } catch (error) {
      console.error('Error removing offer:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
        Offers Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Original Price</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Offer Price</TableCell>
              <TableCell>Valid Until</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell>
                  {product.discountPercent ? `${product.discountPercent}%` : '-'}
                </TableCell>
                <TableCell>
                  {product.offerPrice ? (
                    <Typography variant="body2" color="primary.main" fontWeight="bold">
                      ₹{product.offerPrice.toFixed(2)}
                    </Typography>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {product.offerValidUntil
                    ? new Date(product.offerValidUntil).toLocaleDateString()
                    : '-'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={product.hasOffer ? 'Active' : 'No Offer'}
                    color={product.hasOffer ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenOffer(product)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  {product.hasOffer && (
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveOffer(product._id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedProduct ? `Add Offer to ${selectedProduct.name}` : 'Add Offer'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Discount Percentage"
              type="number"
              value={offerData.discountPercent}
              onChange={(e) => {
                const discount = parseFloat(e.target.value) || 0;
                const originalPrice = selectedProduct?.price || 0;
                const offerPrice = originalPrice * (1 - discount / 100);
                setOfferData({
                  ...offerData,
                  discountPercent: e.target.value,
                  offerPrice: offerPrice.toFixed(2),
                });
              }}
              inputProps={{ min: 0, max: 100 }}
              helperText="Enter discount percentage (0-100)"
            />
            <TextField
              fullWidth
              label="Offer Price"
              type="number"
              value={offerData.offerPrice}
              onChange={(e) => setOfferData({ ...offerData, offerPrice: e.target.value })}
              disabled
              helperText="Calculated automatically"
            />
            <TextField
              fullWidth
              label="Valid Until"
              type="date"
              value={offerData.offerValidUntil}
              onChange={(e) => setOfferData({ ...offerData, offerValidUntil: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveOffer} variant="contained" sx={{ bgcolor: 'primary.main' }}>
            Save Offer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Offers;

