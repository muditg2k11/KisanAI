import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Header from './header';
import Footer from './footer';

const contactStyles = `
  .contact-wrap { background: #f8faf7; min-height: 100vh; }
  .contact-section { padding: 80px 0; }
  .contact-info-card { background: white; border-radius: 20px; padding: 40px 30px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); text-align: center; height: 100%; transition: transform 0.3s; }
  .contact-info-card:hover { transform: translateY(-5px); }
  .contact-icon-wrapper { width: 80px; height: 80px; background: #e8f5e9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
  .contact-icon { font-size: 32px; color: #2d5a27; }
  .contact-info-title { font-size: 1.25rem; font-weight: 700; color: #2d2d2d; margin-bottom: 12px; }
  .contact-info-text { color: #666; font-size: 0.95rem; line-height: 1.6; margin-bottom: 0; }
  .contact-form-wrapper { padding: 0; display: flex; flex-direction: column; justify-content: center; background: transparent; height: 100%; }
  .contact-form-title { font-size: 1.6rem; font-weight: 700; color: #1e3d16; margin-bottom: 5px; }
  .contact-form-subtitle { color: #888; margin-bottom: 12px; font-size: 0.85rem; }
  .form-control { border: 1.5px solid #e0e0e0; border-radius: 12px; padding: 10px 14px; font-size: 0.9rem; box-shadow: none !important; transition: border-color 0.2s; background-color: #f1f4ee; }
  .form-control:focus { border-color: #4a7c59; background-color: #ffffff; }
  .btn-submit-contact { background: linear-gradient(135deg, #2d5a27, #f4a61e); color: white; border: none; padding: 12px 30px; border-radius: 50px; font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; width: 100%; transition: transform 0.3s, box-shadow 0.3s; margin-top: 0px; cursor: pointer; }
  .btn-submit-contact:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(244,166,30,0.3); color: white; }
  .map-container { border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); height: 100%; display: flex; align-items: stretch; }
`;

function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for contacting us! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="contact-wrap">
            <style>{contactStyles}</style>
            <Header />

            {/* Hero Section */}
            <div id="pxl-pagetitle" className="pxl-pagetitle layout-df relative has-parallax overflow-hidden pxl-animate">
                <div className="pxl-page-title-bg pxl-absoluted" data-parallax="{&quot;y&quot;:&quot;80&quot;}"></div>
                <div className="pxl-page-title-overlay"></div>
                <div className="container relative">
                    <div className="pxl-page-title-inner row align-content-center">
                        <div className="pxl-page-title col-12">
                            <div className="sub-title">Get In Touch</div>
                            <h1 className="main-title">Contact Us</h1>
                        </div>
                        <div className="pxl-breadcrumb d-flex">
                            <div className="breadcrumb-inner">
                                <div className="br-item"><a className="br-link hover-underline" href="/">Home</a><span className="br-divider"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M264.547 70.633L440.547 238.633C445.297 243.164 447.984 249.445 447.984 256.008S445.297 268.852 440.547 273.383L264.547 441.383C254.953 450.508 239.766 450.164 230.609 440.57C221.453 431.07 221.797 415.82 231.422 406.633L364.09 280.008H24C10.75 280.008 0 269.258 0 256.008S10.75 232.008 24 232.008H364.09L231.422 105.383C221.797 96.227 221.453 80.977 230.609 71.445C239.766 61.852 254.953 61.508 264.547 70.633Z"></path></svg></span></div><div className="br-item"><span className="br-text">Contact</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="contact-section">
                <Container>
                    {/* Info Cards */}
                    <Row className="mb-5 pb-4 justify-content-center">
                        <Col md={4} className="mb-4 mb-md-0 d-flex">
                            <div className="contact-info-card flex-grow-1 w-100">
                                <div className="contact-icon-wrapper">
                                    <i className="fas fa-map-marker-alt contact-icon"></i>
                                </div>
                                <h3 className="contact-info-title">Our Location</h3>
                                <p className="contact-info-text">12 main road, marathalli,<br />Banglore, India</p>
                            </div>
                        </Col>
                        <Col md={4} className="mb-4 mb-md-0 d-flex">
                            <div className="contact-info-card flex-grow-1 w-100">
                                <div className="contact-icon-wrapper">
                                    <i className="fas fa-phone-alt contact-icon"></i>
                                </div>
                                <h3 className="contact-info-title">Phone Number</h3>
                                <p className="contact-info-text">Support: <strong>+91 98765 43210</strong><br />Mon-Sat, 8am - 6pm</p>
                            </div>
                        </Col>
                        <Col md={4} className="d-flex">
                            <div className="contact-info-card flex-grow-1 w-100">
                                <div className="contact-icon-wrapper">
                                    <i className="fas fa-envelope contact-icon"></i>
                                </div>
                                <h3 className="contact-info-title">Email Address</h3>
                                <p className="contact-info-text"><strong>agrinova@gmail.com</strong><br /><strong>support@agrinova.com</strong></p>
                            </div>
                        </Col>
                    </Row>

                    {/* Form & Map */}
                    <Row className="align-items-stretch">
                        <Col lg={6} className="mb-4 mb-lg-0 d-flex">
                            <div className="contact-form-wrapper flex-grow-1 w-100">
                                <h2 className="contact-form-title">Send a Message</h2>
                                <p className="contact-form-subtitle">Have questions about our fresh produce or bulk orders? We're here to help.</p>
                                <Form onSubmit={handleSubmit} className="d-flex flex-column h-100 pb-0">
                                    <Row>
                                        <Col md={6} className="mb-3">
                                            <Form.Control type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <Form.Control type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-3">
                                        <Form.Control type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Control as="textarea" rows={3} name="message" placeholder="How can we help you?" value={formData.message} onChange={handleChange} required style={{ resize: 'none' }} />
                                    </Form.Group>
                                    <button type="submit" className="btn-submit-contact">Send Message <i className="fas fa-paper-plane ms-2"></i></button>
                                </Form>
                            </div>
                        </Col>
                        <Col lg={6} className="d-flex">
                            <div className="map-container flex-grow-1 w-100">
                                <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80" alt="Farmer market" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />
        </div>
    );
}

export default Contact;
