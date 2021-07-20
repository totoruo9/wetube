export const localsMiddleware = (req, res, next) => {
    res.locals.loginState = Boolean(req.session.loginState);
    res.locals.siteName = "Wetube";
    res.locals.user = req.session.user;
    next();
}