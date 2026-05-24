import re

# 1. src/app/page.tsx
with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# Add 'use client'
if "'use client';" not in content:
    content = "'use client';\n" + content

# Change Start Your First Intake button text color to standout
content = content.replace(
    "style={{ background: 'var(--color-surface)', color: 'var(--color-brand)', fontSize: '1.125rem', padding: '1rem 2rem' }}",
    "style={{ background: 'var(--color-text)', color: 'var(--color-surface)', fontSize: '1.125rem', padding: '1rem 2rem' }}"
)

# Make Log In clear local storage to force passcode prompt
content = content.replace(
    "<Link href=\"/app\" style={{ textDecoration: 'none', color: 'inherit' }}>Log In</Link>",
    "<Link href=\"/app\" onClick={() => localStorage.removeItem('admitflow_leads')} style={{ textDecoration: 'none', color: 'inherit' }}>Log In</Link>"
)

with open('src/app/page.tsx', 'w') as f:
    f.write(content)

# 2. src/app/app/page.tsx
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

# Hide Worklist/Pipeline and FABs when empty
content = content.replace(
    '<div className="flex bg-[var(--color-surface-glass)] rounded-md p-1 border border-[var(--color-border)]">',
    '{leads.length > 0 && (<div className="flex bg-[var(--color-surface-glass)] rounded-md p-1 border border-[var(--color-border)]">'
)
content = content.replace(
    '</button>\n          </div>\n        </div>\n      </div>',
    '</button>\n          </div>)}\n        </div>\n      </div>'
)

content = content.replace(
    '<div className="fixed bottom-6 right-6 flex items-end gap-4 z-40">',
    '{leads.length > 0 && (<div className="fixed bottom-6 right-6 flex items-end gap-4 z-40">'
)
content = content.replace(
    '<span className="tooltip-text">New Intake</span>\n        </div>\n      </div>',
    '<span className="tooltip-text">New Intake</span>\n        </div>\n      </div>)}'
)

with open('src/app/app/page.tsx', 'w') as f:
    f.write(content)


# 3. src/components/TwoLayerIntakeForm.tsx
with open('src/components/TwoLayerIntakeForm.tsx', 'r') as f:
    content = f.read()

# Fix handleSave event typing and submit button
content = content.replace('const handleSave = async (e: React.FormEvent) => {', 'const handleSave = async (e?: React.FormEvent) => {\n    if (e) e.preventDefault();')

# Add missing fields alerts
content = content.replace(
    'if (!clientName || !cryptoKey) return;',
    'if (!clientName) {\n      alert("Client Name is required.");\n      setStep(1);\n      return;\n    }\n    if (!cryptoKey) {\n      alert("System locked. Please refresh to enter your password.");\n      return;\n    }'
)

# Remove form attribute and make it use onClick
content = content.replace(
    '<button form="intake-form" type="submit" className="btn btn-primary" disabled={loading}>',
    '<button type="button" onClick={handleSave} className="btn btn-primary" disabled={loading}>'
)
# Do the same for the step 1 "Save & Exit" button
content = content.replace(
    '<button form="intake-form" type="submit" className="btn btn-ghost" disabled={loading}>',
    '<button type="button" onClick={handleSave} className="btn btn-ghost" disabled={loading}>'
)

# Improve the modal backdrop glassmorphism
content = content.replace(
    'className="modal-overlay p-0 md:p-4"',
    'className="modal-overlay p-0 md:p-4" style={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(0,0,0,0.3)" }}'
)

# Add a subtle background glow so glassmorphism is visible on the empty modal
content = content.replace(
    '<div className="modal-content glass-panel max-w-3xl w-full h-full md:h-auto flex flex-col md:rounded-xl rounded-none p-0 md:p-8" onClick={e => e.stopPropagation()}>',
    '<div className="modal-content glass-panel max-w-3xl w-full h-full md:h-auto flex flex-col md:rounded-xl rounded-none p-0 md:p-8 relative overflow-hidden" onClick={e => e.stopPropagation()}>\n        <div className="absolute top-0 right-0 w-64 h-64 bg-brand opacity-10 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>'
)

with open('src/components/TwoLayerIntakeForm.tsx', 'w') as f:
    f.write(content)

