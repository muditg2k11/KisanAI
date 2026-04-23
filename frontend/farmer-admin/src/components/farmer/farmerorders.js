import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sidebar from './sidebarmenufarmer';
import Navbar from '../navbar';
import Footer from '../footer';
import apiClient from '../util';

function FarmerOrders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrders = orders.filter(order => {
        if (!searchTerm) return true;
        const lower = searchTerm.toLowerCase();

        if (order.id.toString().includes(lower)) return true;
        if (order.user?.toLowerCase().includes(lower)) return true;
        if (order.email?.toLowerCase().includes(lower)) return true;
        if (order.status?.toLowerCase().includes(lower)) return true;
        if (order.payment_method?.toLowerCase().includes(lower)) return true;

        if (order.items && order.items.length > 0) {
            return order.items.some(item => {
                const itemName = item.title || item.name || '';
                return itemName.toLowerCase().includes(lower);
            });
        }
        return false;
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        const farmerUsername = localStorage.getItem('username') || '';
        apiClient.get(`/api/all-orders?farmer=${farmerUsername}`)
            .then(response => {
                if (response.data && response.data.allOrders) {
                    setOrders(response.data.allOrders);
                }
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
                setError('Failed to load orders.');
            });
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await apiClient.put(`/api/orders/${orderId}/status`, { status: newStatus });
            if (response.status === 200) {
                setSuccessMsg(response.data.message);
                // Update local state to reflect the change immediately
                setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
                setTimeout(() => setSuccessMsg(''), 3000);
            }
        } catch (err) {
            console.error('Error updating status:', err);
            setError(err.response?.data?.error || 'Failed to update status');
            setTimeout(() => setError(null), 3000);
        }
    };

    const getStatusLabelClass = (status) => {
        switch (status) {
            case 'delivered': return 'label-success';
            case 'processing': return 'label-info';
            case 'shipped': return 'label-warning';
            case 'cancelled': return 'label-danger';
            case 'pending':
            default: return 'label-primary';
        }
    };

    return (
        <div className="wrapper">
            <Navbar pageTitle="All Orders" />
            <Sidebar />

            <div className="content-wrapper content-wrapper-responsive">

                <section className="content" style={{ position: 'relative', minHeight: 'calc(100vh - 160px)' }}>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {successMsg && <Alert variant="success">{successMsg}</Alert>}

                    <div className="row">
                        <div className="col-xs-12">
                            <div className="bg-transparent border-0">


                                <div className="box-body" style={{ padding: 0 }}>
                                    <div className="table-responsive" style={{ backgroundColor: '#fff', borderRadius: '15px', padding: '15px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                                        <table className="table table-hover" style={{ backgroundColor: 'transparent', marginBottom: 0 }}>
                                            <thead style={{ backgroundColor: '#f8fafc' }}>
                                                <tr>
                                                    <th style={{ padding: '12px 15px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Order ID</th>
                                                    <th style={{ padding: '12px 15px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.025em' }}>User</th>
                                                    <th style={{ padding: '12px 15px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Email</th>
                                                    <th style={{ padding: '12px 15px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Items</th>
                                                    <th style={{ padding: '12px 15px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Payment</th>
                                                    <th style={{ padding: '12px 15px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Total Amount</th>
                                                    <th style={{ padding: '12px 15px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Status</th>
                                                    <th style={{ padding: '12px 15px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredOrders.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="8" style={{ padding: 0, border: 'none' }}>
                                                            <div style={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                minHeight: 'calc(100vh - 260px)',
                                                                textAlign: 'center',
                                                                padding: '20px',
                                                            }}>
                                                                <div style={{
                                                                    width: '90px',
                                                                    height: '90px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: searchTerm ? '#fef3c7' : '#eff6ff',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    marginBottom: '20px',
                                                                    fontSize: '40px',
                                                                }}>
                                                                    {searchTerm ? '🔍' : '🧺'}
                                                                </div>
                                                                <h4 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
                                                                    {searchTerm ? 'No results found' : 'No Orders Yet'}
                                                                </h4>
                                                                <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#6b7280', maxWidth: '300px', lineHeight: '1.6' }}>
                                                                    {searchTerm
                                                                        ? `We couldn't find any orders matching "${searchTerm}". Try a different search term.`
                                                                        : "You haven't received any orders yet. Your incoming orders will appear here once customers place them."}
                                                                </p>
                                                                {searchTerm && (
                                                                    <button
                                                                        onClick={() => setSearchTerm('')}
                                                                        style={{
                                                                            padding: '9px 22px',
                                                                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                                                            color: '#fff',
                                                                            border: 'none',
                                                                            borderRadius: '8px',
                                                                            fontSize: '14px',
                                                                            fontWeight: 600,
                                                                            cursor: 'pointer',
                                                                            boxShadow: '0 2px 6px rgba(217,119,6,0.3)',
                                                                        }}
                                                                    >
                                                                        Clear Search
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredOrders.map((order) => (
                                                        <tr key={order.id}>
                                                            <td><a href={`/farmer/orders/${order.id}`}>OB{order.id}</a></td>
                                                            <td>{order.user}</td>
                                                            <td>{order.email}</td>
                                                            <td>
                                                                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                                                    {(order.items || []).map((item, i) => (
                                                                        <li key={i} style={{ fontSize: '0.9em', color: '#555', marginBottom: '2px' }}>
                                                                            🌿 {item.title || item.name || 'Product'} <span style={{ color: '#888' }}>× {item.quantity || 1}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </td>
                                                            <td>
                                                                {order.payment_method === 'online' ? (
                                                                    <span className="label label-success">Online</span>
                                                                ) : (
                                                                    <span className="label label-default">COD</span>
                                                                )}
                                                            </td>
                                                            <td>₹{order.total.toFixed(2)}</td>
                                                            <td>
                                                                <span className={`label ${getStatusLabelClass(order.status)}`}>
                                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <select
                                                                    className="form-control input-sm"
                                                                    value={order.status}
                                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                                    style={{ width: '130px', display: 'inline-block' }}
                                                                >
                                                                    <option value="pending">Pending</option>
                                                                    <option value="processing">Processing</option>
                                                                    <option value="shipped">Shipped</option>
                                                                    <option value="delivered">Delivered</option>
                                                                    <option value="cancelled">Cancelled</option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div style={{ position: 'fixed', bottom: '40px', right: '24px' }}>
                                    <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>
                                        Total Orders: <strong style={{ color: '#111827' }}>{orders.length}</strong>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
}

export default FarmerOrders;
