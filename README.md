# Guru Communication — Professional Mobile Technology & Repair Center

A production-ready, dark-tech web portal and digital storefront for **Guru Communication**. Built with glassmorphic UI elements, electric cyan/purple/orange glow lighting, responsive mobile drawers, and instant WhatsApp ordering.

---

## 🚀 Instant Deployment to GitHub & GitHub Pages

### Option 1: Automatic GitHub Actions (Recommended)
This repository includes a ready-to-use GitHub Actions workflow at `.github/workflows/deploy.yml`.

1. **Create a new repository** on [GitHub](https://github.com/new) (e.g., `guru-communication`).
2. **Push your code to GitHub**:
   ```bash
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git
   git branch -M main
   git push -u origin main
   ```
3. In your GitHub repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
   - Your site will automatically build and deploy within seconds!

### Option 2: Deploy from Branch (Zero Build Required)
Because all HTML, CSS, JavaScript, and assets use relative paths and CDN libraries, you can deploy directly without any build step:
1. Go to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **Deploy from a branch**.
3. Under **Branch**, select `main` and folder `/ (root)`, then click **Save**.
4. Your site will be live at: `https://<YOUR_USERNAME>.github.io/<YOUR_REPOSITORY>/`

---

## 🛠️ Local Development & Testing

To test the website locally on your computer:

```bash
# Using Python (built-in):
py -3 -m http.server 8080
# Open http://localhost:8080 in your browser
```

Or if you have Node.js installed:
```bash
npm install
npm run dev
```

---

## ⚙️ Centralized Business Configuration

All contact phone numbers, WhatsApp order triggers, operating hours, addresses, services, machinery, spare parts, and accessories are centralized in:

📂 **`config.js`**

To update your business information:
```javascript
window.GURU_CONFIG = {
  businessName: "Guru Communication",
  phone: "+91 70513 83473",
  whatsapp: "917051383473", // Include country code without '+'
  address: "Opp. Punjab National Bank (PNB), Near Bus Stand Market, Ramban, Jammu & Kashmir - 182148",
  openingHours: "Mon - Sat: 10:00 AM - 09:00 PM | Sunday: Closed",
  googleMapsUrl: "https://www.google.com/maps/place/Guru+Communication/@33.2378014,75.2378984,909m/data=!3m2!1e3!4b1!4m6!3m5!1s0x391dc3a435da446b:0x70ff042584d68217!8m2!3d33.2377969!4d75.2404733!16s%2Fg%2F11kn0m6s7y",
  ...
};
```

---

## 📱 Integrated Pages Matrix

- 🏠 **[index.html](file:///c:/Users/mukes/OneDrive/Desktop/GURU%20COMMUNICATION/index.html)** — Master Homepage with preloader, hero visual HUD, trust statistics, 5-stage lab workflow, and before/after display comparison slider.
- 🛠️ **[services.html](file:///c:/Users/mukes/OneDrive/Desktop/GURU%20COMMUNICATION/services.html)** — Detailed catalog of 10 specialized multi-brand mobile repair services.
- 🍎 **[iphone-repair.html](file:///c:/Users/mukes/OneDrive/Desktop/GURU%20COMMUNICATION/iphone-repair.html)** — Specialized Apple iOS hardware, Face ID, True Tone, laser back glass, and sandwich motherboard micro-soldering.
- ⚙️ **[machinery.html](file:///c:/Users/mukes/OneDrive/Desktop/GURU%20COMMUNICATION/machinery.html)** — Industrial YMT laminators, laser glass separators, de-bubblers, and cleanroom lab equipment showroom.
- 🧩 **[spare-parts.html](file:///c:/Users/mukes/OneDrive/Desktop/GURU%20COMMUNICATION/spare-parts.html)** — Tested OLED displays, OEM batteries, BGA chips, and jumper wire with direct WhatsApp ordering (`+91 70513 83473`).
- 🎧 **[accessories.html](file:///c:/Users/mukes/OneDrive/Desktop/GURU%20COMMUNICATION/accessories.html)** — GaN 65W chargers, braided cables, MagSafe armor cases, and curved glass guards with direct WhatsApp ordering.
- 🏢 **[about.html](file:///c:/Users/mukes/OneDrive/Desktop/GURU%20COMMUNICATION/about.html)** — Cleanroom laboratory specs, 25-point quality checklist, and 10+ year engineering heritage.
- 📞 **[contact.html](file:///c:/Users/mukes/OneDrive/Desktop/GURU%20COMMUNICATION/contact.html)** — Interactive enquiry form (formats directly to WhatsApp), direct phone call triggers, and interactive map.

---

## 🔒 Security & Optimization
- Fully relative paths (`./`) compatible with custom domains and GitHub repository sub-paths.
- Includes `.nojekyll` to prevent GitHub Pages from ignoring static assets.
- Responsive mobile menu drawer and floating WhatsApp quick-contact widget across all 8 pages.

---

© 2026 **Guru Communication**. All Rights Reserved.
