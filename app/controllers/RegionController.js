'use strict';
const axios = require('axios');
const {
    Region
} = require('../models/index')
const ConstrumartUbicacion = require('../scraper/json/ConstrumartUbicacion.json')
const SodimacUbicacion = require('../scraper/json/SodimacUbicacion.json');
const SodimacCookie = require('../scraper/Cookies/SodimacCookie');
module.exports = {
    async getAll(req, res) {
        await Region.findAll()
            .then(region => {
                res.send(region);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || 'Se produjo un error al recuperar las regiones'
                })
            })
    },
    async getCiudadSodimac(req, res) {
        const sc = new SodimacCookie();
        let regiones = SodimacUbicacion;
        let result;
        let resp = [];
        let regionFormat = new RegExp(req.query.region, 'gi');
        regiones.map((item) => {
            if (item.name.match(regionFormat) !== null) {
                result = item.politicalId;
            }
        });

        sc.getCities(result).then(response => {
            response.map(item => {
                resp.push({
                    ciudad: item.name
                });
            });
            res.send(resp);
        });

    },
    async getRegionConstrumart(req, res) {
        res.send(ConstrumartUbicacion)
    },
    async getCiudadConstrumart(req, res) {
        // let regiones = (await axios.get(process.env.CONSTRUMART_REGION_URL))["data"];
        let regiones = ConstrumartUbicacion;
        let regionFormat = new RegExp(req.query.region, 'gi');
        let result = [];
        regiones.map((item) => {
            if (item.region.match(regionFormat) !== null) {
                console.log(item.ciudad)
                result.push({
                    ciudad: item.ciudad
                });
            }
        });

        res.send(result);
        //     let url = ('https://www.construmart.cl/api/dataentities/ST/search?_where=region=*&_fields=ciudad').replace('*', '"'+result+'"')
        //     await axios.get(url)
        //    .then(response => {
        //       console.log(response.data)
        //    }) 
    },
    async getById(req, res) {
        const idRegion = req.params.idRegion
        await Region.findAll({
                where: {
                    idRegion: idRegion,
                    vigente: true
                }
            })
            .then(region => {
                if (region.length === 0) {
                    res.send({
                        status: 'empty'
                    })
                } else {
                    res.send({
                        status: 'success',
                        data: region
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    error: err,
                    message: 'Error al obtener proyecto asociado la region'
                });
            });
    }
}