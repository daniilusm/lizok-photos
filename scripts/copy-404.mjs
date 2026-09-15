import { existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * With trailingSlash: true Next exports the real page at out/404/index.html.
 *
 * Shared hosts usually look for out/404.html as the not-found document and
 * may serve it while keeping the broken URL — that breaks Next hydration.
 * Write a tiny stub that always sends the browser to /404/.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = join(root, "out", "404", "index.html");
const stub = join(root, "out", "404.html");

if (!existsSync(page)) {
  console.error(`[copy-404] missing ${page}`);
  process.exit(1);
}

writeFileSync(
  stub,
  `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8"/>
  <meta http-equiv="refresh" content="0; url=/404/"/>
  <link rel="canonical" href="/404/"/>
  <title>Страница не найдена</title>
  <script>location.replace("/404/");</script>
</head>
<body>
  <p><a href="/404/">Страница не найдена — перейти</a></p>
</body>
</html>
`,
);

console.log("[copy-404] wrote out/404.html → redirect stub to /404/");
