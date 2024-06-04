
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

import React from "react";
import BreadCrumbsComponent from "@/components/breadcrumbs";
import {Toaster} from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Quiz приложение",
    description: "Проверь свои знания в квизе",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
            <Header />
            <BreadCrumbsComponent />
            <main className="flex-grow flex items-center justify-center">
                <Toaster />
                {children}
            </main>
            <Footer />
        </div>
        </body>
        </html>
    );
}
