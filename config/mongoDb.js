import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS:5000,
}

//ATLAS
const connectionStringUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/ecommerce?retryWrites=true&w=majority`
mongoose.connect(connectionStringUrl,connectionParams)
.then(() => {
    console.log('Base de Datos Conectada')
}) .catch((err) => {
    console.warn('Error al conectarse a la BD', err)
})

/*
//LOCAL
const connectionStringUrl = `mongodb://localhost:27017/ecommerce`
mongoose.connect(connectionStringUrl,connectionParams)
.then(() => {
    console.log('Base de Datos Conectada')
}) .catch((err) => {
    console.warn('Error al conectarse a la BD', err)
})
*/