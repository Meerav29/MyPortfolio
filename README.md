# Meerav Portfolio (Next.js + Tailwind)

A sleek, minimal one-page portfolio using Next.js (App Router), Tailwind CSS, framer-motion, and lucide-react.

## 🚀 Quickstart

```bash
# 1) Install deps
npm install

# 2) Run locally
npm run dev

# 3) Build & start
npm run build && npm start
```

Visit http://localhost:3000

## 🧰 Tech
- Next.js 14 (app router)
- Tailwind CSS 3
- framer-motion
- lucide-react icons

## 🗂 Structure
```
app/
  layout.tsx     # Root layout + metadata
  page.tsx       # Landing page
  globals.css    # Tailwind styles
public/
  resume.pdf     # Your resume (replace as needed)
```

## 🔧 Customization
- Update links, projects, and experience in `app/page.tsx`.
- Replace `public/resume.pdf` with your own file.
- Colors are blue/black/white with lots of whitespace.

## ☁️ Deploy (Vercel)
1. Push to GitHub.
2. Import the repo at https://vercel.com/new.
3. Framework preset: **Next.js** (defaults are fine).
4. Deploy. That’s it.

## 📝 Notes
- If you prefer a contact form, hook it up with Formspree/Resend and add an API route.
- Dark mode toggle can be added with `next-themes` later if you want.
