import { join } from 'path';
import { root } from '../bff.js';

export default function getSplash(_, res) {
  const htmlFile = 'frontend/html/index.html';
  res.sendFile(htmlFile, { root: root });
}
