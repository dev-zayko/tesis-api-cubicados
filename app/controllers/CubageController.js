const {
    Cubages,
    Sequelize,
    Rooms,
    Materials,
    Constructions,
    Projects,
    ConstructionType,
    Stores,
    Communes,
    Regions
} = require('../models/index')

module.exports = {
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
        let cubage = await Cubages.findByPk(req.body.idCubages);

        if (cubage !== null) {
            res.status(404).json({
                msg: 'La Cubicacion no ha sido encontrado'
            });
        } else {
            req.cubage = cubage;
            next();
        }
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
        req.cubage.deleted = true;
        req.cubage.save().then(() => {
            res.send({
                msg: `La cubicación ha sido deshabilitada`
            });

        })
            .catch(err => {
                res.json({
                    msg: err
                })
            })
    }
};
