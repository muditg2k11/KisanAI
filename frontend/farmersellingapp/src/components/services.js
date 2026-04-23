import React, { useEffect } from 'react';
import Header from './header';
import Footer from './footer';

const serviceStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  .srv-page { font-family: 'Inter', sans-serif; }

  /* ─── HERO ─────────────────────────────────────────────── */
  .srv-hero {
    position: relative;
    height: 520px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .srv-hero img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
  }
  .srv-hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(30,60,20,0.72) 0%, rgba(74,124,89,0.55) 100%);
  }
  .srv-hero-content {
    position: relative; z-index: 2;
    text-align: center; color: white;
    padding: 0 24px;
  }
  .srv-hero-tag {
    display: inline-block;
    background: rgba(244,166,30,0.9);
    color: white;
    border-radius: 20px;
    padding: 6px 20px;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 18px;
  }
  .srv-hero-title {
    font-size: clamp(2rem, 5vw, 3.6rem);
    font-weight: 800;
    line-height: 1.15;
    margin-bottom: 16px;
    text-shadow: 0 2px 12px rgba(0,0,0,0.3);
  }
  .srv-hero-sub {
    font-size: 1.1rem;
    opacity: 0.9;
    max-width: 560px;
    margin: 0 auto 30px;
    line-height: 1.6;
  }
  .srv-hero-btn {
    display: inline-block;
    background: linear-gradient(135deg, #f4a61e, #e8930a);
    color: white !important;
    padding: 14px 38px;
    border-radius: 50px;
    font-weight: 700;
    font-size: 0.97rem;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .srv-hero-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(244,166,30,0.45); }

  /* ─── STATS BAR ─────────────────────────────────────────── */
  .srv-stats {
    background: linear-gradient(135deg, #2d5a27, #4a7c59);
    padding: 28px 0;
  }
  .srv-stats-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 20px;
    padding: 0 24px;
  }
  .srv-stat-item { text-align: center; color: white; }
  .srv-stat-num { font-size: 2rem; font-weight: 800; display: block; }
  .srv-stat-label { font-size: 0.85rem; opacity: 0.85; }

  /* ─── SECTION WRAPPER ───────────────────────────────────── */
  .srv-section { max-width: 1100px; margin: 0 auto; padding: 80px 24px; }
  .srv-section-title {
    text-align: center;
    margin-bottom: 56px;
  }
  .srv-section-title .tag {
    display: inline-block;
    background: #e8f5e9;
    color: #2d5a27;
    border-radius: 20px;
    padding: 6px 18px;
    font-size: 0.82rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 12px;
  }
  .srv-section-title h2 {
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    font-weight: 800;
    color: #1a2e12;
    margin-bottom: 12px;
    line-height: 1.25;
  }
  .srv-section-title p {
    color: #666;
    font-size: 1rem;
    max-width: 560px;
    margin: 0 auto;
    line-height: 1.7;
  }

  /* ─── SERVICE CARDS ─────────────────────────────────────── */
  .srv-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 28px;
  }
  .srv-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.07);
    transition: transform 0.25s, box-shadow 0.25s;
  }
  .srv-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
  .srv-card-img {
    width: 100%;
    height: 210px;
    object-fit: cover;
  }
  .srv-card-body { padding: 28px; }
  .srv-card-icon {
    width: 48px; height: 48px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    margin-bottom: 16px;
  }
  .srv-card-icon.green { background: #e8f5e9; }
  .srv-card-icon.amber { background: #fff8e1; }
  .srv-card-icon.blue  { background: #e3f2fd; }
  .srv-card-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: #1a2e12;
    margin-bottom: 10px;
  }
  .srv-card-text {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.7;
    margin-bottom: 20px;
  }
  .srv-card-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #4a7c59;
    font-weight: 700;
    font-size: 0.9rem;
    text-decoration: none;
    transition: gap 0.2s;
  }
  .srv-card-link:hover { gap: 10px; color: #2d5a27; }

  /* ─── WHY CHOOSE US ─────────────────────────────────────── */
  .srv-why { background: #f8faf7; padding: 80px 0; }
  .srv-why-inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 24px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center;
  }
  @media (max-width: 768px) {
    .srv-why-inner { grid-template-columns: 1fr; gap: 36px; }
    .srv-hero { height: 380px; }
    .srv-hero-title { font-size: 2rem; }
  }
  .srv-why-img {
    width: 100%;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.12);
  }
  .srv-why-content h2 {
    font-size: 2rem;
    font-weight: 800;
    color: #1a2e12;
    line-height: 1.25;
    margin-bottom: 16px;
  }
  .srv-why-content h2 span { color: #4a7c59; }
  .srv-why-content p {
    color: #666;
    line-height: 1.7;
    margin-bottom: 28px;
    font-size: 0.97rem;
  }
  .srv-check-list { list-style: none; padding: 0; margin: 0; }
  .srv-check-list li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
    font-size: 0.95rem;
    color: #444;
  }
  .srv-check-list .check-icon {
    width: 24px; height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2d5a27, #4a7c59);
    display: flex; align-items: center; justify-content: center;
    color: white;
    font-size: 12px;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .srv-check-list .check-text strong { display: block; color: #1a2e12; font-weight: 600; }
  .srv-check-list .check-text span { font-size: 0.85rem; color: #888; }

  /* ─── PROCESS STEPS ─────────────────────────────────────── */
  .srv-process { padding: 80px 0; }
  .srv-process-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
  .srv-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 32px;
    margin-top: 20px;
  }
  .srv-step {
    text-align: center;
    padding: 32px 20px;
    border-radius: 16px;
    background: white;
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    position: relative;
  }
  .srv-step-num {
    width: 52px; height: 52px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2d5a27, #4a7c59);
    color: white;
    font-size: 1.2rem;
    font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
  }
  .srv-step h4 { font-size: 1rem; font-weight: 700; color: #1a2e12; margin-bottom: 8px; }
  .srv-step p { font-size: 0.85rem; color: #777; line-height: 1.6; margin: 0; }

  /* ─── CTA ───────────────────────────────────────────────── */
  .srv-cta {
    background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 50%, #1a2e12 100%);
    padding: 80px 24px;
    text-align: center;
    color: white;
  }
  .srv-cta h2 { font-size: 2rem; font-weight: 800; margin-bottom: 14px; }
  .srv-cta p { opacity: 0.85; font-size: 1rem; max-width: 500px; margin: 0 auto 32px; line-height: 1.7; }
  .srv-cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .srv-cta-btn-primary {
    background: linear-gradient(135deg, #f4a61e, #e8930a);
    color: white !important;
    padding: 14px 36px;
    border-radius: 50px;
    font-weight: 700;
    font-size: 0.97rem;
    text-decoration: none;
    transition: transform 0.2s;
  }
  .srv-cta-btn-secondary {
    background: rgba(255,255,255,0.15);
    color: white !important;
    padding: 14px 36px;
    border-radius: 50px;
    font-weight: 600;
    font-size: 0.97rem;
    text-decoration: none;
    border: 1.5px solid rgba(255,255,255,0.4);
    transition: background 0.2s;
  }
  .srv-cta-btn-primary:hover { transform: translateY(-2px); }
  .srv-cta-btn-secondary:hover { background: rgba(255,255,255,0.25); }
`;

const Services = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="srv-page">
            <style>{serviceStyles}</style>
            <Header />

            {/* ── HERO ──────────────────────────────────────────── */}
            <div className="srv-hero">
                <img src="/assets/wp-content/uploads/2024/06/services-hero.png" alt="Farm Services" />
                <div className="srv-hero-overlay" />
                <div className="srv-hero-content">
                    <span className="srv-hero-tag">🌿 Agrinova Services</span>
                    <h1 className="srv-hero-title">
                        Agricultural Services<br />Built for Farmers
                    </h1>
                    <p className="srv-hero-sub">
                        From organic farming solutions to direct market access — we empower farmers with the tools they need to thrive.
                    </p>
                    <a href="/consumer/products" className="srv-hero-btn">Explore Products →</a>
                </div>
            </div>

            {/* ── STATS BAR ─────────────────────────────────────── */}
            <div className="srv-stats">
                <div className="srv-stats-inner">
                    {[
                        { num: '5,000+', label: 'Active Farmers' },
                        { num: '98%', label: 'Organic Certified' },
                        { num: '12+', label: 'States Covered' },
                        { num: '50K+', label: 'Happy Customers' },
                    ].map((s, i) => (
                        <div key={i} className="srv-stat-item">
                            <span className="srv-stat-num">{s.num}</span>
                            <span className="srv-stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── OUR SERVICES ──────────────────────────────────── */}
            <div className="srv-section">
                <div className="srv-section-title">
                    <span className="tag">What We Offer</span>
                    <h2>Services Designed Around<br />Your Farm's Needs</h2>
                    <p>Three pillars that drive every farmer's success — quality, sustainability, and direct market reach.</p>
                </div>
                <div className="srv-cards-grid">

                    {/* Card 1 */}
                    <div className="srv-card">
                        <img className="srv-card-img" src="/assets/wp-content/uploads/2024/06/services-organic.png" alt="Organic Solutions" />
                        <div className="srv-card-body">
                            <div className="srv-card-icon green">🌱</div>
                            <h3 className="srv-card-title">Organic Solutions</h3>
                            <p className="srv-card-text">
                                Comprehensive organic farming strategies — from seed selection to soil health monitoring — that ensure sustainable yields and certified quality produce.
                            </p>
                            <a href="/consumer/products" className="srv-card-link">
                                Learn More <span>→</span>
                            </a>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="srv-card">
                        <img className="srv-card-img" src="/assets/wp-content/uploads/2024/06/services-quality.png" alt="Quality Agriculture" />
                        <div className="srv-card-body">
                            <div className="srv-card-icon amber">⭐</div>
                            <h3 className="srv-card-title">Quality Agriculture</h3>
                            <p className="srv-card-text">
                                Our expert agronomists monitor crop quality at every stage — soil testing, harvest management, and post-harvest handling to deliver premium products.
                            </p>
                            <a href="/consumer/products" className="srv-card-link">
                                Learn More <span>→</span>
                            </a>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="srv-card">
                        <img className="srv-card-img" src="/assets/wp-content/uploads/2024/06/services-market.png" alt="Market Access" />
                        <div className="srv-card-body">
                            <div className="srv-card-icon blue">🏪</div>
                            <h3 className="srv-card-title">Direct Market Access</h3>
                            <p className="srv-card-text">
                                Connect directly with consumers through our digital platform — eliminate middlemen, get fair prices, and grow your customer base with zero commission.
                            </p>
                            <a href="/consumer/products" className="srv-card-link">
                                Learn More <span>→</span>
                            </a>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── WHY CHOOSE US ─────────────────────────────────── */}
            <div className="srv-why">
                <div className="srv-why-inner">
                    <img
                        className="srv-why-img"
                        src="/assets/wp-content/uploads/2024/06/services-organic.png"
                        alt="Growing with Dedication"
                    />
                    <div className="srv-why-content">
                        <div style={{ display: 'inline-block', background: '#e8f5e9', color: '#2d5a27', borderRadius: '20px', padding: '5px 16px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>
                            Why Agrinova
                        </div>
                        <h2>Growing With <span>Dedication</span> &amp; Purpose</h2>
                        <p>
                            Agrinova is revolutionizing agriculture by bridging the gap between local farmers and consumers. We believe every farmer deserves fair prices and every consumer deserves fresh, authentic produce.
                        </p>
                        <ul className="srv-check-list">
                            {[
                                { title: 'Specialized Soil Testing', desc: 'Lab-grade analysis for optimal crop planning' },
                                { title: 'Sustainable Water Management', desc: 'Smart irrigation solutions for water conservation' },
                                { title: 'Direct Supply Chain', desc: 'Farm to doorstep with full traceability' },
                                { title: 'Crop Disease Detection', desc: 'AI-powered early warning system for farmers' },
                            ].map((item, i) => (
                                <li key={i}>
                                    <span className="check-icon">✓</span>
                                    <span className="check-text">
                                        <strong>{item.title}</strong>
                                        <span>{item.desc}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* ── HOW IT WORKS ──────────────────────────────────── */}
            <div className="srv-process">
                <div className="srv-process-inner">
                    <div className="srv-section-title">
                        <span className="tag">Simple Process</span>
                        <h2>How It Works</h2>
                        <p>Getting started with Agrinova is easy — follow four simple steps to start selling your produce.</p>
                    </div>
                    <div className="srv-steps">
                        {[
                            { num: '01', title: 'Register', desc: 'Create your farmer account with basic details about your farm.' },
                            { num: '02', title: 'List Produce', desc: 'Upload products with photos, prices, and availability.' },
                            { num: '03', title: 'Receive Orders', desc: 'Consumers browse and place orders directly from your listings.' },
                            { num: '04', title: 'Get Paid', desc: 'Receive secure payments directly to your bank account.' },
                        ].map((step, i) => (
                            <div key={i} className="srv-step">
                                <div className="srv-step-num">{step.num}</div>
                                <h4>{step.title}</h4>
                                <p>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── CTA ───────────────────────────────────────────── */}
            <div className="srv-cta">
                <h2>Ready to Transform Your Farm?</h2>
                <p>Join thousands of farmers already benefiting from Agrinova's direct market platform. It's free to get started.</p>
                <div className="srv-cta-btns">
                    <a href="/register" className="srv-cta-btn-primary">Join as Farmer</a>
                    <a href="/consumer/products" className="srv-cta-btn-secondary">Browse Products</a>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Services;
