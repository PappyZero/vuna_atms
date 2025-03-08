import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <div>
      <footer className="bg-gradient-to-r from-green-700 to-green-500 shadow-xl text-white row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:text-black"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer">
          <Image
            aria-hidden
            src="/logos/pappy_tech.jpg"
            alt="File icon"
            width={16}
            height={16}
            style={{ width: 'auto', height: 'auto' }}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:text-black"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/logos/pappy_tech.jpg"
            alt="Window icon"
            width={16}
            height={16}
            style={{ width: 'auto', height: 'auto' }}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:text-black"
          href="https://www.veritas.edu.ng/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
            // style={{ width: 'auto', height: 'auto' }}
          />
          Copyright © 2025 Veritas : Software Engineering
        </a>
      </footer>
    </div>
  );
};

export default Footer;