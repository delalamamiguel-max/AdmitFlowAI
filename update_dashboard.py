with open('src/app/app/admin/page.tsx', 'r') as f:
    content = f.read()

if 'import { Inbox, BarChart2, Settings } from' not in content:
    content = content.replace(
        "import Link from 'next/link';",
        "import Link from 'next/link';\nimport { Inbox, BarChart2, Settings } from 'lucide-react';"
    )

content = content.replace(
    '<h2 className="text-2xl font-bold mb-2">Intake</h2>',
    '<h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Inbox size={24} /> Intake</h2>'
)
content = content.replace(
    '<h2 className="text-2xl font-bold mb-2">Team Reports</h2>',
    '<h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><BarChart2 size={24} /> Team Reports</h2>'
)
content = content.replace(
    '<h2 className="text-2xl font-bold mb-2">Admin Settings</h2>',
    '<h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Settings size={24} /> Admin Settings</h2>'
)

with open('src/app/app/admin/page.tsx', 'w') as f:
    f.write(content)
