import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CustomerAuthModal } from './CustomerAuthModal';
import { CartProvider } from '../context/CartContext';

export function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
      return;
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior
    });
  }, [pathname, hash]);

  return (
    <CartProvider>
      <div className="bg-[#0B0B0B] min-h-screen font-['Inter'] relative">
        <div 
          className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1602475063211-3d98d60e3b1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwYmxhY2slMjBub2lzZSUyMHRleHR1cmV8ZW58MXx8fHwxNzczOTI4NzMxfDA&ixlib=rb-4.1.0&q=80&w=1080")', backgroundSize: '200px', backgroundRepeat: 'repeat' }}
        />
        <div className="relative z-10">
          <Navbar />
          <Outlet />
          <Footer />
          <CustomerAuthModal />
        </div>
      </div>
    </CartProvider>
  );
}
