import mongoose, { ConnectionOptions, Mongoose} from 'mongoose';
import config from './Config';


export class Database {
  constructor() { 
    this.mongodb()
  }

  private mongodb(): void {

    const DB_Options: ConnectionOptions = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      user: config.database.USER,
      pass: config.database.PASSWORD,
      useFindAndModify: false 
    }

    mongoose.connect(config.database.URI, DB_Options)
    console.log('Conectando a Mongodb.....')

    mongoose.connection.once('open', () => {
      console.log('Conexion Exitosa! a Mongoose')
    })
    
    mongoose.connection.on('error', (err) => {
      console.log('Conexion Fracazada!')
      console.log('Mongodb Tiene Error:', err)
      process.exit(-1)
    })
  }

}