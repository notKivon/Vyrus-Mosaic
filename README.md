# Vyrus + Mosaic

Two static marketing websites for a fictional product, made for a school AIML class project ("The Useless Product Launch").

- `vyrus/` is the consumer site for Vyrus, a subscription face mask.
- `mosaic/` is the enterprise site for Mosaic, its sister company.
- `hub/` is the project overview at aiml.11123334.xyz, which introduces both.

Both are plain HTML, CSS and JavaScript with no build step. To preview one locally:

```bash
cd vyrus && python3 -m http.server 8000
```

Then open http://localhost:8000. Each folder is deployed as its own Cloudflare Pages project (root directory `vyrus`, `mosaic` or `hub`).

Build rules, product facts and deploy settings are in `CLAUDE.md`; build progress is in `PROGRESS.md`.

Vyrus and Mosaic are fictional. Made for a school AIML project; nothing here is for sale.
