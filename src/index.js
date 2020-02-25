import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

// class Square extends React.Component {
//     render() {
//         return (
//             <button 
//                 className="square" 
//                 onClick={() => this.props.onClick()}
//             >
//                 {this.props.value}
//             </button>
//         );
//     }
// }

function Square(props) {
    console.log(props)
    return (
        <button 
            className={props.isWinning ? "square winning" : "square"} 
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
            isWinning: false
        };
    }

    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
                key={i}
                isWinning={this.props.winnerSquare.includes(i)}
            />
        );
    }

    render() {
        return (
            <div>
                {Array(3).fill(null).map((a, i) => { 
                    return (
                        <div key={i} className="board-row">
                            {Array(3).fill(null).map((b, j) => {
                                return (this.renderSquare(i * 3 + j))
                            })}
                        </div>
                    )
                })}
            </div>    
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            isDesc: false
        };
    }
    
    handleClick(i) {
        const location = Array(9).fill(null).map((a, b) => [parseInt(b / 3) + 1, b % 3 + 1]);
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: location[i]
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    changeSort() {
        this.setState({
            isDesc: !this.state.isDesc
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ' at (' + history[move].location + ')':
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {move === this.state.stepNumber ? <b>{desc}</b> : desc}
                    </button>
                </li>
            )
        })

        let status;
        if (winner)  {
            status = 'Winner: ' + winner.player; 
        } else if (!current.squares.includes(null)) {
            status = 'Draw!'
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winnerSquare={winner ? winner.line : []}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>
                        <button onClick={() => this.changeSort()}>
                            {this.state.isDesc ? "Descending" : "Ascending"}
                        </button>
                    </div>
                    <ol>{this.state.isDesc ? moves.reverse() : moves}</ol>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Game />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { player: squares[a], line: [a, b, c] };
      }
    }
    return null;
  }