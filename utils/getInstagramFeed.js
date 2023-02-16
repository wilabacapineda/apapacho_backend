import fetch from "node-fetch"

const instagramFeed = []

fetch('https://feeds.behold.so/26PBgsa3kl4KFdoHcecV')
.then(data => data.json())
.then(photos => photos.forEach( i => instagramFeed.push(i)))

export default instagramFeed