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
    const [timerStarted, setTimerStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isLoading, setIsLoading] = useState(true); // New loading state
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
            setTimeLeft(data.timeLeft);
            setTimerStarted(data.timerStarted);

            const newExpiryTimestamp = new Date();
            newExpiryTimestamp.setSeconds(newExpiryTimestamp.getSeconds() + data.timeLeft);
            restart(newExpiryTimestamp, data.timerStarted);
            setIsLoading(false); // Set loading to false after fetching data
        };

        fetchQuizState().catch((error) => {
            console.error('Fetch quiz state failed:', error);
            setIsLoading(false); // Set loading to false even if fetching fails
        });
    }, [restart]);

    useEffect(() => {
        if (timerStarted) {
            updateQuizState(currentQuestionIndex, correctAnswers, seconds + minutes * 60, true);
        }
    }, [seconds, minutes, timerStarted, currentQuestionIndex, correctAnswers]);

    const handleStart = () => {
        setTimerStarted(true);
        start();
        updateQuizState(currentQuestionIndex, correctAnswers, 30, true);
    };

    const handleExpire = () => {
        updateQuizState(0, correctAnswers, 30, false);
        router.push(`/result?correctAnswers=${correctAnswers}&totalQuestions=${questions.length}`);
    };

    const handleNextQuestion = async (data: z.infer<typeof FormSchema>) => {
        const currentQuestion = questions[currentQuestionIndex];
        const correct = data.answer === currentQuestion.correctAnswer;

        setIsCorrect(correct);
        setIsAnswered(true);

        if (correct) {
            setCorrectAnswers((prev) => prev + 1);
        }

        setTimeout(async () => {
            if (currentQuestionIndex === questions.length - 1) {
                await updateQuizState(0, 0, 30, false);
                router.push(`/result?correctAnswers=${correctAnswers + (correct ? 1 : 0)}&totalQuestions=${questions.length}`);
            } else {
                const newIndex = currentQuestionIndex + 1;
                setCurrentQuestionIndex(newIndex);
                setIsCorrect(null);
                setIsAnswered(false);
                form.reset();
                await updateQuizState(newIndex, correctAnswers + (correct ? 1 : 0), 30, true);
            }
        }, 1000);
    };

    const updateQuizState = async (currentQuestionIndex: number, correctAnswers: number, timeLeft: number, timerStarted: boolean) => {
        await fetch('/api/quiz-state', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currentQuestionIndex, correctAnswers, timeLeft, timerStarted }),
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
