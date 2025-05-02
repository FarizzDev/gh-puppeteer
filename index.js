const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  );

  console.log("Mengakses Tokopedia...");
  await page.goto("https://www.tokopedia.com/search?st=product&q=laptop", {
    waitUntil: "networkidle2",
    timeout: 0,
  });

  await page.screenshot({ path: "result/1.png" });
  await page.waitForSelector("div.css-1asz3by"); // container produk
  await page.screenshot({ path: "result/2.png" });

  const data = await page.evaluate(() => {
    const items = document.querySelectorAll("div.css-1asz3by");
    return Array.from(items).map((el) => {
      const title =
        el.querySelector("div.css-1b6t4dn")?.innerText || "No Title";
      const price = el.querySelector("div.css-rhd610")?.innerText || "No Price";
      return { title, price };
    });
  });

  console.log("Produk ditemukan:", data.slice(0, 5)); // Tampilkan 5 pertama
  await browser.close();
})();
