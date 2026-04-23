import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthModal from './AuthModal';

function MobileMenu() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        const rawUser = localStorage.getItem('username');
        setIsAuthenticated(!!rawUser && rawUser !== 'undefined' && rawUser !== 'null');
    }, []);

    const handleBack = () => {
        navigate(-1);
    };

    const handleProtectedAction = (e, path) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
        } else {
            navigate(path);
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        localStorage.removeItem('cart');
        window.location.href = '/';
    };

    const menuItems = [
        { label: 'Home', path: '/' },
        { label: 'About Us', path: '/aboutus' },
        { label: 'Shop', path: '/consumer/products' },
        { label: 'Cart', path: '/consumer/cart', protected: true },
        { label: 'Orders', path: '/consumer/orders', protected: true },
        { label: 'Services', path: '/services' },
        { label: 'Contact', path: '/contact' },
    ];

    const styles = {
        container: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
        },
        header: {
            padding: '20px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        closeBtn: {
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '5px'
        },
        list: {
            listStyle: 'none',
            padding: '20px',
            margin: 0
        },
        item: {
            marginBottom: '15px',
            borderBottom: '1px solid #f9f9f9',
            paddingBottom: '15px'
        },
        link: {
            textDecoration: 'none',
            color: '#333',
            fontSize: '18px',
            fontWeight: '600',
            display: 'block'
        },
        authBtn: {
            marginTop: '20px',
            width: '100%',
            padding: '12px',
            backgroundColor: isAuthenticated ? '#dc3545' : '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={{ margin: 0, color: '#2d5a27' }}>Menu</h2>
                <button onClick={handleBack} style={styles.closeBtn}>&times;</button>
            </div>
            <ul style={styles.list}>
                {menuItems.map((item, index) => (
                    <li key={index} style={styles.item}>
                        <Link 
                            to={item.path} 
                            style={styles.link}
                            onClick={(e) => {
                                if (item.protected) {
                                    handleProtectedAction(e, item.path);
                                }
                            }}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
                <li>
                    {isAuthenticated ? (
                        <button onClick={handleLogout} style={styles.authBtn}>Logout</button>
                    ) : (
                        <button onClick={() => setIsAuthModalOpen(true)} style={styles.authBtn}>Login / Signup</button>
                    )}
                </li>
            </ul>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
}

export default MobileMenu;