# Rajput Electronics Service Tracker

Premium React + Vite service tracking and repair management website for Rajput Electronics.

## Features

- Customer tracking by Tracking ID
- Barcode generation for tracking IDs
- Firebase Authentication for staff login
- Firestore service record database
- Admin dashboard with add, edit, delete, search, status updates, technician assignment, hidden internal notes, and customer tracking sync
- Dashboard stats and status timeline
- Responsive dark luxury electronics showroom UI
- Toast notifications and loading states

## Setup

## Folder Structure

```text
src/
  components/        Reusable UI, forms, tables, QR, status widgets
  context/           Firebase Auth provider
  pages/             Customer tracking, admin login, dashboard
  services/          Firestore record APIs
  constants.js       Service categories and status options
  firebase.js        Firebase client setup
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and add your Firebase web app values:

```bash
cp .env.example .env
```

3. In Firebase Console:

- Create a project
- Enable Authentication with Email/Password
- Create a staff user under Authentication
- Create Firestore Database
- Publish the rules from `firestore.rules`

4. Run locally:

```bash
npm run dev
```

Customer site: `http://localhost:5173/`

Admin login: `http://localhost:5173/admin/login`

## Firestore Collection

Collection name: `serviceRecords`

Record fields:

- `trackingId`
- `trackingIdLower`
- `customerName`
- `customerPhone`
- `productName`
- `brand`
- `serviceType`
- `status`
- `technicianName`
- `expectedDate`
- `internalNotes`
- `createdAt`
- `updatedAt`

Customer tracking reads from `publicServiceRecords`, which intentionally excludes `customerPhone` and `internalNotes`.

## Vercel Deployment

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Add all `VITE_FIREBASE_*` environment variables in Vercel Project Settings.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy.

`vercel.json` is included so direct URLs such as `/track/RE-260525-AB12C` and `/admin` work after deployment.

## Production Notes

- Customer tracking reads are public only from `publicServiceRecords`, a safe mirror without internal notes.
- Staff access to full records requires Firebase Authentication.
