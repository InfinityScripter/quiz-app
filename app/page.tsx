import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";

export default function Home() {
  return (
      <>
          <div className="bg-purple-50 shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-8">
              <h1 className="text-5xl font-bold text-purple-600" style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)' }}>Добро пожаловать в Quiz</h1>
              <p className="mt-4 text-gray-600" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>Мы рады приветствовать вас в нашем квизе!</p>
              <p className="mt-2 text-gray-600" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>Ответьте на вопросы, чтобы проверить свои знания.</p>
              <Link href="/about" className="mt-8 inline-block text-gray-500 underline" style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}>Не хотите играть? Узнайте больше о нашем квизе.</Link>
            </div>
            <div className="w-full md:w-1/2 bg-purple-500 flex flex-col items-center justify-center p-8 relative">
              <Link href="/quiz">
              <Button variant="purple" className="text-xl font-semibold" style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}>
              &#x1F680;  Начать игру
              </Button>
                </Link>
            </div>
        </div>
      </>
  );
}
