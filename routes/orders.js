const {Router} = require(`express`);
const { model } = require("mongoose");
const Orders = require("../models/orders");
const router = Router(),
auth = require(`../midleware/auth`)


router.get(`/orders` ,auth,async (req,res) => {
    try{
        const orders = await Orders.find({
            'user.userId':req.user._id
        })
        .populate(`user.userId`)

        res.render(`orders`, {
            title: `Заказы`,
            order : orders
        })
    }catch(e){
        console.log(e)
    }
})

router.post(`/orders` ,auth,async(req,res) => {
    try{
        const user = await req.user
        .populate(`card.item.courseId`)
        .execPopulate()
        const courses = user.card.item.map(i => ({count:i.count, course: {...i.courseId._doc} }))
        
        const order = new Orders({
            courses:courses,
            user:{
                name:req.user.name,
                userId:req.user
            }
        })
        
        res.redirect(`/`)
        await order.save()
        await req.user.clear()
    }catch(e){
        console.log(e)
    }
})

module.exports = router