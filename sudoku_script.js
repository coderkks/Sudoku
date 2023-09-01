//   Checking the data stored in local storage. Max limit is around 5MB.

// var t = 0;
// for (var x in localStorage) {
//     t += (x.length + localStorage[x].length) * 2;
// }
// console.log("data stored in local storage is approx : "+ (t / 1024) + " KB");

//   In local storage, 3 kind of values('keys') are stored-- 1.  'Sudoku_length'
//              2.  names of sudoku files saved
//              3.  sudokuName+"-cellArray[" + i + "][" + j + "]-value"

let cellArray = new Array(9);
let arr = new Array(9);
const clearBtn = document.getElementById("clearbtn");
const solveBtn = document.getElementById("solvebtn");
const saveBtn = document.getElementById("savebtn");
const savedfileBtn = document.getElementById("savedfilebtn");
const doneBtn = document.getElementById("donebtn");
const resetBtn = document.getElementById("resetbtn");
const retrieveBtn = document.getElementById("retrievebtn");
const deleteBtn = document.getElementById("deletebtn");
const savedfileSdk = document.getElementById("savedfilesdk");
let givenValues = 0;
let filledValues = 0;
let boxFilledSq = 1;
let boxFilledProbVal = 1;
let rowColRemoved = 0;
let storedSudoku = []; // array that stores the names of sudoku stored in local storage.
// let storedLength = 0;

if (localStorage.getItem("Sudoku_length")) {
    let storedLength = localStorage.getItem("Sudoku_length");
    let i = 0;
    while (storedLength--) {
        storedSudoku.push(localStorage.getItem("Sudoku-" + ++i));
    }
}


function makeSquareArray() {
    for (let j = 1; j <= 9; j++) {
        arr[j] = new Array(9);
        // for s1,s2,s3... objects- {r: [0,1,2] , c:[3,4,5] for s2}
        for (let i = 0; i < 9; i++) {
            arr[j][i] = { r: [], c: [], sqr: i + 1 };

            for (let i1 = 0; i1 < 3; i1++) {
                arr[j][i].r[i1] = 3 * Math.floor(i / 3) + i1;
                arr[j][i].c[i1] = 3 * (i % 3) + i1;
            }
        }
    }
}

function makeCellArray() {
    for (let i = 0; i < 9; i++) {
        cellArray[i] = new Array(9); //making 2d array.
        for (let j = 0; j < 9; j++) {
            // 'sq' is 'square' no. for different values of i/j.
            let sq = Math.floor(i / 3) * 3 + Math.floor(j / 3) + 1;
            let bl = 3 * (i % 3) + (j % 3) + 1; // 'block' no. for different i/j (i.e. 1,2,3,....,9  in any square.)
            cellArray[i][j] = {
                value: 0,
                probable_values: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                elementBox: document.getElementById("block_s" + sq + "_" + bl),
            };

            cellArray[i][j].elementBox.setAttribute("contenteditable", "true");
            cellArray[i][j].elementBox.setAttribute("class", "block");

            // Blur Event------
            cellArray[i][j].elementBox.addEventListener("blur", (e) => {
                sessionStorage.setItem(
                    "cellArray[" + i + "][" + j + "]-value",
                    cellArray[i][j].elementBox.textContent
                );
            });

            // getting the value from session storage into those boxes.
            cellArray[i][j].elementBox.textContent = sessionStorage.getItem(
                "cellArray[" + i + "][" + j + "]-value"
            );
        }
    }
}

makeCellArray();
makeSquareArray();

function setArray() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            cellArray[i][j].probable_values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            cellArray[i][j].value = Number(cellArray[i][j].elementBox.textContent);
            cellArray[i][j].elementBox.setAttribute("contenteditable", "false");

            if (cellArray[i][j].value) {
                givenValues++;
                cellArray[i][j].elementBox.setAttribute("class", "bold block");

                removeFromSquare(i, j, cellArray[i][j].value);
                removeProbableValues(i, j, cellArray[i][j].value);
            } else {
                cellArray[i][j].elementBox.setAttribute("class", "block-done");
            }
        }
    }
}

doneBtn.addEventListener("click", setArray);

