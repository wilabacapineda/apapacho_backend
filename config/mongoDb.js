import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS:5000,
}

//ATLAS
const mongoAtlas= `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`
const mongoLocal= `mongodb://localhost:27017/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`
const connectionStringUrl = process.env.MONGOENV=='atlas' ? mongoAtlas : process.env.MONGOENV=='local' ? mongoLocal : mongoAtlas


mongoose.connect(connectionStringUrl,connectionParams)
.then(() => {
    console.log('Base de Datos Conectada')
}) .catch((err) => {
    console.warn('Error al conectarse a la BD', err)
})