import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState("");

  const navItems = [
    { name: "Home", href: "#" },
    { name: "NIC Code", href: "#" },
    { 
      name: "Useful Documents", 
      href: "#",
      dropdown: [
        { name: "Registration Guide", href: "#" },
        { name: "FAQs", href: "#" },
        { name: "Forms", href: "#" }
      ]
    },
    { 
      name: "Print / Verify", 
      href: "#",
      dropdown: [
        { name: "Print Certificate", href: "#" },
        { name: "Verify Certificate", href: "#" }
      ]
    },
    { 
      name: "Update Details", 
      href: "#",
      dropdown: [
        { name: "Update Registration", href: "#" },
        { name: "Renewal", href: "#" }
      ]
    },
    { 
      name: "Login", 
      href: "#",
      dropdown: [
        { name: "Enterprise Login", href: "#" },
        { name: "Official Login", href: "#" }
      ]
    }
  ];

  return (
    <header className="gov-header">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/25232eba-8a50-42e5-821f-c40fac8dc7d2.png"
                alt="Government of India"
                className="h-10 w-auto"
              />
              <div className="hidden md:block">
                <div className="text-sm font-medium text-white">सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय</div>
                <div className="text-xs text-white/90">Ministry of Micro, Small & Medium Enterprises</div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(item.name)}
                    onMouseLeave={() => setDropdownOpen("")}
                  >
                    <button className="gov-nav-link flex items-center space-x-1">
                      <span>{item.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {dropdownOpen === item.name && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                        {item.dropdown.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a href={item.href} className="gov-nav-link">
                    {item.name}
                  </a>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/10 rounded-md mt-2 mb-4">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;