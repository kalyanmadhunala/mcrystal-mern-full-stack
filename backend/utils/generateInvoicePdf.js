import puppeteer from "puppeteer";

export const generateInvoicePdf = async (html, invoiceNo) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
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
    displayHeaderFooter: false,
  });

  await browser.close();
  return pdfBuffer;
};
