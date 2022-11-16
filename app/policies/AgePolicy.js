const moment = require('moment');
module.exports = {
    async validateAdult(req, res, next) {
        try{
            let birthday = req.body.birthday;
            let formatDate = 'YYYY-MM-DD';
            let fDate = moment(birthday.back.toString(), 'YYYY-MM-DD').format('YYYY-MM-DD');
            let now = moment().format(formatDate);
            let age = moment(now).diff(fDate, 'years');
            if(age < 18) {
                res.send({
                    status: 'minor'
                })
            } else {
                req.birthday = fDate;
                next();
            }
        }catch (error) {
            console.log(error);
        }

    }
}
