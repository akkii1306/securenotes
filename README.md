# 🔐 SecureNotes

**SecureNotes** is a privacy-first, secure note-taking web application that allows users to write, encrypt, and manage their personal notes — all on the client side. Your data is **encrypted before it ever leaves your device**.

---

## 🛡️ Features

- 🔒 End-to-end encryption with AES (CryptoJS)
- 📝 Markdown support (headers, bold, lists, code, etc.)
- 💾 LocalStorage-based saving — works fully offline
- 📱 Mobile-friendly and responsive
- 🧠 Autosave + note search + simple UI
- ⚙️ PWA-ready (installable)

---

## 🚀 Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Encryption**: `crypto-js` (AES)
- **Markdown Renderer**: `react-markdown`
- **Storage**: LocalStorage (browser-side)

---

## 📦 Setup Instructions

```bash
git clone https://github.com/akkii1306/securenotes.git
cd securenotes
npm install
npm run dev
