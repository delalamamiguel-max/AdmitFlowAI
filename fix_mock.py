with open('src/lib/store.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "disposition: 'qualified',",
    "lastContactTimestamp: null,\n        disposition: 'qualified',"
)

with open('src/lib/store.tsx', 'w') as f:
    f.write(content)

