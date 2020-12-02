import { model, Schema, Document } from "mongoose";

export interface ICart extends Document {

    usuario: Schema.Types.ObjectId;

    items:[{ 
        producto:Schema.Types.ObjectId,
        cantidad: number,
        precio: number
    }]

    total: number

    fecha_actualizacion: Date

  };

const CartSchema = new Schema({
    usuario:{ 
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
	items:[{
		producto: { 
            type: Schema.Types.ObjectId, 
            ref: 'Product',
        },
		cantidad: { 
            type: Number, 
            default: 1
        },
        precio:{
            type: Number,
            default: 1
        }
    }],
    total:{
        type: Number,
        default: 0
    },
    fecha_actualizacion:{
        type:Date,
        default:null
    }

})

export default model<ICart>("Cart", CartSchema);