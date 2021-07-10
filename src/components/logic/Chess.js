class Chess {
    // TODO: Castling
    constructor() {
        const STARTING_BOARD = 
        [
            {type: 'king', color: 'white'},
            {type: 'queen', color: 'white'},
            {type: 'rook', color: 'white'},
            {type: 'bishop', color: 'white'},
            {type: 'bishop', color: 'white'},
            {type: 'knight', color: 'white'},
            {type: 'pawn', color: 'white'},
            null,null,null,null,
            {type: 'pawn', color: 'black'},
            {type: 'knight', color: 'black'},
            {type: 'bishop', color: 'black'},
            {type: 'bishop', color: 'black'},
            {type: 'rook', color: 'black'},
            {type: 'queen', color: 'black'},
            {type: 'king', color: 'black'}
        ];

        this.state = {
            board: [...STARTING_BOARD],
            isWhiteTurn: true,
            moveCount: 1,
            kings: {white: 0, black: 17},
            pawns: {white: true, black: true}
        }
    }

    getBoard() { // returns array of board
        return this.state.board;
    }

    getTurn() {
        return this.state.isWhiteTurn ? 'white' : 'black';
    }

    getMoveCount() {
        return this.state.moveCount;
    }

    get(square) { // gets piece on square
        return this.state.board[square];
    }
    
    move(from, to) {
        this.tmove(from, to, this.state);
    }

    tmove(from, to, state) { // moves a piece
        const piece = state.board[from];

        if (piece !== null) {
            state.board[from] = null;
            state.board[to] = piece;
            
            if (piece.type === 'king') {
                if (piece.color === 'white') state.kings.white = to;
                else state.kings.black = to;
            }
            
        }
        state.isWhiteTurn = !state.isWhiteTurn;
        state.moveCount++;
    }

    attacks(square) {
        return this.tattacks(square, this.state);
    }

    tattacks(square, state) { // generates attacks for a piece
        let piece = state.board[square];
        let type = piece.type;
        let color = piece.color;
        let moves = [];
        if (type === 'king') moves = this.kingMoves(color, square, state);
        else if (type === 'queen') moves = this.queenMoves(color, square, state);
        else if (type === 'rook') moves = this.rookMoves(color, square, state);
        else if (type === 'bishop') moves = this.bishopMoves(color, square, state);
        else if (type === 'knight') moves = this.knightMoves(color, square, state);
        else if (type === 'pawn') moves = this.pawnMoves(color, square, state);

        return moves.map((move) => {
            return move.to;
        });
    }

    getAllAttacks(color) {
        return this.tgetAllAttacks(color, this.state);
    }

    tgetAllAttacks(color, state) {
        let attacks = [];
        for (let i = 0; i < state.board.length; i++) {
            if (state.board[i] && state.board[i].color === color) {
                attacks = attacks.concat(this.tattacks(i, state));
            }
        }
        return attacks;
    }

    moves(square) {
        return this.tmoves(square, this.state);
    }

    tmoves(square, state) { // generates legal moves
        let piece = state.board[square];
        let type = piece.type;
        let color = piece.color;
        let moves = [];
        if (type === 'king') moves = this.kingMoves(color, square, state);
        else if (type === 'queen') moves = this.queenMoves(color, square, state);
        else if (type === 'rook') moves = this.rookMoves(color, square, state);
        else if (type === 'bishop') moves = this.bishopMoves(color, square, state);
        else if (type === 'knight') moves = this.knightMoves(color, square, state);
        else if (type === 'pawn') moves = this.pawnMoves(color, square, state);

        let legalMoves = [];
        if (this.in_check()) {
            for (let i = 0; i < moves.length; i++) {
                let theoreticalBoard = state.board.map(x => x); //this.board.map
                let theoreticalState = {
                    board: theoreticalBoard,
                    isWhiteTurn: state.isWhiteTurn,
                    moveCount: state.moveCount,
                    kings: {white: state.kings.white, black: state.kings.black},
                    pawns: {white: state.pawns.white, black: state.pawns.black}
                };
                this.tmove(moves[i].from, moves[i].to, theoreticalState);

                if (!this.tin_check(color, theoreticalState)) {
                    legalMoves.push(moves[i]);
                }
            }
        }

        return legalMoves;
    }

    createMove(f, t) {
        return ({from: f, to: t})
    }

    jump(from, to, moves, color, board) {
        if (!board[to] || board[to].color !== color) {
            moves.push(this.createMove(from, to));
        }
    }

    pawnMoves(color, from, state) { // FIX LOGIC
        let moves = [];
        if (color === 'white') {
            if (from < 17) this.jump(from, from + 1, moves, color, state.board);

            if(state.pawns.white) {
                state.pawns.white = false;
                this.jump(from, from + 2, moves, color, state.board);
            }
        }
        else {
            if (from > 0) this.jump(from, from - 1, moves, color, state.board);

            if(state.pawns.black) {
                state.pawns.black = false;
                this.jump(from, from - 2, moves, color, state.board);
            }
        }
        return moves;
    }

    knightMoves(color, from, state) {
        let moves = [];

        if (from + 2 < 18) this.jump(from, from + 2, moves, color, state.board);
        if (from + 3 < 18) this.jump(from, from + 3, moves, color, state.board);
        if (from - 2 >= 0)  this.jump(from, from - 2, moves, color, state.board);
        if (from - 2 >= 0)  this.jump(from, from - 3, moves, color, state.board);

        return moves;
    }

    bishopMoves(color, from, state) {
        let moves = [];
        const dist = 2;
        let to = from + dist;
        let hitPiece = false;
        while (to < 18 && !hitPiece) {
            if (state.board[to] !== null) hitPiece = true;
            this.jump(from, to, moves, color, state.board);
            to += dist;
        }

        to = from - dist;
        hitPiece = false;

        while (to >= 0  && !hitPiece) {
            if (state.board[to] !== null) hitPiece = true;
            this.jump(from, to, moves, color, state.board);
            to -= dist;
        }

        return moves
    }

    rookMoves(color, from, state) {
        let moves = [];
        const dist = 1;
        let to = from + dist;

        while (to < 18) {
            if (state.board[to] !== null) break;
            this.jump(from, to, moves, color, state.board);
            to += dist;
        }

        to = from - dist;

        while (to >= 0) {
            if (state.board[to] !== null) break;
            this.jump(from, to, moves, color, state.board);
            to -= dist;
        }

        return moves
    }

    queenMoves(color, from, state) {
        return this.bishopMoves(color, from, state).concat(this.rookMoves(color, from, state));
    }

    kingMoves(color, from, state) {
        let moves = [];
        if (from < 17) this.jump(from, from + 1, moves, color, state.board);
        if (from > 0) this.jump(from, from - 1, moves, color, state.board);

        return moves;
    }

    getAllMoves(color) { // gets all moves for color
        let allMoves = [];
    
        for (let i = 0; i < this.state.board.length; i++) {
            if (this.state.board[i] && this.state.board[i].color === color) {
                let m = this.moves(i);

                allMoves = allMoves.concat(m);
            }
        }
        return allMoves;
    }

    game_over() { // returns boolean whether game is over
        if (this.in_checkmate() || this.in_stalemate() || this.in_draw()) {
            return true;
        }
        return false;
    }

    in_check() { // checks whether king is in check
        let color = this.state.isWhiteTurn ? 'white' : 'black';
        return this.tin_check(color, this.state);
    }

    tin_check(color, state) {
        let oppColor = (color === 'white') ? 'black' : 'white'; // IS THIS RIGHT???
        let kingPos = (color === 'white') ? state.kings.white : state.kings.black;
        if (this.tgetAllAttacks(oppColor, state).includes(kingPos)) return true;
        return false;
    }

    in_checkmate() { // checks whether king is in checkmate
        if (!this.getAllMoves(this.state.isWhiteTurn ? 'white' : 'black') && this.in_check()) return true;
        return false;
    }

    in_stalemate() { // checks whether stalemate
        if (!this.getAllMoves(this.state.isWhiteTurn ? 'white' : 'black') && !this.in_check()) return true;
        return false;
    }

    in_draw() { // NEED TO IMPLEMENT
        return false;
    }
}

// TESTING

let game = new Chess();


game.move(6,8);
game.move(11,9);
game.move(5,6);
game.move(17,10);
game.move(8,9);
console.log(game.getBoard());
//console.log(game.getAllMoves('white'));
//console.log(game.getAllMoves('black'));
console.log(game.in_check());
console.log(game.getTurn());
console.log(game.getAllMoves('black'));
