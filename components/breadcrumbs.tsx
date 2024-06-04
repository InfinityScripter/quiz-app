'use client';

import React from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

const BreadCrumbsComponent = () => {
    const pathname = usePathname();

    if (pathname === '/') {
        return null;
    }

    return (
        <div className="bg-gray-100 py-3 px-5">
            <Breadcrumb>
                <BreadcrumbList className="flex items-center space-x-2 text-sm text-gray-600">
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/" className=" text-purple-500">Главная</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-gray-400">/</BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage className="font-semibold text-purple-600">
                            {pathname === '/about' && 'О квизе'}
                            {pathname === '/contact' && 'Контакты'}
                            {pathname === '/quiz' && 'Квиз'}

                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
};

export default BreadCrumbsComponent;
