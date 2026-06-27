This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Production Setup

This app is wired for MySQL through Prisma. For HosterPK/cPanel:

1. Create a MySQL database and user in cPanel.
2. Add the user to the database with the required permissions.
3. If the app runs on another host, add that host IP in cPanel Remote MySQL / Remote Database Access.
4. In **Setup Node.js App**, set:

```text
Application root: folder containing this package.json
Application URL: lms.ami.com.pk
Application startup file: server.js
Node.js version: 20.9.0 or newer
```

5. Copy `.env.example` to `.env` and fill in `DATABASE_URL`, `AUTH_SECRET`, and the initial admin credentials.
6. Run:

```bash
npm install
npm run db:push
npm run db:seed
npm run build
npm run start
```

If the site shows `It works!` with a Node.js version, cPanel is still serving its generated sample Node app. Stop the app, confirm the application root points to this project, set the startup file to `server.js`, run `npm install` and `npm run build`, then restart the Node app.

Use Node.js `20.9.0` or newer for Next.js 16.

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

This project is now set up to run directly on Vercel without depending on the HosterPK Node app runner.

1. Push this repository to GitHub.
2. Import the project into Vercel.
3. In Vercel Project Settings > Environment Variables, add:
   - DATABASE_URL
   - AUTH_SECRET
   - ADMIN_USERNAME
   - ADMIN_PASSWORD
   - ADMIN_NAME
   - NODE_ENV=production
4. Deploy the project.

Vercel will use the standard Next.js build and start process automatically.
