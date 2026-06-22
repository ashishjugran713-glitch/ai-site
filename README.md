# FRACIFY - Anti-Imperonation & Hiring Fraud Prevention

## Deploy to GitHub Pages

### Option 1: Web upload (no git needed)

1. Go to https://github.com and sign in (create an account if needed)
2. Click **+** → **New repository**
3. Name it **ai-site** (or any name you prefer)
4. Leave it **Public** and click **Create repository**
5. On the next page, click **uploading an existing file**
6. Drag all files from `C:\Users\ashish.jugran\Desktop\ai-site` into the upload area
7. Scroll down and click **Commit changes**
8. Go to **Settings** → **Pages**
9. Under **Branch**, select `main` and `/ (root)`, click **Save**
10. Wait 2 minutes — your site is live at `https://<your-username>.github.io/ai-site/`

### Option 2: git CLI (power users)

```bash
cd C:\Users\ashish.jugran\Desktop\ai-site
git init
git add -A
git commit -m "Initial commit"
git remote add origin https://github.com/<your-username>/ai-site.git
git push -u origin main
```

Then enable Pages in repo Settings → Pages → deploy from `main` `/ (root)`.

## SEO

- **Canonical URL** in `index.html` line 12 — update `https://fracify.in` to your actual domain
- **OG image** placeholder at line 17 — replace with a real 1200×630px image
- **Sitemap** at `sitemap.xml` — update domain if custom
- **robots.txt** — update domain if custom

## Custom Domain (optional)

1. Buy a domain (e.g. from Namecheap, Cloudflare, Google Domains)
2. In repo Settings → Pages → enter your domain under **Custom domain**
3. Add a `CNAME` record at your DNS provider pointing to `<your-username>.github.io`

## Submit to Google

1. Go to https://search.google.com/search-console
2. Add your property (domain or URL prefix)
3. Verify ownership (DNS record or HTML file)
4. Submit your sitemap at `https://<your-url>/sitemap.xml`
