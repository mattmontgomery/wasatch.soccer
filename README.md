# Wasatch.soccer

This is the codebase that currently powers https://www.wasatch.soccer.

If you'd like to run this on your own (and please do!), you'll need the following:

- Backend hosting, which is powered by Strapi. Node 18 required. I am using Heroku.
- Frontend hosting, which is powered by Next.js. Node 18 required. I recommend Vercel.
- Postres database. I'm using bit.io.
- Redis instance. I'm using upstash.com.

Everything is templatized except theme colors and logos, which I'll get around to at some point.
Locations for those changes include:

- /frontend/.env.default > /frontend/.env
- /backend/.env.example > /backend/.env

If you'd like to change theme colors (and you should), that's in one place, too.

- /frontend/src/app/globals.css
