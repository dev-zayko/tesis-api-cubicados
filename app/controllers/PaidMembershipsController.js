const {
    PaidMemberships,
    Memberships
} = require('../models/index');

module.exports = {
    async getAll(req, res, next) {

        await PaidMemberships.findAll({
            attributes: [
                'created_at',
                'buy_order',
                'neto_amount',
            ],
            include: [{
                model: Memberships,
                as: 'memberships',
                required: true,
                attributes: [
                    'name',
                    'discount',
                    'days'
                ],
            }],
            where: {
                user_id: req.user.id
            }
        }).then((response) => {
            if (response.lenght === 0) {
                res.send({
                    status: ' empty',
                    data: 0,
                })
            } else {
                res.send({
                    status: 'success',
                    data: response
                });
            }

        }).catch((err) => {
            res.send({
                error: err.message
            });
        });
    },

    async store(req, res, next) {
        let netoAmount = req.body.netoAmount;
        let discount = 0;
        let finalAmount = 0;
        switch (req.body.idMembership) {
            case 2:
                discount = 45
                break;
            case 3:
                discount = 150
                break;
            case 4:
                discount = 2000;
                break;
        }
        finalAmount = netoAmount - discount;
        await PaidMemberships.create({
            membership_id: req.body.idMembership,
            user_id: req.user.id,
            neto_amount: netoAmount,
            discount: discount,
            final_amount: finalAmount,
            buy_order: req.body.buyOrder,
            session_id: req.body.sessionId
        }).then((response) => {
            req.idMembership = req.body.idMembership;
            req.idPaidMembership = response.dataValues.id;
            req.buyOrder = req.body.buyOrder;
            req.netoAmount = netoAmount;
            req.notify = 'payment';
            next();
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
    }

}
