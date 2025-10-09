# Afik Cohen - Personal Website

A clean, modern personal website built with [11ty](https://www.11ty.dev/) (Eleventy) and TypeScript.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server with live reload
npm start

# Build for production
npm run build
```

The dev server will be available at `http://localhost:8080`

## Editing Content

All content is managed through easy-to-edit files:

### Hero Section
Edit `src/_data/site.json` to update the hero section (name, tagline, summary).

### About Section
Edit `src/index.njk` - the about text is in the `#about` section.

### Projects
Edit `src/_data/projects.json` to add/remove/modify projects. Each project has:
- `title`: Project name
- `image`: Path to image (in `/assets`)
- `description`: HTML description (use `<strong>` and `<em>` for styling)

### Writing/Blog Posts
Edit `src/_data/writing.json` to add/remove blog posts. Each post has:
- `title`: Post title
- `url`: Full URL to the post

### Contact & Social Links
Edit `src/_data/site.json` to update email and social media links.

### Styling
Edit `src/css/styles.css` to change colors, fonts, and layout.

## Project Structure

```
├── src/
│   ├── _data/           # JSON data files (site config, projects, writing)
│   ├── _includes/       # Reusable templates (base layout)
│   ├── css/            # Stylesheets
│   ├── ts/             # TypeScript source files
│   ├── index.njk       # Homepage template
│   ├── about.md        # About page (Markdown)
│   ├── projects.md     # Projects page (Markdown)
│   └── writing.md      # Writing page (Markdown)
├── assets/             # Images and icons
├── dist/               # Compiled JavaScript (generated)
├── _site/              # Built site (generated)
└── package.json        # Dependencies and scripts
```

## Deployment

The built site is in the `_site` folder. Deploy it to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

## Technologies

- **11ty (Eleventy)**: Static site generator
- **Nunjucks**: Templating engine
- **TypeScript**: Type-safe JavaScript
- **Markdown**: Easy content editing
- **JSON**: Structured data storage
