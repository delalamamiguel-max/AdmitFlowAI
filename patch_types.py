with open('src/lib/types.ts', 'r') as f:
    content = f.read()

content = content.replace(
"""export interface User {
  id: string;
  email: string;
  role: UserRole;
  locationId?: string;
  name: string;
}""",
"""export interface User {
  id: string;
  email: string;
  role: UserRole;
  locationId?: string;
  name: string;
  status?: 'active' | 'disabled';
}"""
)

with open('src/lib/types.ts', 'w') as f:
    f.write(content)
