This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

# Supabase Setup Guide

This guide will walk you through setting up Supabase from creating an account to configuring your first project.

---

## Table of Contents

1. [Create a Supabase Account](#1-create-a-supabase-account)
2. [Set Up a New Project](#2-set-up-a-new-project)
3. [Setup Environment variables for Supabase](#3-setup-environment-variables-for-supabase)

---

### 1. Create a Supabase Account

1. Go to the [Supabase website](https://supabase.com/).
2. Click **Sign Up**.
3. Create an account using your email, GitHub, or other available options.
4. Verify your email address if prompted.

---

### 2. Set Up a New Project

1. After logging in, go to your **Supabase Dashboard**.
2. Click on **New Project**.
3. Fill in the required fields:
   - **Project Name**: Choose a name for your project.
   - **Organization**: If you don’t have an organization, use the default one.
   - **Database Password**: Set a strong password for your PostgreSQL database.
4. Select the **Region** closest to your users.
5. Click **Create New Project**.
6. Wait for Supabase to set up your project, which might take a few minutes.

---


### 3. Setup Environment variables for Supabase
Find `env.example` file in the root directory. Change the filename to from `env.example` to `.env`.

Add the following variables in `.env`:
```
DATABASE_URL=
SUPABASE_KEY=
SUPABASE_URL=
```

You will find the values in the supabase dashboard.

---

With this setup, you’re ready to start building your app with Supabase!