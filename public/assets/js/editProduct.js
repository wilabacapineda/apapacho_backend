const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const productsForm = document.getElementById('productsForm')
const output = document.querySelector("#enviando");

const errorAdd = () => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ocurrió un error al actualizar producto!',
        showConfirmButton: true
    }).then(res => {
        output.innerHTML = "Error al actualizar el producto"
        output.style.display = "flex"
        output.classList.add("fallo")
    })
}

const successAdd = () => {
    Swal.fire({
        icon: 'success',
        title: 'Producto Actualizado',
        showConfirmButton: true
    }).then(res => {
        output.innerHTML = "Producto actualizado con exito!"
        output.style.display = "flex"
        output.classList.add("exito")
        productsForm.reset()
        setTimeout(() => {
            window.location.href = `/pages/producto/?id=${params.id}`
        },2000)        
    })
}

if(isNaN(params.id) || params.id <= 0){
    window.location.href = "/pages/addProductos.html"
}
if(productsForm){
    fetch(`/api/productos/${params.id}`)
    .then(data => data.json())
    .then(data => {            
        if(data.error){
            productsForm.innerHTML="Producto NO Existe"
        } else {               
            const thumbnailVal = data.thumbnail
            document.getElementById("title").value=data.title
            document.getElementById("description").value=data.description
            document.getElementById("price").value=data.price
            document.getElementById("code").value=data.code
            document.getElementById("stock").value=data.stock
            document.getElementById("thumbnail_preview").setAttribute('src',thumbnailVal)           
            
            productsForm.addEventListener('submit', (e) => {
                e.preventDefault()
                if(document.getElementById("thumbnail").value){
                    const data = new FormData(productsForm)       
                    fetch(`/api/productos/form/${params.id}`, {
                        method: "PUT",
                        body: data
                    }).then( res => {
                        res.status === 200 ? successAdd() : errorAdd()            
                    }).catch((error) => {
                        errorAdd()            
                        console.log('error: ', error)            
                    })        
                } else {
                    const data = { 
                        title: document.getElementById("title").value,
                        description: document.getElementById("description").value,
                        price: document.getElementById("price").value,
                        code: document.getElementById("code").value,
                        stock: document.getElementById("stock").value,
                        thumbnail: thumbnailVal
                    }                     
                    
                    fetch(`/api/productos/${params.id}`, {
                        method: "PUT",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    }).then( res => {
                        res.status === 200 ? successAdd() : errorAdd()            
                    }).catch((error) => {
                        errorAdd()            
                        console.log('error: ', error)            
                    })  
                }
                
            })
            
        }        
    })
}