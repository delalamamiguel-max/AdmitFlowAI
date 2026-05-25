with open('src/app/app/admin/settings/page.tsx', 'r') as f:
    content = f.read()

# Add state
state_import = "const [showReassignModal, setShowReassignModal] = useState(false);"
new_state = state_import + "\n  const [showSlaModal, setShowSlaModal] = useState(false);\n  const [slaConfigs, setSlaConfigs] = useState({ new: 15, qualifying: 120 });"
content = content.replace(state_import, new_state)

# Replace the SLA Configurations card
old_sla_card = """          <section className="glass-panel p-6">
            <div className="mb-4 border-b border-[var(--color-border)] pb-4">
              <h2 className="text-xl font-bold">SLA Configurations</h2>
              <p className="text-sm text-muted">Adjust the breach timers for intake stages.</p>
            </div>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex justify-between items-center p-3 rounded bg-[var(--color-surface)]">
                <span>New Inquiry (Fresh)</span>
                <span className="font-bold">15 minutes</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded bg-[var(--color-surface)]">
                <span>Qualifying</span>
                <span className="font-bold">2 hours</span>
              </div>
              <button className="btn btn-ghost btn-sm text-[var(--color-brand)] mt-2">Edit SLAs...</button>
            </div>
          </section>"""

new_sla_card = """          <section className="glass-panel p-6">
            <div className="mb-4 border-b border-[var(--color-border)] pb-4">
              <h2 className="text-xl font-bold">SLA Configurations</h2>
              <p className="text-sm text-muted">Adjust the breach timers for intake stages.</p>
            </div>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex justify-between items-center p-3 rounded bg-[var(--color-surface)]">
                <span>New Inquiry (Fresh)</span>
                <span className="font-bold">{slaConfigs.new} minutes</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded bg-[var(--color-surface)]">
                <span>Qualifying</span>
                <span className="font-bold">{slaConfigs.qualifying} minutes</span>
              </div>
              <button 
                className="btn btn-ghost btn-sm text-[var(--color-brand)] mt-2"
                onClick={() => setShowSlaModal(true)}
              >
                Edit SLAs...
              </button>
            </div>
          </section>"""
content = content.replace(old_sla_card, new_sla_card)

# Add SLA Modal
new_modal = """      {/* SLA Modal */}
      {showSlaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">Edit SLAs</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              setShowSlaModal(false);
              alert('SLA settings updated successfully!');
            }} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">New Inquiry (minutes)</label>
                <input required type="number" min="1" className="input w-full" value={slaConfigs.new} onChange={(e) => setSlaConfigs({ ...slaConfigs, new: parseInt(e.target.value) || 15 })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Qualifying (minutes)</label>
                <input required type="number" min="1" className="input w-full" value={slaConfigs.qualifying} onChange={(e) => setSlaConfigs({ ...slaConfigs, qualifying: parseInt(e.target.value) || 120 })} />
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <button type="button" className="btn btn-ghost" onClick={() => setShowSlaModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save SLAs</button>
              </div>
            </form>
          </div>
        </div>
      )}
"""
content = content.replace("    </main>", new_modal + "\n    </main>")

with open('src/app/app/admin/settings/page.tsx', 'w') as f:
    f.write(content)
