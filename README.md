# Global Debate Society Website

A modern, responsive website for the Global Debate Society, designed to serve as a platform for debate enthusiasts across Southeast Asia.

## Features

- **Modern Design**: Clean, responsive layout optimized for all devices
- **Interactive Elements**: Dynamic content loading and smooth animations
- **Resource Management**: Comprehensive debate resources and materials
- **Event Management**: Upcoming events calendar and registration system
- **Member Portal**: Access to premium content and member-only features

## Directory Structure

```
global-debate-society/
├── index.html                 # Home page
├── pages/                     # Website pages
│   ├── about.html            # About page
│   ├── events.html           # Events page
│   ├── resources.html        # Resources page
│   ├── contact.html          # Contact page
│   ├── join.html             # Membership page
│   └── faq.html             # FAQ page
├── src/                      # Source files
│   ├── css/                  # CSS styles
│   │   ├── main.css         # Main stylesheet
│   │   ├── about.css        # About page styles
│   │   ├── events.css       # Events page styles
│   │   └── resources.css    # Resources page styles
│   ├── js/                  # JavaScript files
│   │   ├── main.js          # Main JavaScript
│   │   ├── events.js        # Events functionality
│   │   └── resources.js     # Resources functionality
│   ├── components/          # Reusable components
│   │   ├── header.html      # Header component
│   │   └── footer.html      # Footer component
│   └── images/              # Website images
│       ├── logo.png         # Website logo
│       └── icons/           # UI icons
├── assets/                   # Static assets
│   ├── images/              # Content images
│   │   ├── debate-bg.jpg    # Background images
│   │   ├── team-photos/     # Team member photos
│   │   └── event-photos/    # Event photos
│   └── documents/           # Downloadable files
│       ├── debate-guides/   # Debate guides
│       └── resources/       # Other resources
└── README.md                # Project documentation
```

## Technologies Used

