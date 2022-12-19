const {ConstructionType, sequelize} = require('../models/index');

module.exports = {
    async getCountConstruction(req, res, next) {
        await sequelize.query('CALL get_count_trademark_by_construction(:id)',
            {replacements: {id: req.body.idConstruction}})
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
        await ConstructionType.findAll()
            .then(constructionType => {
                if (!constructionType) {
                    res.send({
                        status: 'empty',
                        message: 'No hay tipos de construccion'
                    })
                } else {
                    res.send({
                        status: 'success',
                        data: constructionType
                    })
                }
            })
            .catch(error => {
                res.status(500).send({
                    error: error.message,
                    msg: 'Error al obtener los tipo de construcción'
                })
            })
    }
}
