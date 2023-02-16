
import {cpus} from 'os'

const clusterFork = (cluster) => {

    console.log(`Primary PID ${process.pid} is running`)

    const numCPUs = cpus().length
    for(let i=0; i< numCPUs; i++){
        cluster.fork()
    }

    cluster.on('exit', worker => {
        console.log(`worker ${worker.process.pid} died`, new Date().toLocaleString())
        cluster.fork()
    })
}

export default clusterFork
