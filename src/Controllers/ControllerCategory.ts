import { Request, Response } from 'express';
import Category from '../Models/Category';

export class CategoryController {
    constructor() {}
    
    public async getCategory(req:Request, res:Response){
        let categoria = await Category.find()
        return res.status(200).send(categoria)
    }

    public async addCategory(req:Request, res:Response){

        let categoria = req.body.categoria
        let Validar_Categoria = await Category.findOne({ nombre: categoria})
        if (Validar_Categoria) return res.status(400).json({ error: `La Categoria: ${Validar_Categoria.nombre} ya se encuentra registrada`});

        const objcategoria = new Category({
            nombre: categoria,
        })
        await objcategoria.save((error)=>{
            if(error) return res.status(500).send( { error: `Error al crear la categoria: ${error}` })

            return res.status(200).send({ mensaje: `La categoria: ${objcategoria.nombre} se ha guardado con exito`})
        })


    }
   

    

    
    
}



export default new CategoryController()







