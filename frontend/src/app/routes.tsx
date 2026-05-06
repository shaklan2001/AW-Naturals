import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { HomePage } from './pages/home/HomePage';
import { AboutPage } from './pages/about/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProductsPage } from './pages/products/ProductsPage';
import { ProductDetailPage } from './pages/products/ProductDetailPage';
import { BlogPage } from './pages/blog/BlogPage';
import { BlogPostPage } from './pages/blog/BlogPostPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ContactPage } from './pages/ContactPage';

import { FindYourBlendOutlet } from './pages/wellness/FindYourBlendOutlet';
import { FindYourBlendPage } from './pages/wellness/FindYourBlendPage';
import { CustomerLoginPage } from './pages/auth/CustomerLoginPage';
import { CustomerSignUpPage } from './pages/auth/CustomerSignUpPage';
import { CustomerProfilePage } from './pages/profile/CustomerProfilePage';
import { OrderHistoryPage } from './pages/profile/OrderHistoryPage';
import { LoginSecurityPage } from './pages/profile/LoginSecurityPage';
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/legal/TermsOfServicePage';
import { RefundPolicyPage } from './pages/legal/RefundPolicyPage';
import { AccessibilityPage } from './pages/legal/AccessibilityPage';
import { SitemapPage } from './pages/legal/SitemapPage';

import { ComingSoonPage } from './pages/ComingSoonPage';

// Flag to toggle coming soon mode
const isComingSoon = import.meta.env.VITE_ENABLE_COMING_SOON === 'true';

export const router = createBrowserRouter([
  isComingSoon
    ? {
        path: '*',
        Component: ComingSoonPage,
      }
    : {
        path: '/',
        Component: Layout,
        children: [
      { index: true, Component: HomePage },
      { path: 'about', Component: AboutPage },

      { path: 'services', Component: ServicesPage },
      { path: 'contact', Component: ContactPage },
      { path: 'privacy-policy', Component: PrivacyPolicyPage },
      { path: 'terms-of-service', Component: TermsOfServicePage },
      { path: 'refund-policy', Component: RefundPolicyPage },
      { path: 'accessibility', Component: AccessibilityPage },
      { path: 'sitemap', Component: SitemapPage },
      { path: 'products', Component: ProductsPage },
      { path: 'products/:id', Component: ProductDetailPage },
      { path: 'blog', Component: BlogPage },
      { path: 'blog/:slug', Component: BlogPostPage },
      { path: 'cart', Component: CartPage },
      { path: 'checkout', Component: CheckoutPage },
      { path: 'login', Component: CustomerLoginPage },
      { path: 'signup', Component: CustomerSignUpPage },
      { path: 'profile', Component: CustomerProfilePage },
      { path: 'profile/orders', Component: OrderHistoryPage },
      { path: 'profile/security', Component: LoginSecurityPage },
      {
        path: 'find-your-blend',
        Component: FindYourBlendOutlet,
        children: [
          { index: true, Component: FindYourBlendPage },
          { path: 'result', element: <Navigate to="/find-your-blend" replace /> },
        ],
      },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);