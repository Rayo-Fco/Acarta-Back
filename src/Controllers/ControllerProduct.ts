import { Request, Response } from 'express';
import Product from '../Models/Products';
import Category from '../Models/Category'
import Validar from '../Middlewares/joi'
import upload from '../Middlewares/multer'
import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'

export class ProductController {
    constructor() {}
    
    public async getProductsCtg(req:Request, res:Response){
        let categoria = req.params.categoria
        let ctg = await Category.findOne({nombre:categoria})
        if (!ctg) return res.status(400).json({ message:"Pagina No Encontrada" })
        console.log(categoria);
        let sort = req.query.sort
        let orden = {}
        switch (sort) {
            case 'nombre_asc':
                orden = { 'nombre': 1 }
            break;
            case 'nombre_dec':
                orden = { 'nombre': -1 }
            break;
            case 'new':
                orden = { 'fecha_registro': 1}
            break;
            case 'old':
                orden = { 'fecha_registro': -1 }
            break;
            default:
                orden = { 'fecha_registro': -1 }
            break;
        }

         let products = await Product.aggregate([
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
            },
            {
                $sort:orden
                
            }    
         ]);
        

         return res.status(200).send(products)
 
 
 
     }
     public async getProductsName(req:Request, res:Response){

        
        let nombre = req.params.nombre
        
         let products = await Product.aggregate([
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
                     'nombre': nombre
                }
            } 
         ]);
         if(products.length == 0) return res.status(200).send({mensaje: 'Producto no se encuentra'})

         return res.status(200).send(products)
 
 
 
     }
    public async getProductsAll(req:Request, res:Response){
       // let products = await Product.find()
       let category = req.query.category

       ///await Product.find({},{_id:0}).populate({ path: 'categoria', match: { nombre: 'Prueba'}}).exec()
        let products = await Product.aggregate([
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
           }    
        ]);
        return res.status(200).send(products)



    }

    public async getProductsCod(req:Request, res:Response){
        let validar_numero = req.params.id.match(/^[0-9]+$/)
        if(!validar_numero) return res.status(400).send({error: `El Producto:${req.params.id} es invalido`})

        let cod = parseInt(req.params.id)
        let products = await Product.findOne({codigo:cod},{_id:0}).populate('categoria',{_id:0, fecha_registro:0})
        if(!products) return res.status(400).send({ error: 'Producto invalido'})
        return res.status(200).send(products)
    }

    public async addProduct(req:Request, res:Response,){
        let CargaFotoProducto = upload.single('foto');
        CargaFotoProducto(req, res, async function (err:any)
        {
                // Validar Parametros //  
                if(err != undefined && err.message == 'formato') return res.status(400).send({ error: `Solo se pueden subir Fotos con formato JPG, PNG y JPEG` })

                if(err != undefined && err.code == 'LIMIT_UNEXPECTED_FILE') return res.status(400).send({ error: `Solo se pueden subir una Fotos` })
                
                if(!req.file) return res.status(400).send({error: 'Tiene que subir una foto del producto'})

                const {error} = Validar.Add_Product(req.body)
                if(error)
                {
                    if(!err) LimpiarTmp(req.file)
                    return res.status(400).send({error: error.details})
                }
                if(!mongoose.Types.ObjectId.isValid(req.body.categoria)) {
                    LimpiarTmp(req.file)
                    return res.status(400).json({ error: `La categoria no existe en el sistema o tiene que crearla`});  
                  }

                let Validar_Categoria = await Category.findById(req.body.categoria)
                if(!Validar_Categoria){
                    LimpiarTmp(req.file)
                    return res.status(400).json({ error: `La categoria no existe en el sistema o tiene que crearla`});  
                } 

                let Validar_Productos = await Product.findOne({ codigo: req.body.codigo})
                if (Validar_Productos)
                {
                    if(!err) LimpiarTmp(req.file)
                    return res.status(400).json({ error: `El Producto: ${req.body.nombre} Codigo: ${req.body.codigo} ya se encuentra registrado`});  
                }
                // Error de las Fotos //
                if (err != undefined && err.code == 'LIMIT_FILE_SIZE') return res.status(400).send({ error: 'El Archivo no puede superar los 5 MB'})
                fs.promises.mkdir(path.join(__dirname,'../Public/Products/')+req.body.codigo, { recursive: true })

                let foto:string = "";
                fs.createReadStream(path.join(__dirname,'../tmp/')+req.file.filename)
                .pipe(fs.createWriteStream(path.join(__dirname,'../Public/Products/')+req.body.codigo+'/'+req.file.filename)) 
                fs.unlink(path.join(__dirname,'../tmp/')+req.file.filename, function (err) {}); 
                foto = path.join(__dirname,'../Public/Products/'+req.body.codigo+'/')+req.file.filename

                //Guardar el Producto//
                const producto = new Product({
                    nombre: req.body.nombre,
                    stock: req.body.stock,
                    codigo: req.body.codigo,
                    categoria: req.body.categoria,
                    precio: req.body.precio,
                    foto:foto
                })
                console.log("3");
                await producto.save((error:any)=>{
                    if(error) return res.status(500).send( { error: `Error al crear el Producto: ${error}` })

                    return res.status(200).send({ mensaje: `El Producto: ${producto.nombre} se ha guardado con exito`})
                })

        })
    }

    public async updateStock(req:Request, res:Response){

        let validar_numero = req.params.id.match(/^[0-9]+$/)
        if(!validar_numero) return res.status(400).send({error: `El Producto:${req.params.id} es invalido`})

        const {error} = Validar.Stock_Product(req.body)
        if (error) return res.status(400).send({error: error.details})
        
        let cod_producto = parseInt(req.params.id)
        let Validar_Codigo = await Product.findOne({ codigo: cod_producto})
        if (!Validar_Codigo) return res.status(400).json({ error: `El Codigo: ${cod_producto} no se encuentra registrado`});
         
        await Product.findOneAndUpdate({codigo:cod_producto}, {
              stock: req.body.stock,
              fecha_actualizacion: Date.now()
          },(error)=>{
            if(error) return res.status(500).send( { error: `Error al actualizar el stock: ${error}` })
            return res.status(200).send({ mensaje: "Se a actualizado el stock"})
        
         }) 
    }

    public async deleteProduct(req:Request, res:Response){
        let validar_numero = req.params.id.match(/^[0-9]+$/)
        if(!validar_numero) return res.status(400).send({error: `El Producto:${req.params.id} es invalido`})

        let cod_producto = parseInt(req.params.id)
        let Validar_Codigo = await Product.findOne({ codigo: cod_producto})
        if (!Validar_Codigo) return res.status(400).json({ error: `El Codigo: ${cod_producto} no se encuentra registrado`});
        
        await Product.findByIdAndRemove(Validar_Codigo._id,(error)=>{
          if(error) return res.status(500).send( { error: `Error al eliminar el Producto: ${error}` })
          fs.promises.rmdir(path.join(__dirname,'../Public/Products/')+cod_producto, { recursive: true }); 
          return res.status(200).send({ mensaje: "Se a eliminado el Producto"})
      
       }) 
    }
    
}

async function  LimpiarTmp(nombrearchivo:any) 
{
    let bo:boolean = false
    if(nombrearchivo){
            await fs.unlink(path.join(__dirname,'../tmp/')+nombrearchivo.filename, function (err) {
                if (err) console.log('Error LimpiarTMP: '+err)
            }); 
            bo = true;
        }
        if(bo)console.log('Se ha limpiado los TMP!');
    
}

export default new ProductController()







