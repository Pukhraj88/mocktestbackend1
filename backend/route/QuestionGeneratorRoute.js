import express from "express"
import { QuestionGeneratorController } from "../controller/QuestionGeneratorController.js";

const QuestionRouter=express.Router();

QuestionRouter.post("/generate-questions",QuestionGeneratorController)

export default QuestionRouter;