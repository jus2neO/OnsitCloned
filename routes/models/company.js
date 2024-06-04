const Model = require('./model.js');
module.exports =  new class CompanyModel extends Model {

    constructor(){
        super('company');
    }

}