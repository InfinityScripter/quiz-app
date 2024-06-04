import React from 'react';
import Link from "next/link";
import {FaHome, FaMailBulk, FaQuestion, FaStar} from "react-icons/fa";

const Header = () => {
    return (
        <header className="bg-purple-600 text-white p-4 flex justify-between items-center">
            <div
            className="flex items-center"
            >
            <FaStar
                className="inline-block mr-2.5"
            />
            <h1 className="text-xl font-bold">

                Quiz App</h1></div>
            <nav>
                <Link href="/" className="mx-2 underline">

                    <FaHome className="inline-block mr-2.5" />
                    Главная</Link>
                <Link href="/about" className="mx-2 underline">
                    <FaQuestion className="inline-block mr-2.5" />
                    О квизе</Link>
                <Link href="/contact" className="mx-2 underline">
                    <FaMailBulk className="inline-block mr-2.5" />
                    Контакты</Link>
            </nav>
        </header>
    );
};

export default Header;
