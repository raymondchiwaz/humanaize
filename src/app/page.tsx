'use client';

import React, { useState, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react";
import { useRouter } from 'next/navigation'
import Image from "next/image";
import './pages.css';
// import OverlayCard from './overlaycard';


export default function Home() {
  const router = useRouter()

  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [humanizedTextWordCount, setHumanizedTextWordCount] = useState(0);
  const [text, setText] = useState('');
  const [humanizedText, setHumanizedText] = useState('');
  const [toggleCopy, setToggleCopy] = useState(false);
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
        // throw new Error('API request failed');
        console.log('API request failed');
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      console.log('An error occurred while fetching the reply.');
      console.error('Error:', error);
      // alert('An error occurred while fetching the reply.');
      // return 'No response available';
      // send request to /api/gpt
      console.log('Trying GPT...');
      return tryGpt(aiText);
    } finally {
      console.log('POST request /api/humanaize completed');
    }
  };
  
  const tryGpt = async (aiText: string) => {
    console.log('Sending POST request /api/gpt');
    try {
      const response = await fetch('/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aiText }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      if (!data.message) {
        throw new Error('Invalid response format');
      }

      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    } finally {
      console.log('POST request /api/gpt completed');
    }
  };
  
  const handleHumanize = () => {
    if (text.trim().length < 100) {
      return;
    }
    
    console.log('Humanizing...');
    setLoading(true);
    tryGpt(text)
      .then((response) => {
        if (response && response.message) {
          setHumanizedText(response.message);
          const count = response.message.trim() === '' ? 0 : response.message.trim().split(/\s+/).length;
          setHumanizedTextWordCount(count);
        } else {
          setHumanizedText('Error: Could not process the text. Please try again.');
          setHumanizedTextWordCount(0);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        const errorMessage = error?.message || 'Could not process the text. Please check your API configuration and try again.';
        setHumanizedText(`Error: ${errorMessage}`);
        setHumanizedTextWordCount(0);
        
        if (errorMessage.includes('configuration error')) {
          console.error('Please check your Google API credentials in .env.local');
        }
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-28 gap-8 p-4 font-[family-name:var(--font-geist-sans)]">
      <Analytics />
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <div className="Editor_title3__hWeAn ">
          <h1 className="Editor_editor__header__GIEq6 font-bold bg-white dark:bg-background dark:text-white"><span className='italic font-black'>HumanAIze </span>AI text</h1>
          <h2 className="Editor_editor__subheader__uH98a font-bold bg-white dark:bg-background dark:text-white">HumanAIze AI text with the smartest AI humanizer</h2>
          <p className="Editor_editor__description__sjr_h bg-white dark:bg-background dark:text-white">Transform your AI-generated content into natural, human-like text with the ultimate HumanAIze AI text tool. This ai-to-human text converter effortlessly converts output from ChatGPT, Bard, Jasper, Grammarly, GPT4, and other AI text generators into text indistinguishable from human writing. Achieve 100% originality and enhance your content creation with the best HumanAIze AI solution available.</p>
          <div className='bg-background text-black dark:bg-foreground p-2'>
            <a
              className="flex items-center"
              href="https://aimlapi.com/?via=ibrohim"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image 
                src="/powered_by_aimlapi.svg"
                alt="Powered by AIML API"
                width={120}
                height={120}
              />
            </a>
          </div>
        </div>
        <div className="flex gap-2 items-center flex-col lg:flex-row">
          <div className="bg-white dark:bg-background p-4">
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-[600px] h-[400px] p-4 pb-12 dark:bg-background dark:text-white border border-solid border-gray-600 rounded-lg focus:outline-none resize-none focus:ring-2 focus:ring-[#333] focus:border-transparent"
                placeholder="Paste your AI-generated text here"
              ></textarea>
              <div className="absolute bottom-4 left-4 dark:bg-foreground dark:text-black bg-black text-white px-2 py-1 rounded-md text-sm text-gray-100 shadow">
                {wordCount} words
              </div>
              <button
                className={`absolute bottom-4 right-4 dark:bg-foreground dark:text-black bg-black text-white rounded-md shadow border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-gray-100 gap-2 hover:bg-[#aeaeae] dark:hover:bg-[#aeaeae] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 
                  ${(loading || text.trim().length < 100) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                `}
                onClick={text.trim().length > 100 ? handleHumanize : undefined}
                disabled={loading}
              >
                {loading ? loader() : 'Humanize'}
              </button>
            </div>
          </div>
          <div className="bg-white dark:bg-background p-4">
            <div className="relative">
              <textarea 
                disabled={true}
                value={humanizedText}
                className="bg-white p-4 w-[600px] h-[400px] p-4 dark:bg-background dark:text-white border border-solid border-gray-600 rounded-lg focus:outline-none outline-none resize-none focus:ring-2 focus:ring-[#333] focus:border-transparent" 
                placeholder="Humanized text will appear here">
              </textarea>
              <div className="absolute bottom-4 left-4 dark:bg-foreground dark:text-black bg-black text-white px-2 py-1 rounded-md text-sm text-gray-100 shadow">
                {humanizedTextWordCount} words
              </div>
              <button 
                disabled={(!loading) ? false : true}
                className={`absolute bottom-4 right-4 dark:bg-foreground dark:text-black bg-black text-white flex flex-row gap-1 items-center bg-foreground px-2 py-1 rounded-md text-sm text-gray-100 shadow 
                  ${(loading) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                `}
                onClick={() => {
                  if (!loading) {
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
                  className='dark:bg-black'
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
      <footer className="row-start-3 flex flex-col gap-6 flex-wrap items-center justify-center mt-8">
        <div className='flex gap-6 flex-wrap items-center justify-center bg-white dark:bg-background dark:text-white p-2'>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://twitter.com/abdibrokhim"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              className='dark:bg-white'
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
              className='dark:bg-white'
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
              className='dark:bg-white'
              src="/github-mark.svg"
              alt="Github icon"
              width={16}
              height={16}
            />
            Open Source →
          </a>
        </div>
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