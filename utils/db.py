import sqlite3
import datetime
import os

DB_PATH = "users.db"

def init_db():
    """Initialize the database with users and otp_codes tables."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    # Users table
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            email TEXT PRIMARY KEY,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # OTP Codes table
    c.execute('''
        CREATE TABLE IF NOT EXISTS otp_codes (
            email TEXT PRIMARY KEY,
            otp TEXT NOT NULL,
            expires_at TIMESTAMP NOT NULL
        )
    ''')
    
    # Sessions table
    c.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            email TEXT NOT NULL,
            expires_at TIMESTAMP NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()

def create_user(email):
    """Create a new user if they don't exist."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    try:
        c.execute('INSERT OR IGNORE INTO users (email) VALUES (?)', (email,))
        conn.commit()
    except Exception as e:
        print(f"Error creating user: {e}")
    finally:
        conn.close()

def save_otp(email, otp):
    """Save an OTP for an email with 5-minute expiration."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    expires_at = datetime.datetime.now() + datetime.timedelta(minutes=5)
    
    # Upsert OTP (replace if exists)
    c.execute('''
        INSERT OR REPLACE INTO otp_codes (email, otp, expires_at)
        VALUES (?, ?, ?)
    ''', (email, otp, expires_at))
    
    conn.commit()
    conn.close()

def verify_otp(email, user_otp):
    """
    Verify the OTP. 
    Returns True if valid and not expired, False otherwise. 
    Deletes the OTP upon successful verification.
    """
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    c.execute('SELECT otp, expires_at FROM otp_codes WHERE email = ?', (email,))
    row = c.fetchone()
    
    result = False
    if row:
        stored_otp, expires_at_str = row
        # Convert string back to datetime (sqlite stores as string by default, or we can parse)
        try:
            expires_at = datetime.datetime.fromisoformat(expires_at_str)
        except ValueError:
             expires_at = datetime.datetime.strptime(expires_at_str, "%Y-%m-%d %H:%M:%S.%f")

        if datetime.datetime.now() < expires_at and stored_otp == user_otp.strip():
            result = True
            # Consume the OTP
            c.execute('DELETE FROM otp_codes WHERE email = ?', (email,))
            conn.commit()
    
    conn.close()
    return result

import uuid

def create_session(email):
    """Create a session token for the user valid for 30 days."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    token = str(uuid.uuid4())
    expires_at = datetime.datetime.now() + datetime.timedelta(days=30)
    
    c.execute('INSERT INTO sessions (token, email, expires_at) VALUES (?, ?, ?)', (token, email, expires_at))
    conn.commit()
    conn.close()
    return token, expires_at

def get_user_by_session(token):
    """Return email if session is valid, else None."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    c.execute('SELECT email, expires_at FROM sessions WHERE token = ?', (token,))
    row = c.fetchone()
    
    if row:
        email, expires_at_str = row
        try:
            expires_at = datetime.datetime.fromisoformat(expires_at_str)
        except ValueError:
             expires_at = datetime.datetime.strptime(expires_at_str, "%Y-%m-%d %H:%M:%S.%f")
             
        if datetime.datetime.now() < expires_at:
            conn.close()
            return email
            
        # Expired
        c.execute('DELETE FROM sessions WHERE token = ?', (token,))
        conn.commit()
        
    conn.close()
    return None

def delete_session(token):
    """Invalidate a session."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('DELETE FROM sessions WHERE token = ?', (token,))
    conn.commit()
    conn.close()
