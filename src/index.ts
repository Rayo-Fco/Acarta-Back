import App from './app'

console.log('Conectando el Servidor.....')

App.listen(App.get('port'), () => 

    console.log('Corriendo la aplicacion en el puerto: ' + App.get('port'))

)