const multer = require(`multer`)

const storage = multer.diskStorage({
    destination (req,file,cb){
        cb(null,`images`)
    },

    filename(req,file,cb) {
        cb(null, Date.now() + `-` + file.originalname)
    }

})

const allowed = [`images/png`,`images/jpeg`,`images/jpg`]

const Filefilter = (req,file,cb) => {
    if(allowed.includes(file.mimetype)){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
module.exports = multer({
    storage, Filefilter

})