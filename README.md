# apapacho_backend

## ** Tercera Entrega Proyecto Final 15-02-2023*
Se pone en practica lo aprendido durante los trabajos semanales.
Se ordenan los 4 Routers en la Carpeta Api (Products, Carts, Sessions, Handlebars). Se configura handlebars debido a la comidad y experiencia adquirida durante el curso para enlazar con el proyecto. 

Se continua trabajando Atlas Mongo DB y multer para la subida de archivos al Servidor.

Cada Api-Router tiene como minimo 2 archivos "router" y "controller" añadiendo la ruta y separando el control de cada ruta en el archivo 'controller'.

Para controlar el registro e inicio de sesión se utiliza Passport,passport-local,express-session y session-file-store. Para encriptar las contraseñas de los usuarios registrados de utiliza bcript. 

Se configuran las siguientes páginas y/o funciones con requerimiento de Inicio de Sesión para acceder a ellas: Página de Logout, Página de Historial de Ordenes creadas y/o enviadas, así como para acceder a página de Registro es necesario no estar logueado.

Para la Edicicón, Actualización y Borrado de Productos ademas de ser requerido estar logueado en la aplicación es necesario tener permisos de Administrador. Configuré tu usuario registrado, wifixit.test@gmail.com, como administrador para que pudieras hacer lo que necesites.

Se añaden los paquetes cluster para realizar pruebas y Winston para configurar un Logger siguiendo para reemplazar mensajes en consola, así como también para tener un mejor control de falloo o errores de la aplicación. 

La finalización del pedido se realiza desde la página del carrito, a través de un formulario para usuarios no registrados o botón directo para usuarios registrados. Una vez enviado el carrito se envía correo y mensajes de texto y wsp.

Para lo anterior se configura Nodemailer para envío de correos a través de Google, con opción de O365. Ademas se configura Twilio para el envío de SMS y Mensajes de Whatsapp, versión de prueba por lo que para recibir mensajes es necesario estar registrado en el Sandbox, lo probé y funcionó de maravilla. 

### **1. Información General de Entrega y actualizaciones**
- Se realiza proyecto servidor en node.js utilizando los siguientes modulos
    - express (PORT:8080 para localhost y process.env.PORT para glitch) 
    - multer
    - node-fetch

- Se implementan dos conjuntos de rutas agrupadas en Routers
    - Api Productos: /api/productos
    - Api Carrito: /api/carrito
    
- Se incluyen los archivos 'productos.json' para Productos y carritos.json para Carritos y se utiliza la clase Contenedor para el manejo de estos archivos.

- Las imagenes para los productos se obtienen desde carpeta '/public/assets/img'

- Se crea array 'productos' y 'carritos' con soporte de persistencia en memoria, y las funciones 'loadProductos()' y 'loadCarrito()' para obtener los productos y carritos de los archivos respectivos al inicializar el servidor.

- Se crea variable administrador con valor "true" algunas funcionalidades a implementar a futuro.

### **2. API Router Productos y Carrito**
[Para ver documentación de la API visitar](https://documenter.getpostman.com/view/24153895/2s8YRgqZj1)

Se implementan las funcionalidades GET, POST, PUT y DELETE para cada grupo de Routers, para más información ver documentación de la API.

### **3. Frontend**

Para el framework se utiliza HTML, CSS y JS. Todas las llamadas al backend se realizan utilizando Fetch.

- Navegación Frontend
    - Página Principal, vista de página incluye
        - Slider
        - Productos destacados, con llamada a la api/productos
        - Sección de instagram con llamada a Api de behold.
    - Tienda, visualización de los productos realizando llamada al metodo GET de la 'api/productos'. Cada producto tiene un enlace a la Página de Producto.
    - Añadir Productos, página para añadir productos con llamada al metodo POST de la 'api/productos/form' ya que se utiliza multer para subir las imagenes al servidor.
    - Página de Producto, disponible desde la página de Tienda, utiliza la llamada al metodo GET de 'api/productos/:id' que obtiene el producto con 'id' correspondiente al producto. Dentro de esta página se tiene los botones para los enlaces:
        - Página de Edición de Productos, realiza una llamada para metodo GET de 'api/productos/:id' para obtener la información del productos correspondiente. Para realizar la actualización de los cambios realizados se utiliza el método PUT con llamada a 'api/productos/:id' si no se actualiza imagen o 'api/productos/form/:id' si se actualiza la imagen dentro de la página.
        - Eliminar Producto, botón que realizada una llamada al método DELETE de 'api/productos/:id'
        - Botón 'Agregar', conectado al input:number de cantidad del producto a añadir. 
            - Si es la primera vez que se aprieta el botón, se realiza una llamada al método POST de 'api/carrito/' para crear el carro y se guarda la información de id el Carrito en localStorage. Luego se añade la cantidad añadida, por defecto 1, utilizando el método POST de 'api/carrito/:id/productos/:id_prod' que añade al carrido 'id' el producto con 'id_prod' correspondiente.
    - Carrito, página de visualización de los productos añadidos al carrito. Se utiliza la llamada al metodo GET de 'api/carrito/:id/productos' para obtener los productos del carrito 'id' correspondiente. 
        - Se incluye el botón 'Vaciar Carrito' que elimina el carrito a través del método DELETE de 'api/carrito/:id' 
        - Ademas cada elemento del carrito tiene dos botones para las siguientes funcionalidades:
            - Botón eliminar, elimina el producto en cuestión a través del método DELETE de 'api/carrito/:id/productos/:id_prod'
            - Botón refresh, conectado al input:number que contiene la información del total de productos añadidos al carrito del producto correspondiente. Se realiza utilizando una llamada al método POST de 'api/carrito/:id/productos/:id_prod'.
