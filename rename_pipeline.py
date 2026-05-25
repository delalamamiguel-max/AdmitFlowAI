def replace_in_file(filepath, replacements):
    with open(filepath, 'r') as f:
        content = f.read()
    for old, new in replacements.items():
        content = content.replace(old, new)
    with open(filepath, 'w') as f:
        f.write(content)

replace_in_file('src/components/Header.tsx', {
    'Admissions Pipeline': 'Admissions Intake',
    '>Pipeline<': '>Intake<'
})

replace_in_file('src/app/app/page.tsx', {
    'Active Pipeline': 'Active Intake',
    '> Pipeline': '> Intake',
    'Return to Pipeline': 'Return to Intake'
})

replace_in_file('src/app/page.tsx', {
    'Track exact pipeline stages instantly': 'Track exact intake stages instantly',
    'keep the pipeline moving forward.': 'keep the intake moving forward.',
    'clinical data in the pipeline.': 'clinical data in the intake process.'
})

replace_in_file('src/app/app/admin/settings/page.tsx', {
    'Return to Pipeline': 'Return to Intake'
})

replace_in_file('src/app/app/super-admin/page.tsx', {
    'Return to Pipeline': 'Return to Intake'
})

