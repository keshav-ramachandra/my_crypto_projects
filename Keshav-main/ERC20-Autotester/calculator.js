var produced_output = require('./produced_output.json');
var desired_output = require('./desired_output.json')



function compareAnswers(produced_output,desired_output) {

    let percent = 0;
    let questions = 0;
    let correctAnswers = 0;
    for (const prop in produced_output) {
        questions++;
        if(produced_output[prop] === desired_output[prop]){
           correctAnswers++; 
        }
    }

    return correctAnswers/questions * 100;
      
}
console.log(compareAnswers(produced_output,desired_output));
