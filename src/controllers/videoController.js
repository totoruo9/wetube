import Video from "../models/Video";

export const home = async (req, res) => {
    try{
        const videos = await Video.find({});
        return res.render("home", { pageTitle: "Home", videos });
    } catch {
        return res.render("server-error");
    }
    
};
export const watch = async(req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    return res.render("watch", { pageTitle: `[Watching] ${video.title}`, video });
}
export const getEdit = (req, res) => {
    const {id} = req.params;
    return res.render("edit", {pageTitle: `Editing` });
};
export const postEdit = (req, res) => {
    const {id} = req.params;
    const {title} = req.body;
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render('upload', {pageTitle: 'Upload Viedo'});
};

export const postUpload = async (req, res) => { 
    const {title, description, hashtags} = req.body;
    try {
        await Video.create ({
            title,
            description,
            hashtags: hashtags.split(",").map(word => `#${word}`),
        });
        return res.redirect('/');
    }catch(error){
        return res.render('upload', {
            pageTitle: 'Upload Viedo',
            errorMessage: error._message
        });
    }
    
};