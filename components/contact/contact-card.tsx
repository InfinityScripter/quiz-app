import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaLinkedin, FaTelegram, FaInstagram, FaGithub, FaCity } from 'react-icons/fa';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const ContactCard = () => {
    return (
        <div className="flex justify-center items-center py-12">
            <Card className="min-w-[500px] max-w-lg shadow-lg rounded-lg overflow-hidden">
                <CardHeader className="text-center bg-purple-600 text-white py-6">
                    <CardTitle className="text-3xl font-bold">Контакты</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6 text-center">
                    <Avatar className="mx-auto w-24 h-24 mb-4">
                        <AvatarImage src="/avatar.jpeg" alt="Михаил" />
                        <AvatarFallback>М</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">Талалаев Михаил</h3>
                    <p className="text-lg">Фронтенд-разработчик</p>
                    <p className="text-lg flex items-center justify-center space-x-2">
                        <FaCity className="inline-block" size={20} /> <span>Санкт-Петербург</span>
                    </p>
                    <p className="text-lg">Связаться со мной:</p>
                    <div className="flex justify-center space-x-4">
                        <a href="https://www.linkedin.com/in/mikhail-talalaev-aa1245230/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                            <FaLinkedin size={35} />
                        </a>
                        <a href="https://www.t.me/sh0ny" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                            <FaTelegram size={35} />
                        </a>
                        <a href="https://instagram.com/sh0ny" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                            <FaInstagram size={35} />
                        </a>
                        <a href="https://github.com/sh0ny-it" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-gray-700">
                            <FaGithub size={35} />
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ContactCard;
