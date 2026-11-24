import React from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { APP_HEADERS } from "@/config/headers.config";

export function Footer() {
  return (
    <footer className="w-full border-t border-[#3D1B2E] bg-[var(--nav-dark,#2B1220)] text-[#E5D4DA] mt-auto transition-colors select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center" aria-label="Mercora Home">
              <Logo height={28} dark={true} />
            </Link>
            <p className="text-xs text-[#E5D4DA]/70 leading-relaxed font-normal">
              {APP_HEADERS.footer.aboutText}
            </p>
            <div className="text-[11px] text-[#C08497] font-medium tracking-wide">
              Official LGD &amp; India Post Synced · Deal OS
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore Masters
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E5D4DA]/80">
              <li>
                <Link href="/admin/geography" className="hover:text-white transition-colors">
                  Geography Master (8 Tiers)
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  HSN &amp; Customs Tariffs
                </Link>
              </li>
              <li>
                <Link href="/admin/roles" className="hover:text-white transition-colors">
                  RBAC &amp; UBAC Security
                </Link>
              </li>
              <li>
                <Link href="/saved-businesses" className="hover:text-white transition-colors">
                  Saved Bookmarks
                </Link>
              </li>
            </ul>
          </div>

          {/* Buyer & Supplier Networks */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Buyers &amp; Suppliers
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E5D4DA]/80">
              <li>
                <Link href="/businesses?type=Manufacturer" className="hover:text-white transition-colors">
                  Manufacturers
                </Link>
              </li>
              <li>
                <Link href="/businesses?type=Wholesaler" className="hover:text-white transition-colors">
                  Wholesalers
                </Link>
              </li>
              <li>
                <Link href="/businesses?type=Exporter" className="hover:text-white transition-colors">
                  Exporters
                </Link>
              </li>
              <li>
                <Link href="/enquiries" className="hover:text-white transition-colors">
                  Post Trade Inquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Governance */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E5D4DA]/80">
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Console
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Deal OS
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#3D1B2E] flex flex-col sm:flex-row items-center justify-between text-xs text-[#E5D4DA]/50 gap-4">
          <p>{APP_HEADERS.footer.copyright}</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
              <span>India Production v2.4</span>
            </span>
            <span>·</span>
            <span>Zero Drift Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
