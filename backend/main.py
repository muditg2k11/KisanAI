from flask import Flask, jsonify, request, session, send_file, send_from_directory
import requests
import hashlib
import os
import re
import warnings
import razorpay
from flask_cors import CORS
from werkzeug.utils import secure_filename
import uuid
import tensorflow as tf
import numpy as np
import tempfile
import json
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import google.generativeai as genai
import mysql.connector
from dotenv import load_dotenv

def load_gemini_config():
    """Load Gemini configuration from .env"""
    load_dotenv(override=True)
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key:
        genai.configure(api_key=api_key)
        return True
    return False

load_gemini_config()

# Initialize Razorpay Client
razorpay_client = razorpay.Client(
    auth=(os.getenv('RAZORPAY_KEY_ID'), os.getenv('RAZORPAY_KEY_SECRET'))
)

# Suppress warnings

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
warnings.filterwarnings('ignore', category=UserWarning)

# Initialize Flask app
app = Flask(__name__)
CORS(
    app,
    supports_credentials=True,
    origins='*',  # Allow multiple frontend origins
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE"]
)

@app.route('/')
def home():
    return jsonify({
        "status": "success",
        "message": "Welcome to the Agrinova API. The backend is running!",
        "endpoints": ["/login", "/register", "/get_products", "/predict_crop", "/predict_disease"]
    }), 200

app.secret_key = os.getenv('SESSION_SECRET_KEY', 'TFS27122023')
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = False

DB_CONFIG = {
    'host': os.getenv('MYSQL_HOST', '127.0.0.1'),
    'user': os.getenv('MYSQL_USER', 'root'),
    'password': os.getenv('MYSQL_PASSWORD', '1234'),
    'database': os.getenv('MYSQL_DB', 'farmer_app')
}

def get_db():
    """Get a fresh MySQL connection."""
    return mysql.connector.connect(**DB_CONFIG)

def initialize_database():
    """Create necessary tables if they don't exist."""
    print("Initializing database tables...")
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Create user_carts table for persistent shopping carts
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_carts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                cart_data LONGTEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)
        # Create negotiations table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS negotiations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255),
                user_email VARCHAR(255),
                original_amount DECIMAL(10,2),
                negotiated_amount DECIMAL(10,2),
                items LONGTEXT,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Add farmer_username column to products table if it doesn't exist
        try:
            cursor.execute("ALTER TABLE products ADD COLUMN farmer_username VARCHAR(255) DEFAULT ''")
            print("Added farmer_username column to products table.")
        except Exception:
            pass  # Column already exists
            
        # Add items column to negotiations table if it doesn't exist (safe migration)
        try:
            cursor.execute("ALTER TABLE negotiations ADD COLUMN items LONGTEXT")
            print("Added items column to negotiations table.")
        except Exception:
            pass  # Column already exists
        
        
        conn.commit()
        print("Database tables verified.")
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals() and conn.is_connected():
            conn.close()

# Run DB initialization on startup
initialize_database()

@app.errorhandler(405)
def method_not_allowed(e):
    if request.path.startswith('/api/'):
        return jsonify(message="Method Not Allowed"), 405
    else:
        return render_template("405.html"), 405


@app.after_request
def add_cors_headers(response):
    """Add CORS headers to all responses."""
    allowed_origins = ["http://localhost:3000", "http://localhost:3001"]
    if request.headers.get('Origin') in allowed_origins:
        response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin')
    else:
        response.headers['Access-Control-Allow-Origin'] = '*'  # For other origins without credentials
    response.headers['Access-Control-Allow-Credentials'] = 'true' if request.headers.get('Origin') in allowed_origins else 'false'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    return response

# Upload folder configuration
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


import PIL.Image


