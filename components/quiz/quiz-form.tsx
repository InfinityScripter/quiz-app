"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormSuccess } from "@/components/form-success";
import { FormError } from "@/components/form-error";
import { Progress } from "@/components/ui/progress";
import { Timer } from "lucide-react";
import { questions } from "@/lib/questions";
import { useTimer } from "react-timer-hook";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FaStar } from "react-icons/fa";
import { PuffLoader as Spinner } from "react-spinners";

const FormSchema = z.object({
    answer: z.string().nonempty("Выберите ответ"),
});

export function QuizForm() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [userAnswers, setUserAnswers] = useState<string[]>(Array(questions.length).fill(''));
    const [questionResults, setQuestionResults] = useState<(boolean | null)[]>(Array(questions.length).fill(null));
    const [timerStarted, setTimerStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(100);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    const expiryTimestamp = useRef(new Date());
    expiryTimestamp.current.setSeconds(expiryTimestamp.current.getSeconds() + timeLeft);

    const {
        seconds,
        minutes,
        start,
        restart,
    } = useTimer({
        expiryTimestamp: expiryTimestamp.current,
        onExpire: () => handleExpire(),
        autoStart: false
    });

    useEffect(() => {
        const fetchQuizState = async () => {
            const response = await fetch('/api/quiz-state');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCurrentQuestionIndex(data.currentQuestionIndex);
            setCorrectAnswers(data.correctAnswers);
            setUserAnswers(data.userAnswers || Array(questions.length).fill(''));
            setQuestionResults(data.questionResults || Array(questions.length).fill(null));
            setTimeLeft(data.timeLeft);
            setTimerStarted(data.timerStarted);

            const newExpiryTimestamp = new Date();
            newExpiryTimestamp.setSeconds(newExpiryTimestamp.getSeconds() + data.timeLeft);
            restart(newExpiryTimestamp, data.timerStarted);
            setIsLoading(false);
        };

        fetchQuizState().catch((error) => {
            console.error('Fetch quiz state failed:', error);
            setIsLoading(false);
        });
    }, [restart]);

    useEffect(() => {
        if (timerStarted) {
            updateQuizState(currentQuestionIndex, correctAnswers, userAnswers, questionResults, seconds + minutes * 60, true);
        }
    }, [seconds, minutes, timerStarted, currentQuestionIndex, correctAnswers, userAnswers, questionResults]);

    const handleStart = () => {
        setTimerStarted(true);
        start();
        updateQuizState(currentQuestionIndex, correctAnswers, userAnswers, questionResults, 100, true);
    };

    const handleExpire = () => {
        updateQuizState(0, correctAnswers, userAnswers, questionResults, 100, false);
        router.push(`/result?correctAnswers=${correctAnswers}&totalQuestions=${questions.length}&userAnswers=${encodeURIComponent(JSON.stringify(userAnswers))}`);
    };

    const handleNextQuestion = async (data: z.infer<typeof FormSchema>) => {
        const currentQuestion = questions[currentQuestionIndex];
        const correct = data.answer === currentQuestion.correctAnswer;

        setIsCorrect(correct);
        setIsAnswered(true);
        const newResults = [...questionResults];
        newResults[currentQuestionIndex] = correct;

        const newUserAnswers = [...userAnswers];
        newUserAnswers[currentQuestionIndex] = data.answer;

        if (correct) {
            setCorrectAnswers((prev) => prev + 1);
        }

        setTimeout(async () => {
            if (currentQuestionIndex === questions.length - 1) {
                await updateQuizState(0, 0, newUserAnswers, newResults, 100, false);
                router.push(`/result?correctAnswers=${correctAnswers + (correct ? 1 : 0)}&totalQuestions=${questions.length}&userAnswers=${encodeURIComponent(JSON.stringify(newUserAnswers))}`);
            } else {
                const newIndex = currentQuestionIndex + 1;
                setCurrentQuestionIndex(newIndex);
                setIsCorrect(null);
                setIsAnswered(false);
                form.reset();
                setUserAnswers(newUserAnswers);
                setQuestionResults(newResults);
                await updateQuizState(newIndex, correctAnswers + (correct ? 1 : 0), newUserAnswers, newResults, 100, true);
            }
        }, 1000);
    };

    const updateQuizState = async (currentQuestionIndex: number, correctAnswers: number, userAnswers: string[], questionResults: (boolean | null)[], timeLeft: number, timerStarted: boolean) => {
        await fetch('/api/quiz-state', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currentQuestionIndex, correctAnswers, userAnswers, questionResults, timeLeft, timerStarted }),
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center">
                <Spinner color="purple" />
            </div>
        );
    }

    return (
        <Dialog>
            {!timerStarted && (
                <DialogTrigger asChild>
                    <Button variant="purple">Начать выполнение теста</Button>
                </DialogTrigger>
            )}
            {!timerStarted && (
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>ВНИМАНИЕ!</DialogTitle>
                        <DialogDescription>
                            Нажмите кнопку ниже, чтобы начать тест. Таймер начнет отсчет сразу после начала.
                        </DialogDescription>
                        <Button variant="purple" onClick={handleStart}>
                            <FaStar className="mr-2 inline items-baseline" />
                            Начать выполнение теста
                        </Button>
                    </DialogHeader>
                </DialogContent>
            )}
            {timerStarted && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleNextQuestion)} className="w-2/3 space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <Timer size={32} className="mr-2 text-purple-800" />
                                <span>{`${minutes}:${seconds.toString().padStart(2, '0')}`}</span>
                            </div>
                            <h3 className="text-xl font-bold">Вопрос {currentQuestionIndex + 1} из {questions.length}</h3>
                        </div>
                        <Progress value={(currentQuestionIndex / questions.length) * 100} className="my-4 " />
                        <div className="flex space-x-1">
                            {questionResults.map((result, index) => (
                                <div key={index} className={`rounded-xl w-full h-2 ${result === null ? 'bg-gray-200' : result ? 'bg-emerald-500' : 'bg-destructive'}`} />
                            ))}
                        </div>
                        <h2>{questions[currentQuestionIndex].question}</h2>
                        <FormField
                            control={form.control}
                            name="answer"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Выберите правильный ответ</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            className="flex flex-col space-y-1"
                                            disabled={isAnswered}
                                        >
                                            {questions[currentQuestionIndex].options.map((option) => (
                                                <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value={option} />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">{option}</FormLabel>
                                                </FormItem>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button variant="purple" type="submit" disabled={isAnswered}>
                            Ответить
                        </Button>
                        {isCorrect === true && <FormSuccess message="Верно!" />}
                        {isCorrect === false && <FormError message="Неверно!" />}
                    </form>
                </Form>
            )}
        </Dialog>
    );
}

export default QuizForm;
