import streamlit as st
import os
import utils.firebase_utils as firebase
from views import dashboard
import firebase_config

# Set page configuration ONCE here
st.set_page_config(
    page_title="Chameleon Stream",
    page_icon="🦎",
    layout="wide"
)

# Initialize Firebase (Server-side)
if not firebase.init_firebase():
    st.error("Firebase Initialization Failed! Check logs & serviceAccountKey.json.")

# Initialize session state for auth
if 'authenticated' not in st.session_state:
    st.session_state.authenticated = False
if 'user_email' not in st.session_state:
    st.session_state.user_email = None

import utils.email_otp as otp_service
import extra_streamlit_components as stx
import datetime

# Initialize Cookie Manager
cookie_manager = stx.CookieManager()

def login_page():
    st.title("🦎 Chameleon Stream: Login")
    st.markdown("Please verify your email to access the tool.")

    # Check for missing config
    if firebase_config.FIREBASE_CONFIG["apiKey"] == "YOUR_API_KEY":
        st.warning("⚠️ **Firebase Web Config Missing!**")
        st.info("Please open `firebase_config.py` and paste your Firebase settings.")
        return

    # Check for missing Service Account
    if not os.path.exists("serviceAccountKey.json"):
        st.warning("⚠️ **Firebase Service Account Missing!**")
        st.info("Please save your `serviceAccountKey.json` in the project root.")
        return

    if 'otp_sent' not in st.session_state:
        st.session_state.otp_sent = False

    if not st.session_state.otp_sent:
        # Step 1: Email Input
        with st.form("email_form"):
            email = st.text_input("Enter your Email Address")
            submitted = st.form_submit_button("Send OTP")
            
            if submitted and email:
                if "@" not in email:
                    st.error("Please enter a valid email address.")
                else:
                    # 1. Generate OTP
                    otp_code = otp_service.generate_otp()
                    
                    # 2. Send via SMTP
                    success, msg = otp_service.send_otp_email(email, otp_code)
                    
                    if success:
                        st.session_state.otp_sent = True
                        st.session_state.temp_email = email
                        st.session_state.temp_otp = otp_code # Store securely in session
                        st.success(f"OTP sent to {email}!")
                        st.rerun()
                    else:
                        st.error(f"Error sending OTP: {msg}")
    else:
        # Step 2: OTP Verification
        st.info(f"OTP sent to {st.session_state.temp_email}")
        
        with st.form("otp_form"):
            otp_input = st.text_input("Enter the 6-digit OTP")
            verify = st.form_submit_button("Verify & Login")
            
            if verify and otp_input:
                # 1. Verify OTP
                if otp_input.strip() == st.session_state.temp_otp:
                    email = st.session_state.temp_email
                    
                    with st.spinner("Verifying with Firebase..."):
                        # 2. Get/Create User in Firebase
                        try:
                            user = firebase.get_or_create_user(email)
                            
                            # 3. Mint Custom Token
                            custom_token = firebase.mint_custom_token(user.uid)
                            
                            if custom_token:
                                st.session_state.authenticated = True
                                st.session_state.user_email = email
                                st.session_state.custom_token = custom_token # Pass to JS
                                
                                # Set Persistent Cookie (30 Days)
                                cookie_manager.set("user_email", email, expires_at=datetime.datetime.now() + datetime.timedelta(days=30))
                                
                                # Clear temp
                                del st.session_state.otp_sent
                                del st.session_state.temp_email
                                del st.session_state.temp_otp
                                
                                st.success("Verification Successful! Logging in...")
                                st.rerun()
                            else:
                                st.error("Failed to generate Firebase Token.")
                                
                        except Exception as e:
                            st.error(f"Firebase Error: {e}")
                else:
                    st.error("Invalid OTP. Please try again.")

        if st.button("Resend OTP / Change Email"):
            st.session_state.otp_sent = False
            del st.session_state.temp_otp
            st.rerun()

# Client-Side Auto-Login Helper
def client_side_auth_sync():
    # If we have a custom token to consume (just logged in)
    if 'custom_token' in st.session_state and st.session_state.custom_token:
        # Inject JS to sign in
        firebase_config_json = str(firebase_config.FIREBASE_CONFIG).replace("'", '"')
        js_code = f"""
        <script type="module">
          import {{ initializeApp }} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
          import {{ getAuth, signInWithCustomToken }} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

          const firebaseConfig = {firebase_config_json};
          const app = initializeApp(firebaseConfig);
          const auth = getAuth(app);

          const token = "{st.session_state.custom_token}";
          
          signInWithCustomToken(auth, token)
            .then((userCredential) => {{
              console.log("Signed in as: " + userCredential.user.email);
            }})
            .catch((error) => {{
              console.error("Error signing in", error);
            }});
        </script>
        """
        st.components.v1.html(js_code, height=0, width=0)
        # Clear token so we don't re-run JS every refresh
        st.session_state.custom_token = None

def main():
    # Check for Cookie Persistence
    # Skip cookie check if we just requested a logout
    if not st.session_state.authenticated and not st.session_state.get('logging_out', False):
        cached_email = cookie_manager.get(cookie="user_email")
        if cached_email:
            st.session_state.authenticated = True
            st.session_state.user_email = cached_email

    # Reset logout flag if it was set
    if st.session_state.get('logging_out', False):
        st.session_state.logging_out = False

    # Run the client-side sync if needed
    client_side_auth_sync()

    if not st.session_state.authenticated:
        login_page()
    else:
        # Logout Logic
        with st.sidebar:
            st.markdown("---")
            st.write(f"Logged in as: {st.session_state.user_email}")
            if st.button("Logout", type="secondary"):
                st.session_state.authenticated = False
                st.session_state.user_email = None
                st.session_state.logging_out = True
                cookie_manager.delete("user_email")
                # Do NOT rerun immediately. Let the component execute the delete JS.
                # The script will continue, show the Login Page (since auth is False), and then stop.
                # Adding a small hint for user feedback
                st.info("Logging out...")

        dashboard.show_dashboard()

if __name__ == "__main__":
    main()
