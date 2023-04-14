const fullhostname = (req) => {
    return req.protocol + '://' + req.get('host')
}

export default fullhostname