// src/services/ReportService.js
const puppeteer = require('puppeteer');
const LogService = require('./LogService');
const fs = require('fs');
const path = require('path');

module.exports = {
  async weeklyPdf({ userId = null, days = 7 }) {
    const summary = await LogService.summary({ days, userId });
    const html = `
      <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px }
          table { border-collapse: collapse; width: 100% }
          td, th { border: 1px solid #ccc; padding: 8px }
        </style>
      </head>
      <body>
        <h1>Posture report — last ${summary.days} days</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <table>
          <thead><tr><th>Posture</th><th>Count</th></tr></thead>
          <tbody>
            ${Object.entries(summary.totals).map(([k,v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const outPath = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(outPath)) fs.mkdirSync(outPath);
    const file = path.join(outPath, `posture-report-${Date.now()}.pdf`);
    await page.pdf({ path: file, format: 'A4', printBackground: true });
    await browser.close();
    return file;
  }
};
