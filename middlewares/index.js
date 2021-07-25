const validaCampos = require('../middlewares/validar-campo');
const validaJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');


module.exports = {
    ...validaCampos, 
    ...validaJWT,
    ...validaRoles
}