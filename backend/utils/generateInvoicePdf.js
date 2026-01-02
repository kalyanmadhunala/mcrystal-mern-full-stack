import puppeteer from "puppeteer";

export const generateInvoicePdf = async (html, invoiceNo) => {
  const executablePath = puppeteer.executablePath();

  if (!executablePath) {
    throw new Error("Puppeteer executable path not found");
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

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return pdfBuffer;
};
