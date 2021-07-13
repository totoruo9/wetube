import express from "express";

const PORT = 4000;

const app = express();

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
}

const handleHome = (req, res) => {
    return res.send("<h1>hello node</h1>");
};
const privateMiddlewaare = (req, res, next) => {
    const url = req.url;
    if(url === "/protected"){
        return res.send("<h1>Not Allowed</h1>");
    }
    next();
}
const handleLogin = (req, res) => {
    return res.send({message: "Login here"});
}
const handleProtected = (req, res) => {
    return res.send("Wellcome");
}
app.use(logger);
app.use(privateMiddlewaare);
app.get("/", handleHome);
app.get("/login", handleLogin);
app.get("/protected", handleProtected);


const handleListening = () => console.log(`Server listenting on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);