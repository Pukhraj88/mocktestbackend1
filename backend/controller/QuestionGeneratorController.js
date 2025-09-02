import { GoogleGenAI } from "@google/genai";

// const GEMINI_API_KEY = "AIzaSxxxxxxxxqdCUyt7BU";
const GEMINI_API_KEY = "AIzaSyAl8hcajvBf6wL11IXWFtY6vZtZC62zJ88";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const QuestionGeneratorController=async (req, res)=>{
  const { topic, count } = req.body;
  try {
    const prompt = `Generate ${count} ${topic} multiple choice questions in JSON format with this exact structure:
    [ 
      {
        "id": 1,
        "category": "${topic}",
        "question": {
      "en": "Question text in English?",
      "hi": "Same question translated in Hindi?"
        },
        "options": {
           "en": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "hi": ["Option 1 in Hindi", "Option 2 in Hindi", "Option 3 in Hindi", "Option 4 in Hindi"]
        },
        "answer": {
       "en": "Correct Option",
         "hi": "Correct Option in hindi",        
        }
      }
    ]
  Rules:
  - Questions must follow the style of **government competitive exams** like SSC, RRB, TCS, RPSC.
  - Use **patterns similar to previously asked questions in goverment exams** (e.g., GK, reasoning, maths, current affairs).
  - Each question must be **clear, complete, and properly formatted**.
  - No incomplete statements or missing options.
  - Output must be valid JSON only.
    `;
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
    });
    let questions = [];
    if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const text = response.candidates[0].content.parts[0].text;

      let cleanedText = text
        .replace(/```json|```/g, "")
        .replace(/(\r\n|\n|\r)/g, "")
        .replace(/(\s)+/g, " ")
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
        .replace(/,(\s*[\]}])/g, "$1");

      try {
        questions = JSON.parse(cleanedText);
        questions = questions.map((question, index) => ({
          id: question.id || index + 1,
          category: question.category || topic,
          question: {
            en: question.question?.en || "Question not properly generated",
            hi: question.question?.hi || "प्रश्न सही से उत्पन्न नहीं हुआ",
          },
          options: {
            en: question.options?.en || [
              "Option 1",
              "Option 2",
              "Option 3",
              "Option 4",
            ],
            hi: question.options?.hi || [
              "विकल्प 1",
              "विकल्प 2",
              "विकल्प 3",
              "विकल्प 4",
            ],
          },
          answer: {
            en: question.answer?.en || "Correct answer not provided",
            hi: question.answer?.hi || "सही उत्तर उपलब्ध नहीं है",
          },
        }));
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
      }
    }
    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.json({ questions });
  }
};


