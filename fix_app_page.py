import re

with open('src/app/app/page.tsx', 'r') as f:
    content = f.read()

# Fix the empty state button positions and add an onClick to the icon
content = content.replace(
    'className="h-16 w-16 bg-[var(--color-brand)] text-[var(--color-surface)] rounded-full flex items-center justify-center absolute -top-8 shadow-lg"',
    'className="h-16 w-16 bg-[var(--color-brand)] text-[var(--color-surface)] rounded-full flex items-center justify-center mb-4 shadow-lg cursor-pointer hover:scale-105 transition-transform" onClick={() => setShowNewLeadForm(true)}'
)
content = content.replace(
    'className="btn btn-primary absolute -bottom-6 shadow-lg"',
    'className="btn btn-primary shadow-lg mt-6"'
)
content = content.replace(
    'className="glass-panel p-12 flex flex-col items-center justify-center text-center max-w-2xl mx-auto mt-12 relative"',
    'className="glass-panel p-12 flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-12 relative"'
)

# Hide Worklist/Pipeline
content = content.replace(
    '<div className="flex bg-[var(--color-surface-glass)] rounded-md p-1 border border-[var(--color-border)]">',
    '{leads.length > 0 && (<div className="flex bg-[var(--color-surface-glass)] rounded-md p-1 border border-[var(--color-border)]">'
)
content = content.replace(
    'onClick={() => setViewMode(\'pipeline\')}\n            >\n              <Trello size={18} /> Pipeline\n            </button>\n          </div>',
    'onClick={() => setViewMode(\'pipeline\')}\n            >\n              <Trello size={18} /> Pipeline\n            </button>\n          </div>)}'
)

# Hide FABs
content = content.replace(
    '<div className="fixed bottom-6 right-6 flex gap-sm z-40">',
    '{leads.length > 0 && (<div className="fixed bottom-6 right-6 flex gap-sm z-40">'
)
content = content.replace(
    '<span className="tooltip-text">New Intake</span>\n        </div>\n      </div>',
    '<span className="tooltip-text">New Intake</span>\n        </div>\n      </div>)}'
)

with open('src/app/app/page.tsx', 'w') as f:
    f.write(content)
