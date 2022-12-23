const {
    Projects, User, Sequelize
} = require("../models/index");

module.exports = {
    async count(req, res, next) {
        await Projects.findAll({
            where: {
                id_user: req.user.id
            }
        }).then((response) => {
            req.projects = response;
            next();
        }).catch((err) => {
            res.sendStatus(401);
        });
    }, async costAdjust(req, res, next) {
        let total = 0;
        (req.roomsCostTotal).map((item) => {
            total += parseInt(item.total)
        });
        await Projects.update({
            total_price: total
        }, {
            where: {
                id: req.project.id
            },
        }).then((response) => {
            res.send({
                status: response
            });
        }).catch(error => {
            res.sendStatus(500);
        });

    },
    async totalProjects(req, res, next) {
        try {
            let total = 0;
            const response = await Projects.findAll({
                attributes: [
                    'total_price'
                ],
                where: {
                    id_user: req.user.id
                }
            });
            if (response.length === 0) {
                res.send({
                    status: 'empty',
                    data: 0
                })
            } else {
                response.map(item => {
                    total += parseInt(item.total_price)
                })
                res.send({
                    status: 'success',
                    data: total
                });
            }
        } catch (error) {
            console.log(error);
            res.send({
                status: 'error',
                data: 0
            });
        }
    },
    async find(req, res, next) {

        await Projects.findByPk(req.body.idProject, {
            where: {
                deleted: false
            }
        })
            .then((projects) => {
                if (projects === null) {
                    res.status(404).json({
                        msg: 'El proyecto no ha sido encontrado'
                    });
                } else {
                    req.roomsCostTotal = req?.roomsCostTotal;
                    req.project = projects;
                    next();
                }
            }).catch(error => {
                res.sendStatus(500);
            });
    }, async getAll(req, res) {
        await Projects.findAll({
            include: [{
                model: User, as: 'User', required: true
            }]
        }).then(proyecto => {
            res.send(proyecto);
        })
            .catch(err => {
                res.status(500).send({
                    message: err.message || 'Se produjo un error al recuperar los proyectos'
                })
            })
    }, async store(req, res) {
        await Projects.create({
            name: req.body.name,
            id_user: req.user.id
        })
            .then(response => {
                res.send({
                    status: 'success',
                    data: response
                });
            }).catch(err => {
                res.status(500).send({
                    status: 'error',
                    error: err,
                    message: 'Ha ocurrido un error al guardar el proyecto'
                })
            });
    }, async getById(req, res) {
        const idUser = req.user.id
        await Projects.findAll({
            where: {
                id_user: idUser, deleted: false
            },
            order: [
                ['created_at', 'DESC'],
            ],
        })
            .then((proyectos) => {
                if (proyectos.length === 0) {
                    res.send({
                        status: 'empty'
                    })
                } else {
                    res.send({
                        status: 'success', data: proyectos
                    });
                }
            })
            .catch(err => {
                res.send({
                    error: err, message: 'Error al obtener proyecto asociado al Usuario con el id=' + idUsuario
                });
            });
    }, async update(req, res) {
        req.project.name = req.body.name
        req.project.save()
            .then(project => {
                if (!project) {
                    res.send({
                        status: "error",
                        message: "No se pudo actualizar el proyecto"
                    })
                } else {
                    res.send({
                        status: 'success',
                        message: 'El proyecto ha sido actualizado',
                        data: project
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    status: 'error',
                    error: err,
                    message: 'Error al actualizar el proyecto con el id=' + req.project.idProyecto
                });
            });
    }, async delete(req, res) {
        req.project.deleted = true;
        req.project.save().then(project => {
            res.send({
                msg: `El proyecto con nombre ${project.name} ha sido deshabilitado `
            });
        })
            .catch(err => {
                res.json({
                    msg: err
                })
            })
    }
}
