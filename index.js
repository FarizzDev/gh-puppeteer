const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  const page = await browser.newPage();

  // Tangkap URL dengan content-type "application/octet-stream"
  let realDownloadUrl = null;
  page.on("response", async (response) => {
    const ct = response.headers()["content-type"];
    if (ct && ct.includes("application/octet-stream")) {
      realDownloadUrl = response.url();
    }
  });

  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

  await page.goto(
    "https://www.mediafire.com/file/gflgyhpbh3xnktd/LYNEX+V2+[+FREE+]+@PDLZ.zip/file",
    {
      waitUntil: "networkidle2",
    },
  );

  await page.screenshot({ path: "result/networkidle2.png" });
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await page.waitForSelector("a#downloadButton", { timeout: 10000 });
  await page.screenshot({ path: "result/readytoclick.png", fullPage: true });

  // Ambil nama & ukuran file
  const data = await page.evaluate(() => {
    const name = document.querySelector(".filename")?.textContent.trim();
    const size = document.querySelector(".fileInfo")?.textContent.trim();
    return { name, size };
  });

  console.log({data})

  // Klik tombol download untuk trigger file request
  await page.click("a#downloadButton");
  await page.screenshot({ path: "result/clicked.png", fullPage: true });

  // Tunggu sebentar supaya response ditangkap
  if (typeof page.waitForTimeout === "function") {
    await page.waitForTimeout(3000);
  } else {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  await page.screenshot({ path: "result/afterClick.png", fullPage: true });
  if (realDownloadUrl) {
    console.log({
      name: data.name,
      size: data.size,
      download: realDownloadUrl,
    });
  } else {
    console.log("Gagal deteksi URL file download.");
  }

  await browser.close();
})();
