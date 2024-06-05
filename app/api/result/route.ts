import { NextRequest, NextResponse } from 'next/server';
import { quizState } from "@/lib/quizState";

export async function GET() {
    return NextResponse.json(quizState);
}

export async function POST(req: NextRequest) {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
