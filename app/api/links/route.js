import { NextResponse } from 'next/server';
import { createLink, getLinks, getLinkByCode } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { url, code } = body;

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    let shortCode = code;
    if (!shortCode) {
      shortCode = generateCode();
    }

    if (!/^[A-Za-z0-9]{6,8}$/.test(shortCode)) {
      return NextResponse.json(
        { error: 'Code must be 6-8 alphanumeric characters' },
        { status: 400 }
      );
    }

    const existing = await getLinkByCode(shortCode);
    if (existing) {
      return NextResponse.json(
        { error: 'Code already exists' },
        { status: 409 }
      );
    }

    const link = await createLink(shortCode, url);
    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const links = await getLinks();
    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}