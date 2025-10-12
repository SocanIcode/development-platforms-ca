# Development-platforms-ca

A minimal, responsive frontend app using Supabase for auth (with email confirmation) and a simple `articles` table (RLS-enabled). Built with vanilla JS and Tailwind. It includes authentication(email confirmation), CRUD for articles with images, RLS_enabled Postgree and respinsive UI

# Teach Stack

- Supabase - Auth, Database, Storage
- Supabase JS client
- HTML5 with ES Modueles (vanilla JS)
- CSS (Tailwind via CDN)
- Vite (for hot reload development) or static mode via Live Server

# Features/App

- User authentication with email confirmation
- Create, edit, delete articles (with Supabase RLS)
- Account page to manage personal posts
- Responsive cards
- Moduelar JS (auth, api, ui pages)
- Toast-based feedback for all user actions

Project Structure

```
├── public/
│   ├── articleLogo.png
│   ├── env.js.example
│   └── favicon.ico
├── src/
│   ├── js/
│   │   ├── api/
│   │   │   └── articles.js
│   │   ├── auth/
│   │   │   └── authState.js
│   │   ├── lib/
│   │   │   └── supabaseClient.js
│   │   ├── pages/
│   │   │   └── account.js
│   │   ├── ui/
│   │   │   └── feedback.js
│   │   └── main.js
│   ├── css/
│   │   └── styles.css
│   ├── create.html
│   ├── login.html
│   ├── register.html
│   ├── account.html
│   └── article.html
├── index.html
├── .env.example
├── package.json
└── README.md
```

## Getting Started

### 1) Clone & Install

```bash
get clone https://github.com/SocanIcode/-development-platforms-ca.git
cd <reoi-folder>
npm install
```

### 2 Configure Environment

There are two confirguration opriton to run this code

#### 1 Using Vit (recommended)

cp .env

```
 VITE_SUPABASE_URL: "https://xrwjtpzgdqwgsmampdsv.supabase.co"

 VIRE_SUPABASE_ANON_KEY=    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhyd2p0cHpnZHF3Z3NtYW1wZHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTkxNDEsImV4cCI6MjA3NDk5NTE0MX0.A5Fws4-rb0FNy6iMMqYnoo6KyF6gGL0aV761LtEkZN4"


Then run

npm run dev

```

visit http://localhost:5173/index.html

#### 2 Using static

```
cp public.env.js

use same supase url without vite

then run

npm run dev:static

```

visit http://localhost:5174index.html

# Supabase setUp

### Dase SQL Editor

run the following policies in Supavase SQL edior

- Create articles table

```
create table if not exists articles (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid references auth.users(id) on delete cascade,
  title text not null,
  content text,
  image_url text,
  created_at timestamp with time zone default now()
);

```

- Enable RLS and define policies

```
alter table articles enable row level security;

create policy "Public read"
  on articles for select
  using (true);

create policy "Authenticated insert"
  on articles for insert
  with check (auth.uid() = author_id);

create policy "Owner update/delete"
  on articles for all
  using (auth.uid() = author_id);

```

### Storage (for article images)

-- Storage policies

````

```create policy "Public read for article images"
  `on storage.objects for select
  using (bucket_id = 'article-images');

create policy "Only authenticated upload"
  on storage.objects for insert
  with check (auth.role() = 'authenticated');
````

# Using Flow

1. Register with an email → confirm via Supabase email link.

2. Login to unlock navigation (Create, Logout, Account).

3. Create a new article — upload an optional image.

4. Articles appear on the Home page (all users can read).

5. In your Account page, you can:

- Edit/remove articles
- Delete articles

Logout returns you to the login screen.

UI & Responsiveness

- Tailwind CSS powers styling directly from CDN.

- Cards are: responsive to different screen size

Article content can read in single page view.

# Developer Notes

- Environment variables are loaded from /public/env.js.

- When logged out, only Home, Login, and Register are shown.

- When logged in, Create, Account, and Logout are visible.

- Image uploads use supabase.storage.from("article-images").

- Row Level Security (RLS) ensures each user manages only their own posts

# Future Enhancements

- User profile avatars

- Article comments and likes

- Dark/light theme toggle

# Motivation

I chose the Frontend with Supabase (option 2) path because I wanted to experience how a real backend-as-a-service platform integrates with a custom front-end.
Supabase handles authentication, database, and storage in one system, which allowed me to focus more on user experience and responsive design rather than infrastructure setup.

### What I liked

- The speed of getting authentication and data storage working within minutes.

- How Supabase policies (RLS) automatically enforce secure data access.

- Seeing how modular vanilla JavaScript can scale nicely without frameworks.

### What I didn’t enjoy

- Debugging authentication redirects and environment variables when switching between Vite and static modes somtimes, I encounter problems.

### What I found difficult

- Handling image uploads and public URLs in Supabase Storage (the avatar uploading image still not working, do not know why).

- Making sure environment variables worked both locally and when deployed.

### Supabase vs. Custom API

### Approach Pro Cons

- Supabase Easy setup and buil-in auth, storage, Postgres. limited control over backed and customisation.

-Custome API Full control and customizable endpoints. Requires setting up databases,auth, and api from scratch.

Therefore for this project Supabase is the right choice for me.

# Author

Azeb (FrontEnd student at Noroff) - Part of the project Development Platforms CA
