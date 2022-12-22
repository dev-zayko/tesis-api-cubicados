const {
    Users,
    Memberships,
    UserStatus,
    UserLogins
} = require('../models/index')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/AuthConfig')
const transporter = require('../utils/Mailer');
const pug = require("pug");
const {uuid} = require('uuidv4');


module.exports = {
    //Inicio de sesión
    async login(req, res, next) {
        //Buscar usuario

        await Users.findOne({
            include: [{
                model: Memberships,
                as: 'memberships',
                required: true
            },
            {
                model: UserStatus,
                as: 'user_status',
                required: true
            }
            ],
            where: {
                email: req.body.email
            },
        })
            .then(user => {
                if (!user) {
                    res.send({
                        status: 'empty',
                        data: 0
                    })
                } else {
                    bcrypt.compare(req.body.password, user.password, (err, data) => {
                        if (err) throw err
                        if (data) {
                            switch (user.profile_id) {
                                case 1:
                                    res.json({
                                        status: 'isAdmin',
                                        msg: 'Usted es admin favor de ingresar en la pagina'
                                    })
                                    break;
                                case 2:
                                    UserLogins.create({
                                        user_id: user.id,
                                        ip: req.body.ip,
                                        user_agent: req.body.userAgent,
                                        type_of_device: 'Mobile',
                                        browser_name: 'Aplication Cubicados',
                                        operating_system: 'Android ' + req.body.systemVersion,
                                        device_name: req.body.deviceName
                                    });
                                    let verified;
                                    let token = jwt.sign({
                                        user: user
                                    }, authConfig.secret, {
                                        expiresIn: authConfig.expires
                                    });
                                    if (user.email_verified_at === null || isNaN(user.email_verified_at)) {
                                        verified = false
                                    } else {
                                        verified = true
                                    }
                                    res.json({
                                        status: 'isClient',
                                        verified: verified,
                                        token: token
                                    });
                                    break;
                            }
                        } else {
                            res.json({
                                status: 'incorrect',
                                msg: 'Contraseña Incorrecta'
                            })
                        }

                    })
                }
            })
            .catch(err => {
                res.status(500).json(err)
            })
    },
    async get(req, res, next) {
        await Users.findOne({
            where: {
                email: req.body.email,
            }
        })
            .then(user => {
                if (user) {
                    res.json({
                        status: 'duplicated',
                        msg: 'ya hay un usuario registrado con este correo'
                    })
                } else {
                    req.users = user;
                    next();
                }
            })
            .catch(err => {
                console.log('=============')
                console.log(err)
                console.log('=============')
                res.status(500).send({
                    error: err,
                    message: 'Ha ocurrido un error'
                })
            })
    },
    //Registro
    async register(req, res) {
        //Encriptamos clave
        let password = bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds));
        const names = (req.body.names).split(' ');
        const lastNames = (req.body.lastNames).split(' ');
        await Users.create({
            email: req.body.email,
            first_name: names[0],
            second_name: names[1],
            father_last_name: lastNames[0],
            mother_last_name: lastNames[1],
            phone: req.body.phone,
            birthday: req.birthday,
            password: password,
        }).then((user) => {
            //Creamos el token
            let token = jwt.sign({
                user: user
            }, authConfig.secret, {
                expiresIn: authConfig.expires
            });
            res.json({
                status: 'success',
                token: token
            });
        }).catch(error => {
            console.log(error);
            res.status(500).json(error)
        });
    },
    async getStatus(req, res, next) {
        let id = req.user.id;
        await Users.findOne({
            include: [{
                model: Memberships,
                as: 'memberships',
                required: true
            },
            {
                model: UserStatus,
                as: 'user_status',
                required: true
            }
            ],
            where: {
                id: id
            }
        }).then((user) => {
            let verified;
            let token = jwt.sign({
                user: user
            }, authConfig.secret, {
                expiresIn: authConfig.expires
            });
            if (user.email_verified_at === null) {
                verified = false
            } else {
                verified = true
            }
            res.json({
                status: 'isClient',
                verified: verified,
                token: token
            });

        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
    },
    async editPhone(req, res, next) {
        let newPhone = req.body.newPhone
        await Users.update({
            phone: newPhone,
        }, {
            where: {
                id: req.user.id
            }
        }).then((response) => {
            next();
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
    },
    async editPassword(req, res, next) {
        let password = bcrypt.hashSync(req.body.passwordMatch, Number.parseInt(authConfig.rounds));
        await Users.update({
            password: password,
        }, {
            where: {
                id: req.user.id
            }
        }).then((response) => {
            next();
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });

    },
    async sendEmailVerification(req, res, next) {
        try {
            const uuidV4 = uuid();
            const userSearch = await Users.update({
                email_token: uuidV4,
            }, {
                where: {
                    email: req.body.email
                }
            });
            console.log(userSearch)
            await transporter.sendMail({
                from: 'Cubicados Verificación <notificaciones@cubicados.cl>',
                to: req.body.email,
                subject: 'Verifica tu cuenta',
                html: pug.renderFile('app/views/email-verification.pug', {name: req.body.name, token: uuidV4}),
            });
            res.sendStatus(200);
        } catch (error) {
            console.log(error.message)
        }

    },
    async confirmEmail(req, res, next) {
        req.user
        await Users.update({
            email_verified_at: Date.now()
        }, {
            where: {
                id: req.user.id
            }
        }).then((response) => {
            res.send({
                status: response
            });
        }).catch((error) => {
            res.send({
                status: error
            })
        })
    },
}
