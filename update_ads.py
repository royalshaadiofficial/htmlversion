import os
import re

adsense_script = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9083664222221461" crossorigin="anonymous"></script>'
adsense_ins = """
<ins class="adsbygoogle"
     style="display:block"
     data-ad-format="fluid"
     data-ad-layout-key="-5g+cv+1i-bd+cy"
     data-ad-client="ca-pub-9083664222221461"
     data-ad-slot="2115294923"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
"""

def update_file(filepath, is_blog=False):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add script to head if not present
    if 'ca-pub-9083664222221461' not in content:
        if '</head>' in content:
            content = content.replace('</head>', f'  {adsense_script}\n</head>')
    
    # Check if ins already present to avoid duplicates
    if 'data-ad-slot="2115294923"' in content:
        print(f"Skipping {filepath}, ad already present")
        return

    if is_blog:
        # For blogs, insert after the second <p> tag within <main>
        main_match = re.search(r'<main.*?>', content, re.IGNORECASE)
        if main_match:
            main_end = main_match.end()
            p_matches = list(re.finditer(r'</p>', content[main_end:], re.IGNORECASE))
            if len(p_matches) >= 2:
                insert_pos = main_end + p_matches[1].end()
                content = content[:insert_pos] + f'\n{adsense_ins}\n' + content[insert_pos:]
            elif len(p_matches) >= 1:
                insert_pos = main_end + p_matches[0].end()
                content = content[:insert_pos] + f'\n{adsense_ins}\n' + content[insert_pos:]
            else:
                content = content[:main_end] + f'\n{adsense_ins}\n' + content[main_end:]
    else:
        # For other pages, insert after the closing </header> tag
        header_match = re.search(r'</header>', content, re.IGNORECASE)
        if header_match:
            insert_pos = header_match.end()
            content = content[:insert_pos] + f'\n<div class="section" style="padding-top:0; padding-bottom:0;">{adsense_ins}</div>\n' + content[insert_pos:]
        else:
            # Fallback to after body start
            body_match = re.search(r'<body.*?>', content, re.IGNORECASE)
            if body_match:
                insert_pos = body_match.end()
                content = content[:insert_pos] + f'\n{adsense_ins}\n' + content[insert_pos:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filepath}")

# Top-level pages (excluding index.html)
pages = [
    'about.html', 'advertise.html', 'blogs.html', 'contact.html', 'fashion.html', 
    'lifestyle.html', 'privacy-policy.html', 'subscribe.html', 'terms.html', 
    'vendors.html', 'wedding-calendar.html', 'weddings.html', 'planner.html'
]

for p in pages:
    if os.path.exists(p):
        update_file(p, is_blog=False)

# Blog pages
for root, dirs, files in os.walk('blogs'):
    for file in files:
        if file.endswith('.html'):
            update_file(os.path.join(root, file), is_blog=True)
