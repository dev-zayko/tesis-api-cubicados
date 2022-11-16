const {
    Communes
} = require('../models/index')

module.exports = {
    async getAll(req, res, next) {
        await Communes.findAll()
            .then(communes => {
                req.communes = communes;
                req.name = req.query.name
                next();
            }).catch(err => {
                res.status(500).send({
                    message: err.message || 'Se produjo un error al recuperar las Comunas'
                })
            })
    },
    async matchingCommunes(req, res, next) {
        let reg = new RegExp(req.name, 'gi');
        let result = [];
        req.communes.map((item) => {
            if (item.nombre.match(reg) !== null) {
                result.push({
                    id: item.id,
                    name:  item.name
                });
            }
        });
        res.send(result);
    },
    async getById(req, res) {
        const idRegion = req.params.idRegion
        await Communes.findAll({
                where: {
                    region_id: idRegion
                }
            })
            .then(communes => {
                if (communes.length === 0) {
                    res.send({
                        status: 'empty'
                    })
                } else {
                    res.send(communes);
                }
            })
            .catch(err => {
                res.status(500).send({
                    error: err,
                    message: 'Error al obtener proyecto asociado al Usuario con el id=' + idUsuario
                });
            });
    }
}
