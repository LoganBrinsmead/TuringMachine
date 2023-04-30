// a class for the Machine Tape
class Tape {
    constructor(tape) {
        this.tape = tape;
    }

    // get the tape
    get tape() {
        return this.tape
    }

    // write a cell of the tape
    updateCell(cellIdx, newCell) {
        this.tape[cellIdx] = newCell;
    }

}

// contains the logic that models after a turing machine head
class Head {
    // state will be stored in the zeroeth index of the input to the head
    // symbol will be stored in the 1st index
    // input argument is a string
    // example: string === "s1 0"
    constructor(input) {
        let splitInput = splitInput(input);
        this.state = splitInput[0];
        this.symbol = splitInput[1];
    }

    get currentHead() {
        return `Current state at in head: ${this.state}, current symbol in head: ${this.symbol}`;
    }

    updateHeadInfo(state, symbol) {
        this.state = state;
        this.symbol = symbol;
    }

    // parses the input and splits it for every space
    static splitInput(input) {
        return input.split(" ");
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
            curRule = word.split(" ");
            if (curRule.length < 5) {
                alert("Error: All of your directives must have 5 rules in them (probably do this better than alert)");
                break;
            }
            parseDirective(curRule);
        }

    }

    /**
     * 
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
    }


    $("#ResetButton").on("click", parseProgram);
});

