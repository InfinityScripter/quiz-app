import React from 'react';
import Link from "next/link";

const Header = () => {
    return (
        <header className="bg-purple-600 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Quiz App</h1>
            <nav>
                <Link href="/" className="mx-2 underline">Главная</Link>
                <Link href="/about" className="mx-2 underline">Обо мне</Link>
                <Link href="/contact" className="mx-2 underline">Контакты</Link>
            </nav>
        </header>
    );
};

export default Header;
