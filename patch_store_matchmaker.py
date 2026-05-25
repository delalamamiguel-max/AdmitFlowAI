import re
import sys

with open('src/lib/store.tsx', 'r') as f:
    content = f.read()

# 1. Update the defaultClients initialization in the useEffect to have more clients and therapists
default_clients_replacement = """      const defaultClients: Client[] = [
        { 
          id: 'client_1', 
          name: 'Serenity Rehab Center', 
          email: 'admin@serenity.com', 
          accessEmails: 'billing@serenity.com', 
          status: 'active', 
          users: 12, 
          mrr: 2400,
          premiumMatchmakingEnabled: true,
          services: ['detox', 'residential', 'php', 'iop'],
          specialties: ['dual_diagnosis', 'trauma', 'substance_abuse', 'executive_burnout'],
          matchmakerConfig: { servicesWeight: 40, specialtiesWeight: 30, personnelWeight: 30 },
          personnel: [
            { id: 't1', name: 'Dr. Sarah Jenkins', role: 'Lead Therapist', certifications: ['LCSW', 'EMDR'], psychographics: ['direct', 'analytical', 'highly_structured'] },
            { id: 't2', name: 'Mark Rivers', role: 'Counselor', certifications: ['CADC'], psychographics: ['gentle', 'flexible', 'group_oriented'] }
          ]
        },
        { 
          id: 'client_2', 
          name: 'Oceanside Sober Living', 
          email: 'hello@oceanside.com', 
          accessEmails: '', 
          status: 'active', 
          users: 5, 
          mrr: 1000,
          premiumMatchmakingEnabled: false,
          services: ['sober_living', 'iop', 'op'],
          specialties: ['substance_abuse', 'mens_only'],
          matchmakerConfig: { servicesWeight: 70, specialtiesWeight: 30, personnelWeight: 0 },
          personnel: [
             { id: 't3', name: 'James Doe', role: 'House Manager', certifications: ['Peer Support'], psychographics: ['firm', 'community_focused'] }
          ]
        },
        { 
          id: 'client_3', 
          name: 'Pinnacle Recovery', 
          email: 'admissions@pinnaclerecovery.com', 
          accessEmails: '', 
          status: 'active', 
          users: 8, 
          mrr: 1500,
          premiumMatchmakingEnabled: true,
          services: ['residential', 'php'],
          specialties: ['eating_disorders', 'trauma', 'womens_only'],
          matchmakerConfig: { servicesWeight: 50, specialtiesWeight: 40, personnelWeight: 10 },
          personnel: [
             { id: 't4', name: 'Emily Clark', role: 'Clinical Director', certifications: ['PhD', 'LPC'], psychographics: ['nurturing', 'creative', 'flexible'] },
             { id: 't5', name: 'Dr. John Smith', role: 'Psychiatrist', certifications: ['MD'], psychographics: ['analytical', 'direct', 'medical_focused'] }
          ]
        }
      ];"""

content = re.sub(r'const defaultClients: Client\[\] = \[.*?\];', default_clients_replacement, content, flags=re.DOTALL)


# 2. Add addClient and addTherapist functions to the Context Provider return value and interface
context_interface_replacement = """
  updateGlobalSettings: (updates: Partial<GlobalMatchmakerSettings>) => void;
  addClient: (client: Client) => void;
  addTherapist: (clientId: string, therapist: Therapist) => void;
}
"""
content = re.sub(r'updateGlobalSettings: \(updates: Partial<GlobalMatchmakerSettings>\) => void;\n\}', context_interface_replacement.strip() + '\n}', content)


actions_replacement = """
  const updateGlobalSettings = (updates: Partial<GlobalMatchmakerSettings>) => {
    setGlobalSettings(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('admitflow_global_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const addClient = (client: Client) => {
    setClients(prev => {
      const updated = [...prev, client];
      localStorage.setItem('admitflow_clients', JSON.stringify(updated));
      return updated;
    });
  };

  const addTherapist = (clientId: string, therapist: Therapist) => {
    setClients(prev => {
      const updated = prev.map(c => {
        if (c.id === clientId) {
          return { ...c, personnel: [...(c.personnel || []), therapist] };
        }
        return c;
      });
      localStorage.setItem('admitflow_clients', JSON.stringify(updated));
      return updated;
    });
  };
"""

content = re.sub(r'const updateGlobalSettings.*?\}\);[\s]*\};', actions_replacement.strip(), content, flags=re.DOTALL)


return_stmt = """
    updateGlobalSettings,
    addClient,
    addTherapist
  }}>
"""

content = re.sub(r'updateGlobalSettings\n\s*\}\}>', return_stmt.strip() + '\n    ', content)

with open('src/lib/store.tsx', 'w') as f:
    f.write(content)

print("store.tsx updated.")
