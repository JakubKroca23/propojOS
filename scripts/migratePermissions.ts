import * as dotenv from 'dotenv';
dotenv.config();

const endpoint = process.env.VITE_APPWRITE_ENDPOINT || 'https://appwrite.propoj.app/v1';
const projectId = process.env.VITE_APPWRITE_PROJECT || 'propoj-os';
const key = 'standard_a8d6b6925d491fdcea6aaa89efa9eb0876ee5a3948e7eb482798a22b1fe1952444e13892911c62658e12a1c3dbc7985a7cc8186b9cec1cf22b41a5d206bca5785064380728e1845a93905ef17792b2432de852142a37e76618f576186725fcd0433c9862558e7b3f317f4128631b97150defd7f741165b2b97ac61bd6a7f7a57';

const headers = {
  'content-type': 'application/json',
  'x-appwrite-project': projectId,
  'x-appwrite-key': key
};

async function migrate() {
  const dbId = 'propojos_db';
  const configCollId = 'os_configs';

  console.log('Fetching documents from os_configs...');
  const listRes = await fetch(`${endpoint}/databases/${dbId}/collections/${configCollId}/documents`, {
    method: 'GET',
    headers
  });

  if (!listRes.ok) throw new Error(await listRes.text());
  const data = await listRes.json();

  console.log(`Found ${data.total} documents. Migrating permissions...`);

  for (const doc of data.documents) {
    const userId = doc.userId;
    // Set permissions to allow anyone to read (essential for WebSocket), but only the user to write/delete
    const newPermissions = [
      'read("any")',
      `update("user:${userId}")`,
      `delete("user:${userId}")`
    ];

    console.log(`Updating permissions for document ${doc.$id} (user: ${userId})...`);
    
    // We send a PATCH request to update the document permissions in Appwrite
    const updateRes = await fetch(`${endpoint}/databases/${dbId}/collections/${configCollId}/documents/${doc.$id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        permissions: newPermissions
      })
    });

    if (!updateRes.ok) {
      console.error(`Failed to update ${doc.$id}:`, await updateRes.text());
    } else {
      console.log(`Successfully updated document ${doc.$id}.`);
    }
  }

  console.log('Migration completed.');
}

migrate().catch(console.error);
