import cors from "cors"

const corsOptions = {
    origin: 'http://localhost:8080',
    optionSuccessStatus: 200,
    methods: "GET, POST, PUT"
}

const corsUse = cors(corsOptions)

export default corsUse