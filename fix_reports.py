import re

# Update Reports Page
with open('src/app/app/reports/page.tsx', 'r') as f:
    content = f.read()

# 1. Add currentUser to useLeads and useEffect for auth redirect
# It already has: const { leads } = useLeads();
content = content.replace("  const { leads } = useLeads();", "  const { leads, currentUser } = useLeads();\n\n  if (currentUser?.role !== 'ADMIN') {\n    return (\n      <main className=\"flex-1 p-6 flex flex-col items-center justify-center text-center\">\n        <h1 className=\"text-3xl font-bold mb-4 text-[var(--color-sla-breached)]\">Unauthorized</h1>\n        <p className=\"text-muted mb-8\">You must be an Admin to view Team Reports.</p>\n        <Link href=\"/app\" className=\"btn btn-primary\">Return to Pipeline</Link>\n      </main>\n    );\n  }")

# 2. Remove Back Button and update timeframe toggle
header_section_old = """      <div className="flex items-center gap-4 mb-8">
        <Link href="/app" className="btn btn-ghost">
          <ArrowLeft size={20} /> Back
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Advanced Reports</h1>
          <p className="text-muted">Analyze your pipeline performance</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 glass-panel p-1 rounded-lg w-fit">
        {(['daily', 'weekly', 'monthly'] as Timeframe[]).map(tf => (
          <button
            key={tf}
            className={`btn btn-sm ${timeframe === tf ? 'bg-[var(--color-surface)] shadow text-[var(--color-text)] border-none' : 'btn-ghost border-transparent'}`}
            onClick={() => setTimeframe(tf)}
          >
            {tf.charAt(0).toUpperCase() + tf.slice(1)}
          </button>
        ))}
      </div>"""

header_section_new = """      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Team Reports</h1>
          <p className="text-muted">Analyze your team's pipeline performance</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 p-1 rounded-lg w-fit" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', display: 'flex', gap: '0.5rem', padding: '0.25rem' }}>
        {(['daily', 'weekly', 'monthly'] as Timeframe[]).map(tf => (
          <button
            key={tf}
            className={`capitalize`}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: timeframe === tf ? 'var(--color-brand)' : 'transparent',
              color: timeframe === tf ? 'var(--color-surface)' : 'var(--color-text)',
              transition: 'all 0.2s ease',
              boxShadow: timeframe === tf ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
            }}
            onClick={() => setTimeframe(tf)}
          >
            {tf}
          </button>
        ))}
      </div>"""

content = content.replace(header_section_old, header_section_new)

with open('src/app/app/reports/page.tsx', 'w') as f:
    f.write(content)

# Update Header
with open('src/components/Header.tsx', 'r') as f:
    header = f.read()

header = header.replace("""        {currentUser?.role !== 'SUPER_ADMIN' && (
          <>
            <Link href="/app" style={{ textDecoration: 'none', color: 'var(--color-text)' }}>Pipeline</Link>
            <Link href="/app/reports" style={{ textDecoration: 'none', color: 'var(--color-text)' }}>Reports</Link>
          </>
        )}
        {currentUser?.role === 'ADMIN' && (
          <Link href="/app/admin" style={{ textDecoration: 'none', color: 'var(--color-text)' }}>Admin Dashboard</Link>
        )}""", """        {currentUser?.role !== 'SUPER_ADMIN' && (
          <Link href="/app" style={{ textDecoration: 'none', color: 'var(--color-text)' }}>Pipeline</Link>
        )}
        {currentUser?.role === 'ADMIN' && (
          <>
            <Link href="/app/reports" style={{ textDecoration: 'none', color: 'var(--color-text)' }}>Team Reports</Link>
            <Link href="/app/admin" style={{ textDecoration: 'none', color: 'var(--color-text)' }}>Admin Settings</Link>
          </>
        )}""")

with open('src/components/Header.tsx', 'w') as f:
    f.write(header)

