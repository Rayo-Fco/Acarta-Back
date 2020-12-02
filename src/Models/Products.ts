import { model, Schema, Document } from "mongoose";

export interface IProduct extends Document {
    nombre: string;
    codigo: number;
    stock: number;
    precio:number;
    foto: string;
  };

const ProductSchema = new Schema({
    nombre:{
        type:String,
        required: true,
        lowercase:true,
        minlength: 4,
        maxlength: 40
    },
    codigo:{
        type:Number,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 40
    },
    stock:{
        type:Number,
        required: true,
    },
    precio:{
        type:Number,
        required: true,
    },
    categoria:{
         type: Schema.Types.ObjectId,
          ref: 'Category'
    },
    foto:{
        type:String
    },
    fecha_actualizacion:{
        type:Date,
        default:Date.now
    },
    fecha_registro:{
        type:Date,
        default:Date.now
    }


})

export default model<IProduct>("Product", ProductSchema);