> **AI Disclaimer:** This README and all code in this repository were generated with the assistance of AI (Claude).

# Chat Navigator

A Chrome extension that adds a sidebar to LLM chat websites, showing a scrollable list of your questions. Click any question to scroll directly to it in the conversation.

Currently supported platforms:
- Claude (claude.ai)
- ChatGPT (chatgpt.com)

## Install

1. Clone or download this repository
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode** (toggle in the top right)
4. Click **Load unpacked** and select the `claude-ui-extension` folder

## Settings

Click the extension icon in the Chrome toolbar to open the settings popup. You can configure:

- **Sidebar width** — any CSS width value (e.g. `15vw`, `300px`, `20%`)
- **Max display length** — the character limit before a question gets truncated in the sidebar
- **Smooth scrolling** — when checked (default), clicking a question animates the scroll. When unchecked, it jumps instantly.

Settings are saved automatically and apply immediately without a page reload.

## Adding a new provider

To add support for a new chat platform:

### 1. Create a provider file

Create a new file in `providers/` (e.g. `providers/gemini.js`). Register a provider object with these functions:

```js
window.__chatNavProviders = window.__chatNavProviders || {};

window.__chatNavProviders.gemini = {
  name: 'Gemini',

  // Required: Returns the DOM element to watch for new messages.
  // Also serves as the readiness signal — the extension waits
  // until this returns a non-null value before setting up.
  getObserveTarget() {
    return document.querySelector('.chat-container');
  },

  // Required: Returns a list of DOM elements corresponding to
  // the user's chat messages.
  getUserMessages() {
    return document.querySelectorAll('.user-message');
  },

  // Required: Given a user message element from above,
  // extract and return the text content.
  getMessageText(element) {
    return element.innerText;
  },

  // Optional: Returns the height in pixels of any fixed header,
  // so scrolling positions messages below it instead of behind it.
  // If omitted, defaults to 0.
  getScrollOffset() {
    const header = document.querySelector('header');
    return header ? header.getBoundingClientRect().height : 0;
  },

  // Optional: Returns a CSS background color for the sidebar.
  // If omitted or returns null, falls back to the default in sidebar.css.
  getBackgroundColor() {
    return null;
  },
};
```

### 2. Add a content script entry in manifest.json

```json
{
  "matches": ["https://gemini.google.com/*"],
  "js": ["providers/gemini.js", "core.js"],
  "css": ["styles/sidebar.css"],
  "run_at": "document_idle"
}
```

### 3. Register the hostname in core.js

Add a mapping in the `getProvider()` function:

```js
if (hostname.includes('gemini.google.com')) return providers.gemini;
```
