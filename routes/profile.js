const {Router} = require(`express`)
const auth = require(`../midleware/auth`)
const router = Router()
const User = require(`../models/user`)


router.get(`/profile` ,auth,async(req,res) => {
    const user = await  User.findOne({_id:req.user.id}).lean()
    res.render(`profile`,{
        title:`Профиль`,
        user
    })
})

router.post(`/profile`,auth,async(req,res) => {
    try{
        const user = await User.findById(req.user._id)

        const toChange = {
            name:req.body.name
        }

        if(req.file){
            toChange.avatarUrl = req.file.path
        }
        Object.assign(user, toChange)
        await user.save()
        res.redirect(`/profile`)
    }catch(e){
        throw e
    }
})
module.exports = router