import { GoogleGenAI } from "@google/genai";

// const GEMINI_API_KEY = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxU";
const GEMINI_API_KEY = "AIzaSyAl8hcajvBf6wL11IXWFtY6vZtZC62zJ88";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const ReasoningQuestionGenerator=async (req, res)=>{
  const { topic, count } = req.body;
  try {
    const prompt = `Generate ${count} ${topic} multiple choice questions in JSON format with this exact structure:
    [ 
     {
    "id": 1,
    "category": "${topic}",
    "question": {
      "en": "Question text in English",
      "hi": "सवाल का वही अनुवाद हिंदी में"
    },
    "options": {
      "en": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "hi": ["विकल्प 1", "विकल्प 2", "विकल्प 3", "विकल्प 4"]
    },
    "answer": {
      "en": "Correct Option",
      "hi": "सही विकल्प"
    }
  }
      }
    ]
    Rules:
    Every field MUST have both English (en) and Hindi (hi).
- Hindi text should be a natural translation, not English repeated.
    - Questions must follow government exam style (grammar, comprehension, vocabulary, error spotting, etc).
    - Output must be strictly valid JSON (no extra text, no markdown).
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
       questions = questions.map((q, index) => {
  return {
    id: q.id || index + 1,
    category: q.category || topic,
    question: {
      en: q.question?.en || "Question not generated",
      hi: q.question?.hi || "प्रश्न उपलब्ध नहीं है",
    },
    options: {
      en: q.options?.en || ["Option 1", "Option 2", "Option 3", "Option 4"],
      hi: q.options?.hi || ["विकल्प 1", "विकल्प 2", "विकल्प 3", "विकल्प 4"],
    },
    answer: {
      en: q.answer?.en || "Correct answer not provided",
      hi: q.answer?.hi || "सही उत्तर उपलब्ध नहीं है",
    },
  };
});

      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
      }
    }
    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.json({ questions: [] });
  }
};