def get_gemini_advice(disease, confidence):
    """Fetch management tips from Gemini AI using official SDK"""
    # Re-load config to ensure .env changes are picked up
    load_gemini_config()
    model_name = os.getenv('GEMINI_MODEL', 'models/gemini-2.5-flash')
    prompt = (
        f"Provide agricultural advice for {disease} (confidence: {confidence*100:.1f}%). "
        "Include: 1) Brief description 2) Key symptoms 3) Organic management "
        "4) Chemical treatments 5) Prevention strategies. Keep concise."
    )
    
    try:
        gemini_model = genai.GenerativeModel(model_name)
        response = gemini_model.generate_content(prompt)
        
        if response.candidates and response.text:
            return response.text
        return "Agricultural advice unavailable. Consult a local expert."
    
    except Exception as e:
        error_msg = str(e)
        print(f"Gemini API Error ({model_name}): {error_msg}")
        if "429" in error_msg or "quota" in error_msg.lower():
            return "Gemini API quota exceeded (Rate Limit). If you have credits, please check if your project is linked to a 'Paid Billing' account in Google AI Studio to unlock higher limits. Otherwise, please wait 60 seconds."
        return f"Temporary service interruption: {error_msg}. Please try again later."

def get_gemini_crop_tips(crop_name):
    """
    Use Gemini AI to generate cultivation tips for the given crop.
    """
    load_gemini_config()
    model_name = os.getenv('GEMINI_MODEL', 'models/gemini-2.5-flash')
    prompt = (
        f"Provide concise, practical cultivation tips for growing {crop_name} in India. "
        "Include: 1) Brief introduction, 2) Soil and climate requirements, 3) Sowing/planting instructions, "
        "4) Watering and fertilization, 5) Common pests/diseases and management, 6) Harvesting tips. "
        "Keep it actionable for farmers."
    )
    try:
        gemini_model = genai.GenerativeModel(model_name)
        response = gemini_model.generate_content(prompt)
        if response.candidates and response.text:
            return response.text
        return "Cultivation tips unavailable. Consult a local expert."
    except Exception as e:
        error_msg = str(e)
        print(f"Gemini API Error ({model_name}): {error_msg}")
        if "429" in error_msg or "quota" in error_msg.lower():
            return "Gemini API quota exceeded (Rate Limit). Please wait 60 seconds or link your billing account in Google AI Studio."
        return "Temporary service interruption. Please try again later."



# Load the crop recommendation data and train the model at startup
crop_data = pd.read_csv('Crop_recommendation.csv')

# Features and target
features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
X = crop_data[features]
y = crop_data['label']

# Encode labels
from sklearn.preprocessing import LabelEncoder

le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Train a Random Forest Classifier
modelcrop = RandomForestClassifier(n_estimators=100, random_state=42)
modelcrop.fit(X, y_encoded)


