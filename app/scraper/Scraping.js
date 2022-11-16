'use strict';
require('dotenv').config();
const axios = require('axios');
const construmartCookie = require('./Cookies/ConstrumartCookie');
const SodimacCookie = require('./Cookies/SodimacCookie');
const puppeteer = require('puppeteer');
const _ = require("underscore");

module.exports = {
    async tipoProductos(req, res, next) {
        switch (req.query.tipoProducto) {
            case 'Esmalte al agua':
                req.urlProductoSodimac = process.env.SODIMAC_P_ESMALTE_URL;
                req.urlProducto = process.env.CONSTRUMART_P_ESMALTE_URL;
                req.region = req.query.region;
                req.local = req.query.local;
                next();
                break;
            case 'Latex':
                req.urlProductoSodimac = process.env.SODIMAC_P_LATEX_URL;
                req.urlProducto = process.env.CONSTRUMART_P_LATEX_URL
                req.region = req.query.region;
                req.local = req.query.local;
                next();
                break;
            case 'Esmalte sintético':
                req.urlProductoSodimac = process.env.SODIMAC_P_SINTETICO_URL;
                req.urlProducto = process.env.CONSTRUMART_P_SINTETICO_URL;
                req.region = req.query.region;
                req.local = req.query.local;
                next();
                break;
            case 'Óleo':
                req.urlProductoSodimac = process.env.SODIMAC_P_OLEO_URL;
                req.urlProducto = process.env.CONSTRUMART_P_OLEO_URL;
                req.region = req.query.region;
                req.local = req.query.local;
                next();
                break;
            case 'Cemento':
                req.urlProductoSodimac = process.env.SODIMAC_CEMENTO_URL
                req.urlProducto = process.env.CONSTRUMART_CEMENTO_URL
                req.region = req.query.region;
                req.local = req.query.local;
                next();
                break;
        }
    },
    /**
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    async scrapProductoSodimac(req, res, next) {
        try {
            let url = req.urlProductoSodimac
            const browser = await puppeteer.launch({
                "headless": true
            });
            let datos = [];
            const page = await browser.newPage();
            let region = req.region;
            let ciudad = req.local;
            await page.goto(url);
            let sc = new SodimacCookie(region, ciudad);
            await page.setCookie(...await sc.init());
            await page.goto(url);
            await page.cookies(url);
            let urlNueva = page.url();
            const manyData = async function () {
                datos = await page.evaluate(async (region, ciudad) => {
                    let results = [];
                    let items = document.querySelectorAll('.jsx-4001457643.search-results-2-grid.grid-pod');
                    items.forEach((item) => {
                        results.push({
                            linkProducto: item.querySelectorAll('.jsx-3128226947')[1].getAttribute('href'),
                            marca: item.querySelectorAll('.jsx-1327784995')[5].innerText,
                            titulo: item.querySelectorAll('.jsx-1327784995')[7].innerText,
                            precio: item.querySelectorAll('.jsx-1327784995')[9].children[0].innerText.replace('$ ', '$'),
                            imagen: item.querySelectorAll('.jsx-3128226947')[1].children[0].getAttribute('src'),
                            tienda: 'Sodimac',
                            region: region,
                            ciudad: ciudad
                        });
                    });
                    return results;
                }, region, ciudad);
                res.json(
                    datos
                );
            };
            const onlyData = async function (url) {
                datos = await page.evaluate(async (url, region, ciudad) => {
                    let results = [];
                    let items = document.querySelectorAll('.jsx-133031097.productContainer');
                    items.forEach((item) => {
                        results.push(...{
                            linkProducto: url,
                            marca: item.querySelector('.jsx-3572928369.product-brand-link').innerText,
                            titulo: item.querySelector('.jsx-3686231685.product-name.fa--product-name').innerText,
                            precio: item.querySelector('.jsx-2797633547.cmr-icon-container').innerText.replace('$ ', '$'),
                            imagen: item.querySelector('#testId-pod-image-SodimacCL_3267326_01').getAttribute('src'),
                            tienda: 'Sodimac',
                            region: region,
                            ciudad: ciudad
                        });
                    });
                    return results;
                }, url, region, ciudad);
                res.json(
                    datos
                );
            }
            await page.exposeFunction('onlyData', onlyData);
            await page.exposeFunction('manyData', manyData);
            if (urlNueva !== url) {
                await onlyData(urlNueva), region, ciudad;
            } else if (urlNueva === url) {
                await manyData(region, ciudad);
            }
            await page.close();
            await browser.close();

        } catch (error) {
            console.log(error)
            res.send({
                status: 'error',
                message: 'Parece que se les acabo el stock',
                error: error.message
            })
        }
    },
    /**
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    async scrapProductoConstrumart(req, res, next) {
        try {
            const browser = await puppeteer.launch({
                "headless": true
            });
            let datos = [];
            let url = req.urlProducto
            const page = await browser.newPage();
            //region local, centro esto valores se recibiran por medio del request
            let region = ''
            let local = '';
            region = req.region;
            local = req.local;
            await page.goto(url);
            let sc = new construmartCookie(region, local);
            let cookie = await sc.init();
            if (cookie === 'error') {
                res.json({
                    Construmart: 'Bad Location',
                    message: 'Esta tienda no se encuentra en tu ubicación'
                })
            } else {
                await page.setCookie(...await sc.init());
                await page.goto(url);
                await page.waitForTimeout(4000);
                await page.cookies(url);
                await page.waitForTimeout(6000);
                datos = await page.evaluate(async (region, local) => {
                    let results = [];
                    let items = document.querySelectorAll('.vtex-search-result-3-x-galleryItem.vtex-search-result-3-x-galleryItem--small.pa4');
                    items.forEach((item) => {
                        let link = item.querySelector('.vtex-product-summary-2-x-clearLink.vtex-product-summary-2-x-clearLink--shelf-home-desktop.h-100.flex.flex-column').getAttribute('href');
                        let marca = item.querySelector('.vtex-product-summary-2-x-productBrandContainer').innerText;
                        let titulo = item.querySelector('.vtex-product-summary-2-x-productNameContainer.mv0.vtex-product-summary-2-x-nameWrapper.overflow-hidden.c-on-base.f5').innerText;
                        let imagen = item.querySelector('.vtex-product-summary-2-x-imageNormal.vtex-product-summary-2-x-image').getAttribute('src');
                        let precio = item.querySelector('.vtex-add-to-cart-button-0-x-buttonText').innerText === 'ICON' ?
                            item.querySelector('.vtex-product-summary-2-x-currencyContainer.currencynode-hasnoperformance').innerText :
                            item.querySelector('.vtex-add-to-cart-button-0-x-buttonText').innerText === 'SIN STOCK' && 'SIN STOCK';

                        let retiro = item.querySelectorAll('.construmartcl-custom-availability-display-0-x-iconsContainer')[0].children[0].children[0].getAttribute('src') ===
                            'https://construmartcl.vtexassets.com/_v/public/assets/v1/published/construmartcl.custom-availability-display@0.0.30/public/react/5bee43fdc39b48e56e793482c120d939.svg' ?
                            'No disponible' : 'Disponible para retiro';

                        let despacho = item.querySelectorAll('.construmartcl-custom-availability-display-0-x-iconsContainer')[0].children[1].children[0].getAttribute('src') ===
                            'https://construmartcl.vtexassets.com/_v/public/assets/v1/published/construmartcl.custom-availability-display@0.0.30/public/react/cac8e743f8e575edf9dda18311714292.svg' ?
                            'No disponible' : 'Disponible para despacho';
                        //document.querySelectorAll(".construmartcl-custom-availability-display-0-x-iconsContainer")[0].children[1].children[0].getAttribute('src')
                        results.push({
                            linkProducto: 'https://www.construmart.cl' + link,
                            marca: marca,
                            titulo: titulo,
                            imagen: imagen,
                            precio: precio,
                            retiro: retiro,
                            despacho: despacho,
                            tienda: 'Construmart',
                            region: region,
                            ciudad: local
                        })
                    })
                    return results
                }, region, local)

                res.json(
                    datos
                );
                await page.close();
                await browser.close();
            }
        } catch (e) {
            res.send({
                status: 'error',
                message: 'Parece que se les acabo el stock',
                error: error.message
            })
        }
    }
}