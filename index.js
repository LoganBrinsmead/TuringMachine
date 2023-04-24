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

