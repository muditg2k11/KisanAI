import mysql.connector
from dotenv import load_dotenv
import os
import hashlib

load_dotenv(override=True)

try:
    conn = mysql.connector.connect(
        host=os.getenv('MYSQL_HOST', '127.0.0.1'),
        user=os.getenv('MYSQL_USER', 'root'),
        password=os.getenv('MYSQL_PASSWORD', ''),
        database=os.getenv('MYSQL_DB', 'farmers')
    )
    cursor = conn.cursor()
    
    username = 'testuser3'
    email = 'testuser3@example.com'
    password = 'password123'
    role = 'consumer'
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    
    query = "INSERT INTO users (username, email, password, role) VALUES (%s, %s, %s, %s)"
    print("Executing query...")
    cursor.execute(query, (username, email, hashed_password, role))
    conn.commit()
    print("Success! inserted ID:", cursor.lastrowid)
    
except Exception as e:
    print(f"FAILED! Error: {str(e)}")
finally:
    if 'cursor' in locals():
        cursor.close()
    if 'conn' in locals() and conn.is_connected():
        conn.close()
