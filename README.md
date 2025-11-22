# ✨ Frontend UI AI Generator

Transform UI ideas into production-ready code in seconds.  
This project uses **AI (KAT-Coder-Pro model via OpenRouter)** to convert a simple text prompt into fully functional **HTML/CSS/JS** components which can be instantly previewed in the browser.

---

## 🚀 Features

- 🎨 Generate clean and responsive UI from plain text prompts
- ⚡ Real-time preview inside the app
- 👨‍💻 Toggle between Preview and Code view
- ⏱️ Built in a hackathon timeframe… somehow
- 🧠 Powered by **Generative AI (OpenRouter)**

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
|------|------------------|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend | API Routes (Next.js) |
| AI Model | KAT-Coder-Pro via OpenRouter |
| Icons | Lucide Icons |
| Code Sandbox | iframe rendering |

---

## 🧩 How It Works

1. User enters a UI description prompt
2. The app sends the text to OpenRouter API
3. AI returns generated component code
4. Code is rendered automatically inside the preview
5. User can switch to “Code” tab to view the source

---

## 📸 Screenshot

> *Replace the link below with your uploaded image on GitHub*

![App Screenshot](./screenshot.png)

*(If you want, rename the image to `screenshot.png` and place it inside the project root or public folder.)*

---

## 🔑 Environment Setup

Create a `.env.local` file:

```bash
OPENROUTER_API_KEY=your_key_here
