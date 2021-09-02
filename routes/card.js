const Course = require("../models/addcourse")
const auth = require(`../midleware/auth`)
const User = require(`../models/user`)

const {Router} = require(`express`),
      router = Router();

function find(obj){
        return  obj.item.map(c => ({
        ...c.courseId._doc, count : c.count
    }))
}
function total(item){
    return item.reduce((total,item) => {
        return total += item.price * item.count
        
    },0)
}

router.get(`/card`,auth,async (req,res) => {
    const user = await req.user
    .populate(`card.item.courseId`)
    .execPopulate()


    const courses = find(user.card)

    res.render(`card`,{
        title :"Корзина",
        courses: courses,
        total :total(courses),
        id: courses.courseId
    })
})

router.delete(`/card/remove/:id`,auth,async(req,res) =>{ 
    await req.user.upDate(req.params.id)

    const user = await req.user.populate(`card.item.courseId`).execPopulate(),
    courses = find(user.card)
    const cart = {
        courses,total:total(courses)
    }
    res.status(200).json(cart)
})

router.post(`/card/counter/:id`,auth,async(req,res) => {
    await req.user.counter(req.params.id)
    const user = await req.user.populate(`card.item.courseId`).execPopulate(),
    courses = find(user.card)
    const cart = {
        courses,total:total(courses)
    }
    res.status(200).json(cart)
})

router.post(`/card/add`,auth,async (req,res) => {
    const course = await Course.findById(req.body.id)
    await  req.user.addToCart(course)
    res.redirect(`/card`)
})

router.post(`/card/deleteitem` ,auth, async(req,res) => {
    try{
        req.user.upDate(req.body.id)
        res.redirect(`/card`)
    }
    catch(e){
        console.log(e)
    }
})
module.exports = router