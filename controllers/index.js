const auth = require('./auth');
const categorias = require('./categorias');
const productos = require('./productos');
const usuarios = require('./usuarios');


module.exports = {
    ...auth,
    ...categorias,
    ...productos,
    ...usuarios,
}