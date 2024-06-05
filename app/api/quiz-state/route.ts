import { NextRequest, NextResponse } from 'next/server';

let quizState = {
    currentQuestionIndex: 0,
    correctAnswers: 0,
    timeLeft: 30,
    timerStarted: false,
};

export async function GET() {
    return NextResponse.json(quizState);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { currentQuestionIndex, correctAnswers, timeLeft, timerStarted } = body;
    quizState = { currentQuestionIndex, correctAnswers, timeLeft, timerStarted };
    return NextResponse.json({ message: 'Quiz state updated' });
}
