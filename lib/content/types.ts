export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type AutomationStatus = "draft" | "published";

export interface Frontmatter {
  title: string;
  description: string;
  excerpt: string;
  tags: string[];
  difficulty: DifficultyLevel;
  estimatedTime: string;
  publishedAt: string;
  updatedAt?: string;
  coverImage?: string;
  status: AutomationStatus;
}

export interface CodeFile {
  filename: string;
  language: string;
  content: string;
  lineCount: number;
}

export interface AutomationSummary {
  slug: string;
  categorySlug: string;
  title: string;
  description: string;
  excerpt: string;
  tags: string[];
  difficulty: DifficultyLevel;
  estimatedTime: string;
  lastUpdated: string;
  coverImage?: string;
  hasCode: boolean;
  hasZip: boolean;
}

export interface AutomationDetail extends AutomationSummary {
  mdxContent: string;
  frontmatter: Frontmatter;
  codeFiles: CodeFile[];
  zipUrl: string;
}

export interface AutomationCategory {
  slug: string;
  title: string;
  description: string;
  intro: string;
  automationCount: number;
  automations: AutomationSummary[];
}
