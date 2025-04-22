const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, 'src/pages/footer-pages/posts');
const OUTPUT_FILE = path.join(__dirname, 'src/pages/footer-pages/blog-index.json');

function parseFrontmatter(content) {
  const match = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/m.exec(content);
  if (!match) return { meta: {}, body: content };
  const meta = {};
  match[1].split('\n').forEach(line => {
    const [k, ...v] = line.split(':');
    if (!k) return;
    let value = v.join(':').trim();
    // Parse arrays
    if (value.startsWith('[') && value.endsWith(']')) {
      try { value = JSON.parse(value); } catch {}
    }
    // Parse booleans
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    meta[k.trim()] = value;
  });
  return { meta, body: match[2] };
}

function slugify(filename) {
  return filename.replace(/\.md$/, '');
}

function main() {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  const posts = files.map(filename => {
    const content = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
    const { meta } = parseFrontmatter(content);
    return {
      slug: slugify(filename),
      ...meta
    };
  });
  // Sort by date descending
  posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
  console.log(`Wrote ${posts.length} posts to blog-index.json`);
}

main(); 