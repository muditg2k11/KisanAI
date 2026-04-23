// ApprovalComponent.js
import React, { useState, useEffect, useRef } from 'react';
import { Container, Table, Button, Alert, Modal } from 'react-bootstrap';
import Sidebar from './sidebarmenufarmer';
import Navbar from '../navbar';
import Footer from '../footer';
import apiClient from '../util';

function NegotiationApproval() {
  const [negotiations, setNegotiations] = useState([]);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);

  const negsRef = useRef(null);

  const scrollToStep = (direction) => {
    if (negsRef.current) {
      const { scrollLeft, clientWidth } = negsRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      negsRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Modal states
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentNeg, setCurrentNeg] = useState(null);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);

    if (storedRole === 'farmer') {
      fetchPendingNegotiations();
    }
  }, []);

  const fetchPendingNegotiations = async () => {
    try {
      const response = await apiClient.get('/api/negotiations/pending');
      setNegotiations(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
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
      setNegotiations(prev => prev.filter(n => n.id !== currentNeg.id));
      setShowConfirm(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setShowConfirm(false);
    }
  };

  return (
    <div className="wrapper">
      <Navbar pageTitle="Negotiation Requests" />
      <Sidebar />
      <div className="content-wrapper content-wrapper-responsive" style={{ backgroundColor: '#f4f7f6' }}>
        <style>{`
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
          
          /* Mobile Table Cards (Carousel Style Refined) */
          @media (max-width: 768px) {
            .mobile-card-table { display: block !important; width: 100% !important; }
            .mobile-card-table thead { display: none; }
            .mobile-card-table tbody {
              display: flex !important; overflow-x: auto !important; scroll-snap-type: x mandatory;
              padding: 10px 20px !important; gap: 15px; -webkit-overflow-scrolling: touch;
              width: 100% !important; box-sizing: border-box;
            }
            .mobile-card-table tr {
              display: flex !important; flex-direction: column !important; 
              min-width: 100% !important; max-width: 100% !important;
              scroll-snap-align: start; margin-bottom: 0; border: 1px solid #e2e8f0;
              border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); background: #fff;
              flex-shrink: 0;
            }
            .mobile-card-table td {
              display: flex !important; justify-content: space-between !important; align-items: center;
              text-align: right !important; padding: 12px 15px !important; border-bottom: 1px solid #f1f5f9;
              width: auto !important;
            }
            .mobile-card-table td::before {
              content: attr(data-label); font-weight: 700; color: #475569;
              text-align: left; flex: 1;
            }
            .mobile-card-table td:last-child { border-bottom: none; justify-content: center !important; padding: 15px !important; }
            .mobile-card-table td:last-child::before { display: none; }
            .mobile-card-table tbody::-webkit-scrollbar { display: none; } /* Hide scrollbar for cleaner look */
            .table-responsive { overflow: visible !important; } /* Prevents double scrollbar */
            
            .carousel-btn {
              background: #fff; border: 1px solid #ddd; border-radius: 50%;
              width: 36px; height: 36px; display: flex; align-items: center;
              justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
              color: #333; transition: all 0.2s;
            }
            .carousel-btn:active { background: #f8f9fa; transform: scale(0.95); }
          }
          /* Stacked Cards Table for Negotiations */
          @media (max-width: 768px) {
            .stacked-cards-table { display: block !important; width: 100% !important; }
            .stacked-cards-table thead { display: none; }
            .stacked-cards-table tbody {
              display: flex !important; flex-direction: column !important;
              padding: 10px !important; gap: 15px;
              width: 100% !important; box-sizing: border-box;
            }
            .stacked-cards-table tr {
              display: flex !important; flex-direction: column !important; 
              width: 100% !important;
              margin-bottom: 0; border: 1px solid #e2e8f0;
              border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); background: #fff;
            }
            .stacked-cards-table td {
              display: flex !important; justify-content: space-between !important; align-items: center;
              text-align: right !important; padding: 12px 15px !important; border-bottom: 1px solid #f1f5f9;
              width: auto !important;
            }
            .stacked-cards-table td::before {
              content: attr(data-label); font-weight: 700; color: #475569;
              text-align: left; flex: 1;
            }
            .stacked-cards-table td:last-child { border-bottom: none; justify-content: center !important; padding: 15px !important; }
            .stacked-cards-table td:last-child::before { display: none; }
          }

        `}</style>

        <section className="content" style={{ padding: '15px 0px 20px' }}>
          <div style={{ backgroundColor: '#fff', margin: '0', padding: '0' }}>
            <div style={{ padding: '0' }}>
              {error && <Alert variant="danger" className="m-3">{error}</Alert>}
              <Table hover responsive className="m-0 stacked-cards-table" style={{ margin: '0' }}>
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th style={{ borderTop: 'none', padding: '15px', textAlign: 'center' }}>Consumer Name</th>
                    <th style={{ borderTop: 'none', padding: '15px', textAlign: 'center' }}>Original</th>
                    <th style={{ borderTop: 'none', padding: '15px', textAlign: 'center' }}>Negotiated</th>
                    <th style={{ borderTop: 'none', padding: '15px', textAlign: 'center' }}>Items</th>
                    <th style={{ borderTop: 'none', padding: '15px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {negotiations.map(negotiation => (
                    <tr key={negotiation.id}>
                      <td data-label="Consumer Name" style={{ verticalAlign: 'middle', padding: '15px', textAlign: 'center' }}>{negotiation.username}</td>
                      <td data-label="Original" style={{ verticalAlign: 'middle', padding: '15px', fontWeight: 'bold', textAlign: 'center' }}>₹{negotiation.originalAmount}</td>
                      <td data-label="Negotiated" style={{ verticalAlign: 'middle', padding: '15px', color: '#27ae60', fontWeight: '600', textAlign: 'center' }}>₹{negotiation.negotiatedAmount}</td>
                      <td data-label="Items" style={{ verticalAlign: 'middle', padding: '15px', textAlign: 'center' }}>
                        <ul style={{ margin: '0', paddingLeft: '0', fontSize: '13px', listStyleType: 'none', textAlign: 'right' }}>
                          {negotiation.items.map(item => (
                            <li key={item.id}>
                              {item.title} <strong>(Qty: {item.quantity})</strong>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td style={{ verticalAlign: 'middle', padding: '15px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                          <Button
                            variant="success"
                            size="sm"
                            style={{ borderRadius: '6px', padding: '6px 15px', fontWeight: '600' }}
                            onClick={() => handleShowConfirm(negotiation, 'approved')}
                          >
                            <i className="fa fa-check" style={{ marginRight: '5px' }}></i> Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            style={{ borderRadius: '6px', padding: '6px 15px', fontWeight: '600' }}
                            onClick={() => handleShowConfirm(negotiation, 'rejected')}
                          >
                            <i className="fa fa-times" style={{ marginRight: '5px' }}></i> Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {negotiations.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#95a5a6' }}>
                  <i className="fa fa-comments-o" style={{ fontSize: '48px', marginBottom: '15px', display: 'block' }}></i>
                  <p style={{ margin: '0', fontSize: '16px' }}>No pending negotiation requests found.</p>
                </div>
              )}
            </div>
          </div>
        </section>

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

      </div>
      <Footer />
    </div>
  );
}

export default NegotiationApproval;
