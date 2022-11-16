const {
    Projects, User
} = require('../models/index')
module.exports = {
    /**
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    add(req, res, next) {
        Projects.findAll({
            where: {
                id_user: req.user.id
            }
        }).then((response) => {
            if (req.user.membership_id > 1) {
                if (req.user.user_status_id === 2) {
                    res.send({
                        status: 'discontinued', message: 'Suspendido por no pago, renueve premium'
                    });
                } else {
                    next();
                }
            } else {
                if (response.length < 2) {
                    next();
                } else {
                    res.send({
                        status: 'limited', message: 'Se alcanso el limite de proyectos'
                    });
                }
            }
        });

    }, /**
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    management(req, res, next) {
        if (req.user.id === req.project.id_user) {
            next();
        } else {
            res.status(401).json({
                msg: "No estas autorizado para gestionar este proyecto"
            });
        }
    }
}
