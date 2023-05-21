# Turing Machine

A Turing Machine written in JQuery.

# How to Run
- cd into the repository
- run the command: npm install
- open the index.html file in a web browser

# Tests

For these tests, copy and paste the program into the program box in our Turing Machine, then copy and paste the tape into the "initial input" box on the right.

All of these tests are taken straight from the Morphett Turing Machine (https://morphett.info/turing/turing.html)

To load the equivalent programs in Morphett, click the "Load an example program" button that they have in their right controls box.

You can also get the programs that we are using for testing below by using this method and copy and pasting them from Morphett.

Our machine should match all of the programs on Morphett, and we primarily test our program using the programs from Morphett.

This means, the best way to test our program is by copy and pasting the programs from Morphett. Our output should match the output from Morphett.

## Program 1, Palindrome detector

### Program
```
; This example program checks if the input string is a binary palindrome.
; Input: a string of 0's and 1's, eg '1001001'


; Machine starts in state 0.

; State 0: read the leftmost symbol
0 0 _ r 1o
0 1 _ r 1i
0 _ _ * accept     ; Empty input

; State 1o, 1i: find the rightmost symbol
1o _ _ l 2o
1o * * r 1o

1i _ _ l 2i
1i * * r 1i

; State 2o, 2i: check if the rightmost symbol matches the most recently read left-hand symbol
2o 0 _ l 3
2o _ _ * accept
2o * * * reject

2i 1 _ l 3
2i _ _ * accept
2i * * * reject

; State 3, 4: return to left end of remaining input
3 _ _ * accept
3 * * l 4
4 * * l 4
4 _ _ r 0  ; Back to the beginning

accept * : r accept2
accept2 * ) * halt-accept

reject _ : r reject2
reject * _ l reject
reject2 * ( * halt-reject
```

### Tape
1001001

### Expected Output
Tape should read: :)

"Current State" box should read: halt-accept

"Current Steps" box should read: 38 

## Program 2, Binary Addition

### Program 
```
; Binary addition - adds two binary numbers
; Input: two binary numbers, separated by a single space, eg '100 1110'

0 _ _ r 1
0 * * r 0
1 _ _ l 2
1 * * r 1
2 0 _ l 3x
2 1 _ l 3y
2 _ _ l 7
3x _ _ l 4x
3x * * l 3x
3y _ _ l 4y
3y * * l 3y
4x 0 x r 0
4x 1 y r 0
4x _ x r 0
4x * * l 4x    ; skip the x/y's
4y 0 1 * 5
4y 1 0 l 4y
4y _ 1 * 5
4y * * l 4y    ; skip the x/y's
5 x x l 6
5 y y l 6
5 _ _ l 6
5 * * r 5
6 0 x r 0
6 1 y r 0

7 x 0 l 7
7 y 1 l 7
7 _ _ r halt
7 * * l 7
```

### Tape
110110 101011

### Expected Output
Tape should read: 1100001

"Current State" box should read: halt

"Current Steps" box should read: 135 


## Program 3, Binary Multiplication

### Program
```
; Binary multiplication machine - multiplies two numbers given in binary
; Input: two numbers in binary, separated by a space, eg "101 1101"
; Output: the product of the two inputs, in binary

; The machine stores data on the tape in the configuration "tally num1 num2" where num1, num2 are the input and tally is the running total for the product.

; Set up tally
0 * * l 1
1 _ _ l 2
2 _ 0 r 3
3 _ _ r 10

; Find end of num1
10 _ _ l 11
10 x x l 11
10 0 0 r 10
10 1 1 r 10


; If last digit of num1 is 0, multiply num2 by 2
11 0 x r 20
; If last digit of num1 is 1, add num2 to tally and then multiply num2 by 2
11 1 x r 30


; Multiply num2 by 2
20 _ _ r 20
20 x x r 20
20 * * r 21
21 _ 0 l 25 ; Multiplication by 2 done, return to end of num1
21 * * r 21
25 _ _ l 26
25 * * l 25
26 _ _ r 80 ; Finished multiplying. Clean up
26 x x l 26
26 0 0 * 11
26 1 1 * 11

; Add num2 to tally
30 _ _ r 30
30 x x r 30
30 * * r 31
31 _ _ l 32
31 * * r 31
32 0 o l 40 ; Add a zero
32 1 i l 50 ; Add a one
32 o o l 32
32 i i l 32
32 _ _ r 70 ; Finished adding

; Adding a 0 to tally
40 _ _ l 41
40 * * l 40 ; Found end of num2
41 _ _ l 41
41 * * l 42 ; Found start of num1
42 _ _ l 43 ; Found end of num1
42 * * l 42
43 o o l 43
43 i i l 43
43 0 o r 44
43 1 i r 44
43 _ o r 44
44 _ _ r 45 ; Found end of tally
44 * * r 44
45 _ _ r 45
45 * * r 46 ; Found start of num1
46 _ _ r 47 ; Found end of num1
46 * * r 46
47 _ _ r 47
47 * * r 48
48 _ _ l 32 ; Found end of num2
48 * * r 48

; Adding a 1 to tally
50 _ _ l 51 ; Found end of num2
50 * * l 50 
51 _ _ l 51
51 * * l 52 ; Found start of num1
52 _ _ l 53 ; Found end of num1
52 * * l 52
53 o o l 53
53 i i l 53
53 _ i r 55
53 0 i r 55 ; return to num2
53 1 o l 54
54 0 1 r 55
54 1 0 l 54
54 _ 1 r 55
55 _ _ r 56 ; Found end of tally
55 * * r 55
56 _ _ r 56
56 * * r 57 ; Found start of num1
57 _ _ r 58 ; Found end of num1
57 * * r 57
58 _ _ r 58
58 * * r 59
59 _ _ l 32 ; Found end of num2
59 * * r 59

; Finished adding, clean up
70 i 1 r 70
70 o 0 r 70
70 _ _ l 71
71 _ _ l 72 ; Found end of num2
71 * * l 71
72 _ _ l 72
72 * * l 73 ; Found start of num1
73 _ _ l 74
73 * * l 73
74 o 0 l 74
74 i 1 l 74
74 * * r 75 ; Finished cleaning up tally
75 _ _ r 76
75 * * r 75
76 _ _ r 20 ; Multiply num2 by 2
76 * * r 76

; Finished multiplying, clean up
80 x _ r 80
80 _ _ r 81
81 _ _ l 82
81 * _ r 81
82 _ _ l 82
82 * * * halt
```

### Tape
1101 11010

### Expected Output
Tape should read: 101010010

"Current State" box should read: halt

"Current Steps" box should read: 980 
