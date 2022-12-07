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

        const message = {
            notification: {
                title: 'Bienvenido Guapo',
                body: 'Test'
            },
            android: {
                notification: {
                    channelId: '77195440',

                }
            },
            token: req.headers.tokenDevice
        };

        adminFireBase.messaging().send(message)
            .then((response) => {
                console.log('Success', response);
                next();
            }).catch((error) => {
                console.log('Error ', error)
            });
    }
}