- HTML5
- CSS3 (with Flexbox and Grid)
- JavaScript (ES6+)
- Font Awesome Icons
- Google Fonts
- Responsive Design Principles

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/global-debate-society.git
   ```

2. Navigate to the project directory:
   ```bash
   cd global-debate-society
   ```

3. Open `index.html` in your web browser to view the website.

## Development

To modify the website:

1. Edit HTML files in the root directory and `pages/` folder
2. Modify styles in the `src/css/` directory
3. Update JavaScript functionality in the `src/js/` directory
4. Add new images to `assets/images/`
5. Add new documents to `assets/documents/`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## Best Practices

- Follow semantic HTML5 markup
- Use BEM methodology for CSS
- Implement responsive design principles
- Optimize images for web use
- Ensure cross-browser compatibility
- Maintain accessibility standards

## Maintenance

Regular updates required for:

- Content updates
- Security patches
- Browser compatibility
- Performance optimization
- Feature enhancements

## Contact

For questions or support, please contact:
- Email: contact@globaldebatesociety.com
- Website: www.globaldebatesociety.com





Below is a ready-to-use “prompt playbook”.  
Paste each prompt into Cursor AI’s chat (running the o3 model).  
After you send a prompt, **wait until the agent fully completes all tool-driven edits and reports success** before moving to the next one.

General guidance embedded in every prompt:  
• “Work agentically: decide, search, edit, and validate autonomously.”  
• “Use as many Cursor tool calls as needed (codebase_search, list_dir, read_file, grep_search, edit_file, run_terminal_cmd, etc.).”  
• “Maintain a functional website at the end of the task; run any available quick verification (e.g. `npm run build` or Lighthouse CI) before declaring completion.”

--------------------------------------------------------------------
PROMPT #0 – Safety Net & Conventions
--------------------------------------------------------------------
You are the senior maintainer of the Global Debate Society static site.

Goal for this session:  
1. Introduce code-quality tooling:
   • ESLint + Prettier for JS  
   • Stylelint for CSS  
2. Configure scripts in `package.json`:
   • `lint:js` `lint:css` `format`  
3. Run all linters and auto-fix issues project-wide.  
4. Ensure **zero functional regressions** (HTML still renders; JS errors free in console).

Constraints & guidance:  
• Follow the existing directory layout (`src/**`).  
• If config files are absent, create `.eslintrc.json`, `.prettierrc`, `.stylelintrc.json`.  
• Use sensible default rules; do not enforce TypeScript.  
• Commit changes only via Cursor’s `edit_file` tool.  
• When finished, summarise what changed, what commands were run, and confirm that no lint errors remain.

--------------------------------------------------------------------
PROMPT #1 – Remove Redundant / Empty Assets
--------------------------------------------------------------------
Act agentically to clean unused or duplicate artifacts.

Tasks:  
1. Delete every `.DS_Store` file anywhere in the repo.  
2. Remove **empty** CSS files (`_buttons.css`, `_cards.css`, `buttons.css` in `src/styles/components/`).  
3. Identify any identical duplicate images (e.g. multiple copies of `pattern-dots.svg`). Keep one canonical copy and adjust import paths accordingly.  
4. Re-run linters and the build step to verify nothing is broken.

Remember: use `grep_search` or semantic search to locate references before deletion; use `edit_file` to update paths.

--------------------------------------------------------------------
PROMPT #2 – Merge the Two Mobile-Navigation Scripts
--------------------------------------------------------------------
Objective: consolidate `src/js/mobile-nav.js` and `src/js/navbar.js` into a single, reusable module.

Steps:  
1. Read both files, diff behaviour.  
2. Create `src/js/components/mobileNav.js` exporting an `initMobileNav()` function that supports both desktop (navbar) and mobile states.  
3. Refactor page code to import and call this new module, deleting the old two scripts.  
4. Update HTML templates to load **one** bundle (after we have a build pipeline in Prompt #3).  
5. Verify that:
   • Hamburger button toggles correctly and are centered verticaly correctely.  
   • Overlay works.  
   • Escape key and link-click close behave as before.  

Run quick manual checks via headless browser or console logs.

--------------------------------------------------------------------
PROMPT #3 – Introduce a Zero-Config Build Pipeline
--------------------------------------------------------------------
Set up Vite (preferred) or Parcel to bundle JS, process CSS imports, and copy static assets.

Deliverables:  
• `vite.config.js` with aliases: `@styles`, `@components`.  
• Update `package.json` with scripts: `dev`, `build`, `preview`.  
• Entry points:
   – JS: `src/js/main.js` (import other modules).  
   – CSS: `src/styles/index.css` or new `main.scss`.  
• Ensure HTML pages load built assets from `/dist` in dev and prod mode.

Test: run `npm run build`; confirm successful output and working preview (`npm run preview | cat` to avoid pager).

--------------------------------------------------------------------
PROMPT #4 – Consolidate & Modularise CSS
--------------------------------------------------------------------
Goals:  
1. Create `src/styles/partials/` and move duplicated layout files (`layout.css`, `_mobile-nav.css`, etc.) here as SCSS partials.  
2. Keep a single public stylesheet (`src/styles/main.scss`) that imports tokens, utilities, layouts, and components.  
3. Replace hard-coded colour literals across stylesheets with variables from `utils/variables.css`.  
4. Delete the now-redundant `src/styles/layout/` and `src/styles/layouts/`.

Must-remain-true: class names and resulting CSS selectors stay identical to avoid breaking markup.

--------------------------------------------------------------------
PROMPT #5 – Extract Reusable JS Components
--------------------------------------------------------------------
1. Under `src/js/components/`, create:
   • `accordion.js`  
   • `scrollReveal.js`  
2. Move duplicated accordion logic from `faq.js`, `resources.js`, etc. into `accordion.js`.  
3. Move scroll/animation helpers (`hero-scroll.js`, `animations.js`) into `scrollReveal.js`.  
4. Update page scripts to import those helpers.  
5. Ensure tree-shaking keeps per-page bundles small.

--------------------------------------------------------------------
PROMPT #6 – Folder Restructure & Final Cleanup
--------------------------------------------------------------------
1. Rename `src/styles/layout/` references to new partials path (already done in Prompt #4; just sanity-check).  
2. Remove any left-over duplicate page-specific CSS in `src/styles/pages/secondary/` that is identical to the main copy.  
3. Ensure all HTML templates reference the built CSS/JS from Vite’s manifest.  
4. Run Lighthouse CI (or similar automated performance test) and paste the scores into the final summary.

--------------------------------------------------------------------
HOW TO USE THIS PLAYBOOK
--------------------------------------------------------------------
• Follow numeric order; each prompt is self-contained and keeps the site healthy before you move on.  
• If the agent ever blocks on an ambiguity, reply with clarification; otherwise allow it to self-direct.  
• Keep PRs small: one prompt ≈ one pull-request/commit set.  
• After Prompt #6 your repository should be free of duplicates, lint-clean, modular, and served from `/dist` via Vite.