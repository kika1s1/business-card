import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  Mail, 
  Twitter, 
  Linkedin, 
  Github,
  Heart,
  ExternalLink
} from 'lucide-react';
import { ROUTES } from '../../utils/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Dashboard', href: ROUTES.DASHBOARD },
      { name: 'Card Editor', href: ROUTES.CARD_EDITOR },
      { name: 'Templates', href: ROUTES.DASHBOARD },
      { name: 'Export', href: '#export' }
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Contact', href: '#contact' },
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' }
    ],
    resources: [
      { name: 'Help Center', href: '#help' },
      { name: 'Design Tips', href: '#tips' },
      { name: 'API Documentation', href: '#api' },
      { name: 'Downloads', href: '#downloads' }
    ],
    social: [
      { 
        name: 'Twitter', 
        href: 'https://twitter.com', 
        icon: Twitter,
        color: 'hover:text-blue-400'
      },
      { 
        name: 'LinkedIn', 
        href: 'https://linkedin.com', 
        icon: Linkedin,
        color: 'hover:text-blue-600'
      },
      { 
        name: 'GitHub', 
        href: 'https://github.com', 
        icon: Github,
        color: 'hover:text-gray-800'
      },
      { 
        name: 'Email', 
        href: 'mailto:support@businesscardbuilder.com', 
        icon: Mail,
        color: 'hover:text-red-500'
      }
    ]
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Business Card Builder</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">
                Create professional business cards in minutes. Choose from stunning templates, 
                customize your design, and export high-quality cards ready for printing.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {footerLinks.social.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-gray-400 transition-colors duration-200 ${social.color}`}
                      aria-label={social.name}
                    >
                      <IconComponent className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Resources
              </h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm flex items-center"
                    >
                      {link.name}
                      {link.href.startsWith('http') && (
                        <ExternalLink className="h-3 w-3 ml-1" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-8 border-t border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Stay updated with design tips
              </h3>
              <p className="text-gray-600">
                Get the latest templates, design tips, and business card trends delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <span>© {currentYear} Business Card Builder. Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for entrepreneurs and professionals.</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="#privacy" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                Privacy
              </a>
              <a href="#terms" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                Terms
              </a>
              <a href="#cookies" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                Cookies
              </a>
              <span className="text-gray-400">v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 