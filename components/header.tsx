import React, { useState } from 'react';
import Link from "next/link";
import { FaHome, FaMailBulk, FaQuestion, FaStar, FaBars } from "react-icons/fa";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";

const Header = () => {
    return (
        <header className="bg-purple-600 text-white p-4 flex justify-between items-center">
            <Link href="/" className="flex items-center">
            <div className="flex items-center">
                <FaStar className="inline-block mr-2.5" />
                <h1 className="text-xl font-bold">Quiz App</h1>
            </div>
            </Link>
            <nav className="hidden sm:flex">
                <Link href="/" className="mx-2 underline flex items-center">
                    <FaHome className="inline-block mr-2.5" />
                    Главная
                </Link>
                <Link href="/about" className="mx-2 underline flex items-center">
                    <FaQuestion className="inline-block mr-2.5" />
                    О квизе
                </Link>
                <Link href="/contact" className="mx-2 underline flex items-center">
                    <FaMailBulk className="inline-block mr-2.5" />
                    Контакты
                </Link>
            </nav>
            <div className="sm:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <button className="focus:outline-none">
                            <FaBars className="text-xl" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="right" className="max-w-[250px]">
                        <nav className="flex flex-col p-4 space-y-4">
                            <SheetClose asChild>
                                <Link href="/" className="flex items-center text-purple-600 hover:underline">
                                    <FaHome className="inline-block mr-2.5" />
                                    Главная
                                </Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link href="/about" className="flex items-center text-purple-600 hover:underline">
                                    <FaQuestion className="inline-block mr-2.5" />
                                    О квизе
                                </Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link href="/contact" className="flex items-center text-purple-600 hover:underline">
                                    <FaMailBulk className="inline-block mr-2.5" />
                                    Контакты
                                </Link>
                            </SheetClose>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
};

export default Header;
