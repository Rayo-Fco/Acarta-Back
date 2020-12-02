import {Router} from 'express'
import CtrlItems from '../Controllers/ControllerItems'
import CtrlProduct from '../Controllers/ControllerProduct'
import CtrlCategory from '../Controllers/ControllerCategory'
import CtrlUser from '../Controllers/ControllerUser'
import CtrlStore from '../Controllers/ControllerStore'
const api = Router()


api.get('/items', CtrlItems.getItems)
api.get('/items/Category/:categoria', CtrlItems.getItemsCategory)
api.post('/items/add', CtrlItems.addItems)

api.post('/products/add',CtrlProduct.addProduct)
api.get('/products/category/:categoria', CtrlProduct.getProductsCtg)
api.get('/products/:id', CtrlProduct.getProductsCod)


api.get('/category', CtrlCategory.getCategory)
api.post('/category/add',  CtrlCategory.addCategory)

api.get('/store', CtrlStore.getStore)
api.post('/store', CtrlStore.addStore)

api.post('/register', CtrlUser.RegisterUser)
api.post('/login', CtrlUser.LoginIn)


export default api;
