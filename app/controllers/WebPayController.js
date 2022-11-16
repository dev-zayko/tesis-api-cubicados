const WebpayPlus = require('transbank-sdk').WebpayPlus;
const {
    MembresiasPagadas
} = require('../models/index');
const {
    v1: uuidv1
} = require('uuid');
module.exports = {
    async createTransaction(req, res, next) {
        try {
            let buyOr = await MembresiasPagadas.findOne({
                order: [
                    ['buy_order', 'DESC']
                ]
            });
            let buyOrder = buyOr.buy_order + 1 + "";
            let sessionId = uuidv1();
            let amount = req.body.amount;
            let returnUrl = req.protocol + "://" + req.get("host") + "/api/webpay/commit";
            const createResponse = await new WebpayPlus.Transaction().create(
                buyOrder,
                sessionId,
                amount,
                returnUrl
            );

            let token = createResponse.token;
            let url = createResponse.url;

            let viewData = {
                buyOrder,
                sessionId,
                amount,
                returnUrl,
                token,
                url
            };

            res.send({
                viewData
            });

        } catch (err) {
            console.log(err)
        };

    },
    async commitTransaction(req, res, next) {
        let params = req.method === 'GET' ? req.query : req.body;
        let token = params.token_ws;
        let tbkToken = params.TBK_TOKEN;
        let tbkOrdenCompra = params.TBK_ORDEN_COMPRA;
        let tbkIdSesion = params.TBK_ID_SESION;
        let step = null;
        let viewData = {
            token,
            tbkToken,
            tbkOrdenCompra,
            tbkIdSesion
        };

        if (token && !tbkToken) { //Flujo 1
            const commitResponse = await new WebpayPlus.Transaction().commit(token);
            viewData = {
                token,
                commitResponse,
            };
            step = "Confirmar Transacción";
            res.render('voucher', {
                viewData,
            });
            return;
        } else if (!token && !tbkToken) { //Flujo 2
            step = "El pago fue anulado por tiempo de espera.";
        } else if (!token && tbkToken) { //Flujo 3
            step = "El pago fue anulado.";

        } else if (token && tbkToken) { //Flujo 4
            step = "El pago es inválido.";

        }
        res.render('commit-error', {
            step,
            viewData,
        });
    }
}