import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });
await page.goto('https://3000-i3n8krpk8wqxh454z3om1-37ba6fd8.manus-asia.computer', {
  waitUntil: 'networkidle2'
});

// S4セクションまでスクロール
await page.evaluate(() => {
  const heading = Array.from(document.querySelectorAll('h2')).find(
    h => h.textContent.includes('実際の世界線は')
  );
  if (heading) {
    heading.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
});

await page.waitForTimeout(1000);
await page.screenshot({ path: '/home/ubuntu/s4_section.png', fullPage: false });

await browser.close();
console.log('Screenshot saved to /home/ubuntu/s4_section.png');
