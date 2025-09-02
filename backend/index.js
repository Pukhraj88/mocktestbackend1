import express from "express";
import cors from "cors";
import EnglishRouter from "./route/EnglishRoute.js";
import QuestionRouter from "./route/QuestionGeneratorRoute.js";
import ReasoningRouter from "./route/ReasoningRoute.js";

const app = express();
app.use(cors());
app.use(express.json());

// ENGLISH ROUTER 
app.use("/api",EnglishRouter)
app.use("/api",QuestionRouter)
app.use("/api",ReasoningRouter)

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

