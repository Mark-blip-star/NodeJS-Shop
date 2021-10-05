const keys = require(`../keys`)
module.exports = function(email){
    
    return {
        to:email,
        from:keys.SENDGRID_MAIL,
        subject:`Создание акаунта`,
        html:`<h1>Здравствуйте,вы успешно прошли регистрацию на нашем сайте(VIA)</h1>
        Ваш email: ${email}.

        Ссылка для перехода в магазин - <a href = "/localhost:">тык</a>
        `
    }
}