import Link from "next/link";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-royal-maroon to-royal-maroon-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-vibes text-4xl text-royal-gold">
              Royal Shaadi
            </h3>
            <p className="text-royal-ivory/80 text-sm">
              Curating exceptional wedding experiences across India. Your dream
              celebration deserves nothing but the finest.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-royal-gold/20 hover:bg-royal-gold flex items-center justify-center transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-royal-gold/20 hover:bg-royal-gold flex items-center justify-center transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-royal-gold/20 hover:bg-royal-gold flex items-center justify-center transition-all duration-300"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4 text-royal-gold">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/vendors"
                  className="text-royal-ivory/80 hover:text-royal-gold transition-colors"
                >
                  Browse Vendors
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-royal-ivory/80 hover:text-royal-gold transition-colors"
                >
                  Wedding Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-royal-ivory/80 hover:text-royal-gold transition-colors"
                >
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-royal-ivory/80 hover:text-royal-gold transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Vendor Categories */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4 text-royal-gold">
              Vendor Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/vendors?category=venue"
                  className="text-royal-ivory/80 hover:text-royal-gold transition-colors"
                >
                  Wedding Venues
                </Link>
              </li>
              <li>
                <Link
                  href="/vendors?category=photographer"
                  className="text-royal-ivory/80 hover:text-royal-gold transition-colors"
                >
                  Photographers
                </Link>
              </li>
              <li>
                <Link
                  href="/vendors?category=decorator"
                  className="text-royal-ivory/80 hover:text-royal-gold transition-colors"
                >
                  Decorators
                </Link>
              </li>
              <li>
                <Link
                  href="/vendors?category=caterer"
                  className="text-royal-ivory/80 hover:text-royal-gold transition-colors"
                >
                  Caterers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4 text-royal-gold">
              Get in Touch
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-royal-gold flex-shrink-0 mt-0.5" />
                <span className="text-royal-ivory/80 text-sm">
                  Lucknow, Uttar Pradesh, India
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-royal-gold flex-shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="text-royal-ivory/80 hover:text-royal-gold transition-colors text-sm"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-royal-gold flex-shrink-0" />
                <a
                  href="mailto:hello@royalshaadi.co.in"
                  className="text-royal-ivory/80 hover:text-royal-gold transition-colors text-sm"
                >
                  hello@royalshaadi.co.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-royal-gold/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-royal-ivory/60 text-sm">
              © {currentYear} Royal Shaadi. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-royal-ivory/60 hover:text-royal-gold transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-royal-ivory/60 hover:text-royal-gold transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/contact"
                className="text-royal-ivory/60 hover:text-royal-gold transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}