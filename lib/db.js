import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function getLinks() {
  return await sql`
    SELECT * FROM links ORDER BY created_at DESC
  `;
}

export async function getLinkByCode(code) {
  const result = await sql`
    SELECT * FROM links WHERE code = ${code}
  `;
  return result[0] || null;
}

export async function createLink(code, url) {
  const result = await sql`
    INSERT INTO links (code, url)
    VALUES (${code}, ${url})
    RETURNING *
  `;
  return result[0];
}

export async function deleteLink(code) {
  await sql`DELETE FROM links WHERE code = ${code}`;
}

export async function incrementClicks(code) {
  await sql`
    UPDATE links 
    SET clicks = clicks + 1, last_clicked = NOW()
    WHERE code = ${code}
  `;
}