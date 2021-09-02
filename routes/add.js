const {Router} = require(`express`),
      router = Router(),
      auth = require(`../midleware/auth`),
      Course = require(`../models/addcourse`),
      User = require(`../models/user`),
      {productValid} = require(`../helpers/validators`),
      {validationResult} = require(`express-validator`)
    
router.get(`/addcourses`,auth,async(req,res) => {
    const user = await User.findOne({_id:req.user.id}).lean() 
    res.render(`addcourses`,{
        title:"Добавить курс",
        isAdd:true,
        user
    })
})

router.post(`/add`,auth,productValid,async (req,res) => {

    const errors = validationResult(req)
    const user = await User.findOne({_id:req.user.id}).lean() 
    if(!errors.isEmpty()){
        return res.status(422).render(`addcourses`,{
            title:"Добавить курс",
            isAdd:true,
            user,
            data:{
                title:req.body.title,
                price:req.body.price,
                img:req.body.img,
                UserId:req.user._id,
                csurf:req.csrfToken()
            },
            error:errors.array()[0].msg
        })
    }

    const course = new Course({
        title:req.body.title,
        price:req.body.price,
        img:req.body.img,
        UserId:req.user._id,
        csurf:req.csrfToken()
    })
    try{
        await course.save();
        res.redirect(`/courses`)
    }catch(e){
        console.log(e)
    }

})

module.exports = router