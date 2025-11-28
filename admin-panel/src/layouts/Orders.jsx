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
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { getOrders } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const getStatusColor = (isPaid, isDelivered) => {
    if (isDelivered) return 'success';
    if (isPaid) return 'info';
    return 'warning';
  };

  const getStatusText = (isPaid, isDelivered) => {
    if (isDelivered) return 'Delivered';
    if (isPaid) return 'Processing';
    return 'Pending';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
        Orders Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
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
                  <Chip
                    label={getStatusText(order.isPaid, order.isDelivered)}
                    color={getStatusColor(order.isPaid, order.isDelivered)}
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

