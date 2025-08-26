
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { IndividualData, Domain, ReferenceInterval } from './_lib/assessment.js';

// Initialize the Gemini AI client securely on the server-side.
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable is not set.");
}
const ai = new GoogleGenAI({ apiKey });

// Define the expected JSON structure for the AI's response.
const responseSchema = {
    type: Type.OBJECT,
    properties: {
        insights: {
            type: Type.ARRAY,
            description: "An array of personalized insight strings, one for each domain provided in the input.",
            items: {
                type: Type.STRING,
                description: "A personalized insight message for a single domain."
            }
        },
    },
    required: ['insights']
};

/**
 * Generates a descriptive context string for a given domain's score to guide the AI.
 * @param domain - The domain object containing name, score, intervals, and interpretation.
 * @returns A string explaining the score's meaning.
 */
function getDomainScoringContext(domain: { name: string, score: number | null, referenceIntervals: ReferenceInterval[], userInterpretation: string }): string {
    const score = domain.score;
    if (score === null) {
        return "The user did not complete enough questions for a score to be calculated for this domain.";
    }
    const interpretation = domain.userInterpretation;

    switch (domain.name) {
        case 'Depression':
        case 'Anger':
        case 'Anxiety':
        case 'Sleep Disturbance':
            return `This domain is measured using a PROMIS T-Score. In the general population, the average T-Score is 50. Higher scores indicate more significant symptoms. The user's score of ${score.toFixed(1)} falls into the '${interpretation}' range.`;
        case 'Mania':
            return `This domain is measured using the Altman Self-Rating Mania Scale (ASRM). A score of 6 or higher is considered a positive screen, suggesting a high probability of manic or hypomanic symptoms. The user scored ${score}.`;
        case 'Somatic Symptoms':
            return `This domain is measured using the Patient Health Questionnaire 15 (PHQ-15). Scores of 5, 10, and 15 are cutoff points for low, medium, and high symptom severity, respectively. The user's score of ${score} indicates a '${interpretation}' level of severity.`;
        case 'Obsessions & Compulsions':
            return `This domain is measured by the Florida Obsessive-Compulsive Inventory (FOCI), with an average score from 0 (None) to 4 (Extreme). The user's average score of ${score.toFixed(1)} suggests a '${interpretation}' level of severity.`;
        case 'Suicide Ideation':
        case 'Psychosis':
        case 'Cognition':
        case 'Dissociation':
        case 'Personality Functioning':
            const threshold = domain.referenceIntervals.find(i => i.label.includes('Further inquiry'))?.min ?? 1;
            const isAboveThreshold = score >= threshold;
            return `This is a screening domain where responses are evaluated against a clinical threshold. The user's score of ${score} is ${isAboveThreshold ? 'at or above' : 'below'} the threshold for which further inquiry is indicated.`;
        default:
            return `The user's score is ${score}. The interpretation is '${interpretation}'.`;
    }
}


export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).end('Method Not Allowed');
  }

  try {
    const userData: IndividualData = request.body;

    if (!userData || !userData.firstName || !userData.domains) {
        return response.status(400).json({ error: "Invalid user data provided." });
    }
    
    const model = "gemini-2.5-flash";

    const prompt = `
        You are an expert and compassionate clinical psychologist providing feedback on a mental wellness self-assessment.
        The user's name is ${userData.firstName}. Their results are in this JSON object:
        ${JSON.stringify(userData.domains.map(d => ({ 
            name: d.name, 
            interpretation: d.userInterpretation, 
            score: d.score,
            scoringContext: getDomainScoringContext({ name: d.name, score: d.score, referenceIntervals: d.referenceIntervals, userInterpretation: d.userInterpretation })
        })), null, 2)}

        For each domain, generate a personalized "Insights & Support" message. Your response MUST be a JSON object matching the provided schema. The 'insights' array must have the same number of elements as the input domains.

        Follow this three-part structure for each message, addressing ${userData.firstName} by name:
        1.  **Acknowledge & Explain:** Start by empathetically acknowledging their result. Use the 'scoringContext' to explain what their score means in simple, jargon-free terms. For example, if the context says "T-Score where 50 is average," you could say, "Your score is a bit above the population average, suggesting you're experiencing these feelings more than most people."
        2.  **Describe Potential Impact:** Briefly and gently explain how these feelings or symptoms might show up in their daily life (e.g., "This can sometimes make it challenging to...").
        3.  **Provide Tiered, Actionable Guidance:** Based on their specific interpretation and score:
            - If the interpretation suggests healthy functioning ("Minimal," "None," "Low," "Within normal limits"), provide positive reinforcement and wellness tips. (e.g., "It's great that you're feeling steady in this area. To maintain this, consider continuing practices like...")
            - If the interpretation is "Mild" or shows some difficulties, suggest gentle, actionable self-care strategies. (e.g., "Since you're noticing a mild level of these feelings, exploring practices like mindfulness or journaling could be a helpful next step.")
            - If the interpretation is "Moderate," suggest concrete strategies and gently encourage professional consultation. (e.g., "Managing a moderate level of these symptoms can be tough. It may be beneficial to explore this with a professional who can provide tailored tools and strategies.")
            - If the interpretation is "Severe," "High," or "Further inquiry indicated," gently but clearly recommend professional help as a primary next step. (e.g., "These feelings can be very challenging to manage alone, and your score suggests they are having a significant impact. We strongly encourage you to connect with a mental health professional to discuss these results and find the best path forward.")
            
        Each insight must be professional, supportive, and about 3-4 sentences long. Do not give a diagnosis or use alarmist language. Tailor the tone to the severity of the score.
    `;

    const aiResponse: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.7,
        },
    });

    const jsonText = aiResponse.text;

    if (!jsonText) {
        console.error("AI response did not contain text. Full response:", JSON.stringify(aiResponse, null, 2));
        return response.status(500).json({ error: "Failed to get a valid text response from the AI model. The response may have been blocked or empty." });
    }

    const parsedJson = JSON.parse(jsonText.trim());

    if (parsedJson.insights && Array.isArray(parsedJson.insights) && parsedJson.insights.length === userData.domains.length) {
        return response.status(200).json({ insights: parsedJson.insights });
    } else {
        console.error("Generated insights array length does not match domain length.", parsedJson);
        return response.status(500).json({ error: "Failed to generate valid insights from AI model." });
    }

  } catch (error: any) {
    console.error("Error in /api/generate-insights:", error);
    return response.status(500).json({ error: 'An internal server error occurred while generating insights.' });
  }
}
