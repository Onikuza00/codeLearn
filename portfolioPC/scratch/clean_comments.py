import re
import os

workspace_dir = r"c:\xampp\htdocs\codeLearn\portfolioPC"

def clean_html(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # We want to remove the entire commented out gallery card block:
    # <!-- <div class="card card--gallery"> ... </div> -->
    content = re.sub(r'<!--\s*<div class="card card--gallery">.*?</div>\s*-->', '', content, flags=re.DOTALL)

    # Let's find all HTML comments
    comments = re.findall(r'<!--.*?-->', content, flags=re.DOTALL)
    for comment in comments:
        # Keep if it is a section header (contains ═══ or is JS)
        if '═══' in comment or 'JS' in comment:
            continue
        # Otherwise, remove it
        content = content.replace(comment, '')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Cleaned HTML: {filepath}")

def clean_css(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all CSS comments: /* ... */
    comments = re.findall(r'/\*.*?\*/', content, flags=re.DOTALL)
    for comment in comments:
        # Keep if it is a section header (contains --- or ═══ or ═)
        # Specifically, we want to keep headers like:
        # /* --- HERO --- */, /* ═══ HEADER ═══ */, etc.
        # But we remove comments like /* Hamburguesa */, /* Dim dark gray */, /* Altura automática... */
        normalized = comment.strip()
        is_section_header = (
            '---' in normalized or 
            '═══' in normalized or 
            normalized.startswith('/* ═══') or
            normalized.startswith('/* ═') or
            'NEW SECTIONS' in normalized or
            'CARD SYSTEM' in normalized or
            'SECTION HEAD' in normalized or
            'EXPAND' in normalized or
            'PAGINATION' in normalized or
            'CURTAIN OVERLAY' in normalized
        )
        if is_section_header:
            continue
        # Otherwise, remove it
        content = content.replace(comment, '')

    # Clean double spaces or clean empty lines left by comment removals
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Cleaned CSS: {filepath}")

if __name__ == '__main__':
    clean_html(os.path.join(workspace_dir, "index.html"))
    clean_css(os.path.join(workspace_dir, "css", "components.css"))
    clean_css(os.path.join(workspace_dir, "css", "tokens.css"))
