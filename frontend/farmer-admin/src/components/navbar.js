import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ pageTitle }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const username = localStorage.getItem('username') || 'Farmer User';
  const email = localStorage.getItem('email') || 'farmer@agri.com';

  const triggerSignOut = (e) => {
    if (e) e.preventDefault();
    setShowModal(true);
  };

  const confirmSignOut = () => {
    localStorage.clear();
    navigate('/');
  };

  const cancelSignOut = () => {
    setShowModal(false);
  };

  return (
    <>
      <style>{`
        .dropdown-menu {
          transition: all 0.2s ease-in-out;
        }
        .custom-signout-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          backdrop-filter: blur(2px);
        }
        .custom-signout-modal {
          background: #ffffff;
          padding: 24px;
          border-radius: 12px;
          width: 320px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          text-align: center;
        }
        .custom-signout-modal h3 {
          margin-top: 0;
          margin-bottom: 12px;
          font-size: 18px;
          color: #111827;
          font-weight: 700;
        }
        .custom-signout-modal p {
          margin: 0 0 24px 0;
          font-size: 14px;
          color: #4b5563;
        }
        .custom-signout-modal-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        .custom-signout-modal-actions button {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .btn-cancel {
          background-color: #f3f4f6;
          color: #4b5563;
        }
        .btn-cancel:hover { background-color: #e5e7eb; }
        .btn-confirm {
          background-color: #ef4444;
          color: white;
        }
        .btn-confirm:hover { background-color: #dc2626; }
        .main-header .navbar {
          float: none !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
        }
        .main-header .navbar .sidebar-toggle {
          float: none !important;
        }
        .main-header .navbar .navbar-custom-menu {
          float: none !important;
          margin-left: auto;
        }
        /* Sidebar toggle visibility: Always visible now */
        .sidebar-toggle-unified {
          display: flex !important;
        }
        /* Maintain gap between toggle and title in collapsed state */
        .sidebar-collapse .sidebar-toggle-unified {
          margin-right: 20px !important;
        }
      `}</style>

      <header className="main-header">
        {/* Header Navbar */}
        <nav className="navbar navbar-static-top" style={{
          minHeight: '50px',
          height: '50px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 15px',
          float: 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '50px' }}>
            {/* Mobile-only toggle link for sidebar */}
            {/* Unified toggle link for sidebar (Desktop & Mobile) */}
            <a href="#"
              className="sidebar-toggle sidebar-toggle-unified"
              role="button"
              style={{
                color: 'white',
                fontSize: '16px',
                marginRight: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => { e.currentTarget.style.opacity = '0.8'; }}
              onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const isMobile = window.innerWidth <= 767;
                if (isMobile) {
                  document.body.classList.toggle('sidebar-open');
                  document.body.classList.remove('sidebar-collapse');
                } else {
                  document.body.classList.toggle('sidebar-collapse');
                  document.body.classList.remove('sidebar-open');
                }
              }}
            >
              <i className="fa fa-bars" style={{ pointerEvents: 'none' }} />
            </a>
            {/* Dynamic Page Title in Header (Now at the start) */}
            {pageTitle && (
              <span style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                letterSpacing: '0.4px'
              }}>
                {pageTitle}
              </span>
            )}
          </div>
          {/* Navbar Right Menu */}
          <div className="navbar-custom-menu" style={{ height: '50px', display: 'flex', alignItems: 'center' }}>
            <ul className="nav navbar-nav" style={{ height: '50px', margin: 0, display: 'flex', alignItems: 'center' }}>
              {/* User Account: style can be found in dropdown.less */}
              <li className="dropdown user user-menu" style={{ height: '50px', display: 'flex', alignItems: 'center' }}>

                <a href="#" className="dropdown-toggle" data-toggle="dropdown" style={{ height: '50px', display: 'flex', alignItems: 'center', padding: '0 15px' }}>
                  {/* Using ui-avatars as a fallback for the farmer profile icon */}
                  <img src={`https://ui-avatars.com/api/?name=${username}&background=0D401C&color=fff`} className="user-image" alt="User Image" style={{ float: 'none', marginRight: '10px' }} />
                  <span className="hidden-xs" style={{ color: 'white' }}>{username}</span>
                </a>
                <ul className="dropdown-menu" style={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  padding: '8px 0',
                  minWidth: '240px'
                }}>
                  {/* User image */}
                  <li className="user-header" style={{ height: 'auto', backgroundColor: '#ffffff', color: '#333', padding: '20px' }}>
                    <img src={`https://ui-avatars.com/api/?name=${username}&background=0D401C&color=fff`} className="img-circle" alt="User Image" style={{ width: '70px', height: '70px', marginBottom: '10px' }} />
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '16px', color: '#2d333a' }}>
                      {username} - Farmer
                      <small style={{ display: 'block', marginTop: '4px', color: '#6e6e80', fontSize: '13px' }}>{email}</small>
                    </p>
                  </li>
                  {/* Menu Footer*/}
                  <li className="user-footer" style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', padding: '15px 20px', display: 'flex', justifyContent: 'center' }}>
                    <div className="text-center w-100" style={{ width: '100%' }}>
                      <button className="btn btn-default btn-flat" style={{ width: '100%', borderRadius: '6px', fontWeight: '500', color: '#dc2626', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }} onClick={triggerSignOut}>Sign out</button>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {showModal && (
        <div className="custom-signout-modal-overlay">
          <div className="custom-signout-modal">
            <h3>Sign Out</h3>
            <p>Are you sure you want to log out of your session?</p>
            <div className="custom-signout-modal-actions">
              <button className="btn-cancel" onClick={cancelSignOut}>Cancel</button>
              <button className="btn-confirm" onClick={confirmSignOut}>Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
