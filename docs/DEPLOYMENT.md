# Monetize Connect Deployment Guide

This application is designed for a **Full-Vercel Deployment** (both Frontend and Backend).

## 🚀 Prerequisite: Database & Cache
1.  **Database (Neon PostgreSQL)**:
    - Create a project at [Neon.tech](https://neon.tech).
    - Get your **Pooled Connection String** (Starts with `postgres://...`) - This will be `DATABASE_URL`.
    - Get your **Direct Connection String** (Disable Connection Pooling in Neon UI) - This will be `DIRECT_URL`.
2.  **Cache (Upstash Redis)**:
    - Create a Redis database at [Upstash.com](https://upstash.com).
    - Get your **Redis URL** (Starts with `rediss://...`).

## 📦 Deploy Backend (NestJS) to Vercel
1.  Connect your backend folder repository to Vercel.
2.  Set the Framework Preset to **Other** (since we use a custom serverless handler).
3.  Add the following Environment Variables in Vercel:
    - `DATABASE_URL`: Your Neon Pooled URL.
    - `DIRECT_URL`: Your Neon Direct URL.
    - `REDIS_URL`: Your Upstash Redis URL.
    - `JWT_SECRET`: A long random string.
    - `RAZORPAY_KEY_ID`: Your Razorpay ID.
    - `RAZORPAY_KEY_SECRET`: Your Razorpay Secret.
    - `GROQ_API_KEY`: Your Groq API Key for AI contracts.
4.  **Local Sync & Migration**:
    Before deploying, run:
    ```bash
    npx prisma generate
    npx prisma migrate deploy
    ```

## 🌐 Deploy Frontend (Next.js) to Vercel
1.  Connect your frontend folder repository to Vercel.
2.  Framework Preset: **Next.js**.
3.  Add the following Environment Variables:
    - `NEXT_PUBLIC_API_URL`: The URL of your deployed Vercel backend.
    - `NEXT_PUBLIC_ZEGOCLOUD_APP_ID`: Your ZegoCloud App ID.
    - `NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET`: Your ZegoCloud Server Secret.

## 💳 Razorpay Webhooks
1.  Log in to Razorpay Dashboard -> Webhooks.
2.  Add a new webhook: `https://your-vercel-backend.vercel.app/api/payments/webhook`.
3.  Secret: Use matching `RAZORPAY_WEBHOOK_SECRET` in backend.
4.  Events: `order.paid`, `payment.captured`.

Enjoy your premium SaaS!
