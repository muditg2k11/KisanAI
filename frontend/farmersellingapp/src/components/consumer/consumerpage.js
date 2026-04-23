import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../header';
import Footer from '../footer';
import AuthModal from '../AuthModal';

const shopStyles = `
  .shop-empty-state { text-align: center; padding: 80px 40px; border-radius: 20px; max-width: 520px; margin: 40px auto; }
  .shop-empty-state .empty-icon { font-size: 80px; margin-bottom: 20px; display: block; }
  .shop-empty-state h3 { font-size: 1.5rem; font-weight: 700; color: #2d5a27; margin-bottom: 10px; }
  .shop-empty-state p { color: #888; font-size: 0.97rem; line-height: 1.6; margin-bottom: 24px; }
  .shop-empty-state .refresh-btn { background: linear-gradient(135deg, #2d5a27, #4a7c59); color: white; border: none; padding: 12px 32px; border-radius: 50px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: transform 0.2s; }
  .shop-empty-state .refresh-btn:hover { transform: translateY(-2px); }
  
  .product-card-wrap { transition: transform 0.2s, box-shadow 0.2s; border-radius: 10px; border: 1px solid #eef0f2; background: #fff; display: flex; flex-direction: column; height: 100%; overflow: hidden; }
  .product-card-wrap:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); border-color: #d1dfd4; }
  .product-card-wrap .card-img-top { height: 160px; object-fit: cover; border-bottom: 1px solid #f5f5f5; }
  .product-card-wrap .card-body { padding: 14px; display: flex; flex-direction: column; flex-grow: 1; }
  .product-card-wrap .card-title { font-size: 1.05rem; font-weight: 700; color: #2c3e50; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .product-card-wrap .card-text { font-size: 0.85rem; color: #6c757d; margin-bottom: 10px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .product-card-wrap .product-provider { font-size: 0.75rem; color: #2d5a27; font-weight: 700; background: #f0f7f2; padding: 4px 8px; border-radius: 6px; display: inline-block; align-self: flex-start; margin-bottom: auto; }
  .product-card-wrap .price-cart-row { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; padding-top: 14px; border-top: 1px dashed #eee; }
  .product-card-wrap .product-price { font-size: 1.25rem; font-weight: 800; color: #2d5a27; margin: 0; }
  .product-card-wrap .btn-add-cart { background: #2d5a27; color: white; border: none; border-radius: 6px; padding: 8px 14px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; gap: 6px; }
  .product-card-wrap .btn-add-cart:hover { background: #22441d; }
`;

function ConsumerPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = React.useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    axios.get('http://127.0.0.1:5001/get_products')
      .then((response) => {
        setProducts(response.data.products);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // consumerpage.js
  const addToCart = (product) => {
    const rawUser = localStorage.getItem('username');
    const isAuth = !!rawUser && rawUser !== 'undefined' && rawUser !== 'null';
    if (!isAuth) {
      toast.info("Please log in to add items to your cart", { position: "top-right", autoClose: 3000 });
      setIsAuthModalOpen(true);
      return;
    }
    toast.success("Item added on cart successfully", { position: "top-right", autoClose: 3000 });

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }

      // Sync immediately to localStorage and DB
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      axios.post('http://127.0.0.1:5001/api/cart', {
        username: rawUser,
        cartItems: updatedCart
      }).catch(err => console.error('Failed to sync cart to DB', err));

      return updatedCart;
    });
  };

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart && storedCart !== 'undefined' && storedCart !== 'null') {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error("Cart parse error", e);
      }
    }
  }, []);



  return (

    <div>
      <style>{shopStyles}</style>
      <div id="pxl-page" className="pxl-page header-pos-df">
        <Header />

        <div id="pxl-pagetitle" className="pxl-pagetitle layout-df relative has-parallax overflow-hidden pxl-animate">
          <div className="pxl-page-title-bg pxl-absoluted" data-parallax="{&quot;y&quot;:&quot;80&quot;}"></div>
          <div className="pxl-page-title-overlay"></div>
          <div className="container relative">
            <div className="pxl-page-title-inner row align-content-center">
              <div className="pxl-page-title col-12">
                <div className="sub-title">Buy Health Foods At Our Store</div>
                <h1 className="main-title">Shop products</h1>
              </div>
              <div className="pxl-breadcrumb d-flex">
                <div className="breadcrumb-inner">
                  <div className="br-item"><a className="br-link hover-underline" href="/">Home</a><span className="br-divider"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M264.547 70.633L440.547 238.633C445.297 243.164 447.984 249.445 447.984 256.008S445.297 268.852 440.547 273.383L264.547 441.383C254.953 450.508 239.766 450.164 230.609 440.57C221.453 431.07 221.797 415.82 231.422 406.633L364.09 280.008H24C10.75 280.008 0 269.258 0 256.008S10.75 232.008 24 232.008H364.09L231.422 105.383C221.797 96.227 221.453 80.977 230.609 71.445C239.766 61.852 254.953 61.508 264.547 70.633Z"></path></svg></span></div><div className="br-item"><span className="br-text">Products</span><span className="br-divider"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M264.547 70.633L440.547 238.633C445.297 243.164 447.984 249.445 447.984 256.008S445.297 268.852 440.547 273.383L264.547 441.383C254.953 450.508 239.766 450.164 230.609 440.57C221.453 431.07 221.797 415.82 231.422 406.633L364.09 280.008H24C10.75 280.008 0 269.258 0 256.008S10.75 232.008 24 232.008H364.09L231.422 105.383C221.797 96.227 221.453 80.977 230.609 71.445C239.766 61.852 254.953 61.508 264.547 70.633Z"></path></svg></span></div>                                    </div>
              </div>
            </div>
          </div>
        </div>

        <div id="pxl-main" className="pxl-main" style={{ paddingTop: '70px' }}>
          <div className="container">
            <div className="row pxl-shop-loop-content pxl-content-wrap has-sidebar sidebar-left">
              <Container>
                <ToastContainer />
                {products.length === 0 ? (
                  <div className="shop-empty-state">
                    <span className="empty-icon"><i className="fas fa-boxes" style={{ color: '#2d5a27' }}></i></span>
                    <h3>No Products Available</h3>
                    <p>Our farmers are preparing fresh stock. Check back soon or refresh the page to see the latest products.</p>
                    <button className="refresh-btn" onClick={() => window.location.reload()}>Refresh Page</button>
                  </div>
                ) : (
                  <Row className="g-4 mb-5">
                    {products.map((product) => (
                      <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                        <div className="product-card-wrap">
                          <Card.Img variant="top" src={product.image} alt={product.title} className="card-img-top" />
                          <div className="card-body">
                            <h5 className="card-title">{product.title}</h5>
                            <p className="card-text" title={product.description}>{product.description}</p>
                            <span className="product-provider">🌾 By: {product.farmer_name || 'Agrinova'}</span>
                            <div className="price-cart-row">
                              <span className="product-price">₹{product.price}</span>
                              <button onClick={() => addToCart(product)} className="btn-add-cart">
                                <i className="fas fa-shopping-cart"></i> Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}


              </Container>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>

  );
}

export default ConsumerPage;
