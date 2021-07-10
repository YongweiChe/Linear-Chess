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


        this.board = [...STARTING_BOARD];
        this.isWhiteTurn = true;
        this.moveCount = 1;
        this.kings = {white: 0, black: 17};
    }

    getBoard() { // returns array of board
        return this.board;
    }

    get(square) { // gets piece on square
        return this.board[square];
    }
    
    move(from, to) {
        this.tmove(from, to, this.board, 0, 0);
        this.isWhiteTurn = !this.isWhiteTurn;
        this.moveCount++;
    }

    tmove(from, to, board, isWhiteTurn, moveCount) { // moves a piece
        const piece = board[from];

        if (piece !== null) {
            board[from] = null;
            board[to] = piece;
        }
        isWhiteTurn = !isWhiteTurn;
        moveCount++;
    }

    attacks(square) {
        return this.tattacks(square, this.board, this.moveCount);
    }

    tattacks(square, board, moveCount) { // generates attacks for a piece
        let piece = board[square];
        let type = piece.type;
        let color = piece.color;
        let moves = [];
        if (type === 'king') moves = this.kingMoves(color, square, board);
        else if (type === 'queen') moves = this.queenMoves(color, square, board);
        else if (type === 'rook') moves = this.rookMoves(color, square, board);
        else if (type === 'bishop') moves = this.bishopMoves(color, square, board);
        else if (type === 'knight') moves = this.knightMoves(color, square, board);
        else if (type === 'pawn') moves = this.pawnMoves(color, square, board, moveCount);

        return moves.map((move) => {
            return move.to;
        });
    }

    getAllAttacks(color) {
        return this.tgetAllAttacks(color, this.board, this.moveCount);
    }

    tgetAllAttacks(color, board, moveCount) {
        let attacks = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] && board[i].color === color) {
                attacks = attacks.concat(this.tattacks(i, board, moveCount));
            }
        }
        return attacks;
    }

    moves(square) {
        return this.tmoves(square, this.board, this.moveCount);
    }

    tmoves(square, board, moveCount) { // generates legal moves
        let piece = board[square];
        let type = piece.type;
        let color = piece.color;
        let moves = [];
        if (type === 'king') moves = this.kingMoves(color, square, board);
        else if (type === 'queen') moves = this.queenMoves(color, square, board);
        else if (type === 'rook') moves = this.rookMoves(color, square, board);
        else if (type === 'bishop') moves = this.bishopMoves(color, square, board);
        else if (type === 'knight') moves = this.knightMoves(color, square, board);
        else if (type === 'pawn') moves = this.pawnMoves(color, square, board, moveCount);

        let legalMoves = [];
        if (this.in_check()) {
            for (let i = 0; i < moves.length; i++) {
                theoreticalBoard = this.board.map(x => x);
                tmove(moves[i].from, moves[i].to, theoreticalBoard, this.isWhiteTurn, this.moveCount);
                if (!this.tin_check()) legalMoves.push(moves[i]);
            }
        }

        return moves;
    }

    createMove(f, t) {
        return ({from: f, to: t})
    }

    jump(from, to, moves, color, board) {
        if (!board[to] || board[to].color !== color) {
            moves.push(this.createMove(from, to));
        }
    }

    pawnMoves(color, from, board, moveCount) {
        let moves = [];
        if (color === 'white') {
            if (from < 17) this.jump(from, from + 1, moves, color, board);

            if(this.moveCount === 1 || this.moveCount === 2) {
                this.jump(from, from + 2, moves, color, board);
            }
        }
        else {
            if (from > 0) this.jump(from, from - 1, moves, color, board);

            if(this.moveCount === 1 || this.moveCount === 2) {
                this.jump(from, from - 2, moves, color, board);
            }
        }
        return moves;
    }

    knightMoves(color, from, board) {
        let moves = [];

        if (from + 2 < 18) this.jump(from, from + 2, moves, color, board);
        if (from + 3 < 18) this.jump(from, from + 3, moves, color, board);
        if (from - 2 >= 0)  this.jump(from, from - 2, moves, color, board);
        if (from - 2 >= 0)  this.jump(from, from - 3, moves, color, board);

        return moves;
    }

    bishopMoves(color, from, board) {
        let moves = [];
        const dist = 2;
        let to = from + dist;
        let hitPiece = false;
        while (to < 18 && !hitPiece) {
            if (board[to] !== null) hitPiece = true;
            this.jump(from, to, moves, color, board);
            to += dist;
        }

        to = from - dist;
        hitPiece = false;

        while (to >= 0  && !hitPiece) {
            if (board[to] !== null) hitPiece = true;
            this.jump(from, to, moves, color, board);
            to -= dist;
        }

        return moves
    }

    rookMoves(color, from, board) {
        let moves = [];
        const dist = 1;
        let to = from + dist;

        while (to < 18) {
            if (board[to] !== null) break;
            this.jump(from, to, moves, color, board);
            to += dist;
        }

        to = from - dist;

        while (to >= 0) {
            if (board[to] !== null) break;
            this.jump(from, to, moves, color, board);
            to -= dist;
        }

        return moves
    }

    queenMoves(color, from, board) {
        return this.bishopMoves(color, from, board).concat(this.rookMoves(color, from, board));
    }

    kingMoves(color, from, board) {
        let moves = [];
        if (from < 17) this.jump(from, from + 1, moves, color, board);
        if (from > 0) this.jump(from, from - 1, moves, color, board);

        return moves;
    }

    getAllMoves(color) { // gets all moves for color
        let allMoves = [];
    
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i] && this.board[i].color === color) {
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
        let color = this.isWhiteTurn ? 'white' : 'black';
        let kingPos = this.isWhiteTurn ? this.kings.white : this.kings.black;
        return this.tin_check(kingPos, color, this.board, this.moveCount);
    }

    tin_check(kingLoc, color, board, moveCount) {
        let oppColor = (color === 'white') ? 'black' : 'white';
        if (this.tgetAllAttacks(oppColor, board, moveCount).includes(kingLoc)) return true;
        return false;
    }

    in_checkmate() { // checks whether king is in checkmate
        if (!this.getAllMoves(this.isWhiteTurn ? 'white' : 'black') && this.in_check()) return true;
        return false;
    }

    in_stalemate() { // checks whether stalemate
        if (!this.getAllMoves(this.isWhiteTurn ? 'white' : 'black') && !this.in_check()) return true;
        return false;
    }

    in_draw() { // NEED TO IMPLEMENT
        return false;
    }
}

// TESTING

let game = new Chess();

console.log(game.getBoard());
console.log(game.moves(6));
console.log(game.moves(5));
console.log(game.getAllMoves('black'));