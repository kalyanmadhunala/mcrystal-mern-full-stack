import { chromium } from "playwright";

export const generateInvoicePdf = async (html, invoiceNo) => {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return pdfBuffer;
};
