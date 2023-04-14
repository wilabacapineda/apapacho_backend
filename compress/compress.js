import compression from "compression"
import shouldCompress from "./compress.functions.js"

const compress = compression({
    filter: shouldCompress,
    level: 7,
})

export default compress