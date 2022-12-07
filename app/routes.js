const express = require('express');
const router = express.Router();
//Controllers
const AuthController = require('./controllers/AuthController');
const CommuneController = require('./controllers/ComunneController');
const ConstructionController = require('./controllers/ConstructionController');
const CubageController = require('./controllers/CubageController');
const RoomController = require('./controllers/RoomController');
const MaterialController = require('./controllers/MaterialController');
const ProjectsController = require("./controllers/ProjectsController");
const RegionController = require('./controllers/RegionController');
const Scraping = require('./scraper/Scraping');
const ConstructionTypeController = require('./controllers/ConstructionTypeController');
const StoreController = require('./controllers/StoreController');
const WebPayController = require('./controllers/WebPayController');
const MembershipsController = require('./controllers/MembershipsController');
const MembresiaPagadaController = require('./controllers/PaidMembershipsController');
const NotificactionController = require('./controllers/NotificactionController');
// Home
router.get('/', (req, res) => res.json({
    hello: "World"
}));

//Middlewares
const auth = require('./middlewares/Auth');
const checkToken = require('./middlewares/CheckToken');

//Permissions
const proyectoPolicy = require('./policies/ProyectoPolicy');
const HabitacionPolicy = require('./policies/HabitacionPolicy');
const CubagePolicy = require('./policies/CubagePolicy');
const AgePolicy = require('./policies/AgePolicy');
const UserPolicy = require('./policies/UserPolicy');
//axios
const axios = require("axios");


//#region Auth
router.post('/api/login', AuthController.login);
router.post('/api/register', AgePolicy.validateAdult, AuthController.get, AuthController.register);
router.post('/api/state/get', auth, AuthController.getStatus);
router.put('/api/update/phone', auth, AuthController.editPhone, AuthController.getStatus);
router.put('/api/update/password', auth, AuthController.editPassword, AuthController.getStatus);
//#endregion

//#region Mail
router.post('/api/mail/verification', AuthController.sendEmailVerification);
router.post('/api/mail/passing', auth, AuthController.confirmEmail);
router.post('/api/mail/status', UserPolicy.validateEmailVerify);
router.post('/api/mail/confirm', async (req, res) => {
    const token = req.body.token;
    await axios.post('http://localhost:3030/api/mail/passing', {}, {
        headers: {Authorization: `Bearer ${token}`}
    }).then((response) => {
        if (response.data === 1) {
            res.render('')
        }
    });
});
//#endmail

//#region Comunas
router.get('/api/communes/all', CommuneController.getAll);
router.post('/api/communes/match', CommuneController.getAll, CommuneController.matchingCommunes);
router.post('/api/communes/get', CommuneController.getById);
//#endregion

//#region Construcción
router.post('/api/construction/get', ConstructionController.getById)
//#endregion

//#region Proyecto
router.get('/api/project/all', auth, ProjectsController.getAll);
router.post('/api/project/store', auth, proyectoPolicy.add, ProjectsController.store);
router.post('/api/project/get', auth, ProjectsController.getById);
router.put('/api/project/update', auth, ProjectsController.find, proyectoPolicy.management, ProjectsController.update);
router.put('/api/project/delete', auth, ProjectsController.find, proyectoPolicy.management, ProjectsController.delete);
//#endregion

//#region Cubicacion
router.post('/api/cubage/store', auth, CubageController.store, RoomController.costAdjust, RoomController.getById, ProjectsController.find, ProjectsController.costAdjust);
router.post('/api/cubage/get', auth, CubageController.getById);
router.post('/api/cubage/police', auth, CubagePolicy.create);
router.post('/api/cubage/delete', auth, CubageController.delete);
//#endregion

//#region Habitacion
router.post('/api/room/store', auth, HabitacionPolicy.userAuth, HabitacionPolicy.add, RoomController.getById, RoomController.store);
router.post('/api/room/get', auth, RoomController.getById);
router.put('/api/room/delete', auth, RoomController.delete);
//#endregion


//#region Material
router.post('/api/materials/store', MaterialController.store);
//#endregion

//#region Membresias
router.get('/api/membership/all', MembershipsController.getAll);
router.post('/api/membership/days', auth, MembershipsController.restDays);
//#endregion

//#region membresias_pagadas
router.post('/api/membership/paid/all', auth, MembresiaPagadaController.getAll);
router.post('/api/membership/paid/store', auth, MembresiaPagadaController.store, MembershipsController.addDate, MembershipsController.upMembership);
//#endregion
//#region Region
router.get('/api/region/all', RegionController.getAll);
router.get('/api/region/construmart', RegionController.getRegionConstrumart);
router.post('/api/city/construmart', RegionController.getCiudadConstrumart);
router.post('/api/city/sodimac', RegionController.getCiudadSodimac);
//#endregion

//# region tienda
router.get('/api/store/all', StoreController.getAll);
//#enregion

//#region TipoConstruccion
router.get('/api/construction/type/all', ConstructionTypeController.getAll);
//#endregion

//#region Scrap
router.post('/api/scrap/sodimac/product', auth, Scraping.tipoProductos, Scraping.scrapProductoSodimac);
router.post('/api/scrap/construmart/product', auth, Scraping.tipoProductos, Scraping.scrapProductoConstrumart);
//#endregion

//#region count
router.post('/api/count/get', auth, ProjectsController.count, RoomController.count, CubageController.count);
//#endregion

//#region webpay
router.post('/api/webpay/create', auth, WebPayController.createTransaction);
router.get('/api/webpay/commit', WebPayController.commitTransaction);
router.post('/api/webpay/commit', WebPayController.commitTransaction);
router.post('/api/webpay/exit', (req, res) => {
    return res.json({
        message: 'Finalizo la transacción'
    })
});
//#endregion

module.exports = router;
