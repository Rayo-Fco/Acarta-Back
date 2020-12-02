import { model, Schema, Document } from "mongoose";

export interface IStore extends Document {
    name: string;
    logo: number;
    phone: number;
    address:number;
    admin: [];
    style:{}
  };

const StoreSchema = new Schema({
    name:{
        type:String,
        required: true,
        lowercase:true,
        minlength: 4,
        maxlength: 40
    },
    logo:{
        type:String,
        required: true,
        lowercase:true,
    },
    phone:{
        type:Number,
        required: true,
    },
    address:{
        type:String,
        required: true,
    },
    style_header:{
        type:String
    }, 
    style_body: { 
        type:String
    },
    admin:[{ 
        user:{
            type:String
        }, 
        password: { 
            type:String
        } 
    }],
    date_update:{
        type:Date,
        default:Date.now
    },
    date_register:{
        type:Date,
        default:Date.now
    }


})

export default model<IStore>("Store", StoreSchema);