const {
    Rooms,
    Materials,
    Projects,
    Sequelize
} = require('../models/index')

module.exports = {
    async count(req, res, next) {
        try {
            let projects = [];
            let rooms = [];
            let projectCount = req.projects;
            await Rooms.findAll({
                include: [{
                    model: Projects,
                    as: 'projects',
                    required: true,
                    where: {
                        id_user: req.user.id
                    }
                }]
            }).then((response) => {
                req.rooms = JSON.stringify(response);
                req.projectCount = projectCount.length;
            });
            next();
        } catch (err) {
            console.log(err)
            res.sendStatus(500);
        }

    },
    async costAdjust(req, res, next) {
        let idRoom = req.cubages.room_id;
        let RoomFound = await Rooms.findOne({
            where: {
                id: idRoom,
                deleted: false
            }
        });
        let totalRoom = parseInt(RoomFound.final_amount);
        let totalMaterial = parseInt((req.totalMaterials).replace('$', '').replace('.', ''));
        let total = (totalRoom + totalMaterial);
        await RoomFound.update({
            neto_amount: total,
            final_amount: total
        }

        ).then((response) => {
            req.body.action = 'next';
            req.body.idProject = response.project_id;
            next();
        }).catch(error => {
            res.status(500).send({
                error: error,
                message: 'Error en Ajuste'
            })
        })
    },
    async getById(req, res, next) {
        const idProject = req.body.idProject;
        const action = req.body.action;
        await Rooms.findAll({
            where: {
                project_id: idProject,
                deleted: false
            }
        })
            .then(rooms => {
                switch (action) {
                    case 'get':
                        if (rooms.length === 0) {
                            res.send({
                                status: 'empty',
                                data: 0
                            })
                        } else {
                            res.status(200).send({
                                status: 'success',
                                data: rooms
                            });
                        }
                        break;
                    case 'create':
                        req.rooms = rooms;
                        next();
                        break;
                    case 'next':
                        let result = [];
                        rooms.map((item) => {
                            result.push({
                                total: item.neto_amount
                            });
                        })
                        req.roomsCostTotal = result;
                        req.body.idProject = idProject;
                        next();
                        break;
                }
            })
            .catch(err => {
                res.status(500).send({
                    error: err,
                    message: 'Error al obtener la habitaciones'
                })
            })
    },
    async store(req, res) {
        try {
            const idProject = req.body.idProject;
            let rooms = req.rooms;
            let name = req.body.name;
            if (rooms.length > 0) {
                rooms.map((item) => {
                    if (item.name !== name) {
                        name = req.body.name
                    } else {
                        name = 'duplicated';
                        console.log('duplicated')
                    }
                });
            }
            name === 'duplicated' ? res.send({
                status: name,
                data: 0,
                message: 'No pueden haber habitaciones con el mismo nombre'
            }) :
                await Rooms.create({
                    name: name,
                    project_id: idProject,
                    neto_amount: 0,
                    discount: 0,
                    deleted: false,

                })
                    .then(response => {
                        res.status(200).send({
                            status: 'success',
                            data: response
                        })
                    });

        } catch (error) {
            console.log(error);
            res.send({
                error: error.message,
                message: 'Ha ocurrido un error en guardar la habitación'
            });

        }
    },
    async delete(req, res) {
        req.habitacion.vigente = false;
        req.habitacion.save().then(habitacion => {
            res.status(200).send({
                msg: `La Habitación con nombre ${habitacion.nombre} ha sido deshabilitado `
            });
        })
            .catch(err => {
                res.status(500).send({
                    error: err,
                    message: 'Error al borrar'
                });
            });
    }
}
