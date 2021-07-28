const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async(req, res = response) => {
    
    const { correo, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({correo});

        if(!usuario){
            return res.status(400).json({
                msg: 'usuario / password no son correctos - correo'
            });
        }
        
        // El usuario está activo en la base de datos
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'usuario / password no son correctos - estado: false'
            });
        }
        
        // Verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        
        if(!validPassword){
            return res.status(400).json({
                msg: 'usuario / password no son correctos - password'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const googleSingin = async(req, res = response) => {

    const { id_token } = req.body;

    
    try {
        const {nombre, correo, img} = await googleVerify(id_token)

        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            //Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si el usuario en DB
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        res.status(400).json({
            msg: 'Token de google no es valido',
        })
    }


}


module.exports = {
    login,
    googleSingin
}