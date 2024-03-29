import context from "./context.js"

const hbsCreate = {
    partialsDir: "views/partials/",    
    defaultLayout: 'main',
    helpers: {
      active(url,path){ 
        return path === url ? "active" : "" 
      },
      loadPage(v1,v2,opts){      
        return v1==v2 ? opts.fn(this) : opts.inverse(this) 
      },
      isMediaTypeVideoInsta(mediaType){
        return mediaType.toLowerCase()=="video" ? true : false 
      },
      multiplicar(price,cartCount){
        return (price*cartCount).toLocaleString()
      },
      getLoginIcon(url){
       return url.toLowerCase().indexOf('login') > -1 ? context.loginURL.iconLogin : context.loginURL.iconLogout 
      },
      versionCart(path){
        return path.toLowerCase().indexOf('/carrito') > -1 ? false : true
      },
      getUserImg(avatar){
        console.log(avatar)
        return avatar !=='' ? true : false
      },
      verifyFullname(name, lastname){
        return ((name && lastname) ? true : false)
      }
    }  
}

export default hbsCreate