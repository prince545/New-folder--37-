import axios from 'axios';

// Requires VITE_GEMINI_API_KEY in .env
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function generateVisualizerSteps(problemTitle, userCode) {
    if (!GEMINI_API_KEY) {
        throw new Error("Gemini API Key is missing! Set VITE_GEMINI_API_KEY.");
    }

    const prompt = `
    You are an AI algorithm visualizer engine.
    The user is solving the problem: "${problemTitle}".
    Their code is:
    ${userCode}
    
    Given a small example input for this problem, trace the execution of their code step-by-step.
    Output ONLY a raw JSON array. Do not include markdown formatting or backticks.
    
    Each object in the array should represent a step in the algorithm and have the following structure:
    {
       "desc": "A short, 1 sentence explanation of what is happening in this step.",
       "data": [any primary data structure like an array, e.g. [1,2,3]],
       "pointers": { "i": 0, "j": 2 } // optional map of variable names to indices or values
    }
    
    Limit to a maximum of 15 steps.
  `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    try {
        const response = await axios.post(url, {
            contents: [{
                parts: [{ text: prompt }]
            }]
        });

        const textOutput = response.data.candidates[0].content.parts[0].text;

        // Attempt to parse JSON safely by stripping any markdown backticks
        const cleanedText = textOutput.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
        return JSON.parse(cleanedText);

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to generate visualization steps from Gemini.");
    }
}
