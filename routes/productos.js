const { Router } = require('express');
const { check } = require('express-validator');

const { obtenerProductos,
        obtenerProducto,
        actualizarProducto,
        crearProducto,
        borrarProducto 
} = require('../controllers');

const { esCategoriaValida, existeProductoPorId } = require('../helpers/db-validators');
const { validarJWt, validarCampos, esAdminRole } = require('../middlewares');


const router = Router();

// Obtener todos los productos - publico
router.get('/', obtenerProductos);

// Obtener un producto por id
router.get('/:id', [
    check('id', 'El ID es obligatorio').notEmpty(),
    check('id', 'No es un ID de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],obtenerProducto);

// Crear producto - privado - cualquier persona con un token valido 
router.post('/', [
    validarJWt,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('categoria', 'La categoria es obligatoria').notEmpty(),
    check('categoria').custom(esCategoriaValida),
    check('precio').isNumeric(),
    validarCampos
], crearProducto);

// Actualizar producto por id - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWt,
    check('id', 'El ID es obligatorio').notEmpty(),
    check('id', 'No es un ID de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('precio', 'El precio debe ser un valor numerico').isNumeric(),
    check('disponible').isBoolean(),
    
    validarCampos
],actualizarProducto);

// Borrar producto por id - Admin 
router.delete('/:id', [
    validarJWt,
    esAdminRole,
    check('id', 'El ID no es valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);

module.exports = router;