import getFrontendPath from '../helpers/get-frontend-path.js';
import { join } from 'path';

export default function getSplash(_, res) {
  const htmlFile = join(getFrontendPath(), '/html/index.html');
  res.sendFile(htmlFile);
}
