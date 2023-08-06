import path from 'path';
import { fileURLToPath } from 'url';
import figlet from 'figlet';

const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);

export const PROJECT_ROOT = path.join(process.cwd(), '../../');

export const TITLE_TEXT = figlet.textSync('DARIA-CLI', {
  font: 'Epic'
});
