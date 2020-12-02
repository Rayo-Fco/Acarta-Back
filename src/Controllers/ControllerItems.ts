import { Request, Response } from 'express';
import Items from '../Models/Items';
import Category from '../Models/Category'

export class ItemsController {
    constructor() {}
    
    public async getItems(req:Request, res:Response){
        let items = await Items.find().populate('categoria')
        return res.status(200).send(items)
    }

    public async getItemsCategory(req:Request, res:Response){
            let categoria = req.params.categoria

            let ctg = await Category.findOne({nombre:categoria})
            if (!ctg) return res.status(400).json({ message:"Pagina No Encontrada" })


             let items = await Items.aggregate([
                 {
                   $lookup:
                     {
                       from: "categories",
                       localField: "categoria",
                       foreignField: "_id",
                       as: "categoria"
                     }
                },{
                    $project:
                    {
                        _id:0,
                        categoria:{_id:0, fecha_registro:0}
                    }
                },{
                    $match:
                    {
                         'categoria.nombre': categoria
                    }
                }    
             ]);
           //  if(Items.length == 0) return res.status(400).send({error: 'error'})
    
             return res.status(200).send(items)
         }
    

    public async addItems(req:Request, res:Response){
        if(!req.body.categoria || !req.body.nombre || !req.body.stock || !req.body.precio || !req.body.codigo ) return res.status(400).send({ error:'Faltan campos por completar' })
        let categoria = req.body.categoria
        let Validar_Items = await Items.findOne({ codigo: req.body.codigo})
        if (Validar_Items) return res.status(400).json({ error: `El Items: ${Validar_Items.nombre} ya se encuentra registrado`});

        const objitems = new Items({
            nombre: req.body.nombre,
            categoria: categoria,
            precio: req.body.precio,
            stock: req.body.stock,
            codigo: req.body.codigo
        })
        await objitems.save((error)=>{
            if(error) return res.status(500).send( { error: `Error al crear el Items: ${error}` })

            return res.status(200).send({ mensaje: `El Items: ${objitems.nombre} se ha guardado con exito`})
        })


    }
   

    

    
    
}



export default new ItemsController()







