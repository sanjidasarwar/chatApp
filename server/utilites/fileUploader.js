import createError from 'http-errors'
import multer from "multer"
import path from "path"

function fileUpload(
    subfolder_path, 
    allowed_file_types,
    max_file_size,
    error_msg) {

     // Dynamically resolve uploads folder relative to root,
    const UPLOADS_FOLDER =path.resolve(process.cwd(),"public", "uploads", subfolder_path)

    const storage = multer.diskStorage({
        destination: (req, file, cb) =>{
            cb(null, UPLOADS_FOLDER)
        },
        filename: (req, file, cb)=>{
            const fileExt = path.extname(file.originalname)
            const baseName = path.basename(file.originalname, fileExt)
            const fileName = `${baseName.toLowerCase().split(" ").join("-")}-${Date.now()}${fileExt}`

            cb(null, fileName)
        }
    })

    const upload =multer({
        storage: storage,
         limits: {
            fileSize: max_file_size,
        },
        fileFilter:(req, file, cb)=>{
            if(!allowed_file_types.includes(file.mimetype)){
                return cb(createError(error_msg));
            }

            cb(null, true);
        }
    })

    return upload;
}

export default fileUpload;
