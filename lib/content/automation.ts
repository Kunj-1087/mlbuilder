import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import {
  AutomationCategory,
  AutomationSummary,
  AutomationDetail,
  CodeFile,
  Frontmatter
} from './types';

const CONTENT_PATH = path.join(process.cwd(), 'content', 'automation');

// Helper to determine language from extension
function getLanguageFromExtension(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.py': return 'python';
    case '.txt': return 'text';
    case '.md': return 'markdown';
    case '.json': return 'json';
    case '.js': return 'javascript';
    case '.ts': return 'typescript';
    case '.sh': return 'bash';
    case '.yml':
    case '.yaml': return 'yaml';
    default: return 'text';
  }
}

async function getAutomationSummary(categorySlug: string, slug: string): Promise<AutomationSummary | null> {
  const automationPath = path.join(CONTENT_PATH, categorySlug, slug);
  const indexPath = path.join(automationPath, 'index.mdx');

  try {
    const indexContent = await fs.readFile(indexPath, 'utf8');
    const { data } = matter(indexContent);
    const frontmatter = data as Frontmatter;

    // Filter out drafts in production
    const isProd = process.env.NODE_ENV === 'production';
    if (isProd && frontmatter.status === 'draft') {
      return null;
    }

    // Check if code/ exists and has files
    const codePath = path.join(automationPath, 'code');
    let hasCode = false;
    try {
      const codeFiles = await fs.readdir(codePath);
      hasCode = codeFiles.filter(f => !f.startsWith('.')).length > 0;
    } catch {
      // code/ directory doesn't exist
    }

    return {
      slug,
      categorySlug,
      title: frontmatter.title,
      description: frontmatter.description,
      excerpt: frontmatter.excerpt,
      tags: frontmatter.tags || [],
      difficulty: frontmatter.difficulty,
      estimatedTime: frontmatter.estimatedTime,
      lastUpdated: frontmatter.updatedAt || frontmatter.publishedAt,
      coverImage: frontmatter.coverImage || undefined,
      hasCode,
      hasZip: hasCode,
    };
  } catch (error) {
    console.error(`Error reading automation summary for ${categorySlug}/${slug}:`, error);
    return null;
  }
}

export async function getAllCategories(): Promise<AutomationCategory[]> {
  try {
    const entries = await fs.readdir(CONTENT_PATH, { withFileTypes: true });
    const categories: AutomationCategory[] = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const cat = await getCategory(entry.name);
        if (cat) {
          categories.push(cat);
        }
      }
    }
    return categories;
  } catch (error) {
    console.error("Error reading categories:", error);
    return [];
  }
}

export async function getCategory(slug: string): Promise<AutomationCategory | null> {
  const categoryPath = path.join(CONTENT_PATH, slug);
  const metaPath = path.join(categoryPath, '_meta.mdx');

  try {
    const metaContent = await fs.readFile(metaPath, 'utf8');
    const { data } = matter(metaContent);
    const automations = await getAutomationsByCategory(slug);

    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      intro: data.intro || '',
      automationCount: automations.length,
      automations,
    };
  } catch (error) {
    console.error(`Error reading category ${slug}:`, error);
    return null;
  }
}

export async function getAllAutomations(): Promise<AutomationSummary[]> {
  try {
    const categories = await fs.readdir(CONTENT_PATH, { withFileTypes: true });
    const allSummaries: AutomationSummary[] = [];

    for (const cat of categories) {
      if (cat.isDirectory()) {
        const summaries = await getAutomationsByCategory(cat.name);
        allSummaries.push(...summaries);
      }
    }
    return allSummaries;
  } catch (error) {
    console.error("Error reading all automations:", error);
    return [];
  }
}

export async function getAutomationsByCategory(categorySlug: string): Promise<AutomationSummary[]> {
  const categoryPath = path.join(CONTENT_PATH, categorySlug);
  try {
    const entries = await fs.readdir(categoryPath, { withFileTypes: true });
    const summaries: AutomationSummary[] = [];

    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== 'code') {
        const itemSlug = entry.name;
        const automation = await getAutomationSummary(categorySlug, itemSlug);
        if (automation) {
          summaries.push(automation);
        }
      }
    }
    return summaries;
  } catch (error) {
    console.error(`Error reading automations for category ${categorySlug}:`, error);
    return [];
  }
}

export async function getAutomation(categorySlug: string, automationSlug: string): Promise<AutomationDetail | null> {
  const summary = await getAutomationSummary(categorySlug, automationSlug);
  if (!summary) return null;

  const automationPath = path.join(CONTENT_PATH, categorySlug, automationSlug);
  const indexPath = path.join(automationPath, 'index.mdx');

  try {
    const indexContent = await fs.readFile(indexPath, 'utf8');
    const { content: mdxContent, data } = matter(indexContent);
    const frontmatter = data as Frontmatter;
    const codeFiles = await getCodeFiles(categorySlug, automationSlug);

    return {
      ...summary,
      mdxContent,
      frontmatter,
      codeFiles,
      zipUrl: `/api/automation/${categorySlug}/${automationSlug}/download`,
    };
  } catch (error) {
    console.error(`Error reading automation detail for ${categorySlug}/${automationSlug}:`, error);
    return null;
  }
}

export async function getCodeFiles(categorySlug: string, automationSlug: string): Promise<CodeFile[]> {
  const codePath = path.join(CONTENT_PATH, categorySlug, automationSlug, 'code');
  try {
    const files = await fs.readdir(codePath);
    const codeFiles: CodeFile[] = [];

    for (const file of files) {
      if (file.startsWith('.')) continue; // skip hidden files like .DS_Store
      const filePath = path.join(codePath, file);
      const stat = await fs.stat(filePath);
      
      if (stat.isFile()) {
        const content = await fs.readFile(filePath, 'utf8');
        const lineCount = content.split('\n').length;
        const language = getLanguageFromExtension(file);

        codeFiles.push({
          filename: file,
          language,
          content,
          lineCount,
        });
      }
    }

    // Sort files to put main.py / entrypoint first, README.md last
    codeFiles.sort((a, b) => {
      if (a.filename === 'main.py' || a.filename === 'index.js') return -1;
      if (b.filename === 'main.py' || b.filename === 'index.js') return 1;
      if (a.filename === 'README.md') return 1;
      if (b.filename === 'README.md') return -1;
      return a.filename.localeCompare(b.filename);
    });

    return codeFiles;
  } catch (error) {
    console.error(`Error reading code files for ${categorySlug}/${automationSlug}:`, error);
    return [];
  }
}
