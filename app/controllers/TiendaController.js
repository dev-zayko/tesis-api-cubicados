const {Tienda} = require('../models/index')

module.exports = {

    async getAll(req, res) {
        await Tienda.findAll({
            where: {
                vigente: true
            }
        })
            .then(tienda => {
                res.send(tienda);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || 'Se produjo un error al recuperar las tiendas'
                })
            })
    },
    async store(req, res) {
        await Tienda.create({
                nombre: req.body.nombre,
            })
            .then(response => {
                res.send({
                    status: 'success',
                    data: response
                });
            }).catch(err => {
                res.status(500).send({
                    status: 'error',
                    error: err,
                    message: 'Ha ocurrido un error al guardar la tienda'
                })
            });
    }

}