import mongoose from   "mongoose"; 
import {model,Schema} from 'mongoose' 

mongoose.connect("")  
const userSchema = new Schema({
    username: {type:String ,unique:true} ,
    password:String  ,
    email:String
}) 
export const Usermodel =  model("userSchema",userSchema) ;  
const content = new Schema({
    title: String,                          // Title of the content
    Link: String,  
    type:String ,                          // URL or link to the content
    tags: [{ type: mongoose.Types.ObjectId, ref: "tag" }], // Array of tag IDs, referencing the 'tag' collection
    userId: { 
        type: mongoose.Types.ObjectId, 
        ref: "userSchema", 
        required: true                       // The 'userId' field is mandatory to link content to a user
    },
});

const link = new Schema({
    hash : String , 
   userId: { type: mongoose.Types.ObjectId, ref: 'userSchema', required: true, unique: true },
})
export const linkModel = model("links",link)
export const contentModel =  model("ContentSchema",content) ; 