
import express from 'express'
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc"

const options = {
    definition:{
        openapi: "3.0.0",
        info: {
            title: "Apapacho Store Api 1.0",
            description:"Documentación de la Api de Apapacho Store - SoyUnRemix 2023"
        }
    },
    apis:['./swagger/docs/**/*.yaml']
}

const swaggerSpecs = swaggerJSDoc(options)

const { Router } = express
const routerApiDocs = new Router()
      routerApiDocs.use("/",swaggerUi.serve,swaggerUi.setup(swaggerSpecs))

export default routerApiDocs

