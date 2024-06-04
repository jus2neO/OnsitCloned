const Model = require('./model.js');
module.exports =  new class CourseModel extends Model {

    constructor(){
        super('course');
    }

}