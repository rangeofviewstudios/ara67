# Ara67 website

Next.js site with four pages (Home, Services, Work, Contact), a booking form, and a content editor.

## Run it

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- Content editor: http://localhost:3000/keystatic

## Editing content

Page text, projects, images, and the contact email are all edited in Keystatic at `/keystatic`. Edits are saved as files in `content/` and `public/images/`.

The editor is switched off on production builds until GitHub editing is set up, because local mode writes directly to disk. **Ara67 cannot edit the live site until these steps are done:**

1. Put the project in a GitHub repository and deploy it.
2. Set `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=owner/repo` in the host's environment variables.
3. Follow [Keystatic's GitHub mode guide](https://keystatic.com/docs/github-mode) to create the GitHub App and add its credentials.

Each saved edit then becomes a commit, and the host redeploys the site.

Motion uses media from three optional editor fields:

- **Home, Hero reel URL:** the looping reel in the dark frame.
- **Project, Preview clip URL:** a short, silent `.mp4` that plays on the project's card and in the Selected work hover preview.
- **Services, Image:** the still shown with each phase on the timeline and in that pillar's column on Home.

The Selected work list on Home shows the first nine projects with **Show on Home** ticked, ordered by **Order**. Each project's **Runtime** appears in that list.

## Motion

All motion uses one set of easings and durations: the tokens at the top of `src/app/globals.css`, plus `src/lib/motion.ts` for JavaScript-driven movement. Change it there rather than per component. Reduced-motion settings and no-JavaScript visitors get the finished state without animation.

## Connecting the booking form

**The form does not deliver requests yet.** A valid submission tells the visitor it was not sent and shows the contact email.

To connect it, send the request from `deliverBooking` in `src/lib/deliver-booking.ts` and return `true` once it has been delivered. The confirmation message then appears automatically. Add rate limiting at the same time, since requests will start triggering real emails or records.

## Search and AI visibility

Each page has its own search title and description, editable in Keystatic. The site also generates structured data, `/sitemap.xml`, `/robots.txt`, and `/llms.txt` from the same content.

**Search engines and AI crawlers are blocked until launch**, so placeholder content cannot be indexed. Two environment variables control this:

- `SITE_INDEXABLE=true` opens the site to crawlers.
- `NEXT_PUBLIC_SITE_URL=https://your-domain` sets the address used in canonical links, the sitemap, and sharing tags. Without it, the site uses its Vercel production address.

Set both in Vercel, then redeploy. Environment variables only apply to new builds.

## Before launch

- Replace `hello@example.com` in Site settings.
- Replace the nine placeholder projects with real work (their clients, years, and runtimes are placeholders too) and add a hero photo or reel. The brief rules out stock images.
- Connect the booking form.
- Add Ara67's official profiles in Site settings.
- Connect the domain, then set `NEXT_PUBLIC_SITE_URL` and `SITE_INDEXABLE=true` and redeploy.
- Add the domain to Google Search Console and submit `/sitemap.xml`.
