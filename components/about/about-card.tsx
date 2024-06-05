import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaLightbulb, FaStar, FaQuestion} from 'react-icons/fa';

const AboutCard = () => {
    return (
        <div className="flex justify-center items-center py-8">
            <Card className="max-w-xl shadow-lg rounded-lg">
                <CardHeader className="text-center bg-purple-600 text-white rounded-t-lg">
                    <CardTitle className="text-2xl font-bold">О квизе</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                        <FaQuestion className="text-purple-600" size={50} />
                        <p className="text-lg">
                            Наш квиз предназначен для проверки ваших знаний в различных областях, таких как программирование, литература, география и многое другое.
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <FaLightbulb className="text-yellow-500" size={50} />
                        <p className="text-lg">
                            Вопросы разнообразны и требуют разного уровня подготовки. Мы стараемся сделать их интересными и познавательными.
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <FaStar className="text-emerald-500" size={50} />
                        <p className="text-lg">
                            Участвуйте в нашем квизе и зарабатывайте баллы, чтобы стать лучшим среди своих друзей и коллег!
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AboutCard;
