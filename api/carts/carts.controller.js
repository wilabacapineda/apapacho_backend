import calculate from "./carts.calculate.js"
import { runLogger, errorLogger } from "../../logger/loggerCart.js"
import { sessionCounter } from "../../controlSession/functions.js"

const controller = {
    findCartID: async (req, res) => { 
      try{ 
        sessionCounter(req)
        runLogger(req) 
        calculate.findCart(req,res) 
      } catch(err) {
        errorLogger(req,'findCartID',err)            
      }
    },
    postCart: async (req,res) => {
      try{
        sessionCounter(req)
        runLogger(req)
        calculate.postCart(req,res)
      } catch(err) {
        errorLogger(req,'postCart',err)            
      }
    },
    postCartProduct: async (req,res) => {    
      try{ 
        sessionCounter(req) 
        runLogger(req)  
        calculate.postCartProduct(req,res)
      } catch(err) {
        errorLogger(req,'postCartProduct',err)            
      }       
    },
    deleteCart: async (req, res) => {
      try{
        sessionCounter(req)
        runLogger(req)
        calculate.deleteCart(req,res)
      } catch(err) {
        errorLogger(req,'deleteCart',err)            
      } 
    },
    deleteCartProduct: async (req, res) => {
      try{
        sessionCounter(req)
        runLogger(req)
        deleteCartProduct(req,res)        
      } catch(err) {
        errorLogger(req,'deleteCartProduct',err)            
      } 
    },
    createOrder: async (req,res) => {
      try{
        sessionCounter(req)
        runLogger(req)
        calculate.createOrder(req,res)
      } catch(err) {
        errorLogger(req,'createOrder',err)            
      }
    },    
    findAllCartsByUserID: async (req,res) => {
      try{ 
        sessionCounter(req)
        runLogger(req)  
        calculate.findAllCartsByUserID(req,res)     
      } catch(err) {
        errorLogger(req,'findAllCartsByUserID',err)            
      }
    }
}

export default controller