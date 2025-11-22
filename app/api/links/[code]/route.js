import { NextResponse } from 'next/server';
import { getLinkByCode, deleteLink } from '@/lib/db';

export async function GET(request, props) {
  const params = await props.params;
  
  try {
    const link = await getLinkByCode(params.code);
    
    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(link);
  } catch (error) {
    console.error('Error fetching link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, props) {
  const params = await props.params;
  
  try {
    const link = await getLinkByCode(params.code);
    
    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    await deleteLink(params.code);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}