resetBtn.addEventListener("click", (e) => {
    givenValues = 0;
    makeCellArray();
    makeSquareArray();
});

clearBtn.addEventListener("click", (e) => {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            cellArray[i][j].value = 0;
            cellArray[i][j].elementBox.textContent = "";
            cellArray[i][j].elementBox.setAttribute("class", "block");
        }
    }
    sessionStorage.clear();
    givenValues = 0;
});

saveBtn.addEventListener("click", () => {
    let n = storedSudoku.length;
    let sudokuName = prompt(
        "Please enter the name by which you want to save it. You can leave it to save the default name.",
        "Sudoku - " + ++n
    );
    while (storedSudoku.includes(sudokuName)) {
        sudokuName = prompt(
            "Please enter the name by which you want to save it. You can leave it to save the default name.",
            "Sudoku - " + ++n
        );
    }
    storedSudoku.push(sudokuName);
    localStorage.setItem("Sudoku-" + n, sudokuName); //stores the sudoku's names in the array.
    localStorage.setItem("Sudoku_length", n);

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            localStorage.setItem(
                sudokuName + "-cellArray[" + i + "][" + j + "]-value",
                cellArray[i][j].elementBox.textContent
            );
        }
    }
});

// shows the list of saved Sudoku, if already shown disappears the list.
savedfileBtn.addEventListener("click", (e) => {
    let files = document.getElementById("files");
    // checks if sudoku list is present or not.
    if (files) {
        files.remove();
        return;
    }

    // creating a 'div' element to store all saved sudoku files.
    let sudokuFiles = document.createElement("div");
    sudokuFiles.setAttribute("id", "files");
    savedfileSdk.appendChild(sudokuFiles);

    for (let i = 0; i < storedSudoku.length; i++) {
        let sdkElement = document.createElement("button");
        sdkElement.setAttribute('id','sudoku'+(i+1));
        sdkElement.setAttribute("class", "stored-sudoku"); // to provide CSS properties.
        // sdkElement.textContent = storedSudoku[i];
        sdkElement.innerHTML = `<span>${storedSudoku[i]}</span>`;

        sdkElement.addEventListener("mouseover", (e) => {
            if (sdkElement.firstElementChild.nextElementSibling) {
                return;
            }
            let a = document.createElement("div"); // creating a 'div' element containing 'delete' and 'retrieve'.
            a.setAttribute("class", "new-div");
            a.innerHTML = `<span id="retrievebtn" onclick="retrieveElement(this)" class="btn-text">Retrieve</span>
                           <span id="deletebtn" onclick="deleteElement(this)" class="btn-text">Delete</span>`;

            sdkElement.appendChild(a);
        });

        sdkElement.addEventListener("mouseleave", (e) => {
            e.target.lastElementChild.remove();
        });
        sudokuFiles.appendChild(sdkElement);
    }
});

function deleteElement(currElement) {
    let n = storedSudoku.length;
    localStorage.setItem("Sudoku_length", n - 1);

    // We'll shift the values to one step back for all keys and delete last key. Because in local storage keys are stored as 'Sudoku-1, Sudoku-2,.....'(don't confuse it with name of sudoku file which is set by default as 'Sudoku - 1') If we want to maintain this order we'll have to shift and then delete last key.
    let currSudokuElement = currElement.parentElement.previousElementSibling.textContent;
    let i = storedSudoku.indexOf(currSudokuElement);

    while ((++i) < n) {
        localStorage.setItem("Sudoku-" + i, storedSudoku[i]);
    }
    localStorage.removeItem("Sudoku-" + n);
    storedSudoku = storedSudoku.filter((val) => val != currSudokuElement);

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            localStorage.removeItem(currSudokuElement+"-cellArray[" + i + "][" + j + "]-value");
        }
    }

    currElement.parentElement.parentElement.remove();
}

function retrieveElement(currElement) {

    let currSudokuFileName = currElement.parentElement.previousElementSibling.textContent;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            cellArray[i][j].elementBox.textContent = localStorage.getItem(
                currSudokuFileName + "-cellArray[" + i + "][" + j + "]-value"
            );

            sessionStorage.setItem("cellArray[" + i + "][" + j + "]-value", cellArray[i][j].elementBox.textContent);
            setArray();
        }
    }
}

