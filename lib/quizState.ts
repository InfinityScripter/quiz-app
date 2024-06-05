
import { questions } from "@/lib/questions";

export let quizState = {
    currentQuestionIndex: 0,
    correctAnswers: 0,
    userAnswers: Array(questions.length).fill(''),
    questionResults: Array(questions.length).fill(null),
    timeLeft: 120,
    timerStarted: false,
    correctAnswersList: Array(questions.length).fill(null),
};
