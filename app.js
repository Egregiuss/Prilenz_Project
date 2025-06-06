// Main React application for Prilenz Photography

// Sample image URLs (replace these with your own images later)
const sampleImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e',
    title: 'Mountain Lake',
    description: 'Serene mountain lake at sunset'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b',
    title: 'Forest Path',
    description: 'Mystical path through an autumn forest'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    title: 'Foggy Mountains',
    description: 'Mountains shrouded in morning fog'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
    title: 'Forest Lake',
    description: 'Calm lake surrounded by pine trees'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
    title: 'Sunset Valley',
    description: 'Golden hour in the valley'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1500534623283-312aade485b7',
    title: 'Coastal Cliffs',
    description: 'Dramatic ocean cliffs at dusk'
  },
];

// Header Component
const Header = () => {
  return (
    <header>
      <div className="container">
        <nav>
          <a href="#" className="logo">Prilenz</a>
          <ul className="nav-links">
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

// Hero Component
const Hero = () => {
  const heroStyle = {
    backgroundImage: `url(${sampleImages[0].url}?auto=format&fit=crop&w=1920&q=80)`
  };
  
  return (
    <section className="hero" style={heroStyle}>
      <div className="hero-overlay"></div>
      <div className="container">
        <div className="hero-content">
          <h1>Capturing Life's Beautiful Moments</h1>
          <p>Professional photography that tells your unique story through stunning visuals</p>
          <a href="#gallery" className="btn">View Gallery</a>
        </div>
      </div>
    </section>
  );
};

// Gallery Item Component
const GalleryItem = ({ image }) => {
  return (
    <div className="gallery-item">
      <img src={`${image.url}?auto=format&fit=crop&w=600&q=80`} alt={image.title} />
      <div className="gallery-caption">
        <h3>{image.title}</h3>
        <p>{image.description}</p>
      </div>
    </div>
  );
};

// Gallery Component
const Gallery = () => {
  return (
    <section id="gallery" className="gallery">
      <div className="container">
        <div className="section-title">
          <h2>Photo Gallery</h2>
          <p>Explore our collection of breathtaking moments captured through the lens</p>
        </div>
        <div className="gallery-grid">
          {sampleImages.map(image => (
            <GalleryItem key={image.id} image={image} />
          ))}
        </div>
      </div>
    </section>
  );
};

// About Component
const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-content">
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=600&q=80" alt="Photographer" />
          </div>
          <div className="about-text">
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

// Contact Component
const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! This is a demo form.');
  };
  
  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-title">
          <h2>Get In Touch</h2>
          <p>Have a project in mind or want to learn more about our services? Send us a message!</p>
        </div>
        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" required></textarea>
            </div>
            <button type="submit" className="btn">Send Message</button>
          </form>
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
  return (
    <React.Fragment>
      <Header />
      <Hero />
      <Gallery />
      <About />
      <Contact />
      <Footer />
    </React.Fragment>
  );
};

// Render the App
ReactDOM.createRoot(document.getElementById('root')).render(<App />);