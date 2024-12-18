import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config({ path: "./.env" }); 


//to generate directory link
export async function generateDirectoryLink(additionalPath = '') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  if (additionalPath) {
    return path.resolve(__dirname, additionalPath);
  }

  return __dirname;
}
