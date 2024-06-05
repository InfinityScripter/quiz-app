"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
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

const FormSchema = z.object({
answer: z.string().nonempty("Выберите ответ"),
});

export function QuizForm() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300);
    const [timerStarted, setTimerStarted] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!timerStarted) return;

        if (timeLeft === 0) {
            router.push(`/result?correctAnswers=${correctAnswers}&totalQuestions=${questions.length}`);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, timerStarted]);

    const handleStart = () => {
        setTimerStarted(true);
    };

    const handleNextQuestion = (data: z.infer<typeof FormSchema>) => {
        const currentQuestion = questions[currentQuestionIndex];
        const correct = data.answer === currentQuestion.correctAnswer;

        setIsCorrect(correct);
        setIsAnswered(true);

        if (correct) {
            setCorrectAnswers((prev) => prev + 1);
        }

        setTimeout(() => {
            if (currentQuestionIndex === questions.length - 1) {
                router.push(`/result?correctAnswers=${correctAnswers + (correct ? 1 : 0)}&totalQuestions=${questions.length}`);
            } else {
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                setIsCorrect(null);
                setIsAnswered(false);
                form.reset();
            }
        }, 1000);
    };

    if (!isClient) {
        return null;
    }

    if (!timerStarted) {
        return (
            <div className="flex flex-col items-center justify-center  bg-gray-100 p-4 rounded-xl shadow-lg">
                <Button variant="purple" onClick={handleStart}>Начать тест</Button>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleNextQuestion)} className="w-2/3 space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Timer size={32} className="mr-2 text-purple-800" />
                        <span>{`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}</span>
                    </div>
                    <h3 className="text-xl font-bold">Вопрос {currentQuestionIndex + 1} из {questions.length}</h3>
                </div>
                <Progress value={(currentQuestionIndex / questions.length) * 100} className="my-4" />
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
                {isCorrect === true && <FormSuccess message="Верно!" />}
                {isCorrect === false && <FormError message="Неверно!" />}
                <Button variant="purple" type="submit" disabled={isAnswered}>
                  Ответить
                </Button>
            </form>
        </Form>
    );
}

export default QuizForm;
