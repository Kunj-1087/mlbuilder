# MLBuilder Content Authoring Guide

This guide explains how to add new automation projects to the MLBuilder platform under the `/content/` directory. The system is designed to be content-first: adding a folder and writing MDX automatically handles project publication, inline source-code rendering, and ZIP downloads.

---

## Adding a New Automation

### Step 1: Create the Folder Structure

All automations live under `content/automation/[category-slug]/[automation-slug]/`.

Create the following layout for your new automation:

```text
/content/
  └── automation/
      └── web-scraping/
          └── [your-automation-slug]/
              ├── index.mdx           # The article write-up (Title, Metadata, Explanation)
              ├── cover.png           # (Optional) Cover image, 1200x800px recommended
              └── code/               # All files that users can download in the project ZIP
                  ├── main.py         # Main python script
                  ├── requirements.txt# Dependencies
                  └── README.md       # Basic setup instructions
```

### Step 2: Write the `index.mdx` File

Create `index.mdx` under the slug directory. It must contain the frontmatter parameters at the top:

```mdx
---
title: "Scraping LinkedIn Jobs with Python"
description: "Automated LinkedIn job scraper that pulls listings matching your criteria, exports to CSV. Built with Selenium + BeautifulSoup."
excerpt: "A complete Python automation that monitors LinkedIn for new job postings matching your search criteria, scrapes the details, and exports everything to a clean CSV file."
tags: ["python", "selenium", "beautifulsoup", "linkedin", "jobs", "csv"]
difficulty: "intermediate"
estimatedTime: "20 min setup"
publishedAt: "2026-01-15"
updatedAt: "2026-01-15"
coverImage: "cover.png"
status: "published"
---

## What this automation does

[Explain what it does and why it is useful]

## How to set it up

1. Step one
2. Step two

## The code

[Detailed technical walk-through]
```

#### Frontmatter Parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Headline title of the project. |
| `description` | `string` | A description of the automation (truncated to 155 chars in SEO meta tags). |
| `excerpt` | `string` | Brief, honest snippet displayed on listing cards. |
| `tags` | `string[]` | Array of lowercase keywords used for search indexing and category filters. |
| `difficulty` | `string` | Choice of: `"beginner"` \| `"intermediate"` \| `"advanced"`. |
| `estimatedTime` | `string` | Estimated installation and run time, e.g. `"20 min setup"`. |
| `publishedAt` | `string` | Date of publication (Format: `YYYY-MM-DD`). |
| `updatedAt` | `string` | (Optional) Date of last modification (Format: `YYYY-MM-DD`). |
| `coverImage` | `string` | (Optional) Path to cover image (or leave empty/omit to auto-generate a typographic cover). |
| `status` | `string` | Choice of: `"draft"` \| `"published"`. Drafts are only shown in development. |

### Step 3: Drop in your Code

Put all scripts, dependency declarations, and setup notes inside the `code/` subdirectory.

The system will auto-detect:
- All `.py` files (renders with Python syntax highlighting).
- `requirements.txt` (dependencies lists).
- `README.md` (additional setup notes, also bundled in the zip download).
- `.env.example` (renamed to `.env.example.txt` automatically in the ZIP).

### Step 4: Set status to "published"

Set the `status` to `"published"` in your `index.mdx` file.

### Step 5: Commit and Push

Add the new content directory to Git (do **NOT** add to `.gitignore`):

```bash
git add content/
git commit -m "content: add job scraper automation"
git push
```

The automation will instantly compile and become visible on production after the build deploy finishes.

---

## How to add a NEW Category

1. Create a new directory under `content/automation/` with your slug (e.g., `data-processing`).
2. Add a `_meta.mdx` file in it containing:
   ```mdx
   ---
   title: "Data Processing"
   description: "Pipelines to structure, clean, and enrich raw information."
   intro: "Convert messy CSV files, parse complex PDFs, and run local data transformations at scale."
   ---
   ```
3. Add the category slug to the filter pills list and set `active: true` in `/app/automation/page.tsx`.
