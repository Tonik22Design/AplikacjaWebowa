import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function (request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = request.body;

  if (!prompt) {
    return response.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    // TA LINIA JEST KLUCZOWA! Tutaj określasz model.
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); 

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    response.status(200).json({ reply: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    response.status(500).json({ error: 'Failed to generate content from Gemini API.' });
  }
}