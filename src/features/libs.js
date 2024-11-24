export const fileformat = (url) => {
    const filext = url.split(".").pop();

    let file = ""
    if (filext == "mp4" || filext == "webm" || filext == "ogg") { file = "video" }
    if (filext == "mp3" || filext == "wav") { file = "audio" }
    if (filext == "png" || filext == "jpg" || filext == "jpeg" || filext == "gif") { file = "image" }
    return file;
}