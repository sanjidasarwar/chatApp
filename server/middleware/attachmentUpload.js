import fileUpload from "../utilites/fileUploader.js";

function attachmentUpload(req, res, next) {
    
    const upload = fileUpload(
         "attachmentImage",
         ["image/jpeg", "image/jpg", "image/png"],
         1000000, 
         "Only .jpg, jpeg or .png format allowed!"
    )

    upload.array("attachments", 10)(req, res, (err)=>{
        
        if(err){
            return res.json({
                message: err.message
            })
        }

        next()
    })

}

export default attachmentUpload