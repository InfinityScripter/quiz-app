"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

const ResultForm = () => {
    const searchParams = useSearchParams();
    const correctAnswers = parseInt(searchParams.get('correctAnswers') || '0', 10);
    const totalQuestions = parseInt(searchParams.get('totalQuestions') || '0', 10);
    const router = useRouter();

    const completionPercentage = ((correctAnswers / totalQuestions) * 100).toFixed(0);

    const handleRetry = async () => {
        await fetch('/api/quiz-state', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currentQuestionIndex: 0,
                correctAnswers: 0,
                timeLeft: 30,
                timerStarted: false
            }),
        });
        router.push('/');
    };

    if (isNaN(correctAnswers) || isNaN(totalQuestions)) {
        return <div>Нет данных для отображения результатов.</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center  bg-gray-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-2xl font-bold mb-4">Результаты</h3>
                <p className="text-lg">Вы ответили правильно на <span className="font-bold text-purple-600">{correctAnswers}</span> из <span className="font-bold text-purple-600">{totalQuestions}</span> вопросов.</p>
                <p className="text-lg mb-4">Процент правильных ответов: <span className="font-bold text-purple-600">{completionPercentage}%</span></p>
                <div className="flex justify-center">
                    <Button variant="purple" onClick={handleRetry}>Пройти тест еще раз</Button>
                </div>
            </div>
        </div>
    );
};

export default ResultForm;
