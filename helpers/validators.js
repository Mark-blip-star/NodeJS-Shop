const {body} = require(`express-validator`)
const User = require(`../models/user`)

exports.regValid = [
    body(`remail`,`Введите коректный email`).isEmail().custom(async(value) => {
        try{
            const candidate = await User.findOne({email: value})
            if(candidate){
                throw new Error(`Пользователь с таки email уже зарегестрирован`)
            }
        }catch(e){
            throw e
        }
    })
    .normalizeEmail(),
    body(`name`,`Имя должно состоять не менее чем из 3 букв`).isLength({min:3,max:20}),

    body(`rpassword`,`Минимальная длинна пароля :6 символов`).isLength({min:6,max:20})
    .trim(),

    body(`repassword`).custom((value,{req}) => {
        if(value !== req.body.rpassword){
            throw new Error(`Пароли не совпадают`)
        }
        return true
    })
    .trim()
]

exports.productValid = [
    body(`title`,`Длинна должна быть не меньше 3-х символов`).isLength({min:3,max:20}),
    body(`price`,`Введите коректною цену`).isNumeric(),
]