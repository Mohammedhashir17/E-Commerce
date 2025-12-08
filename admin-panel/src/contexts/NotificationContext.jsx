import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';

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
    severity: 'info',
  });

  const showNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  const severityConfig = {
    success: {
      icon: <CheckCircleIcon />,
      accent: '#22C55E',
      accentSoft: 'rgba(34, 197, 94, 0.15)',
    },
    error: {
      icon: <ErrorIcon />,
      accent: '#F97373',
      accentSoft: 'rgba(249, 115, 129, 0.15)',
    },
    warning: {
      icon: <WarningAmberIcon />,
      accent: '#FACC15',
      accentSoft: 'rgba(250, 204, 21, 0.15)',
    },
    info: {
      icon: <InfoIcon />,
      accent: 'var(--accent-purple)',
      accentSoft: 'rgba(108, 43, 217, 0.25)',
    },
  };

  const current = severityConfig[notification.severity] || severityConfig.info;

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
            minWidth: { xs: '320px', sm: '360px' },
            p: 0,
            background: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'stretch',
            bgcolor: 'var(--bg-surface)',
            borderRadius: 2,
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 18px 40px rgba(0, 0, 0, 0.8)',
            overflow: 'hidden',
            minWidth: { xs: 320, sm: 360 },
          }}
        >
          <Box sx={{ width: 4, bgcolor: current.accent }} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 1.5,
              flex: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '999px',
                bgcolor: current.accentSoft,
                color: current.accent,
                flexShrink: 0,
              }}
            >
              {current.icon}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: { xs: '0.9rem', sm: '0.95rem' },
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {notification.message}
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              alignSelf: 'center',
              mr: 0.5,
              color: 'var(--text-muted)',
              '&:hover': { color: 'var(--text-primary)' },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Snackbar>
    </NotificationContext.Provider>
  );
};



