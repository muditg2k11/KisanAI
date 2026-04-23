import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Sidebarmenufarmer() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

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
    <div>
      <style>{`
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
          font-family: 'Inter', sans-serif;
        }
        .custom-signout-modal h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
          color: #2d333a;
          font-weight: 600;
        }
        .custom-signout-modal p {
          margin: 0 0 24px 0;
          font-size: 14px;
          color: #6e6e80;
        }
        .custom-signout-modal-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        .custom-signout-modal-actions button {
          flex: 1;
          padding: 10px 0;
          border-radius: 6px;
          border: none;
          font-weight: 500;
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

        /* Collapsed Sidebar overrides */
        /* Sidebar Branding */
        .sidebar-mini-text {
          display: none;
        }

        .sidebar-collapse .sidebar-brand-full {
          display: none !important;
        }

        .sidebar-collapse .sidebar-mini-text {
          display: block !important;
          color: white;
          font-weight: bold;
          font-size: 18px;
        }

        /* Steady Sidebar for Desktop */
        @media (min-width: 768px) {
          .main-sidebar-steady {
            position: fixed !important;
            top: 0;
            left: 0;
            bottom: 0;
            width: 230px !important;
            height: 100vh !important;
            overflow-y: auto !important;
            z-index: 1030;
            transition: width 0.3s ease-in-out !important;
          }
          
          /* Collapsed state on desktop */
          .sidebar-collapse .main-sidebar-steady {
            width: 50px !important;
          }

          .content-wrapper-responsive {
            margin-left: 230px !important;
            transition: margin-left 0.3s ease-in-out !important;
          }

          .sidebar-collapse .content-wrapper-responsive {
            margin-left: 50px !important;
          }

          /* Hide text when collapsed */
          .sidebar-collapse .sidebar-menu span {
            display: none !important;
          }
          
          .sidebar-collapse .sidebar-menu li a i {
            margin-right: 0 !important;
            width: 100% !important;
            text-align: center !important;
            font-size: 18px !important;
          }
        }

        /* Mobile specific adjustments for steady sidebar */
        @media (max-width: 767px) {
          .main-sidebar-steady {
            position: fixed !important;
            top: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            width: 230px !important;
            z-index: 1035 !important;
            -webkit-transform: translate(-230px, 0) !important;
            -ms-transform: translate(-230px, 0) !important;
            -o-transform: translate(-230px, 0) !important;
            transform: translate(-230px, 0) !important;
            transition: transform 0.3s ease-in-out !important;
          }
          
          .sidebar-open .main-sidebar-steady {
            -webkit-transform: translate(0, 0) !important;
            -ms-transform: translate(0, 0) !important;
            -o-transform: translate(0, 0) !important;
            transform: translate(0, 0) !important;
          }

          .sidebar-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.4);
            z-index: 1030;
            backdrop-filter: blur(2px);
          }
          
          .sidebar-open .sidebar-overlay {
            display: block;
          }
          
          .content-wrapper-responsive {
            margin-left: 0 !important;
          }
        }
      `}</style>

      {/* Mobile Sidebar Overlay */}
      <div className="sidebar-overlay" onClick={() => {
        document.body.classList.remove('sidebar-open');
      }}></div>

      <aside className="main-sidebar main-sidebar-steady" style={{ paddingTop: 0 }}>
        {/* Sidebar Brand Header */}
        <div className="sidebar-brand-header" style={{
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          backgroundColor: 'transparent',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          transition: 'all 0.3s ease-in-out',
          position: 'relative',
          zIndex: 5000,
          pointerEvents: 'auto'
        }}>
          {/* Full logo for expanded state */}
          <span className="sidebar-brand-full" style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none'
          }}>
            <span style={{ color: '#fff' }}>Agri</span>
            <span style={{ color: '#fff' }}>nova</span>
          </span>
          {/* Mini logo for collapsed state */}
          <span className="sidebar-mini-text">AN</span>
        </div>

        {/* sidebar: style can be found in sidebar.less */}
        <section className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
          {/* Sidebar user panel */}

          {/* sidebar menu: : style can be found in sidebar.less */}
          <ul className="sidebar-menu" data-widget="tree">

            <li><a href="/farmer/dashboard"><i className="fa fa-dashboard" /> <span>Dashboard</span></a></li>
            <li><a href="/farmer/orders"><i className="fa fa-shopping-bag" /> <span>Orders</span></a></li>
            <li><a href="/farmer/negotiations"><i className="fa fa-comments" /> <span>Negotiation Requests</span></a></li>
            <li><a href="/farmer/products"><i className="fa fa-cubes text-red" /> <span>Products</span></a></li>
            <li><a href="/farmer/cropdisease"><i className="fa fa-circle-o text-yellow" /> <span>Crop Disease Prediction</span></a></li>
            <li><a href="/farmer/croprecommend"><i className="fa fa-circle-o text-aqua" /> <span>Crop Recommendation</span></a></li>
          </ul>

          <ul className="sidebar-menu" data-widget="tree" style={{ marginTop: 'auto' }}>
            <li>
              <a href="#" onClick={triggerSignOut} style={{ color: '#ff6c6c' }}>
                <i className="fa fa-sign-out" /> <span>Sign Out</span>
              </a>
            </li>
          </ul>
        </section>
        {/* /.sidebar */}
      </aside>

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


    </div>
  );
}

export default Sidebarmenufarmer;
