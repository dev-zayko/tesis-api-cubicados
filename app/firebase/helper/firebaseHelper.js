'use-strict';
const admin = require('firebase-admin');
const serviceAccount = require('../json/cubicados-react-native-firebase-adminsdk-w37lt-0fc77fd27b.json');

module.exports = {
    async initializeAppFirebase(req, res, next) {
        if (!admin.apps.length) {
            const firebaseAdmin = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            req.admin = firebaseAdmin;
            next();
        } else {
            req.admin = admin;
            next();
        }
    },
    async sendMessageToApp(req, res, next) {
        const adminFireBase = req.admin;
        let title, body;
        switch (req.notify) {
            case 'payment': {
                title = 'Pago Realizado'
                body = `Se ha realizado el pago de ${req.netoAmount}`
                break;
            }
        }
        const message = {
            notification: {
                title: title,
                body: body
            },
            android: {
                notification: {
                    channelId: '77195440',
                }
            },
            token: req.body.tokenDevice
        };

        adminFireBase.messaging().send(message)
            .then(() => {
                res.send({
                    status: 'success'
                })
            }).catch((error) => {
                console.log('Error ', error);
                res.send({
                    status: 'error',
                    error: error.message

                })
            });
    }
}
