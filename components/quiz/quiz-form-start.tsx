import React from 'react';
import {Button} from "@/components/ui/button";
import {Timer} from "lucide-react";
import {Progress} from "@/components/ui/progress";

const QuizFormStart = () => {
    return (
        <>

                <Button variant="purple">Начать тест</Button>
            <div className="flex flex-row items-center">
                <Timer size={32} className="mr-2" />
                00:00
            </div>
            <h3 className="text-2xl font-bold">Вопрос 1 из 10</h3>
            <Progress value={50}  className="my-4" />
        </>
    );
};

export default QuizFormStart;
