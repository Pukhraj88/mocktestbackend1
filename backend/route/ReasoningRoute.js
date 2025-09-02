import express from "express"
import { ReasoningQuestionGenerator } from "../controller/ReasoningController.js";

const ReasoningRouter=express.Router();

ReasoningRouter.post("/generatereasoning",ReasoningQuestionGenerator)

export default ReasoningRouter;