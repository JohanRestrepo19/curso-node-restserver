const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSingin } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campo');


const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos,
],login);

router.post('/google', [
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos,
],googleSingin);

module.exports = router; 