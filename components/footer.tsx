import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-purple-600 text-white p-4 text-center">
            <p>&copy; {new Date().getFullYear()} Quiz App. Все права защищены.</p>
        </footer>
    );
};

export default Footer;
