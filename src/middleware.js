import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    res.locals.loginState = Boolean(req.session.loginState);
    res.locals.siteName = "Wetube";
    res.locals.user = req.session.user || {};
    console.log(res.locals.user)
    next();
}

export const protectorMiddleware = (req, res, next) => {
    if(req.session.loginState){
        next();
    }else {
        return res.redirect("/login");
    }
}

export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loginState){
        return next();
    } else {
        return res.redirect("/");
    }
}

export const uploadFiles = multer({dest:"uploads/"})