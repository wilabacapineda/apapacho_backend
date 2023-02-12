import din from "../../daos/index.js"
import context from '../../utils/context.js'

const controller = {
    findCartID: async (req, res) => {    
        const id = parseInt(req.params.id)    
        if(isNaN(id) || id <= 0){
          return res.send({error: 'carrito no encontrado'})
        } 
        const result = din.CartDaoMemory.getById(id)
              result.then( r => {
                res.send(r.products)  
              }).catch( (r) => {
                res.send({error: 'carrito no encontrado'})
              })   
    },
    postCart: async (req,res) => {
        const newCart = din.cartDao.save({products:[]})
              newCart.then( nc => {
                din.CartDaoMemory.save(nc)
                return res.send({id: nc.id})
              })   
    },
    postCartProduct: async (req,res) => {        
        const id = parseInt(req.params.id)
        const id_prod = parseInt(req.params.id_prod)
        const cartCount = req.body.cartCount ? parseInt(req.body.cartCount) : 1
    
        if(isNaN(id) || id <= 0){
          return res.send({error: 'carrito no encontrado'})
        } 
        if(isNaN(id_prod) || id_prod <= 0){
          return res.send({error: 'producto para agregar al carrito no encontrado'})
        } 
        const result = din.ProductsDaoMemory.getById(id_prod)  
              result.then( r => {
                if(r===null) {
                  return res.send({error: 'producto para agregar al carrito no encontrado'})
                }
                const newCart = din.cartDao.updateProducts(id, id_prod, r, cartCount)                
                      newCart.then( (c) => {  
                        din.CartDaoMemory.update(id,c)
                        res.send(c)
                      }) 
              }).catch(r => {
                return res.send({error: 'producto para agregar al carrito no encontrado'})
              })            
    },
    deleteCart: async (req, res) => {
        const id = parseInt(req.params.id)    
        if(isNaN(id) || id <= 0){
          return res.send({error: 'carrito no encontrado'})
        } 
        const newCart = din.cartDao.getById(id)
              newCart.then( nc => {
                if(nc===null) {
                  return res.send({error: 'carrito no encontrado'})
                }
                const deleteID = din.cartDao.deleteById(id)
                      deleteID.then( () => {
                        din.CartDaoMemory.deleteById(id)
                        return res.send({mensaje:`Carrito ${id} eliminado`})
                      })
              }) 
    },
    deleteCartProduct: async  (req, res) => {
        const id = parseInt(req.params.id)
        const id_prod = parseInt(req.params.id_prod)
        
        if(isNaN(id) || id <= 0){
          return res.send({error: 'carrito no encontrado'})
        } 
        if(isNaN(id_prod) || id_prod <= 0){
          return res.send({error: 'producto para agregar al carrito no encontrado'})
        }      
    
        const Cart = din.cartDao.getById(id)
              Cart.then(cart => {
                if(cart===null) {
                  return res.send({error: 'carrito no encontrado'})
                }
                const newCart = din.cartDao.deleteProducts(id, id_prod)
                      newCart.then( (c) => {  
                        din.CartDaoMemory.update(id,c)
                        res.send(c)
                      })                                
              }).catch(r => {
                return res.send({error: 'carrito no encontrado'})
              }) 
    }
}

export default controller