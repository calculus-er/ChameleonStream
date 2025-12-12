import firebase_admin
from firebase_admin import credentials, auth
import os
import streamlit as st


def init_firebase():
    """
    Initialize Firebase Admin SDK.
    Uses 'serviceAccountKey.json' if available, otherwise checks for env vars or st.secrets.
    """
    try:
        # Check if already initialized
        firebase_admin.get_app()
        return True
    except ValueError:
        # Not initialized, try to init
        try:
            # 1. Try local file (development)
            cred_path = "serviceAccountKey.json"
            if os.path.exists(cred_path):
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
                return True

            # 2. Try st.secrets (cloud deployment)
            # You would structure secrets like [firebase] -> type, project_id, etc.
            # This is a placeholder for future cloud compatibility

            # 3. Fail gracefully
            print("Warning: serviceAccountKey.json not found.")
            return False

        except Exception as e:
            if "already exists" in str(e):
                return True
            print(f"Firebase init failed: {e}")
            return False
    return True


def verify_token(id_token):
    """
    Verify the ID token sent from the client.
    Returns the decoded token dict if valid, else None.
    """
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        print(f"Token verification failed: {e}")
        return None


def get_or_create_user(email):
    """
    Get existing user by email or create a new one.
    Returns the UserRecord object.
    """
    try:
        user = auth.get_user_by_email(email)
        return user
    except auth.UserNotFoundError:
        # Create user
        user = auth.create_user(email=email)
        return user
    except Exception as e:
        print(f"Firebase user lookup failed: {e}")
        raise e


def mint_custom_token(uid):
    """
    Create a custom token for the given UID.
    This token can be used by the client to sign in.
    """
    try:
        # custom_token is bytes in some sdk versions, str in others.
        # In python sdk it returns bytes usually.
        custom_token = auth.create_custom_token(uid)
        if isinstance(custom_token, bytes):
            return custom_token.decode("utf-8")
        return custom_token
    except Exception as e:
        print(f"Minting custom token failed: {e}")
        return None
