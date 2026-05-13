import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    
    const res = await fetch(`http://127.0.0.1:3001/editLogs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    
    if (!res.ok) {
        return NextResponse.json(
            { error: 'Failed to append edit log' },
            { status: res.status }
        );
    }
    
    const data = await res.json();
    return NextResponse.json(data);
}
