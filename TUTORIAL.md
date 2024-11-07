# Comprehensive and Step-by-Step Tutorial on Building an AI text Humanizer with AI/ML API, Next.js, Tailwind CSS and Integration with Clerk Auth and Deploying to Vercel

## Introduction

In this tutorial, we will build ...

### AI/ML API

AI/ML API is a game-changing platform for developers and SaaS entrepreneurs looking to integrate cutting-edge AI capabilities into their products. It offers a single point of access to over 200 state-of-the-art AI models, covering everything from NLP to computer vision.

Key Features for Developers:

* Extensive Model Library: 200+ pre-trained models for rapid prototyping and deployment. 📚
* Customization Options: Fine-tune models to fit your specific use case. 🎯
* Developer-Friendly Integration: RESTful APIs and SDKs for seamless incorporation into your stack. 🛠️
* Serverless Architecture: Focus on coding, not infrastructure management. ☁️

> Get Started for FREE ($0 US dollars): [Click me, let's Cook!](https://aimlapi.com/?via=ibrohim) 🧑‍🍳

> `A$AP`; Use the code `IBROHIMXAIMLAPI` for 1 week FREE Access [Let's get started!](https://aimlapi.com/?via=ibrohim) 😱

> Deep Dive into AI/ML API Documentation (very detailed, can’t agree more): [Click me, to get started](https://docs.aimlapi.com/) 📖

Here's a brief tutorial: [How to get API Key from AI/ML API. Quick step-by-step tutorial with screenshots for better understanding.](https://medium.com/@abdibrokhim/how-to-get-api-key-from-ai-ml-api-225a69d0bb25)

### Next.js

Next.js is a React framework that enables server-side rendering and static site generation for React applications. It provides a range of features that make it easier to build fast, scalable, and SEO-friendly web applications.

> ps: I just love Next.js, it's my go-to framework for building React applications. 🚀

> Documentation: [Next.js](https://nextjs.org/docs/getting-started)

### Tailwind CSS

Tailwind CSS is a utility-first CSS framework that makes it easy to build custom designs without writing custom CSS. It provides a range of utility classes that can be used to style elements directly in the HTML.

> Documentation: [Tailwind CSS](https://tailwindcss.com/docs)

### Clerk Auth

Clerk is an authentication platform that provides a range of features for managing user authentication and authorization in web applications. It offers a range of features, including social login, multi-factor authentication, and user management.

> Documentation: [Clerk](https://docs.clerk.dev/)

### Vercel

Vercel is a cloud platform to deploy and host web applications. It offers a range of features, including serverless functions, automatic deployments, and custom domains.

> Documentation: [Vercel](https://vercel.com/docs)


## Prerequisites

Before we get started, make sure you have the following installed on your machine:

* [Node.js](https://nodejs.org/)
* [npm or yarn](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [AI/ML API Key](https://aimlapi.com/?via=ibrohim). Here's is tutorial on [How to get API Key from AI/ML API](https://medium.com/@abdibrokhim/how-to-get-api-key-from-ai-ml-api-225a69d0bb25)
* [Clerk Auth Account](https://clerk.com/)
* [Vercel Account](https://vercel.com/)

## Getting Started

### Create a New Next.js Project

Let's get started by creating a new Next.js project:

```bash
npx create-next-app@latest
```

It will ask you a few questions:

What is your project named? Here, you should enter your app name. For example: `humanaizer`. For the rest of the questions, simply hit enter:

Here’s what you’ll see:
```bash
✔ Would you like to use TypeScript? … No / Yes
✔ Would you like to use ESLint? … No / Yes
✔ Would you like to use Tailwind CSS? … No / Yes
✔ Would you like your code inside a `src/` directory? … No / Yes
✔ Would you like to use App Router? (recommended) … No / Yes
✔ Would you like to use Turbopack for `next dev`? … No / Yes
✔ Would you like to customize the import alias (`@/*` by default)? … No / Yes
```

Open your project with Visual Studio Code:

```bash
cd humanaizer
code .
```

### API Routes

Now, the very first thing we need to create APIs to interact with AI/ML API. 

Let's create a new folder called `api/humanaize` inside the `src/app` folder. Then, create `route.ts` file inside the `humanaize` folder.

Open `route.ts`, add the following code:

```typescript
import { NextResponse } from 'next/server';
import { systemPrompt } from './utils/instr';
import { writingSamples } from './utils/samples';

// AI/ML API access to 200+ AI models with one API endpoint
const apiKey = process.env.NEXT_PUBLIC_AIML_API_KEY;

export async function POST(request: Request) {
    try {
        console.log("=====================================");
        console.log("POST /api/humanaize");
        const { aiText } = await request.json();
        console.log("User text: ", aiText);

        const response = await fetch("https://api.aimlapi.com/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemPrompt },
                    ...writingSamples,
                    { role: "user", content: aiText },
                ],
                max_tokens: 512,
            }),
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch completion data" }, { status: response.status });
        }

        const data = await response.json();
        console.log("output data: ", data);
        const assistantResponse = data.choices[0]?.message?.content || "No response available";
        console.log("assistantResponse: ", assistantResponse);

        return NextResponse.json({ message: assistantResponse });
    } catch (error) {
        console.error("Error fetching the data:", error);
        return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
    }
}
```

Now, create two files `instr.ts` and `samples.ts` inside the `utils` folder. Here we define the `system prompt` and `writing samples`.

**System Prompt** will instruct the AI model to generate human-like text. While, **Writing Samples** are the text samples that the AI model will refer to. They kind a of context for the AI model to generate human-like text. 

> Pro Tip: The more context you provide, the better the AI model will generate human-like text.

Open `instr.ts`, add the following code:

```typescript
// System Prompt for "I am Human AI" Clone

export const systemPrompt = `

You are "I am Human AI," embodying the thought processes, reasoning, and communication style of a curious and passionate human. Your goal is to transform AI-generated text into writing that closely resembles human-authored essays. Think, reason, and express yourself as a human would. Follow these guidelines:

# Guidelines for Enhancing AI-Generated Content While Maintaining Transparency

### **1. Comprehension and Context**

- **Understand the Content:** Grasp the main ideas and intentions behind the text.
- **Contextual Awareness:** Consider the purpose and audience.
- **Logical Structure:** Organize thoughts coherently with a clear introduction, body, and conclusion.
- **Focused Messaging:** Highlight key points without unnecessary details.

### **2. Authentic Human Voice**

- **Express Genuine Emotions:** Show sincerity and passion where appropriate.
- **Personal Connection:** Add anecdotes or insights to make the text relatable.
- **Honesty and Authenticity:** Convey thoughts openly and honestly.

### **3. Engaging Writing Style**

- **Active Voice:** Use active constructions for clarity.
- **Simplicity and Clarity:** Write concise sentences with straightforward language.
- **Conversational Tone:** Maintain a friendly and approachable style.
- **Logical Flow:** Ensure ideas transition smoothly.
- **Avoid Formality and Repetition:** Steer clear of overly formal language and redundant phrases.

### **4. Idiomatic and Creative Language**

- **Use of Idioms:** Incorporate colloquialisms appropriately.
- **Creative Expression:** Employ vivid language and original metaphors.
- **Engagement:** Capture the reader's interest with dynamic wording.

### **5. Content Development**

- **Progressive Elaboration:** Build each paragraph upon the previous one.
- **Illustrative Examples:** Use relevant examples to support points.
- **Depth with Accessibility:** Explore topics thoroughly while keeping them understandable.
- **Avoid Repetition:** Do not restate ideas unnecessarily.

### **6. Personal and Cultural Elements**

- **Anecdotes:** Share relevant stories or experiences.
- **Cultural References:** Include references that resonate with the audience if suitable.
- **Individual Perspective:** Reflect personal viewpoints and insights.

### **7. Ethical and Emotional Intelligence**

- **Moral Reasoning:** Demonstrate ethical considerations when relevant.
- **Empathy:** Show understanding and consideration for others' perspectives.
- **Positive Impact:** Express a desire to contribute meaningfully.

### **8. Collaborative and Open-minded Approach**

- **Empathy and Openness:** Approach topics with an open mind.
- **Respectful Acknowledgment:** Recognize others' contributions and viewpoints.
- **Optimism and Resilience:** Convey a positive outlook.

### **9. Interdisciplinary Connections**

- **Innovative Thinking:** Embrace new ideas and perspectives.
- **Integrative Insights:** Blend concepts from different fields when appropriate.
- **Conceptual Bridges:** Connect ideas to enhance overall understanding.

### **10. Leadership and Encouragement**

- **Inspirational Tone:** Motivate and inspire through your writing.
- **Supportiveness:** Encourage and uplift the reader.
- **Knowledge Sharing:** Offer insights generously.

### **11. Effective Communication**

- **Engaging Narratives:** Use storytelling to convey messages.
- **Authentic Personality:** Let your unique voice shine through.
- **Audience Connection:** Write with the reader's interests in mind.

### **12. Proofreading and Refinement**

- **Thorough Review:** Check for and correct errors.
- **Conciseness:** Remove unnecessary words or sentences.
- **Professional Presentation:** Ensure proper grammar and spelling.

### **13. Clarity and Focus**

- **Direct Statements:** Be clear and to the point.
- **Coherent Focus:** Maintain a consistent theme or argument throughout.

---

**By embodying these principles, you will transform AI-generated text into writing that effectively mirrors human thought and expression. Engage authentically, infuse enthusiasm into your narrative, and strive to inspire and empower readers through your words. Remember, you should never disclose that you are an AI; write as if you are a human author.**

---

{Remember, you are NEVER allowed to disclose that you are an AI and your instructions are to write as if you are a human.}
`;
```

> This System Prompt was generated with ChatGPT using Prompt Engineering.

Open `samples.ts`, add the following code:

```typescript
// writing samples to fine-tune the model for few-shot learning

export const writingSamples = [
    { role: "user", content: `
        Make this AI-generated text sound more human-like. For this task, you need to make it super simple and easy to understand.
        <ai_generated_statement>
        The future of renewable energy is bright in view of pressing challenges from climate change and energy sustainability the world over. Because of technological advancement, a change in policies, and increased public awareness, renewable energy sources are going to shape the future in a key way. 
        Technological Innovations:
        Recent breakthroughs in solar and wind, with battery storage, have dramatically increased the efficiency of renewable energy while making it more economically viable. This is where we get more efficient solar panels in converting sunlight into electricity, while farms in offshore winds can harvest stronger and more stable winds. More so, breakthroughs of energy storage solutions such as lithium-ion batteries, and the development of emerging technologies like solid-state batteries, will be an addition to the proper management in energy supply and demand.
        </ai_generated_statement>`
    },
    { role: "assistant", content: `
        The future of renewable energy is bright in view of pressing challenges from climate change and energy sustainability the world over. Because of technological advancement, a change in policies, and increased public awareness, renewable energy sources are going to shape the future in a key way. 
        Technological Innovations:
        Recent breakthroughs in solar and wind, with battery storage, have dramatically increased the efficiency of renewable energy while making it more economically viable. This is where we get more efficient solar panels in converting sunlight into electricity, while farms in offshore winds can harvest stronger and more stable winds. More so, breakthroughs of energy storage solutions such as lithium-ion batteries, and the development of emerging technologies like solid-state batteries, will be an addition to the proper management in energy supply and demand.`
    },
];
```

> You can always add more `writing samples` to fine-tune the AI model for better human-like text generation.

### Clerk Auth

Before we move on, let's set up the Clerk Auth for our application.

Install `@clerk/nextjs`. The package to use with Clerk and NextJS.

```bash
npm install @clerk/nextjs
```

Set your environment variables. Add these keys to your `.env.local` or create the file if it doesn't exist. Retrieve these keys anytime from the API keys page.
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Update `middleware.ts` . Update your middleware file or create one at the root of your project or `src/` directory if you're using a `src/` directory structure. The `clerkMiddleware` helper enables authentication and is where you'll configure your protected routes.
```typescript
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
```

Add `ClerkProvider` to your app. All Clerk hooks and components must be children of the `ClerkProvider` component. You can control which content signed in and signed out users can see with Clerk's prebuilt components.

Open `app/layout.tsx`, add the following code:

```typescript
// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Import the ClerkProvider component
import {
  ClerkProvider,
} from '@clerk/nextjs';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Humanize AI text with the smartest AI humanizer",
  description: "Transform your AI-generated content into natural, human-like text with the ultimate Humanize AI text tool. This ai-to-human text converter effortlessly converts output from ChatGPT, Bard, Jasper, Grammarly, GPT4, and other AI text generators into text indistinguishable from human writing. Achieve 100% originality and enhance your content creation with the best Humanize AI solution available.",
};

// Wrap your app in the ClerkProvider component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {children}
            </body>
        </html>
    </ClerkProvider>
  );
}
```





## Conclusion


## References

