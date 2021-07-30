import User from "../models/User"
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getJoin = (req, res) => {
    res.render("users/join", {pageTitle: "Join"})
};
export const postJoin = async(req, res) => {
    const {name, username, email, password, password2, location} = req.body;
    const pageTitle="Join"
    if(password !== password2){
        return res.status(400).render("users/join", {
            pageTitle,
            errorMessage: "Password confirmation does not match"
        });
    }
    const exists = await User.exists({$or:[{username}, {email}]});
    if(exists){
        return res.status(400).render("users/join", {
            pageTitle,
            errorMessage: "This username/email is alreay taken"
        });
    };
    try{
        await User.create({name, username, email, password, location});
    } catch (error){
        return res.status(400).render('users/join', {
            pageTitle: 'Join',
            errorMessage: error._message
        });
    }
    
    return res.redirect("/login");
};

export const getLogin = (req, res) => {
    req.session.loginState = false;
    return res.render("users/login", {pageTitle:"Login"});
}
export const postLogin = async(req, res) => {
    const {username, password} = req.body;
    const pageTitle = "Login"
    const user = await User.findOne({username, socialOnly: false});
    if(!user){
        return res.status(400).render("users/login", {pageTitle, errorMessage:"An account with this username does not exists"})
    }

    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("users/login", {pageTitle, errorMessage: "Wrong password"});
    }
    req.session.loginState = true;
    req.session.user = user;
    return res.redirect("/");
}

export const startGithublogin = (req, res) => {
    const baseUrl = `https://github.com/login/oauth/authorize`;
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}

export const finishGithubLogin = async(req, res) => {
    const baseUrl = `https://github.com/login/oauth/access_token`
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await(
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json"
            }
        })
    ).json();

    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await(
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();
        const emailData =  await(
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if(!emailObj){
            return res.redirect("/login");
        }
        let user = await User.findOne({email: emailObj.email});

        if(!user){
            user = await User.create({
                name: userData.name || userData.login,
                avatarUrl: userData.avatar_url,
                socialOnly: true,
                username: userData.login,
                email: emailObj.email,
                password:"",
                location: userData.location,
            });
        };
        req.session.loginState = true;
        req.session.user = user;
        return res.redirect("/");
    }else{
        return res.redirect("/login");
    }
}

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const getEdit = (req, res) => {
    res.render("users/edit-profile", {pageTitle:"Edit profile"})
};

export const postEdit = async(req, res) => {
    const{
            session: {
                user: {_id, avatarUrl}
            },
            body: {name, email, username, location},
            file,
        } = req;

    const checkUserId = _id;
    const findEmail = await User.findOne({email});
    if(findEmail) {
        const checkEmailID = String(findEmail._id);
        if(checkEmailID !== checkUserId){
            return res.status(400).render("users/edit-profile", {pageTitle:"Edit profile", errorMessage:"This Email is alreay used"});
        };
    };

    const findUsername = await User.findOne({username});
    if(findUsername){
        const checkUsernameId = String(findUsername._id);
        if(checkUsernameId !== checkUserId){
            return res.status(400).render("users/edit-profile", {pageTitle:"Edit profile", errorMessage:"This Username is alreay used"});
        };
    };
    
    const updatedUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? file.path : avatarUrl,
        name,
        email,
        username, 
        location},
        {new: true}
    );
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
};

export const getChangePassword = async(req, res) => {
    if (req.session.user.socialOnly === true) {
        return res.redirect("/");
    };

    return res.render("users/change-password", {pageTitle:"Change Password"});
}

export const postChangePassword = async(req, res) => {
    const pageTitle = "Chage Password";
    const {
        session: {
            user: {_id,}
        },
        body: {oldPassword, newPassword, newPasswordConfirmation}
    } = req;
    
    const user = await User.findById({_id});
    
    const match = await bcrypt.compare(oldPassword, user.password);
    const samePassword = await bcrypt.compare(newPassword, user.password);

    if(!match){
        return res.status(400).render("users/change-password", {pageTitle, errorMessage:"Is not corect current password"});
    }
    if(newPassword !== newPasswordConfirmation){
        return res.status(400).render("users/change-password", {pageTitle, errorMessage:"The password does not match the confirmation"});
    }
    if(samePassword){
        return res.status(400).render("users/change-password", {pageTitle, errorMessage:"Enter the same password"});
    }
    user.password = newPassword;
    user.save()
    return res.redirect("/");
}


export const see = async(req, res) => {
    const {id} = req.params;
    const user = await User.findById(id).populate({
        path: "videos",
        populate: {
            path: "owner",
            model: "User",
        },
    });
    
    if(!user){
        return res.status(404).render("404", {pageTitle: "User not found!"});
    };
    return res.render("users/profile", {pageTitle: `${user.name} Profile`, user});
}