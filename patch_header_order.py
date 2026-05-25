with open('src/components/Header.tsx', 'r') as f:
    content = f.read()

old_nav = """        {currentUser?.role !== 'SUPER_ADMIN' && (
          <Link href="/app" style={{ textDecoration: 'none', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Inbox size={16} /> Intake
          </Link>
        )}
        {currentUser?.role === 'ADMIN' && (
          <>
            <Link href="/app/admin" style={{ textDecoration: 'none', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link href="/app/reports" style={{ textDecoration: 'none', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <BarChart2 size={16} /> Team Reports
            </Link>
            <Link href="/app/admin/settings" style={{ textDecoration: 'none', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Settings size={16} /> Admin Settings
            </Link>
          </>
        )}"""

new_nav = """        {currentUser?.role === 'ADMIN' && (
          <Link href="/app/admin" style={{ textDecoration: 'none', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <LayoutDashboard size={16} /> Dashboard
          </Link>
        )}
        {currentUser?.role !== 'SUPER_ADMIN' && (
          <Link href="/app" style={{ textDecoration: 'none', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Inbox size={16} /> Intake
          </Link>
        )}
        {currentUser?.role === 'ADMIN' && (
          <>
            <Link href="/app/reports" style={{ textDecoration: 'none', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <BarChart2 size={16} /> Team Reports
            </Link>
            <Link href="/app/admin/settings" style={{ textDecoration: 'none', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Settings size={16} /> Admin Settings
            </Link>
          </>
        )}"""

content = content.replace(old_nav, new_nav)

with open('src/components/Header.tsx', 'w') as f:
    f.write(content)
