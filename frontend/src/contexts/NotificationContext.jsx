import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success', // success, error, warning, info
  });

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            minWidth: { xs: '300px', sm: '350px' },
          },
        }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            minWidth: { xs: '300px', sm: '350px' },
            minHeight: { xs: '60px', sm: '70px' },
            fontSize: { xs: '0.9rem', sm: '1rem' },
            py: { xs: 1.5, sm: 2 },
            px: { xs: 2.5, sm: 3 },
            '& .MuiAlert-icon': {
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
            },
            '& .MuiAlert-message': {
              display: 'flex',
              alignItems: 'center',
              fontWeight: 500,
            },
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

