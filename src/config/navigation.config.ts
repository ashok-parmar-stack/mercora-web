export const NAVIGATION_CONFIG = {
  brand: {
    name: "Mercora",
    tagline: "Deterministic Master Data & Deal OS",
    logoText: "Mercora",
    homeHref: "/",
  },
  publicLinks: [
    { label: "Home", href: "/" },
    { label: "Businesses", href: "/businesses" },
    { label: "Categories", href: "/categories" },
    { label: "Locations", href: "/locations" },
    { label: "About", href: "/about" },
  ],
  customerLinks: [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Saved Businesses", href: "/saved-businesses", icon: "Bookmark" },
    { label: "My Enquiries", href: "/enquiries", icon: "MessageSquare" },
    { label: "Profile", href: "/profile", icon: "User" },
  ],
  authLinks: {
    login: { label: "Login", href: "/login" },
    register: { label: "Register", href: "/register" },
  },
} as const;
