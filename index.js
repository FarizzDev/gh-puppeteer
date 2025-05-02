const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const gamertag = "Saiful296"; // ganti dengan nama pemain kamu

(async () => {
  const browser = await puppeteer.launch({
    headless: "new", // bisa true kalau udah yakin
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  );

  try {
    console.log("Mengakses halaman vote...");
    await page.goto("https://minecraftpocket-servers.com/server/130754/vote/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await page.screenshoot({ path: "result/1.png" });
    // Tunggu elemen form muncul
    await page.waitForSelector("input#nickname");

    console.log("Mengisi form...");
    await page.type("#nickname", gamertag, { delay: 50 });
    await page.screenshoot({ path: "result/2.png" });

    await page.click("input#accept");
    await page.screenshoot({ path: "result/3.png" });

    // Klik tombol "Vote" yang href-nya `javascript:document.voteform.submit()`
    const voteButton = await page.$x("//a[contains(text(), 'Vote')]");
    if (voteButton.length > 0) {
      await voteButton[0].click();
      console.log("Tombol vote diklik!");
    } else {
      throw new Error('Tombol "Vote" tidak ditemukan!');
    }

    // Tunggu redirect atau proses selesai
    await page.waitForTimeout(5000);
    await page.screenshoot({ path: "result/4.png" });
  } catch (err) {
    console.error("Gagal melakukan voting:", err.message);
  } finally {
    await browser.close();
  }
})();
