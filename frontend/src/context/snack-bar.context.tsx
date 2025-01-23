import React, { useContext, createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

interface SnackbarContextType {
  showAlert: (message: string, severity: Severity) => void;
}

const SnackbarContext = createContext<SnackbarContextType | null>(null);

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

interface SnackbarProviderProps {
  children: ReactNode;
}
type Severity = 'error' | 'warning' | 'info' | 'success';

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<Severity>('info');

  useEffect(() => {
    if(!open){
      // setMessage('');
      // setSeverity('info');
    }
  },[open])

  const showAlert = useCallback((message: string, severity: Severity = 'info') => {
    //I am using useCallback memoizes the showAlert function to prevent unnecessary re-renders of child components by maintaining the same function reference across renders.
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showAlert }}>
      {children}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={severity}>
          {message}
        </MuiAlert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
