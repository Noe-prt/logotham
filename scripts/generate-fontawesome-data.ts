
import { fas } from "@fortawesome/free-solid-svg-icons";
import { writeFileSync } from "fs";
import { join } from "path";

const iconNames = Object.keys(fas).filter((key) => key.startsWith("fa"));
const outputPath = join(process.cwd(), "data", "fontawesome-icons.json");

writeFileSync(outputPath, JSON.stringify(iconNames, null, 2) + "\n");

console.log(`Generated ${iconNames.length} Font Awesome icons → ${outputPath}`);
