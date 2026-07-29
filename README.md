# മീലാദ് ഫെസ്റ്റ് രജിസ്ട്രേഷൻ (Meelad Fest Registration)

A simple, mobile-first program registration site for **ഹയാത്തുൽ ഇസ്‌ലാം ഹയർ സെക്കണ്ടറി മദ്‌റസ**'s Meelad Fest, built with **Next.js 14** and **MongoDB**.

Students/parents fill a 3-step form on their phone → the site automatically works out their category (Kids / Sub Junior / Junior / Senior / Super Senior) from the class they pick, shows only the events that category can enter (and hides girls-only events like Malappattu/Burda unless "പെൺ" is selected), and generates a unique registration number like `MF-2026-0001`. Everything is saved to MongoDB automatically — no manual bookkeeping.

An admin dashboard (password protected) lets fest organizers see live counts per event, search/filter registrations, and download everything as a CSV (opens directly in Excel).

---

## 1. What's automated

- **Category detection** — pick a class (1–2, 3–4, 5–6, 7–9, or 10/+1/+2) and the correct event list appears instantly. This whole mapping lives in one file (`data/categories.js`) so you can edit event names or class groupings in one place and everything updates everywhere.
- **Gender-only events** — Malappattu and Burda are automatically hidden for boys and shown only when "പെൺ" is selected.
- **Registration numbers** — auto-generated and guaranteed unique (`MF-<year>-<sequence>`), no manual numbering needed.
- **Duplicate protection** — the same student (same name + class + phone) can't accidentally register twice.
- **Live stats** — the admin dashboard automatically tallies how many students picked each event, per category, without any manual counting.
- **CSV export** — one click downloads every registration as a spreadsheet.

## 2. Requirements

- [Node.js](https://nodejs.org) 18 or newer
- A MongoDB database — the easiest free option is [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (free tier is enough for this)

## 3. Local setup

```bash
# 1. Install dependencies
npm install

# 2. Create your local environment file
cp .env.example .env.local

# 3. Open .env.local and fill in:
#    MONGODB_URI      -> your MongoDB connection string
#    ADMIN_PASSWORD   -> a password only you know, for /admin
#    SESSION_SECRET   -> any long random string (e.g. from https://randomkeygen.com)

# 4. Start the site
npm run dev
```

Now open:
- **http://localhost:3000** — the registration form (this is what you share with parents/students)
- **http://localhost:3000/admin** — the admin login (this is for organizers only)

## 4. Getting a free MongoDB database (5 minutes)

1. Go to [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Create a free "M0" cluster (any region close to India works fine).
3. Under **Database Access**, create a database user with a username and password.
4. Under **Network Access**, click "Add IP Address" → "Allow access from anywhere" (0.0.0.0/0) — simplest for getting started.
5. Click **Connect → Drivers**, copy the connection string. It looks like:
   `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
6. Paste it into `MONGODB_URI` in your `.env.local`, and add a database name before the `?`, e.g.:
   `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/meelad_fest?retryWrites=true&w=majority`

## 5. Deploying so parents can actually use it

The simplest free option is **Vercel** (made by the creators of Next.js):

1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com), sign in, click **New Project**, and import your repository.
3. In the project's **Settings → Environment Variables**, add the same three variables from your `.env.local` (`MONGODB_URI`, `ADMIN_PASSWORD`, `SESSION_SECRET`).
4. Click **Deploy**. You'll get a link like `https://your-fest.vercel.app` you can share on WhatsApp/notice boards.

## 6. Customizing the event list

Open `data/categories.js`. Every category, its class range, its stage events, and its off-stage events are listed there in plain arrays — add, rename, or remove an event by editing that array. Mark an event `girlsOnly: true` to restrict it the way Malappattu/Burda are restricted. No other file needs to change.

To change the maximum number of off-stage events a student can pick, edit `MAX_OFF_STAGE_SELECTIONS` at the bottom of the same file.

## 7. Project structure

```
app/
  page.js                 → the 3-step registration form (home page)
  success/page.js         → confirmation page shown after registering
  admin/page.js           → admin login
  admin/dashboard/page.js → admin dashboard (stats, search, export)
  api/register/           → saves a new registration
  api/admin/login/        → checks the admin password, sets a session cookie
  api/admin/registrations/→ returns the list + auto-computed counts (protected)
  api/admin/export/       → downloads everything as CSV (protected)
data/categories.js        → single source of truth for classes & events
models/Registration.js    → MongoDB schema + auto-incrementing reg number
lib/mongodb.js            → database connection
lib/session.js            → admin login session handling
components/                → the reusable UI pieces (big tap-friendly buttons, etc.)
middleware.js              → blocks access to the admin dashboard/API without login
```

## 8. Notes / things you may want to add later

- **SMS/WhatsApp confirmation** — not included, but the registration number is shown right after submitting and can be screenshotted.
- **Editing/cancelling a registration** — not included; if a parent makes a mistake, an admin can currently only see it, not edit it in the UI (you'd edit directly in MongoDB, or ask and I can add an edit/delete button to the dashboard).
- **Multiple admin users** — currently there's one shared admin password. Fine for a single madrasa office; let me know if you need per-user logins.
