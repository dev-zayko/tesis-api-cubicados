const axios = require('axios');

module.exports = {
    async sendNotification(req, user, next) {
        return await axios.post("https://exp.host/--/api/v2/push/send", {
            "to": req.headers.tokenDevice,
            "sound": "default",
            "title": "Pago Realizado",
            "body": `Se realizo el pago correcto de $${req.netoAmount} por Plan Premium`
        }, {});
    }
}