@app.route('/recommend_crop', methods=['POST'])
def recommend_crop():
    """
    Recommend the best crop based on soil and weather parameters.
    Expects JSON with keys: nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall
    """
    data = request.get_json()
    try:
        # Extract and convert input values to float, ensure correct order
        input_features = [
            float(data['nitrogen']),
            float(data['phosphorus']),
            float(data['potassium']),
            float(data['temperature']),
            float(data['humidity']),
            float(data['ph']),
            float(data['rainfall'])
        ]
        # Convert to 2D numpy array of float32
        input_array = np.array([input_features], dtype=np.float32)
        # Check for NaN or Inf
        if np.isnan(input_array).any() or np.isinf(input_array).any():
            return jsonify({'error': 'Input contains NaN or infinity.'}), 400

        prediction = modelcrop.predict(input_array)
        recommended_crop = le.inverse_transform(prediction)[0]
        crop_tips = get_gemini_crop_tips(recommended_crop)
        return jsonify({'recommended_crop': recommended_crop, 'tips': crop_tips}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/login', methods=['POST'])
def login():
    """Log in a user."""
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT id, username, email, password, role FROM users WHERE BINARY username = %s AND password = %s",
            (username, hashed_password)
        )
        user = cursor.fetchone()

        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401

        session.clear()
        session['user_id'] = user[0]
        session['username'] = user[1]
        session['email'] = user[2]
        session['role'] = user[4]
        session.permanent = True

        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user[0],
                'username': user[1],
                'email': user[2],
                'role': user[4]
            }
        }), 200

    except Exception as e:
        print(f"Database error: {str(e)}")
        return jsonify({'error': 'Server error'}), 500

    finally:
        cursor.close()
        conn.close()


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/cart', methods=['GET', 'POST'])
def handle_cart():
    """Get or update the user's persistent cart."""
    if request.method == 'GET':
        username = request.args.get('username')
        if not username:
            return jsonify({'error': 'Username is required'}), 400
            
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT cart_data FROM user_carts WHERE username = %s", (username,))
            result = cursor.fetchone()
            if result and result['cart_data']:
                try:
                    cart_items = json.loads(result['cart_data'])
                    return jsonify({'status': 'success', 'cart': cart_items}), 200
                except json.JSONDecodeError:
                    return jsonify({'status': 'success', 'cart': []}), 200
            return jsonify({'status': 'success', 'cart': []}), 200
        except Exception as e:
            return jsonify({'error': 'Database error', 'details': str(e)}), 500
        finally:
            cursor.close()
            conn.close()

    elif request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        cart_items = data.get('cartItems', [])
        
        if not username:
            return jsonify({'error': 'Username is required'}), 400
            
        cart_json = json.dumps(cart_items)
        conn = get_db()
        cursor = conn.cursor()
        try:
            # Upsert logic: Update if exists, otherwise insert
            cursor.execute("""
                INSERT INTO user_carts (username, cart_data)
                VALUES (%s, %s)
                ON DUPLICATE KEY UPDATE cart_data = %s
            """, (username, cart_json, cart_json))
            conn.commit()
            return jsonify({'status': 'success', 'message': 'Cart saved successfully'}), 200
        except Exception as e:
            conn.rollback()
            return jsonify({'error': 'Failed to save cart', 'details': str(e)}), 500
        finally:
            cursor.close()
            conn.close()

@app.route('/api/create-razorpay-order', methods=['POST'])
def create_razorpay_order():
    """Create an order with Razorpay API"""
    try:
        data = request.get_json()
        amount = float(data.get('amount', 0))
        
        # Razorpay accepts amounts in paise/cents (multiply by 100)
        order_amount = int(amount * 100)
        order_currency = 'INR'
        
        razorpay_order = razorpay_client.order.create({
            'amount': order_amount,
            'currency': order_currency,
            'payment_capture': 1
        })
        return jsonify(razorpay_order), 200
    except Exception as e:
        print(f"Razorpay Error: {str(e)}")
        return jsonify({'error': 'Failed to create Razorpay Order', 'details': str(e)}), 500

