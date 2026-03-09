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
   - **actionItems**: array of { **id**, **text**, **meetingId**, **meetingTitle** (optional), **owner** (optional), **due** (optional), **status** (optional: "open" or "done"), **detail** (optional: 1–2 sentences of context from the meeting note) }
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

**Display rules (apply every time):** The dashboard app applies the same logic every time it loads, no matter when you last updated the data. So whenever you refresh from Granola and reload the page, you get: **Action items** — only from the past two weeks; **Decisions** — only from the past 7 days, up to 10 shown (newest first; no per-day cap so a busy day can show many). Decision note dates use the meeting date when available. You don’t need to do anything extra for these rules; they run automatically on whatever is in `meetings.json`.

No need to copy/paste JSON yourself when you use this flow. When refreshing, you can also ask for a short "detail" (1–2 sentences of context from the meeting) for each action item so the dashboard shows it when you click an item. You can run it whenever you’ve added new meetings to Granola.

### How the dashboard “analyzes” Granola (transcript vs summary)

The dashboard **does not call or analyze Granola** at runtime. It only reads **`public/data/meetings.json`**. Whatever appears on the dashboard is exactly what was written into that file.

What goes into `meetings.json` is controlled by the **refresh step in Cursor** (with Granola MCP). Typically that uses Granola’s **notes/summary** (the summary Granola creates for each meeting). So by default you’re seeing **the notes summary Granola creates**, not the full transcript.

**Full transcripts:** Granola’s MCP exposes a **`get_meeting_transcript`** tool that returns the **raw verbatim transcript** for a meeting (by meeting ID). That tool is **only available on paid Granola tiers** (not Basic/Free). If you’re on a paid plan, when you ask Cursor to refresh the dashboard you can say: *“Use `get_meeting_transcript` for each meeting and extract all action items and decisions from the full transcript.”* That can surface more items than the notes summary alone. Otherwise the refresh uses **notes/summary** (and tools like `get_meetings` or `query_granola_meetings`).

**Refresh using full transcripts (recommended for richer data):** The dashboard data has been enriched once using full transcripts: for each CKGSB meeting, the AI called **`get_meeting_transcript`**, read the verbatim text, and extracted additional action items and decisions that weren’t in the notes summary. To do this again in future, in Cursor (with Granola MCP connected) ask: *“Refresh the CKGSB dashboard using full transcripts: for each meeting in public/data/meetings.json, call get_meeting_transcript, then extract every action item and decision from the transcript and merge them into meetings.json (CKGSB/work meetings only).”* You’ll get more granular follow-ups (e.g. “Ask MediaMinds how to lower cost per click”, “Prepare summary for Flo on the two POs”) that the summary alone often misses.

### Outlook emails (action items and decisions)

The dashboard can show **action items and decisions extracted from Outlook emails** alongside Granola meeting data. Items from email are labelled **“Email”**; items from meeting notes are labelled **“Meeting”**.

- **Data source:** The app loads **`public/data/meetings.json`** and, if present, **`public/data/outlook.json`**. The two are merged: `outlook.json` contains only `actionItems` and `decisions` (each with `source: "outlook"`, `meetingId: "outlook"`, `meetingTitle` from the email subject, and a `date` in YYYY-MM-DD). Same display rules apply (e.g. action items from the past two weeks, decisions from the past week).
- **How to populate outlook.json:**  
  1. Connect **Microsoft Outlook** to the **Zapier MCP** in Cursor (use the Zapier MCP configuration URL to add a “find email” or “search email” action for Outlook).  
  2. In Cursor, ask: *“Refresh the CKGSB dashboard including Outlook emails.”*  
  3. The AI will call Zapier to fetch recent or flagged emails, use AI to decide which emails contain real action items or decisions, extract them (one or more per email), assign **owners** (Joseph, Julie, Team, etc.) from context, and write **`public/data/outlook.json`**. Only emails that clearly contain tasks or decisions are added.

- **Team vs single mailbox:** Right now the AI only has access to **the Outlook account connected to Zapier** (e.g. yours). So we analyze *that* mailbox and extract tasks and decisions from it. When extracting, we assign **owners** (Joseph, Julie, Team, Joseph & Julie, etc.) so the dashboard shows who’s responsible for each item—so the *tasks* apply to the whole team even though the *emails* are from one inbox. To include emails from other team members, they would need to connect their Outlook to the same Zapier MCP (or you’d use a shared team mailbox if you have one).

If `outlook.json` is missing or empty, the dashboard works as before with only Granola data.

## Deploy with Vercel or Netlify

Connect the GitHub repo so every push deploys automatically. Your repo is already at [github.com/Jduckworp/ckgsb-team-dashboard](https://github.com/Jduckworp/ckgsb-team-dashboard).

### Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (use **Continue with GitHub**).
2. Click **Add New…** → **Project**.
3. **Import** the `Jduckworp/ckgsb-team-dashboard` repo (search or pick it from the list).
4. Leave the defaults, but confirm:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **Deploy**. In about a minute you’ll get a URL like `ckgsb-team-dashboard.vercel.app`.
6. **Later:** When you update `public/data/meetings.json` and push to `main`, Vercel will redeploy automatically.

### Netlify

1. Go to [netlify.com](https://netlify.com) and sign in (use **Sign up with GitHub** or **Log in with GitHub**).
2. Click **Add new site** → **Import an existing project**.
3. Choose **GitHub** and authorize Netlify if asked.
4. Select the **Jduckworp/ckgsb-team-dashboard** repository.
5. Set:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Base directory:** (leave empty)
6. Click **Deploy site**. You’ll get a URL like `something-random.netlify.app` (you can change it in Site settings → Domain management).
7. **Later:** Pushing to `main` (including updates to `public/data/meetings.json`) triggers a new deploy.

---

## Sharing with your team

To let teammates view the dashboard (without running it locally), deploy it so everyone can open one URL.

### 1. Deploy the app

The dashboard is a static site: after `npm run build`, the `dist/` folder contains everything. Use **Vercel** or **Netlify** (steps above), or any static host.

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
