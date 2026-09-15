import { copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * With trailingSlash: true Next exports only out/404/index.html.
 * File-manager / Apache hosts expect out/404.html (+ ErrorDocument in .htaccess).
 */
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "out", "404", "index.html");
const target = join(root, "out", "404.html");

if (!existsSync(source)) {
  console.error(`[copy-404] missing ${source}`);
  process.exit(1);
}

copyFileSync(source, target);
console.log("[copy-404] wrote out/404.html");
