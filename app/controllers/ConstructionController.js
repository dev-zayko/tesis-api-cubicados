const {Constructions, ConstructionType} = require('../models/index')

module.exports = {
    getById(req, res) {
        const idConstructionType = req.body.idConstructionType
        Constructions.findAll({
            include: [{
                model: ConstructionType, as: 'constructionType',
                required: true
            }],
            where: {construction_type_id: idConstructionType}
        })
            .then(construction => {
                if (construction) {
                    res.send({
                        status: 'construction',
                        data: construction
                    });
                } else {
                    res.send({
                        status: 'empty',
                        message: `No se puede encontrar la construccion asociado al Tipo de construcción con el id=${idConstructionType}`
                    })
                }
            })
            .catch((error) => {
                res.send({
                    error: error,
                    message: 'Error al obtener las construcciones'
                });
            });
    }
}
