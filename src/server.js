import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
<<<<<<< HEAD
import { localsMiddleware } from "./middleware";
=======
import {localsMiddleware} from "./middleware";
>>>>>>> 001e6fd51c91152bbd413423af1b2133418c824f

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({extended: true}));

<<<<<<< HEAD
app.use(
        session({
        secret: "Hello!",
        resave: true,
        saveUninitialized: true,
    })
);

app.use(localsMiddleware);

app.get("/add-one",(req, res, next) => {
    req.session.potato += 1;
    return res.send(`${req.session.id}\n${req.session.potato}`);
});
=======
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1800000,
    },
    store: MongoStore.create({mongoUrl: process.env.DB_URL})
}))
>>>>>>> 001e6fd51c91152bbd413423af1b2133418c824f

app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;