let videos = [{
    title: "First Video",
    rating: 5,
    comment: 2,
    createAt: "2 minutes age",
    views: 0,
    id: 1,
}, 
{
    title: "Second Video",
    rating: 5,
    comment: 2,
    createAt: "2 minutes age",
    views: 59,
    id: 2,
}, 
{
    title: "Third Video",
    rating: 5,
    comment: 2,
    createAt: "2 minutes age",
    views: 59,
    id: 3,
}];

export const trending = (req, res) => {
    return res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
    const {id} = req.params;
    const video = videos[id - 1];
    return res.render("watch", { pageTitle: `Watching ${video.title}`, video });
}
export const getEdit = (req, res) => {
    const {id} = req.params;
    const video = videos[id - 1];
    return res.render("edit", {pageTitle: `Editing: ${video.title}`, video });
};
export const postEdit = (req, res) => {
    const {id} = req.params;
    const {title} = req.body;
    videos[id - 1].title = title;
    return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    return res.render('upload', {pageTitle: 'Upload Viedo', id: videos.length + 1});
}

export const postUpload = (req, res) => {
    videos.push(req.body);
    return res.redirect('/');
}