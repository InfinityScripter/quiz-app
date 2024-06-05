"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { questions } from "@/lib/questions";
import { PuffLoader as Spinner } from "react-spinners";

const ResultForm = () => {
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(questions.length);
    const [userAnswers, setUserAnswers] = useState<Array<string | string[]>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchQuizState = async () => {
            const response = await fetch('/api/quiz-state');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCorrectAnswers(data.correctAnswers);
            setTotalQuestions(questions.length);
            setUserAnswers(data.userAnswers || []);
            setIsLoading(false);
        };

        fetchQuizState().catch((error) => {
            console.error('Fetch quiz state failed:', error);
            setIsLoading(false);
        });
    }, []);

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
                userAnswers: Array(questions.length).fill(''),
                questionResults: Array(questions.length).fill(null),
                timeLeft: 100,
                timerStarted: false
            }),
        });
        router.push('/');
    };

    if (isLoading) {
        return <Spinner color="purple" size="large" />
    }

    if (isNaN(correctAnswers) || isNaN(totalQuestions)) {
        return <div>Нет данных.</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-2xl font-bold mb-4">Результаты</h3>
                <p className="text-lg">Вы ответили правильно на <span className="font-bold text-purple-600">{correctAnswers}</span> из <span className="font-bold text-purple-600">{totalQuestions}</span> вопросов.</p>
                <p className="text-lg mb-4">Процент правильных ответов: <span className="font-bold text-purple-600">{completionPercentage}%</span></p>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Вопрос</TableHead>
                            <TableHead className="text-center">Ваш ответ</TableHead>
                            <TableHead className="text-center">Правильный ответ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {questions.map((question, index) => (
                            <TableRow key={index}>
                                <TableCell className="text-left">{question.question}</TableCell>
                                <TableCell className="text-center">
                                    {Array.isArray(userAnswers[index])
                                        ? (userAnswers[index] as string[]).join(', ')
                                        : (userAnswers[index] || 'Нет ответа')}
                                </TableCell>
                                <TableCell className="text-center">
                                    {Array.isArray(question.correctAnswers)
                                        ? question.correctAnswers.join(', ')
                                        : question.correctAnswer}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="mt-3 flex justify-center">
                    <Button variant="purple" onClick={handleRetry}>Пройти тест еще раз</Button>
                </div>
            </div>
        </div>
    );
};

export default ResultForm;
