import requests
from app.config import settings


def send_via_webhook(recipient: str, subject: str, body: str):
    if not settings.make_webhook_url:
        return
    try:
        requests.post(settings.make_webhook_url, data={"recipient": recipient, "subject": subject, "body": body}, timeout=5)
    except Exception:
        pass


def send_booking_confirmation(client_email: str, client_name: str, service: str, date: str, time: str, status: str):
    body = f"""
<html><body style="font-family:Arial,sans-serif;color:#333;">
<div style="max-width:600px;margin:auto;border:1px solid #e0e0e0;padding:20px;border-radius:10px;">
  <h2 style="color:#4CAF50;text-align:center;">Appointment Confirmation</h2>
  <p>Dear {client_name},</p>
  <p>Your appointment is confirmed:</p>
  <table style="width:100%;border-collapse:collapse;margin:20px 0;">
    <tr><td style="padding:10px;border:1px solid #e0e0e0;"><strong>Service:</strong></td><td style="padding:10px;border:1px solid #e0e0e0;">{service}</td></tr>
    <tr><td style="padding:10px;border:1px solid #e0e0e0;"><strong>Date & Time:</strong></td><td style="padding:10px;border:1px solid #e0e0e0;">{date} at {time}</td></tr>
    <tr><td style="padding:10px;border:1px solid #e0e0e0;"><strong>Status:</strong></td><td style="padding:10px;border:1px solid #e0e0e0;">{status}</td></tr>
  </table>
  <p>Questions? Email <a href="mailto:customerservice@marynassifchbat.com">customerservice@marynassifchbat.com</a></p>
  <p style="text-align:center;color:#888;">&copy; 2024 Beauty Clinic</p>
</div></body></html>"""
    send_via_webhook(client_email, "Booking Confirmed", body)


def send_cancellation(client_email: str, client_name: str, service: str, date: str, time: str):
    body = f"""
<html><body style="font-family:Arial,sans-serif;color:#333;">
<div style="max-width:600px;margin:auto;border:1px solid #e0e0e0;padding:20px;border-radius:10px;">
  <h2 style="color:#FF4500;text-align:center;">Appointment Cancelled</h2>
  <p>Dear {client_name},</p>
  <p>Your appointment has been cancelled:</p>
  <table style="width:100%;border-collapse:collapse;margin:20px 0;">
    <tr><td style="padding:10px;border:1px solid #e0e0e0;"><strong>Service:</strong></td><td style="padding:10px;border:1px solid #e0e0e0;">{service}</td></tr>
    <tr><td style="padding:10px;border:1px solid #e0e0e0;"><strong>Date & Time:</strong></td><td style="padding:10px;border:1px solid #e0e0e0;">{date} at {time}</td></tr>
  </table>
  <p>To rebook, visit our website or contact us at <a href="mailto:customerservice@marynassifchbat.com">customerservice@marynassifchbat.com</a>.</p>
  <p style="text-align:center;color:#888;">&copy; 2024 Beauty Clinic</p>
</div></body></html>"""
    send_via_webhook(client_email, "Appointment Cancelled", body)


def send_welcome(client_email: str, client_name: str):
    body = f"""
<html><body style="font-family:Arial,sans-serif;color:#333;">
<div style="max-width:600px;margin:auto;border:1px solid #e0e0e0;padding:20px;border-radius:10px;">
  <div style="text-align:center;">
    <img src="https://i.ibb.co/4VJdTrJ/logo.png" alt="Clinic Logo" style="max-width:150px;">
    <h1>Welcome to Mary Nassif Chbat Beauty Clinic</h1>
  </div>
  <p>Dear {client_name},</p>
  <p>Thank you for joining us. We look forward to serving you!</p>
  <p><strong>Contact:</strong> customerservice@marynassifchbat.com | +961 3 799 407</p>
  <p style="text-align:center;color:#888;">&copy; 2024 Beauty Clinic</p>
</div></body></html>"""
    send_via_webhook(client_email, "Welcome to Beauty Clinic", body)
