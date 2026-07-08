import json
import os
import re

def inject_counters():
    with open('blogs/posts.json', 'r') as f:
        posts = json.load(f)

    for post in posts:
        slug = post['slug']
        filepath = f'blogs/{slug}/{slug}.html'

        if not os.path.exists(filepath):
            print(f"File not found: {filepath}")
            continue

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if already injected
        if 'id="view-count"' in content:
            print(f"Skipping {slug}, already injected.")
            continue

        # Inject the span into .hero-meta
        # Flexible regex for div with hero-meta class
        meta_match = re.search(r'(<div[^>]*class="[^"]*hero-meta[^"]*"[^>]*>.*?)(</div>)', content, re.DOTALL)
        if meta_match:
            span_html = f'\n      <span class="hero-dot"></span>\n      <span><span id="view-count">...</span> reads</span>'

            # Check for existing separators
            if 'class="hero-dot"' not in content and '·' in meta_match.group(1):
                 span_html = f'\n      <span>· <span id="view-count">...</span> reads</span>'
            elif 'class="hero-dot"' not in meta_match.group(1) and 'class="hero-dot"' in content:
                 # It might be in the CSS, so let's stick with span_html as is
                 pass

            new_meta = meta_match.group(1) + span_html + '\n    ' + meta_match.group(2)
            content = content.replace(meta_match.group(0), new_meta)
        else:
            print(f"Could not find .hero-meta in {slug}")
            continue

        # Inject the script before </body>
        script_html = f"""
<script>
  (function() {{
    fetch('https://api.counterapi.dev/v1/royalshaadi/{slug}/up')
      .then(res => res.json())
      .then(data => {{
        const el = document.getElementById('view-count');
        if (el) el.textContent = data.count.toLocaleString();
      }})
      .catch(err => console.error('Counter error:', err));
  }})();
</script>
"""
        content = content.replace('</body>', script_html + '</body>')

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Injected counter into {slug}")

if __name__ == "__main__":
    inject_counters()
