'use strict';
require('dotenv').config();
const axios = require('axios')
const _ = require("underscore");

module.exports = class ConstrumartCookie {

    /**
     *
     * @param {*} region
     * @param {*} ciudad
     */
    constructor(region, ciudad) {
        this.region = region;
        this.ciudad = ciudad;
        this.error = 'error';
    }

    /**
     *
     * @returns
     */
    async init() {
        let tienda = await this.getTiendaByCity(this.ciudad);
        let structuredData = await this.getStructuredData(tienda[0]);
    
        return await this.getCookieArray(structuredData);


    }

    //region AXIOS DATA FUNCTIONS

    async getTiendaByCity(ciudad) {
        let urlFormat = process.env.CONSTRUMART_TIENDA_URL.replace('*', `"${ciudad}"`);
       return (await axios.get(urlFormat))["data"];
    }
    /**
     *
     * @param {string} region
     * @returns
     */
    async convertToBase64String(region) {
        let regionId = 'SW#construmartcl' + region.toLowerCase().replace(' ', '');
        let formatRegion = Buffer.from(regionId).toString("base64");
        let aux_json = {
            "campaigns": null,
            "channel": "1",
            "priceTables": null,
            "regionId": formatRegion,
            "utm_campaign": null,
            "utm_source": null,
            "utmi_campaign": null,
            "currencyCode": "CLP",
            "currencySymbol": "$",
            "countryCode": "CHL",
            "cultureInfo": "es-CL",
            "channelPrivacy": "public"
        };
        return Buffer.from(JSON.stringify(aux_json)).toString("base64");
    }

    //endregion

    //region HELPER FUNCTIONS
    /**
     *
     * @param {string} filterRegion
     * @param {string} filterCiudad
     * @returns
     */
    async getStructuredData(filterTienda) {
        return {
            "WLName": filterTienda["local"],
            "tiendaSeleccionadaTienda": filterTienda["centro"],
            "tiendaSeleccionadaRegion": filterTienda["region"],
            "vtex_segment": await this.convertToBase64String(filterTienda["local"]),
        }
    }

    /**
     *
     * @param {*} structured_data
     * @returns
     */
    async getCookieArray(structured_data) {
        return [{
                name: 'WLName',
                value: structured_data["WLName"],
                domain: 'www.construmart.cl'
            },
            {
                name: 'tiendaSeleccionadaTienda',
                value: structured_data["tiendaSeleccionadaTienda"],
                domain: 'www.construmart.cl'
            },
            {
                name: 'tiendaSeleccionadaRegion',
                value: structured_data["tiendaSeleccionadaRegion"],
                domain: 'www.construmart.cl'
            },
            {
                name: 'vtex_segment',
                value: structured_data["vtex_segment"],
                domain: 'www.construmart.cl'
            },

        ]
    }

    //endregion

}