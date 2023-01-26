# Wasatch.soccer

This is the codebase that currently powers https://www.wasatch.soccer.

If you'd like to run this on your own (and please do!), you'll need the following:

- Backend hosting, which is powered by Strapi. Node 18 required. I am using Heroku.
- Frontend hosting, which is powered by Next.js. Node 18 required. I recommend Vercel.
- Postgres database. I'm using bit.io.
- Redis instance. I'm using upstash.com.

Everything is templatized except theme colors, which I'll get around to at some point.
Locations for those changes include:

- /frontend/.env.default > /frontend/.env
- /backend/.env.example > /backend/.env

If you'd like to change theme colors, that's easy, too.

- /frontend/src/app/globals.css
- /frontend/public/\*(png|webmanifest)

Given those constraints above, I'd recommend a fork if you're looking to run this, but I will
be working on making those things a bit simpler to maintain and deploy.

Someday this might evolve into a multi-site architecture. Keep your eyes peeled for that.

## So, I want to run this myself

Here are some things you'll need to get up and running

1. Backend hosting. That's gotta come first. Once that's up and running,
   there's a `siteConfig` single type that will give you options for site name and the like. This includes setting up a Postgres database and a
   Redis instance. You could probably get away without a Redis instance,
   but I've found it's catching a lot of the cached traffic really well. I'd
   highly recommend keeping one so you can reduce load on your backend with
   blocking database calls.

   - That siteConfig is where everything lives EXCEPT for your logo (for now.)
     That includes your site name, your site description, podcast feeds,
     newsletter sign-up links, all that.

2. Frontend hosting. Like I said, I recommend Vercel for this. Their
   edge-caching and automatic static optimization has made all of this
   much easier, and it makes the site very fast to run.

And honestly, that's it. You'll need to figure out domains and nameservers,
but that's outside the purview of this repository.
