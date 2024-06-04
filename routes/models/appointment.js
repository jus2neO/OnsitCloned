const Model = require('./model.js');
module.exports =  new class AppointmentModel extends Model {

    constructor(){
        super('appointment');
    }

}