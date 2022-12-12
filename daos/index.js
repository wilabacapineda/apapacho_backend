import ProductsDaoMemory from './products/ProductsDaoMemory.js'
import CartDaoMemory from './carts/CartDaoMemory.js'
import ProductsDaoFiles from './products/ProductsDaoFiles.js'
import CartDaoFiles from './carts/CartDaoFiles.js'
import ProductsDaoMongoDb from './products/ProductDaoMongoDb.js'
import CartDaoMongoBD from './carts/CartDaoMongoDb.js'
import ProductDaoFirebase from './products/ProductDaoFirebase.js'
import CartDaoFirebase from './carts/CartDaoFirebase.js' 

export const daoFiles = () => {
    const productsDao = new ProductsDaoFiles
    const cartDao = new CartDaoFiles
    const data = productsDao.getAll()     
          data.then( d => ProductsDaoMemory.create(d))
    const data2 = cartDao.getAll()
          data2.then( d =>  CartDaoMemory.create(d))  
    return {ProductsDaoMemory, CartDaoMemory,productsDao, cartDao}    
}

export const daoMongoDb = () => {
    const productsDao = new ProductsDaoMongoDb
          productsDao.loadFirstinsertions()    
    const cartDao = new CartDaoMongoBD
    const data = productsDao.getAll()
          data.then( d => ProductsDaoMemory.create(d))
    const data2 = cartDao.getAll()
          data2.then( d =>  CartDaoMemory.create(d))   
    
    return {ProductsDaoMemory, CartDaoMemory, productsDao, cartDao}
}

export const daoFirebase = () => {
      const productsDao = new ProductDaoFirebase
            productsDao.loadFirstinsertions()    
      const cartDao = new CartDaoFirebase
      
      const data = productsDao.getAll()
            data.then( d => ProductsDaoMemory.create(d))
      const data2 = cartDao.getAll()
            data2.then( d =>  CartDaoMemory.create(d))   
      
      return {ProductsDaoMemory, CartDaoMemory, productsDao, cartDao}

}