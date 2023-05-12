import { dirname, join } from "path";
import { pathToFileURL } from "url";

export default getFrontendPath = () => {
  const __filename = pathToFileURL(import.meta.url);
  const __dirname = dirname(__filename);

  return join(__dirname.replace("/backend/helpers", ""), "/frontend");
};
