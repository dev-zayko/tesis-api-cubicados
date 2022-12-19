const {Stores, sequelize} = require('../models/index')

module.exports = {
    async getPopularStores(req, res, next) {
        await sequelize.query('CALL get_count_stores')
            .then((response) => {
                res.send({
                    status: 'success',
                    data: response
                })
            }).catch(error =>
                res.send({
                    status: 'error',
                    data: error.message
                })
            );
    },
    async getAll(req, res) {
        await Stores.findAll({
            where: {
                deleted: false
            }
        })
            .then(stores => {
                if (!stores) {
                    res.send({
                        status: 'empty'
                    });
                } else {
                    res.send({
                        status: 'success',
                        data: stores
                    });
                }
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
