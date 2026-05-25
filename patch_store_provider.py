import re

with open('src/lib/store.tsx', 'r') as f:
    content = f.read()

# Add addClient and addTherapist implementations
impl = """
  const addClient = (client: Client) => {
    setClients(prev => [...prev, client]);
  };

  const addTherapist = (clientId: string, therapist: Therapist) => {
    setClients(prev => prev.map(c => 
      c.id === clientId ? { ...c, personnel: [...c.personnel, therapist] } : c
    ));
  };
"""

# Find updateClient and insert after it
content = content.replace("const updateClient = (clientId: string, updates: Partial<Client>) => {", 
                          impl.strip() + "\n\n  const updateClient = (clientId: string, updates: Partial<Client>) => {")


# Also need to provide them in the value
# Search for `currentUser, addLead, updateUser, deleteUser`
content = content.replace("currentUser, addLead, updateUser, deleteUser, updateClient,", 
                          "currentUser, addLead, updateUser, deleteUser, updateClient, addClient, addTherapist,")

# If it didn't match perfectly, let's just use regex
content = re.sub(r'currentUser,\s*addLead,\s*addUser,\s*updateUser,\s*deleteUser,\s*updateClient,\s*updateGlobalSettings,',
                 r'currentUser, addLead, addUser, updateUser, deleteUser, updateClient, addClient, addTherapist, updateGlobalSettings,', content)

with open('src/lib/store.tsx', 'w') as f:
    f.write(content)
print("done")
