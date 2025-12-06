<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1nx62_rrouy8XMy5r7zzw06tIaPw32t7e

## Run Locally

**Prerequisites:**  Node.js 20+

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app on your network so mobile devices can open it:
   `npm run dev -- --host --port 4173`
4. Open http://localhost:4173 (or your host IP on mobile) to test.

## Run with Docker (no local Node.js required)

If you don't have Node.js available, build and run the bundled image instead:

```bash
# Build the image
DOCKER_BUILDKIT=1 docker build -t hydrologi:local .

# Run and expose the app on port 4173
# (Add --network host on Linux if you prefer host networking)
docker run --rm -p 4173:4173 hydrologi:local
```

Then open http://localhost:4173 (or the host IP on your phone) to load the app offline-ready.

## Offline & installable usage

The app is configured as a Progressive Web App (PWA) so it can be installed to Android/iOS home screens or run as a desktop app:

- Build the production bundle with `npm run build` and serve the `dist` folder (for example with `npm run preview`).
- When you visit the served app, the service worker will cache all static assets and your locally generated icons for offline use.
- Add the app to the home screen (mobile) or install it in the browser menu (desktop). After the first load the UI and saved entries are available without internet access.
