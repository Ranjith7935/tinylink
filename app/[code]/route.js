import { NextResponse } from 'next/server';
import { getLinkByCode, incrementClicks } from '@/lib/db';

export async function GET(request, props) {
  const params = await props.params;
  
  try {
    const link = await getLinkByCode(params.code);

    if (!link) {
      return new NextResponse('Not Found', { status: 404 });
    }

    incrementClicks(params.code).catch(err => 
      console.error('Error incrementing clicks:', err)
    );

    return NextResponse.redirect(link.url, { status: 302 });
  } catch (error) {
    console.error('Error redirecting:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}