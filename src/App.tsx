import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { IndustriesPage } from './pages/IndustriesPage';
import { WorkPage } from './pages/WorkPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ProjectModal } from './components/ProjectModal';
import { ServiceModal } from './components/ServiceModal';
import { PrivacyModal } from './components/PrivacyModal';
import { ConceptProject, ServiceItem, ServiceCategory } from './types';
import { PageId, parsePageFromPath, formatPageUrl, ROUTES } from './utils/router';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(() => {
    if (typeof window !== 'undefined') {
      const fromHash = parsePageFromPath(window.location.hash);
      if (fromHash !== 'home') return fromHash;
      return parsePageFromPath(window.location.pathname);
    }
    return 'home';
  });

  const [selectedProject, setSelectedProject] = useState<ConceptProject | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [activeEnquiryService, setActiveEnquiryService] = useState<ServiceCategory>('Hospital Website');

  // Synchronize browser history and hash
  useEffect(() => {
    const handlePopState = () => {
      const page = parsePageFromPath(window.location.hash || window.location.pathname);
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Update page title when route changes
  useEffect(() => {
    const routeInfo = ROUTES[currentPage];
    if (routeInfo) {
      document.title = routeInfo.title;
    }
  }, [currentPage]);

  // Close open modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
        setSelectedService(null);
        setIsPrivacyOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (page: PageId, options?: { service?: ServiceCategory }) => {
    if (options?.service) {
      setActiveEnquiryService(options.service);
    }
    setCurrentPage(page);
    window.history.pushState(null, '', formatPageUrl(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartSimilarProject = (project: ConceptProject) => {
    let targetService: ServiceCategory = 'Business Website';
    if (project.industry === 'Healthcare') {
      targetService = project.category.includes('Dental') ? 'Clinic Website' : 'Hospital Website';
    } else if (project.industry === 'Technology') {
      targetService = 'AI & Automation';
    }
    setActiveEnquiryService(targetService);
    handleNavigate('contact');
  };

  const handleInitiateService = (service: ServiceItem) => {
    let cat: ServiceCategory = 'Business Website';
    if (service.id === 'digital-experiences') cat = 'Hospital Website';
    else if (service.id === 'brand-creative') cat = 'Website Redesign';
    else if (service.id === 'search-growth') cat = 'SEO & Digital Growth';
    else if (service.id === 'ai-automation') cat = 'AI & Automation';

    setActiveEnquiryService(cat);
    handleNavigate('contact');
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#17191D] flex flex-col font-sans selection:bg-[#91A99B]/30 selection:text-[#17191D]">
      {/* Sticky Studio Navigation with clearly differentiated buttons */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Main Routed Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectProject={(project) => setSelectedProject(project)}
            onSelectService={(service) => setSelectedService(service)}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            onNavigate={handleNavigate}
            onSelectServiceModal={(service) => setSelectedService(service)}
            onInitiateServiceInquiry={(category) => {
              setActiveEnquiryService(category);
              handleNavigate('contact');
            }}
          />
        )}

        {currentPage === 'industries' && (
          <IndustriesPage
            onNavigate={handleNavigate}
            onInitiateIndustryInquiry={(category) => {
              setActiveEnquiryService(category);
              handleNavigate('contact');
            }}
          />
        )}

        {currentPage === 'work' && (
          <WorkPage
            onNavigate={handleNavigate}
            onSelectProject={(project) => setSelectedProject(project)}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            key={activeEnquiryService}
            initialService={activeEnquiryService}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Global Studio Footer with Page Navigation */}
      <Footer
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onNavigatePage={handleNavigate}
      />

      {/* Concept Project Architectural Blueprint Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onStartSimilarProject={handleStartSimilarProject}
      />

      {/* Service Capabilities Modal */}
      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onInitiateService={handleInitiateService}
      />

      {/* Privacy Policy Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}
