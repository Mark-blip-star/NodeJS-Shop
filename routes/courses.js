

const {Router} = require(`express`),
      Courses = require(`../models/addcourse`),
      router = Router(),
      auth = require(`../midleware/auth`),
      user = require(`../models/user`),
      {validationResult} = require(`express-validator`),
      {productValid} = require(`../helpers/validators`)

router.get(`/courses`,async (req,res) => {
    const courses = await Courses.find().lean();
    const user = req.session.isAuth === true? await User.findOne({_id:req.user._id}).lean() : await User.findOne({_id:req.body._id}).lean()
    
    res.render(`courses`,{
        title:`Товары`,
        isCourses:true,
        courses,
        user
    })
})

router.get(`/courses/:id/edit`,auth,async (req,res) => {
    if(!req.query.allow){
        res.redirect(`/`)
    }else {
        const courses = await Courses.findById(req.params.id).lean()
        res.render(`edit`,{
        title: `${courses.title}`,
        courses
    })
    }

})

router.post(`/courses/:id/edit`,auth,productValid,async (req,res) => {
    try{
        const error = validationResult(req)
        const courses = await Courses.findById(req.params.id).lean()

        if(!error.isEmpty()){
            return res.status(422).render(`edit`,{
                title: `${courses.title}`,
                courses,
                errors:error.array()[0].msg
            })
        }

        await Courses.findByIdAndUpdate(req.body.id,req.body);
        res.redirect(`/courses`)
    }catch(e){
        throw e
    }
})

router.get(`/courses/:id`,async (req,res) => {
    const courses = await  Courses.findById(req.params.id).lean();

    res.render(`this.course.hbs`,{
        title: `${courses.title}`,
        courses
    })
})

router.post(`/courses/remove`,auth,async(req,res) => {
    try{
        await Courses.deleteOne({_id:req.body.id})
        res.redirect(`/courses`)
    }
    catch{
        console.log(e)
    }
})

module.exports = router