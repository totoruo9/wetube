import express from "express";
import { registerView, createComment, deleteComment } from "../controllers/videoController";

const apiRouter = express.Router();

const BASE_URL = "/videos/:id([0-9a-f]{24})/";

apiRouter.post(`${BASE_URL}view`, registerView);
apiRouter.post(`${BASE_URL}comment`, createComment);
apiRouter.delete(`${BASE_URL}delete`, deleteComment)

export default apiRouter;