const {
    Materials
} = require('../models/index')

module.exports = {
    async store(req, res) {
        let price = ((req.body.price).replace('$', '').replace('.', ''));
        await Materials.create({
            image: req.body.image,
            trademark: req.body.tradeMark,
            title: req.body.title,
            price: price,
            store_id: req.body.idStore,
            commune_id: req.body.idCommune
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
