const Model = require('./model.js');
module.exports =  new class StudentsModel extends Model {

    constructor(){
        super('student');
    }

}