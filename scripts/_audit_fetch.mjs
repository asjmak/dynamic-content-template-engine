import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  const txt = fs.readFileSync(file, "utf8");
  for (const line of txt.split("\n")) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
}
loadEnv(".env");
loadEnv(".env.local");

const a = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const tpls = ["classic-sales", "lead-gen", "modern-review", "long-form", "comparison"];

async function main() {
  if (!fs.existsSync("./tmp")) fs.mkdirSync("./tmp");
  for (const t of tpls) {
    await a.from("site_settings").update({ active_template: t }).eq("id", 1);
    await new Promise((r) => setTimeout(r, 800));
    const res = await fetch("http://localhost:3000/");
    const html = await res.text();
    fs.writeFileSync(`./tmp/tpl_${t}.html`, html);
    console.log(`Fetched ${t}`);
  }
  await a.from("site_settings").update({ active_template: "classic-sales" }).eq("id", 1);
}
main();
