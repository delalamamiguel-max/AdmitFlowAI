with open('src/app/app/admin/settings/page.tsx', 'r') as f:
    content = f.read()

# Extract the modal block
modal_start = "{/* SLA Modal */}"
modal_end = "  const [showReassignModal"

parts = content.split(modal_start)
pre_modal = parts[0]

modal_block_with_rest = parts[1]
modal_block_end_index = modal_block_with_rest.find("      </main>")
modal_content = modal_block_with_rest[:modal_block_end_index]
rest_of_early_return = modal_block_with_rest[modal_block_end_index:]

# Clean up the early return
fixed_early_return = pre_modal + "      </main>\n    );\n  }"

# Now find the true </main> at the end
# The script replaced the first </main>. So I need to place the modal content before the very last </main>.

# Let's just recreate the file cleanly using replace_file_content.
