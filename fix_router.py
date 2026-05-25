with open('src/app/app/page.tsx', 'r') as f:
    content = f.read()

content = content.replace("  const router = useRouter();\n\n  const router = useRouter();", "  const router = useRouter();")

with open('src/app/app/page.tsx', 'w') as f:
    f.write(content)
