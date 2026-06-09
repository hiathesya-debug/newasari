import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const file = join(process.cwd(), "src/components/admin/AdminSidebar.tsx");
let src = readFileSync(file, "utf8");

// Change collapsed default from true back to false
src = src.replace(
  "const [collapsed, setCollapsed] = useState(true);",
  "const [collapsed, setCollapsed] = useState(false);"
);

writeFileSync(file, src, "utf8");
console.log("OK — sidebar now starts expanded (text visible) with w-44 width");
