# CKGSB Team Dashboard

A single-page dashboard that shows what’s going on for your team using your Granola meeting notes: summary, recent meetings, action items, decisions, and key topics.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Load your meeting data from Granola

The dashboard reads from **`public/data/meetings.json`**. You can fill it in two ways.

### Option 1: Use Cursor + Granola MCP (recommended)

1. In Cursor, make sure **Granola MCP** is connected (Settings → Tools & MCP).
2. In a **new chat**, ask:

   **“Using Granola, list my recent meetings and for each meeting give: title, date, attendees, a short summary, and any action items and decisions. Also give a short paragraph summarizing what’s going on for the team right now and the main topics. Format the reply as a single JSON object with this exact shape:**
   - **lastUpdated**: today’s date (YYYY-MM-DD)
   - **summary**: string (the paragraph)
   - **meetings**: array of { **id**, **title**, **date**, **attendees** (array), **summary** (optional) }
   - **actionItems**: array of { **id**, **text**, **meetingId**, **meetingTitle** (optional), **owner** (optional), **due** (optional), **status** (optional: "open" or "done") }
   - **decisions**: array of { **id**, **text**, **meetingId**, **meetingTitle** (optional), **date** (optional) }
   - **topics**: array of { **name**, **meetingIds** (array), **summary** (optional) }
   **Use simple string ids (e.g. "1", "2") and only valid JSON.”**

3. Copy the JSON from the reply and paste it into **`public/data/meetings.json`** (replace the entire file content).
4. Refresh the dashboard in the browser.

### Option 2: Edit the JSON by hand

Edit **`public/data/meetings.json`** to match the shape above. See **`src/types.ts`** for the TypeScript types.

## Updating the dashboard (when you add new notes to Granola)

Whenever you upload new meeting notes to Granola and want the dashboard to reflect them:

1. **Open this project in Cursor** and start a chat (or use one where **Granola MCP** is connected).
2. **Ask to refresh the dashboard**, for example:
   - *“Refresh the CKGSB dashboard from my Granola notes – only include work/CKGSB meetings, not personal.”*
   - or: *“Update public/data/meetings.json with my latest Granola meeting notes, CKGSB work only.”*
3. The AI will call Granola (list meetings + query for action items, decisions, summary), filter out personal meetings, and overwrite **`public/data/meetings.json`**.
4. **Refresh the dashboard** in your browser (or reload the page).

No need to copy/paste JSON yourself when you use this flow. You can run it whenever you’ve added new meetings to Granola.

## Sharing with your team

To let teammates view the dashboard (without running it locally), deploy it so everyone can open one URL.

### 1. Deploy the app

The dashboard is a static site: after `npm run build`, the `dist/` folder contains everything. Deploy that folder to any static host.

**Vercel (good default)**  
- Push the project to GitHub, then go to [vercel.com](https://vercel.com) → Import your repo.  
- Build command: `npm run build`  
- Output directory: `dist`  
- Deploy. Teammates use the URL Vercel gives you (e.g. `ckgsb-dashboard.vercel.app`).

**Netlify**  
- Push to GitHub, then [netlify.com](https://netlify.com) → Add new site → Import from Git.  
- Build command: `npm run build`  
- Publish directory: `dist`

**GitHub Pages**  
- In the repo: Settings → Pages → Source: GitHub Actions (or deploy the `dist/` folder via a workflow).  
- The site will be at `https://<username>.github.io/<repo>/`.

**Internal / intranet**  
- Run `npm run build` and upload the contents of `dist/` to your internal web server or SharePoint so only your team can reach it.

### 2. How teammates see updates

The dashboard shows whatever is in **`public/data/meetings.json`** at the time of the build. So:

1. You **refresh the data** (e.g. in Cursor: “Refresh the CKGSB dashboard from my Granola notes – work only”).  
2. You **redeploy** so the new JSON is live:  
   - **Vercel/Netlify:** push your changes to GitHub (including the updated `public/data/meetings.json`); they’ll rebuild and deploy.  
   - **Manual:** run `npm run build` again and re-upload `dist/` (including `dist/data/meetings.json`).

Teammates just open the same URL; they always see the latest deployment.

### 3. Restricting who can see it

- **Unlisted:** Don’t link the URL anywhere public; share it only with your team (e.g. in Slack or email).  
- **Vercel/Netlify:** Use their password protection or “invite-only” options if you have a paid plan.  
- **Intranet:** Host it on an internal server so only people on your network (or VPN) can access it.

---

## Build for production

```bash
npm run build
npm run preview
```

Built files are in `dist/`. Serve `dist/` with any static host; the app loads `/data/meetings.json` at runtime, so you can update that file without rebuilding.
