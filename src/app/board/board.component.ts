import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  gameArr = [
    ' ', ' ', ' ',
    ' ', ' ', ' ',
    ' ', ' ', ' '
  ];
  game = [
    ' ', ' ', ' ',
    ' ', ' ', ' ',
    ' ', ' ', ' '
  ];
  words;
  moves = [];
  turn = true; // Human starts first.
  humanIsX = true;
  ngOnInit() {}

  play(num) { // Human gives the move they would like to play.
    if (this.turn && this.moveIsAvailable(this.gameArr, num)) { // If the move is available AND it is the human's turn,
      this.gameArr[num] = 'X'; // place the 'X'.
      this.game[num] = this.humanIsX? 'X':'O';
      this.turnOver(); // Computer's turn.
    } else {
      this.words = "No!";
      return;
    }
    const result = this.winning(this.gameArr, true); // Check for a win or tie.
    if (result === -10) {
      this.words = this.humanIsX?"X wins.":"O wins."; //who won.
      setTimeout(() => {
        this.reset();
      }, 2000); // Resets after 2 Seconds
    } else if (result === 10) {
      this.words = this.humanIsX?"O wins.":"X wins."; // who won.
      setTimeout(() => {
        this.reset();
      }, 2000);// Resets after 2 Seconds
    } else if (result === 0) {
      this.words = "Tie game."; //  it's a tie.
      setTimeout(() => {
        this.reset();
      }, 2000); // Resets after 2 Seconds
    } else {
      const compy = this.compMove();
      this.gameArr[compy] = 'O';
      this.game[compy] = this.humanIsX? 'O':'X'; // Place the appropriate letter based on who is X
      if (this.winning(this.gameArr, !this.humanIsX) === 10) {
        this.words = this.humanIsX?"O wins.":"X wins";
        setTimeout(() => {
          this.reset();
        }, 2000);
      } else if (this.winning(this.gameArr, this.humanIsX) === 0) {
        this.words = 'Tie game.';
        setTimeout(() => {
          this.reset();
        }, 2000);
      } else {
        this.turnOver(); // Human's turn.
      }
    }
  }
  compMove() {
    this.moves = [];
    let move;
    let maxScore = -100; // Like setting the max score to -infinity
    for (let i = 0; i < this.gameArr.length; i++) {
      if (this.moveIsAvailable(this.gameArr, i)) { // If the move is available,
        let trialArray = this.copyArray(this.gameArr); // copy the array, and
        trialArray[i] = 'O'; // place an 'O'.
        let prediction = this.min(trialArray, 1);
        if (prediction > maxScore) {
          maxScore = prediction;
          move = i; // The move will be set to the move with the greatest possible score.
        }
        this.moves.push([i, maxScore]);
      }
    }
    return move; // Returns the move.
  }

  min(arr, turns) {
    if (this.winning(arr, false) === 0) {
      return 0;
    } else if (this.winning(arr, false) === 10) { // Check if the previous move results in win for O
      return 10 - turns;
    } else {
      const newTurns = 1 + turns;
      let minScore = 100; // Like to setting the minScore to infinity
      for (let i = 0; i < arr.length; i++) {
        if (this.moveIsAvailable(arr, i)) { // If the move is available,
          const trialArray = this.copyArray(arr); // copy the array, and
          trialArray[i] = 'X'; // place an 'X'.
          const prediction = this.max(trialArray, newTurns);
          if (prediction < minScore) {
            minScore = prediction; // (and it will be), change minScore to the lowest value.
          }
        }
      }
      return minScore;
    }
  }

  max(arr, turns) {
    if (this.winning(arr, true) === -10) { // Check if the previous move will result in a win for X and
      return turns - 10; // return turns-10.
    } else if (this.winning(arr, false) === 0) { // Check if previous move will result in tie and
      return 0; // return 0;
    } else {
      const newTurns = 1 + turns;
      let maxScore = -100;
      for (let i = 0; i < arr.length; i++) {
        if (this.moveIsAvailable(arr, i)) { // If the move is available,
          const trialArray = this.copyArray(arr); // Create a unique copy of the array, and
          trialArray[i] = 'O'; // place an 'O'.
          const prediction = this.min(trialArray, newTurns);
          if (prediction > maxScore) {
            maxScore = prediction;
          }
        }
      }
      return maxScore;
    }
  }

  copyArray(arr) { // Creates a copy of an array.
    return arr.slice();
  }

  moveIsAvailable(arr, move) { // If the space is empty, return true.
    return arr[move] === ' ' ? true : false;
  }

  turnOver() { // Change whether human's or computer's turn.
    this.turn = !this.turn;
  }

  reset() { // Resets the game to original status.
    this.turn = true;
    this.gameArr = [
      ' ', ' ', ' ',
      ' ', ' ', ' ',
      ' ', ' ', ' '
    ];
    this.game = [
      ' ', ' ', ' ',
      ' ', ' ', ' ',
      ' ', ' ', ' '
    ];
    this.moves = [];
    this.words='';
    this.humanIsX = true;
  }

  winning(trialArray, x) { // Checks for a win for X or O.
    let letter; // If X wins, return -10;
    if (x) { // if O wins, return 10;
      letter = 'X';
    } else {
      letter = 'O';
    }
    if (
      trialArray[0] === letter && // * * *
      trialArray[1] === letter && // ' ' '
      trialArray[2] === letter || // ' ' '

      trialArray[3] === letter && // ' ' '
      trialArray[4] === letter && // * * *
      trialArray[5] === letter || // ' ' '

      trialArray[6] === letter && // ' ' '
      trialArray[7] === letter && // ' ' '
      trialArray[8] === letter || // * * *

      trialArray[0] === letter && // * ' '
      trialArray[3] === letter && // * ' '
      trialArray[6] === letter || // * ' '

      trialArray[1] === letter && // ' * '
      trialArray[4] === letter && // ' * '
      trialArray[7] === letter || // ' * '

      trialArray[2] === letter && // ' ' *
      trialArray[5] === letter && // ' ' *
      trialArray[8] === letter || // ' ' *

      trialArray[0] === letter && // * ' '
      trialArray[4] === letter && // ' * '
      trialArray[8] === letter || // ' ' *

      trialArray[2] === letter && // ' ' *
      trialArray[4] === letter && // ' * '
      trialArray[6] === letter    // * ' '
    ) {
      if (x) {
        return -10;
      } else {
        return 10;
      }
    } else if (trialArray.indexOf(' ') === -1) {
      return 0;

    } else {
      return 'no';
    }
  }


}
