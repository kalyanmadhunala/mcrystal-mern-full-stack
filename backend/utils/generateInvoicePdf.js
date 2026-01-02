import { chromium } from "playwright";

export const generateInvoicePdf = async (html, invoiceNo) => {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "40px",
      bottom: "40px",
      left: "20px",
      right: "20px",
    },
  });

  await browser.close();
  return pdfBuffer;
};
