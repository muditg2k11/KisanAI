import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv(override=True)

try:
    print("Connecting with:")
    print(f"Host: {os.getenv('MYSQL_HOST')}")
    print(f"User: {os.getenv('MYSQL_USER')}")
    # print(f"Pass: {os.getenv('MYSQL_PASSWORD')}")
    print(f"DB: {os.getenv('MYSQL_DB')}")

    conn = mysql.connector.connect(
        host=os.getenv('MYSQL_HOST', '127.0.0.1'),
        user=os.getenv('MYSQL_USER', 'root'),
        password=os.getenv('MYSQL_PASSWORD', ''),
        database=os.getenv('MYSQL_DB', 'farmers')
    )
    cursor = conn.cursor()
    cursor.execute("SELECT id, username FROM users LIMIT 1")
    result = cursor.fetchone()
    print("SUCCESS! Data:", result)
    cursor.close()
    conn.close()
except Exception as e:
    print(f"FAILED! Error: {str(e)}")
