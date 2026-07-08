import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context()
        page = await context.new_page()
        
        # Test server
        import http.server
        import socketserver
        import threading
        import os

        PORT = 8001
        Handler = http.server.SimpleHTTPRequestHandler
        httpd = socketserver.TCPServer(("", PORT), Handler)
        thread = threading.Thread(target=httpd.serve_forever)
        thread.daemon = True
        thread.start()

        base_url = f"http://localhost:{PORT}"

        try:
            # 1. Verify index.html
            print("Checking index.html...")
            await page.goto(f"{base_url}/index.html")
            # Wait for dynamic blogs to load
            await page.wait_for_selector("#blogGrid a", timeout=5000)
            blogs = await page.query_selector_all("#blogGrid a")
            print(f"Found {len(blogs)} blogs on index.html")
            if len(blogs) != 6:
                print(f"ERROR: Expected 6 blogs, found {len(blogs)}")
            
            ads_in_index = await page.query_selector_all("ins.adsbygoogle")
            print(f"Found {len(ads_in_index)} ads in index.html")
            if len(ads_in_index) > 0:
                print("ERROR: Ads found in index.html")

            # 2. Verify about.html
            print("Checking about.html...")
            await page.goto(f"{base_url}/about.html")
            ads_in_about = await page.query_selector_all("ins.adsbygoogle")
            print(f"Found {len(ads_in_about)} ads in about.html")
            if len(ads_in_about) == 0:
                print("ERROR: No ads found in about.html")

            # 3. Verify a blog page
            print("Checking a blog page...")
            await page.goto(f"{base_url}/blogs/live-food-stations-wedding/live-food-stations-wedding.html")
            ads_in_blog = await page.query_selector_all("ins.adsbygoogle")
            print(f"Found {len(ads_in_blog)} ads in blog page")
            if len(ads_in_blog) == 0:
                print("ERROR: No ads found in blog page")
        finally:
            await browser.close()
            httpd.shutdown()

if __name__ == "__main__":
    asyncio.run(verify())
