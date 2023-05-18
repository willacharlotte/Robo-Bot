import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export default function getFrontendPath(currentPath) {
  currentPath = currentPath ?? '/backend-for-frontend/helpers';
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  return join(__dirname.replace(currentPath, ''), '/frontend');
}
