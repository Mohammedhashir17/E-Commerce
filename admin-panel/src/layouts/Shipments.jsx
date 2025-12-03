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
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { getOrders } from '../services/api';
import api from '../services/api';

const Shipments = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      // Filter only paid orders
      const paidOrders = data.filter(order => order.isPaid);
      setOrders(paidOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleUpdateStatus = async (orderId, isDelivered) => {
    try {
      if (isDelivered) {
        await api.put(`/orders/${orderId}/deliver`);
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
        Shipments Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Shipping Address</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>#{order._id.slice(-8)}</TableCell>
                <TableCell>{order.user?.name || 'N/A'}</TableCell>
                <TableCell>
                  {order.shippingAddress ? (
                    <Box>
                      <Typography variant="body2">
                        {order.shippingAddress.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.shippingAddress.address}, {order.shippingAddress.city}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                      </Typography>
                    </Box>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>{order.orderItems?.length || 0}</TableCell>
                <TableCell>₹{order.totalPrice?.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={order.isDelivered ? 'Delivered' : 'In Transit'}
                    color={order.isDelivered ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {!order.isDelivered && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleUpdateStatus(order._id, true)}
                      sx={{ bgcolor: 'primary.main' }}
                    >
                      Mark as Delivered
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Shipments;

