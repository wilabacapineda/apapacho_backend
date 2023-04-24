import { dbType } from '../../../options/optionsInit.js'
import CartDaoMemory from './CartDaoMemory.js'
import CartDaoMongoDb from './CartDaoMongoDb.js'
import CartDaoFirebase from './CartDaoFirebase.js'
import CartDaoFiles from './CartDaoFiles.js'
import dotenv from 'dotenv'
dotenv.config()

const daoCart = {
    CartDaoMemory: '',
    CartDao: ''
}
let CartDao
let cart

switch(dbType){
    case "mongo":
        daoCart.CartDao = new CartDaoMongoDb
        cart = new CartDaoMemory
        await daoCart.CartDao.getAll().then( d => cart.create(d)) 
        daoCart.CartDaoMemory = cart
        break
    case 'file':        
        cart = new CartDaoMemory
        daoCart.CartDao = new CartDaoFiles(`${process.env.PRODUCTOS_DIR ? process.env.PRODUCTOS_DIR : './archivos'}/${process.env.PRODUCTOS_FS ? process.env.PRODUCTOS_FS : 'cart.json'}`)                
        await daoCart.CartDao.getAll().then( d => { cart.create(d)})      
        daoCart.CartDaoMemory = cart
        break
    case 'firebase':
        daoCart.CartDao = new CartDaoFirebase
        cart = new CartDaoMemory
        await daoCart.CartDao.getAll().then( d => cart.create(d))
        daoCart.CartDaoMemory = cart
        break
    default:
        daoCart.CartDao = new CartDaoMongoDb
        cart = new CartDaoMemory
        await daoCart.CartDao.getAll().then( d => cart.create(d)) 
        daoCart.CartDaoMemory = cart
        break
}

export default daoCart