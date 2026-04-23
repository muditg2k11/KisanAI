import React from 'react';
import Header from './header';
import Footer from './footer';

const aboutStyles = `
  .about-wrap { font-family: 'Inter', sans-serif; color: #333; }
  
  /* Hero Section */
  .about-hero {
    background: linear-gradient(rgba(30, 61, 22, 0.85), rgba(30, 61, 22, 0.85)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80');
    background-size: cover;
    background-position: center;
    padding: 120px 0 100px;
    text-align: center;
    color: white;
    position: relative;
  }
  .about-hero .hero-tag { background: #f4a61e; color: white; padding: 6px 18px; border-radius: 50px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; margin-bottom: 20px; display: inline-block; }
  .about-hero h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 15px; letter-spacing: -0.02em; }
  .about-hero p { font-size: 1.1rem; opacity: 0.9; max-width: 600px; margin: 0 auto; line-height: 1.6; }
  .hero-shape { margin-top: 25px; opacity: 0.6; }

  /* Stats Bar */
  .stats-bar { background: white; padding: 40px 0; box-shadow: 0 10px 40px rgba(0,0,0,0.05); margin-top: -50px; border-radius: 15px; position: relative; z-index: 10; width: 90%; margin-left: auto; margin-right: auto; }
  .stat-item { text-align: center; border-right: 1px solid #eee; }
  .stat-item:last-child { border-right: none; }
  .stat-num { display: block; font-size: 2.2rem; font-weight: 800; color: #2d5a27; margin-bottom: 5px; }
  .stat-label { font-size: 0.9rem; color: #777; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

  /* Welcome Section */
  .welcome-section { padding: 100px 0; }
  .welcome-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .welcome-img-wrap { position: relative; }
  .welcome-img { width: 100%; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.15); }
  .welcome-badge { position: absolute; bottom: -30px; right: -30px; background: #f4a61e; color: white; padding: 30px; border-radius: 15px; text-align: center; box-shadow: 0 15px 35px rgba(244,166,30,0.3); }
  .welcome-badge .years { font-size: 2.5rem; font-weight: 800; line-height: 1; display: block; }
  .welcome-badge .text { font-size: 0.9rem; font-weight: 600; text-transform: uppercase; }

  .section-tag { color: #f4a61e; font-weight: 700; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.1em; display: block; margin-bottom: 15px; }
  .section-title { font-size: 2.5rem; font-weight: 800; color: #1e3d16; margin-bottom: 25px; line-height: 1.2; }
  .section-desc { font-size: 1.1rem; color: #666; line-height: 1.8; margin-bottom: 30px; }
  
  .feature-list { list-style: none; padding: 0; }
  .feature-item { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; font-weight: 600; color: #444; }
  .feature-icon { color: #2d5a27; font-size: 1.2rem; }

  /* Values Section */
  .values-section { background: #f9fbf8; padding: 100px 0; text-align: center; }
  .values-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 50px; }
  .value-card { background: white; padding: 50px 30px; border-radius: 20px; transition: transform 0.3s, box-shadow 0.3s; }
  .value-card:hover { transform: translateY(-10px); box-shadow: 0 20px 50px rgba(45,90,39,0.1); }
  .value-icon { font-size: 3rem; margin-bottom: 25px; display: block; }
  .value-card h3 { font-size: 1.4rem; font-weight: 700; color: #1e3d16; margin-bottom: 15px; }
  .value-card p { color: #777; line-height: 1.6; font-size: 0.95rem; }



  /* CTA Section */
  .about-cta { background: linear-gradient(135deg, #1e3d16, #2d5a27); padding: 80px 0; text-align: center; color: white; border-radius: 30px; margin: 0 40px 100px; }
  .about-cta h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 20px; }
  .about-cta p { font-size: 1.1rem; opacity: 0.9; margin-bottom: 40px; }
  .cta-btns { display: flex; gap: 20px; justify-content: center; }
  .btn-primary { background: #f4a61e; color: white; padding: 16px 40px; border-radius: 50px; font-weight: 700; text-decoration: none; transition: transform 0.2s; }
  .btn-secondary { background: transparent; color: white; border: 2px solid white; padding: 14px 40px; border-radius: 50px; font-weight: 700; text-decoration: none; transition: background 0.2s; }
  .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(244,166,30,0.4); }
  .btn-secondary:hover { background: white; color: #1e3d16; }

  @media (max-width: 992px) {
    .welcome-grid, .values-grid { grid-template-columns: 1fr; }
    .about-hero h1 { font-size: 2.5rem; }
  }

  @media (max-width: 768px) {
    .about-cta {
      margin: 0 15px 50px;
      padding: 50px 20px;
      border-radius: 20px;
    }
    .about-cta h2 {
      font-size: 1.8rem;
    }
    .about-cta p {
      font-size: 1rem;
    }
    .cta-btns {
      flex-direction: column;
      gap: 15px;
    }
    .btn-primary, .btn-secondary {
      width: 100%;
      text-align: center;
      padding: 14px 20px;
    }
  }
`;

