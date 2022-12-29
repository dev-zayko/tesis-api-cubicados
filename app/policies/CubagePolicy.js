const {
    Cubages,
} = require('../models/index');

module.exports = {
    async create(req, res, next) {
        await Cubages.findAll({
            where: {
                room_id : req.body.idRoom
                        }
        }).then((response) => {
            if (req.user.membership_id > 1) {
                if(req.user.user_status_id === 2) {
                    if (response.length < 2) {
                        res.send({
                            status: 'success'
    
                        });
                    } else {
                        res.send({
                            status: 'suspendido',
                            messsage: 'Favor renueve pago'
                        });
                    }       
                } else {
                    res.send({
                        status: 'success'

                    });
                }
            } else {
                if (response.length < 2) {
                    res.send({
                        status: 'success'

                    });
                } else {
                    res.send({
                        status: 'limited',
                        message: 'Se alcanso el limite de cubicaciones'
                    });
                }
            }
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        })
    }
}