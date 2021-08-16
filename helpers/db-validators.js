const { Categoria, 
        Role,
        Usuario,
        Producto
} = require('../models');
const { collection } = require('../models/categoria');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
           throw new Error(`El rol ${rol} no está en la base de datos`);
    }
}

const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({correo});
       
    if(existeEmail){
        throw new Error(`El email: ${correo},  ya está registrado en la base de datos`)
    }
}

const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
       
    if(!existeUsuario){
        throw new Error(`El id: ${id},  no existe`)
    }
}

const existeCategoriaPorId = async(id) => {
    const existeCategoria = await Categoria.findById(id);

    if(!existeCategoria){
        throw new Error(`El id: ${id}, no existe`)
    }
}

const esCategoriaValida = async(categoria = '') => {
    const nombre = categoria.toUpperCase();
    const existeCategoria = await Categoria.findOne({nombre});
    
    if(!existeCategoria){
        throw new Error(`La categoria ${nombre}, no es valida`)
    }
}

const existeProductoPorId = async(id) => {
    const existeProducto = await Producto.findById(id);

    if(!existeProducto){
        throw new Error(`El id: ${id}, no existe`)
    }
}

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);

    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);
    }

    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    esCategoriaValida,
    existeProductoPorId,
    coleccionesPermitidas
}


