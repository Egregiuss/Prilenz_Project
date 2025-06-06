// Initialize AOS animation library
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
  });
});

// Sample image URLs (replace these with your own images later)
const sampleImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e',
    title: 'Mountain Lake',
    description: 'Serene mountain lake at sunset',
    category: 'landscape'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b',
    title: 'Forest Path',
    description: 'Mystical path through an autumn forest',
    category: 'landscape'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    title: 'Foggy Mountains',
    description: 'Mountains shrouded in morning fog',
    category: 'landscape'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
    title: 'Forest Lake',
    description: 'Calm lake surrounded by pine trees',
    category: 'nature'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
    title: 'Sunset Valley',
    description: 'Golden hour in the valley',
    category: 'nature'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1500534623283-312aade485b7',
    title: 'Coastal Cliffs',
    description: 'Dramatic ocean cliffs at dusk',
    category: 'seascape'
  },
];

// Custom React hooks
const useIntersectionObserver = (ref, options) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);
  
  return isIntersecting;
};

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = React.useState(0);
  
  React.useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.pageYOffset);
    };
    
    window.addEventListener('scroll', updatePosition);
    updatePosition();
    
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);
  
  return scrollPosition;
};

// Context for theme
const ThemeContext = React.createContext();

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = React.useState(false);
  
  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);
  
  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Header Component with animation
