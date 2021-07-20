import express from "express";
import { edit, remove, see, logout, startGithublogin, finishGithubLogin } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/remove", remove);
userRouter.get("/github/start", startGithublogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/:id", see);


export default userRouter;