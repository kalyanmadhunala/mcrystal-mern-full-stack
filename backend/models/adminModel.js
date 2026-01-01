import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
    name:{type: String, required:true},
    email: {type: String, required:true, unique:true},
    password: {type:String, required:true},
})

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema)

export default adminModel;