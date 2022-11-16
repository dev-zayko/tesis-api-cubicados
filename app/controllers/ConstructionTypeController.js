const {ConstructionType} = require('../models/index');

module.exports = {
    getAll(req, res) {
        ConstructionType.findAll()
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
