import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import {
  Inventory,
  ShoppingCart,
  LocalShipping,
  TrendingUp,
} from '@mui/icons-material';
import { getProducts, getOrders } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingShipments: 0,
    revenue: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [products, orders] = await Promise.all([
        getProducts(),
        getOrders(),
      ]);

      const pendingShipments = orders.filter(
        (order) => order.isPaid && !order.isDelivered
      ).length;

      const revenue = orders
        .filter((order) => order.isPaid)
        .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingShipments,
        revenue,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <Inventory sx={{ fontSize: 40 }} />,
      color: '#835DC2',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      color: '#2196F3',
    },
    {
      title: 'Pending Shipments',
      value: stats.pendingShipments,
      icon: <LocalShipping sx={{ fontSize: 40 }} />,
      color: '#FF9800',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#4CAF50',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                bgcolor: card.color,
                color: 'white',
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {card.value}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {card.title}
                    </Typography>
                  </Box>
                  <Box sx={{ opacity: 0.8 }}>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;

