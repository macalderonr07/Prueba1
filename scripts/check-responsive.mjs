// Verifica diseño adaptativo/responsivo: meta viewport presente y sin
// desbordamiento horizontal en distintos anchos de pantalla (mobile -> desktop).
import { chromium } from "playwright";

const url = process.env.TARGET_URL || "http://localhost:8080/index.html";

const viewports = [
  { name: "mobile-s", width: 320, height: 640 },
  { name: "mobile", width: 375, height: 667 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
  { name: "desktop-l", width: 1920, height: 1080 },
];

let hasErrors = false;

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(url, { waitUntil: "networkidle" });

const viewportMeta = await page
  .$eval('meta[name="viewport"]', (el) => el.getAttribute("content"))
  .catch(() => null);

if (!viewportMeta || !viewportMeta.includes("width=device-width")) {
  console.error(
    '✗ Falta <meta name="viewport" content="width=device-width, ...">, requerido para diseño adaptativo.'
  );
  hasErrors = true;
} else {
  console.log(`✓ meta viewport presente: ${viewportMeta}`);
}

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.reload({ waitUntil: "networkidle" });

  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  if (scrollWidth > clientWidth + 1) {
    console.error(
      `✗ Overflow horizontal en ${vp.name} (${vp.width}px): scrollWidth=${scrollWidth} > clientWidth=${clientWidth}`
    );
    hasErrors = true;
  } else {
    console.log(`✓ Sin overflow horizontal en ${vp.name} (${vp.width}px)`);
  }
}

await browser.close();

if (hasErrors) {
  console.error("\nFallaron una o más comprobaciones de diseño responsivo.");
  process.exit(1);
}

console.log("\nTodas las comprobaciones de diseño responsivo pasaron.");
