const archiver = require('archiver');
import fs from 'fs';
import path from 'path';
import { getAutomation } from './automation';

export async function streamCodeZip(
  categorySlug: string,
  automationSlug: string,
  outStream: NodeJS.WritableStream
): Promise<void> {
  const automation = await getAutomation(categorySlug, automationSlug);
  if (!automation) {
    throw new Error(`Automation not found: ${categorySlug}/${automationSlug}`);
  }

  const codePath = path.join(process.cwd(), 'content', 'automation', categorySlug, automationSlug, 'code');
  
  const archive = archiver('zip', {
    zlib: { level: 9 }, // Maximum compression
  });

  archive.on('error', (err: any) => {
    throw err;
  });

  archive.pipe(outStream);

  // 1. Generate top-level README.md from frontmatter & setup instructions
  const setupInstructions = extractSetupInstructions(automation.mdxContent);
  const readmeContent = `# ${automation.title}

${automation.description}

---

## Setup Instructions

${setupInstructions}

---
Downloaded from MLBuilder.
`;
  archive.append(readmeContent, { name: 'README.md' });

  // 2. Append files from code/ folder
  try {
    const files = await fs.promises.readdir(codePath);
    for (const file of files) {
      if (file.startsWith('.')) continue; // skip hidden files
      
      const filePath = path.join(codePath, file);
      const stat = await fs.promises.stat(filePath);
      
      if (stat.isFile()) {
        const fileLower = file.toLowerCase();
        if (fileLower === 'readme.md') {
          // Store original README as README_PROJECT.md to avoid name collision with generated one
          archive.file(filePath, { name: 'README_PROJECT.md' });
        } else if (file === '.env.example') {
          // Rename .env.example to prevent issues
          archive.file(filePath, { name: '.env.example.txt' });
        } else {
          archive.file(filePath, { name: file });
        }
      }
    }
  } catch (error) {
    console.error(`Error reading code directory for zip packaging:`, error);
  }

  await archive.finalize();
}

function extractSetupInstructions(mdxContent: string): string {
  // Extract content from ## How to set it up (or similar) until next ## or end of file
  const match = mdxContent.match(/## How to set it up([\s\S]*?)(?=##|$)/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  return 'Please refer to README_PROJECT.md or the article on MLBuilder for setup instructions.';
}
