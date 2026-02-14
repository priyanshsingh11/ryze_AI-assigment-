import { NextResponse } from 'next/server';
import { AGENT_PROMPTS } from '@/lib/agent_prompts';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || process.env.AI_API_KEY || "missing_key",
});

async function runStep(prompt, input) {
    if (!groq.apiKey || groq.apiKey === "missing_key") {
        throw new Error("GROQ_API_KEY is not defined. Please add it to .env.local");
    }
    const completion = await groq.chat.completions.create({
        messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: input },
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.1,
    });
    const content = completion.choices[0].message.content;
    console.log(`Step Result [${prompt.substring(0, 15)}...]:`, content.substring(0, 100));
    return content;
}

export async function POST(req) {
    try {
        const { intent, previousPlan, previousCode } = await req.json();
        console.log('Generating UI for intent:', intent);

        const context = `
USER_INTENT: ${intent}
PREVIOUS_PLAN: ${JSON.stringify(previousPlan)}
PREVIOUS_CODE: ${previousCode}
    `;

        // 1. PLANNER
        const plannerOutput = await runStep(AGENT_PROMPTS.PLANNER, context);
        let plan;
        try {
            const jsonMatch = plannerOutput.match(/\{[\s\S]*\}/);
            plan = JSON.parse(jsonMatch ? jsonMatch[0] : plannerOutput);
        } catch (e) {
            plan = { error: "Failed to parse plan", raw: plannerOutput };
        }

        // 2. VALIDATOR
        const validation = await runStep(AGENT_PROMPTS.VALIDATOR, plannerOutput);

        // 3. GENERATOR
        const generatedResponse = await runStep(AGENT_PROMPTS.GENERATOR, plannerOutput);
        const codeMatch = generatedResponse.match(/```(?:jsx?|javascript)?([\s\S]*?)```/i);
        let code = codeMatch ? codeMatch[1].trim() : generatedResponse.trim();

        // Cleanup if markdown backticks were missing
        if (!codeMatch) {
            code = code.replace(/^(GENERATED_CODE:|JSX:|Code:)/i, '').trim();
        }

        // 4. EXPLAINER
        const explanationResponse = await runStep(AGENT_PROMPTS.EXPLAINER, `Plan: ${JSON.stringify(plan)}\nChanges: ${context}`);
        const explanation = explanationResponse.replace(/EXPLANATION:/i, '').trim();

        return NextResponse.json({
            plan,
            validation,
            code,
            explanation,
            version: Date.now()
        });
    } catch (error) {
        console.error('Groq Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
