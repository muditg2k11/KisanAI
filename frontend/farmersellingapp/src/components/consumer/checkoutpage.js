import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import Header from '../header';
import Footer from '../footer';

function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState({});
  const [total, setTotal] = useState(0);
  const [deliveryType, setDeliveryType] = useState('select');
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [finalTotal, setFinalTotal] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get amount from URL
  const amount = searchParams.get('amount');

  // Load cart and user data
  useEffect(() => {
    const rawUser = localStorage.getItem('username');
    const isAuth = !!rawUser && rawUser !== 'undefined' && rawUser !== 'null';

    if (!isAuth) {
      navigate('/consumer/products');
      return;
    }

    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    let userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      const email = localStorage.getItem('email') || '';
      userData = { name: rawUser, email: email };
    }
    setCart(cartData);
    setUser(userData);
  }, [navigate]);

  // Set total from URL or cart
  useEffect(() => {
    if (amount) {
      setTotal(Number(amount));
    } else {
      const cartData = JSON.parse(localStorage.getItem('cart')) || [];
      const cartTotal = cartData.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setTotal(cartTotal);
    }
  }, [amount]);

  // Update delivery charge and final total
  useEffect(() => {
    if (deliveryType === 'home') {
      setDeliveryCharge(100);
      setFinalTotal(total + 100);
    } else {
      setDeliveryCharge(0);
      setFinalTotal(total);
    }
  }, [deliveryType, total]);

  // Utility to remove emojis from a string
  function removeEmojis(str) {
    if (typeof str !== 'string') return str;
    // Regex to remove most emojis
    return str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2702}-\u{27B0}\u{24C2}-\u{1F251}]/gu, '');
  }

  // In your handleCOD and handleOnlinePayment, sanitize all user input fields:
  const handleCOD = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    const orderData = {
      user: removeEmojis(user.name),
      email: user.email,
      mobile: removeEmojis(mobileNumber),
      items: cart,
      total: finalTotal,
      paymentMethod: 'COD',
      deliveryAddress: removeEmojis(deliveryAddress),
      status: 'pending'
    };

    try {
      const response = await axios.post('http://127.0.0.1:5001/api/orders', orderData, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.status === 201) {
        localStorage.removeItem('cart');
        localStorage.removeItem('negotiatedAmount');
        localStorage.removeItem('negotiationStatus');
        localStorage.removeItem('negotiationStatusId');
        // Clear backend cart
        try {
          await axios.post('http://127.0.0.1:5001/api/cart', {
            username: user?.name || localStorage.getItem('username'),
            cartItems: []
          });
        } catch (e) { console.error('Failed clearing remote cart', e); }

        setOrderPlaced(true);
        setErrorMessage('');
        setTimeout(() => navigate('/consumer/orders'), 2000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Order submission failed');
    }
  };

  const handleOnlinePayment = async () => {
    setErrorMessage('');

    // 1. Create Razorpay order on backend
    let razorpayOrder;
    try {
      const orderRes = await axios.post('http://127.0.0.1:5001/api/create-razorpay-order', {
        amount: finalTotal,
        // Optionally, add sanitized fields if backend expects them
        receipt: removeEmojis('order_' + Date.now()),
        notes: removeEmojis('Online payment')
      });
      razorpayOrder = orderRes.data;
    } catch (e) {
      setErrorMessage('Failed to initiate payment. Try again.');
      return;
    }

    // ... rest of your Razorpay code remains the same

    const openRazorpay = (razorpayOrder) => {
      const options = {
        key: "rzp_test_EBKVVFnmZwp7s4",
        name: removeEmojis(user.name),
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post('http://127.0.0.1:5001/api/orders', {
              user: removeEmojis(user.name),
              email: user.email,
              mobile: removeEmojis(mobileNumber),
              items: cart,
              total: finalTotal,
              paymentMethod: 'online',
              deliveryAddress: removeEmojis(deliveryAddress),
              status: 'paid',
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            }, { headers: { 'Content-Type': 'application/json' } });

            if (verifyRes.status === 201) {
              localStorage.removeItem('cart');
              localStorage.removeItem('negotiatedAmount');
              localStorage.removeItem('negotiationStatus');
              localStorage.removeItem('negotiationStatusId');
              // Clear backend cart
              try {
                await axios.post('http://127.0.0.1:5001/api/cart', {
                  username: user?.name || localStorage.getItem('username'),
                  cartItems: []
                });
              } catch (e) { console.error('Failed clearing remote cart', e); }

              setOrderPlaced(true);
              setErrorMessage('');
              setTimeout(() => navigate('/consumer/orders'), 2000);
            }
          } catch (error) {
            setErrorMessage('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: removeEmojis(user.name),
          email: user.email,
          contact: removeEmojis(mobileNumber)
        },
        theme: { color: "#F37254" }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    };

    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => openRazorpay(razorpayOrder);
      script.onerror = () => setErrorMessage('Failed to load payment gateway.');
    } else {
      openRazorpay(razorpayOrder);
    }
  };


  if (orderPlaced) {
    return (
      <Container className="mt-5">
        <Alert variant="success">Order placed successfully! Redirecting...</Alert>
      </Container>
    );
  }

  return (
    <div>
      <div id="pxl-page" className="pxl-page header-pos-df">
        <Header />
        <div id="pxl-pagetitle" className="pxl-pagetitle layout-df relative has-parallax overflow-hidden pxl-animate">
          <div className="pxl-page-title-bg pxl-absoluted" data-parallax="{&quot;y&quot;:&quot;80&quot;}" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80)' }}></div>
          <div className="pxl-page-title-overlay"></div>
          <div className="container relative">
            <div className="pxl-page-title-inner row align-content-center">
              <div className="pxl-page-title col-12">
                <div className="sub-title">Securely Finalize Your Order</div>
                <h1 className="main-title">Checkout</h1>
              </div>
              <div className="pxl-breadcrumb d-flex">
                <div className="breadcrumb-inner">
                  <div className="br-item"><a className="br-link hover-underline" href="/">Home</a><span className="br-divider"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M264.547 70.633L440.547 238.633C445.297 243.164 447.984 249.445 447.984 256.008S445.297 268.852 440.547 273.383L264.547 441.383C254.953 450.508 239.766 450.164 230.609 440.57C221.453 431.07 221.797 415.82 231.422 406.633L364.09 280.008H24C10.75 280.008 0 269.258 0 256.008S10.75 232.008 24 232.008H364.09L231.422 105.383C221.797 96.227 221.453 80.977 230.609 71.445C239.766 61.852 254.953 61.508 264.547 70.633Z"></path></svg></span></div><div className="br-item"><span className="br-text">Checkout</span><span className="br-divider"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M264.547 70.633L440.547 238.633C445.297 243.164 447.984 249.445 447.984 256.008S445.297 268.852 440.547 273.383L264.547 441.383C254.953 450.508 239.766 450.164 230.609 440.57C221.453 431.07 221.797 415.82 231.422 406.633L364.09 280.008H24C10.75 280.008 0 269.258 0 256.008S10.75 232.008 24 232.008H364.09L231.422 105.383C221.797 96.227 221.453 80.977 230.609 71.445C239.766 61.852 254.953 61.508 264.547 70.633Z"></path></svg></span></div>                                    </div>
              </div>
            </div>
          </div>
        </div>
        <div id="pxl-main" className="pxl-main">
          <div className="container">
            <div className="row pxl-shop-loop-content pxl-content-wrap has-sidebar sidebar-left">
              <Container className="mt-5 mb-5">
                <h2 className="mb-4" style={{ color: '#2d5a27', fontWeight: 'bold' }}>Checkout</h2>
                <Row className="g-5">
                  <Col lg={7} md={12}>
                    <div className="checkout-form-container" style={{ padding: '0px 20px 0px 0px' }}>
                      <h4 className="mb-4" style={{ borderBottom: '2px solid #eaeeeb', paddingBottom: '10px', color: '#1a3616' }}>Delivery Details</h4>
                      <Form onSubmit={handleCOD}>
                        <Row>
                          <Col md={6}>
                            <Form.Group controlId="name" className="mb-3">
                              <Form.Label style={{ fontWeight: '600', color: '#555' }}>Full Name</Form.Label>
                              <Form.Control type="text" value={user.name || ''} readOnly style={{ background: '#f8f9fa', border: 'none', borderRadius: '8px', padding: '12px' }} />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId="email" className="mb-3">
                              <Form.Label style={{ fontWeight: '600', color: '#555' }}>Email Address</Form.Label>
                              <Form.Control type="email" value={user.email || ''} readOnly style={{ background: '#f8f9fa', border: 'none', borderRadius: '8px', padding: '12px' }} />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group controlId="mobileNumber" className="mb-4">
                          <Form.Label style={{ fontWeight: '600', color: '#555' }}>Mobile Number <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="tel"
                            placeholder="Enter your 10-digit mobile number"
                            value={mobileNumber}
                            onChange={e => setMobileNumber(e.target.value)}
                            required
                            style={{ padding: '12px', border: '1px solid #ced4da', borderRadius: '8px', backgroundColor: '#fcfcfc' }}
                          />
                        </Form.Group>

                        <Form.Group controlId="deliveryType" className="mb-4">
                          <Form.Label style={{ fontWeight: '600', color: '#555' }}>Delivery Method <span className="text-danger">*</span></Form.Label>
                          <Form.Select
                            value={deliveryType}
                            onChange={e => setDeliveryType(e.target.value)}
                            required
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              border: '1px solid #ced4da',
                              borderRadius: '8px',
                              backgroundColor: '#fff',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                              color: '#495057',
                              fontWeight: '500'
                            }}
                          >
                            <option value="select" disabled>Select Delivery Type</option>
                            <option value="pickup">Farm Pickup (Free)</option>
                            <option value="home">Home Delivery (+₹100)</option>
                          </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="deliveryAddress" className="mb-4">
                          <Form.Label style={{ fontWeight: '600', color: '#555' }}>Full Address <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter your complete delivery address including zipcode"
                            value={deliveryAddress}
                            onChange={e => setDeliveryAddress(e.target.value)}
                            required
                            style={{ padding: '12px', border: '1px solid #ced4da', borderRadius: '8px', backgroundColor: '#fcfcfc', resize: 'vertical' }}
                          />
                        </Form.Group>
                        <div className="d-none">
                          <Button variant="success" type="submit" id="hidden-cod-btn">Submit COD</Button>
                        </div>
                      </Form>
                    </div>
                  </Col>

                  <Col lg={5} md={12}>
                    <div className="order-summary-card" style={{
                      background: '#ffffff',
                      padding: '30px',
                      borderRadius: '12px',
                      border: '1px solid #eaeeeb',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      position: 'sticky',
                      top: '120px'
                    }}>
                      <h4 className="mb-4" style={{ fontWeight: 'bold' }}>Order Summary</h4>

                      <div className="cart-items-preview mb-4" style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '10px' }}>
                        {cart.length === 0 ? (
                          <p className="text-muted">Your cart is empty.</p>
                        ) : (
                          cart.map((item, idx) => (
                            <div key={idx} className="d-flex justify-content-between align-items-center mb-3 pb-3" style={{ borderBottom: '1px dashed #eaeeeb' }}>
                              <div style={{ flex: 1, paddingRight: '15px' }}>
                                <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.title}</div>
                                <div className="text-muted" style={{ fontSize: '0.85rem' }}>Qty: {item.quantity} × ₹{item.price}</div>
                              </div>
                              <div style={{ fontWeight: 'bold' }}>
                                ₹{item.price * item.quantity}
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="summary-calculations mb-4" style={{ fontSize: '1.05rem' }}>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Subtotal</span>
                          <span>₹{total}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3 pb-3" style={{ borderBottom: '2px solid #eaeeeb' }}>
                          <span className="text-muted">Delivery Charge</span>
                          <span>{deliveryCharge > 0 ? `+₹${deliveryCharge}` : 'Free'}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Total Amount</span>
                          <span style={{ fontWeight: 'bold', fontSize: '1.3rem', color: '#2d5a27' }}>₹{finalTotal}</span>
                        </div>
                      </div>

                      {errorMessage && <Alert variant="danger" className="mb-4">{errorMessage}</Alert>}

                      <div className="d-grid gap-3">
                        <Button
                          style={{
                            background: '#2d5a27',
                            borderColor: '#2d5a27',
                            padding: '14px',
                            fontWeight: 'bold',
                            fontSize: '1.05rem',
                            borderRadius: '50px',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 15px rgba(45, 90, 39, 0.2)'
                          }}
                          onClick={() => document.getElementById('hidden-cod-btn').click()}
                          disabled={cart.length === 0}
                          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                          <i className="fas fa-truck me-2"></i> Place Order (COD)
                        </Button>
                        <Button
                          style={{
                            background: '#f8f9fa',
                            color: '#333',
                            borderColor: '#e2e5e8',
                            padding: '14px',
                            fontWeight: 'bold',
                            fontSize: '1.05rem',
                            borderRadius: '50px',
                            transition: 'all 0.2s ease',
                          }}
                          onClick={handleOnlinePayment}
                          disabled={cart.length === 0}
                          onMouseOver={(e) => { e.target.style.background = '#f1f3f5'; e.target.style.transform = 'translateY(-2px)' }}
                          onMouseOut={(e) => { e.target.style.background = '#f8f9fa'; e.target.style.transform = 'translateY(0)' }}
                        >
                          <i className="fas fa-credit-card mx-2 text-primary"></i> <span style={{ marginRight: '8px' }}>Pay Online</span>
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        </div>
        <Footer />
      </div>

    </div>


  );
}

export default CheckoutPage;
