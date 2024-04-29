import mongoose from "mongoose";

(async ()=>{
try {
    await mongoose.connect(`mongodb+srv://Riddle:9118380538@cluster0.qr5vrpz.mongodb.net/userInfo`)
    console.log(`MongoDB has been successfully connected to the database....`) 
} catch (error) {
    console.log(error)
    throw error
}
})()

const userSchema=mongoose.Schema({
    name:String,
    email:String,
    imageurl:String
})

export default mongoose.model('user',userSchema);
