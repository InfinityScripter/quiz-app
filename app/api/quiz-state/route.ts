import { NextRequest, NextResponse } from 'next/server';
import { questions } from "@/lib/questions";

export let quizState = {
    currentQuestionIndex: 0,
    correctAnswers: 0,
    userAnswers: Array(questions.length).fill(''),
    questionResults: Array(questions.length).fill(null),
    timeLeft: 120,
    timerStarted: false,
};

export async function GET() {
    return NextResponse.json(quizState);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { currentQuestionIndex, correctAnswers, userAnswers, questionResults, timeLeft, timerStarted } = body;
    quizState = { currentQuestionIndex, correctAnswers, userAnswers, questionResults, timeLeft, timerStarted };
    return NextResponse.json({ message: 'Quiz state updated' });
}