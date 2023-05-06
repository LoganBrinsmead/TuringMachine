// a class for the Machine Tape
class Tape {
    constructor(string) {
        this.tape = parse(string);
    }

    // get the tape
    get tape() {
        return this.tape.join("");
    }
    //lets us push a blank symbol to the back of the array
    extendRight() {

        this.tape.push("B");
    }
    //lets us push a blank symbol to the front of the array
    extendLeft(){
        this.tape.unshift("B");
    }

    // write a cell of the tape
    updateCell(cellIdx, newCell) {
        this.tape[cellIdx] = newCell;
    }
    //takes the string splits it by character, making it a lot easier to work with
    static parse(string) {
        return string.split("");
    }

}

// contains the logic that models after a turing machine head
class Head {
    // state will be stored in the zeroeth index of the input to the head
    // idx/location will be stored in the 1st index
    // input argument is a string
    // example: string === "s1 0"
    constructor(input) {
        let splitInput = splitInput(input);
        this.state = splitInput[0];//state
        this.idx = splitInput[1];//currIdx
    }

    get currentHead() {
        return `Current state at in head: ${this.state}, current Index in head: ${this.idx}`;
    }

    updateHeadInfo(state, idx) {
        this.state = state;
        this.idx = idx;
    }

    // parses the input and splits it for every space
    static splitInput(input) {
        return input.split(" ");
    }
}

class Machine {

    constructor(tape, head, rules) {
        this.tape = tape;
        this.head = head;
        this.rules = rules;
        this.runStatus = false;
    }
    
    get status() {
        return this.tape.tape + " " +  this.head.currentHead;
    }
    set status(runState){

        this.runStatus = runState;

    }
  

    moveHead(direction){
        if(this.head.idx == 0 &&  direction == "L"){
            this.tape.extendLeft();
            this.head.idx -= 1;
            
        }
        else if(this.head.idx == this.tape.tape.length - 1 &&  direction == "R"){
            this.tape.extendRight();
            this.head.idx += 1;
            
        }else if (direction == "L"){
            this.head.idx -= 1;
        }else if (direction == "R"){
            this.head.idx += 1;
        }
        //else input is "*" and we do not move the head
        

    }

    /**
     * Returns true if we have a rule for the current state
     * and input
     * else it returns false
     */

    stepRules(){

        if(this.rules[this.head.state] && this.rules[this.head.state][this.tape.tape[this.head.idx]]){

            return this.rules[this.head.state][this.tape.tape[this.head.idx]];
        }

        return false;
    }


    step() {

        let newState;
        let writeSymbol;
        if(this.rules[this.head.state][this.tape.tape[this.head.idx]][0] == "*"){
            //if the new state is "*" then we keep the current state
            newState = this.head.state;
        }else {
            newState = this.rules[this.head.state][this.tape.tape[this.head.idx]][0];
        }

        if(this.rules[this.head.state][this.tape.tape[this.head.idx]][1] == "*"){
            //if the new state is "*" then we keep the current symbol
            writeSymbol = this.tape.tape[this.head.idx];
        }else {
            writeSymbol = this.rules[this.head.state][this.tape.tape[this.head.idx]][1];
        }
        
        let direction  = this.rules[this.head.state][this.tape.tape[this.head.idx]][2];

        this.tape.updateCell(this.head.location, writeSymbol);
        this.head.state = newState;
        this.moveHead(direction); 
        

    }
    /**
     * This function should allow the user to take a single step 
     * in the turing machine
     */
    oneStep(){
        if(this.stepRules()){
            this.step();
        }
    }
    /**
     * have a boolean variable runTrue
     * pass it to setter
     * check to see if it is true
     * and if it is false 
     * 
     */

    run( ){
        while( stepRules() && this.runStatus){
            this.step();      
        
        }
    }

    // run machine at half speed
    halfSpeedRun() {
        setInterval(run, 1000);
    }

}

/**
 * format of JSON that contains rules:
 * "state-in-head": {
 *      "symbol-head-reads": ["state-head-changes-to", "symbol-head-writes", "direction-head-moves"]
 *      "symbol-head-reads": ["state-head-changes-to", "symbol-head-writes", "direction-head-moves"]     
 *      "symbol-head-reads": ["state-head-changes-to", "symbol-head-writes", "direction-head-moves"]     
 * }
 */


$(document).ready(function () {
    let rules = {};
    // parsing the information in the textarea and inserting that into a JSON object
    function parseProgram() {
        let program = $("#ProgramText").val();

        program = program.split('\n');

        program = program.filter(entry => entry);

        let allRules = [];
        let curRule = [];

        for (let word of program) {
            if(word.trim()[0] === ';') {
                continue;
            }
            curRule = word.split(" ");
            if (curRule.length < 5) {
                alert("Error: All of your directives must have 5 rules in them (probably do this better than alert)");
                break;
            } 
            parseDirective(curRule);
        }

    }

    /**
     * @param { Array } directive - An array of the five rules that make up a directive, add to the JSON object of rules
     */
    function parseDirective(directive) {

        let curRules = `{
            "${directive[0]}": {
                "${directive[1]}": ["${directive[2]}", "${directive[3]}", "${directive[4]}"]
            }
        }`

        curRules = JSON.parse(curRules);
        rules = Object.assign({}, rules, curRules);
        console.log(rules);
    }

    let tape = new Tape;
    let head = new Head;
    let m = new Machine(tape, head, rules);
    m.run();

    $("#RunButton").on("click", parseProgram);
    $("#StepButton").on("click", oneStep);
    $("#PauseButton").on("click", function (){
        $("#PauseButton").prop("disabled", true);
        m.status(false);
    });
});