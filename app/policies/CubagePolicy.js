const {
    Cubicacion
} = require('../models/index');

module.exports = {
    async create(req, res, next) {
        await Cubicacion.findAll({
            where: {
                idHabitacion: req.body.idHabitacion
            }
        }).then((response) => {
            if (req.user.idMembresia > 1) {
                if(req.user.idEstadoUsuario === 2) {
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