const {Schema,model} = require(`mongoose`)

const User = new Schema({
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    avatarUrl:{type:String},
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        default:`user`
    },
    token:{type:String},
    card:{
        item:[{
            count:{
                type:Number,
                required:true,
                default:1
            },
            courseId:{
                type:Schema.Types.ObjectId,
                ref:`Courses`,
                required:true
            }
        }]
    }
})

    User.methods.addToCart = function(course){
        const item = [...this.card.item],
        idx = item.findIndex(c => {
            return c.courseId.toString() === course._id.toString()
        })
        if(idx >= 0){
            item[idx].count += 1
            item.courseId = item.courseId + course._id
        }else{
           item.push({
                count:1,
                courseId:course._id
           })
        }

        const NewCard = {item}
        this.card = NewCard
        return this.save()
    }

    User.methods.upDate = function(course){
        let item = [...this.card.item]
        idx = item.findIndex(c => c.courseId.toString() === course.toString())

        if(item[idx].count === 1){
            item = item.filter(c => c.courseId.toString() !== course.toString())
        }else{
            item[idx].count--
        }

        this.card = {item}

        this.save()
    }

    User.methods.counter = function(course){
        item = [...this.card.item]
        idx = item.findIndex(c => c.courseId.toString() === course.toString())

        if(item[idx]){
            item[idx].count++
        }
        this.card = {item}
        this.save()
    }

    User.methods.clear = function(){
        this.card = {items : []}
        return this.save()
    }
module.exports = model(`User`,User)