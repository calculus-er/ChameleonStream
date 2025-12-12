import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random
import string
import os


def generate_otp(length=6):
    """Generate a random numeric OTP."""
    return "".join(random.choices(string.digits, k=length))


def send_otp_email(to_email, otp):
    """
    Send OTP to the user via SMTP.
    Returns (bool, message).
    """
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = os.getenv("SMTP_PORT", 587)
    smtp_email = os.getenv("SMTP_EMAIL")
    smtp_password = os.getenv("SMTP_PASSWORD")

    # Mock Mode
    if not (smtp_server and smtp_email and smtp_password):
        print("f" + "-" * 50)
        print(f" [MOCK EMAIL] To: {to_email} | OTP: {otp}")
        print("f" + "-" * 50)
        return True, "Mock email sent (check console)"

    try:
        msg = MIMEMultipart()
        msg["From"] = smtp_email
        msg["To"] = to_email
        msg["Subject"] = "Your Login OTP"

        body = f"Hello,\n\nYour One-Time Password (OTP) is: {otp}\n\nThis code expires in 5 minutes.\n\nBest,\nChameleon Stream Team"
        msg.attach(MIMEText(body, "plain"))

        server = smtplib.SMTP(smtp_server, int(smtp_port))
        server.starttls()
        server.login(smtp_email, smtp_password)
        text = msg.as_string()
        server.sendmail(smtp_email, to_email, text)
        server.quit()
        return True, "Email sent successfully"
    except smtplib.SMTPAuthenticationError:
        return False, "SMTP Authentication failed. Check your email/password."
    except smtplib.SMTPConnectError:
        return False, "Could not connect to SMTP server."
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False, f"Failed to send email: {str(e)}"
