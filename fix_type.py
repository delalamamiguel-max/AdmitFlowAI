with open('src/components/TwoLayerIntakeForm.tsx', 'r') as f:
    content = f.read()

content = content.replace('permissionToLeaveVoicemail,', 'permissionToLeaveVoicemail: false,')
content = content.replace('admitTimeline,', 'admitTimeline: null,')
content = content.replace('inNetworkRequired,', 'inNetworkRequired: false,')
content = content.replace('priorTreatment,', 'priorTreatment: null,')
content = content.replace('nextActionOwner,', 'nextActionOwner: null,')

with open('src/components/TwoLayerIntakeForm.tsx', 'w') as f:
    f.write(content)
