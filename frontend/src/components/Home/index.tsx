import './Home.css';

export default function Home() {
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="landing-page">
            {/* Top Navigation Bar */}
            <nav className="top-nav">
                <div className="nav-container">
                    <div className="nav-left">
                        <a href="/" className="logo-link" onClick={() => scrollToSection('hero')}>
                            <img src="/favicon.ico" alt="FlixShare" className="favicon" />
                            <span className="brand-name">FlixShare</span>
                        </a>
                        <button 
                            className="nav-link" 
                            onClick={() => scrollToSection('about')}
                        >
                            About
                        </button>
                        <button 
                            className="nav-link" 
                            onClick={() => scrollToSection('contact')}
                        >
                            Contact Us
                        </button>
                    </div>
                    <div className="nav-right">
                        <a href="/auth/register" className="signup-btn">
                            Sign Up
                        </a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="hero" className="hero-section">
                <div className="hero-container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Automate Your Shared <br />
                            <span className="highlight">Streaming Payments</span>
                        </h1>
                        <p className="hero-description">
                            FlixShare is the ultimate platform for premium streaming subscribers who use shared accounts. 
                            Automate your monthly payments for Spotify, YouTube Premium, Netflix, and more with ease.
                        </p>
                        <div className="hero-buttons">
                            <a href="/auth/register" className="cta-primary">
                                Get Started Free
                            </a>
                            <button 
                                className="cta-secondary"
                                onClick={() => scrollToSection('about')}
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="feature-cards">
                            <div className="feature-card">
                                <div className="card-icon">
                                    <img src="/services/spotify.png" alt="Spotify" className="service-icon" />
                                </div>
                                <h3>Spotify</h3>
                            </div>
                            <div className="feature-card">
                                <div className="card-icon">
                                    <img src="/services/youtube.png" alt="YouTube" className="service-icon" />
                                </div>
                                <h3>YouTube</h3>
                            </div>
                            <div className="feature-card">
                                <div className="card-icon">
                                    <img src="/services/netflix.png" alt="Netflix" className="service-icon" />
                                </div>
                                <h3>Netflix</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2>About FlixShare</h2>
                        <p>Revolutionizing how shared streaming accounts handle payments</p>
                    </div>
                    <div className="about-content">
                        <div className="about-grid">
                            <div className="about-item">
                                <div className="about-icon">⚡</div>
                                <h3>Automated Payments</h3>
                                <p>Set up once and let FlixShare handle all your monthly streaming payments automatically.</p>
                            </div>
                            <div className="about-item">
                                <div className="about-icon">🔒</div>
                                <h3>Secure & Reliable</h3>
                                <p>Bank-level security ensures your payment information is always protected and transactions are reliable.</p>
                            </div>
                            <div className="about-item">
                                <div className="about-icon">👥</div>
                                <h3>Easy Sharing</h3>
                                <p>Perfect for families, friends, and roommates sharing premium streaming subscriptions.</p>
                            </div>
                            <div className="about-item">
                                <div className="about-icon">💰</div>
                                <h3>Cost Effective</h3>
                                <p>Split costs fairly and transparently with automated billing and payment tracking.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="contact-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2>Get in Touch</h2>
                        <p>Have questions? We'd love to hear from you</p>
                    </div>
                    <div className="contact-content">
                        <div className="contact-grid">
                            <div className="contact-item">
                                <div className="contact-icon">📧</div>
                                <h3>Email Us</h3>
                                <p>support@flixshare.com</p>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon">💬</div>
                                <h3>Live Chat</h3>
                                <p>Available 24/7 for your convenience</p>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon">📱</div>
                                <h3>Follow Us</h3>
                                <p>Stay updated with our latest features</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <img src="/favicon.ico" alt="FlixShare" className="footer-logo" />
                            <span className="footer-brand-name">FlixShare</span>
                        </div>
                        <div className="footer-links">
                            <a href="/privacy" className="footer-link">Privacy Policy</a>
                            <a href="/terms" className="footer-link">Terms of Service</a>
                            <a href="/support" className="footer-link">Support</a>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 FlixShare. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}