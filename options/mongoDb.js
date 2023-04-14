import mongoose from 'mongoose'
import { connectionStringUrl } from './connectionString.js'

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS:5000,
}

mongoose.set('strictQuery', true)
mongoose.connect(connectionStringUrl,connectionParams)
.then(() => {
    console.log('Base de Datos Conectada')
}) .catch((err) => {
    console.warn('Error al conectarse a la BD', err)
})