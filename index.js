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

    await page.screenshot({ path: "result/1.png", fullPage: true });
    // Tunggu elemen form muncul
    await page.waitForSelector("input#nickname", {
      visible: true,
      timeout: 10000,
    });

    console.log("Mengisi form...");
    await page.type("input#nickname", gamertag, { delay: 50 });
    await page.screenshot({ path: "result/2.png", fullPage: true });

    await page.evaluate(() => document.activeElement.blur());
    await page.click("input#accept");
    await page.screenshot({ path: "result/3.png", fullPage: true });

    // Tunggu redirect atau proses selesai
    await delay(3000);
    await page.screenshot({ path: "result/4.png", fullPage: true });
  } catch (err) {
    console.error("Gagal melakukan voting:", err.message);
    // Klik tombol "Vote" yang href-nya `javascript:document.voteform.submit()`
    // const anchors = await page.$$("a");
    // for (const anchor of anchors) {
    //   const text = await page.evaluate((el) => el.innerText, anchor);
    //   if (text.trim() === "Vote") {
    //     await anchor.click();
    //     console.log("Vote button clicked!");
    //     break;
    //   }
    // }
  } finally {
    await browser.close();
  }
})();

async function delay(time) {
  return await new Promise(async (resolve) => setTimeout(resolve, time));
}
