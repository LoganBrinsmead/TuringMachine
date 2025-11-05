$(document).ready(function () {

    // a class for the Machine Tape
    class Tape {
        constructor(string) {
            console.log(typeof (string))
            
            if(string === ""){
                console.log(string);
                string = "_"
            }
            console.log(string);
            this.tape = Tape.parse(string);
        }
        // get the tape
        get status() {
            return this.tape.join("");
        }

        //lets us push a blank symbol to the back of the array
        extendRight() {

            this.tape.push("_");
        }
        //lets us push a blank symbol to the front of the array
        extendLeft() {
            this.tape.unshift("_");
        }

        // write a cell of the tape
        updateCell(cellIdx, newCell) {
            this.tape[cellIdx] = newCell;
        }
        //takes the string splits it by character, making it a lot easier to work with
        static parse(string) {
            console.log(typeof (string), string)
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
            let splitInput = Head.splitInput(input);
            let state = splitInput[0];//state
            let idx = parseInt(splitInput[1]);//currIdx
            this.updateHeadInfo(state, idx);
        }

        get currentHead() {
            return `Current state at in head: ${this.state}, current Index in head: ${this.idx}`;
        }

        get currState() {
            return this.state;
        }

        get currIdx() {
            return this.idx;
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
            this._runStatus = true;
            this._numSteps = 0;
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

        set numSteps(numSteps) {
            this._numSteps = numSteps;
        }

        get currState() {
            return this.head.currState;
        }

        get currIdx() {
            return this.head.currIdx;
        }

        get numSteps() {
            return this._numSteps;
        }


        moveHead(direction) {
            if (this.head.idx == 0 && (direction.toLowerCase() == "l")) {
                this.tape.extendLeft();

            }
            else if (this.head.idx == this.tape.tape.length - 1 && (direction.toLowerCase() == "r")) {
                this.tape.extendRight();
                this.head.idx += 1;

            } else if (direction.toLowerCase() == "l") {
                this.head.idx -= 1;
            } else if (direction.toLowerCase() == "r") {
                this.head.idx += 1;
            }
        }

        /**
         * Returns true if we have a rule for the current state
         * and input
         * else it returns false
         */
        stepRules() {
            let ruleExist = false;
            for (const state in this.rules[this.head.state]) {
               
                if ((this.rules[this.head.state] && this.rules[this.head.state][this.tape.tape[this.head.idx]]) || (state === "*")) {
                    ruleExist = true;
                }
            }

            return ruleExist;
        }


        step() {

            // increment the number of steps
            this.numSteps = this.numSteps += 1;

            let newState;
            let writeSymbol;
            let direction;

            //this.rules[this.head.state][this.tape.tape[this.head.idx]][0] !== "*")
            if (this.rules[this.head.state][this.tape.tape[this.head.idx]] != null) {
                if (this.rules[this.head.state][this.tape.tape[this.head.idx]][0] === "*") {
                    newState = this.head.state;
                } else {
                    newState = this.rules[this.head.state][this.tape.tape[this.head.idx]][0];
                }
                if (this.rules[this.head.state][this.tape.tape[this.head.idx]][1] === "*") {
                    writeSymbol = this.tape.tape[this.head.idx];

                } else {
                    writeSymbol = this.rules[this.head.state][this.tape.tape[this.head.idx]][1];
                }
                direction = this.rules[this.head.state][this.tape.tape[this.head.idx]][2];

            } else {
                //this is in case the only state we have to make a move on is *
                for (const state in this.rules[this.head.state]) {
                    if (state === "*" && !(this.rules[this.head.state][this.tape.tape[this.head.idx]] in this.rules[this.head.state])) {

                        if (this.rules[this.head.state][state][0] === "*") {
                            newState = this.head.state;
                        } else {
                            newState = this.rules[this.head.state][state][0];
                        }
                        if (this.rules[this.head.state][state][1] === "*") {
                            writeSymbol = this.tape.tape[this.head.idx];

                        } else {
                            writeSymbol = this.rules[this.head.state][state][1];
                            
                        }

                        direction = this.rules[this.head.state][state][2];
                    }
                }
            }

            this.tape.updateCell(this.head.idx, writeSymbol);
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

        async run() {
            while (this.stepRules()) {
                console.log(this.status);
                this.step();

                // changing the current state on frontend
                changeCurState(this.head.state);
                changeCurSteps(this.numSteps);
                changeActiveArea(this.head.idx, this.tape.tape);
                await new Promise(r => setTimeout(r, 75));

            }
            console.log("Final tape condition and final state");
            console.log(this.status);
            console.log(this.head.state);
            console.log(this.tape.tape[this.head.idx])
        }

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
                "${directive[1]}": ["${directive[4]}", "${directive[2]}", "${directive[3]}"]
            }
        }`

        curRules = JSON.parse(curRules);
        rules = mergeObjects(curRules, rules);
        console.log(rules);
    }

    let activeTapeArea =
        `<pre id="ActiveTape" class="tape"></pre>` +
        `<div id="MachineHead">` +
            `<div class="HeadTop"></div>` +
            `<div class="HeadBody">Head</div>` +
        `</div>`;


    // $(machineHead).append($(headTop));
    // $(machineHead).append($(headBody));

    // $(activeTapeArea).append($(activeTape));
    // $(activeTapeArea).append($(machineHead));

    // let leftTape = $(`<pre id="leftTape" class="tape"></pre>`);
    // let rightTape = $(`<pre id="RightTape" class="tape"></pre>`);

    let leftTape = $("#leftTape");
    let rightTape = $("#RightTape");

    let tapeValues = $("#TapeValues");

    $("#ActiveTapeArea").append($(activeTapeArea));


    // function to change active state in the tape on the frontend
    function changeActiveArea(indexOfHeadPosition, tape) {
        tape = tape.join("");
        // tape = tape.replace('_', '');
        
        let leftTapeText ='';
        let rightTapeText = '';

        for(let i = 0; i < indexOfHeadPosition; i++) {
            leftTapeText += tape[i];
        }
        leftTapeText.split("").reverse().join("");

        for(let i = indexOfHeadPosition + 1; i < tape.length - 1; i++) {
            rightTapeText += tape[i];
        }

        activeChar = tape[indexOfHeadPosition];
        leftTapeText = leftTapeText.replace(/\_/g, " ");
        rightTapeText = rightTapeText.replace(/\_/g, " ");
        console.log(leftTapeText + rightTapeText);
        leftTape.text(leftTapeText);
        rightTape.text(rightTapeText);

        $("#ActiveTape").text(activeChar);
    }

    // function to change the number of steps on the frontend
    function changeCurSteps(numSteps) {
        $("#MachineCurrentStep").text(numSteps.toString());
    }

    // function to change the current state on the frontend
    function changeCurState(curState) {
        $("#MachineCurrentState").text(curState);
    }

    $("#RunButton").on("click", function (e) {
        rules = {};
        parseProgram();

        // get the input tape
        let inputString = $("#StringInput").val();
        inputString = inputString.split(" ").join("_");


        let tape = new Tape(inputString);
        let head = new Head("0 0");


        let m = new Machine(tape, head, rules);
        //m.runStatus = true;
       // console.log(`runState: ${m.runStatus}`);
        m.run();
        e.preventDefault();
    });
 
    // $("#StepButton").on("click", oneStep);
    $("#PauseButton").on("click", function () {
        $("#PauseButton").prop("disabled", true);
       // m.setRunState(false);
    });
});