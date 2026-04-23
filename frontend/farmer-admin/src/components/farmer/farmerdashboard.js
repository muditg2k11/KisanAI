import { Container, Table, Button, Alert, Row, Col, Card, Modal } from 'react-bootstrap';
import Sidebar from './sidebarmenufarmer';
import Navbar from '../navbar';
import Footer from '../footer';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../util';

function FarmerDashboard() {
  const [stats, setStats] = useState({
    productsAdded: 0,
    productsOrdered: 0,
    totalOrderValue: 0,
    totalIncome: 0,
    customerOrders: []
  });
  const [latestOrders, setLatestOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [negotiations, setNegotiations] = useState([]);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);
  const [ordersIndex, setOrdersIndex] = useState(0);
  const [negsIndex, setNegsIndex] = useState(0);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const farmerUsername = localStorage.getItem('username') || '';
    apiClient.get(`/api/dashboard-stats?farmer=${farmerUsername}`)
      .then(response => {
        setStats(response.data);
      })
      .catch(error => console.error(error));
    apiClient.get(`/api/latest-orders?farmer=${farmerUsername}`)
      .then(response => setLatestOrders(response.data.latestOrders))
      .catch(error => console.error(error));
    apiClient.get(`/api/recent-products?farmer=${farmerUsername}`)
      .then(response => setRecentProducts(response.data.recentProducts))
      .catch(error => console.error(error));
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
    if (storedRole === 'farmer') {
      fetchPendingNegotiations();
    }
  }, []);

  // Modal states for Negotiation
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentNeg, setCurrentNeg] = useState(null);
  const [actionType, setActionType] = useState('');

  // Modal states for Order Details
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleShowOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleShowConfirm = (neg, type) => {
    setCurrentNeg(neg);
    setActionType(type);
    setShowConfirm(true);
  };

  const confirmAction = async () => {
    if (!currentNeg) return;
    try {
      await apiClient.put(`/api/negotiations/${currentNeg.id}`, { status: actionType });
      setNegotiations(prev => prev.map(n => n.id === currentNeg.id ? { ...n, status: actionType } : n));
      setShowConfirm(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setShowConfirm(false);
    }
  };

  const fetchPendingNegotiations = async () => {
    try {
      const response = await apiClient.get('/api/negotiations/pending');
      setNegotiations(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDecision = async (id, decision) => {
    // This is now replaced by handleShowConfirm + confirmAction
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await apiClient.put(`/api/orders/${orderId}/status`, { status: newStatus });
      setLatestOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const getDisplayList = (list, count = 4) => {
    const displayList = [...list].slice(0, count);
    while (displayList.length < count) {
      displayList.push({ id: `placeholder-${displayList.length}`, isPlaceholder: true });
    }
    return displayList;
  };

  return (
    <div className="wrapper">
      <Navbar pageTitle="Dashboard" />
      <Sidebar />
      <div className="content-wrapper content-wrapper-responsive" style={{ backgroundColor: '#f4f7f6' }}>
        <style>{`
          .dashboard-card {
            border-radius: 16px !important;
            border: none !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05) !important;
            transition: transform 0.3s ease, box-shadow 0.3s ease !important;
            background: #fff;
            padding: 20px;
            display: flex;
            align-items: center;
            height: 100%;
            min-height: 110px;
          }
          .dashboard-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.1) !important;
          }
          .dashboard-card-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin-right: 15px;
            color: white;
          }
          .dashboard-card-content h6 {
            margin: 0;
            font-size: 13px;
            text-transform: uppercase;
            font-weight: 700;
            color: #8c98a4;
            letter-spacing: 0.5px;
          }
          .dashboard-card-content h3 {
            margin: 5px 0 0 0;
            font-size: 22px;
            font-weight: 800;
            color: #1e2022;
          }
          .box {
            border-radius: 16px !important;
            border: none !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05) !important;
            overflow: hidden;
          }
          /* Custom table hover effect */
          .custom-table tbody tr:hover {
            background-color: #f8faff !important;
          }
          /* Custom Native Modal Overlay */
          .custom-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center;
            z-index: 999999; backdrop-filter: blur(4px);
          }
          .custom-modal {
            background: white; border-radius: 12px; width: 92%; max-width: 500px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2); animation: modalFadeIn 0.3s ease;
            max-height: 90vh; overflow-y: auto;
          }
          @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          /* ===== MOBILE-ONLY RESPONSIVE STYLES ===== */
          @media (max-width: 768px) {
            /* --- Stats Cards: 2x2 compact grid --- */
            .dashboard-stats-grid {
              grid-template-columns: 1fr 1fr !important;
              gap: 10px !important;
              margin-bottom: 15px !important;
            }
            .dashboard-card {
              padding: 12px !important;
              min-height: auto !important;
              border-radius: 12px !important;
            }
            .dashboard-card:hover { transform: none; }
            .dashboard-card-icon {
              width: 38px !important; height: 38px !important;
              font-size: 16px !important; border-radius: 10px !important;
              margin-right: 10px !important;
            }
            .dashboard-card-content h6 { font-size: 9px !important; letter-spacing: 0.3px !important; }
            .dashboard-card-content h3 { font-size: 18px !important; margin-top: 2px !important; }

            /* --- Section boxes --- */
            .content { padding: 10px !important; }
            .box { border-radius: 12px !important; margin-bottom: 12px !important; }
            .box-header { padding: 12px 15px !important; }
            .box-header .box-title { font-size: 15px !important; }
            .box-footer { padding: 10px 15px !important; }

            /* --- Row columns full-width on mobile --- */
            .row { margin-left: 0 !important; margin-right: 0 !important; }
            .col-md-7, .col-md-5, .col-md-12 {
              padding-left: 0 !important; padding-right: 0 !important;
              margin-bottom: 0px !important;
              width: 100% !important;
              flex: 0 0 100% !important;
              max-width: 100% !important;
            }

            /* --- Recently Added products --- */
            .products-list .item { padding: 10px 14px !important; }
            .product-img img { width: 50px !important; height: 50px !important; border-radius: 50% !important; }
            .product-description {
              white-space: normal !important;
              display: -webkit-box !important; -webkit-line-clamp: 2;
              -webkit-box-orient: vertical; overflow: hidden !important;
            }
          }
        `}</style>

        <section className="content" style={{ padding: '25px' }}>
          {error && <div className="alert alert-danger" style={{ borderRadius: '8px' }}>{error}</div>}
          {/* Dashboard Info Cards */}
          <div className="dashboard-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '25px' }}>
            <div>
              <div className="dashboard-card">
                <div className="dashboard-card-icon" style={{ background: 'linear-gradient(135deg, #36b9cc, #1a8a9a)' }}>
                  <i className="fa fa-shopping-bag"></i>
                </div>
                <div className="dashboard-card-content">
                  <h6>Total Orders</h6>
                  <h3>{stats.customerOrders ? stats.customerOrders.length : 0}</h3>
                </div>
              </div>
            </div>

            <div>
              <div className="dashboard-card">
                <div className="dashboard-card-icon" style={{ background: 'linear-gradient(135deg, #4e73df, #224abe)' }}>
                  <i className="fa fa-cubes"></i>
                </div>
                <div className="dashboard-card-content">
                  <h6>Products Added</h6>
                  <h3>{stats.productsAdded}</h3>
                </div>
              </div>
            </div>

            <div>
              <div className="dashboard-card">
                <div className="dashboard-card-icon" style={{ background: 'linear-gradient(135deg, #f6c23e, #dda20a)' }}>
                  <i className="fa fa-cart-plus"></i>
                </div>
                <div className="dashboard-card-content">
                  <h6>Product Sold</h6>
                  <h3>{stats.productsOrdered}</h3>
                </div>
              </div>
            </div>

            <div>
              <div className="dashboard-card">
                <div className="dashboard-card-icon" style={{ background: 'linear-gradient(135deg, #858796, #5a5c69)' }}>
                  <i className="fa fa-list-alt"></i>
                </div>
                <div className="dashboard-card-content" title="Sum of all orders including pending COD">
                  <h6>Total Order Value</h6>
                  <h3>₹{(stats.totalOrderValue || 0).toLocaleString()}</h3>
                </div>
              </div>
            </div>

            <div>
              <div className="dashboard-card" style={{ border: '1px solid #1cc88a20' }}>
                <div className="dashboard-card-icon" style={{ background: 'linear-gradient(135deg, #1cc88a, #13855c)' }}>
                  <i className="fa fa-money"></i>
                </div>
                <div className="dashboard-card-content" title="Money received (Online + Delivered COD)">
                  <h6>Total Income</h6>
                  <h3>₹{(stats.totalIncome || 0).toLocaleString()}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="row" style={{ display: 'flex', flexWrap: 'wrap' }}>
            {/* Left col: Latest Orders */}
            <div className="col-md-7" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              {isMobile ? (
                /* === MOBILE: Index-based card carousel for Latest Orders === */
                <div style={{ marginBottom: '16px', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <h3 style={{ fontWeight: '700', fontSize: '16px', margin: 0, color: '#1e2022' }}>Latest Orders</h3>
                    <Link to="/farmer/orders" style={{ color: '#3c8dbc', fontWeight: '600', fontSize: '13px' }}>View All <i className="fa fa-arrow-right"></i></Link>
                  </div>
                  {latestOrders.length === 0 ? (
                    <div style={{ background: '#fff', padding: '24px', textAlign: 'center', color: '#999', fontSize: '14px', borderRadius: '12px', border: '1px solid #eee' }}>No orders yet.</div>
                  ) : (
                    <>
                      {(() => {
                        const order = latestOrders[ordersIndex] || latestOrders[0];
                        if (!order) return null;
                        return (
                          <div style={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', background: '#fff', overflow: 'hidden', width: '100%' }}>
                            <div style={{ background: 'linear-gradient(135deg, #00c0ef, #0097bd)', padding: '10px 16px' }}>
                              <span style={{ fontWeight: '800', fontSize: '15px', color: '#fff' }}>Order #{order.id}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 16px', borderBottom: '1px solid #f1f5f9' }}>
                              <span style={{ fontWeight: '700', color: '#475569', fontSize: '13px' }}>User</span>
                              <span style={{ fontWeight: '600', color: '#1e2022', fontSize: '14px' }}>{order.user}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 16px', borderBottom: '1px solid #f1f5f9' }}>
                              <span style={{ fontWeight: '700', color: '#475569', fontSize: '13px' }}>Items</span>
                              <Button variant="link" size="sm" style={{ padding: 0, fontSize: '13px', fontWeight: '600' }} onClick={() => handleShowOrderDetails(order)}>
                                {order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'} <i className="fa fa-eye"></i>
                              </Button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 16px', borderBottom: '1px solid #f1f5f9' }}>
                              <span style={{ fontWeight: '700', color: '#475569', fontSize: '13px' }}>Total</span>
                              <span style={{ fontWeight: '700', fontSize: '14px', color: '#1e2022' }}>
                                ₹{order.total.toLocaleString()} <span style={{ fontSize: '11px', color: '#7f8c8d', fontWeight: '400' }}>({order.payment_method?.toUpperCase()})</span>
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 16px' }}>
                              <span style={{ fontWeight: '700', color: '#475569', fontSize: '13px' }}>Status</span>
                              <select
                                value={order.status || 'pending'}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                style={{
                                  padding: '5px 10px', borderRadius: '6px', border: '1px solid #eee',
                                  fontSize: '12px', fontWeight: '700', textTransform: 'uppercase',
                                  background: order.status === 'delivered' ? '#e6fffa' : order.status === 'shipped' ? '#ebf8ff' : order.status === 'processing' ? '#fffaf0' : order.status === 'cancelled' ? '#fff5f5' : '#f7fafc',
                                  color: order.status === 'delivered' ? '#2c7a7b' : order.status === 'shipped' ? '#2b6cb0' : order.status === 'processing' ? '#c05621' : order.status === 'cancelled' ? '#c53030' : '#4a5568',
                                  cursor: 'pointer'
                                }}
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>
                        );
                      })()}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
                        <button
                          onClick={() => setOrdersIndex(i => Math.max(0, i - 1))}
                          disabled={ordersIndex === 0}
                          style={{
                            background: ordersIndex === 0 ? '#f0f0f0' : '#fff', border: '1px solid #ddd', borderRadius: '50%',
                            width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: ordersIndex === 0 ? 'not-allowed' : 'pointer',
                            fontSize: '14px', color: ordersIndex === 0 ? '#bbb' : '#333', flexShrink: 0
                          }}
                        >
                          <i className="fa fa-chevron-left"></i>
                        </button>
                        <span style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>{ordersIndex + 1} / {latestOrders.length}</span>
                        <button
                          onClick={() => setOrdersIndex(i => Math.min(latestOrders.length - 1, i + 1))}
                          disabled={ordersIndex >= latestOrders.length - 1}
                          style={{
                            background: ordersIndex >= latestOrders.length - 1 ? '#f0f0f0' : '#fff', border: '1px solid #ddd',
                            borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            cursor: ordersIndex >= latestOrders.length - 1 ? 'not-allowed' : 'pointer', fontSize: '14px',
                            color: ordersIndex >= latestOrders.length - 1 ? '#bbb' : '#333', flexShrink: 0
                          }}
                        >
                          <i className="fa fa-chevron-right"></i>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* === DESKTOP: Original table layout === */
                <div className="box box-info" style={{ borderTop: '3px solid #00c0ef', flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '0' }}>
                  <div className="box-header with-border" style={{ padding: '15px 20px' }}>
                    <h3 className="box-title" style={{ fontWeight: '700' }}>Latest Orders</h3>
                  </div>
                  <div className="box-body" style={{ padding: '0', flex: 1 }}>
                    <div className="table-responsive" style={{ height: '100%' }}>
                      <table className="table custom-table" style={{ marginBottom: '0' }}>
                        <thead style={{ background: '#f8f9fa' }}>
                          <tr>
                            <th style={{ padding: '15px', textAlign: 'center' }}>ID</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>User</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Items</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Total</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getDisplayList(latestOrders).map(order => (
                            <tr key={order.id} style={{ height: '55px' }}>
                              {order.isPlaceholder ? (
                                <><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>-</td></>
                              ) : (
                                <>
                                  <td style={{ verticalAlign: 'middle', padding: '12px 15px', textAlign: 'center' }}>#{order.id}</td>
                                  <td style={{ verticalAlign: 'middle', padding: '12px 15px', textAlign: 'center' }}>{order.user}</td>
                                  <td style={{ verticalAlign: 'middle', padding: '12px 15px', textAlign: 'center' }}>
                                    <Button variant="link" size="sm" style={{ padding: 0, fontSize: '12px', fontWeight: '600' }} onClick={() => handleShowOrderDetails(order)}>
                                      {order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'} <i className="fa fa-eye"></i>
                                    </Button>
                                  </td>
                                  <td style={{ verticalAlign: 'middle', padding: '12px 15px', fontWeight: '600', textAlign: 'center' }}>
                                    ₹{order.total.toLocaleString()} <span style={{ fontSize: '10px', color: '#7f8c8d', fontWeight: '400', display: 'block' }}>({order.payment_method?.toUpperCase()})</span>
                                  </td>
                                  <td style={{ verticalAlign: 'middle', padding: '12px 15px', textAlign: 'center' }}>
                                    <select
                                      value={order.status || 'pending'}
                                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                      style={{
                                        padding: '4px 10px', borderRadius: '6px', border: '1px solid #eee',
                                        fontSize: '12px', fontWeight: '700', textTransform: 'uppercase',
                                        background: order.status === 'delivered' ? '#e6fffa' : order.status === 'shipped' ? '#ebf8ff' : order.status === 'processing' ? '#fffaf0' : order.status === 'cancelled' ? '#fff5f5' : '#f7fafc',
                                        color: order.status === 'delivered' ? '#2c7a7b' : order.status === 'shipped' ? '#2b6cb0' : order.status === 'processing' ? '#c05621' : order.status === 'cancelled' ? '#c53030' : '#4a5568',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="processing">Processing</option>
                                      <option value="shipped">Shipped</option>
                                      <option value="delivered">Delivered</option>
                                      <option value="cancelled">Cancelled</option>
                                    </select>
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="box-footer" style={{ background: '#fff', textAlign: 'right', padding: '15px 20px' }}>
                    <Link to="/farmer/orders" className="btn btn-sm btn-link" style={{ color: '#3c8dbc', fontWeight: '600' }}>View All Orders <i className="fa fa-arrow-right"></i></Link>
                  </div>
                </div>
              )}
            </div>

            {/* Right col: Recently Added products */}
            <div className="col-md-5" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <div className="box box-primary" style={{ borderTop: '3px solid #3c8dbc', flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '0' }}>
                <div className="box-header with-border" style={{ padding: '15px 20px' }}>
                  <h3 className="box-title" style={{ fontWeight: '700' }}>Recently Added</h3>
                </div>
                <div className="box-body" style={{ padding: '0', flex: 1, overflowY: 'auto' }}>
                  <ul className="products-list product-list-in-box">
                    {getDisplayList(recentProducts).map(product => (
                      <li className="item" key={product.id} style={{ padding: '12px 20px' }}>
                        {product.isPlaceholder ? (
                          <div style={{ color: '#cfd8dc', fontStyle: 'italic', height: '45px', display: 'flex', alignItems: 'center' }}>Empty slot</div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="product-img" style={{ marginRight: '15px' }}>
                              <img
                                src={product.image ? `http://localhost:5000/${product.image}` : 'https://via.placeholder.com/50'}
                                alt={product.name}
                                style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }}
                              />
                            </div>
                            <div className="product-info" style={{ flex: 1, minWidth: 0 }}>
                              <span style={{ fontWeight: '600', color: '#333', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                                {product.name}
                                <span className="label pull-right" style={{ background: '#e6fffa', color: '#2c7a7b', borderRadius: '4px', fontSize: '11px', marginTop: '2px' }}>₹{product.price}</span>
                              </span>
                              <span className="product-description" style={{ color: '#888', fontSize: '12px', display: 'block', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.description}</span>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="box-footer text-center" style={{ background: '#fff', padding: '15px 20px' }}>
                  <Link to="/farmer/products" className="btn btn-sm btn-link" style={{ color: '#3c8dbc', fontWeight: '600' }}>Manage All Products <i className="fa fa-arrow-right"></i></Link>
                </div>
              </div>
            </div>
          </div>

          {/* Negotiation Section */}
          <div className="col-md-12">
            {isMobile ? (
              /* === MOBILE: Index-based card carousel for negotiations === */
              <div style={{ marginBottom: '16px', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3 style={{ fontWeight: '700', fontSize: '16px', margin: 0, color: '#1e2022' }}>Negotiation Requests</h3>
                  <button onClick={fetchPendingNegotiations} style={{ background: 'none', border: 'none', color: '#3c8dbc', fontWeight: '600', fontSize: '13px', cursor: 'pointer', padding: 0 }}>
                    <i className="fa fa-refresh"></i> Refresh
                  </button>
                </div>
                {negotiations.length === 0 ? (
                  <div style={{ background: '#fff', padding: '24px', textAlign: 'center', color: '#999', fontSize: '14px', borderRadius: '12px', border: '1px solid #eee' }}>No pending negotiation requests.</div>
                ) : (
                  <>
                    {(() => {
                      const negotiation = negotiations[negsIndex] || negotiations[0];
                      if (!negotiation) return null;
                      return (
                        <div style={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', background: '#fff', overflow: 'hidden', width: '100%' }}>
                          <div style={{ background: 'linear-gradient(135deg, #00a65a, #007a43)', padding: '10px 16px' }}>
                            <span style={{ fontWeight: '800', fontSize: '15px', color: '#fff' }}>Negotiation Request</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 16px', borderBottom: '1px solid #f1f5f9' }}>
                            <span style={{ fontWeight: '700', color: '#475569', fontSize: '13px' }}>User</span>
                            <span style={{ fontWeight: '600', color: '#1e2022', fontSize: '14px' }}>{negotiation.username}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 16px', borderBottom: '1px solid #f1f5f9' }}>
                            <span style={{ fontWeight: '700', color: '#475569', fontSize: '13px' }}>Original</span>
                            <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '14px' }}>₹{negotiation.originalAmount}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 16px', borderBottom: '1px solid #f1f5f9' }}>
                            <span style={{ fontWeight: '700', color: '#475569', fontSize: '13px' }}>Offer</span>
                            <span style={{ fontWeight: '800', color: '#00a65a', fontSize: '16px' }}>₹{negotiation.negotiatedAmount}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 16px', borderBottom: '1px solid #f1f5f9' }}>
                            <span style={{ fontWeight: '700', color: '#475569', fontSize: '13px' }}>Items</span>
                            <span style={{ fontSize: '13px', background: '#e8f8f5', color: '#2c7a7b', borderRadius: '6px', padding: '3px 10px', fontWeight: '700' }}>
                              {negotiation.items?.length || 0} {negotiation.items?.length === 1 ? 'item' : 'items'}
                            </span>
                          </div>
                          <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'center' }}>
                            {negotiation.status && negotiation.status !== 'pending' ? (
                              <span style={{ padding: '7px 20px', fontSize: '13px', borderRadius: '6px', display: 'inline-block', fontWeight: '700', background: negotiation.status === 'approved' ? '#e6fffa' : '#fff5f5', color: negotiation.status === 'approved' ? '#2c7a7b' : '#c53030' }}>
                                {negotiation.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                              </span>
                            ) : (
                              <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                                <Button variant="success" size="sm" style={{ flex: 1, borderRadius: '8px', fontWeight: '600' }} onClick={() => handleShowConfirm(negotiation, 'approved')}>
                                  <i className="fa fa-check" style={{ marginRight: '5px' }}></i>Approve
                                </Button>
                                <Button variant="danger" size="sm" style={{ flex: 1, borderRadius: '8px', fontWeight: '600' }} onClick={() => handleShowConfirm(negotiation, 'rejected')}>
                                  <i className="fa fa-times" style={{ marginRight: '5px' }}></i>Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
                      <button
                        onClick={() => setNegsIndex(i => Math.max(0, i - 1))}
                        disabled={negsIndex === 0}
                        style={{
                          background: negsIndex === 0 ? '#f0f0f0' : '#fff', border: '1px solid #ddd', borderRadius: '50%',
                          width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: negsIndex === 0 ? 'not-allowed' : 'pointer',
                          fontSize: '14px', color: negsIndex === 0 ? '#bbb' : '#333', flexShrink: 0
                        }}
                      >
                        <i className="fa fa-chevron-left"></i>
                      </button>
                      <span style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>{negsIndex + 1} / {negotiations.length}</span>
                      <button
                        onClick={() => setNegsIndex(i => Math.min(negotiations.length - 1, i + 1))}
                        disabled={negsIndex >= negotiations.length - 1}
                        style={{
                          background: negsIndex >= negotiations.length - 1 ? '#f0f0f0' : '#fff', border: '1px solid #ddd',
                          borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          cursor: negsIndex >= negotiations.length - 1 ? 'not-allowed' : 'pointer', fontSize: '14px',
                          color: negsIndex >= negotiations.length - 1 ? '#bbb' : '#333', flexShrink: 0
                        }}
                      >
                        <i className="fa fa-chevron-right"></i>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* === DESKTOP: Original table layout === */
              <div className="box box-success" style={{ borderTop: '3px solid #00a65a' }}>
                <div className="box-header with-border" style={{ padding: '15px 20px' }}>
                  <h3 className="box-title" style={{ fontWeight: '700', margin: '0', display: 'inline-block' }}>Negotiation Requests</h3>
                  <Button variant="default" size="xs" className="pull-right" style={{ borderRadius: '4px', marginTop: '2px' }} onClick={fetchPendingNegotiations}>
                    <i className="fa fa-refresh"></i> Refresh
                  </Button>
                </div>
                <div className="box-body" style={{ padding: '0' }}>
                  {negotiations.length === 0 ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#999' }}>
                      <p>No pending negotiation requests.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table custom-table" style={{ marginBottom: '0' }}>
                        <thead style={{ background: '#f8f9fa' }}>
                          <tr>
                            <th style={{ padding: '15px' }}>User</th>
                            <th style={{ padding: '15px' }}>Original</th>
                            <th style={{ padding: '15px' }}>Offer</th>
                            <th style={{ padding: '15px' }}>Items</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {negotiations.map(negotiation => (
                            <tr key={negotiation.id}>
                              <td style={{ verticalAlign: 'middle', padding: '12px 15px' }}>{negotiation.username}</td>
                              <td style={{ verticalAlign: 'middle', padding: '12px 15px', textDecoration: 'line-through', color: '#999' }}>₹{negotiation.originalAmount}</td>
                              <td style={{ verticalAlign: 'middle', padding: '12px 15px', color: '#00a65a', fontWeight: '700' }}>₹{negotiation.negotiatedAmount}</td>
                              <td style={{ verticalAlign: 'middle', padding: '12px 15px', fontSize: '13px' }}>
                                {negotiation.items?.length || 0} {negotiation.items?.length === 1 ? 'item' : 'items'}
                              </td>
                              <td style={{ verticalAlign: 'middle', padding: '12px 15px', textAlign: 'center' }}>
                                {negotiation.status && negotiation.status !== 'pending' ? (
                                  <span className={`label ${negotiation.status === 'approved' ? 'label-success' : 'label-danger'}`} style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '4px', display: 'inline-block', minWidth: '70px' }}>
                                    {negotiation.status === 'approved' ? 'Approved' : 'Rejected'}
                                  </span>
                                ) : (
                                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                    <Button variant="success" size="xs" style={{ borderRadius: '4px', padding: '4px 10px', fontWeight: '600' }} onClick={() => handleShowConfirm(negotiation, 'approved')}>Approve</Button>
                                    <Button variant="danger" size="xs" style={{ borderRadius: '4px', padding: '4px 10px', fontWeight: '600' }} onClick={() => handleShowConfirm(negotiation, 'rejected')}>Reject</Button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Confirmation Custom Modal */}
          {showConfirm && (
            <div className="custom-modal-overlay">
              <div className="custom-modal">
                <div style={{ padding: '24px 24px 0', borderBottom: 'none', display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#2c3e50', margin: 0 }}>
                    {actionType === 'approved' ? '👍 Approve Offer' : '🛑 Reject Offer'}
                  </h3>
                  <button onClick={() => setShowConfirm(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' }}>&times;</button>
                </div>
                <div style={{ padding: '24px', fontSize: '16px', color: '#555' }}>
                  Are you sure you want to <strong>{actionType}</strong> the negotiated price of
                  <span style={{
                    color: actionType === 'approved' ? '#27ae60' : '#e74c3c',
                    fontWeight: '800',
                    fontSize: '20px',
                    margin: '0 6px',
                    background: actionType === 'approved' ? '#e8f8f5' : '#fdedec',
                    padding: '4px 10px',
                    borderRadius: '8px'
                  }}>
                    ₹{currentNeg?.negotiatedAmount}
                  </span>
                  from <strong style={{ color: '#2c3e50' }}>{currentNeg?.username || currentNeg?.userEmail}</strong>?
                </div>
                <div style={{ padding: '0 24px 24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <Button
                    variant="light"
                    onClick={() => setShowConfirm(false)}
                    style={{ borderRadius: '8px', fontWeight: '600', padding: '10px 20px', backgroundColor: '#f1f2f6', border: 'none', color: '#555' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={actionType === 'approved' ? 'success' : 'danger'}
                    onClick={confirmAction}
                    style={{
                      borderRadius: '8px',
                      fontWeight: '700',
                      padding: '10px 24px',
                      boxShadow: actionType === 'approved' ? '0 4px 12px rgba(39,174,96,0.3)' : '0 4px 12px rgba(231,76,60,0.3)',
                      border: 'none',
                      backgroundColor: actionType === 'approved' ? '#27ae60' : '#e74c3c'
                    }}
                  >
                    Yes, {actionType === 'approved' ? 'Approve' : 'Reject'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Order Details Custom Modal */}
          {showOrderModal && selectedOrder && (
            <div className="custom-modal-overlay">
              <div className="custom-modal" style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                {/* Header */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                  <h3 style={{ margin: 0, fontWeight: '800', color: '#1e2022', fontSize: '18px' }}>
                    Order <span style={{ color: '#3c8dbc' }}>#{selectedOrder.id}</span>
                  </h3>
                  <button onClick={() => setShowOrderModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999', padding: '0 5px' }}>&times;</button>
                </div>

                {/* Body - Scrollable */}
                <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                  
                  {/* Info Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                    
                    {/* Customer Column */}
                    <div>
                      <h6 style={{ textTransform: 'uppercase', fontSize: '11px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '8px' }}>Customer</h6>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                        <i className="fa fa-user-circle" style={{ color: '#cbd5e1', marginRight: '8px', fontSize: '16px' }}></i>
                        <span style={{ fontWeight: '600', color: '#334155', fontSize: '14px' }}>{selectedOrder.user}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <i className="fa fa-envelope" style={{ color: '#cbd5e1', marginRight: '8px', fontSize: '14px' }}></i>
                        <span style={{ color: '#64748b', fontSize: '13px' }}>{selectedOrder.email}</span>
                      </div>
                    </div>

                    {/* Payment/Status Column */}
                    <div style={{ textAlign: 'right' }}>
                      <h6 style={{ textTransform: 'uppercase', fontSize: '11px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '8px' }}>Details</h6>
                      <div style={{ marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', color: '#64748b', marginRight: '5px' }}>Payment:</span>
                        <span style={{ fontWeight: '700', color: '#334155', fontSize: '14px' }}>{selectedOrder.payment_method?.toUpperCase()}</span>
                      </div>
                      <div>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '20px', 
                          fontSize: '11px', 
                          fontWeight: '700', 
                          textTransform: 'uppercase',
                          backgroundColor: selectedOrder.status === 'delivered' ? '#dcfce7' : selectedOrder.status === 'cancelled' ? '#fee2e2' : '#f1f5f9',
                          color: selectedOrder.status === 'delivered' ? '#166534' : selectedOrder.status === 'cancelled' ? '#991b1b' : '#475569',
                          display: 'inline-block'
                        }}>
                          {selectedOrder.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Items Section */}
                  <h6 style={{ textTransform: 'uppercase', fontSize: '11px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '12px' }}>Ordered Items ({selectedOrder.items?.length || 0})</h6>
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '12px 16px',
                        borderBottom: index === selectedOrder.items.length - 1 ? 'none' : '1px solid #f1f5f9',
                        backgroundColor: '#fff'
                      }}>
                        <div style={{ 
                          width: '40px', height: '40px', borderRadius: '8px', background: '#f8fafc', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px',
                          color: '#64748b', fontSize: '16px', flexShrink: 0
                        }}>
                          <i className="fa fa-cube"></i>
                        </div>
                        <div style={{ flex: 1, marginRight: '10px' }}>
                          <div style={{ fontWeight: '600', color: '#334155', fontSize: '14px', marginBottom: '2px' }}>{item.title || item.name}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Qty: {item.quantity} × ₹{item.price}</div>
                        </div>
                        <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '14px' }}>
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Footer - Total & Close */}
                <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <Button variant="link" onClick={() => setShowOrderModal(false)} style={{ color: '#64748b', textDecoration: 'none', fontWeight: '600', padding: 0 }}>Close</Button>
                   <div style={{ display: 'flex', alignItems: 'baseline' }}>
                     <span style={{ fontSize: '13px', color: '#64748b', marginRight: '8px', fontWeight: '600' }}>Total:</span>
                     <span style={{ fontSize: '20px', fontWeight: '800', color: '#3c8dbc' }}>₹{selectedOrder.total.toLocaleString()}</span>
                   </div>
                </div>

              </div>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div >
  );
}

export default FarmerDashboard;
