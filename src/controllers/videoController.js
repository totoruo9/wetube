import User from "../models/User";
import Video from "../models/Video";

export const home = async (req, res) => {
    try{
        const videos = await Video.find({}).sort({createdAt:"desc"});
        return res.render("home", { pageTitle: "Home", videos });
    } catch {
        return res.status(404).redirect("404", {pageTitle: "Video not found"});
    }
    
};
export const watch = async(req, res) => {
    const {id} = req.params;
    
    const video = await Video.findById(id).populate("owner");
    if(!video){
        return res.status(404).render("404", {pageTitle: "Video not found"});    
    }
    return res.render("watch", { pageTitle: `[Watching] ${video.title}`, video });
}
export const getEdit = async(req, res) => {
    const {id} = req.params;
    const {user: {_id}} = req.session;
    const video = await Video.findById(id);

    if(!video){
        return res.status(404).render("404", {pageTitle: "Video not found"})
    }

    if(String(video.owner) !== String(_id)){
        return res.status(403).redirect("/");
    }

    return res.render("edit", {pageTitle: `[Edit] ${video.title}`, video });
};
export const postEdit = async(req, res) => {
    const {id} = req.params;
    const {title, description, hashtags} = req.body;
    const {user: {_id}} = req.session;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).redirect("404", {pageTitle: `Video not found`});
    }

    if(String(video.owner) !== String(_id)){
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render('upload', {pageTitle: 'Upload Viedo'});
};

export const postUpload = async (req, res) => { 
    const {
        file: {path:fileUrl},
        session: {user: {_id}},
        body: {
            title,
            description,
            hashtags
        }
    } = req;
    try {
        const newVideo = await Video.create ({
            title,
            description,
            fileUrl,
            owner: _id,
            hashtags: Video.formatHashtags(hashtags),
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect('/');
    }catch(error){
        return res.status(400).render('upload', {
            pageTitle: 'Upload Viedo',
            errorMessage: error._message
        });
    }
    
};

export const deleteVideo = async(req, res) => {
    const {id} = req.params;
    const {user: {_id}} = req.session;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404", {pageTitle: "Video not found"})
    };

    if(String(_id) !== String(video.owner)){
        return res.status(403).redirect("/");
    };

    await Video.findByIdAndRemove(id);

    return res.redirect("/");
}

export const search = async(req, res) => {
    const {keyword} = req.query;
    let videos = [];
    if(keyword){
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i")
            },
        });
    }
    return res.render("search", { pageTitle:"Search", videos });
}