export const localsMiddleware = (req, res, next) => {
<<<<<<< HEAD
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "wetube";
    res.locals.loggedInUser = req.session.user;
    next();
=======
    res.locals.loginState = Boolean(req.session.loginState);
    res.locals.siteName = "Wetube";
    res.locals.user = req.session.user || {};
    console.log(res.locals)
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
>>>>>>> 001e6fd51c91152bbd413423af1b2133418c824f
}