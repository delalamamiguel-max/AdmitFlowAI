with open('src/components/TwoLayerIntakeForm.tsx', 'r') as f:
    content = f.read()

content = content.replace('priorTreatment: null,', 'priorTreatment: [],')

with open('src/components/TwoLayerIntakeForm.tsx', 'w') as f:
    f.write(content)