solveBtn.addEventListener("click", solveIt);

// Main LOGIC of the code---

// for any element, we'll check all squares and see if any square has only one place for that element.
function checkSquare() {
    for (let l = 1; l <= 9; l++) {
        for (let k = 0; k < arr[l].length; k++) {
            let iprob = [];
            let jprob = [];
            let blockProb = 0;
            sqRowLength = arr[l][k].r.length;

            for (let i1 = 0; i1 < sqRowLength; i1++) {
                sqColumnLength = arr[l][k].c.length;
                let i = arr[l][k].r[i1];

                for (let j1 = 0; j1 < sqColumnLength; j1++) {
                    let j = arr[l][k].c[j1];

                    if (!cellArray[i][j].value && cellArray[i][j].probable_values.includes(l)) {
                        // console.log("value of i,j "+i+','+j);
                        iprob.push(i);
                        jprob.push(j);
                        blockProb++;
                    }
                }
            }

            if (blockProb == 1) {
                putValue(iprob[0], jprob[0], l);
                boxFilledSq++;
            } else if (blockProb) {
                // console.log("sqr: "+k+'val: '+l)
                if (iprob.every((val, i, iprob) => val === iprob[0])) { //condition to check if all elments of array 'iprob' are equal.
                    let keyR = 0;
                    let x = Math.ceil(arr[l][k].sqr / 3) * 3;
                    arr[l].forEach((v) => {
                        if (v.sqr == x || v.sqr == x - 1 || v.sqr == x - 2) {
                            keyR++;
                            //denotes in how many squares(out of 3 or out of remaining 2) corresponding to that row does this element 'l'(say '5') is present.
                        }
                    });
                    if (keyR > 1) {
                        removeFromSqRow(iprob[0], jprob[0], l);
                        removeProbValuesRow(iprob[0], jprob[0], l);
                    }
                } else if (jprob.every((val, i, jprob) => val === jprob[0])) {
                    let keyC = 0;
                    let x = ((arr[l][k].sqr - 1) % 3) + 1;
                    arr[l].forEach((v) => {
                        if (v.sqr == x || v.sqr == x + 3 || v.sqr == x + 6) {
                            keyC++;
                        }
                    });
                    if (keyC > 1) {
                        removeFromSqCol(iprob[0], jprob[0], l);
                        removeProbValuesCol(iprob[0], jprob[0], l);
                    }
                }
            }
        }
    }
}
let nmb = 0;
function solveIt() {
    boxFilledSq = 1;
    boxFilledProbVal = 1;
    let filledValuesSq = filledValues;

    while (boxFilledSq) {
        boxFilledSq = 0;
        checkSquare();
        filledValuesSq = filledValues;
    }

    while (boxFilledProbVal) {
        boxFilledProbVal = 0;
        checkProbableValues();
    }

    if (filledValuesSq < filledValues || nmb <3) {
        nmb++;
        solveIt();
    }
}

function putValue(i, j, val) {
    cellArray[i][j].value = val;
    cellArray[i][j].elementBox.textContent = val;
    cellArray[i][j].elementBox.setAttribute("class", "block");
    filledValues++;

    removeProbableValues(i, j, val);
    removeFromSquare(i, j, val);
}

function removeFromSquare(i, j, val) {
    // to remove that square from element's array.
    let n = Math.floor(i / 3) * 3 + Math.floor(j / 3) + 1;
    arr[val] = arr[val].filter((value) => {
        return value.sqr != n;
    });

    for (let k = 0; k < arr[val].length; k++) {
        arr[val][k].r = arr[val][k].r.filter((value) => value != i);
        arr[val][k].c = arr[val][k].c.filter((value) => value != j);
    }
}

function removeFromSqRow(i, j, val) {
    let n = Math.floor(i / 3) * 3 + Math.floor(j / 3) + 1; // square no.
    for (let k = 0; k < arr[val].length; k++) {
        if (arr[val][k].sqr != n) {
            arr[val][k].r = arr[val][k].r.filter((value) => value != i);
        }
    }
}
function removeFromSqCol(i, j, val) {
    let n = Math.floor(i / 3) * 3 + Math.floor(j / 3) + 1;
    for (let k = 0; k < arr[val].length; k++) {
        if (arr[val][k].sqr != n) {
            arr[val][k].c = arr[val][k].c.filter((value) => value != j);
        }
    }
}

