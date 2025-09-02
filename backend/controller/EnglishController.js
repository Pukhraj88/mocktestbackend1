import { GoogleGenAI } from "@google/genai";

// const GEMINI_API_KEY = "AIzxxxxxxxxxxxxxxxxxxxxx5ArIqdCUyt7BU";
const GEMINI_API_KEY = "AIzaSyAl8hcajvBf6wL11IXWFtY6vZtZC62zJ88";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const EnglishQuestionGenerator=async (req, res)=>{
  const { topic, count } = req.body;
  try {
    const prompt = `Generate ${count} ${topic} multiple choice questions in JSON format with this exact structure:
    [ 
      {
        "id": 1,
        "category": "${topic}",
        "question": {
          "en": "Question in English",
          "hi": "Same as English (do not translate)"
        },
        "options": {
          "en": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "hi": ["Same as English (do not translate)"]
        },
        "answer": {
          "en": "Correct Option in English",
          "hi": "Same as English (do not translate)"
        }
      }
    ]
    Rules:
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
          const questionText = q.question?.en || "Question not properly generated";
          const optionsText =
            q.options?.en || ["Option 1", "Option 2", "Option 3", "Option 4"];
          const answerText = q.answer?.en || "Correct answer not provided";

          return {
            id: q.id || index + 1,
            category: q.category || topic,
            question: {
              en: questionText,
              hi: questionText, 
            },
            options: {
              en: optionsText,
              hi: optionsText, 
            },
            answer: {
              en: answerText,
              hi: answerText, 
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



