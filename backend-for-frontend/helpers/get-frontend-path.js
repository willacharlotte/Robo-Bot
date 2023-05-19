import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export default function getFrontendPath(currentPath) {
  currentPath = currentPath ?? '/backend-for-frontend/helpers';
  const __filename = fileURLToPath(import.meta.url);
  const isWindows = __filename.startsWith('C:\\');

  currentPath = isWindows ? currentPath.replace(/\//g, '\\') : currentPath;

  const __dirname = dirname(__filename);

  const frontendPath = join(__dirname.replace(currentPath, ''), '/frontend');
  return isWindows ? frontendPath.replace(/\//g, '\\') : frontendPath;
}
