const fs   = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "src/routes/admin.website.tsx");
let src = fs.readFileSync(file, "utf8");

// 1. Remove rulesFile state
src = src.replace(/\n\s*const \[rulesFile,\s*setRulesFile\]\s*=\s*useState<File \| null>\(null\);/g, "");

// 2. Remove saveRulesPhoto function (everything from "async function saveRulesPhoto" to its closing "}")
src = src.replace(/\n\s*async function saveRulesPhoto\(\)[\s\S]*?setSavingKey\("rules",\s*false\);\s*\}/m, "");

// 3. Remove the entire Rules accordion JSX block
src = src.replace(
  /\n\s*\{\/\* Section 5 — Rules Photo \*\/\}[\s\S]*?<\/Accordion>\n/m,
  "\n"
);

fs.writeFileSync(file, src, "utf8");
console.log("OK removed duplicate Rules section from admin.website.tsx");
