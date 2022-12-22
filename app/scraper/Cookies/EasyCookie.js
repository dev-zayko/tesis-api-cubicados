'use strict';
require('dotenv').config();
const axios = require('axios')
const _ = require("underscore");

module.exports = class EasyCookie {

    /**
     *
     * @param {*} region
     * @param {*} ciudad
     */
    constructor(region) {
        this.region = region;
        this.error = 'error';
    }

    /**
     *
     * @returns
     */
    async init() {
        return await this.getCookieArray();

    }

    //region AXIOS DATA FUNCTIONS

    async getTiendaByCity(ciudad) {
        let urlFormat = process.env.EASY_REGION_COMUNA_UR.replace('*', `"${ciudad}"`);
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
     * @returns
     */
    async getCookieArray() {
        return [
            {
                "name": "_hjAbsoluteSessionInProgress",
                "value": "0",
                "domain": ".easy.cl",
                "hostOnly": false,
                "path": "/",
                "secure": true,
                "httpOnly": false,
                "sameSite": "lax",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1671591599,
                "storeId": null
            },
            {
                "name": "_gid",
                "value": "GA1.2.1350521752.1671581413",
                "domain": ".easy.cl",
                "hostOnly": false,
                "path": "/",
                "secure": false,
                "httpOnly": false,
                "sameSite": "no_restriction",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1671677221,
                "storeId": null
            },
            {
                "name": "vtex_session",
                "value": "eyJhbGciOiJFUzI1NiIsImtpZCI6IjkzODUxNTBDOUEzQUI1MDI3MzVCRUJGRTIyNzU2REY4QUYwMzcyMEIiLCJ0eXAiOiJqd3QifQ.eyJhY2NvdW50LmlkIjoiZDA3NjZjZTAtY2MzYS00MDg5LThlYzItNmYzYzk2N2NmOTBmIiwiaWQiOiJhZGQzMGVkMi02NWI2LTQwMjgtYjRiOC1kZTk3NDNjNDQ4MDQiLCJ2ZXJzaW9uIjoyMSwic3ViIjoic2Vzc2lvbiIsImFjY291bnQiOiJzZXNzaW9uIiwiZXhwIjoxNjcyMjgxMTE1LCJpYXQiOjE2NzE1ODk5MTUsImlzcyI6InRva2VuLWVtaXR0ZXIiLCJqdGkiOiIzZTEzZDcyNC00ZWMzLTQ3N2MtOGZiOC01OTJjNzM5ZTdkOTEifQ.tubo90PmW-oNyKwVbT5AuL7Z6swHZOJvT6MdsU5A8iVSXS8JTa4iUPBYA9xJN09KG5zUNk_OM1geibUQ5y9LhQ",
                "domain": "www.easy.cl",
                "hostOnly": true,
                "path": "/",
                "secure": true,
                "httpOnly": true,
                "sameSite": "no_restriction",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1672022816,
                "storeId": null
            },
            {
                "name": "biggy-anonymous",
                "value": "ONSvbPygPy6vgPhYAq2i8",
                "domain": ".easy.cl",
                "hostOnly": false,
                "path": "/",
                "secure": false,
                "httpOnly": false,
                "sameSite": "no_restriction",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1703126816,
                "storeId": null
            },
            {
                "name": "vtex_segment",
                "value": "eyJjYW1wYWlnbnMiOm51bGwsImNoYW5uZWwiOiIxIiwicHJpY2VUYWJsZXMiOm51bGwsInJlZ2lvbklkIjoidjIuMEFGMEQxNDExMEJGQzA3RTZFMUM0NTRBQzJDOTQwMDMiLCJ1dG1fY2FtcGFpZ24iOm51bGwsInV0bV9zb3VyY2UiOm51bGwsInV0bWlfY2FtcGFpZ24iOm51bGwsImN1cnJlbmN5Q29kZSI6IkNMUCIsImN1cnJlbmN5U3ltYm9sIjoiJCIsImNvdW50cnlDb2RlIjoiQ0hMIiwiY3VsdHVyZUluZm8iOiJlcy1DTCIsImNoYW5uZWxQcml2YWN5IjoicHVibGljIn0",
                "domain": "www.easy.cl",
                "hostOnly": true,
                "path": "/",
                "secure": true,
                "httpOnly": true,
                "sameSite": "no_restriction",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1672022816,
                "storeId": null
            },
            {
                "name": "checkout.vtex.com",
                "value": "__ofid=312d11043a724f0db7b99d12682ed976",
                "domain": ".www.easy.cl",
                "hostOnly": false,
                "path": "/",
                "secure": false,
                "httpOnly": false,
                "sameSite": "no_restriction",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1687142818,
                "storeId": null
            },
            {
                "name": "VtexRCMacIdv7",
                "value": "dab593eb-986c-4e06-b76f-4f828b891727",
                "domain": ".www.easy.cl",
                "hostOnly": false,
                "path": "/",
                "secure": false,
                "httpOnly": false,
                "sameSite": "no_restriction",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1703126817,
                "storeId": null
            },
            {
                "name": "_hjSessionUser_197203",
                "value": "eyJpZCI6ImRiYjE0NmNiLWI5ZmItNTJiNi04ZTk0LTljYzUxNDRjMDZlNCIsImNyZWF0ZWQiOjE2NzE1ODE0MTM4MzQsImV4aXN0aW5nIjp0cnVlfQ==",
                "domain": ".easy.cl",
                "hostOnly": false,
                "path": "/",
                "secure": true,
                "httpOnly": false,
                "sameSite": "lax",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1703126816,
                "storeId": null
            },
            {
                "name": "_hjIncludedInSessionSample",
                "value": "0",
                "domain": "www.easy.cl",
                "hostOnly": true,
                "path": "/",
                "secure": true,
                "httpOnly": false,
                "sameSite": "lax",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1671590936,
                "storeId": null
            },
            {
                "name": "vtex_binding_address",
                "value": "easycl.myvtex.com/",
                "domain": "www.easy.cl",
                "hostOnly": true,
                "path": "/",
                "secure": false,
                "httpOnly": false,
                "sameSite": "no_restriction",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1703126816,
                "storeId": null
            },
            {
                "name": "biggy-event-queue",
                "value": "",
                "domain": ".easy.cl",
                "hostOnly": false,
                "path": "/",
                "secure": false,
                "httpOnly": false,
                "sameSite": "no_restriction",
                "session": true,
                "firstPartyDomain": "",
                "partitionKey": null,
                "storeId": null
            },
            {
                "name": ".ASPXAUTH",
                "value": "276FA9F0C30A59091558FC3504A402EC6AC3F91083526671D7FF293E17E0D2CAF55F3735DD0B0FFAD71ECD31FB560211C008F6765CD5139BEB0996883048FA33AEEEDBF7E45BFEC77608177852808F061A8DED77BC5FFCC920B9F8BC5CAD3FB15D0AE07816468E423280CB90FAC5D2D90E18F12D0550894F1EBD5DA00044451771A9032172C222F7E42FEA3297D320652BD7481848708D6470C0BBD4C25BFE0A43BEA6B9",
                "domain": "www.easy.cl",
                "hostOnly": true,
                "path": "/",
                "secure": false,
                "httpOnly": true,
                "sameSite": "lax",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1734653415,
                "storeId": null
            },
            {
                "name": "biggy-session-easycl",
                "value": "BhJGyvlyKhASZzOTuoziu",
                "domain": ".easy.cl",
                "hostOnly": false,
                "path": "/",
                "secure": false,
                "httpOnly": false,
                "sameSite": "no_restriction",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1671592616,
                "storeId": null
            },
            {
                "name": "_gcl_au",
                "value": "1.1.388517903.1671581412",
                "domain": ".easy.cl",
                "hostOnly": false,
                "path": "/",
                "secure": false,
                "httpOnly": false,
                "sameSite": "no_restriction",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1679357412,
                "storeId": null
            },
            {
                "name": "_fbp",
                "value": "fb.1.1671581415702.968431802",
                "domain": ".easy.cl",
                "hostOnly": false,
                "path": "/",
                "secure": false,
                "httpOnly": false,
                "sameSite": "no_restriction",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1679366821,
                "storeId": null
            },
            {
                "name": "_ga",
                "value": "GA1.2.1652673923.1671581412",
                "domain": ".easy.cl",
                "hostOnly": false,
                "path": "/",
                "secure": false,
                "httpOnly": false,
                "sameSite": "no_restriction",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1734662821,
                "storeId": null
            },
            {
                "name": "_ga_868779W5VT",
                "value": "GS1.1.1671586661.3.1.1671590821.45.0.0",
                "domain": ".easy.cl",
                "hostOnly": false,
                "path": "/",
                "secure": false,
                "httpOnly": false,
                "sameSite": "no_restriction",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1734662821,
                "storeId": null
            },
            {
                "name": "_gac_UA-2869719-1",
                "value": "1.1671588415.Cj0KCQiA14WdBhD8ARIsANao07iGgFOikaPP6E-_4_WYeggO8dXWSj9WgftEYj2esNZljPIeNKswm0EaAqlaEALw_wcB",
                "domain": ".easy.cl",
                "hostOnly": false,
                "path": "/",
                "secure": false,
                "httpOnly": false,
                "sameSite": "no_restriction",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1679364415,
                "storeId": null
            },
            {
                "name": "_gac_UA-2869719-14",
                "value": "1.1671588412.Cj0KCQiA14WdBhD8ARIsANao07iGgFOikaPP6E-_4_WYeggO8dXWSj9WgftEYj2esNZljPIeNKswm0EaAqlaEALw_wcB",
                "domain": ".easy.cl",
                "hostOnly": false,
                "path": "/",
                "secure": false,
                "httpOnly": false,
                "sameSite": "no_restriction",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1679364412,
                "storeId": null
            },
            {
                "name": "_gat_UA-2869719-1",
                "value": "1",
                "domain": ".easy.cl",
                "hostOnly": false,
                "path": "/",
                "secure": false,
                "httpOnly": false,
                "sameSite": "no_restriction",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1671590866,
                "storeId": null
            },
            {
                "name": "_gat_UA-2869719-14",
                "value": "1",
                "domain": ".easy.cl",
                "hostOnly": false,
                "path": "/",
                "secure": false,
                "httpOnly": false,
                "sameSite": "no_restriction",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1671590877,
                "storeId": null
            },
            {
                "name": "_gcl_aw",
                "value": "GCL.1671588411.Cj0KCQiA14WdBhD8ARIsANao07iGgFOikaPP6E-_4_WYeggO8dXWSj9WgftEYj2esNZljPIeNKswm0EaAqlaEALw_wcB",
                "domain": ".easy.cl",
                "hostOnly": false,
                "path": "/",
                "secure": false,
                "httpOnly": false,
                "sameSite": "no_restriction",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1679364411,
                "storeId": null
            },
            {
                "name": "_hjSession_197203",
                "value": "eyJpZCI6IjgxYjE4YWEyLTJhNDUtNDQzOC04M2VjLTFkYTE2NTVkMzhhNSIsImNyZWF0ZWQiOjE2NzE1ODY2NjE0NjcsImluU2FtcGxlIjpmYWxzZX0=",
                "domain": ".easy.cl",
                "hostOnly": false,
                "path": "/",
                "secure": true,
                "httpOnly": false,
                "sameSite": "lax",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1671592616,
                "storeId": null
            },
            {
                "name": "biggy-search-history",
                "value": "cemento%20especial",
                "domain": "www.easy.cl",
                "hostOnly": true,
                "path": "/",
                "secure": false,
                "httpOnly": false,
                "sameSite": "no_restriction",
                "session": true,
                "firstPartyDomain": "",
                "partitionKey": null,
                "storeId": null
            },
            {
                "name": "janus_sid",
                "value": "2217e4b7-3017-4948-af6b-e4dbf160c4e9",
                "domain": ".www.easy.cl",
                "hostOnly": false,
                "path": "/",
                "secure": false,
                "httpOnly": false,
                "sameSite": "lax",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1671841011,
                "storeId": null
            },
            {
                "name": "VtexRCSessionIdv7",
                "value": "2c57728b-805e-4269-8d4d-fb94c21b57b4",
                "domain": ".www.easy.cl",
                "hostOnly": false,
                "path": "/",
                "secure": false,
                "httpOnly": false,
                "sameSite": "no_restriction",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1671592617,
                "storeId": null
            },
            {
                "name": "VtexWorkspace",
                "value": "master%3A-",
                "domain": "www.easy.cl",
                "hostOnly": true,
                "path": "/",
                "secure": true,
                "httpOnly": false,
                "sameSite": "no_restriction",
                "session": false,
                "firstPartyDomain": "",
                "partitionKey": null,
                "expirationDate": 1674173305,
                "storeId": null
            }
        ]
    }

    //endregion

}