function AboutUs() {
  return (
    <div className="about-wrap">
      <style>{aboutStyles}</style>
      <Header />

      {/* Hero */}
      <div className="about-hero">
        <div className="container">
          <span className="hero-tag">Growing Since 1995</span>
          <h1>Our Roots, Your Health</h1>
          <p>We believe in the power of pure, organic farming to transform communities and nourish families with the finest produce nature can offer.</p>
          <div className="hero-shape">
            <img src="/assets/wp-content/uploads/2024/09/pt-shape-after.svg" alt="" style={{ width: '200px' }} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container">
        <div className="stats-bar">
          <div className="row">
            <div className="col-md-3 stat-item">
              <span className="stat-num">25+</span>
              <span className="stat-label">Years of Farming</span>
            </div>
            <div className="col-md-3 stat-item">
              <span className="stat-num">1.2k</span>
              <span className="stat-label">Happy Clients</span>
            </div>
            <div className="col-md-3 stat-item">
              <span className="stat-num">100%</span>
              <span className="stat-label">Organic Certified</span>
            </div>
            <div className="col-md-3 stat-item">
              <span className="stat-num">500+</span>
              <span className="stat-label">Acres of Land</span>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome */}
      <section className="welcome-section">
        <div className="container">
          <div className="welcome-grid">
            <div className="welcome-img-wrap">
              <img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80" alt="Farm" className="welcome-img" />
              <div className="welcome-badge">
                <span className="years">25</span>
                <span className="text">Years of Excellence</span>
              </div>
            </div>
            <div className="welcome-content">
              <span className="section-tag">About Agrinova</span>
              <h2 className="section-title">Providing The Finest Products To Your Table.</h2>
              <p className="section-desc">Agrinova started as a small family farm with a simple dream: to connect real farmers directly with consumers who appreciate the quality of fresh, chemical-free food.</p>
              <ul className="feature-list">
                <li className="feature-item"><span className="feature-icon">✔</span> 100% Pure Organic Fertilizers</li>
                <li className="feature-item"><span className="feature-icon">✔</span> Fresh Harvesting Every Morning</li>
                <li className="feature-item"><span className="feature-icon">✔</span> Direct Farm-to-Home Delivery</li>
                <li className="feature-item"><span className="feature-icon">✔</span> Supporting Local Rural Economies</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section">
        <div className="container">
          <span className="section-tag">Our Philosophy</span>
          <h2 className="section-title">Why We Do What We Do</h2>
          <div className="values-grid">
            <div className="value-card">
              <span className="value-icon">🌱</span>
              <h3>Eco-Friendly</h3>
              <p>We use sustainable methods that protect our soil and groundwater for future generations.</p>
            </div>
            <div className="value-card">
              <span className="value-icon">🛡️</span>
              <h3>Quality First</h3>
              <p>Every product undergoes strict quality checks before it leaves our farm gates.</p>
            </div>
            <div className="value-card">
              <span className="value-icon">🤝</span>
              <h3>Community</h3>
              <p>We empower fellow farmers by providing them a platform to reach global markets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <h2>Ready to taste the fresh difference?</h2>
          <p>Join thousands of happy customers who get their daily nutrition directly from the farm.</p>
          <div className="cta-btns">
            <a href="/consumer/products" className="btn-primary">Start Shopping</a>
            <a href="/services" className="btn-secondary">Our Services</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default AboutUs;
