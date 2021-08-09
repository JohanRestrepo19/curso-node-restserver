const { response, request } = require("express");
const { Categoria } = require('../models')

// obtenerCategorias - paginado - total - populate 
const obtenerCategorias = async(req = request, res = response) => {
    const { limite = 5 , desde = 0 } = req.query;
    const query = {estado: true};

    const [categorias, total] = await Promise.all([
        Categoria.find(query)
        .limit(Number(limite))
        .skip(Number(desde))
        .populate('usuario', 'nombre'),
        Categoria.countDocuments(query)
    ]);

    res.json({
        total,
        categorias
    });
}

// obtenerCategoria - populate {}
const obtenerCategoria = async(req = request, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json({
        categoria
    });
}


const crearCategoria = async(req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre})

    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = await new Categoria(data);

    // Guardar DB
    await categoria.save();

    res.status(201).json(categoria);

}

// actualizarCategoria (cambiar nombre)
const actualizarCategoria = async(req = request, res = response) => {
    const { id } = req.params;
    const nuevoNombre = req.body.nombre.toUpperCase();

    // Verificar que el nombre no exixta en la BD
    const nombreCategoria = await Categoria.findOne({nombre: nuevoNombre});
    if(nombreCategoria){
        return res.status(400).json({
            msg: `el nombre ${nuevoNombre} ya existe en DB`
        })
    }
    // Actualizar el nombre en BD y actualizar el usuairo que lo actualizó
    const data = {
        nombre: nuevoNombre,
        usuario: req.usuario._id
    }

    const categoria = await Categoria.findByIdAndUpdate(id, data).populate('usuario');
    
    res.json({
        categoria
    })
}


// borrarCategoria - estado: false
const borrarCategoria = async(req = request, res = response) => {
    const { id } = req.params;

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado: false});

    res.json({
        categoriaBorrada
    })
}   


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}
