import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ pageId: string }> },
) {
    const { pageId } = await params;
    const res = await fetch(`http://127.0.0.1:3001/pages/published/${pageId}`, {
        cache: 'no-store',
    });
    
    if (!res.ok) {
        return NextResponse.json(
            { error: 'Failed to fetch published page' },
            { status: res.status }
        );
    }
    
    const data = await res.json();
    return NextResponse.json(data);
}
