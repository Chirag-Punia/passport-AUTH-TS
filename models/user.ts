import mongoose from 'mongoose';

 export interface Ischema{
    name : string,
    email : string,
    password : string,
    date? : Date

}
const userSchema = new mongoose.Schema<Ischema>({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now
    }
});

export default userSchema;