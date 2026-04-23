import Sidebar from './sidebarmenufarmer';
import Navbar from '../navbar';
import Footer from '../footer';
import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../util';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function CropRecommendation() {
    const [nitrogen, setNitrogen] = useState('');
    const [phosphorus, setPhosphorus] = useState('');
    const [potassium, setPotassium] = useState('');
    const [temperature, setTemperature] = useState('');
    const [humidity, setHumidity] = useState('');
    const [ph, setPh] = useState('');
    const [rainfall, setRainfall] = useState('');
    const [recommendation, setRecommendation] = useState(null);
    const [tips, setTips] = useState(null);
    const [loading, setLoading] = useState(false);
    const reportRef = useRef(null);

    const handleDownloadReport = async () => {
        if (!reportRef.current) return;

        // Create a hidden container for the PDF content
        const reportElement = reportRef.current;
        const clone = reportElement.cloneNode(true);

        // Style the clone for clean capture
        clone.style.position = 'fixed';
        clone.style.left = '-9999px';
        clone.style.top = '0';
        clone.style.width = reportElement.offsetWidth + 'px';
        clone.style.height = 'auto';
        clone.style.maxHeight = 'none';
        clone.style.overflow = 'visible';
        clone.style.backgroundColor = '#ffffff';
        clone.style.boxShadow = 'none';
        clone.style.borderRadius = '0'; // Clean edges for PDF

        document.body.appendChild(clone);

        try {
            // 1. Remove UI elements from clone (Download/Share buttons)
            const actions = clone.querySelector('.report-actions');
            if (actions) actions.remove();

            // 2. Expand Scrollable Tips
            const tipsBox = clone.querySelector('.tips-content');
            if (tipsBox) {
                tipsBox.style.maxHeight = 'none';
                tipsBox.style.overflowY = 'visible';
                tipsBox.style.paddingRight = '0';
            }

            // 3. Capture with html2canvas
            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                windowWidth: reportElement.offsetWidth,
                windowHeight: clone.scrollHeight
            });

            document.body.removeChild(clone);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Calculate image dimensions to fit page width
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            // Add first page
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Add more pages if content is too long
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`Agricultural_Report_${recommendation.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            if (document.body.contains(clone)) document.body.removeChild(clone);
            alert('Failed to generate report. Please try again.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        apiClient.post('/recommend_crop', {
            nitrogen: parseFloat(nitrogen),
            phosphorus: parseFloat(phosphorus),
            potassium: parseFloat(potassium),
            temperature: parseFloat(temperature),
            humidity: parseFloat(humidity),
            ph: parseFloat(ph),
            rainfall: parseFloat(rainfall)
        })
            .then((response) => {
                setRecommendation(response.data.recommended_crop);
                setTips(response.data.tips);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                alert(error.response?.data?.error || "Server error");
                setLoading(false);
            });
    };

    const inputFields = [
        { label: 'Nitrogen (N)', value: nitrogen, setter: setNitrogen, icon: 'fa-flask', color: '#48bb78', placeholder: 'e.g. 90' },
        { label: 'Phosphorus (P)', value: phosphorus, setter: setPhosphorus, icon: 'fa-vial', color: '#4299e1', placeholder: 'e.g. 42' },
        { label: 'Potassium (K)', value: potassium, setter: setPotassium, icon: 'fa-filter', color: '#ed8936', placeholder: 'e.g. 43' },
        { label: 'Temperature (°C)', value: temperature, setter: setTemperature, icon: 'fa-thermometer-half', color: '#f56565', placeholder: 'e.g. 20.8' },
        { label: 'Humidity (%)', value: humidity, setter: setHumidity, icon: 'fa-tint', color: '#00b5ad', placeholder: 'e.g. 82.0' },
        { label: 'Soil pH', value: ph, setter: setPh, icon: 'fa-eye-dropper', color: '#9f7aea', placeholder: 'e.g. 6.5' },
        { label: 'Rainfall (mm)', value: rainfall, setter: setRainfall, icon: 'fa-cloud-showers-heavy', color: '#3182ce', placeholder: 'e.g. 202.9' },
    ];

    return (
        <div className="wrapper">
            <Navbar pageTitle="Crop Recommendation" />
            <Sidebar />
            <div className="content-wrapper content-wrapper-responsive" style={{ backgroundColor: 'white', minHeight: '100vh' }}>
                <section className="content" style={{ padding: '25px' }}>
                    <div className="container-fluid">
                        <div className="row">
                            {/* Left Column: Input Form */}
                            <div className="col-md-5">
                                <div style={{
                                    padding: '30px',
                                    borderRadius: '16px',
                                    border: '1px solid #edf2f7',
                                    backgroundColor: 'white',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                    height: 'fit-content',
                                    position: 'sticky',
                                    top: '20px',
                                    zIndex: 100
                                }}>
                                    <div style={{ marginBottom: '25px' }}>
                                        <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#1a202c', display: 'flex', alignItems: 'center' }}>
                                            <i className="fa fa-seedling" style={{ marginRight: '15px', color: '#48bb78' }}></i>
                                            Soil & Environment Data
                                        </h3>
                                        <p style={{ color: '#718096', marginTop: '8px', fontSize: '14px' }}>Enter your soil parameters to get the best crop recommendation.</p>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            {inputFields.map((field, idx) => (
                                                <div className={idx === 6 ? "col-md-12" : "col-md-6"} key={field.label} style={{ marginBottom: '20px' }}>
                                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' }}>
                                                        {field.label}
                                                    </label>
                                                    <div style={{ position: 'relative' }}>
                                                        <i className={`fa ${field.icon}`} style={{
                                                            position: 'absolute',
                                                            left: '12px',
                                                            top: '50%',
                                                            transform: 'translateY(-50%)',
                                                            color: field.color,
                                                            fontSize: '14px'
                                                        }}></i>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            className="form-control"
                                                            placeholder={field.placeholder}
                                                            value={field.value}
                                                            onChange={(e) => field.setter(e.target.value)}
                                                            required
                                                            style={{
                                                                paddingLeft: '38px',
                                                                height: '45px',
                                                                borderRadius: '10px',
                                                                border: '1px solid #e2e8f0',
                                                                fontSize: '14px',
                                                                transition: 'all 0.2s'
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            style={{
                                                width: '100%',
                                                padding: '14px',
                                                marginTop: '10px',
                                                borderRadius: '12px',
                                                border: 'none',
                                                background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                                                color: 'white',
                                                fontWeight: '600',
                                                fontSize: '16px',
                                                cursor: loading ? 'not-allowed' : 'pointer',
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                                boxShadow: '0 4px 12px rgba(72, 187, 120, 0.2)'
                                            }}
                                            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                                            onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
                                        >
                                            {loading ? (
                                                <span><i className="fa fa-circle-notch fa-spin" style={{ marginRight: '10px' }}></i> Analyzing...</span>
                                            ) : (
                                                <span><i className="fa fa-magic" style={{ marginRight: '10px' }}></i> Get Recommendation</span>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Right Column: Results */}
                            <div className="col-md-7">
                                <div id="recommendation-report" ref={reportRef} style={{
                                    padding: '30px',
                                    borderRadius: '16px',
                                    backgroundColor: recommendation ? 'white' : '#f8fafc',
                                    border: recommendation ? 'none' : '1px dashed #cbd5e0',
                                    minHeight: '600px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: recommendation ? 'flex-start' : 'center',
                                    alignItems: recommendation ? 'stretch' : 'center',
                                    textAlign: recommendation ? 'left' : 'center',
                                    transition: 'all 0.3s ease',
                                    boxShadow: recommendation ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
                                }}>
                                    {!recommendation && !loading && (
                                        <div style={{ color: '#94a3b8' }}>
                                            <i className="fa fa-chart-line" style={{ fontSize: '60px', marginBottom: '20px', opacity: 0.5 }}></i>
                                            <h4 style={{ fontWeight: '600' }}>Waiting for Analysis</h4>
                                            <p>Fill in the soil data to see your personalized crop recommendation.</p>
                                        </div>
                                    )}

                                    {loading && (
                                        <div style={{ textAlign: 'center' }}>
                                            <div className="analysis-loader" style={{
                                                width: '60px',
                                                height: '60px',
                                                border: '5px solid #e2e8f0',
                                                borderTop: '5px solid #48bb78',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite',
                                                margin: '0 auto 20px'
                                            }}></div>
                                            <h4 style={{ fontWeight: '600', color: '#2d3748' }}>Running ML Model...</h4>
                                            <p style={{ color: '#718096' }}>Our algorithm is calculating the best crop for your soil conditions.</p>
                                            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                                        </div>
                                    )}

                                    {recommendation && !loading && (
                                        <div className="animate__animated animate__fadeIn">
                                            <div style={{
                                                padding: '20px',
                                                backgroundColor: 'white',
                                                borderRadius: '12px',
                                                borderLeft: '6px solid #48bb78',
                                                marginBottom: '25px',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                            }}>
                                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#48bb78', textTransform: 'uppercase', letterSpacing: '1px' }}>Recommended Crop</span>
                                                <h2 style={{ margin: '5px 0 0 0', color: '#1a202c', fontWeight: '800', fontSize: '32px' }}>{recommendation}</h2>
                                            </div>

                                            <div style={{
                                                backgroundColor: 'white',
                                                padding: '25px',
                                                borderRadius: '12px',
                                                border: '1px solid #e2e8f0'
                                            }}>
                                                <h4 style={{ fontWeight: '700', color: '#2d3748', display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                                    <i className="fa fa-book-open" style={{ marginRight: '10px', color: '#4299e1' }}></i>
                                                    Cultivation Tips
                                                </h4>
                                                <div className="tips-content" style={{
                                                    lineHeight: '1.7',
                                                    color: '#4a5568',
                                                    fontSize: '15px',
                                                    whiteSpace: 'pre-wrap',
                                                    paddingRight: '10px'
                                                }}>
                                                    <ReactMarkdown>
                                                        {tips}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>

                                            <div className="report-actions" style={{ marginTop: '25px', display: 'flex', gap: '15px' }}>
                                                <button
                                                    className="btn"
                                                    onClick={handleDownloadReport}
                                                    style={{
                                                        flex: 1,
                                                        backgroundColor: '#48bb78',
                                                        color: 'white',
                                                        fontWeight: '600',
                                                        padding: '12px',
                                                        borderRadius: '10px',
                                                        border: 'none',
                                                        boxShadow: '0 4px 6px rgba(72, 187, 120, 0.2)'
                                                    }}
                                                >
                                                    <i className="fa fa-download" style={{ marginRight: '8px' }}></i> Download Report
                                                </button>
                                                <button className="btn" style={{
                                                    flex: 1,
                                                    backgroundColor: '#ebf8ff',
                                                    color: '#3182ce',
                                                    fontWeight: '600',
                                                    padding: '12px',
                                                    borderRadius: '10px',
                                                    border: '1px solid #bee3f8'
                                                }}>
                                                    <i className="fa fa-share" style={{ marginRight: '8px' }}></i> Share
                                                </button>
                                            </div>
                                        </div>
                                    )}
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

export default CropRecommendation;
