import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ pageId: string }> },
) {
    const { pageId } = await params;
    const res = await fetch(`http://127.0.0.1:3001/editLogs/${pageId}`, {
        cache: 'no-store',
    });
    
    if (!res.ok) {
        return NextResponse.json(
            { error: 'Failed to fetch edit logs' },
            { status: res.status }
        );
    }
    
    const data = await res.json();
    return NextResponse.json(data);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ pageId: string }> },
) {
    const { pageId } = await params;
    const res = await fetch(`http://127.0.0.1:3001/editLogs/${pageId}`, {
        method: 'DELETE',
    });
    
    if (!res.ok) {
        return NextResponse.json(
            { error: 'Failed to delete edit logs' },
            { status: res.status }
        );
    }
    
    const data = await res.json();
    return NextResponse.json(data);
}
