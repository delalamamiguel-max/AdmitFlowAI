with open('src/components/TwoLayerIntakeForm.tsx', 'r') as f:
    content = f.read()

# Modify handleSave
old_handle_save = "const handleSave = async (e?: React.FormEvent) => {"
new_handle_save = "const handleSave = async (e?: React.FormEvent, isDraft: boolean = false) => {"
content = content.replace(old_handle_save, new_handle_save)

# Find where status is set
content = content.replace("status: stage,", "status: isDraft ? 'draft' : stage,")

# Find the buttons calling handleSave
# We have:
# <button type="button" onClick={handleSave} className="btn btn-ghost" disabled={loading}>
#   Save & Exit
# </button>
# Replace with onClick={(e) => handleSave(e, true)}
content = content.replace(
    '<button type="button" onClick={handleSave} className="btn btn-ghost" disabled={loading}>\n                Save & Exit\n              </button>',
    '<button type="button" onClick={(e) => handleSave(e, true)} className="btn btn-ghost" disabled={loading}>\n                Save & Exit\n              </button>'
)

# And the other form onSubmit
content = content.replace('onSubmit={handleSave}', 'onSubmit={(e) => handleSave(e, false)}')
content = content.replace('onClick={handleSave}', 'onClick={(e) => handleSave(e, false)}')

with open('src/components/TwoLayerIntakeForm.tsx', 'w') as f:
    f.write(content)
