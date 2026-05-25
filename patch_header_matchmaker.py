import re
import sys

with open('src/components/Header.tsx', 'r') as f:
    content = f.read()

# Make sure Target icon is imported
if 'Target' not in content:
    content = content.replace("Settings } from 'lucide-react';", "Settings, Target } from 'lucide-react';")

# 1. Intake Rep Matchmaker link
intake_rep_nav = """
        {currentUser?.role !== 'SUPER_ADMIN' && (
          <>
            <Link href="/app" style={{ textDecoration: 'none', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Inbox size={16} /> Intake
            </Link>
            {currentUser?.role === 'REP' && (
              <Link href="/app/matchmaker" style={{ textDecoration: 'none', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Target size={16} /> Matchmaker
              </Link>
            )}
          </>
        )}
"""

content = re.sub(r'\{currentUser\?\.role !== \'SUPER_ADMIN\' && \(\s*<Link href="/app".*?Intake\s*</Link>\s*\)\}', intake_rep_nav.strip(), content, flags=re.DOTALL)


# 2. Admin Matchmaker link
admin_nav = """
        {currentUser?.role === 'ADMIN' && (
          <>
            <Link href="/app/reports" style={{ textDecoration: 'none', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <BarChart2 size={16} /> Team Reports
            </Link>
            <Link href="/app/admin/matchmaker" style={{ textDecoration: 'none', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Target size={16} /> Matchmaker
            </Link>
            <Link href="/app/admin/settings" style={{ textDecoration: 'none', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Settings size={16} /> Admin Settings
            </Link>
          </>
        )}
"""

content = re.sub(r'\{currentUser\?\.role === \'ADMIN\' && \(\s*<>\s*<Link href="/app/reports".*?Team Reports\s*</Link>\s*<Link href="/app/admin/settings".*?Admin Settings\s*</Link>\s*</>\s*\)\}', admin_nav.strip(), content, flags=re.DOTALL)

# 3. Super Admin Matchmaker link
super_admin_nav = """
        {currentUser?.role === 'SUPER_ADMIN' && (
          <>
            <Link href="/app/super-admin" style={{ textDecoration: 'none', color: 'var(--color-text)' }}>Dashboard</Link>
            <Link href="/app/super-admin/matchmaker" style={{ textDecoration: 'none', color: 'var(--color-text)' }}>Matchmaker DB</Link>
          </>
        )}
"""

content = re.sub(r'\{currentUser\?\.role === \'SUPER_ADMIN\' && \(\s*<Link href="/app/super-admin".*?Super Admin</Link>\s*\)\}', super_admin_nav.strip(), content, flags=re.DOTALL)


with open('src/components/Header.tsx', 'w') as f:
    f.write(content)

print("Header.tsx patched for matchmaker links.")
