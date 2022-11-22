const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const productsForm = document.getElementById('productsForm')


if(isNaN(params.id) || params.id <= 0){
    window.location.href = "/pages/addProductos.html"
}
if(productsForm){
    fetch(`/api/productos/${params.id}`)
    .then(data => data.json())
    .then(data => {
        if(data.error){
            productsForm.innerHTML="Producto no Existe"
        } else {
            console.log(data)
            document.getElementById("title").value=data.title
            document.getElementById("description").value=data.description
            document.getElementById("price").value=data.price
            document.getElementById("code").value=data.code
            document.getElementById("stock").value=data.stock
            document.getElementById("thumbnail_preview").setAttribute('src',data.thumbnail)
            
            const productoForm = document.getElementById("productoForm")
            if(productoForm) {
                productoForm.addEventListener('submit', (e) => {
                    e.preventDefault()
                })
            }
        }        
    })
}