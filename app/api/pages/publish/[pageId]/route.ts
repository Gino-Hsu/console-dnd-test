import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ pageId: string }> },
) {
    const { pageId } = await params;
    const body = await request.json();
    
    const res = await fetch(`http://127.0.0.1:3001/pages/publish/${pageId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    
    if (!res.ok) {
        return NextResponse.json(
            { error: 'Failed to publish page' },
            { status: res.status }
        );
    }
    
    const data = await res.json();
    return NextResponse.json(data);
}
