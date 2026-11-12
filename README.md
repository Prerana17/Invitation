# Prerana & Raunak — Wedding Invitation 💍

A responsive, bilingual (English / Marathi) wedding invitation website for **18 December 2026**, hosted free with GitHub Pages. No build step, dependencies, or backend required.

## Features
- Elegant editorial design with original SVG floral artwork
- Wedding ceremony at **1:00 PM** and reception at **6:00 PM** (India Standard Time)
- Live countdown to the wedding
- Downloadable `.ics` calendar invitations for both events
- Google Maps directions
- Share button (native sharing or copy link)
- Marathi / English text toggle for selected sections
- Mobile-friendly and reduced-motion accessible

## Local preview
Open `index.html` in your browser, or run `python3 -m http.server 8000` inside the folder and visit `http://localhost:8000`.

## Publish on GitHub Pages
1. Sign in to GitHub and create a **public** repository named `prerana-raunak-wedding`. Do **not** initialize it with a README.
2. Unzip this project and open Terminal in the `prerana-raunak-wedding` folder.
3. Run:

```bash
git init
git add .
git commit -m "Create wedding invitation website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/prerana-raunak-wedding.git
git push -u origin main
```

4. In the GitHub repository, open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**, branch **main**, folder **/(root)**, then **Save**.
6. Wait a few minutes. Your invitation will appear at `https://YOUR_USERNAME.github.io/prerana-raunak-wedding/`.
7. Share that link via WhatsApp, email, or QR code.

If Git asks for credentials, use GitHub CLI (`gh auth login`) or configure SSH. GitHub account passwords cannot be used for HTTPS Git operations.

## Customize
- Text, event descriptions, and headings: `index.html`
- Palette, fonts, spacing, layout: `css/style.css`
- Countdown and calendar events: `js/main.js`
- Artwork: `assets/*.svg`
- Calendar files currently use sample end times of **3:00 PM** for the wedding and **8:00 PM** for the reception because the invitations give only start times. Adjust these in `js/main.js` if needed.
- The venue directions use a Google Maps search query; confirm the correct map pin before sending.
- The Marathi toggle translates the principal invitation sections, not every UI label.

## Privacy
This site is public. Do not add private contact numbers, RSVP responses, or personal photographs unless everyone concerned agrees to make them public. This static website does not collect guest data.
