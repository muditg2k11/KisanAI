import React, { useState, useEffect } from 'react';
import { Container, Table, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../header';
import Footer from '../footer';
import AuthModal from '../AuthModal';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const styles = `
  .orders-page { background: #f8f9fa; min-height: 60vh; }
  .orders-hero { background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 50%, #f4a61e 100%); padding: 60px 0 40px; color: white; text-align: center; }
  .orders-hero h1 { font-size: 2.4rem; font-weight: 700; margin-bottom: 6px; }
  .orders-hero p { font-size: 1rem; opacity: 0.85; }
  .orders-container { max-width: 1100px; margin: 48px auto; padding: 0 24px; }
  
  /* Auth needed state */
  .auth-needed-box { text-align: center; padding: 80px 40px; background: transparent; max-width: 500px; margin: 60px auto; }
  .auth-needed-box .auth-icon { font-size: 64px; margin-bottom: 20px; }
  .auth-needed-box h2 { font-size: 1.6rem; font-weight: 700; color: #2d5a27; margin-bottom: 10px; }
  .auth-needed-box p { color: #888; margin-bottom: 28px; font-size: 1rem; }
  .auth-needed-box button { background: linear-gradient(135deg, #2d5a27, #4a7c59); color: white; border: none; padding: 14px 40px; border-radius: 50px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
  .auth-needed-box button:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(74,124,89,0.35); }

  /* Loading */  
  .orders-loading { text-align: center; padding: 80px 20px; }
  .orders-loading .spinner { width: 52px; height: 52px; border: 4px solid #e8f5e9; border-top-color: #4a7c59; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 18px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .orders-loading p { color: #4a7c59; font-weight: 600; font-size: 1rem; }

  /* Error */
  .orders-error { text-align: center; padding: 60px 20px; }
  .orders-error .err-icon { font-size: 52px; margin-bottom: 12px; }
  .orders-error h3 { color: #c0392b; font-size: 1.3rem; margin-bottom: 8px; }
  .orders-error p { color: #888; }

  /* Empty state */
  .orders-empty { text-align: center; padding: 80px 40px; background: transparent; max-width: 520px; margin: 0 auto; }
  .orders-empty .empty-icon { font-size: 72px; margin-bottom: 20px; }
  .orders-empty h2 { font-size: 1.5rem; font-weight: 700; color: #2d5a27; margin-bottom: 10px; }
  .orders-empty p { color: #888; margin-bottom: 28px; }
  .orders-empty a { background: linear-gradient(135deg, #2d5a27, #4a7c59); color: white; border: none; padding: 13px 36px; border-radius: 50px; font-size: 0.95rem; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; transition: transform 0.2s, box-shadow 0.2s; }
  .orders-empty a:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(74,124,89,0.35); color: white; }

  /* Orders table */
  .orders-card { background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); overflow: hidden; }
  .orders-card-header { padding: 24px 28px; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; gap: 12px; }
  .orders-card-header h2 { margin: 0; font-size: 1.3rem; font-weight: 700; color: #2d5a27; }
  .orders-table { margin: 0 !important; }
  .orders-table thead th { background: linear-gradient(135deg, #2d5a27, #4a7c59); color: white; font-weight: 600; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.04em; padding: 14px 16px; border: none; }
  .orders-table tbody tr { transition: background 0.15s; }
  .orders-table tbody tr:hover { background: #f0f9f0; }
  .orders-table tbody td { padding: 14px 16px; vertical-align: middle; font-size: 0.9rem; border-color: #f0f0f0; color: #444; }
  .status-badge { display: inline-block; padding: 5px 14px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; text-transform: capitalize; }
  .status-badge.pending { background: #fff3cd; color: #856404; }
  .status-badge.delivered { background: #d1fae5; color: #065f46; }
  .status-badge.cancelled { background: #fee2e2; color: #991b1b; }
  .status-badge.processing { background: #dbeafe; color: #1e40af; }
  .status-badge.shipped { background: #e0e7ff; color: #3730a3; }
  .item-list { list-style: none; padding: 0; margin: 0; }
  .item-list li { font-size: 0.83rem; color: #555; padding: 2px 0; }
  .order-total { font-weight: 700; color: #2d5a27; }
  .order-count-badge { background: linear-gradient(135deg, #f4a61e, #e8930a); color: white; border-radius: 20px; padding: 3px 12px; font-size: 0.8rem; font-weight: 700; }
  .btn-track { background: linear-gradient(135deg, #2d5a27, #4a7c59); color: white; border: none; padding: 6px 16px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: opacity 0.2s, transform 0.2s; white-space: nowrap; }
  .btn-track:hover { opacity: 0.85; transform: translateY(-1px); }

  /* Track Order Modal */
  .track-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
  .track-modal { background: white; border-radius: 20px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2); animation: modalSlideIn 0.3s ease; }
  @keyframes modalSlideIn { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .track-modal-header { padding: 24px 28px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; }
  .track-modal-header h3 { margin: 0; font-size: 1.25rem; font-weight: 700; color: #2d5a27; }
  .track-modal-close { background: none; border: none; font-size: 1.5rem; color: #999; cursor: pointer; padding: 4px 8px; border-radius: 8px; transition: background 0.2s; }
  .track-modal-close:hover { background: #f3f4f6; color: #333; }
  .track-modal-body { padding: 24px 28px 28px; }
  .track-detail { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f5f5f5; font-size: 0.9rem; }
  .track-detail-label { color: #888; font-weight: 500; }
  .track-detail-value { color: #333; font-weight: 600; }
  .track-items-title { font-size: 0.95rem; font-weight: 700; color: #2d5a27; margin: 20px 0 10px; }
  .track-item { display: flex; justify-content: space-between; padding: 6px 0; font-size: 0.85rem; color: #555; border-bottom: 1px solid #f9f9f9; }

  /* Order Tracking Stepper */
  .order-stepper { display: flex; align-items: center; gap: 0; padding: 20px 0; justify-content: center; }
  .stepper-step { display: flex; flex-direction: column; align-items: center; position: relative; flex: 0 0 auto; }
  .stepper-dot { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; color: white; transition: all 0.3s; border: 3px solid #e5e7eb; background: #f3f4f6; position: relative; z-index: 2; }
  .stepper-dot.completed { background: #16a34a; border-color: #16a34a; }
  .stepper-dot.active { background: #2563eb; border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,0.18); }
  .stepper-dot.cancelled-dot { background: #dc2626; border-color: #dc2626; }
  .stepper-dot i { font-size: 0.7rem; }
  .stepper-label { font-size: 0.68rem; font-weight: 600; color: #9ca3af; margin-top: 6px; text-transform: capitalize; white-space: nowrap; }
  .stepper-label.completed { color: #16a34a; }
  .stepper-label.active { color: #2563eb; }
  .stepper-label.cancelled-label { color: #dc2626; }
  .stepper-line { flex: 1; height: 3px; min-width: 30px; background: #e5e7eb; margin: 0 -1px; align-self: flex-start; margin-top: 15px; position: relative; z-index: 1; }
  .stepper-line.completed { background: #16a34a; }
`;

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const rawUser = localStorage.getItem('username');
    const isAuth = !!rawUser && rawUser !== 'undefined' && rawUser !== 'null';
    if (!isAuth) {
      setIsAuthenticated(false);
      setLoading(false);
      // Automatically pop up modal
      setShowAuthModal(true);
      return;
    }
    setIsAuthenticated(true);
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:5001/api/orders/by-username/${rawUser}`,
          { timeout: 10000 }  // 10 second timeout
        );
        setOrders(response.data.orders || []);
      } catch (err) {
        if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
          setError('Connection timed out. Please check if the server is running.');
        } else if (!err.response) {
          setError('Cannot connect to server. Please ensure the backend is running on port 5000.');
        } else {
          setError(err.response?.data?.message || 'Failed to load orders.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusClass = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('deliver')) return 'delivered';
    if (s.includes('cancel')) return 'cancelled';
    if (s.includes('process')) return 'processing';
    if (s.includes('ship')) return 'shipped';
    return 'pending';
  };

  const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];

  const getStepIndex = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('deliver')) return 3;
    if (s.includes('ship')) return 2;
    if (s.includes('process')) return 1;
    return 0;
  };

  const renderStepper = (status = '') => {
    const isCancelled = status.toLowerCase().includes('cancel');
    const currentIndex = getStepIndex(status);

    if (isCancelled) {
      return (
        <div className="order-stepper">
          <div className="stepper-step">
            <div className="stepper-dot cancelled-dot"><i className="fa fa-times"></i></div>
            <span className="stepper-label cancelled-label">Cancelled</span>
          </div>
        </div>
      );
    }

    return (
      <div className="order-stepper">
        {statusSteps.map((step, idx) => (
          <React.Fragment key={step}>
            <div className="stepper-step">
              <div className={`stepper-dot ${idx < currentIndex ? 'completed' : idx === currentIndex ? 'active' : ''}`}>
                {idx < currentIndex ? <i className="fa fa-check"></i> : idx === currentIndex ? (idx + 1) : (idx + 1)}
              </div>
              <span className={`stepper-label ${idx < currentIndex ? 'completed' : idx === currentIndex ? 'active' : ''}`}>
                {step}
              </span>
            </div>
            {idx < statusSteps.length - 1 && (
              <div className={`stepper-line ${idx < currentIndex ? 'completed' : ''}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const getItemName = (item) => {
    return item.title || item.name || 'Product';
  };

  function renderContent() {
    if (loading) {
      return (
        <div className="orders-loading">
          <div className="spinner"></div>
          <p>Fetching your orders...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="auth-needed-box">
          <span className="auth-icon"><i className="fas fa-lock" style={{ color: '#2d5a27' }}></i></span>
          <h3>Sign In to View Orders</h3>
          <p>Please log in to your account to view your purchase history and track active orders.</p>
          <button onClick={() => setShowAuthModal(true)}>
            Sign In / Register
          </button>
        </div>
      );
    }

    if (error) {
      return (
        <div className="orders-error">
          <span className="err-icon"><i className="fas fa-exclamation-triangle" style={{ color: '#c0392b' }}></i></span>
          <p>{error}</p>
          <button className="browse-btn" onClick={() => window.location.reload()}>Retry</button>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="orders-empty">
          <span className="empty-icon"><i className="fas fa-box-open" style={{ color: '#2d5a27' }}></i></span>
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders. Explore our shop and start shopping fresh farm produce!</p>
          <a href="/consumer/products" className="browse-btn">Browse Products</a>
        </div>
      );
    }

    return (
      <div className="orders-card">
        <div className="orders-card-header">
          <h2>My Orders</h2>
          <span className="order-count-badge">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <Table className="orders-table" bordered={false} hover={false}>
            <thead>
              <tr>
                <th>#</th>
                <th>Products</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={order.id || idx}>
                  <td style={{ fontWeight: 600, color: '#4a7c59' }}>#{order.id}</td>
                  <td>
                    <ul className="item-list">
                      {(order.items || []).map((item, i) => (
                        <li key={i}>🌿 {getItemName(item)} × {item.quantity}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="order-total">₹{order.total}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                    </span>
                  </td>
                  <td>{order.payment_method}</td>
                  <td>
                    <button className="btn-track" onClick={() => setTrackingOrder(order)}>
                      📦 Track Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <div>
      <style>{styles}</style>
      <div id="pxl-page" className="pxl-page header-pos-df">
        <Header />
        <div id="pxl-pagetitle" className="pxl-pagetitle layout-df relative has-parallax overflow-hidden pxl-animate">
          <div className="pxl-page-title-bg pxl-absoluted" data-parallax='{"y":"80"}' style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1920&q=80)' }}></div>
          <div className="pxl-page-title-overlay"></div>
          <div className="container relative">
            <div className="pxl-page-title-inner row align-content-center">
              <div className="pxl-page-title col-12">
                <div className="sub-title">Track Your Purchases</div>
                <h1 className="main-title">My Orders</h1>
              </div>
              <div className="pxl-breadcrumb d-flex">
                <div className="breadcrumb-inner">
                  <div className="br-item"><a className="br-link hover-underline" href="/">Home</a><span className="br-divider"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M264.547 70.633L440.547 238.633C445.297 243.164 447.984 249.445 447.984 256.008S445.297 268.852 440.547 273.383L264.547 441.383C254.953 450.508 239.766 450.164 230.609 440.57C221.453 431.07 221.797 415.82 231.422 406.633L364.09 280.008H24C10.75 280.008 0 269.258 0 256.008S10.75 232.008 24 232.008H364.09L231.422 105.383C221.797 96.227 221.453 80.977 230.609 71.445C239.766 61.852 254.953 61.508 264.547 70.633Z"></path></svg></span></div><div className="br-item"><span className="br-text">Orders</span><span className="br-divider"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M264.547 70.633L440.547 238.633C445.297 243.164 447.984 249.445 447.984 256.008S445.297 268.852 440.547 273.383L264.547 441.383C254.953 450.508 239.766 450.164 230.609 440.57C221.453 431.07 221.797 415.82 231.422 406.633L364.09 280.008H24C10.75 280.008 0 269.258 0 256.008S10.75 232.008 24 232.008H364.09L231.422 105.383C221.797 96.227 221.453 80.977 230.609 71.445C239.766 61.852 254.953 61.508 264.547 70.633Z"></path></svg></span></div>                                    </div>
              </div>
            </div>
          </div>
        </div>
        <div id="pxl-main" className="pxl-main">
          <div className="orders-container">
            {renderContent()}
          </div>
        </div>
        <Footer />
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Track Order Modal */}
      {trackingOrder && (
        <div className="track-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setTrackingOrder(null); }}>
          <div className="track-modal">
            <div className="track-modal-header">
              <h3>📦 Order Tracking — #{trackingOrder.id}</h3>
              <button className="track-modal-close" onClick={() => setTrackingOrder(null)}>×</button>
            </div>
            <div className="track-modal-body">
              {/* Stepper */}
              {renderStepper(trackingOrder.status)}

              {/* Order Details */}
              <div style={{ marginTop: '20px' }}>
                <div className="track-detail">
                  <span className="track-detail-label">Order ID</span>
                  <span className="track-detail-value">#{trackingOrder.id}</span>
                </div>
                <div className="track-detail">
                  <span className="track-detail-label">Status</span>
                  <span className="track-detail-value">
                    <span className={`status-badge ${getStatusClass(trackingOrder.status)}`}>
                      {trackingOrder.status ? trackingOrder.status.charAt(0).toUpperCase() + trackingOrder.status.slice(1) : 'Pending'}
                    </span>
                  </span>
                </div>
                <div className="track-detail">
                  <span className="track-detail-label">Total Amount</span>
                  <span className="track-detail-value" style={{ color: '#2d5a27', fontWeight: 700 }}>₹{trackingOrder.total}</span>
                </div>
                <div className="track-detail">
                  <span className="track-detail-label">Payment Method</span>
                  <span className="track-detail-value">{trackingOrder.payment_method}</span>
                </div>
                {trackingOrder.delivery_address && (
                  <div className="track-detail">
                    <span className="track-detail-label">Delivery Address</span>
                    <span className="track-detail-value" style={{ textAlign: 'right', maxWidth: '60%' }}>{trackingOrder.delivery_address}</span>
                  </div>
                )}
              </div>

              {/* Products in order */}
              <div className="track-items-title">Products in this order</div>
              {(trackingOrder.items || []).map((item, i) => (
                <div className="track-item" key={i}>
                  <span>🌿 {getItemName(item)}</span>
                  <span>× {item.quantity} — ₹{(item.price || 0) * (item.quantity || 1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
