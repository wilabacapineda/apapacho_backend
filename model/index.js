import daoProducts from './daos/products/ProductsDaoFactory.js'
import daoCart from './daos/carts/CartDaoFactory.js'
import daoUsers from './daos/users/UsersDaoFactory.js'

const din = {
    ProductsDao: daoProducts.ProductsDao,
    ProductsDaoMemory: daoProducts.ProductsDaoMemory,
    CartDaoMemory: daoCart.CartDaoMemory,
    CartDao: daoCart.CartDao,
    users: daoUsers.users
}

export default din