const express = require(`express`)
const flash = require(`connect-flash`)
const path = require(`path`)
const exhbs = require(`express-handlebars`)
const homeRoutes = require(`./routes/home`)
const cardRoutes = require(`./routes/card`)
const helmet = require(`helmet`)
const coursesRoutes = require(`./routes/courses`)
const addcourses = require(`./routes/add`)
const ordersRoutes = require(`./routes/orders`)
const authRouter = require(`./routes/auth`)
const profileRouter = require(`./routes/profile`)
const mongoose = require(`mongoose`)
const compression = require(`compression`)
const multer = require(`./midleware/multer`)
const session = require(`express-session`)
const mongostore = require(`connect-mongodb-session`)(session)
const fauth = require(`./midleware/session`)
const middle = require(`./midleware/var`)
const csrf = require('csurf')
const keys = require(`./keys`)
const eror404 = require(`./routes/404`)

const app = express();

const hbs = exhbs.create({
    defaultLayout:`main`,
    extname:`hbs`,
    helpers:require(`./helpers/useRole`)
})

const store = new mongostore({
    collection:`sessions`,
    uri: keys.MONGOURL,
})

const PORT =  process.env.PORT || 5000
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret:keys.MONGO_SECRET,
    resave:false,
    saveUninitialized:false, 
    store
}))

app.use(multer.single(`avatar`))
app.use(csrf())
app.use(flash())
app.use(helmet({
    contentSecurityPolicy: false
}))
app.use(compression())
app.use(middle)
app.use(fauth)

app.engine(`hbs`,hbs.engine)
app.set(`view engine`,`hbs`)
app.set(`views`,`views`)

app.use(homeRoutes)
app.use(ordersRoutes)
app.use(coursesRoutes)
app.use(addcourses)
app.use(authRouter)
app.use(cardRoutes)
app.use(profileRouter)
app.use(express.static(path.join(__dirname,`public`)))
app.use(`/images`,express.static(path.join(__dirname,`images`)))
app.use(eror404)



async function start (){
    try{
        await mongoose.connect(keys.MONGOURL,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})
        app.listen(PORT, () => {
            console.log(`The server is working on port : ${PORT}`)
        })
    }
    catch(e){
        console.log(e)
    }
    
}

start()
