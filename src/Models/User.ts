import { model, Schema, Document } from "mongoose";

export interface IUser extends Document {
    nombre: string
    apellido: string
    rut:string
    telefono: number
    email: string
    password: string
    cart: Schema.Types.ObjectId
    fecha_registro: Date
    fecha_resetpassword: Date
    fecha_actualizacion: Date
  };

const UserSchema = new Schema({
    nombre:{
        type:String,
        required: true,
        lowercase:true,
        minlength: 4,
        maxlength: 40
    },
    apellido:{
        type:String,
        required: true,
        lowercase:true,
        minlength: 4,
        maxlength: 40
    },
    rut:{
        type:String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 30
    },
    telefono:{
        type:Number,
        required: true,
        trim: true,
        maxlength: 30
    },
    email:{
        type:String,
        required:true,
        unique: true,
        lowercase:true,
        minlength:6,
        maxlength:120
    },
    carro:{
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    },
    password:{
        type:String,
        required:true,
        trim: true,
        minlength:6,
        maxlength:255
    },
    fecha_actualizacion:{
        type:Date,
        default:Date.now
    },
    fecha_resetpassword:{
        type:Date
    },
    fecha_registro:{
        type:Date,
        default:Date.now,
    }

})

export default model<IUser>("User", UserSchema);