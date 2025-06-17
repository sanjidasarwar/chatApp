import fileUpload from "../utilites/fileUploader.js";

function avatarUpload(req, res, next) {
    const upload = fileUpload(
         "avatars",
         ["image/jpeg", "image/jpg", "image/png"],
         1000000, 
         "Only .jpg, jpeg or .png format allowed!"
    )

    upload.single("image")(req, res, (err)=>{
        if(err){
            return res.json({
                message: err.message
            })
        }
        next()
    })

}

export default avatarUpload