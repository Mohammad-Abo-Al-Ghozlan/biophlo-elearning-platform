import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/data/pageInventory.ts", import.meta.url), "utf8");
const expected = { public: 37, student: 25, admin: 72 };
const routes = [];

for (const [area, expectedCount] of Object.entries(expected)) {
  const block = source.match(new RegExp(`const ${area}Seeds: PageSeed\\[\\] = \\[([\\s\\S]*?)\\n\\];`));
  if (!block) throw new Error(`Missing ${area} route inventory.`);

  const entries = [...block[1].matchAll(/^\s*\["([^"]+)",\s*"([^"]+)",\s*"([^"]+)"/gm)]
    .map(([, id, title, path]) => ({ area, id, title, path }));

  if (entries.length !== expectedCount) {
    throw new Error(`${area} inventory has ${entries.length} routes; expected ${expectedCount}.`);
  }
  routes.push(...entries);
}

const assertUnique = (field) => {
  const seen = new Map();
  for (const route of routes) {
    const value = route[field];
    if (seen.has(value)) throw new Error(`Duplicate ${field} "${value}" in ${seen.get(value)} and ${route.area}.`);
    seen.set(value, route.area);
  }
};

assertUnique("id");
assertUnique("path");

for (const route of routes) {
  if (!route.path.startsWith("/")) throw new Error(`Route ${route.id} must start with "/".`);
  if (!route.title.trim()) throw new Error(`Route ${route.id} is missing a title.`);
}

console.log(`Verified ${routes.length} unique routes (${expected.public} public, ${expected.student} student, ${expected.admin} admin).`);
