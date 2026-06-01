import { chromium } from "playwright";

export async function playYoutube(query) {
  const browser = await chromium.launch({
    headless: false,
  });

  const page = await browser.newPage();

  await page.goto("https://www.youtube.com");
  await page.fill('input[name="search_query"]', query);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(3000);
  await page.click("ytd-video-renderer a");

  return {
    success: true,
    message: `Playing ${query}`,
  };
}
