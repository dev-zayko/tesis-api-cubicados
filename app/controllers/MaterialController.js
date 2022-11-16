const {
    Material
} = require('../models/index')

module.exports = {
    async store(req, res) {

        product = JSON.parse(req.query.producto);
        precio = ((product.precio).replace('$', '')).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        await Material.create({
                imagen: product.imagen,
                marca: product.marca,
                titulo: product.titulo,
                precio: precio,
                despacho: product.despacho,
                retiro: product.retiro,
                idTienda: req.query.idTienda,
                idComuna: req.query.idComuna
            })
            .then(response => {
                res.send({
                    status: 'success',
                    data: response
                });
            }).catch(err => {
                res.status(500).send({
                    error: err,
                    status: 'FAILED',
                    message: 'No se ha podido guardar el material'
                })
            });
    }
}