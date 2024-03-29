const {
    Cubages,
    Users,
    Sequelize,
    Rooms,
    Materials,
    Constructions,
    Projects,
    ConstructionType,
    Stores,
    Communes,
    Regions,
    sequelize
} = require('../models/index')

module.exports = {
    async updateFinalized(req, res, next) {
        let isFinalized = req.body.isFinalized;
        console.log(req.cubage)
        await req.cubage.update(
            {
                finalized: isFinalized
            }
        ).then((response) => {
            res.send({
                status: 'success',
                data: response
            })
        }).catch((error) => {
            console.log(error.message)
            res.send({
                status: 'error',
                data: 0,
                error: error.message
            })
        });
    },
    async preference(req, res, next) {
        await sequelize.query('CALL get_count_stores_by_id_user(:idUser)',
            {replacements: {idUser: req.user.id}})
            .then((response) => {
                if (response.length === 0) {
                    res.send({
                        status: 'empty',
                        data: 0
                    })
                } else {
                    res.send({
                        status: 'success',
                        data: response[0]
                    })
                }

            }).catch(error =>
                res.send({
                    status: 'error',
                    data: error.message
                })
            );
    },
    async count(req, res, next) {
        let rooms = JSON.parse(req.rooms);
        let projectCount = req.projectCount;
        await Cubages.findAll({
            include: [{
                model: Rooms,
                as: 'rooms',
                required: true,
                include: [{
                    model: Projects,
                    as: 'projects',
                    required: true,
                    where: {
                        id_user: req.user.id
                    }
                }]
            }]
        }).then((response) => {
            res.send({
                projects: projectCount,
                rooms: rooms.length,
                cubages: response.length
            });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(401);
        });
    },
    async find(req, res, next) {
        await Cubages.findOne(
            {
                where: {id: req.body.idCubages}
            }
        ).then((response) => {
            if (response === null) {
                res.status(404).json({
                    msg: 'La Cubicacion no ha sido encontrado'
                });
            } else {
                req.cubage = response;
                next();
            }
        }).catch((error) => {
            res.send({
                error: error.message
            })
        });

    },
    async store(req, res, next) {
        await Cubages.create({
            area: req.body.area,
            depth: req.body.depth,
            width: req.body.width,
            m3: req.body.m3,
            dosage: req.body.dosage,
            gravel: req.body.gravel,
            sand: req.body.sand,
            water: req.body.water,
            length: req.body.length,
            count: req.body.count,
            description: req.body.description,
            construction_id: req.body.idConstruction,
            room_id: req.body.idRoom,
            material_id: req.body.idMaterial
        })
            .then(response => {
                req.cubages = response;
                req.totalMaterials = req.body.totalCost;
                next();
            }).catch(err => {
                res.status(500).send({
                    status: 'error',
                    error: err.message,
                    message: 'Ha ocurrido un error al guardar la cubicacion'
                })
            });

    },
    async getById(req, res) {
        const idRoom = req.body.idRoom
        await Cubages.findAll({
            where: {
                room_id: idRoom,
                deleted: false,
            },
            include: [{
                model: Materials,
                as: 'materials',
                required: true,
                include: [{
                    model: Stores,
                    as: 'stores',
                    required: true
                },
                {
                    model: Communes,
                    as: 'communes',
                    required: true,
                    include: [{
                        model: Regions,
                        as: 'regions',
                        required: true
                    }]
                }
                ],

            }, {
                model: Constructions,
                as: 'constructions',
                required: true,
                include: [{
                    model: ConstructionType,
                    as: 'constructionType',
                    required: true
                }]
            }]
        })
            .then(cubages => {
                if (cubages.length === 0) {
                    res.send({
                        status: 'empty',
                        data: 0,
                        count: cubages.length
                    })
                } else {
                    res.send({
                        status: 'success',
                        data: cubages,
                        count: cubages.length
                    });
                }
            })
            .catch(error => {
                res.send({
                    error: error.message,
                    message: 'Error al obtener la cubicación asociado a la Habitación con el id=' + idRoom
                });
            });
    },
    async delete(req, res, next) {
        try {
            let idMaterial = req.body.idMaterial;
            let idRoom = req.body.idRoom;
            let idProject = req.body.idProject;
            let idCubage = req.body.idCubage;

            const cubageFind = await Cubages.findOne({where: {id: idCubage}});
            const roomFind = await Rooms.findOne({where: {id: idRoom}});
            const projectFind = await Projects.findOne({where: {id: idProject}});
            const materialFind = await Materials.findOne({where: {id: idMaterial}});
            console.log(projectFind)
            let totalMaterial = materialFind.price * cubageFind.count;
            let roomCostRest = roomFind.neto_amount - totalMaterial;
            let projectCostRest = projectFind.total_price - totalMaterial;
            roomFind.neto_amount = roomCostRest;
            roomFind.final_amount = roomCostRest;
            projectFind.total_price = projectCostRest;
            cubageFind.deleted = true;
            roomFind.save();
            projectFind.save();
            cubageFind.save();
            res.send({
                status: 'success',
            })
        } catch (error) {
            console.log(error.message);
            res.send({
                status: 'error',
                error: error.message
            });
        }
        //req.cubage.deleted = true;
        /**req.cubage.save().then(() => {
            res.send({
                msg: `La cubicación ha sido deshabilitada`
            });

        })
            .catch(err => {
                res.json({
                    msg: err
                })
            })**/
    },
    async chargeDataToPDF(req, res) {
        const idProject = req.body.idProject;
        await Cubages.findAll({
            include: [{
                model: Materials,
                as: 'materials',
                required: true,
                include: [{
                    model: Stores,
                    as: 'stores',
                    required: true
                },
                {
                    model: Communes,
                    as: 'communes',
                    required: true,
                    include: [{
                        model: Regions,
                        as: 'regions',
                        required: true
                    }]
                }
                ],

            }, {
                model: Constructions,
                as: 'constructions',
                required: true,
                include: [{
                    model: ConstructionType,
                    as: 'constructionType',
                    required: true
                }]
            }, {
                model: Rooms,
                as: 'rooms',
                required: true,
                include: [{
                    model: Projects,
                    as: 'projects',
                    required: true,
                    where: {
                        id: idProject,
                        id_user: req.user.id
                    },
                }]
            }]
        })
            .then(cubages => {
                if (cubages.length === 0) {
                    res.send({
                        status: 'empty',
                        data: 0,
                        count: cubages.length
                    })
                } else {
                    res.send({
                        status: 'success',
                        data: cubages,
                        count: cubages.length
                    });
                }
            })
            .catch(error => {
                res.send({
                    error: error.message,
                    message: 'Error al obtener la cubicación asociado a la Habitación con el id=' + idRoom
                });
            });
    },
};
