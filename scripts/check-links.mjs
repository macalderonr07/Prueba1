// Verifica seguridad de enlaces/recursos externos:
//  1) Ningún href/src debe cargarse por http:// (contenido mixto inseguro).
//  2) Todo <a target="_blank"> debe incluir rel="noopener" para evitar
//     "reverse tabnabbing" (la pestaña abierta accediendo a window.opener).
import { readFileSync } from "node:fs";

const file = process.argv[2] || "index.html";
const html = readFileSync(file, "utf8");

let hasErrors = false;

const insecureRefs = [
  ...html.matchAll(/\b(?:href|src)\s*=\s*["']http:\/\/[^"']+["']/gi),
];
if (insecureRefs.length > 0) {
  hasErrors = true;
  for (const m of insecureRefs) {
    console.error(`✗ Recurso inseguro (http://) encontrado: ${m[0]}`);
  }
} else {
  console.log("✓ No hay recursos cargados por http:// inseguro");
}

const anchorTags = [...html.matchAll(/<a\b[^>]*>/gi)].map((m) => m[0]);
let blankWithoutNoopener = 0;
for (const tag of anchorTags) {
  const isBlank = /target\s*=\s*["']_blank["']/i.test(tag);
  if (!isBlank) continue;
  const relMatch = tag.match(/rel\s*=\s*["']([^"']*)["']/i);
  const rel = relMatch ? relMatch[1].toLowerCase() : "";
  if (!rel.includes("noopener")) {
    blankWithoutNoopener++;
    console.error(`✗ Enlace target="_blank" sin rel="noopener": ${tag}`);
  }
}
if (blankWithoutNoopener > 0) {
  hasErrors = true;
} else if (anchorTags.some((t) => /target\s*=\s*["']_blank["']/i.test(t))) {
  console.log('✓ Todos los enlaces target="_blank" incluyen rel="noopener"');
} else {
  console.log('✓ No hay enlaces target="_blank" (nada que verificar)');
}

const externalUrls = [
  ...html.matchAll(/\b(?:href|src)\s*=\s*["'](https?:\/\/[^"']+)["']/gi),
].map((m) => m[1]);
const domains = [...new Set(externalUrls.map((u) => new URL(u).hostname))];
console.log(`ℹ Dominios externos referenciados: ${domains.join(", ") || "ninguno"}`);

if (hasErrors) {
  console.error("\nFallaron una o más comprobaciones de seguridad de enlaces.");
  process.exit(1);
}

console.log("\nTodas las comprobaciones de seguridad de enlaces pasaron.");
