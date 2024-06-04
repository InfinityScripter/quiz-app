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
import { questions } from "@/lib/questions";

const FormSchema = z.object({
    answer: z.string().nonempty("Выберите вариант ответа."),
});

export function QuizForm() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [isClient, setIsClient] = useState(false);
    console.log(correctAnswers);
    console.log(isCorrect);
    console.log(questions.length)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    const router = useRouter();

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
        }, 2000);
    };

    if (!isClient) {
        return null;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleNextQuestion)} className="w-2/3 space-y-6">
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
                <Button type="submit" disabled={isAnswered}>
                    Следующий вопрос
                </Button>
            </form>
        </Form>
    );
}

export default QuizForm;
