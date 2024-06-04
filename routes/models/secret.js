const Model = require('./model.js');
module.exports =  new class SecretModel extends Model {

    constructor(){
        super('secret');
    }

}