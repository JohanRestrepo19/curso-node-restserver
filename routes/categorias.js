const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria,
        obtenerCategorias,
        obtenerCategoria,
        borrarCategoria,
        actualizarCategoria 
} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const { validarCampos, validarJWt, esAdminRole } = require('../middlewares');


const router = Router();

// {{url}}/api/categorias

// Obtener todas las categorias -> publico
router.get('/', obtenerCategorias);

// Obtener una categoria por id -> publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
], obtenerCategoria);

// Crear categoria -> privado -> cualquier persona con un token valido
router.post('/', [
    validarJWt,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar registro por id -> privado -> cualquier persona con un token valido
router.put('/:id', [
    validarJWt,
    check('id').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria);

// Borrar un categoria - Admin
router.delete('/:id', [
    validarJWt,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);


module.exports = router;