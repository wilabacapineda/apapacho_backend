import { runLogger, errorLogger } from "../../logger/loggerProducts.js"
import { sessionCounter } from "../../controlSession/functions.js"
import calculate from './products.calculate.js'

const controller = {
    getProducts: async (req,res) => {
        try{
            sessionCounter(req)
            runLogger(req)
            calculate.getProducts(req,res)
        } catch(err) {
            errorLogger(req,'getProducts',err)            
        }        
    },
    getProductsID: async (req,res) => {
        try {
            sessionCounter(req)
            runLogger(req)
            calculate.getProductsID(req,res)
        } catch(err) {
            errorLogger(req,'getProductsByID',err)
        } 
    },
    postProducts: async (req, res) => {
        try{
            sessionCounter(req)
            runLogger(req)
            calculate.postProducts(req,res)
        } catch(err) {
            errorLogger(req,'postProducts',err)
        }             
    },
    postProductsForm: async (req, res) => {   
        try{
            sessionCounter(req)
            runLogger(req)     
            calculate.postProductsForm(req,res)             
        } catch(err) {
            errorLogger(req,'postProductsByForm',err)
        }
    },
    putProducts: async (req, res) => {
        try{
            sessionCounter(req)
            runLogger(req)
            calculate.putProducts(req,res)
        } catch(err) {
            errorLogger(req,'putProducts',err)
        }    
    },
    putProductsForm: async (req, res) => {
        try {
            sessionCounter(req)
            runLogger(req)
            calculate.putProductsForm(req,res)
        } catch(err) {
            errorLogger(req,'putProductsByForm',err)
        }
    },
    deleteProducts: async (req, res) => {
        try{
            sessionCounter(req)
            runLogger(req)
            calculate.deleteProducts(req,res)  
        } catch(err) {
            errorLogger(req,'deleteProducts',err)
        } 
    },
}

export default controller