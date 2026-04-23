import React, { useState, useEffect, useRef } from 'react';
import { Container, Table, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sidebar from './sidebarmenufarmer';
import Navbar from '../navbar';
import Footer from '../footer';
import apiClient from '../util';

/* ── inline styles ─────────────────────────────────────────── */
const styles = {
    /* ── Modal Overlay & Box ── */
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        backdropFilter: 'blur(3px)',
        padding: '20px',
    },
    modalContent: {
        background: '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 24px 40px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e1 transparent',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 20px',
        borderBottom: '1px solid #e5e7eb',
    },
    modalTitle: {
        margin: 0,
        fontSize: '17px',
        fontWeight: 600,
        color: '#1f2937',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '20px',
        color: '#6b7280',
        cursor: 'pointer',
        lineHeight: 1,
        padding: '2px',
    },
    modalBody: {
        padding: '16px 20px',
    },
    /* ── Form Elements ── */
    formGroup: {
        marginBottom: '12px',
    },
    label: {
        display: 'block',
        marginBottom: '4px',
        fontWeight: 500,
        fontSize: '13px',
        color: '#374151',
    },
    input: {
        width: '100%',
        padding: '8px 12px',
        fontSize: '14px',
        border: '1.5px solid #d1d5db',
        borderRadius: '8px',
        outline: 'none',
        backgroundColor: '#fff',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    },
    inputFocus: {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59,130,246,0.12)',
    },
    uploadArea: {
        border: '2px dashed #cbd5e1',
        borderRadius: '10px',
        padding: '14px 20px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: '#f8fafc',
        transition: 'border-color 0.2s, background-color 0.2s',
    },
    uploadAreaHover: {
        borderColor: '#3b82f6',
        backgroundColor: '#eff6ff',
    },
    uploadIcon: {
        fontSize: '24px',
        color: '#94a3b8',
        marginBottom: '4px',
    },
    uploadText: {
        fontSize: '14px',
        color: '#64748b',
        margin: 0,
    },
    previewContainer: {
        marginTop: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 12px',
        backgroundColor: '#f1f5f9',
        borderRadius: '8px',
    },
    previewImage: {
        width: '48px',
        height: '48px',
        objectFit: 'cover',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
    },
    removeBtn: {
        background: 'none',
        border: 'none',
        color: '#ef4444',
        fontSize: '18px',
        cursor: 'pointer',
        marginLeft: 'auto',
    },
    submitBtn: {
        width: '100%',
        padding: '10px',
        fontSize: '14px',
        fontWeight: 600,
        color: '#fff',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        marginTop: '6px',
        boxShadow: '0 2px 4px rgba(37,99,235,0.2)',
    },
    /* ── Alerts ── */
    alertArea: {
        marginTop: '16px',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
        textAlign: 'center',
    },
    success: { backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' },
    error: { backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' },
};

function FarmerProducts() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formMessage, setFormMessage] = useState('');
    const [formMessageType, setFormMessageType] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [focusedField, setFocusedField] = useState(null);
    const [uploadHover, setUploadHover] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        const farmerUsername = localStorage.getItem('username') || '';
        apiClient.get(`/get_products?farmer=${farmerUsername}`)
            .then(response => {
                if (response.data && response.data.products) {
                    setProducts(response.data.products);
                }
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setError('Failed to load products.');
            });
    };

    // --- Modal Helpers ---
    const handleOpenModal = (product = null) => {
        if (product) {
            // Edit mode
            setIsEditing(true);
            setCurrentProductId(product.id);
            setName(product.title || product.name || '');
            setDescription(product.description || '');
            setPrice(product.price || '');
            setImage(null); // Keep existing image unless changed
            setImagePreview(product.image || null);
        } else {
            // Add mode
            setIsEditing(false);
            setCurrentProductId(null);
            setName('');
            setDescription('');
            setPrice('');
            setImage(null);
            setImagePreview(null);
        }
        setFormMessage('');
        setFormMessageType('');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleDeleteProduct = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            apiClient.delete(`http://localhost:5000/delete_product/${productToDelete.id}`)
                .then(() => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                    fetchProducts();
                })
                .catch(err => {
                    console.error('Delete error:', err);
                    setError('Failed to delete product.');
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const inputStyle = (field) => ({
        ...styles.input,
        ...(focusedField === field ? styles.inputFocus : {}),
    });

    const handleAddProductSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price || 0);
        if (image) {
            formData.append('image', image);
        }
        formData.append('farmer_username', localStorage.getItem('username') || '');

        const url = isEditing
            ? `http://localhost:5000/update_product/${currentProductId}`
            : 'http://localhost:5000/add_product';

        // Using POST for update as well since we use request.form/files in Flask which works best with POST
        apiClient.post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then((response) => {
                console.log(response.data);
                setFormMessage(isEditing ? 'Product updated successfully!' : 'Product added successfully!');
                setFormMessageType('success');

                // Refresh products
                fetchProducts();

                // Auto close after 1.5s
                setTimeout(() => {
                    handleCloseModal();
                }, 1500);
            })
            .catch((error) => {
                console.error(error);
                setFormMessage(isEditing ? 'Error updating product. Please try again.' : 'Error adding product. Please try again.');
                setFormMessageType('error');
                setTimeout(() => setFormMessage(''), 3000);
            });
    };

    return (
        <div className="wrapper">
            <style>{`
                .ap-modal-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .ap-modal-scroll::-webkit-scrollbar-track {
                    background: transparent;
                    border-radius: 99px;
                }
                .ap-modal-scroll::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 99px;
                }
                .ap-modal-scroll::-webkit-scrollbar-thumb:hover {
                    background-color: #94a3b8;
                }
            `}</style>
            <Navbar pageTitle="All Products" />
            <Sidebar />

            <div className="content-wrapper content-wrapper-responsive">
                <section className="content" style={{ paddingTop: '5px' }}>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <div className="row">
                        <div className="col-md-12">
                            {/* ── Header row: title + button ── */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', padding: '0 4px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>Product Catalog</h3>
                                    {products.length > 0 && (
                                        <span style={{
                                            backgroundColor: '#f1f5f9',
                                            color: '#64748b',
                                            padding: '2px 8px',
                                            borderRadius: '6px',
                                            fontSize: '13px',
                                            fontWeight: 600
                                        }}>
                                            {products.length}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleOpenModal()}
                                    className="btn btn-sm btn-success btn-flat"
                                    style={{ borderRadius: '8px', padding: '8px 16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}
                                >
                                    <i className="fa fa-plus"></i>
                                    Add New Product
                                </button>
                            </div>

                            {/* ── Product list ── */}
                            <ul className="products-list product-list-in-box" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {products.length === 0 ? (
                                    <li style={{ listStyle: 'none' }}>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '60px 20px',
                                            textAlign: 'center',
                                        }}>
                                            <div style={{
                                                width: '90px',
                                                height: '90px',
                                                borderRadius: '50%',
                                                backgroundColor: '#f0fdf4',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: '20px',
                                                fontSize: '40px',
                                            }}>🌿</div>
                                            <h4 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
                                                No Products Yet
                                            </h4>
                                            <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6b7280', maxWidth: '280px', lineHeight: '1.6' }}>
                                                Your product catalog is empty. Start adding your fresh farm produce for buyers to discover!
                                            </p>
                                            <button
                                                onClick={() => handleOpenModal()}
                                                style={{
                                                    padding: '10px 24px',
                                                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '10px',
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    boxShadow: '0 2px 6px rgba(22,163,74,0.3)',
                                                }}
                                            >
                                                + Add Your First Product
                                            </button>
                                        </div>
                                    </li>
                                ) : (
                                    products.map((product) => (
                                        <li key={product.id} style={{ display: 'flex', alignItems: 'center', padding: '14px 4px', borderBottom: '1px solid #f1f5f9' }}>
                                            <div style={{ marginRight: '20px', flexShrink: 0 }}>
                                                {product.image ? (
                                                    <img src={product.image} alt={product.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px' }} />
                                                ) : (
                                                    <img src="dist/img/default-50x50.gif" alt="Product" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px' }} />
                                                )}
                                            </div>
                                            <div style={{ flexGrow: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div style={{ flexGrow: 1 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>{product.title}</span>
                                                            <span style={{ fontSize: '15px', fontWeight: 600, color: '#16a34a', backgroundColor: '#f0fdf4', padding: '4px 10px', borderRadius: '8px' }}>₹{product.price}</span>
                                                        </div>
                                                        <span style={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            marginTop: '6px',
                                                            color: '#6b7280',
                                                            fontSize: '14px',
                                                            lineHeight: '1.5'
                                                        }}>
                                                            {product.description}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                                                        <button
                                                            onClick={() => handleOpenModal(product)}
                                                            style={{
                                                                padding: '6px 12px',
                                                                borderRadius: '8px',
                                                                border: '1px solid #e2e8f0',
                                                                backgroundColor: '#fff',
                                                                color: '#475569',
                                                                fontSize: '13px',
                                                                fontWeight: 600,
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s',
                                                            }}
                                                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                                                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                                        >
                                                            <i className="fa fa-edit" style={{ marginRight: '4px' }}></i> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product)}
                                                            style={{
                                                                padding: '6px 12px',
                                                                borderRadius: '8px',
                                                                border: '1px solid #fee2e2',
                                                                backgroundColor: '#fff',
                                                                color: '#ef4444',
                                                                fontSize: '13px',
                                                                fontWeight: 600,
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s',
                                                            }}
                                                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.borderColor = '#fecaca'; }}
                                                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#fee2e2'; }}
                                                        >
                                                            <i className="fa fa-trash" style={{ marginRight: '4px' }}></i> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>

                            {/* Footer content removed, moved to header */}
                        </div>
                    </div>
                </section>
            </div>


            <Footer />

            {/* ── Add Product Modal ── */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={handleCloseModal}>
                    <div style={styles.modalContent} className="ap-modal-scroll" onClick={(e) => e.stopPropagation()}>

                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                            <button style={styles.closeBtn} onClick={handleCloseModal}>✕</button>
                        </div>

                        <div style={styles.modalBody}>
                            <form onSubmit={handleAddProductSubmit}>
                                {/* Name + Price side by side */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                    <div>
                                        <label style={styles.label}>Product Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Organic Tomatoes"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField(null)}
                                            style={inputStyle('name')}
                                        />
                                    </div>
                                    <div>
                                        <label style={styles.label}>Price (₹)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            required
                                            placeholder="0.00"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            onFocus={() => setFocusedField('price')}
                                            onBlur={() => setFocusedField(null)}
                                            style={inputStyle('price')}
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Description</label>
                                    <textarea
                                        placeholder="Describe your product..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        onFocus={() => setFocusedField('desc')}
                                        onBlur={() => setFocusedField(null)}
                                        rows={2}
                                        style={{
                                            ...inputStyle('desc'),
                                            resize: 'none',
                                            minHeight: '52px',
                                        }}
                                    />
                                </div>

                                {/* Image Upload */}
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Product Image</label>
                                    {!image && (
                                        <div
                                            style={{
                                                ...styles.uploadArea,
                                                ...(uploadHover ? styles.uploadAreaHover : {}),
                                            }}
                                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                            onDragOver={(e) => { e.preventDefault(); setUploadHover(true); }}
                                            onDragLeave={() => setUploadHover(false)}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                setUploadHover(false);
                                                const file = e.dataTransfer.files[0];
                                                if (file) {
                                                    setImage(file);
                                                    setImagePreview(URL.createObjectURL(file));
                                                }
                                            }}
                                        >
                                            <div style={styles.uploadIcon}>📷</div>
                                            <p style={styles.uploadText}>
                                                <span style={{ color: '#3b82f6', fontWeight: 500 }}>Click to upload</span> or drag and drop
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />

                                    {/* Preview */}
                                    {image && imagePreview && (
                                        <div style={styles.previewContainer}>
                                            <img src={imagePreview} alt="preview" style={styles.previewImage} />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: '#334155' }}>
                                                    {image.name}
                                                </p>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                                                    {formatFileSize(image.size)}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                style={styles.removeBtn}
                                                onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Submit */}
                                <button type="submit" style={styles.submitBtn}>
                                    {isEditing ? 'Update Product' : 'Add Product'}
                                </button>
                            </form>

                            {/* Message */}
                            {formMessage && (
                                <div style={{ ...styles.alertArea, ...(formMessageType === 'success' ? styles.success : styles.error) }}>
                                    {formMessage}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Confirmation Modal ── */}
            {showDeleteModal && (
                <div style={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
                    <div style={{ ...styles.modalContent, width: '360px', padding: '30px' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                backgroundColor: '#fef2f2',
                                color: '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                margin: '0 auto 20px'
                            }}>
                                <i className="fa fa-trash-o"></i>
                            </div>
                            <h3 style={{ margin: '0 0 10px', fontSize: '20px', fontWeight: 700, color: '#111827' }}>Delete Product?</h3>
                            <p style={{ margin: '0 0 24px', color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                                Are you sure you want to delete <strong style={{ color: '#374151' }}>"{productToDelete?.title}"</strong>? This action cannot be undone.
                            </p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '10px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: '#fff',
                                        color: '#475569',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        backgroundColor: '#ef4444',
                                        color: '#fff',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default FarmerProducts;
