const {
    Rooms,
    User,
    Projects
} = require('../models/index');

module.exports = {
    async userAuth(req, res, next) {
        await Projects.findAll({
            where: {
                id_user: req.user.id
            }
        }).then((response) => {
            if (response === 0) {
                res.send({
                    message: 'No estas autorizado para crear la habitacion'
                })
            } else {
                next();
            }
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        })
    },
    add(req, res, next) {
        const idProject = req.body.idProject;
        Rooms.findAll({
            where: {
                project_id: idProject
            }
        }).then((response) => {
            if (req.user.membership_id > 1) {
                if (req.user.user_status_id === 2) {
                    if (response.length < 2) {
                        next();
                    } else {
                        res.send({
                            status: 'suspendido',
                            messsage: 'Favor renueve pago'
                        })
                    }
                } else {
                    next();
                }
            } else {
                if (response.length < 2) {
                    next();
                } else {
                    res.send({
                        status: 'limited',
                        messsage: 'Se alcanso el limite de habitacion'
                    })
                }
            }
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        })
    }
}
