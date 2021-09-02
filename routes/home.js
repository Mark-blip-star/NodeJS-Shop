const {Router} = require(`express`),
      router = Router()
      User = require(`../models/user`)

router.get(`/`,async (req,res) => {
    res.render(`index`,{
        title:`Главная страница`,
        isHome:true,

    })
})

module.exports = router