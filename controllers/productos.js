const { request, response } = require("express");
const { Producto, Categoria } = require("../models");


// obtenerProdcutos - paginado - total -populate 
const obtenerProductos = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [productos, total] = await Promise.all([
        Producto.find(query).limit(Number(limite))
            .skip(Number(desde))
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre'),
        Producto.countDocuments(query)
    ]);

    res.json({
        total,
        productos
    });
}

// obtenerProducto - populate {} 
const obtenerProducto = async (req = request, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json({
        producto
    });
}

// 
const crearProducto = async (req = request, res = response) => {
    let { nombre, categoria, precio = 0, descripcion = '' } = req.body;

    // Validar que el producto no exista en la BD y obtener el id de la categoria
    nombre = nombre.toUpperCase();
    categoria = categoria.toUpperCase();
    precio = Number(precio);

    const [existeproductoBD, categoriaBD] = await Promise.all([
        Producto.findOne({ nombre }),
        Categoria.findOne({ nombre: categoria })
    ]);

    if (existeproductoBD) {
        return res.status(400).json({
            msg: `El producto ${nombre} con categoria ${categoria} ya exixte en base de datos`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id,
        precio,
        categoria: categoriaBD._id,
        descripcion
    }
    const nuevoProducto = await new Producto(data);

    // Guardar en BD
    await nuevoProducto.save();

    res.status(201).json(nuevoProducto);
}

// actualizarProducto
const actualizarProducto = async (req = request, res = response) => {
    const { nombre, precio, disponible, descripcion } = req.body;
    const { id } = req.params;

    // Revisar que el nombre por el que se va a actualizar no exista en la base de datos.
    const nombreProductoBD = await Producto.findOne({ nombre });

    if (nombreProductoBD) {
        return res.status(400).json({
            msg: `el nombre ${nombre} ya existe en la base de datos`
        });
    }

    //Construir la data que se va a actulizar del producto
    const data = {
        nombre: nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    if (precio)
        data.precio = precio

    if (disponible != undefined)
        data.disponible = disponible

    if (descripcion)
        data.descripcion = descripcion

    const productoActualizado = await Producto.findByIdAndUpdate(id, data);

    res.json({
        productoActualizado
    });
}

// borrarProducto - estado: false
const borrarProducto = async (req = request, res = response) => {
    const { id } = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false });


    res.json({
        productoBorrado
    });
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto,
}