import React from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { APP_HEADERS } from "@/config/headers.config";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface text-text-secondary mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center" aria-label="Mercora Home">
              <Logo height={28} />
            </Link>
            <p className="text-xs text-text-muted leading-relaxed">
              {APP_HEADERS.footer.aboutText}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li><Link href="/businesses" className="hover:text-primary transition-colors">All Businesses</Link></li>
              <li><Link href="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
              <li><Link href="/locations" className="hover:text-primary transition-colors">State & Cities</Link></li>
              <li><Link href="/saved-businesses" className="hover:text-primary transition-colors">Saved Bookmarks</Link></li>
            </ul>
          </div>

          {/* Buyer Services */}
          <div>
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
              Buyers & Suppliers
            </h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li><Link href="/businesses?type=Manufacturer" className="hover:text-primary transition-colors">Manufacturers</Link></li>
              <li><Link href="/businesses?type=Wholesaler" className="hover:text-primary transition-colors">Wholesalers</Link></li>
              <li><Link href="/businesses?type=Exporter" className="hover:text-primary transition-colors">Exporters</Link></li>
              <li><Link href="/enquiries" className="hover:text-primary transition-colors">Post Inquiry</Link></li>
            </ul>
          </div>

          {/* Legal / Company */}
          <div>
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-xs text-text-muted">
          <p>{APP_HEADERS.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