@app.route('/api/orders', methods=['POST'])
def store_order():
    """Verify payment signature (if online) and store the order in the database"""
    data = request.get_json()
    
    user = data.get('user', '')
    email = data.get('email', '')
    mobile = data.get('mobile', '')
    items = json.dumps(data.get('items', []))
    total = float(data.get('total', 0))
    payment_method = data.get('paymentMethod', 'COD')
    delivery_address = data.get('deliveryAddress', '')
    status = data.get('status', 'pending')
    
    # Razorpay Specifics
    payment_id = data.get('paymentId', '')
    order_id = data.get('orderId', '')
    signature = data.get('signature', '')

    # 1. Signature Verification for Online Payments
    if payment_method == 'online':
        try:
            razorpay_client.utility.verify_payment_signature({
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature
            })
        except razorpay.errors.SignatureVerificationError:
            return jsonify({'error': 'Payment signature verification failed'}), 400
        except Exception as e:
            return jsonify({'error': 'Verification issue', 'details': str(e)}), 500

    # 2. Store Order in DB (using actual column names from the orders table)
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO orders 
            (user, email, mobile, items, total, payment_method, delivery_address, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            user, email, mobile, items, total,
            payment_method, delivery_address, status
        ))
        conn.commit()
        return jsonify({'status': 'success', 'message': 'Order successfully placed'}), 201
    except Exception as e:
        conn.rollback()
        print(f"Database Error: {str(e)}")
        return jsonify({'error': 'Failed to save order to database', 'details': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Update the status of an order (for farmer admin)"""
    data = request.get_json()
    new_status = data.get('status', '')
    
    valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if new_status not in valid_statuses:
        return jsonify({'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE orders SET status = %s WHERE id = %s", (new_status, order_id))
        if cursor.rowcount == 0:
            return jsonify({'error': 'Order not found'}), 404
        conn.commit()
        return jsonify({'status': 'success', 'message': f'Order #{order_id} updated to {new_status}'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': 'Failed to update order status', 'details': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/register', methods=['POST'])
def register_user():
    """Register a new user."""
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')  

    if not username or not email or not password or not role:
        return jsonify({'error': 'Missing required fields'}), 400

    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    conn = get_db()
    cursor = conn.cursor()
    try:
        print(f"DEBUG: Attempting to register user: {username}, email: {email}, role: {role}")
        query = "INSERT INTO users (username, email, password, role) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (username, email, hashed_password, role))
        conn.commit()
        new_user_id = cursor.lastrowid
        print(f"DEBUG: User registered successfully: {username}")

        # Auto-login: set session for the newly registered user
        session.clear()
        session['user_id'] = new_user_id
        session['username'] = username
        session['email'] = email
        session['role'] = role
        session.permanent = True

        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': new_user_id,
                'username': username,
                'email': email,
                'role': role
            }
        }), 201
    except Exception as e:
        print(f"CRITICAL ERROR during registration: {str(e)}")
        # Check if the table exists or if there's a schema mismatch
        try:
            cursor.execute("DESCRIBE users")
            columns = cursor.fetchall()
            print(f"DEBUG: Current users table structure: {columns}")
        except Exception as schema_err:
            print(f"DEBUG: Could not describe users table: {schema_err}")
        
        return jsonify({'error': 'Server error', 'details': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/check_auth', methods=['GET'])
def check_auth():
    """Check if the user is authenticated."""
    if 'user_id' in session:
        return jsonify({
            'isLoggedIn': True,
            'user': {
                'id': session['user_id'],
                'username': session['username'],
                'role': session['role']
            }
        }), 200
    return jsonify({'isLoggedIn': False}), 200

@app.route('/logout', methods=['POST'])
def logout():
    """Log out the current user."""
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/api/dashboard-stats', methods=['GET'])
def get_dashboard_stats():
    farmer = request.args.get('farmer', '')
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # 1. Basic counts
        if farmer:
            cursor.execute("SELECT COUNT(*) as count FROM products WHERE farmer_username = %s", (farmer,))
            productsAdded = cursor.fetchone()['count'] or 0
        else:
            cursor.execute("SELECT COUNT(*) as count FROM products")
            productsAdded = cursor.fetchone()['count'] or 0

        # 2. Orders and Financials
        cursor.execute("SELECT id, user, email, total, payment_method, status, items FROM orders ORDER BY id DESC")
        all_orders = cursor.fetchall()

        farmer_product_names = []
        if farmer:
            cursor2 = conn.cursor(dictionary=True)
            cursor2.execute("SELECT name FROM products WHERE farmer_username = %s", (farmer,))
            farmer_product_names = [row['name'] for row in cursor2.fetchall()]
            cursor2.close()

        filtered_orders = []
        total_order_value = 0.0
        total_income = 0.0
        productsOrdered_count = 0

        for o in all_orders:
            try:
                # Handle potential already-parsed JSON or string
                raw_items = o['items']
                if isinstance(raw_items, str):
                    order_items = json.loads(raw_items) if raw_items else []
                else:
                    order_items = raw_items if raw_items else []
            except:
                order_items = []

            if farmer:
                # Filter items to only those belonging to this farmer
                farmer_items = [
                    item for item in order_items 
                    if item.get('title', item.get('name', '')) in farmer_product_names
                ]
                
                if not farmer_items:
                    continue # This order has no items for this farmer
                
                # Calculate subtotal for this farmer's items in this order
                farmer_subtotal = sum(float(item.get('price', 0)) * int(item.get('quantity', 1)) for item in farmer_items)
                
                productsOrdered_count += 1
                total_order_value += farmer_subtotal
                
                # Financial logic for farmer income
                if o['payment_method'].lower() == 'online':
                    total_income += farmer_subtotal
                elif o['payment_method'].lower() == 'cod' and o['status'].lower() == 'delivered':
                    total_income += farmer_subtotal
                
                filtered_orders.append({
                    'id': o['id'],
                    'user': o['user'],
                    'name': o['user'],
                    'email': o['email'],
                    'total': farmer_subtotal,
                    'payment_method': o['payment_method'],
                    'status': o['status'],
                    'items': farmer_items
                })
            else:
                # Global view logic
                productsOrdered_count += 1
                total_order_value += float(o['total'])
                if o['payment_method'].lower() == 'online':
                    total_income += float(o['total'])
                elif o['payment_method'].lower() == 'cod' and o['status'].lower() == 'delivered':
                    total_income += float(o['total'])
                
                filtered_orders.append({
                    'id': o['id'],
                    'user': o['user'],
                    'name': o['user'],
                    'email': o['email'],
                    'total': float(o['total']),
                    'payment_method': o['payment_method'],
                    'status': o['status'],
                    'items': order_items
                })

        return jsonify({
            'productsAdded': productsAdded,
            'productsOrdered': productsOrdered_count,
            'totalOrderValue': total_order_value,
            'totalIncome': total_income,
            'customerOrders': filtered_orders[:5]
        }), 200

    except Exception as e:
        print(f"Error in dashboard stats: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
            
@app.route('/api/latest-orders', methods=['GET'])
def get_latest_orders():
    farmer = request.args.get('farmer', '')
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT id, user, email, total, payment_method, status, items FROM orders ORDER BY id DESC")
        all_orders = cursor.fetchall()

        farmer_product_names = []
        if farmer:
            cursor2 = conn.cursor(dictionary=True)
            cursor2.execute("SELECT name FROM products WHERE farmer_username = %s", (farmer,))
            farmer_product_names = [row['name'] for row in cursor2.fetchall()]
            cursor2.close()

        latest_orders = []
        for o in all_orders:
            try:
                raw_items = o['items']
                if isinstance(raw_items, str):
                    order_items = json.loads(raw_items) if raw_items else []
                else:
                    order_items = raw_items if raw_items else []
            except:
                order_items = []

            if farmer:
                farmer_items = [
                    item for item in order_items 
                    if item.get('title', item.get('name', '')) in farmer_product_names
                ]
                
                if not farmer_items:
                    continue
                
                farmer_subtotal = sum(float(item.get('price', 0)) * int(item.get('quantity', 1)) for item in farmer_items)
                
                latest_orders.append({
                    'id': o['id'],
                    'user': o['user'],
                    'email': o['email'],
                    'total': farmer_subtotal,
                    'payment_method': o['payment_method'],
                    'status': o['status'],
                    'items': farmer_items
                })
            else:
                latest_orders.append({
                    'id': o['id'],
                    'user': o['user'],
                    'email': o['email'],
                    'total': float(o['total']),
                    'payment_method': o['payment_method'],
                    'status': o['status'],
                    'items': order_items
                })

        return jsonify({'latestOrders': latest_orders[:5]})

    except Exception as e:
        print(f"Error fetching latest orders: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/all-orders', methods=['GET'])
def get_all_orders():
    farmer = request.args.get('farmer', '')
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, user, email, total, payment_method, status, items, delivery_address 
        FROM orders 
        ORDER BY id DESC 
    """)
    orders = cursor.fetchall()
    
    if farmer:
        cursor2 = conn.cursor()
        cursor2.execute("SELECT name FROM products WHERE farmer_username = %s", (farmer,))
        farmer_product_names = [row[0] for row in cursor2.fetchall()]
        cursor2.close()
        
        filtered = []
        for order in orders:
            order_items = json.loads(order[6]) if order[6] else []
            if any(item.get('title', item.get('name', '')) in farmer_product_names for item in order_items):
                filtered.append(order)
        orders = filtered
    
    all_orders = [{
        'id': order[0],
        'user': order[1],
        'email': order[2],
        'total': float(order[3]),
        'payment_method': order[4],
        'status': order[5],
        'items': json.loads(order[6]) if order[6] else [],
        'delivery_address': order[7]
    } for order in orders]
    
    cursor.close()
    conn.close()
    return jsonify({'allOrders': all_orders})


@app.route('/api/orders/by-username/<username>', methods=['GET'])
def get_orders_by_username(username):
    """Fetch orders for a specific user."""
    print(f"Received username: {username}")  # Debug
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT id, user, email, total, payment_method, status, items, delivery_address
            FROM orders
            WHERE user = %s
            ORDER BY id DESC
        """, (username,))
        orders = cursor.fetchall()
        print(f"Fetched orders for {username}: {orders}")  # Debug
        order_list = [{
            'id': order[0],
            'user': order[1],
            'email': order[2],
            'total': float(order[3]),
            'payment_method': order[4],
            'status': order[5],
            'items': json.loads(order[6]),
            'delivery_address': order[7]
        } for order in orders]
        return jsonify({'orders': order_list}), 200
    except Exception as e:
        print(f"Error fetching orders by username: {str(e)}")
        return jsonify({'error': 'Server error'}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/recent-products', methods=['GET'])
def get_recent_products():
    farmer = request.args.get('farmer', '')
    conn = get_db()
    cursor = conn.cursor()
    if farmer:
        cursor.execute("""
            SELECT id, name, description, price, image_path 
            FROM products 
            WHERE farmer_username = %s
            ORDER BY id DESC 
            LIMIT 5
        """, (farmer,))
    else:
        cursor.execute("""
            SELECT id, name, description, price, image_path 
            FROM products 
            ORDER BY id DESC 
            LIMIT 5
        """)
    products = cursor.fetchall()
    recent_products = [
        {
            'id': product[0],
            'name': product[1],
            'description': product[2],
            'price': product[3],
            'image': product[4]
        }
        for product in products
    ]
    cursor.close()
    conn.close()
    return jsonify({'recentProducts': recent_products})


@app.route('/get_products', methods=['GET'])
def get_products():
    farmer = request.args.get('farmer', '')
    conn = get_db()
    cursor = conn.cursor()
    if farmer:
        cursor.execute("SELECT id, name, description, price, image_path, farmer_username FROM products WHERE farmer_username = %s", (farmer,))
    else:
        cursor.execute("SELECT id, name, description, price, image_path, farmer_username FROM products")
    products = cursor.fetchall()
    product_list = []
    for p in products:
        img_filename = os.path.basename(p[4]) if p[4] else None
        img_url = f"http://localhost:5000/uploads/{img_filename}" if img_filename else None
        product_list.append({
            'id': p[0],
            'title': p[1],
            'description': p[2],
            'price': p[3],
            'image': img_url,
            'farmer_name': p[5] if p[5] else 'Agrinova'
        })
    cursor.close()
    conn.close()
    return jsonify({'products': product_list})


@app.route('/add_product', methods=['POST'])
def add_product():
    data = request.form
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')
    farmer_username = data.get('farmer_username', '')
    
    if not name or not description or not price:
        return jsonify({'error': 'Missing required fields'}), 400

    # Handle file upload
    if 'image' in request.files:
        image = request.files['image']
        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            # Generate a unique filename to avoid conflicts
            unique_filename = f"{uuid.uuid4()}_{filename}"
            image.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))
            image_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        else:
            return jsonify({'error': 'Invalid file type'}), 400
    else:
        return jsonify({'error': 'No image provided'}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        query = "INSERT INTO products (name, description, price, image_path, farmer_username) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(query, (name, description, price, image_path, farmer_username))
        conn.commit()
        return jsonify({'message': 'Product added successfully'}), 201
    except Exception as e:
        print(f"Database error: {str(e)}")
        return jsonify({'error': 'Server error'}), 500
    finally:
        conn.close()

@app.route('/update_product/<int:product_id>', methods=['PUT', 'POST']) # Support POST too for multipart data issues in some clients
def update_product(product_id):
    data = request.form
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')
    
    if not name or not description or not price:
        return jsonify({'error': 'Missing required fields'}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        # Check if product exists
        cursor.execute("SELECT image_path FROM products WHERE id = %s", (product_id,))
        product = cursor.fetchone()
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        image_path = product[0]

        # Handle file upload if a new image is provided
        if 'image' in request.files:
            image = request.files['image']
            if image and allowed_file(image.filename):
                filename = secure_filename(image.filename)
                unique_filename = f"{uuid.uuid4()}_{filename}"
                image.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))
                image_path = os.path.join(UPLOAD_FOLDER, unique_filename)

        query = "UPDATE products SET name = %s, description = %s, price = %s, image_path = %s WHERE id = %s"
        cursor.execute(query, (name, description, price, image_path, product_id))
        conn.commit()
        return jsonify({'message': 'Product updated successfully'}), 200
    except Exception as e:
        print(f"Database error: {str(e)}")
        return jsonify({'error': 'Server error'}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/delete_product/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM products WHERE id = %s", (product_id,))
        if cursor.rowcount == 0:
            return jsonify({'error': 'Product not found'}), 404
        conn.commit()
        return jsonify({'message': 'Product deleted successfully'}), 200
    except Exception as e:
        print(f"Database error: {str(e)}")
        return jsonify({'error': 'Server error'}), 500
    finally:
        cursor.close()
        conn.close()


@app.route('/predict_disease', methods=['POST'])
def predict_disease():
    """Handle image upload and disease prediction using Gemini Vision AI."""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image uploaded'}), 400

        file = request.files['image']
        if not file or not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type'}), 400

        filename = secure_filename(file.filename)
        temp_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(temp_path)

        try:
            with PIL.Image.open(temp_path) as img:
                img.load() # Load image data into memory

                # Use the dynamic model from .env
                load_gemini_config()
                model_name = os.getenv('GEMINI_MODEL', 'models/gemini-2.5-flash')
                gemini_model = genai.GenerativeModel(model_name)

                analysis_prompt = (
                    "You are an expert agricultural plant pathologist. Analyze this plant leaf image and provide:\n"
                    "1. **Disease Name**: The specific disease affecting the plant (or 'Healthy' if no disease is detected)\n"
                    "2. **Confidence**: Your confidence level as a percentage (e.g., 85%)\n"
                    "3. **Plant Type**: The type of plant/crop in the image\n"
                    "4. **Symptoms**: Key visible symptoms in the image\n"
                    "5. **Organic Treatment**: Natural/organic management methods\n"
                    "6. **Chemical Treatment**: Recommended chemical treatments if needed\n"
                    "7. **Prevention**: Steps to prevent this disease in future\n\n"
                    "IMPORTANT: Provide clear, actionable advice for a farmer."
                )

                response = gemini_model.generate_content([analysis_prompt, img])

                if response.candidates and response.text:
                    result_text = response.text
                    disease_name = "Unknown"
                    confidence = 0.85

                    lines = result_text.split('\n')
                    for line in lines:
                        lower_line = line.lower()
                        if 'disease name' in lower_line or 'disease:' in lower_line:
                            disease_name = line.split(':', 1)[-1].strip().strip('*').strip()
                            break

                    for line in lines:
                        if '%' in line:
                            import re as regex
                            nums = regex.findall(r'(\d+(?:\.\d+)?)', line)
                            if nums:
                                confidence = float(nums[0]) / 100.0
                            break

                    return jsonify({
                        'prediction': disease_name,
                        'confidence': confidence,
                        'advice': result_text
                    }), 200
                else:
                    return jsonify({'error': 'Could not analyze the image. Please try again.'}), 500

        finally:
            if os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except Exception as e:
                    print(f"Error removing temp file: {e}")

    except Exception as e:
        print(f"Prediction error: {str(e)}")
        # Check if it's a quota error
        if '429' in str(e) or 'quota' in str(e).lower():
            return jsonify({'error': 'Gemini API quota exceeded. Please wait a moment or check your billing.'}), 429
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500



@app.route('/api/negotiations', methods=['POST'])
def create_negotiation():
    data = request.get_json()
    username = data.get('username')
    
    # Validation
    if not username:
        return jsonify({'error': 'You must be logged in to submit an offer.'}), 400
        
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Fetch the real email from the users table (use fetchall to avoid unread results if duplicates exist)
        cursor.execute("SELECT email FROM users WHERE username = %s", (username,))
        user_rows = cursor.fetchall()
        user_email = user_rows[0][0] if user_rows and user_rows[0][0] else f"{username}@gmail.com"
        
        cursor.execute(
            "INSERT INTO negotiations (username, user_email, original_amount, negotiated_amount, items, status) VALUES (%s, %s, %s, %s, %s, 'pending')",
            (username, user_email, data.get('originalAmount'), data.get('negotiatedAmount'), json.dumps(data.get('items')))
        )
        conn.commit()
        last_id = cursor.lastrowid
        return jsonify({'id': last_id, 'message': 'Negotiation submitted successfully'}), 201
    except Exception as e:
        print(f"Error creating negotiation: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

@app.route('/api/negotiations/pending', methods=['GET'])
def get_pending_negotiations():
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM negotiations WHERE status = 'pending'")
        negotiations = cursor.fetchall()
        
        # Format for frontend
        formatted = []
        for neg in negotiations:
            formatted.append({
                'id': neg['id'],
                'username': neg['username'],
                'userEmail': neg['user_email'],
                'originalAmount': float(neg['original_amount'] or 0.0),
                'negotiatedAmount': float(neg['negotiated_amount'] or 0.0),
                'items': json.loads(neg['items'])
            })
        return jsonify(formatted), 200
    except Exception as e:
        print(f"Error fetching negotiations: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

@app.route('/api/negotiations/<int:neg_id>', methods=['PUT', 'OPTIONS'])
def update_negotiation(neg_id):
    if request.method == 'OPTIONS':
        return '', 200
        
    data = request.get_json()
    status = data.get('status')
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE negotiations SET status = %s WHERE id = %s",
            (status, neg_id)
        )
        conn.commit()
        return jsonify({'message': f'Negotiation {status}'}), 200
    except Exception as e:
        print(f"Error updating negotiation: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

@app.route('/api/negotiations/status-by-id', methods=['POST'])
def get_negotiation_status():
    data = request.get_json()
    neg_id = data.get('id')
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT status, negotiated_amount FROM negotiations WHERE id = %s", (neg_id,))
        result = cursor.fetchone()
        if result:
            return jsonify({
                'status': result['status'],
                'negotiatedAmount': float(result['negotiated_amount'])
            }), 200
        return jsonify({'error': 'Not found'}), 404
    except Exception as e:
        print(f"Error checking status: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)


