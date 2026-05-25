with open('src/app/app/page.tsx', 'r') as f:
    content = f.read()

# Add Drafts to COLUMNS
old_columns = """const COLUMNS = [
  { id: 'new', title: 'New', color: 'var(--color-sla-fresh)' },"""
new_columns = """const COLUMNS = [
  { id: 'draft', title: 'Drafts', color: 'var(--color-text)' },
  { id: 'new', title: 'New', color: 'var(--color-sla-fresh)' },"""
content = content.replace(old_columns, new_columns)

# Remove the Daily Report icon but keep the generic floating plus if needed?
# Actually, the plus is the New Intake button. Let's only remove the Daily Report one.
# It looks like this:
old_daily_report = """        <div className="tooltip-container">
          <Link 
            href="/app/reports"
            className="btn btn-primary shadow-lg rounded-full h-14 w-14 p-0 flex items-center justify-center" 
          >
            <BarChart2 size={24} />
          </Link>
          <span className="tooltip-text">Daily Report</span>
        </div>"""

content = content.replace(old_daily_report, "")

with open('src/app/app/page.tsx', 'w') as f:
    f.write(content)
