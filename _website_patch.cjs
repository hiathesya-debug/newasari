// This script patches admin.website.tsx by inserting the 3 new page-photo sections
// before the closing </div> and before <Toasts />
const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/routes/admin.website.tsx');
let src = fs.readFileSync(filePath, 'utf8');

// ── New state variables to inject after existing state declarations ────────────
const NEW_STATE = `
  const [termsFile,  setTermsFile]  = useState<File | null>(null);
  const [rulesFile,  setRulesFile]  = useState<File | null>(null);
  const [aboutFile,  setAboutFile]  = useState<File | null>(null);`;

// Inject after the last existing useState line (footerLogoFile)
src = src.replace(
  `const [footerLogoFile, setFooterLogoFile] = useState<File | null>(null);`,
  `const [footerLogoFile, setFooterLogoFile] = useState<File | null>(null);${NEW_STATE}`
);

// ── New save functions to inject before the toggle() function ──────────────────
const NEW_SAVE_FNS = `
  async function saveTermsPhoto() {
    setSavingKey("terms", true);
    try {
      if (termsFile) {
        const url = await uploadFile(termsFile, \`terms-photo-\${Date.now()}.\${termsFile.name.split(".").pop()}\`);
        await saveSetting("terms_hero_image", url);
        setSettings((p) => ({ ...p, terms_hero_image: url }));
      }
      toast("Terms & Conditions photo updated.");
    } catch { toast("Failed to save.", false); }
    setSavingKey("terms", false);
  }

  async function saveRulesPhoto() {
    setSavingKey("rules", true);
    try {
      if (rulesFile) {
        const url = await uploadFile(rulesFile, \`rules-photo-\${Date.now()}.\${rulesFile.name.split(".").pop()}\`);
        await saveSetting("rules_hero_image", url);
        setSettings((p) => ({ ...p, rules_hero_image: url }));
      }
      toast("Rules photo updated.");
    } catch { toast("Failed to save.", false); }
    setSavingKey("rules", false);
  }

  async function saveAboutPhoto() {
    setSavingKey("about", true);
    try {
      if (aboutFile) {
        const url = await uploadFile(aboutFile, \`about-photo-\${Date.now()}.\${aboutFile.name.split(".").pop()}\`);
        await saveSetting("about_hero_image", url);
        setSettings((p) => ({ ...p, about_hero_image: url }));
      }
      toast("About Us photo updated.");
    } catch { toast("Failed to save.", false); }
    setSavingKey("about", false);
  }

`;

src = src.replace(
  `  const toggle = (k: string) => setOpen((p) => (p === k ? "" : k));`,
  NEW_SAVE_FNS + `  const toggle = (k: string) => setOpen((p) => (p === k ? "" : k));`
);

// ── New accordion sections to inject before <Toasts /> ────────────────────────
const NEW_SECTIONS = `
        {/* Section 4 — Terms & Conditions Photo */}
        <Accordion title="Foto Halaman Terms & Conditions" open={open === "terms"} onToggle={() => toggle("terms")}
          summary="Ganti foto header halaman Terms & Conditions">
          <UploadZone label="Upload Foto Terms & Conditions"
            hint="JPG, PNG, WEBP · Max 5 MB · Landscape, min 1200×500px"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            maxMB={5} aspect="aspect-[16/5]"
            currentUrl={settings.terms_hero_image}
            onFile={setTermsFile} readOnly={!owner} />
          {owner && <SaveBtn label="Save Terms Photo" saving={!!saving.terms} onClick={saveTermsPhoto} />}
        </Accordion>

        {/* Section 5 — Rules Photo */}
        <Accordion title="Foto Halaman Ketentuan / Rules" open={open === "rules"} onToggle={() => toggle("rules")}
          summary="Ganti foto header halaman Ketentuan Pemesanan">
          <UploadZone label="Upload Foto Ketentuan / Rules"
            hint="JPG, PNG, WEBP · Max 5 MB · Landscape, min 1200×500px"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            maxMB={5} aspect="aspect-[16/5]"
            currentUrl={settings.rules_hero_image}
            onFile={setRulesFile} readOnly={!owner} />
          {owner && <SaveBtn label="Save Rules Photo" saving={!!saving.rules} onClick={saveRulesPhoto} />}
        </Accordion>

        {/* Section 6 — About Us Photo */}
        <Accordion title="Foto Halaman About Us" open={open === "about"} onToggle={() => toggle("about")}
          summary="Ganti foto header halaman About Us">
          <UploadZone label="Upload Foto About Us"
            hint="JPG, PNG, WEBP · Max 5 MB · Landscape, min 1200×500px"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            maxMB={5} aspect="aspect-[16/5]"
            currentUrl={settings.about_hero_image}
            onFile={setAboutFile} readOnly={!owner} />
          {owner && <SaveBtn label="Save About Us Photo" saving={!!saving.about} onClick={saveAboutPhoto} />}
        </Accordion>

`;

src = src.replace(
  `      <Toasts list={toasts} dismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />`,
  NEW_SECTIONS + `      <Toasts list={toasts} dismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />`
);

fs.writeFileSync(filePath, src, 'utf8');
console.log('OK src/routes/admin.website.tsx patched with 3 new photo sections');
