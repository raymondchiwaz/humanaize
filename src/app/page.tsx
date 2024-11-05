'use client';

import React, { useState, useEffect } from 'react';
import { useUser, SignInButton, SignedIn, UserButton } from '@clerk/nextjs';
import { Analytics } from "@vercel/analytics/react";
import { useRouter } from 'next/navigation'
import Image from "next/image";
import './pages.css';


export default function Home() {
  const router = useRouter()

  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [text, setText] = useState('');
  const [humanizedText, setHumanizedText] = useState('');
  const [toggleCopy, setToggleCopy] = useState(false);
  const { isSignedIn } = useUser();
  const [isUsedOneTime, setIsUsedOneTime] = useState(false);

  useEffect(() => {
    const usedOneTime = localStorage.getItem('isUsedOneTime') === 'true';
    setIsUsedOneTime(usedOneTime);
  }, []);

  const humanaizeAiText = async (aiText: string) => {
    console.log('Sending POST request /api/humanaize');
    try {
      const response = await fetch('/api/humanaize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aiText }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while fetching the reply.');
      return 'No response available';
    } finally {
      console.log('POST request /api/humanaize completed');
    }
  };
  
  const handleHumanize = () => {
    if (isUsedOneTime && !isSignedIn) {
      router.push('/sign-in');
      return;
    }

    console.log('Humanizing...');
    setLoading(true);
    humanaizeAiText(text)
      .then((humanized) => {
        setHumanizedText(humanized);
        if (!isSignedIn) {
          localStorage.setItem('isUsedOneTime', 'true');
          setIsUsedOneTime(true);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
      <Analytics />
      <div className="absolute top-4 right-8">
        {!isSignedIn ? (
          <SignInButton>
            <button className="bg-foreground text-gray-100 px-4 py-2 rounded-md">Sign In</button>
          </SignInButton> ) 
          : (<SignedIn>
              <UserButton />
            </SignedIn>)
        }
      </div> 

      <main className="flex flex-col gap-8 row-start-2 items-center">
        <div className="Editor_title3__hWeAn">
          <h1 className="Editor_editor__header__GIEq6 font-black">HumanAIze AI text</h1>
          <h2 className="Editor_editor__subheader__uH98a font-bold">HumanAIze AI text with the smartest AI humanizer</h2>
          <p className="Editor_editor__description__sjr_h">Transform your AI-generated content into natural, human-like text with the ultimate HumanAIze AI text tool. This ai-to-human text converter effortlessly converts output from ChatGPT, Bard, Jasper, Grammarly, GPT4, and other AI text generators into text indistinguishable from human writing. Achieve 100% originality and enhance your content creation with the best HumanAIze AI solution available.</p>
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
                value={humanizedText}
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
      <script
        src="https://topmate-embed.s3.ap-south-1.amazonaws.com/v1/topmate-embed.js"
        user-profile="https://topmate.io/embed/profile/abdibrokhim?theme=D5534D"
        btn-style='{"backgroundColor":"#fff","color":"#000","border":"1px solid #000"}'
        embed-version="v1"
        button-text="Hey, dear! Let's chat."
        position-right="30px"
        position-bottom="30px"
        custom-padding="0px"
        custom-font-size="16px"
        custom-font-weight="500"
        custom-width="200px"
      ></script>
    </div>
  );
}