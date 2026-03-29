import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Facebook, Instagram, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#171717] border-t border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <img 
              src="https://customer-assets.emergentagent.com/job_rhythm-wear-2/artifacts/eploke4p_logo3.png" 
              alt="Riyaz Tee" 
              className="h-20 w-auto mb-6"
            />
            <p className="text-sm text-neutral-400 leading-relaxed">
              Promoting young and emerging tabla artists through our platform and merchandise.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Quick Links</h3>
            <div className="space-y-3">
              <Link to="/products" className="block text-sm text-neutral-400 hover:text-yellow-400 transition-colors">
                Products
              </Link>
              <Link to="/about" className="block text-sm text-neutral-400 hover:text-yellow-400 transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="block text-sm text-neutral-400 hover:text-yellow-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Follow Us</h3>
            <div className="space-y-4">
              <a 
                href="https://www.youtube.com/c/Recitationoftabla" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-sm text-neutral-400 hover:text-yellow-400 transition-colors"
              >
                <Youtube className="w-5 h-5" />
                <span>YouTube</span>
              </a>
              <a 
                href="https://www.facebook.com/recitationoftabla/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-sm text-neutral-400 hover:text-yellow-400 transition-colors"
              >
                <Facebook className="w-5 h-5" />
                <span>Facebook</span>
              </a>
              <a 
                href="https://www.instagram.com/recitation_of_tabla/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-sm text-neutral-400 hover:text-yellow-400 transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Contact</h3>
            <div className="space-y-4">
              <a 
                href="mailto:shuvendushil3@gmail.com" 
                className="flex items-center space-x-3 text-sm text-neutral-400 hover:text-yellow-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>shuvendushil3@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Riyaz Tee. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
