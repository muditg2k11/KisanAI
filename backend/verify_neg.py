import mysql.connector
import os
import json
from dotenv import load_dotenv

# Load environment variables
dotenv_path = os.path.join(os.getcwd(), '.env')
load_dotenv(dotenv_path)

try:
    conn = mysql.connector.connect(
        host=os.getenv('MYSQL_HOST', '127.0.0.1'),
        user=os.getenv('MYSQL_USER', 'root'),
        password=os.getenv('MYSQL_PASSWORD', ''),
        database=os.getenv('MYSQL_DB', 'farmers')
    )
    cursor = conn.cursor()
    
    # Create the table
    cursor.execute('''
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
    ''')
    conn.commit()
    print('SUCCESS: Negotiations table created or already exists.')

    # Verify columns
    cursor.execute("DESCRIBE negotiations")
    columns = [row[0] for row in cursor.fetchall()]
    print(f"Columns in negotiations: {columns}")

    cursor.close()
    conn.close()
except Exception as e:
    print(f"FAILURE: {str(e)}")
