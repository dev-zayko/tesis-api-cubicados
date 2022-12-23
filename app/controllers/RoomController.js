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
    async restCostAdjust(req, res, next) {
        try {
            let project = req.project;
            let totalPrice = parseInt(project.total_price);
            let room = parseInt(req.room.final_amount);
            let resultRest = (totalPrice - room);
            project.total_price = resultRest;
            project.save();
            res.send({
                status: 'success',
                data: project,
            });
        } catch (error) {
            console.log(error.message);
            res.send({
                status: 'error',
                error: error.message
            })
        }
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
    async update(req, res) {

        const roomFind = await Rooms.findOne({where: {name: req.body.name, project_id: req.body.idProject, deleted: false}});
        if (roomFind === null) {
            await Rooms.update({
                name: req.body.name
            }, {
                where: {id: req.body.idRoom}
            })
                .then(room => {
                    if (!room) {
                        res.send({
                            status: 'error',
                            message: 'No se puede actualizar la habitación'
                        });
                    } else {
                        res.send({
                            status: 'success',
                            message: 'La habitación ha sido actualizada',
                            data: room
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        status: 'error',
                        error: err.message,
                        message: 'Error al actualizar la habitación con el id=' + req.room.idRoom
                    })
                })
        } else {
            res.send({
                status: 'duplicated',
                data: req.body.name
            })
        }
    },
    async delete(req, res, next) {
        try {
            let idRoom = req.body.idRoom;
            const roomFind = await Rooms.findOne({where: {id: idRoom, deleted: false}});
            if (roomFind !== null) {
                roomFind.deleted = true;
                roomFind.save().then(response => {
                    req.room = roomFind
                    next();
                })
                    .catch(err => {
                        res.status(500).send({
                            error: err,
                            message: 'Error al borrar'
                        });
                    });
            } else {
                res.send({
                    status: 'error',
                    error: 'No se encontro la habtiación'
                })
            }
        } catch (error) {
            res.send({
                status: 'error',
                error: error.message
            })
        }
    }
}
