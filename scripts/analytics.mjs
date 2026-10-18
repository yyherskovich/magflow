import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const measurementId = 'G-ZS4E43QH65';
const snippet = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${measurementId}');
</script>`;
const write = process.argv.includes('--write');
const failures = [];
let count = 0;

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || ['node_modules', 'scripts', '_site'].includes(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await visit(path);
    } else if (/\.html?$/i.test(entry.name)) {
      let html = await readFile(path, 'utf8');
      const name = relative(root, path);
      if (!/<head\b[^>]*>/i.test(html)) {
        failures.push(`${name}: missing <head>`);
        continue;
      }
      if (write && !/googletagmanager\.com\/gtag\/js|gtag\s*\(/i.test(html)) {
        const newline = html.includes('\r\n') ? '\r\n' : '\n';
        html = html.replace(/<head\b[^>]*>/i, match => match + newline + snippet.replaceAll('\n', newline));
        await writeFile(path, html);
      }
      const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head\s*>/i)?.[1] || '';
      const loaders = html.match(/<script\b[^>]*src=["']https:\/\/www\.googletagmanager\.com\/gtag\/js\?[^"']+["'][^>]*>/gi) || [];
      const configs = html.match(/gtag\s*\(\s*["']config["']/g) || [];
      if (!head.includes(snippet.replaceAll('\n', html.includes('\r\n') ? '\r\n' : '\n')) || loaders.length !== 1 || configs.length !== 1) {
        failures.push(`${name}: expected exactly one Google tag for ${measurementId} in <head>`);
      }
      count++;
    }
  }
}

await visit(root);
if (failures.length || !count) {
  console.error(failures.join('\n') || 'No HTML pages found.');
  console.error('Run node scripts/analytics.mjs --write to tag new pages.');
  process.exitCode = 1;
} else {
  console.log(`Verified Google Analytics ${measurementId} on all ${count} HTML pages.`);
}
