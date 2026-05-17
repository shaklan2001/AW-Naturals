import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <div className="mb-8">
          <h1 className="font-['Playfair_Display'] text-[120px] md:text-[180px] leading-none text-[#D4AF37] mb-4" style={{ fontWeight: 700 }}>
            404
          </h1>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#F5F5DC] mb-4" style={{ fontWeight: 600 }}>
            Page Not Found
          </h2>
          <p className="font-['Inter'] text-[#F5F5DC]/70 text-lg mb-8" style={{ fontWeight: 300 }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary" className="gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Button
            variant="secondary"
            className="gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>

        <div className="mt-12 pt-12 border-t border-[#D4AF37]/20">
          <p className="font-['Inter'] text-[#F5F5DC]/60 text-sm mb-4" style={{ fontWeight: 300 }}>
            Quick Links
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/products" className="font-['Inter'] text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors duration-300" style={{ fontWeight: 400 }}>
              Shop
            </Link>
            <Link to="/about" className="font-['Inter'] text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors duration-300" style={{ fontWeight: 400 }}>
              About
            </Link>
            <Link to="/blog" className="font-['Inter'] text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors duration-300" style={{ fontWeight: 400 }}>
              Blog
            </Link>
            <Link to="/services" className="font-['Inter'] text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors duration-300" style={{ fontWeight: 400 }}>
              Services
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
