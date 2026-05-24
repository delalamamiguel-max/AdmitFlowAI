import re

# 1. admin/page.tsx
with open('src/app/app/admin/page.tsx', 'r') as f:
    content = f.read()
content = content.replace('import { Users, Settings, Clock, Inbox, CheckCircle, ArrowLeft } from \'lucide-react\';', 'import { Users, Settings, Inbox, ArrowLeft } from \'lucide-react\';')
with open('src/app/app/admin/page.tsx', 'w') as f:
    f.write(content)

# 2. app/page.tsx
with open('src/app/app/page.tsx', 'r') as f:
    content = f.read()
content = content.replace('import { LeadStatus, Lead } from \'@/lib/types\';', 'import { LeadStatus } from \'@/lib/types\';')
content = content.replace('import { Header } from \'@/components/Header\';\n', '')
with open('src/app/app/page.tsx', 'w') as f:
    f.write(content)

# 3. super-admin/page.tsx
with open('src/app/app/super-admin/page.tsx', 'r') as f:
    content = f.read()
content = content.replace('import { Building, DollarSign, Activity, Settings, ArrowLeft } from \'lucide-react\';', 'import { Building, DollarSign, Activity, ArrowLeft } from \'lucide-react\';')
with open('src/app/app/super-admin/page.tsx', 'w') as f:
    f.write(content)

# 4. root page.tsx (unescaped quotes)
with open('src/app/page.tsx', 'r') as f:
    content = f.read()
content = content.replace('It\'s completely changed', 'It&apos;s completely changed')
content = content.replace('haven\'t breached', 'haven&apos;t breached')
with open('src/app/page.tsx', 'w') as f:
    f.write(content)

# 5. LeadModal.tsx
with open('src/components/LeadModal.tsx', 'r') as f:
    content = f.read()
content = content.replace('import { LeadStatus, Lead } from \'@/lib/types\';', 'import { LeadStatus } from \'@/lib/types\';')
content = content.replace('onClick={(e) =>', 'onClick={(_e) =>')
with open('src/components/LeadModal.tsx', 'w') as f:
    f.write(content)

# 6. TwoLayerIntakeForm.tsx
with open('src/components/TwoLayerIntakeForm.tsx', 'r') as f:
    lines = f.readlines()
with open('src/components/TwoLayerIntakeForm.tsx', 'w') as f:
    for line in lines:
        if 'const [permissionToLeaveVoicemail' in line: continue
        if 'const [admitTimeline' in line: continue
        if 'const [inNetworkRequired' in line: continue
        if 'const [priorTreatment' in line: continue
        f.write(line)

