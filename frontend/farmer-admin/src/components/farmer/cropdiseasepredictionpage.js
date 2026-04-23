import Sidebar from './sidebarmenufarmer';
import Navbar from '../navbar';
import Footer from '../footer';
import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function CropDiseasePrediction() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' or 'environment'

  // Reference for auto-scrolling
  const resultsRef = useRef(null);
  const reportRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Robust cleanup effect for camera
  React.useEffect(() => {
    if (!showCamera) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log(`Track ${track.kind} stopped`);
        });
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      // Final cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [showCamera]);

  const isMobile = () => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints > 0 && !window.matchMedia('(pointer: fine)').matches);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setPrediction(null);
      setConfidence(null);
      setAdvice(null);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async (mode = facingMode) => {
    setShowCamera(true);
    setCameraError(null);

    // If there's an existing stream, stop it first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      // Fallback for some browsers/devices
      if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
          streamRef.current = fallbackStream;
          if (videoRef.current) videoRef.current.srcObject = fallbackStream;
          return;
        } catch (e) {
          console.error("Fallback camera failed:", e);
        }
      }
      setCameraError("Could not access camera. Please ensure permissions are granted and you are using HTTPS.");
    }
  };

  const toggleFacingMode = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    startCamera(newMode);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const file = new File([blob], "captured_crop.jpg", { type: "image/jpeg" });
        processFile(file);
        stopCamera();
      }, 'image/jpeg', 0.95);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please select an image.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);

    fetch('http://localhost:5000/predict_disease', {
      method: 'POST',
      body: formData,
    })
      .then(async (response) => {
        if (!response.ok) {
          let errorMessage = 'Prediction failed';
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            errorMessage = `Server Error (${response.status}): Could not analyze the image. The backend might need a restart.`;
          }
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then((data) => {
        setPrediction(data.prediction);
        setConfidence(data.confidence ? `${(data.confidence * 100).toFixed(1)}%` : 'N/A');

        // If confidence is already a formatted string like '85%', keep it
        if (typeof data.confidence === 'string' && data.confidence.includes('%')) {
          setConfidence(data.confidence);
        } else if (typeof data.confidence === 'number') {
          setConfidence((data.confidence * 100).toFixed(1) + '%');
        } else if (data.confidence && !isNaN(data.confidence)) {
          // Wait, backend sends confidence as a float e.g. 0.85
          setConfidence((parseFloat(data.confidence) * 100).toFixed(1) + '%');
        } else {
          setConfidence(data.confidence + '%');
        }

        setAdvice(data.advice);
        setLoading(false);

        // Auto-scroll to results after a short delay to allow render
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      })
      .catch((error) => {
        console.error('Prediction Error:', error);
        alert(error.message);
        setLoading(false);
      });
  };
  const handleNewPrediction = () => {
    setImage(null);
    setPreview(null);
    setPrediction(null);
    setConfidence(null);
    setAdvice(null);
    setLoading(false);
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    setGeneratingPDF(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 3, // Very high scale for crisp text
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          // Additional safety to hide any nested buttons or shadows that might cause issues
          const buttons = clonedDoc.querySelectorAll('button');
          buttons.forEach(btn => btn.style.display = 'none');
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0); // High quality JPEG
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.min(pdfHeight, 290));
      pdf.save(`Crop_Analysis_Report_${new Date().toLocaleDateString()}.pdf`);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <div className="wrapper">
      <Navbar pageTitle="Crop Disease Prediction" />
      <Sidebar />
      <div className="content-wrapper content-wrapper-responsive" style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        paddingBottom: '60px'
      }}>
        <section className="content" style={{
          padding: '10px 20px',
          minHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: (prediction || loading) ? 'flex-start' : 'center'
        }}>

          {/* Hide Upload Section when Prediction or Loading is Active */}
          {!prediction && !loading && (
            <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
              {/* Centered Upload Section */}
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <div style={{
                  borderRadius: '12px',
                  padding: preview ? '10px' : '30px 20px',
                  backgroundColor: 'transparent',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  marginBottom: '5px',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '180px'
                }}>
                  {preview ? (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <img
                        src={preview}
                        alt="Selected Crop"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '400px',
                          borderRadius: '8px',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', width: '100%' }}>
                      <div
                        style={{ cursor: 'pointer', marginBottom: '20px' }}
                        onClick={() => document.getElementById('crop-image-input').click()}
                      >
                        <i className="fa fa-cloud-upload" style={{ fontSize: '54px', color: '#a0aec0', marginBottom: '10px' }}></i>
                        <h4 style={{ color: '#4a5568', fontWeight: '600', margin: '0 0 5px 0' }}>Upload Crop Image</h4>
                        <p style={{ color: '#a0aec0', fontSize: '13px', margin: 0 }}>JPG, PNG, JPEG supported</p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
                        <div style={{ height: '1px', background: '#e2e8f0', flex: 1, maxWidth: '60px' }}></div>
                        <span style={{ color: '#cbd5e0', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>OR</span>
                        <div style={{ height: '1px', background: '#e2e8f0', flex: 1, maxWidth: '60px' }}></div>
                      </div>

                      <button
                        type="button"
                        onClick={() => startCamera()}
                        style={{
                          marginTop: '20px',
                          padding: '12px 24px',
                          borderRadius: '12px',
                          border: '2px solid #3b82f6',
                          backgroundColor: 'white',
                          color: '#3b82f6',
                          fontSize: '15px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'all 0.2s ease',
                          margin: '0 auto'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#eff6ff';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <i className="fa fa-camera"></i>
                        Take Photo
                      </button>

                      <input
                        id="crop-image-input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </div>
                  )}
                </div>


                <button
                  type="submit"
                  disabled={loading || !image}
                  data-html2canvas-ignore="true"
                  style={{
                    width: 'auto',
                    minWidth: '240px',
                    margin: '0 auto',
                    padding: '14px 40px',
                    borderRadius: '50px',
                    border: 'none',
                    backgroundColor: loading || !image ? '#cbd5e0' : '#48bb78',
                    color: 'white',
                    fontSize: '17px',
                    fontWeight: '600',
                    cursor: loading || !image ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: loading || !image ? 'none' : '0 10px 15px -3px rgba(72, 187, 120, 0.3)',
                    transform: 'translateY(0)',
                    marginBottom: preview ? '12px' : '0'
                  }}
                  onMouseOver={(e) => !loading && image && (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  Start Prediction
                </button>

                {preview && !loading && (
                  <button
                    type="button"
                    onClick={() => { setImage(null); setPreview(null); }}
                    data-html2canvas-ignore="true"
                    style={{
                      width: 'auto',
                      margin: '0 auto',
                      background: 'none',
                      border: 'none',
                      color: '#718096',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 16px',
                      transition: 'color 0.2s',
                      marginTop: '10px'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#e53e3e'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#718096'}
                  >
                    <i className="fa fa-times" style={{ marginRight: '6px' }}></i>
                    Remove Image
                  </button>
                )}
              </form>
            </div>
          )}

          {/* Auto-scroll anchor point */}
          <div ref={resultsRef} style={{ width: '100%', scrollMarginTop: '80px', paddingTop: '0' }}></div>

          {/* Results Section directly below */}
          {(prediction || loading) && (
            <div style={{ width: '100%', marginTop: '5px' }}>
              <div
                ref={reportRef}
                style={{
                  padding: '20px',
                  borderRadius: '0',
                  border: 'none',
                  backgroundColor: 'white', // White bg for the export capture
                  boxShadow: 'none'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '2px solid #e2e8f0',
                  paddingBottom: '15px',
                  marginBottom: '20px'
                }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#2d3748',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    <i className="fa fa-file-text-o" style={{ marginRight: '12px', color: '#3182ce' }}></i>
                    Report
                  </h3>

                  {!loading && prediction && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={handleNewPrediction}
                        className="btn-responsive-new"
                        data-html2canvas-ignore="true"
                        style={{
                          backgroundColor: 'white',
                          color: '#4a5568',
                          border: '1px solid #cbd5e0',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'all 0.2s',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f7fafc'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        <i className="fa fa-plus" style={{ marginRight: '4px' }}></i>
                        <span className="btn-text-full">New Prediction</span>
                        <span className="btn-text-mobile">New</span>
                      </button>

                      <button
                        onClick={handleDownloadPDF}
                        disabled={generatingPDF}
                        className="btn-responsive-download"
                        data-html2canvas-ignore="true"
                        style={{
                          backgroundColor: generatingPDF ? '#cbd5e0' : '#3182ce',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: generatingPDF ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'all 0.2s',
                          boxShadow: generatingPDF ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseOver={(e) => !generatingPDF && (e.currentTarget.style.backgroundColor = '#2b6cb0')}
                        onMouseOut={(e) => !generatingPDF && (e.currentTarget.style.backgroundColor = '#3182ce')}
                      >
                        <i className={`fa ${generatingPDF ? 'fa-spinner fa-spin' : 'fa-download'}`}></i>
                        <span className="btn-text-full" style={{ marginLeft: '8px' }}>
                          {generatingPDF ? 'Generating...' : 'Download PDF'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>


                {loading ? (
                  <div style={{ padding: '60px 0', textAlign: 'center' }}>
                    <div className="analysis-loader" style={{ margin: '0 auto' }}></div>
                    <h4 style={{ color: '#2d3748', marginTop: '25px', fontWeight: '600' }}>Processing Image Data</h4>
                    <p style={{ color: '#718096' }}>Scanning for disease patterns and identifying severity...</p>
                  </div>
                ) : (
                  <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
                    {/* Side-by-Side Layout: Image on Left, Stats on Right */}
                    <div style={{ display: 'flex', gap: '25px', marginBottom: '25px', flexWrap: 'wrap' }}>
                      {/* Left Side: Analyzed Image */}
                      {!loading && preview && prediction && (
                        <div style={{
                          flex: '1',
                          minWidth: '300px',
                          backgroundColor: '#f8fafc',
                          padding: '20px',
                          borderRadius: '12px',
                          border: '1px solid #edf2f7'
                        }}>
                          <p style={{ fontSize: '11px', color: '#718096', textAlign: 'left', fontWeight: '700', textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '0.5px' }}>Analyzed Sample</p>
                          <img
                            src={preview}
                            alt="Analyzed Crop"
                            style={{
                              width: '100%',
                              maxHeight: '300px',
                              borderRadius: '8px',
                              display: 'block',
                              objectFit: 'contain'
                            }}
                          />
                        </div>
                      )}

                      {/* Right Side: Diagnostic Metrics */}
                      <div style={{ flex: '1.2', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Disease Name Box */}
                        <div style={{
                          padding: '20px',
                          backgroundColor: '#ebf8ff',
                          borderRadius: '12px',
                          borderLeft: '5px solid #3182ce',
                          flex: '1'
                        }}>
                          <p style={{ fontSize: '12px', color: '#4a5568', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Detected Disease</p>
                          <h4 style={{ color: '#2b6cb0', margin: 0, fontWeight: '800', fontSize: '24px', lineHeight: '1.3' }}>{prediction}</h4>
                        </div>

                        {/* Confidence Score Box */}
                        <div style={{
                          padding: '20px',
                          backgroundColor: '#f0fff4',
                          borderRadius: '12px',
                          borderLeft: '5px solid #48bb78',
                          flex: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontSize: '12px', color: '#4a5568', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confidence Level</span>
                            <span style={{ fontWeight: '800', color: '#2f855a', fontSize: '20px' }}>{confidence}</span>
                          </div>
                          <div style={{ height: '10px', backgroundColor: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%',
                              width: `${confidence}`,
                              backgroundColor: parseFloat(confidence) > 85 ? '#48bb78' : '#ecc94b',
                              borderRadius: '10px',
                              transition: 'width 1.5s cubic-bezier(0.17, 0.67, 0.83, 0.67)'
                            }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {advice && (
                      <div className="advice-container" style={{
                        backgroundColor: '#fffaf0',
                        border: '1px solid #feebc8',
                        borderRadius: '12px',
                        padding: '25px',
                        marginTop: '10px'
                      }}>
                        <h5 style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '16px',
                          color: '#c05621',
                          fontWeight: '700',
                          marginBottom: '20px',
                          borderBottom: '1px solid #feebc8',
                          paddingBottom: '12px'
                        }}>
                          <i className="fa fa-info-circle" style={{ marginRight: '10px' }}></i>
                          Treatment & Recommendations
                        </h5>

                        <div className="markdown-body" style={{ color: '#2d3748', lineHeight: '1.7', fontSize: '15px' }}>
                          <ReactMarkdown>{advice}</ReactMarkdown>
                        </div>
                      </div>
                    )}

                    <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                      <button
                        onClick={() => window.print()}
                        data-html2canvas-ignore="true"
                        style={{
                          backgroundColor: 'white',
                          color: '#4a5568',
                          border: '1px solid #cbd5e0',
                          padding: '10px 24px',
                          borderRadius: '8px',
                          fontSize: '15px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          transition: 'all 0.2s',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f7fafc'; e.currentTarget.style.borderColor = '#a0aec0'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#cbd5e0'; }}
                      >
                        <i className="fa fa-print" style={{ marginRight: '8px' }}></i>
                        Print Report
                      </button>

                      <button
                        onClick={handleNewPrediction}
                        data-html2canvas-ignore="true"
                        style={{
                          backgroundColor: '#48bb78',
                          color: 'white',
                          border: 'none',
                          padding: '10px 24px',
                          borderRadius: '8px',
                          fontSize: '15px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          transition: 'all 0.2s',
                          boxShadow: '0 4px 6px -1px rgba(72, 187, 120, 0.2)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#38a169'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#48bb78'}
                      >
                        <i className="fa fa-plus" style={{ marginRight: '8px' }}></i>
                        New Prediction
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </section>
      </div >

      {/* Camera Modal - Redesigned for Premium Experience */}
      {showCamera && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) stopCamera();
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.92)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '15px'
          }}
        >
          <div style={{
            width: '100%',
            maxWidth: '640px',
            backgroundColor: '#121212',
            borderRadius: '24px',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.7)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {/* Minimal Header */}
            <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f56565', boxShadow: '0 0 8px #f56565' }}></div>
                <h3 style={{ margin: 0, color: 'white', fontSize: '15px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Live Preview</h3>
              </div>
              <button
                onClick={stopCamera}
                className="camera-close-btn"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  transition: 'background 0.2s'
                }}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            {/* Camera Viewport */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {cameraError ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <i className="fa fa-video-camera-slash" style={{ fontSize: '40px', color: '#f56565', marginBottom: '15px' }}></i>
                  <p style={{ color: '#cbd5e0', fontSize: '14px', lineHeight: '1.5' }}>{cameraError}</p>
                  <button onClick={() => startCamera()} style={{ marginTop: '20px', padding: '10px 24px', borderRadius: '50px', border: 'none', backgroundColor: '#3b82f6', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Try Again</button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
                    }}
                  />
                  {/* Floating Flip Button - Mobile Only */}
                  {isMobile() && (
                    <button
                      type="button"
                      onClick={toggleFacingMode}
                      style={{
                        position: 'absolute',
                        top: '20px',
                        right: '76px',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        cursor: 'pointer',
                        zIndex: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <i className="fa fa-refresh"></i>
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Bottom Controls */}
            <div style={{ padding: '25px 30px 40px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#121212' }}>
              {!cameraError && (
                <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={capturePhoto}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: '50%',
                      padding: '4px',
                      border: '4px solid white',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      transition: 'transform 0.1s active',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{
                      width: '58px',
                      height: '58px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      boxShadow: '0 0 15px rgba(255,255,255,0.3)'
                    }}></div>
                  </button>
                </div>
              )}
              <p style={{ margin: '15px 0 0 0', color: '#718096', fontSize: '13px', fontWeight: '500' }}>
                Center the leaf in the frame for best results
              </p>
            </div>
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}

      <Footer />
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .analysis-loader {
          width: 70px;
          height: 70px;
          border: 6px solid #edf2f7;
          border-radius: 50%;
          border-top-color: #48bb78;
          animation: spin 1s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Markdown Styling for ReactMarkdown output */
        .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4 {
          color: #2d3748;
          font-weight: 700;
          margin-top: 1.2em;
          margin-bottom: 0.6em;
        }
        .markdown-body h1 { fontSize: 1.5rem; }
        .markdown-body h2 { fontSize: 1.25rem; }
        .markdown-body h3 { fontSize: 1.1rem; }
        
        .markdown-body p { 
          margin-bottom: 1em; 
        }
        
        .markdown-body ul, .markdown-body ol {
          margin-bottom: 1.2em;
          padding-left: 1.5em;
        }
        
        .markdown-body li { 
          margin-bottom: 0.5em; 
        }
        
        .markdown-body strong { 
          font-weight: 700; 
          color: #1a202c; 
        }
        
        .markdown-body em { 
          font-style: italic; 
        }

        .markdown-body blockquote {
          border-left: 4px solid #cbd5e0;
          padding-left: 15px;
          color: #4a5568;
          margin: 1.5em 0;
          background: #f8fafc;
          padding: 10px 15px;
          border-radius: 4px;
        }

        /* Mobile specific adjustments for report buttons */
        @media (max-width: 576px) {
          .btn-responsive-new .btn-text-full { display: none !important; }
          .btn-responsive-new .btn-text-mobile { display: inline !important; }
          .btn-responsive-download .btn-text-full { display: none !important; }
          .hide-on-mobile { display: none !important; }
        }
        @media (min-width: 577px) {
          .btn-text-mobile { display: none !important; }
        }
      `}</style>
    </div >
  );
}

export default CropDiseasePrediction;
