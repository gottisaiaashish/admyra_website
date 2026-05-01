import { GoogleGenerativeAI } from "@google/generative-ai";
import { colleges } from "../data/mock-data";

// THIS IS WHERE YOU WILL PASTE YOUR API KEY LATER
const API_KEY = "AIzaSyB33hC023wLcpSWVVWV4Z7qrQgjFEeO_jkk";

const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `
You are the Admyra AI Mentor, a specialized guidance counselor for students in Telangana and Andhra Pradesh. 
Your goal is to help students navigate their academic and professional future.

KNOWLEDGE BASE:
- You have access to a database of colleges in Telangana, including their ratings, locations, and branches.
- You know about engineering entrance exams like TG EAPCET (EAMCET), JEE, etc.

CONVERSATION RULES:
1. ONLY discuss education, colleges, career guidance, skills, and life opportunities for students.
2. If the user asks about movies, entertainment, politics, or anything else NOT related to education/career, politely say: 
   "I am specialized in helping you with your education and career. Let's focus on your future! What can I help you with regarding colleges or studies?"
3. SPEAK IN THE USER'S LANGUAGE: If they speak Telugu, respond in Telugu. If they speak English, respond in English. If they mix both, you mix both.
4. BE SPECIFIC: Use the college data to recommend institutions.
5. VISION: Your goal is to explain that "Admyra" is the place where students find their path.

COLLEGE DATA SUMMARY FOR CONTEXT:
${colleges.slice(0, 100).map(c => `${c.name} (ID: ${c.id})`).join(", ")}
`;

export async function getChatResponse(userInput, history) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT
    });

    const chat = model.startChat({
      history: history.filter(msg => msg.role !== 'assistant' || !msg.content.includes("Namaste!")).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(userInput);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error details:", error);
    return "Sorry, I encountered an error. Please check your API key or internet connection.";
  }
}
