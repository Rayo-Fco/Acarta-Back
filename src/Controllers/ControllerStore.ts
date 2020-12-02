import { Request, Response } from 'express';
import Store from '../Models/Store';

export class StoreController {
    constructor() {}
    
    public async getStore(req:Request, res:Response){
        let store = await Store.findOne({},{admin:0})
        return res.status(200).send(store)
    }
    

    public async addStore(req:Request, res:Response){
        const store = new Store({
            name:req.body.name,
            logo: req.body.logo,
            phone: req.body.phone,
            address: req.body.address,
            'style.header': req.body.header,
            'style.body': req.body.body,

        }) 
        await store.save((error)=>{
            if(error) return res.status(500).send( { error: `Error al crear la tienda: ${error}` })

            return res.status(200).send({ mensaje: `La tienda: ${store.name} se ha guardado con exito`})
        })
    }
}

export default new StoreController()







