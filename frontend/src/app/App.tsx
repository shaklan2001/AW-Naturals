import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <CustomerAuthProvider>
      <RouterProvider router={router} />
      <Toaster richColors closeButton />
    </CustomerAuthProvider>
  );
}
