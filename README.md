# Automated Code Reviewer

Full-stack application that analyzes source code using AI and stores review history.

Features:
- Paste code into Monaco editor and run AI review
- Stores reviews in MongoDB
- Analytics dashboard
- Vercel-ready deployment for frontend and serverless backend

Environment:
1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies: `npm install` at repo root, then `npm install` in `/client` and `/server`.
3. Run dev: `npm run dev` from repo root.

Deployment:
- Deploy to Vercel; environment variables must be set in Vercel dashboard.
