export default 
{
    port: process.env.PORT || 3001,
    database: {
        URI: process.env.MONGODB_URI || 'mongodb://localhost/ecarta',
        USER: process.env.MONGODB_USER,
        PASSWORD: process.env.MONGODB_PASSWORD
      },
    SECRET_TOKEN: "EcArTa526",
    Password_Salt: 10,

 }
