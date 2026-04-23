import Sidebar from './sidebarmenufarmer';
import Navbar from '../navbar';
import Footer from '../footer';
import React, { useState, useRef } from 'react';
import apiClient from '../util';

/* ── inline styles ─────────────────────────────────────────── */
const styles = {
  contentSection: {
    padding: '30px 24px',
    minHeight: 'calc(100vh - 160px)',
  },
  formWrapper: {
    maxWidth: '900px',
    width: '100%',
    margin: '0 auto',
  },
  formGroup: {
    marginBottom: '22px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 600,
    fontSize: '14px',
    color: '#374151',
    letterSpacing: '0.01em',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: '1.5px solid #d1d5db',
    borderRadius: '12px',
    outline: 'none',
    backgroundColor: '#fff',
    color: '#1f2937',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box',
  },
  inputFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59,130,246,0.15)',
  },
  /* ── image upload area ── */
  uploadArea: {
    border: '2px dashed #cbd5e1',
    borderRadius: '14px',
    padding: '36px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease, background-color 0.2s ease',
    backgroundColor: '#f8fafc',
  },
  uploadAreaHover: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  uploadIcon: {
    fontSize: '40px',
    color: '#94a3b8',
    marginBottom: '10px',
  },
  uploadText: {
    fontSize: '15px',
    color: '#64748b',
    margin: 0,
  },
  uploadTextBold: {
    color: '#3b82f6',
    fontWeight: 600,
    cursor: 'pointer',
  },
  uploadHint: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '6px',
  },
  previewContainer: {
    marginTop: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    backgroundColor: '#f1f5f9',
    borderRadius: '10px',
  },
  previewImage: {
    width: '56px',
    height: '56px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  previewInfo: {
    flex: 1,
    minWidth: 0,
  },
  previewName: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#334155',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    margin: 0,
  },
  previewSize: {
    fontSize: '12px',
    color: '#94a3b8',
    margin: 0,
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '4px',
    lineHeight: 1,
    flexShrink: 0,
  },
  /* ── submit button ── */
  submitBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 36px',
    fontSize: '15px',
    fontWeight: 600,
    color: '#fff',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
    float: 'right',
  },
  submitBtnHover: {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
  },
  /* ── message alert ── */
  alertSuccess: {
    backgroundColor: '#ecfdf5',
    color: '#065f46',
    border: '1px solid #a7f3d0',
    padding: '12px 16px',
    borderRadius: '10px',
    marginTop: '18px',
    fontSize: '14px',
    fontWeight: 500,
  },
  alertError: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    border: '1px solid #fecaca',
    padding: '12px 16px',
    borderRadius: '10px',
    marginTop: '18px',
    fontSize: '14px',
    fontWeight: 500,
  },
};

/* ── responsive CSS injected once ──────────────────────────── */
const responsiveCSS = `
  @media (max-width: 768px) {
    .add-product-section {
      padding: 18px 12px !important;
    }
    .add-product-form-wrapper {
      max-width: 100% !important;
    }
    .add-product-submit-btn {
      width: 100% !important;
      float: none !important;
    }
    .add-product-upload-area {
      padding: 24px 14px !important;
    }
  }
`;

function AddProducts() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [uploadHover, setUploadHover] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image);
    formData.append('farmer_username', localStorage.getItem('username') || '');

    apiClient.post('http://localhost:5000/add_product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((response) => {
        console.log(response.data);
        setMessage('Product added successfully!');
        setMessageType('success');
        setName('');
        setDescription('');
        setPrice(0);
        removeImage();
        setTimeout(() => setMessage(''), 3000);
      })
      .catch((error) => {
        console.error(error);
        setMessage('Error adding product. Please try again.');
        setMessageType('error');
        setTimeout(() => setMessage(''), 3000);
      });
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

  return (
    <div className="wrapper">
      {/* inject responsive styles */}
      <style>{responsiveCSS}</style>

      <Navbar pageTitle="Add Products" />
      <Sidebar />

      <div className="content-wrapper content-wrapper-responsive">
        <section
          className="content add-product-section"
          style={styles.contentSection}
        >
          <div
            className="add-product-form-wrapper"
            style={styles.formWrapper}
          >
            <form onSubmit={handleSubmit}>

              {/* ── Name ── */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Organic Tomatoes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle('name')}
                />
              </div>

              {/* ── Description ── */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  placeholder="Describe your product..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onFocus={() => setFocusedField('desc')}
                  onBlur={() => setFocusedField(null)}
                  rows={3}
                  style={{
                    ...inputStyle('desc'),
                    resize: 'vertical',
                    minHeight: '80px',
                  }}
                />
              </div>

              {/* ── Price ── */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  onFocus={() => setFocusedField('price')}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle('price')}
                />
              </div>

              {/* ── Image Upload ── */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Product Image</label>

                <div
                  className="add-product-upload-area"
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
                    Drag & drop an image here, or{' '}
                    <span style={styles.uploadTextBold}>browse</span>
                  </p>
                  <p style={styles.uploadHint}>PNG, JPG or WEBP (max 5 MB)</p>
                </div>

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
                    <div style={styles.previewInfo}>
                      <p style={styles.previewName}>{image.name}</p>
                      <p style={styles.previewSize}>{formatFileSize(image.size)}</p>
                    </div>
                    <button
                      type="button"
                      style={styles.removeBtn}
                      onClick={removeImage}
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* ── Submit ── */}
              <div style={{ overflow: 'hidden', marginTop: '8px' }}>
                <button
                  type="submit"
                  className="add-product-submit-btn"
                  style={{
                    ...styles.submitBtn,
                    ...(btnHover ? styles.submitBtnHover : {}),
                  }}
                  onMouseEnter={() => setBtnHover(true)}
                  onMouseLeave={() => setBtnHover(false)}
                >
                  Add Product
                </button>
              </div>
            </form>

            {/* ── Message ── */}
            {message && (
              <div style={messageType === 'success' ? styles.alertSuccess : styles.alertError}>
                {message}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default AddProducts;
