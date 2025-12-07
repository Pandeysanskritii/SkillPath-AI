import { GoogleGenAI } from "@google/genai";
import { RoadmapData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRoadmap = async (topic: string): Promise<RoadmapData> => {
  const prompt = `
    Create a structured, practical, and engaging learning roadmap for "${topic}", designed specifically for beginners, career-switchers, and working professionals.

    You must output valid JSON matching this schema exactly:
    {
      "topic": "${topic}",
      "palette": { 
        "primary": "Hex color code (e.g. #3B82F6) suitable for the topic", 
        "secondary": "Hex color code (e.g. #DBEAFE)", 
        "accent": "Hex color code (e.g. #F59E0B)" 
      },
      "summary_markdown": "A comprehensive 1-2 paragraph summary explaining what the field is, where it is used, and key skills. Use simple markdown (bold, bullets) if needed.",
      "modules": [
        {
          "level": "Beginner | Intermediate | Advanced",
          "title": "Module Title",
          "subtopics": [
            { 
              "concept": "Subtopic Name", 
              "explanation": "1-2 sentence explanation", 
              "resources": [
                { "title": "Resource Name", "url": "Valid URL", "type": "Article/Video/Course", "duration": "Time estimate" }
              ], 
              "task": "Hands-on task description", 
              "acceptance_criteria": "Clear criteria to verify the task is done" 
            }
          ],
          "quiz": [
             { "question": "Question text", "options": ["Option A", "Option B", "Option C", "Option D"], "correct_answer": "The text of the correct option" }
          ],
          "project": { "title": "Module Project Name", "description": "Detailed project description for a portfolio piece" }
        }
      ],
      "final_assessment": [
        { "question": "Question text", "options": ["A", "B", "C", "D"], "correct_answer": "Correct Option Text" }
      ],
      "career_guidance": { 
        "next_steps": ["Actionable next step 1", "Actionable next step 2"], 
        "certifications": ["Cert 1", "Cert 2"] 
      }
    }

    Requirements:
    1. Create 3 Modules: Beginner, Intermediate, Advanced.
    2. For every subtopic include 2-4 FREE learning resources with valid URLs.
    3. Include 5 questions per module quiz.
    4. Include 10-15 questions for the final assessment.
    5. Choose an aesthetic color palette that fits the "${topic}" vibe.
    6. Ensure the tone is encouraging and clear.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json'
    }
  });

  if (!response.text) throw new Error("No response from AI");
  
  try {
    return JSON.parse(response.text) as RoadmapData;
  } catch (e) {
    console.error("Failed to parse JSON", response.text);
    throw new Error("Failed to generate a valid roadmap structure. Please try again.");
  }
};