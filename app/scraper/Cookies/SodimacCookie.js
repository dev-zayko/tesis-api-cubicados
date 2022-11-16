'use strict';
require('dotenv').config();
const axios = require('axios')
const _ = require("underscore");

module.exports = class SodimacCookie {

    /**
     *
     * @param {*} region
     * @param {*} city
     */
    constructor(region, city) {
        this.region = region;
        this.city = city;
    }
    /**
     *
     * @returns
     */
    async init() {
        let region_data = await this.getRegionByName(await this.getRegions(), this.region);
        let city_data = await this.getCityByName(await this.getCities(region_data['politicalId']), this.city);
        let structured_data = await this.getStructuredData(city_data, region_data["id"]);
        return await this.getCookieArray(structured_data);
    }

//region AXIOS DATA FUNCTIONS
    /**
     *
     * @returns
     */
    async getRegions() {
        return (await axios.get(`${process.env.SODIMAC_REGIONS_URL}`))["data"]["data"];
    }
    /**
     *
     * @param {*} data
     * @param {string} region
     * @returns
     */
    async getRegionByName(data, region) {
        let regionFormat = await this.matchingRegion(data, region);
        return _.where(data, {name: regionFormat[0].name})[0];
    }
    async matchingRegion(regiones, userRegion) {
        let res = new RegExp(userRegion, 'gi');
        let result = [];
        regiones.map((item) => {
            if (item.name.match(res) !== null) {
                result.push({
                   name: item.name,
                   politicalId: item.politicalId
                });
            }
        });
        return result;
    }
    /**
     *
     * @param {*} politicalId
     * @returns
     */
    async getCities(politicalId) {
        return (await axios.get(`${process.env.SODIMAC_CITIES_URL}${politicalId}`))["data"]["data"];
    }

    async getCityByName(data, city) {
        return _.where(data, {name: city})[0];
    }

//endregion

//region HELPER FUNCTIONS
    /**
     *
     * @param {*} filtered_data
     * @param {*} region_code
     * @returns
     */
    async getStructuredData(filtered_data, region_code) {

        return {
            "IS_ZONE_SELECTED": "true",
            "priceGroupId": filtered_data["priceGroupId"],
            "politicalId": filtered_data["politicalId"],
            "userSelectedZone": "userselected",
            "zoneData": await this.convertToBase64String(filtered_data["name"], region_code),
            "zones": `[${filtered_data["zones"]}]`
        }

    }
    /**
     *
     * @param {*} zone_name
     * @param {*} region_code
     * @returns
     */
    async convertToBase64String(zone_name, region_code) {
        let aux_json = {"zoneID": region_code, "zoneName": zone_name};
        return Buffer.from(JSON.stringify(aux_json)).toString("base64");
    }
    /**
     *
     * @param {*} structured_data
     * @returns
     */
    async getCookieArray(structured_data) {
        return [
            {
                name: 'IS_ZONE_SELECTED',
                value: structured_data["IS_ZONE_SELECTED"],
                domain: '.falabella.com'
            },
            {
                name: 'priceGroupId',
                value: structured_data["priceGroupId"],
                domain: '.falabella.com'
            },
            {
                name: 'politicalId',
                value: structured_data["politicalId"],
                domain: '.falabella.com'
            },
            {
                name: 'userSelectedZone',
                value: structured_data["userSelectedZone"],
                domain: '.falabella.com'
            },
            {
                name: 'zoneData',
                value: structured_data["zoneData"],
                domain: '.falabella.com'
            },
            {
                name: 'zones',
                value: structured_data["zones"],
                domain: '.falabella.com'
            },
        ]
    }

//endregion

}
