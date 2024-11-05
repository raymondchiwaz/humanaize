'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import './pages.css';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [text, setText] = useState('');
  const [humanizedText, setHumanizedText] = useState('');
  const [toggleCopy, setToggleCopy] = useState(false);
  
  const handleHumanize = () => {
    console.log('Humanizing...');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setHumanizedText(text);
    }, 3000);
  }

  useEffect(() => {
    const count = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    setWordCount(count);
  }, [text]);

  const loader = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
      <circle cx={4} cy={12} r={3} fill="currentColor">
        <animate id="svgSpinners3DotsScale0" attributeName="r" begin="0;svgSpinners3DotsScale1.end-0.25s" dur="0.75s" values="3;.2;3" />
      </circle>
      <circle cx={12} cy={12} r={3} fill="currentColor">
        <animate attributeName="r" begin="svgSpinners3DotsScale0.end-0.6s" dur="0.75s" values="3;.2;3" />
      </circle>
      <circle cx={20} cy={12} r={3} fill="currentColor">
        <animate id="svgSpinners3DotsScale1" attributeName="r" begin="svgSpinners3DotsScale0.end-0.45s" dur="0.75s" values="3;.2;3" />
      </circle>
    </svg>
  );

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-8 p-4 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <div className="Editor_title3__hWeAn">
          <h1 className="Editor_editor__header__GIEq6 font-black">Humanize AI text</h1>
          <h2 className="Editor_editor__subheader__uH98a font-bold">Humanize AI text with the smartest AI humanizer</h2>
          <p className="Editor_editor__description__sjr_h">Transform your AI-generated content into natural, human-like text with the ultimate Humanize AI text tool. This ai-to-human text converter effortlessly converts output from ChatGPT, Bard, Jasper, Grammarly, GPT4, and other AI text generators into text indistinguishable from human writing. Achieve 100% originality and enhance your content creation with the best Humanize AI solution available.</p>
        </div>
        <div className="flex gap-2 items-center flex-col lg:flex-row">
          <div className="bg-white p-4">
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-[600px] h-[400px] p-4 pb-12 border border-solid border-gray-600 rounded-lg focus:outline-none resize-none focus:ring-2 focus:ring-[#333] focus:border-transparent"
                placeholder="Paste your AI-generated text here"
              ></textarea>
              <div className="absolute bottom-4 left-4 bg-foreground px-2 py-1 rounded-md text-sm text-gray-100 shadow">
                {wordCount} words
              </div>
              <button
                className={`absolute bottom-4 right-4 rounded-md shadow border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-gray-100 gap-2 hover:bg-[#aeaeae] dark:hover:bg-[#aeaeae] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 
                  ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                `}
                onClick={handleHumanize}
                disabled={loading}
              >
                {loading ? loader() : 'Humanize'}
              </button>
            </div>
          </div>
          <div className="bg-white p-4">
            <div className="relative">
              <textarea 
                disabled={true}
                className="bg-white p-4 w-[600px] h-[400px] p-4 border border-solid border-gray-600 rounded-lg focus:outline-none outline-none resize-none focus:ring-2 focus:ring-[#333] focus:border-transparent" 
                placeholder="Humanized text will appear here">
              </textarea>
              <button 
                disabled={(!loading && humanizedText.length > 0) ? false : true}
                className={`absolute bottom-4 right-4 flex flex-row gap-1 items-center bg-foreground px-2 py-1 rounded-md text-sm text-gray-100 shadow 
                  ${(loading || humanizedText.length < 1) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                `}
                onClick={() => {
                  if (!loading && humanizedText.length > 0) {
                    navigator.clipboard.writeText(humanizedText);
                    setToggleCopy(true);
                    setTimeout(() => {
                      setToggleCopy(false);
                    }, 1000);
                  }
                }}
              >
                <Image
                  aria-hidden
                  src={!toggleCopy ? '/copy.svg' : '/check.svg'}
                  alt="Copy icon"
                  width={16}
                  height={16}
                /> 
                copy
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center bg-white p-4">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://twitter.com/abdibrokhim"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/X_logo_2023_original.svg"
            alt="X icon"
            width={16}
            height={16}
          />
          X (prev. Twitter)
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.linkedin.com/in/abdibrokhim/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/LinkedIn_icon.svg"
            alt="LinkedIn icon"
            width={16}
            height={16}
          />
          LinkedIn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/abdibrokhim/humanaize"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/github-mark.svg"
            alt="Github icon"
            width={16}
            height={16}
          />
          Open Source →
        </a>
      </footer>
    </div>
  );
}
