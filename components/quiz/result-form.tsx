"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

const Result = () => {
    const searchParams = useSearchParams();
    const correctAnswers = parseInt(searchParams.get('correctAnswers') || '0', 10);
    const totalQuestions = parseInt(searchParams.get('totalQuestions') || '0', 10);
    const router = useRouter();

    const completionPercentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

    if (isNaN(correctAnswers) || isNaN(totalQuestions)) {
        return <div>Нет данных для отображения результатов.</div>;
    }

    return (
        <div>
            <h3>Результаты</h3>
            <p>Вы ответили правильно на {correctAnswers} из {totalQuestions} вопросов.</p>
            <p>Процент правильных ответов: {completionPercentage}%</p>
            <Button variant="purple" onClick={() => router.push('/')}>Пройти тест еще раз</Button>
        </div>
    );
};

export default Result;
