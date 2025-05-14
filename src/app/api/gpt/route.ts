import { NextResponse } from 'next/server';
import { systemPrompt } from '../humanaize/utils/instr';
import { writingSamples } from '../humanaize/utils/samples';
import Anthropic from '@anthropic-ai/sdk';

// Use server-side environment variable
const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
    throw new Error('Missing Anthropic API key');
}

const anthropic = new Anthropic({
    apiKey: apiKey
});

export async function POST(request: Request) {
    try {
        console.log("=====================================");
        console.log("POST /api/gpt");
        const { aiText } = await request.json();
        console.log("User text: ", aiText);

        if (!aiText) {
            return NextResponse.json(
                { error: "No text provided" },
                { status: 400 }
            );
        }

        try {
            const response = await anthropic.messages.create({
                model: 'claude-3-opus-20240229',
                max_tokens: 1024,
                temperature: 0.3,
                system: systemPrompt,
                messages: [
                    ...writingSamples
                        .filter(sample => sample.role === 'user' || sample.role === 'assistant')
                        .map(sample => ({
                            role: sample.role as 'user' | 'assistant',
                            content: sample.content
                        })),
                    {
                        role: 'user' as const,
                        content: aiText
                    }
                ]
            });

            const content = response.content[0];
            if (!content || content.type !== 'text') {
                throw new Error('Invalid response from Claude API');
            }

            return NextResponse.json({ message: content.text });
        } catch (error: any) {
            console.error('Claude API Error:', error);
            const errorMessage = error.message || 'Failed to process request';
            return NextResponse.json(
                { error: errorMessage },
                { status: error.status || 500 }
            );
        }
    } catch (error: any) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            { error: "An error occurred while processing your request" },
            { status: 500 }
        );
    }
}