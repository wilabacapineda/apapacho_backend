import { dbHost } from '../../../options/optionsInit.js'
import ProductsDaoMemory from './ProductsDaoMemory.js'
import ProductsDaoMongoDb from './ProductsDaoMongoDb.js'
import ProductsDaoFirebase from './ProductsDaoFirebase.js'
import ProductsDaoFiles from './ProductsDaoFiles.js'
import dotenv from 'dotenv'
dotenv.config()

const daoProducts = {
    ProductsDaoMemory: '',
    ProductsDao: ''
}
let productos

switch(dbHost){
    case "mongo":
        daoProducts.ProductsDao = new ProductsDaoMongoDb
        await daoProducts.ProductsDao.loadFirstinsertions()    
        productos = new ProductsDaoMemory
        await daoProducts.ProductsDao.getAll().then( d => productos.create(d)) 
        daoProducts.ProductsDaoMemory = productos
        break
    case 'file':
        daoProducts.ProductsDao = new ProductsDaoFiles(`${process.env.PRODUCTOS_DIR ? process.env.PRODUCTOS_DIR : './archivos'}/${process.env.PRODUCTOS_FS ? process.env.PRODUCTOS_FS : 'products.json'}`)                
        productos = new ProductsDaoMemory
        await daoProducts.ProductsDao.getAll().then( d => { productos.create(d)})      
        daoProducts.ProductsDaoMemory = productos
        break
    case 'firebase':
        daoProducts.ProductsDao = new ProductsDaoFirebase
        await daoProducts.ProductsDao.loadFirstinsertions()  
        productos = new ProductsDaoMemory
        await daoProducts.ProductsDao.getAll().then( d => productos.create(d))
        daoProducts.ProductsDaoMemory = productos
        break
    default:
        daoProducts.ProductsDao = new ProductsDaoMongoDb
        await daoProducts.ProductsDao.loadFirstinsertions()    
        productos = new ProductsDaoMemory
        await daoProducts.ProductsDao.getAll().then( d => productos.create(d)) 
        daoProducts.ProductsDaoMemory = productos
        break
}

export default daoProducts