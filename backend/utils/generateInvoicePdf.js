import puppeteer from "puppeteer";
import fs from "fs";

export const generateInvoicePdf = async (html, invoiceNo) => {
  // 🔥 Resolve Chrome path explicitly (Render safe)
  const executablePath = puppeteer.executablePath();

  if (!fs.existsSync(executablePath)) {
    throw new Error(`Chrome not found at ${executablePath}`);
  }

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  await page.evaluate((invoiceNo) => {
    document.title = `${invoiceNo} | M Crystal Store`;
  }, invoiceNo);

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return pdfBuffer;
};