const Header = () => {
  const scrollPosition = useScrollPosition();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { darkMode, setDarkMode } = React.useContext(ThemeContext);
  
  React.useEffect(() => {
    const header = document.querySelector('header');
    if (scrollPosition > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, [scrollPosition]);

  return (
    <header>
      <div className="container">
        <nav>
          <a href="#" className="logo">Prilenz</a>
          <div className="nav-right">
            <button 
              className="theme-toggle" 
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
            </button>
            <button 
              className={`menu-toggle ${menuOpen ? 'active' : ''}`} 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
              <li><a href="#gallery" onClick={() => setMenuOpen(false)}>Gallery</a></li>
              <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
              <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

// Hero Component with parallax effect
const Hero = () => {
  const heroRef = React.useRef(null);
  
  React.useEffect(() => {
    const parallaxEffect = () => {
      const scrollPosition = window.pageYOffset;
      if (heroRef.current) {
        heroRef.current.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      }
    };
    
    window.addEventListener('scroll', parallaxEffect);
    return () => window.removeEventListener('scroll', parallaxEffect);
  }, []);
  
  const heroStyle = {
    backgroundImage: `url(${sampleImages[0].url}?auto=format&fit=crop&w=1920&q=80)`
  };
  
  return (
    <section className="hero" style={heroStyle} ref={heroRef}>
      <div className="hero-overlay"></div>
      <div className="container">
        <div className="hero-content" data-aos="fade-up" data-aos-delay="200">
          <h1>Capturing Life's Beautiful Moments</h1>
          <p>Professional photography that tells your unique story through stunning visuals</p>
          <a href="#gallery" className="btn">View Gallery</a>
        </div>
      </div>
    </section>
  );
};

// Gallery Filter Component
const GalleryFilter = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="gallery-filter" data-aos="fade-up">
      <button 
        className={activeCategory === 'all' ? 'active' : ''} 
        onClick={() => setActiveCategory('all')}
      >
        All
      </button>
      {categories.map(category => (
        <button 
          key={category} 
          className={activeCategory === category ? 'active' : ''} 
          onClick={() => setActiveCategory(category)}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
};

// Gallery Item Component with lazy loading
const GalleryItem = ({ image, index }) => {
  const itemRef = React.useRef(null);
  const isVisible = useIntersectionObserver(itemRef, { threshold: 0.1 });
  
  React.useEffect(() => {
    if (isVisible && itemRef.current) {
      gsap.to(itemRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.1
      });
    }
  }, [isVisible, index]);
  
  return (
    <div 
      className="gallery-item" 
      ref={itemRef} 
      style={{ opacity: 0, transform: 'translateY(20px)' }}
    >
      <img 
        src={`${image.url}?auto=format&fit=crop&w=600&q=80`} 
        alt={image.title} 
        loading="lazy" 
      />
      <div className="gallery-caption">
        <h3>{image.title}</h3>
        <p>{image.description}</p>
      </div>
    </div>
  );
};

// Gallery Component with filtering and masonry layout
const Gallery = () => {
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [filteredImages, setFilteredImages] = React.useState(sampleImages);
  const galleryRef = React.useRef(null);
  
  // Extract unique categories
  const categories = [...new Set(sampleImages.map(img => img.category))];
  
  React.useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredImages(sampleImages);
    } else {
      setFilteredImages(sampleImages.filter(img => img.category === activeCategory));
    }
  }, [activeCategory]);
  
  React.useEffect(() => {
    // Initialize Masonry layout after images are loaded
    if (galleryRef.current) {
      const grid = galleryRef.current;
      imagesLoaded(grid, function() {
        new Masonry(grid, {
          itemSelector: '.gallery-item',
          columnWidth: '.gallery-item',
          percentPosition: true
        });
      });
    }
  }, [filteredImages]);
  
  return (
    <section id="gallery" className="gallery">
      <div className="container">
        <div className="section-title" data-aos="fade-up">
          <h2>Photo Gallery</h2>
          <p>Explore our collection of breathtaking moments captured through the lens</p>
        </div>
        
        <GalleryFilter 
          categories={categories} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />
        
        <div className="gallery-grid" ref={galleryRef}>
          {filteredImages.map((image, index) => (
            <GalleryItem key={image.id} image={image} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// About Component with scroll animations
const About = () => {
  const aboutRef = React.useRef(null);
  
  React.useEffect(() => {
    if (aboutRef.current) {
      ScrollTrigger.create({
        trigger: aboutRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.to(".about-image", {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out"
          });
          gsap.to(".about-text", {
            x: 0,
            opacity: 1,
            duration: 1,
            delay: 0.3,
            ease: "power3.out"
          });
        }
      });
    }
  }, []);
  
  return (
    <section id="about" className="about" ref={aboutRef}>
      <div className="container">
        <div className="about-content">
          <div className="about-image" style={{ transform: 'translateX(-50px)', opacity: 0 }}>
            <img src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=600&q=80" alt="Photographer" />
          </div>
          <div className="about-text" style={{ transform: 'translateX(50px)', opacity: 0 }}>
            <h2>About Prilenz Photography</h2>
            <p>Welcome to Prilenz Photography, where we capture life's most precious moments through our lens. With years of experience and a passion for visual storytelling, we specialize in creating stunning imagery that stands the test of time.</p>
            <p>Our philosophy is simple: every photograph should tell a story and evoke emotion. Whether it's a breathtaking landscape, a candid portrait, or a special event, we approach each project with creativity, technical expertise, and attention to detail.</p>
            <p>We believe that photography is not just about taking pictures—it's about creating art that resonates with the viewer and preserves memories for generations to come.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact Form with creative elements and animations
const Contact = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    service: 'portrait'
  });
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('form');
  const formRef = React.useRef(null);
  
  // Floating label effect
  React.useEffect(() => {
    const inputs = document.querySelectorAll('.floating-input');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });
      input.addEventListener('blur', () => {
        if (input.value === '') {
          input.parentElement.classList.remove('focused');
        }
      });
      // Check initial state
      if (input.value !== '') {
        input.parentElement.classList.add('focused');
      }
    });
  }, [activeTab]);
  
  // Animated background
  React.useEffect(() => {
    if (formRef.current) {
      const particles = [];
      const colors = ['#6c63ff', '#5a52d5', '#837dff', '#4a45b5'];
      
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.width = `${Math.random() * 10 + 5}px`;
        particle.style.height = particle.style.width;
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        formRef.current.appendChild(particle);
        particles.push(particle);
      }
      
      return () => {
        particles.forEach(particle => {
          if (formRef.current && formRef.current.contains(particle)) {
            formRef.current.removeChild(particle);
          }
        });
      };
    }
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Animate form submission
      gsap.to(formRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          // Simulate API call
          setTimeout(() => {
            setIsSubmitting(false);
            setSubmitSuccess(true);
            setFormData({ name: '', email: '', subject: '', message: '', service: 'portrait' });
            
            // Animate success message
            gsap.fromTo('.success-message', 
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5 }
            );
            
            // Reset success message after 5 seconds
            setTimeout(() => {
              gsap.to('.success-message', {
                y: -20,
                opacity: 0,
                duration: 0.5,
                onComplete: () => setSubmitSuccess(false)
              });
            }, 5000);
          }, 1500);
        }
      });
    } else {
      // Shake form on error
      gsap.to(formRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5
      });
    }
  };
  
  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-title" data-aos="fade-up">
          <h2>Get In Touch</h2>
          <p>Have a project in mind or want to learn more about our services? Send us a message!</p>
        </div>
        
        <div className="contact-tabs" data-aos="fade-up">
          <button 
            className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            <i className="fas fa-envelope"></i> Contact Form
          </button>
          <button 
            className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <i className="fas fa-info-circle"></i> Contact Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            <i className="fas fa-question-circle"></i> FAQ
          </button>
        </div>
        
        <div className="tab-content" data-aos="fade-up" data-aos-delay="200">
          {activeTab === 'form' && (
            <div className="contact-form-container" ref={formRef}>
              {submitSuccess ? (
                <div className="success-message">
                  <div className="success-animation">
                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                      <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                      <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                  </div>
                  <h3>Thank you!</h3>
                  <p>Your message has been sent successfully.</p>
                  <p className="success-details">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-header">
                    <div className="form-icon">
                      <i className="fas fa-paper-plane"></i>
                    </div>
                    <h3>Send us a message</h3>
                  </div>
                  
                  <div className="form-row">
                    <div className="floating-label-group">
                      <input 
                        type="text" 
                        id="name" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`floating-input ${errors.name ? 'error' : ''}`}
                      />
                      <label className="floating-label">Your Name</label>
                      {errors.name && <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.name}</span>}
                    </div>
                    
                    <div className="floating-label-group">
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`floating-input ${errors.email ? 'error' : ''}`}
                      />
                      <label className="floating-label">Your Email</label>
                      {errors.email && <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.email}</span>}
                    </div>
                  </div>
                  
                  <div className="floating-label-group">
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`floating-input ${errors.subject ? 'error' : ''}`}
                    />
                    <label className="floating-label">Subject</label>
                    {errors.subject && <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.subject}</span>}
                  </div>
                  
                  <div className="form-group service-selector">
                    <label>Service Type</label>
                    <div className="service-options">
                      <label className={`service-option ${formData.service === 'portrait' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="service" 
                          value="portrait" 
                          checked={formData.service === 'portrait'}
                          onChange={handleChange}
                        />
                        <i className="fas fa-user"></i>
                        <span>Portrait</span>
                      </label>
                      <label className={`service-option ${formData.service === 'wedding' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="service" 
                          value="wedding" 
                          checked={formData.service === 'wedding'}
                          onChange={handleChange}
                        />
                        <i className="fas fa-heart"></i>
                        <span>Wedding</span>
                      </label>
                      <label className={`service-option ${formData.service === 'event' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="service" 
                          value="event" 
                          checked={formData.service === 'event'}
                          onChange={handleChange}
                        />
                        <i className="fas fa-calendar-alt"></i>
                        <span>Event</span>
                      </label>
                      <label className={`service-option ${formData.service === 'commercial' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="service" 
                          value="commercial" 
                          checked={formData.service === 'commercial'}
                          onChange={handleChange}
                        />
                        <i className="fas fa-building"></i>
                        <span>Commercial</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="floating-label-group">
                    <textarea 
                      id="message" 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className={`floating-input ${errors.message ? 'error' : ''}`}
                    ></textarea>
                    <label className="floating-label">Your Message</label>
                    {errors.message && <span className="error-message"><i className="fas fa-exclamation-circle"></i> {errors.message}</span>}
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn submit-btn" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="btn-content">
                        <span className="spinner"></span>
                        <span className="btn-text">Sending...</span>
                      </span>
                    ) : (
                      <span className="btn-content">
                        <i className="fas fa-paper-plane"></i>
                        <span className="btn-text">Send Message</span>
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
          
          {activeTab === 'info' && (
            <div className="contact-info">
              <div className="info-cards">
                <div className="info-card" data-aos="zoom-in" data-aos-delay="100">
                  <div className="info-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <h3>Our Location</h3>
                  <p>123 Photography Lane</p>
                  <p>New York, NY 10001</p>
                </div>
                
                <div className="info-card" data-aos="zoom-in" data-aos-delay="200">
                  <div className="info-icon">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <h3>Call Us</h3>
                  <p>+1 (555) 123-4567</p>
                  <p>Mon-Fri: 9am - 6pm</p>
                </div>
                
                <div className="info-card" data-aos="zoom-in" data-aos-delay="300">
                  <div className="info-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <h3>Email Us</h3>
                  <p>info@prilenz.com</p>
                  <p>support@prilenz.com</p>
                </div>
              </div>
              
              <div className="map-container" data-aos="fade-up">
                <div className="map-placeholder">
                  <i className="fas fa-map"></i>
                  <p>Interactive Map</p>
                  <span>(Map would be embedded here)</span>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'faq' && (
            <div className="faq-section">
              <div className="faq-item" data-aos="fade-up" data-aos-delay="100">
                <div className="faq-question" onClick={(e) => {
                  e.currentTarget.parentElement.classList.toggle('active');
                }}>
                  <h3>What types of photography do you offer?</h3>
                  <i className="fas fa-chevron-down"></i>
                </div>
                <div className="faq-answer">
                  <p>We offer a wide range of photography services including portrait, wedding, event, commercial, and landscape photography. Each service is tailored to meet your specific needs and vision.</p>
                </div>
              </div>
              
              <div className="faq-item" data-aos="fade-up" data-aos-delay="200">
                <div className="faq-question" onClick={(e) => {
                  e.currentTarget.parentElement.classList.toggle('active');
                }}>
                  <h3>How far in advance should I book?</h3>
                  <i className="fas fa-chevron-down"></i>
                </div>
                <div className="faq-answer">
                  <p>For weddings and major events, we recommend booking 6-12 months in advance. For portraits and smaller sessions, 2-4 weeks notice is usually sufficient, but availability may vary during peak seasons.</p>
                </div>
              </div>
              
              <div className="faq-item" data-aos="fade-up" data-aos-delay="300">
                <div className="faq-question" onClick={(e) => {
                  e.currentTarget.parentElement.classList.toggle('active');
                }}>
                  <h3>Do you provide digital files or printed photos?</h3>
                  <i className="fas fa-chevron-down"></i>
                </div>
                <div className="faq-answer">
                  <p>We provide both! All packages include high-resolution digital files. We also offer professional printing services for those who want physical copies, albums, or wall art.</p>
                </div>
              </div>
              
              <div className="faq-item" data-aos="fade-up" data-aos-delay="400">
                <div className="faq-question" onClick={(e) => {
                  e.currentTarget.parentElement.classList.toggle('active');
                }}>
                  <h3>What is your cancellation policy?</h3>
                  <i className="fas fa-chevron-down"></i>
                </div>
                <div className="faq-answer">
                  <p>We understand that plans can change. Cancellations made 30+ days before the scheduled session receive a full refund minus the deposit. Cancellations within 30 days are subject to our detailed policy which will be provided in your contract.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="social-links">
          <a href="#" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" aria-label="Facebook">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
        </div>
        <p className="footer-text">© {new Date().getFullYear()} Prilenz Photography. All rights reserved.</p>
      </div>
    </footer>
  );
};

// Main App Component
const App = () => {
  React.useEffect(() => {
    // Initialize GSAP animations
    gsap.from('.logo', { 
      opacity: 0, 
      y: -20, 
      duration: 1, 
      ease: 'power3.out' 
    });
    
    gsap.from('.nav-links li', { 
      opacity: 0, 
      y: -20, 
      duration: 0.8, 
      stagger: 0.2, 
      ease: 'power3.out' 
    });
  }, []);

  return (
    <ThemeProvider>
      <Header />
      <Hero />
      <Gallery />
      <About />
      <Contact />
      <Footer />
    </ThemeProvider>
  );
};

// Render the App
ReactDOM.createRoot(document.getElementById('root')).render(<App />);