function removeProbableValues(i, j, val) {
    //remove from row/column.
    for (let k = 0; k < 9; k++) {
        cellArray[i][k].probable_values = cellArray[i][k].probable_values.filter(
            (value) => value != val
        ); // row
        cellArray[k][j].probable_values = cellArray[k][j].probable_values.filter(
            (value) => value != val
        ); //column
    }

    // removing from square.
    for (let k1 = 0; k1 < 3; k1++) {
        for (let k2 = 0; k2 < 3; k2++) {
            let i1 = Math.floor(i / 3) * 3 + k1;
            let j1 = Math.floor(j / 3) * 3 + k2;

            cellArray[i1][j1].probable_values = cellArray[i1][
                j1
            ].probable_values.filter((value) => value != val);
        }
    }
}

function removeProbValuesRow(i, j, val) {
    for (let k = 0; k < 9; k++) {
        if (Math.floor(k / 3) !== Math.floor(j / 3)) {
            cellArray[i][k].probable_values = cellArray[i][k].probable_values.filter(
                (value) => value != val
            );
        }
    }
}
function removeProbValuesCol(i, j, val) {
    for (let k = 0; k < 9; k++) {
        if (Math.floor(k / 3) !== Math.floor(i / 3)) {
            cellArray[k][j].probable_values = cellArray[k][j].probable_values.filter(
                (value) => value != val
            );
        }
    }
}

// check for probable_values in each box and see if there is only one value possible in a box.
function checkProbableValues() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (
                !cellArray[i][j].value &&
                cellArray[i][j].probable_values.length == 1
            ) {
                putValue(i, j, cellArray[i][j].probable_values[0]);
                boxFilledProbVal++;
            }
            else if(!cellArray[i][j].value &&
                cellArray[i][j].probable_values.length == 2){
                    rowColPairCheck(i,j);
            }
        }
    }
}

function rowColPairCheck(i, j) {
    // Row Check --
    for (let k = j + 1; k < 9; k++) {
        let a = cellArray[i][j].probable_values;
        let b = cellArray[i][k].probable_values;
        // below is the condition for the equality of 'a' and 'b'.
        if (!cellArray[i][k].value &&
            a.every((val) => b.includes(val)) &&
            b.every((val) => a.includes(val))
        ) {
            console.log("In row, for cell: "+ i, j  +" and " + i, k +" and values: " + a[0], a[1]);
            // code to remove a[0],a[1] or 'a.forEach()' from row ecxept j,k.
            // for(let n = 0; n< 9; n++){
            //     if(n!=j && n!= k){
            //         cellArray[i][n].probable_values = cellArray[i][n].probable_values.filter((val)=> val!=a[0]);
            //         cellArray[i][n].probable_values = cellArray[i][n].probable_values.filter((val)=> val!=a[1]);
            //     }
            // }
            // If these two cells are in same square then remove from that square also.
        }
    }

    //Column check --
    for (let k = i + 1; k < 9; k++) {
        let a = cellArray[i][j].probable_values;
        let b = cellArray[k][j].probable_values;
        // below is the condition for the equality of 'a' and 'b'.
        if (!cellArray[k][j].value &&
            a.every((val) => b.includes(val)) &&
            b.every((val) => a.includes(val))
        ) {
            console.log("In col, for cell: "+ i, j  +" and " + k,j +" and values: " + a[0], a[1]);
            // code to remove a[0],a[1] or 'a.forEach()' from row ecxept i,k.
            // for(let n = 0; n< 9; n++){
            //     if(n!=i && n!= k){
            //         cellArray[n][j].probable_values = cellArray[i][n].probable_values.filter((val)=> val!=a[0]);
            //         cellArray[n][j].probable_values = cellArray[i][n].probable_values.filter((val)=> val!=a[1]);
            //     }
            // }
            // If these two cells are in same square then remove from that square also.
        }
    }
}
