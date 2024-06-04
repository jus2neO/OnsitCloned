const Model = require('./model.js');
module.exports =  new class StaffModel extends Model {

    constructor(){
        super('staff');
    }

}