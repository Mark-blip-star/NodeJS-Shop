const keys = require(`../keys`)
module.exports = function(email,token){
    
    return {
        to:email,
        from:keys.SENDGRID_MAIL,
        subject:`Восстановление пароля`,
        html:`Для восстановлния пароля перейдите по ссылку :<a href= "http://localhost:5000/auth/password/${token}">тык</a>`
    }
}