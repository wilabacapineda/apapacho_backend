const insta_feed = document.getElementById("insta_feed")

fetch('https://feeds.behold.so/26PBgsa3kl4KFdoHcecV')
  .then(data => data.json())
  .then(photos => {
    photos.forEach(({
      id,             // The post ID
      mediaUrl,       // The image source
      permalink,      // URL of the Instagram post
      caption,        // Post caption
      mediaType,      // 'IMAGE', 'VIDEO', or 'CAROUSEL_ALBUM'
      thumbnailUrl,   // Only returned for video posts
      timestamp,      // Post publish date,
      children        // An array of CAROUSEL_ALBUM children. Each with id, mediaUrl, and mediaType
    }) => {
        
        const insta_img = document.createElement("img")
        if(mediaType=="VIDEO"){
            insta_img.src=thumbnailUrl
        } else {
            insta_img.src=mediaUrl
        }

        const insta_a = document.createElement("a")
              insta_a.href=permalink
              insta_a.target="_blank" 
              insta_a.title=caption
              insta_a.append(insta_img)
             
        const insta_div = document.createElement("div")
              insta_div.id=id
              insta_div.className="card instagram_img"
              insta_div.append(insta_a)
        
        insta_feed.append(insta_div)
    });
  });