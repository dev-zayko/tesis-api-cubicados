'use strict';
require('dotenv').config();
const axios = require('axios');
const construmartCookie = require('./Cookies/ConstrumartCookie');
const SodimacCookie = require('./Cookies/SodimacCookie');
const puppeteer = require('puppeteer');
const _ = require("underscore");
const EasyCookie = require('./Cookies/EasyCookie');

module.exports = {
    async tipoProductos(req, res, next) {
        let typeProduct = req.body.typeProduct;
        req.region = req.body.region;
        req.local = req.body.local;
        switch (typeProduct) {
            case 'Esmalte al Agua':
                req.urlProductoSodimac = process.env.SODIMAC_P_ESMALTE_URL;
                req.urlProducto = process.env.CONSTRUMART_P_ESMALTE_URL;
                next();
                break;
            case 'Latex':
                req.urlProductoSodimac = process.env.SODIMAC_P_LATEX_URL;
                req.urlProducto = process.env.CONSTRUMART_P_LATEX_URL
                next();
                break;
            case 'Esmalte sintético':
                req.urlProductoSodimac = process.env.SODIMAC_P_SINTETICO_URL;
                req.urlProducto = process.env.CONSTRUMART_P_SINTETICO_URL;
                next();
                break;
            case 'Óleo':
                req.urlProductoSodimac = process.env.SODIMAC_P_OLEO_URL;
                req.urlProducto = process.env.CONSTRUMART_P_OLEO_URL;
                next();
                break;
            case 'Cemento':
                req.urlProductoSodimac = process.env.SODIMAC_CEMENTO_URL
                req.urlProducto = process.env.CONSTRUMART_CEMENTO_URL
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
            let url = req.urlProductoSodimac;
            const browser = await puppeteer.launch({
                "headless": true
            });
            let dataProduct = [];
            const viewPort = {width: 800, height: 1000};
            const page = await browser.newPage();
            await page.setViewport(viewPort);
            let region = req.region;
            let city = req.local;
            await page.goto(url);
            let sc = new SodimacCookie(region, city);
            await page.setCookie(...await sc.init());
            await page.goto(url);
            await page.cookies(url);
            let urlNew = page.url();
            const manyData = async function () {
                dataProduct = await page.evaluate(async (region, city) => {
                    let results = [];
                    let items = document.querySelectorAll('.jsx-4001457643.search-results-2-grid.grid-pod');
                    items.forEach((item, index) => {
                        results.push({
                            linkProduct: item.querySelectorAll('.jsx-3128226947')[1].getAttribute('href'),
                            tradeMark: item.querySelectorAll('.jsx-1327784995')[5].innerText.replaceAll('-', ' ').toUpperCase(),
                            title: item.querySelectorAll('.jsx-1327784995')[7].innerText,
                            price: item.querySelectorAll('.jsx-1327784995')[9].children[0].innerText.replace('$ ', '$'),
                            image: item.querySelectorAll('.jsx-3128226947')[1].children[0].getAttribute('src'),
                            store: 'Sodimac',
                            region: region,
                            city: city,
                        });
                    });
                    return results;
                }, region, city);
                res.json({
                    status: 'success',
                    data: dataProduct
                });
            };
            const onlyData = async function (url) {
                dataProduct = await page.evaluate(async (url, region, city) => {
                    let results = [];
                    let items = document.querySelectorAll('.jsx-2809497520.pdp-container');
                    items.forEach((item) => {
                        results.push({
                            linkProduct: url,
                            tradeMark: item.querySelector('.jsx-1874573512.product-brand.fa--brand.false').innerText.replaceAll('-', ' ').toUpperCase(),
                            title: item.querySelector('.jsx-1442607798.product-name.fa--product-name.false').innerText,
                            price: item.querySelector('.jsx-2797633547.cmr-icon-container').innerText.replace('$ ', '$'),
                            image: item.querySelectorAll('.jsx-4112511439.image-headline')[1]?.children[0]?.getAttribute('src'),
                            store: 'Sodimac',
                            region: region,
                            city: city
                        });
                    });
                    return results;
                }, url, region, city);
               
                if (Object.keys(dataProduct[0]).length === 7) {
                    res.json({
                        status: 'empty',
                        data: 0
                    });
                } else {
                    res.json({
                        status: 'success',
                        data: dataProduct
                    });
                }

            }
            await page.exposeFunction('manyData', manyData);
            await page.exposeFunction('onlyData', onlyData);
            if (urlNew !== url) {
                await onlyData(urlNew, region, city);
            } else if (urlNew === url) {
                if (req.body.typeProduct !== 'Cemento') {
                    await page.$eval('img[class="Footer-module_security-icon__3WQRT"]',
                        e => {e.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'end'})});
                    await page.waitFor(1000);
                    await page.$eval('button[id="testId-pagination-bottom-arrow-right"]',
                        e => {e.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'end'})});
                    await page.waitFor(1000);
                }
                await manyData(region, city);
            }
            await page.close();
            await browser.close();

        } catch (error) {
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
            let dataProduct = [];
            let url = req.urlProducto
            const page = await browser.newPage();
            //region local, centro esto valores se recibiran por medio del request
            let region = ''
            let city = '';
            region = req.region;
            city = req.local;
            await page.goto(url);
            let sc = new construmartCookie(region, city);
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
                dataProduct = await page.evaluate(async (region, city) => {
                    let results = [];
                    let items = document.querySelectorAll('.vtex-search-result-3-x-galleryItem.vtex-search-result-3-x-galleryItem--small.pa4');
                    items.forEach((item) => {
                        let linkProduct = item.querySelector('.vtex-product-summary-2-x-clearLink.vtex-product-summary-2-x-clearLink--shelf-home-desktop.h-100.flex.flex-column').getAttribute('href');
                        let tradeMark = item.querySelector('.vtex-product-summary-2-x-productBrandContainer').innerText.replaceAll('-', ' ').toUpperCase();
                        let title = item.querySelector('.vtex-product-summary-2-x-productNameContainer.mv0.vtex-product-summary-2-x-nameWrapper.overflow-hidden.c-on-base.f5').innerText;
                        let image = item.querySelector('.vtex-product-summary-2-x-imageNormal.vtex-product-summary-2-x-image').getAttribute('src');
                        let price = item.querySelector('.vtex-add-to-cart-button-0-x-buttonText').innerText === 'AGREGAR' ?
                            item.querySelector('.vtex-product-summary-2-x-currencyContainer.currencynode-hasnoperformance').innerText :
                            item.querySelector('.vtex-add-to-cart-button-0-x-buttonText').innerText === 'SIN STOCK' && 'SIN STOCK';
                        //document.querySelectorAll(".construmartcl-custom-availability-display-0-x-iconsContainer")[0].children[1].children[0].getAttribute('src')
                        if (price !== 'SIN STOCK') {
                            results.push({
                                linkProduct: 'https://www.construmart.cl' + linkProduct,
                                tradeMark: tradeMark,
                                title: title,
                                image: image,
                                price: price,
                                store: 'Construmart',
                                region: region,
                                city: city
                            });
                        }
                    });
                    return results
                }, region, city)
                if (dataProduct.length === 0) {
                    res.json({
                        status: 'empty',
                        data: 0
                    })
                } else {
                    res.json({
                        status: 'success',
                        data: dataProduct
                    });
                }
                await page.close();
                await browser.close();
            }
        } catch (error) {
            res.send({
                status: 'error',
                message: 'Parece que se les acabo el stock',
                error: error.message
            })
        }
    },
    async scrapProductoEasy(req, res, next) {
      try {
        const browser = await puppeteer.launch({
            "headless": false
        });
        let dataProduct = [];
        let url = process.env.EASY_CEMENTO_URL;
        const page = await browser.newPage();
        await page.goto(url);
        let region = 'Metropolitana de Santiago'
        let city = '';
        await page.waitForTimeout(6000);
        let ec = new EasyCookie(region);
        await page.waitForTimeout(6000);
        await page.setCookie(...await ec.init());
        await page.waitForTimeout(6000);
        await page.goto(url);
        await page.waitForTimeout(6000);
        await page.cookies(url);
        await page.waitForTimeout(6000);
        dataProduct = await page.evaluate(async (region, city) => {
            let results = [];
            let items = document.querySelectorAll('.vtex-product-summary-2-x-element.vtex-product-summary-2-x-element--gridLayout.pointer.pt3.pb4.flex.flex-column.h-100');
            items.forEach((item) => {
               results.push({
                linkProduct: 'https://www.easy.cl' + item.parentElement.getAttribute('href'),
                 trademark:  item.querySelector('.vtex-store-components-3-x-productBrandContainer.vtex-store-components-3-x-productBrandContainer--summaryBrandDesktop').innerText,
                 title: item?.querySelector('.vtex-product-summary-2-x-nameContainer.vtex-product-summary-2-x-nameContainer--summaryName.flex.items-start.justify-center.pv6').innerText,
                 image: item?.querySelectorAll('.dib.relative.vtex-product-summary-2-x-imageContainer.vtex-product-summary-2-x-imageStackContainer')[0].children[0].getAttribute('src'),
                 price: item.querySelector('.easycl-precio-cencosud-0-x-defaultHeight').innerText,
                 store: 'Easy',
            });
        });
            return results
        }, region, city);
        res.json({
            status: 'success',
            data: dataProduct
        });
      } catch (error) {
        res.send({
            status: 'success',
            data: error.message
        });
      }
    }
}
