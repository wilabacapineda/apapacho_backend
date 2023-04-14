const userSchema = {    
    email: {type: String, require: true,unique:true},
    name: {type:String, require:true, max: 250},
    lastname: {type: String, max: 250, require:true},
    password: {type: String, require:true},
    type: {type:Number, default: 4},
    address: {type: String, require: false},
    phone: {type: String, require: true},
    avatar: {type:String, require:false},
    age: {type: String, min: 0, max:200, default: 0},
    timestamp:  { type: Date, default: Date.now , require:true },
    is_admin: { type: Boolean, default: false, require:false},
    dateUpdate: { type: Date, default: Date.now , require:true },
}

export default class UsersDtoMongoDb{
    constructor(){
        this.schema = userSchema
    }
}