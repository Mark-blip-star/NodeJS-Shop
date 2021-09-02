const {Router} = require(`express`)
const User = require(`../models/user`)
const bcrype = require(`bcryptjs`)
const router = Router()
const keys = require(`../keys`)
const nodemailer = require(`nodemailer`)
const sendgrid = require(`nodemailer-sendgrid-transport`)
const regMail = require(`../email/register`)
const resMail = require(`../email/reset`)
const crypto = require(`crypto`)
const {validationResult} = require(`express-validator`)
const {regValid} = require(`../helpers/validators`)

const transfer = nodemailer.createTransport(sendgrid({
    auth:{api_key: keys.SEND_GRID_API}
}))

router.get(`/auth/login`,async(req,res) => {
    res.render(`auth/log` ,{
        title:`Авторизация`,
        isLog : true,
        logError: req.flash(`logError`),
        no_user:req.flash(`no_user`),
        myError:req.flash(`myError`)
    })
})

router.get(`/auth/password/:token` , async(req,res) => {
    try{
        const candidate = await User.findOne({
            token:req.params.token
        })
        if(!req.params.token || !candidate){
            return res.redirect(`/`)
        }else{
            res.render(`./auth/password`,{
                title:`Новый пароль`,
                token:req.params.token,
                email:candidate.email
            })
        }
    }catch(e){
        throw e
    }
})

router.get(`/auth/logout`,async(req,res) => {
    req.session.destroy(() => {
        res.redirect(`/`)
    })
})

router.get(`/auth/reset` , (req,res) => {
    res.render(`./auth/reset`,{
        title:`Сброс пароля`,
    })
})

router.post(`/auth/login`,async (req,res) => {
    try{
        const {email,password} = req.body
        const candidate = await User.findOne({email})
        
        if(candidate){

            const areSame = await bcrype.compare(password,candidate.password)

            if(areSame){
                req.session.isAuth = true
                req.session.user = candidate
                req.session.save(err => {
                    if(err){
                        throw err
                    }else{
                        res.redirect(`/`)
                    }
                })
            }else{
                req.flash(`logError`,`Неверный пароль`)
                res.redirect(`/auth/login`)
            }
        }else{
            req.flash(`no_user`,`Пользователь не найден`)
            res.redirect(`/auth/login`)
        }
    }catch(err){
        throw err
    }
    
})

router.post(`/auth/login/register`,regValid, async(req,res) => {
    try{
    const {remail,name,rpassword} = req.body
    const error = validationResult(req)

    if(!error.isEmpty()){
        req.flash(`myError`,error.array()[0].msg)
        return res.status(422).redirect(`/auth/login#register`) 
    }
        const hashpass = await bcrype.hash(rpassword,10)
        const user = await new User({
            email:remail,
            name,
            password:hashpass,
            card:{items:[]}
        })
        await user.save()
        transfer.sendMail(regMail(remail))
        res.redirect(`/auth/login`)
    }catch(err){
        throw err
    }
})

router.post(`/auth/password`,async(req,res) => {
    try{
        const candidate = await User.findOne({email:req.body.email,token:req.body.token})
        
        if(!candidate){
            await req.flash(`error`,`Пользователь не найден`)
            res.redirect(`/`)
        }
        const newPassword = await bcrype.hash(req.body.password,10)

        candidate.password = newPassword
        candidate.token = undefined
        await candidate.save()
        await req.flash(`error`,`Пароль успешно изменен`)
        res.redirect(`/auth/login`)
        
    }catch(e){
        throw e
    }

})

router.post(`/auth/reset`,(req,res) => {
    try{
        crypto.randomBytes(32,async (err,buffer) => {
            if(err){
                await req.flash(`error`,`Что - то пошло не так`)
                res.redirect(`/auth/reset`)
            }

            const token = buffer.toString(`hex`)
            const email = req.body.email
            const candidate = await User.findOne({email})
            if(candidate){
                candidate.token = token
                await candidate.save()
                await transfer.sendMail(resMail(email,token))
                res.redirect(`/auth/login`)
            }else{
                await req.flash(`error`,`Пользовтель с таким email не найден`)
                res.redirect(`/auth/login`)
            }
        })
       
    }catch(e){
        throw e
    }
})
module.exports = router