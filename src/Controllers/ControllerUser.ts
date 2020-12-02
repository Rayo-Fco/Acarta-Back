import { Request, Response } from 'express';
import User, { IUser }from '../Models/User';
import Cart, { ICart }from '../Models/Cart';
import jwt from 'jsonwebtoken';
import config from '../Config'
import Bcrypt from 'bcrypt'
import Validar from '../Middlewares/joi'

export class UserController {
    constructor(){}

    public async LoginIn(req:Request, res:Response){
        const {error} = Validar.Login(req.body) 
        if(error) return res.status(400).send({error:[{ message: 'Email y/o Password son invalidos'}]})
        
        let Usuario = await User.findOne({ email: req.body.email})
        if (!Usuario) return res.status(400).send({error:[{ message: 'Email y/o Password incorrecto'}]});
        
        let ValidarPass = await Bcrypt.compare(req.body.password, Usuario.password)
        if (!ValidarPass) return res.status(400).send({error:[{ message: 'Email y/o Password incorrecto'}]});
        
        return res.status(200).send({ token: CreateToken(Usuario) })
    }

    public async RegisterUser(req:Request, res:Response){
        const {error} = Validar.Register(req.body)
        if(error) return res.status(400).send({error : error.details});

        let PreexitenciaEmail = await User.findOne({ email: req.body.email})
        if(PreexitenciaEmail) return res.status(400).send({error:[{ message: 'Email ya esta registrado'}]})
        
        let PreexitenciaRut = await User.findOne({ rut: req.body.rut})
        if(PreexitenciaRut) return res.status(400).send({error:[{ message:'Rut ya esta registrado'}]})

        const ClaveEncriptada = await EncryptKey(req.body.password)

        const user = new User({
            rut: req.body.rut,
            email: req.body.email,
            nombre: req.body.name,
            apellido: req.body.lastname,
            telefono: req.body.phone,
            password: ClaveEncriptada,
        })

        await user.save(async (error,data)=>{
            if (error){
                return res.status(500).send({error:[{ message: `Error al crear el usuario: ${error}` }]})
            }
                const cart = new Cart({
                    usuario: data._id
                })
                await cart.save()
                return res.status(200).send({ token: CreateToken(user) })

        })
    }

}

function CreateToken(user:IUser){
    const token = jwt.sign({ 
        id: user.id, 
        email: user.email 
    }, 
    config.SECRET_TOKEN, 
    {
        algorithm: 'HS256', // Base de Codificacion
        expiresIn: '2 days', // Tiempo de Duracion
      });
    return token
}



async function  EncryptKey(password:String){
    const salt = await Bcrypt.genSalt(config.Password_Salt)
    const EncryptedKey = await Bcrypt.hash(password, salt)
    return EncryptedKey
}

export default new UserController()