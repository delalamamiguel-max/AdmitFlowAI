import re

with open('src/components/TwoLayerIntakeForm.tsx', 'r') as f:
    content = f.read()

content = content.replace('if (e) e.preventDefault();\n    e.preventDefault();', 'if (e) e.preventDefault();')

with open('src/components/TwoLayerIntakeForm.tsx', 'w') as f:
    f.write(content)
