import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Next static HTML for /not-found/ is correct on first paint, but after
 * hydration the client can replace it with the built-in
 * “This page could not be found” UI.
 *
 * Strip Next/React scripts, keep custom markup, and inject CSS + tiny
 * vanilla JS so entrance + parallax still run without Next hydration.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
// Prefer freshly exported Next HTML (not previously frozen).
const nextExportCandidates = [
  join(root, "out", "not-found", "index.html"),
  join(root, "out", "404", "index.html"),
];
const errorDocument = join(root, "out", "404.html");
const frozenNotFound = join(root, "out", "not-found", "index.html");
const frozen404Index = join(root, "out", "404", "index.html");

const source =
  nextExportCandidates.find((file) => {
    if (!existsSync(file)) return false;
    const sample = readFileSync(file, "utf8");
    return sample.includes("__NEXT_DATA__") || sample.includes("<script");
  }) ?? nextExportCandidates.find((file) => existsSync(file));

if (!source) {
  console.error("[freeze-not-found] missing Next export for not-found/404");
  process.exit(1);
}

let html = readFileSync(source, "utf8");

html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
html = html.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "");

const headBoost = `
<meta name="robots" content="noindex, follow"/>
<style>
  /* freeze: entrance mirrors GSAP timeline on NotFoundPage */
  [class*="not-found-page_meta"] {
    opacity: 0;
    animation: nf-meta 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards;
  }
  [class*="not-found-page_codeInner"] {
    opacity: 0;
    transform: translateY(18%) scale(0.92);
    animation: nf-code 1.15s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards;
  }
  [class*="not-found-page_content"] {
    opacity: 0;
    transform: translateY(28px);
    animation: nf-content 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.45s forwards;
  }
  [class*="not-found-page_actions"] a {
    opacity: 0;
    transform: translateY(16px);
    animation: nf-action 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  [class*="not-found-page_actions"] a:nth-child(1) { animation-delay: 0.7s; }
  [class*="not-found-page_actions"] a:nth-child(2) { animation-delay: 0.78s; }
  [class*="not-found-page_actions"] a:nth-child(3) { animation-delay: 0.86s; }

  [class*="not-found-page_media"],
  [class*="not-found-page_code"] {
    transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform;
  }

  @keyframes nf-meta {
    to { opacity: 0.7; }
  }
  @keyframes nf-code {
    to { opacity: 0.22; transform: translateY(0) scale(1); }
  }
  @keyframes nf-content {
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes nf-action {
    to { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    [class*="not-found-page_meta"],
    [class*="not-found-page_codeInner"],
    [class*="not-found-page_content"],
    [class*="not-found-page_actions"] a {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
    [class*="not-found-page_codeInner"] { opacity: 0.22 !important; }
    [class*="not-found-page_meta"] { opacity: 0.7 !important; }
  }
</style>
`;

const parallaxScript = `
<script>
(function () {
  var root = document.querySelector('[class*="not-found-page_root"]');
  if (!root) return;
  var media = root.querySelector('[class*="not-found-page_media"]');
  var code = root.querySelector('[class*="not-found-page_code"]');
  var px = 0, py = 0, tx = 0, ty = 0, raf = 0;

  function tick() {
    px += (tx - px) * 0.12;
    py += (ty - py) * 0.12;
    if (media) {
      media.style.transform = "translate3d(" + (px * -1.2) + "%," + (py * -1.2) + "%,0)";
    }
    if (code) {
      code.style.transform = "translate3d(calc(-50% + " + (px * 1.8) + "%), calc(-50% + " + (py * 1.4) + "%), 0)";
    }
    raf = requestAnimationFrame(tick);
  }

  root.addEventListener("mousemove", function (e) {
    var r = root.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
  });
  root.addEventListener("mouseleave", function () {
    tx = 0;
    ty = 0;
  });
  raf = requestAnimationFrame(tick);
})();
</script>
`;

if (!html.includes("freeze: entrance mirrors GSAP")) {
  html = html.replace(/<head([^>]*)>/i, `<head$1>${headBoost}`);
}

if (!html.includes("not-found-page_root")) {
  console.warn("[freeze-not-found] root class not found — parallax skipped");
} else if (!html.includes("requestAnimationFrame(tick)")) {
  html = html.replace(/<\/body>/i, `${parallaxScript}</body>`);
}

writeFileSync(frozenNotFound, html);
writeFileSync(frozen404Index, html);
writeFileSync(errorDocument, html);

console.log(
  `[freeze-not-found] source=${source.replace(root + "/", "")} → not-found/, 404/, 404.html (CSS entrance + parallax)`,
);
