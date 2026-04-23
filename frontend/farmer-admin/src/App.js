import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/login';
import Register from './components/register';
import FarmerDashboard from './components/farmer/farmerdashboard';
import FarmerOrders from './components/farmer/farmerorders';
import FarmerProducts from './components/farmer/farmerproducts';
import AddProducts from './components/farmer/addproduct';
import CropDisease from './components/farmer/cropdiseasepredictionpage';
import CropRecommend from './components/farmer/croprecommendation';
import NegotiationApproval from './components/farmer/negotiationapproval';


function App() {
    const [role, setRole] = useState(null);

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        setRole(storedRole);
    }, []);

    return (
        <Router>
            <Routes>
                {/* Common Routes */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/farmer/addproducts" element={<AddProducts />} />
                <Route path="/farmer/products" element={<FarmerProducts />} />
                <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
                <Route path="/farmer/orders" element={<FarmerOrders />} />
                <Route path="/farmer/cropdisease" element={<CropDisease />} />
                <Route path="/farmer/croprecommend" element={<CropRecommend />} />
                <Route path="/farmer/negotiations" element={<NegotiationApproval />} />



                {/* Farmer Routes */}
                {role === 'farmer' && (
                    <>

                    </>
                )}

            </Routes>
        </Router>
    );
}

export default App;
