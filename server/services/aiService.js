const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({});

async function analyzeResume(resumeText, jobTitle, jobDescription) {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("Warning: GEMINI_API_KEY missing. Using fallback mock analysis.");
        return getMockAnalysis(jobTitle);
    }

    // A robust, structured prompt designed for consistent JSON output and deeper HR analysis
    const prompt = `
        You are an elite Technical Recruiter and Applicant Tracking System (ATS) optimization expert. 
        Your task is to critically analyze the provided Resume against a specific Job Title and Job Description to evaluate candidate fit.

        [TARGET ROLE]
        Job Title: ${jobTitle}
        Job Description:
        """
        ${jobDescription || "Not provided."}
        """

        [CANDIDATE DATA]
        Resume Text:
        """
        ${resumeText}
        """

        [EVALUATION MANDATE]
        1. Assess core technical stack matches and identify specific skill alignment.
        2. Evaluate overall experience depth relative to the job requirements.
        3. Call out notable red flags, missing prerequisites, or critical skill gaps.
        4. Calculate a realistic "aiScore" (0-100) based strictly on how well the resume satisfies the job requirements.

        [OUTPUT SPECIFICATION]
        Provide your evaluation STRICTLY in the following JSON format. Do not include any introductory text, markdown code blocks (such as \`\`\`json), or trailing explanations. The output must be directly parseable by JSON.parse().

        {
        "aiSummary": "A concise, 3-bullet point summary using standard formatting (e.g., '• Point 1\\n• Point 2\\n• Point 3') highlighting tech stack alignment, experience level, and critical missing gaps or red flags.",
        "aiScore": 85
        }
    `;

    // Next step: call the Gemini API using 'ai' and pass this prompt...
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        })
        let resultText = response.text.trim()

        if (resultText.startsWith('```')) {
            resultText = resultText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
        }

        const parsedData = JSON.parse(resultText);

        return {
            aiSummary: parsedData.aiSummary || `• Profile parsed for position: ${jobTitle}`,
            aiScore: typeof parsedData.aiScore === 'number' ? parsedData.aiScore : 75
        };
    } catch (error) {
        console.error("AI Generation or Parsing Error:", error);
        // CRITICAL FIX: You MUST return the fallback object here so the route handler gets valid data!
        return getMockAnalysis(jobTitle); 
    }
}

// Sturdy fallback simulation utility
function getMockAnalysis(jobTitle) {
  return {
    aiSummary: `the ai doesn't work`,
    aiScore: 0
  };
}

module.exports = {analyzeResume};