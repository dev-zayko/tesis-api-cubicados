const {
    Membresias,
    Usuarios,
    MembresiasPagadas
} = require('../models/index');
const {
    Op
} = require("sequelize");
const {
    response
} = require('express');
const moment = require('moment');

module.exports = {
    async getAll(req, res, next) {
        await Membresias.findAll({
            where: {
                idMembresia: {
                    [Op.gt]: 1
                },
                vigente: true
            }
        }).then((response) => {
            res.send({
                data: response
            })
        }).catch((err) => {
            res.sendStatus(500);
        });
    },
    async upMembership(req, res, next) {
        let idUsuario = req.user.idUsuario;
        let idMembresia = req.idMembresia;
        await Usuarios.update({
            idMembresia: idMembresia,
            idEstadoUsuario: 1,
            fechaMembresia: req.fechaMembresia
        }, {
            where: {
                idUsuario: idUsuario
            }
        }).then((response) => {
        
            next();
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
    },
    async addDate(req, res, next) {
        let date = await Membresias.findOne({
            where: {
                idMembresia: req.idMembresia
            }
        });
        let datemp = await MembresiasPagadas.findOne({
            where: {
                idMembresiaPagada: req.idMembresiaPagada
            }
        });
        req.fechaMembresia = moment(datemp.create_at, 'DD-MM-YYYY').add('days', date.dias)
        next();
    },
    async restDays(req, res, next) {
        let now = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log(now);
        let fecha = moment(req.user.fechaMembresia).format('YYYY-MM-DD HH:mm:ss');
        let time = moment(now).diff(fecha, 'days')
        res.send({
            diasRestantes: time
        })
    }

}