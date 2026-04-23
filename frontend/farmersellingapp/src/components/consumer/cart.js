import React, { useState, useEffect } from 'react';
import { Container, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../header';
import Footer from '../footer';
import AuthModal from '../AuthModal';
import axios from 'axios';

const styles = `
  /* ===== CART STYLES ===== */
  .cart-wrap { background: #f8faf7; min-height: 60vh; }
  .cart-section { max-width: 1100px; margin: 0 auto; padding: 48px 24px 72px; }
  .cart-section h2 { font-size: 1.8rem; font-weight: 700; color: #2d5a27; margin-bottom: 36px; display: flex; align-items: center; gap: 12px; }
  .cart-section h2 span.cart-count { background: linear-gradient(135deg,#f4a61e,#e8930a); color: white; border-radius: 20px; padding: 3px 14px; font-size: 0.9rem; font-weight: 700; }

  /* Empty cart */
  .cart-empty { text-align: center; padding: 80px 40px; max-width: 480px; margin: 0 auto; }
  .cart-empty .empty-icon { font-size: 80px; margin-bottom: 20px; display: block; }
  .cart-empty h3 { font-size: 1.5rem; font-weight: 700; color: #2d5a27; margin-bottom: 10px; }
  .cart-empty p { color: #888; margin-bottom: 28px; font-size: 0.97rem; line-height: 1.6; }
  .cart-empty a { display: inline-block; background: linear-gradient(135deg, #2d5a27, #4a7c59); color: white; padding: 13px 36px; border-radius: 50px; font-size: 0.95rem; font-weight: 600; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; }
  .cart-empty a:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(74,124,89,0.35); color: white; }

  /* Auth needed state */
  .auth-needed-box { text-align: center; padding: 80px 40px; background: transparent; max-width: 500px; margin: 60px auto; }
  .auth-needed-box .auth-icon { font-size: 64px; margin-bottom: 20px; }
  .auth-needed-box h2 { font-size: 1.6rem; font-weight: 700; color: #2d5a27; margin-bottom: 10px; }
  .auth-needed-box p { color: #888; margin-bottom: 28px; font-size: 1rem; }
  .auth-needed-box button { background: linear-gradient(135deg, #2d5a27, #4a7c59); color: white; border: none; padding: 14px 40px; border-radius: 50px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
  .auth-needed-box button:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(74,124,89,0.35); }

  /* Cart table card */
  .cart-card { background: white; border-radius: 18px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); overflow: hidden; margin-bottom: 28px; }
  .cart-table { width: 100%; border-collapse: collapse; }
  .cart-table thead th { background: linear-gradient(135deg, #2d5a27, #4a7c59); color: white; font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; padding: 16px 18px; border: none; }
  .cart-table tbody tr { border-bottom: 1px solid #f2f2f2; transition: background 0.15s; }
  .cart-table tbody tr:hover { background: #f0f9f0; }
  .cart-table tbody tr:last-child { border-bottom: none; }
  .cart-table tbody td { padding: 16px 18px; vertical-align: middle; font-size: 0.9rem; color: #444; }
  .cart-product-name { font-weight: 600; color: #2d2d2d; }
  .cart-price { color: #4a7c59; font-weight: 600; }
  .cart-total-cell { color: #2d5a27; font-weight: 700; }
  .cart-qty-badge { display: inline-block; background: #e8f5e9; color: #2d5a27; border-radius: 20px; padding: 3px 12px; font-weight: 600; font-size: 0.85rem; }
  .btn-remove { background: none; border: 1.5px solid #e74c3c; color: #e74c3c; border-radius: 20px; padding: 5px 14px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .btn-remove:hover { background: #e74c3c; color: white; }

  /* Cart summary */
  .cart-summary { background: white; border-radius: 18px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); padding: 28px; }
  .cart-summary h4 { font-size: 1.15rem; font-weight: 700; color: #2d5a27; margin-bottom: 20px; }
  .summary-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.93rem; color: #555; }
  .summary-row.total-row { border-top: 2px solid #e8f5e9; padding-top: 14px; margin-top: 6px; font-weight: 700; font-size: 1.1rem; color: #2d5a27; }
  
  /* Negotiation */
  .nego-box { background: #fffdf0; border: 1.5px solid #f4a61e40; border-radius: 14px; padding: 22px 24px; margin-top: 20px; }
  .nego-box h5 { font-size: 0.95rem; font-weight: 700; color: #856404; margin-bottom: 14px; }
  .nego-input-row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
  .nego-input { flex: 1; min-width: 150px; padding: 11px 14px; border: 1.5px solid #d4b96a; border-radius: 10px; font-size: 0.9rem; outline: none; }
  .nego-input:focus { border-color: #f4a61e; }
  .nego-input:disabled { background: #fafafa; color: #aaa; }
  .btn-negotiate { background: linear-gradient(135deg, #f4a61e, #e8930a); color: white; border: none; border-radius: 10px; padding: 11px 22px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: opacity 0.2s; white-space: nowrap; }
  .btn-negotiate:disabled { opacity: 0.5; cursor: not-allowed; }
  .nego-status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 30px; font-size: 0.85rem; font-weight: 600; margin-top: 12px; }
  .nego-status-pill.pending { background: #fff3cd; color: #856404; }
  .nego-status-pill.approved { background: #d1fae5; color: #065f46; }
  .nego-status-pill.rejected { background: #fee2e2; color: #991b1b; }

  /* Checkout button */
  .btn-checkout { width: 100%; background: linear-gradient(135deg, #2d5a27, #4a7c59); color: white; border: none; border-radius: 50px; padding: 16px; font-size: 1rem; font-weight: 700; cursor: pointer; margin-top: 18px; transition: transform 0.2s, box-shadow 0.2s; letter-spacing: 0.03em; }
  .btn-checkout:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(45,90,39,0.35); }
  .btn-checkout:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ===== RESPONSIVE STYLES ===== */
  @media (max-width: 992px) {
    .cart-section h2 { font-size: 1.6rem; }
    .cart-summary { margin-top: 40px !important; }
  }

  @media (max-width: 768px) {
    .cart-section { padding: 32px 15px 56px; }
    .cart-table thead { display: none; } /* Hide table header on mobile */
    .cart-table tbody tr { display: block; border: 1px solid #f0f0f0; border-radius: 12px; margin-bottom: 16px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .cart-table tbody td { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border: none; }
    .cart-table tbody td::before { content: attr(data-label); font-weight: 600; color: #555; margin-right: 10px; }
    .cart-table .cart-product-name { font-size: 1rem; }
    .cart-table .btn-remove { padding: 6px 16px; }
    .nego-input-row { flex-direction: column; align-items: stretch; }
    .btn-negotiate { width: 100%; margin-top: 10px; }
  }
`;

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [role, setRole] = useState(null);
  const [negotiateAmount, setNegotiateAmount] = useState('');
  const [negotiationStatus, setNegotiationStatus] = useState(localStorage.getItem('negotiationStatus') || '');
  const [negoError, setNegoError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const rawUser = localStorage.getItem('username');
  const isAuthenticated = !!rawUser && rawUser !== 'undefined' && rawUser !== 'null';

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart && storedCart !== 'undefined' && storedCart !== 'null') {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) { }
    }
    const storedRole = localStorage.getItem('role');
    if (storedRole) setRole(storedRole);
    const storedStatus = localStorage.getItem('negotiationStatus');
    if (storedStatus) setNegotiationStatus(storedStatus);
    const storedAmount = localStorage.getItem('negotiatedAmount');
    if (storedAmount) setNegotiateAmount(storedAmount);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (negotiationStatus === 'pending') {
      const interval = setInterval(async () => {
        const negotiationId = localStorage.getItem('negotiationStatusId');
        try {
          const response = await axios.post('http://127.0.0.1:5001/api/negotiations/status-by-id', { id: negotiationId });
          if (response.data.status === 'approved' || response.data.status === 'rejected') {
            setNegotiationStatus(response.data.status);
            setNegotiateAmount(response.data.negotiatedAmount || '');
            localStorage.setItem('negotiationStatus', response.data.status);
            localStorage.setItem('negotiatedAmount', response.data.negotiatedAmount || '');
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Polling error:', error);
          clearInterval(interval);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [negotiationStatus]);

  const removeFromCart = async (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    if (isAuthenticated) {
      try {
        await axios.post('http://127.0.0.1:5001/api/cart', {
          username: rawUser,
          cartItems: updatedCart
        });
      } catch (err) {
        console.error('Failed to sync removed item to DB', err);
      }
    }
  };

  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleApplyNegotiate = async () => {
    const username = localStorage.getItem('username');
    setNegoError('');
    try {
      const response = await fetch('http://127.0.0.1:5001/api/negotiations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ negotiatedAmount: Number(negotiateAmount), originalAmount: totalPrice, items: cart, username }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('negotiationStatusId', data.id);
        localStorage.setItem('negotiationStatus', 'pending');
        setNegotiationStatus('pending');
      } else {
        setNegotiationStatus('rejected');
        setNegoError(data.error || 'Failed to submit offer');
        localStorage.setItem('negotiationStatus', 'rejected');
      }
    } catch (err) {
      setNegotiationStatus('rejected');
      setNegoError('Network error. Is the server running?');
      localStorage.setItem('negotiationStatus', 'rejected');
    }
  };

  const handleCheckout = () => {
    const amount = negotiationStatus === 'approved' ? negotiateAmount : totalPrice;
    navigate(`/consumer/checkout?amount=${amount}`);
  };

  const displayTotal = negotiationStatus === 'approved' ? negotiateAmount : totalPrice;

  return (
    <div className="cart-wrap">
      <style>{styles}</style>
      <Header />

      <div id="pxl-pagetitle" className="pxl-pagetitle layout-df relative has-parallax overflow-hidden pxl-animate">
        <div className="pxl-page-title-bg pxl-absoluted" data-parallax="{&quot;y&quot;:&quot;80&quot;}" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80)' }}></div>
        <div className="pxl-page-title-overlay"></div>
        <div className="container relative">
          <div className="pxl-page-title-inner row align-content-center">
            <div className="pxl-page-title col-12">
              <div className="sub-title">Your Shopping Cart</div>
              <h1 className="main-title">Cart</h1>
            </div>
            <div className="pxl-breadcrumb d-flex">
              <div className="breadcrumb-inner">
                <div className="br-item"><a className="br-link hover-underline" href="/">Home</a><span className="br-divider"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M264.547 70.633L440.547 238.633C445.297 243.164 447.984 249.445 447.984 256.008S445.297 268.852 440.547 273.383L264.547 441.383C254.953 450.508 239.766 450.164 230.609 440.57C221.453 431.07 221.797 415.82 231.422 406.633L364.09 280.008H24C10.75 280.008 0 269.258 0 256.008S10.75 232.008 24 232.008H364.09L231.422 105.383C221.797 96.227 221.453 80.977 230.609 71.445C239.766 61.852 254.953 61.508 264.547 70.633Z"></path></svg></span></div><div className="br-item"><span className="br-text">Cart</span><span className="br-divider"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M264.547 70.633L440.547 238.633C445.297 243.164 447.984 249.445 447.984 256.008S445.297 268.852 440.547 273.383L264.547 441.383C254.953 450.508 239.766 450.164 230.609 440.57C221.453 431.07 221.797 415.82 231.422 406.633L364.09 280.008H24C10.75 280.008 0 269.258 0 256.008S10.75 232.008 24 232.008H364.09L231.422 105.383C221.797 96.227 221.453 80.977 230.609 71.445C239.766 61.852 254.953 61.508 264.547 70.633Z"></path></svg></span></div>                                    </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cart-section">
        <div className="container">
          {!isAuthenticated ? (
            <div className="auth-needed-box">
              <span className="auth-icon"><i className="fas fa-lock" style={{ color: '#2d5a27' }}></i></span>
              <h2>Sign In to View Cart</h2>
              <p>Please log in to your account to view your shopping cart and complete your purchase.</p>
              <button onClick={() => setShowAuthModal(true)}>
                Sign In / Register
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="cart-empty">
              <span className="empty-icon"><i className="fas fa-shopping-cart" style={{ color: '#2d5a27' }}></i></span>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything to your cart yet. Explore our products and find something you love!</p>
              <button
                className="btn-checkout"
                style={{ width: 'auto', padding: '14px 40px' }}
                onClick={() => navigate('/consumer/products')}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <Row>
              <Col lg={8}>
                <h2>
                  Your Cart
                  <span className="cart-count">{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
                </h2>
                <div className="cart-card">
                  <table className="cart-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map(item => (
                        <tr key={item.id}>
                          <td data-label="Product" className="cart-product-name"><i className="fas fa-leaf" style={{ color: '#2d5a27', marginRight: '6px' }}></i> {item.title}</td>
                          <td data-label="Price" className="cart-price">₹{item.price}</td>
                          <td data-label="Quantity"><span className="cart-qty-badge">× {item.quantity}</span></td>
                          <td data-label="Subtotal" className="cart-total-cell">₹{item.price * item.quantity}</td>
                          <td data-label="Action">
                            <button className="btn-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Negotiation box */}
                <div className="nego-box">
                  <h5><i className="fas fa-comments"></i> Price Negotiation</h5>
                  <div className="nego-input-row">
                    <input
                      type="number"
                      className="nego-input"
                      placeholder="Enter your offer price (₹)"
                      value={negotiateAmount}
                      min={1}
                      onChange={(e) => setNegotiateAmount(e.target.value)}
                      disabled={negotiationStatus === 'pending'}
                    />
                    <button
                      className="btn-negotiate"
                      onClick={handleApplyNegotiate}
                      disabled={!negotiateAmount || negotiationStatus === 'pending' || Number(negotiateAmount) >= totalPrice}
                    >
                      Submit Offer
                    </button>
                  </div>
                  {negotiationStatus === 'pending' && (
                    <div className="nego-status-pill pending"><i className="fas fa-hourglass-half"></i> Awaiting farmer's approval…</div>
                  )}
                  {negotiationStatus === 'approved' && (
                    <div className="nego-status-pill approved"><i className="fas fa-check-circle"></i> Offer accepted! New total: ₹{negotiateAmount}</div>
                  )}
                  {negotiationStatus === 'rejected' && (
                    <div className="nego-status-pill rejected">
                      <i className="fas fa-times-circle"></i>
                      {negoError ? negoError : `Offer rejected. Original total: ₹${totalPrice}`}
                    </div>
                  )}
                </div>
              </Col>

              <Col lg={4}>
                <div className="cart-summary" style={{ marginTop: '60px' }}>
                  <h4>Order Summary</h4>
                  <div className="summary-row">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  {negotiationStatus === 'approved' && (
                    <div className="summary-row" style={{ color: '#065f46' }}>
                      <span>Negotiation Discount</span>
                      <span>- ₹{totalPrice - Number(negotiateAmount)}</span>
                    </div>
                  )}
                  <div className="summary-row">
                    <span>Delivery</span>
                    <span style={{ color: '#4a7c59' }}>Free</span>
                  </div>
                  <div className="summary-row total-row">
                    <span>Total</span>
                    <span>₹{displayTotal}</span>
                  </div>
                  <button
                    className="btn-checkout"
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                  >
                    Proceed to Checkout →
                  </button>
                </div>
              </Col>
            </Row>
          )}
        </div>
      </div>
      <Footer />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

export default Cart;
