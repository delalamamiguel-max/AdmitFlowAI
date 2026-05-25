import re
import sys

with open('src/app/app/super-admin/page.tsx', 'r') as f:
    content = f.read()

# The Architectural Mapping section is likely a div or card.
# Let's search for "Global Architectural Mapping" and remove the entire card.

pattern = r'<div className="card p-lg mb-lg">.*?<h3 className="font-semibold text-lg flex items-center gap-xs"><Settings size=\{20\} /> Global Architectural Mapping</h3>.*?</div>\s*</div>\s*</div>'

# The regex might be tricky. Let's just do a string replacement for the specific block.
