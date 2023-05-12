import { dirname, join } from "path";
import { fileURLToPath } from "url";

export default function getFrontendPath() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  return join(__dirname.replace("/backend/helpers", ""), "/frontend");
}
