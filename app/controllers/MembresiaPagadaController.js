const {
    MembresiasPagadas,
    Membresias
} = require('../models/index');

module.exports = {
    async getAll(req, res, next) {
        let ordenFecha = req.body.arrowFecha;
        let ordenMonto = req.body.arrowMonto;
        let tipoFiltro = req.body.tipoFiltro;
        let orden = null;
        if (ordenMonto === true) {
            ordenMonto = 'DESC'
        } else if (ordenMonto === false) {
            ordenMonto = 'ASC';
        }
        if (ordenFecha === true) {
            ordenFecha = 'DESC'
        } else if (ordenFecha === false) {
            ordenFecha = 'ASC';
        }
        if (tipoFiltro === 'create_at') {
            orden = ordenFecha
        } else if (tipoFiltro === 'neto_amount') {
            orden = ordenMonto
        }
        await MembresiasPagadas.findAll({
            order: [
                [tipoFiltro, orden]
            ],
            attributes: [
                'create_at',
                'buy_order',
                'neto_amount'
            ],
            include: [{
                model: Membresias,
                as: 'Membresias',
                required: true,
                attributes: [
                    'nombre',
                ],
            }],
            where: {
                idUsuario: req.user.idUsuario
            }
        }).then((response) => {
            res.send(response)
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
    },

    async store(req, res, next) {
        let neto_amount = req.body.neto_amount
        let transbank_amount = neto_amount * 0.01;
        let final_amount = neto_amount * 0.99;
        await MembresiasPagadas.create({
            idMembresia: req.body.idMembresia,
            idUsuario: req.user.idUsuario,
            neto_amount: neto_amount,
            transbank_amount: transbank_amount,
            final_amount: final_amount,
            buy_order: req.body.buy_order,
            sessionId: req.body.sessionId
        }).then((response) => {
            req.idMembresia = req.body.idMembresia;
            req.idMembresiaPagada = response.dataValues.idMembresiaPagada;
            req.buyOrder = req.body.buy_order;
            req.netoAmount = neto_amount;
            next();
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
    }

}