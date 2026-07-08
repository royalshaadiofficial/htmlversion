import os
import re

# The tags to insert
gtm_head = """<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MSM88SXB');</script>
<!-- End Google Tag Manager -->"""

ga4_tag = """<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-0BN8H58LK9"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-0BN8H58LK9');
</script>"""

adsense_head = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9083664222221461" crossorigin="anonymous"></script>'

gtm_body = """<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MSM88SXB"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->"""

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Insert/Update Head Tags
    # We'll try to find <head> and insert after it, avoiding duplicates
    if 'GTM-MSM88SXB' not in content:
        content = content.replace('<head>', f'<head>\n{gtm_head}')
    
    if 'G-0BN8H58LK9' not in content:
        # Insert after GTM if we just inserted it, or after <head>
        if gtm_head in content:
            content = content.replace('<!-- End Google Tag Manager -->', f'<!-- End Google Tag Manager -->\n{ga4_tag}')
        else:
            content = content.replace('<head>', f'<head>\n{ga4_tag}')

    if 'ca-pub-9083664222221461' not in content:
        content = content.replace('<head>', f'<head>\n{adsense_head}')

    # 2. Insert/Update Body Tags (Noscript)
    if 'GTM-MSM88SXB' in content and 'ns.html?id=GTM-MSM88SXB' not in content:
        content = content.replace('<body>', f'<body>\n{gtm_body}')

    # 3. Standardize Favicons (if missing the full set)
    if 'favicon-48x48.png' not in content:
        favicon_html = """<!-- Favicons -->
<link rel="icon" type="image/png" href="/favicon-48x48.png" sizes="48x48">
<link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
<link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">"""
        # Replace existing simple favicon if it exists
        content = re.sub(r'<link rel="icon" [^>]*>', favicon_html, content)
        if 'favicon-48x48.png' not in content:
             content = content.replace('</title>', f'</title>\n{favicon_html}')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    for root, dirs, files in os.walk('.'):
        if '.git' in dirs:
            dirs.remove('.git')
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                print(f"Processing {filepath}...")
                process_file(filepath)

if __name__ == "__main__":
    main()
