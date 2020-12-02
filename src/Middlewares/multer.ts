
import multer from 'multer';
import path from 'path'
import { v4 as uuid } from 'uuid' 

const storage = multer.diskStorage({
    destination: path.join(__dirname,'../tmp'),
    filename: (req, file, cb) => {
        cb(null, uuid() + path.extname(file.originalname))
    }
});

let pesoMB:number = 5 // peso de las imagenes

const multerStorage = multer({storage,limits: {fileSize: pesoMB*1000*1000 },fileFilter: function(req, file, cb){
          if((file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/png")){
                return cb(null, true);
           } else{ 
                return cb(new Error("formato"));
           }
} })

export default multerStorage;


