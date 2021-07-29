import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    res.locals.loginState = Boolean(req.session.loginState);
    res.locals.siteName = "Wetube";
    res.locals.user = req.session.user || {};
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

export const avatarUpload = multer({dest:"uploads/avatars/", limits: {
    fileSize: 3000000,
}})
export const videoUpload = multer({dest:"uploads/videos/", limits: {
    fileSize: 100000000,
}})