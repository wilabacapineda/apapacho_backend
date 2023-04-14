import daoProducts from './daos/products/ProductsDaoFactory.js'
import daoCart from './daos/carts/CartDaoFactory.js'
import daoUsers from './daos/users/UsersDaoFactory.js'

const ProductsDao= daoProducts.ProductsDao
const ProductsDaoMemory = daoProducts.ProductsDaoMemory
const CartDaoMemory = daoCart.CartDaoMemory
const CartDao= daoCart.CartDao
const users= daoUsers.users

export {ProductsDao,ProductsDaoMemory,CartDaoMemory,CartDao,users}