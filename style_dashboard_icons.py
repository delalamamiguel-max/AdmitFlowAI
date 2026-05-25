with open('src/app/app/admin/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Inbox size={24} /> Intake</h2>',
    '<h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><div className="p-2 rounded-full bg-[var(--color-brand)] text-white"><Inbox size={24} /></div> Intake</h2>'
)
content = content.replace(
    '<h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><BarChart2 size={24} /> Team Reports</h2>',
    '<h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><div className="p-2 rounded-full bg-[var(--color-brand)] text-white"><BarChart2 size={24} /></div> Team Reports</h2>'
)
content = content.replace(
    '<h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Settings size={24} /> Admin Settings</h2>',
    '<h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><div className="p-2 rounded-full bg-[var(--color-brand)] text-white"><Settings size={24} /></div> Admin Settings</h2>'
)

with open('src/app/app/admin/page.tsx', 'w') as f:
    f.write(content)
