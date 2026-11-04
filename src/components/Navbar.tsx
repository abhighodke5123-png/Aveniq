import React, { useState, useEffect } from 'react';
import { BrandMonogram } from './BrandMonogram';
import { Menu, X, ArrowUpRight, Compass, Layers, Building, FolderKanban, Info } from 'lucide-react';
import { PageId, formatPageUrl } from '../utils/router';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navItems: { id: PageId; label: string; number: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', number: '01', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'services', label: 'Services', number: '02', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'industries', label: 'Industries', number: '03', icon: <Building className="w-3.5 h-3.5" /> },
    { id: 'work', label: 'Work', number: '04', icon: <FolderKanban className="w-3.5 h-3.5" /> },
    { id: 'about', label: 'About', number: '05', icon: <Info className="w-3.5 h-3.5" /> },
  ];

  const handleLinkClick = (e: React.MouseEvent, page: PageId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F7F6F2]/95 backdrop-blur-md border-b border-[#E5E2DC] shadow-[0_4px_24px_-10px_rgba(0,0,0,0.06)] py-3'
            : 'bg-[#F7F6F2]/85 backdrop-blur-sm border-b border-[#E5E2DC]/60 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Brand Monogram & Wordmark */}
          <a
            href={formatPageUrl('home')}
            onClick={(e) => handleLinkClick(e, 'home')}
            className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#91A99B] shrink-0"
            aria-label="AVENIQ Homepage"
          >
            <BrandMonogram size={30} className="group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-heading text-lg font-extrabold tracking-widest text-[#17191D] uppercase leading-none">
                AVENIQ
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#777873] font-medium mt-0.5 hidden sm:inline">
                Digital Studio
              </span>
            </div>
          </a>

          {/* Centre: Distinctly Differentiated Page Navigation Buttons */}
          <nav
            className="hidden md:flex items-center gap-1.5 lg:gap-2"
            aria-label="Primary Navigation"
          >
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <a
                  key={item.id}
                  href={formatPageUrl(item.id)}
                  onClick={(e) => handleLinkClick(e, item.id)}
                  className={`group relative flex items-center gap-2 px-3.5 lg:px-4 py-2 text-xs transition-all duration-200 border ${
                    isActive
                      ? 'bg-[#17191D] text-[#F7F6F2] border-[#17191D] shadow-sm font-bold'
                      : 'bg-white/80 text-[#17191D] border-[#E5E2DC] hover:border-[#17191D] hover:bg-white font-medium'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span
                    className={`font-mono text-[10px] transition-colors ${
                      isActive ? 'text-[#91A99B] font-bold' : 'text-[#777873] group-hover:text-[#17191D]'
                    }`}
                  >
                    {item.number}
                  </span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#91A99B]" aria-hidden="true" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right: Start a Project Button & Mobile Menu Trigger */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('contact');
              }}
              aria-current={currentPage === 'contact' ? 'page' : undefined}
              className={`group inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold tracking-wider uppercase transition-all duration-200 border ${
                currentPage === 'contact'
                  ? 'bg-[#91A99B] text-[#17191D] border-[#17191D] shadow-sm'
                  : 'bg-[#17191D] text-[#F7F6F2] hover:bg-[#252830] border-[#17191D] active:scale-[0.98]'
              }`}
            >
              <span>Start a Project</span>
              <ArrowUpRight
                className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                  currentPage === 'contact' ? 'text-[#17191D]' : 'text-[#91A99B]'
                }`}
              />
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#17191D] bg-white border border-[#E5E2DC] hover:border-[#17191D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#91A99B]"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#17191D]/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-4/5 max-w-sm h-full bg-[#F7F6F2] border-l border-[#E5E2DC] shadow-2xl p-6 pt-24 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center gap-3 pb-6 mb-6 border-b border-[#E5E2DC]">
                <BrandMonogram size={32} />
                <div>
                  <div className="font-heading font-bold text-base tracking-widest uppercase">
                    AVENIQ
                  </div>
                  <div className="text-xs text-[#777873]">Designed to move business forward.</div>
                </div>
              </div>

              <div className="text-[11px] font-mono uppercase tracking-widest text-[#777873] font-semibold mb-3">
                Dedicated Studio Pages
              </div>

              <ul className="space-y-2.5">
                {navItems.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={formatPageUrl(item.id)}
                        onClick={(e) => handleLinkClick(e, item.id)}
                        className={`flex items-center justify-between p-3.5 border transition-all ${
                          isActive
                            ? 'bg-[#17191D] text-white border-[#17191D] font-bold'
                            : 'bg-white text-[#17191D] border-[#E5E2DC] hover:border-[#17191D]'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-mono text-xs ${
                              isActive ? 'text-[#91A99B]' : 'text-[#777873]'
                            }`}
                          >
                            {item.number}
                          </span>
                          <span className="font-heading text-base">{item.label}</span>
                        </div>

                        {isActive ? (
                          <span className="w-2 h-2 rounded-full bg-[#91A99B]" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-[#777873]" />
                        )}
                      </a>
                    </li>
                  );
                })}

                {/* Contact Page in Mobile Menu */}
                <li>
                  <a
                    href={formatPageUrl('contact')}
                    onClick={(e) => handleLinkClick(e, 'contact')}
                    className={`flex items-center justify-between p-3.5 border transition-all mt-2 ${
                      currentPage === 'contact'
                        ? 'bg-[#91A99B] text-[#17191D] border-[#17191D] font-bold'
                        : 'bg-[#17191D] text-[#F7F6F2] border-[#17191D] hover:bg-[#252830]'
                    }`}
                    aria-current={currentPage === 'contact' ? 'page' : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs">06</span>
                      <span className="font-heading text-base">Start a Project</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-[#E5E2DC] mt-6">
              <div className="p-3 bg-[#EAE8E1]/70 border border-[#E5E2DC] text-[11px] text-[#777873] space-y-1">
                <div className="font-bold text-[#17191D]">Global Studio Presence</div>
                <div>India · USA · UK · Australia · Canada · Global</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
