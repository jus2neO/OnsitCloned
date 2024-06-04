const Model = require('./model.js');
module.exports =  new class NotificationModel extends Model {

    constructor(){
        super('notification');
    }

}