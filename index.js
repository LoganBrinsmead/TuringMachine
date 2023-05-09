// a class for the Machine Tape
class Tape {
    constructor(string) {
        console.log(typeof (string))
        this.tape = Tape.parse(string);
    }

    // get the tape
    get status() {
        return this.tape.join(" ");
    }

    // setter for tape
    // set tape(string) {
    //     console.log(typeof(string))

    //     this.tape = Tape.parse(string.join()); 
    // }

    //lets us push a blank symbol to the back of the array
    extendRight() {

        this.tape.push("B");
    }
    //lets us push a blank symbol to the front of the array
    extendLeft() {
        this.tape.unshift("B");
    }

    // write a cell of the tape
    updateCell(cellIdx, newCell) {
        this.tape[cellIdx] = newCell;
    }
    //takes the string splits it by character, making it a lot easier to work with
    static parse(string) {
        console.log(typeof (string), string)
        return string.split(" ");
    }

}

// contains the logic that models after a turing machine head
class Head {
    // state will be stored in the zeroeth index of the input to the head
    // idx/location will be stored in the 1st index
    // input argument is a string
    // example: string === "s1 0"
    constructor(input) {
        let splitInput = Head.splitInput(input);
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
        console.log(input, typeof (input))
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
        return this.tape.tape + " " + this.head.currentHead;
    }
    get runStatus() {
        return this._runStatus
    }
    set runStatus(runStatus) {
        this._runStatus = runStatus;
    }


    moveHead(direction) {
        if (this.head.idx == 0 && (direction == "L" || direction == "l")) {
            this.tape.extendLeft();
            this.head.idx -= 1;

        }
        else if (this.head.idx == this.tape.tape.length - 1 && (direction == "R" || direction == "r")) {
            this.tape.extendRight();
            this.head.idx += 1;

        } else if (direction == "L") {
            this.head.idx -= 1;
        } else if (direction == "R") {
            this.head.idx += 1;
        }
        //else input is "*" and we do not move the head


    }

    /**
     * Returns true if we have a rule for the current state
     * and input
     * else it returns false
     */

    stepRules() {

        if (this.rules[this.head.state] && this.rules[this.head.state][this.tape.tape[this.head.idx]]) {

            return this.rules[this.head.state][this.tape.tape[this.head.idx]];
        }

        return false;
    }


    step() {

        let newState;
        let writeSymbol;
        if (this.rules[this.head.state][this.tape.tape[this.head.idx]][0] == "*") {
            //if the new state is "*" then we keep the current state
            newState = this.head.state;
        } else {
            newState = this.rules[this.head.state][this.tape.tape[this.head.idx]][0];
        }

        if (this.rules[this.head.state][this.tape.tape[this.head.idx]][1] == "*") {
            //if the new state is "*" then we keep the current symbol
            writeSymbol = this.tape.tape[this.head.idx];
        } else {
            writeSymbol = this.rules[this.head.state][this.tape.tape[this.head.idx]][1];
        }

        let direction = this.rules[this.head.state][this.tape.tape[this.head.idx]][2];

        this.tape.updateCell(this.head.location, writeSymbol);
        this.head.state = newState;
        this.moveHead(direction);


    }
    /**
     * This function should allow the user to take a single step 
     * in the turing machine
     */
    oneStep() {
        if (this.stepRules()) {
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

    run() {
        while (this.stepRules()) {
            this.step();
            console.log(this.status);
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
            if (word.trim()[0] === ';') {
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

    function mergeObjects(obj1, obj2) {
        let mergedObj = {};
        for (let key in obj1) {
            if (obj2.hasOwnProperty(key)) {
                if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
                    mergedObj[key] = mergeObjects(obj1[key], obj2[key]);
                } else {
                    mergedObj[key] = obj1[key] + obj2[key];
                }
            } else {
                mergedObj[key] = obj1[key];
            }
        }
        for (let key in obj2) {
            if (!obj1.hasOwnProperty(key)) {
                mergedObj[key] = obj2[key];
            }
        }
        return mergedObj;
    }

    /**
     * @param { Array } directive - An array of the five rules that make up a directive, add to the JSON object of rules
     */
    function parseDirective(directive) {

        let curRules = `{
            "${directive[0]}": {
                "${directive[1]}": ["${directive[2]}", "${directive[4]}", "${directive[3]}"]
            }
        }`

        curRules = JSON.parse(curRules);
        rules = mergeObjects(curRules, rules);
        console.log(rules);
    }

    // This is the function that binds to the reset button
    // TODO: I am adding the functionality for display without any testing
    // TODO: Need to add functionality for the actual machine logic
    function resetButton() {

    }

    let tape = new Tape("1 0 1 0 1 B 1 1 1 0 0");
    let head = new Head("s1 0");

    $("#RunButton").on("click", function (e) {
        parseProgram();
        rules = {
            "s1": {
                "0": ["s1", "0", "R"],
                "1": ["s1", "1", "R"],
                "B": ["s2", "B", "L"]
            },
            "s2": {
                "0": ["s3", "1", "L"],
                "1": ["s2", "0", "L"],
                "B": ["s3", "1", "L"]
            },
            "s3": {
                "0": ["s3", "0", "L"],
                "1": ["s3", "1", "L"],
                "B": ["sh", "B", "R"]
            }
        }
        let m = new Machine(tape, head, rules);
        m.runStatus = true;
        console.log(`runState: ${m.runStatus}`);
        m.run();
        // console.log("equal?: ", "L" == "L");
        const check = () => {
            console.log(m.status);
        }
        setTimeout(check, 100);
        // console.log(head.currentHead);
        // console.log(m.status);
        e.preventDefault();
    });
    // $("#StepButton").on("click", oneStep);
    $("#PauseButton").on("click", function () {
        $("#PauseButton").prop("disabled", true);
        m.status(false);
    });
});