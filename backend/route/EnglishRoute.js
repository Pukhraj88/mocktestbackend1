import express from "express"
import { EnglishQuestionGenerator } from "../controller/EnglishController.js";

const EnglishRouter=express.Router();

EnglishRouter.post("/generate-english",EnglishQuestionGenerator)

export default EnglishRouter;