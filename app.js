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
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401',
    title: 'Portrait Study',
    description: 'Artistic portrait with natural lighting',
    category: 'portrait'
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    title: 'Golden Hour Portrait',
    description: 'Portrait captured during golden hour',
    category: 'portrait'
  },
  {
    id: 9,
    url: 'https://images.unsplash.com/photo-1504703395950-b89145a5425b',
    title: 'Fashion Portrait',
    description: 'High fashion portrait in studio setting',
    category: 'portrait'
  },
];

// Custom React hooks
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
              <li><a href="#gallery" onClick={() => setMenuOpen(false)}>Portfolio</a></li>
              <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
              <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

// Hero Component with minimal design
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
  
  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-content" data-aos="fade-up" data-aos-delay="200">
        <h1>Prilenz Photography</h1>
        <p>Capturing moments that last forever</p>
      </div>
    </section>
  );
};

// Gallery Item Component
const GalleryItem = ({ image, onClick }) => {
  return (
    <div className="gallery-item" data-aos="fade-up">
      <img 
        src={`${image.url}?auto=format&fit=crop&w=800&q=80`} 
        alt={image.title} 
        loading="lazy"
        onClick={() => onClick(image)}
      />
      <div className="gallery-item-hover">
        <h3>{image.title}</h3>
        <p>{image.category}</p>
      </div>
    </div>
  );
};

// Gallery Modal Component
const GalleryModal = ({ image, onClose }) => {
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="gallery-modal" onClick={onClose}>
      <button className="modal-close" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <img 
          src={`${image.url}?auto=format&fit=crop&w=1200&q=90`} 
          alt={image.title} 
        />
        <div className="modal-info">
          <h2>{image.title}</h2>
          <p>{image.description}</p>
        </div>
      </div>
    </div>
  );
};

// Gallery Component with filtering
const Gallery = () => {
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [filteredImages, setFilteredImages] = React.useState(sampleImages);
  const [selectedImage, setSelectedImage] = React.useState(null);
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

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };
  
  return (
    <section id="gallery" className="gallery">
      <div className="container">
        <div className="section-title" data-aos="fade-up">
          <h2>Portfolio</h2>
        </div>
        
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
        
        <div className="gallery-grid" ref={galleryRef}>
          {filteredImages.map((image) => (
            <GalleryItem 
              key={image.id} 
              image={image} 
              onClick={handleImageClick}
            />
          ))}
        </div>
      </div>
      
      {selectedImage && (
        <GalleryModal 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </section>
  );
};

// About Component with minimal design
const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-content">
          <div className="about-image" data-aos="fade-right">
            <img src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=600&q=80" alt="Photographer" />
          </div>
          <div className="about-text" data-aos="fade-left">
            <h2>About Me</h2>
            <p>I'm a professional photographer specializing in capturing life's most precious moments through my lens. With years of experience and a passion for visual storytelling, I create stunning imagery that stands the test of time.</p>
            <p>My philosophy is simple: every photograph should tell a story and evoke emotion. Whether it's a breathtaking landscape, a candid portrait, or a special event, I approach each project with creativity, technical expertise, and attention to detail.</p>
            <p>I believe that photography is not just about taking pictures—it's about creating art that resonates with the viewer and preserves memories for generations to come.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact Form with minimal design
const Contact = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      }, 1500);
    }
  };
  
  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-title" data-aos="fade-up">
          <h2>Get In Touch</h2>
        </div>
        
        <div className="contact-content">
          <div className="contact-info" data-aos="fade-right">
            <h3>Contact Information</h3>
            <div className="info-item">
              <i className="fas fa-envelope"></i>
              <p>info@prilenz.com</p>
            </div>
            <div className="info-item">
              <i className="fas fa-phone"></i>
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="info-item">
              <i className="fas fa-map-marker-alt"></i>
              <p>New York, NY</p>
            </div>
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
          </div>
          
          <div className="contact-form-container" data-aos="fade-left">
            {submitSuccess ? (
              <div className="success-message">
                <h3>Thank you!</h3>
                <p>Your message has been sent successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <textarea 
                    id="message" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    className={errors.message ? 'error' : ''}
                  ></textarea>
                  {errors.message && <span className="error-message">{errors.message}</span>}
                </div>
                <button 
                  type="submit" 
                  className="btn" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
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
        <p className="footer-text">© {new Date().getFullYear()} Prilenz Photography. All rights reserved.</p>
      </div>
    </footer>
  );
};

// Main App Component
const App = () => {
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