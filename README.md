# TeEcclesia Privacy Policy

This repository hosts the official Privacy Policy webpage for the **TeEcclesia** mobile application (St. Mary & St. George Church), designed to comply with Google Play Developer policies.

## Features
- **Bilingual**: Instant toggle between English and Arabic with dedicated RTL / LTR layout and typography (`Inter` & `Cairo` Google Fonts).
- **Google Play Compliant**: Covers all mandatory sections:
  1. Information Collected (Personal Data, Diagnostic Data, Notifications/FCM)
  2. Purpose of Information Usage
  3. Third-party Sharing (Firebase, Legal)
  4. Data Security
  5. Children's Privacy
  6. User Rights & Account Deletion Requests
  7. Policy Modifications
  8. Direct Support Contact
- **Modern & Responsive**: Fast, lightweight static page with interactive navigation pills and responsive mobile-first design.

---

## How to Deploy to GitHub Pages

### 1. Push to GitHub
If you haven't pushed this repository yet:

```bash
cd /Users/joseph/Dev/KMP/ST-Mary-Georgech/Te-Ecclesia-privacy-policy
git remote add origin https://github.com/ST-Mary-Georgech-org/Te-Ecclesia-privacy-policy.git
git branch -M main
git push -u origin main
```

### 2. Enable GitHub Pages
1. Open your repository on GitHub: `https://github.com/ST-Mary-Georgech-org/Te-Ecclesia-privacy-policy`
2. Go to **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: Select `main` and folder `/(root)`
4. Click **Save**.

Within 1–2 minutes, your Privacy Policy will be live at:
> **`https://st-mary-georgech-org.github.io/Te-Ecclesia-privacy-policy/`**

### 3. Add to Google Play Console
1. Log into your [Google Play Console](https://play.google.com/console).
2. Select **TeEcclesia**.
3. In the left menu, scroll down to **Policy and programs** > **App content**.
4. Click **Privacy Policy** and paste:
   `https://st-mary-georgech-org.github.io/Te-Ecclesia-privacy-policy/`
5. Save changes.
