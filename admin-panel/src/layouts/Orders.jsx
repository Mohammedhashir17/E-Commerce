import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Visibility, Refresh } from '@mui/icons-material';
import { getOrders } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getOrders();
      console.log('Orders fetched:', data);
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch orders';
      setError(errorMessage);
      console.error('Full error:', error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const getStatusColor = (order) => {
    if (order.isDelivered) return 'success';
    if (order.paymentStatus === 'cod') return 'warning';
    if (order.isPaid || order.paymentStatus === 'paid') return 'info';
    return 'warning';
  };

  const getStatusText = (order) => {
    if (order.isDelivered) return 'Delivered';
    if (order.paymentStatus === 'cod') return 'Awaiting COD';
    if (order.isPaid || order.paymentStatus === 'paid') return 'Processing';
    return 'Pending';
  };

  const formatPaymentMethod = (order) =>
    order.paymentMethod?.toLowerCase() === 'cod' ? 'Cash on Delivery' : 'Online Payment';

  const formatPaymentStatus = (order) => {
    if (order.paymentStatus === 'paid' || order.isPaid) return 'Paid';
    if (order.paymentStatus === 'cod') return 'COD Pending';
    return 'Pending';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'primary.main' }}>
          Orders Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchOrders}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : orders.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No orders found. Orders will appear here once customers place orders.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>#{order._id.slice(-8)}</TableCell>
                <TableCell>{order.user?.name || 'N/A'}</TableCell>
                <TableCell>{order.orderItems?.length || 0}</TableCell>
                <TableCell>₹{order.totalPrice?.toFixed(2)}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Chip
                      size="small"
                      label={formatPaymentMethod(order)}
                      variant="outlined"
                      color={order.paymentMethod?.toLowerCase() === 'cod' ? 'warning' : 'info'}
                    />
                    <Chip
                      size="small"
                      label={formatPaymentStatus(order)}
                      color={order.paymentStatus === 'paid' || order.isPaid ? 'success' : 'warning'}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(order)}
                    color={getStatusColor(order)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleViewOrder(order)}
                    color="primary"
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Order #{selectedOrder._id.slice(-8)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Customer: {selectedOrder.user?.name} ({selectedOrder.user?.email})
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Date: {new Date(selectedOrder.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Payment Method: {formatPaymentMethod(selectedOrder)} ({formatPaymentStatus(selectedOrder)})
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Items:
                </Typography>
                {selectedOrder.orderItems?.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>{item.name} x {item.quantity}</Typography>
                    <Typography>₹{item.price * item.quantity}</Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #ddd' }}>
                <Typography variant="h6">
                  Total: ₹{selectedOrder.totalPrice?.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders;

