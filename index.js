const puppeteer = require("puppeteer");
const fs = require("fs");

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--disable-setuid-sandbox"],
    ignoreHTTPSErrors: true
  });
  const maxPage = 3;
  let currentPage = 1;
  const page = await browser.newPage();
  const url = page => `https://...?page=${currentPage}`;
  await page.goto(url(currentPage));
  await page.type("#email", "");
  await page.type("#user_password", "");
  await page.click('input[name="submit"]');
  await page.waitForNavigation();

  while (currentPage < maxPage) {
    await page.goto(url(currentPage));
    const table = await page.evaluate(() => {
      var t = document.querySelector("table");
      return t.outerHTML;
    });
    fs.writeFileSync(`page-${currentPage}.html`, table, "utf-8");
    currentPage++;
  }
  await page.close();
  await browser.close();
}

main().catch(console.error);
