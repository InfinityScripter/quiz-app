import { NextRequest, NextResponse } from 'next/server';
import { quizState } from "@/lib/quizState";

// Обработчик для GET-запросов
export async function GET() {
    return NextResponse.json(quizState);
}

// Обработчик для POST-запросов
export async function POST(req: NextRequest) {
    const body = await req.json();
    const { currentQuestionIndex, correctAnswers, userAnswers, questionResults, timeLeft, timerStarted, correctAnswersList } = body;
    quizState.currentQuestionIndex = currentQuestionIndex;
    quizState.correctAnswers = correctAnswers;
    quizState.userAnswers = userAnswers;
    quizState.questionResults = questionResults;
    quizState.timeLeft = timeLeft;
    quizState.timerStarted = timerStarted;
    quizState.correctAnswersList = correctAnswersList;
    return NextResponse.json({ message: 'Quiz state updated' });
}
