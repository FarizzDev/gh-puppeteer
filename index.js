const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Tangkap URL dengan content-type "application/octet-stream"
  let realDownloadUrl = null;
  page.on('response', async response => {
    const ct = response.headers()['content-type'];
    if (ct && ct.includes('application/octet-stream')) {
      realDownloadUrl = response.url();
    }
  });

  await page.goto('https://www.mediafire.com/file/gflgyhpbh3xnktd/LYNEX+V2+[+FREE+]+@PDLZ.zip/file', {
    waitUntil: 'networkidle2'
  });

  await page.waitForSelector('a#downloadButton');

  // Ambil nama & ukuran file
  const data = await page.evaluate(() => {
    const name = document.querySelector('.filename')?.textContent.trim();
    const size = document.querySelector('.fileInfo')?.textContent.trim();
    return { name, size };
  });

  // Klik tombol download untuk trigger file request
  await page.click('a#downloadButton');

  // Tunggu sebentar supaya response ditangkap
  await page.waitForTimeout(3000);

  if (realDownloadUrl) {
    console.log({
      name: data.name,
      size: data.size,
      download: realDownloadUrl
    });
  } else {
    console.log('Gagal deteksi URL file download.');
  }

  await browser.close();
})();
