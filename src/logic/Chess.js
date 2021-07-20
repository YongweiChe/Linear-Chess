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

        this.gameState = {
            board: [...STARTING_BOARD],
            isWhiteTurn: true,
            moveCount: 1,
            kings: {white: 0, black: 17},
            pawns: {white: true, black: true}
        }
    }


    getGameState() {
        let gS = this.gameState;
        return {
            board: [...gS.board],
            isWhiteTurn: gS.isWhiteTurn,
            moveCount: gS.moveCount,
            kings: {white: gS.kings.white, black: gS.kings.black },
            pawns: {white: gS.pawns.white, black: gS.pawns.black }
        };
    }

    importGameState(gS) {
        this.gameState = {
            board: [...gS.board],
            isWhiteTurn: gS.isWhiteTurn,
            moveCount: gS.moveCount,
            kings: gS.kings,
            pawns: gS.pawns
        }
    }

    getBoard() { // returns array of board
        return this.gameState.board;
    }

    getTurn() {
        return this.gameState.isWhiteTurn ? 'white' : 'black';
    }

    getMoveCount() {
        return this.gameState.moveCount;
    }

    get(square) { // gets piece on square
        return this.gameState.board[square];
    }
    
    move(from, to) {
        this.tmove(from, to, this.gameState);
    }

    tmove(from, to, gameState) { // moves a piece
        const piece = gameState.board[from];

        if (piece !== null) {
            gameState.board[from] = null;
            gameState.board[to] = piece;
            
            if (piece.type === 'king') {
                if (piece.color === 'white') gameState.kings.white = to;
                else gameState.kings.black = to;
            }
            if (piece.type === 'pawn') {
               if (piece.color === 'white') {
                   if (gameState.pawns.white) gameState.pawns.white = false;
               }
               else {
                   if (gameState.pawns.black) gameState.pawns.black = false;
               }
            }
            
        }
        gameState.isWhiteTurn = !gameState.isWhiteTurn;
        gameState.moveCount++;
    }

    attacks(square) {
        return this.tattacks(square, this.gameState);
    }

    tattacks(square, gameState) { // generates attacks for a piece
        let piece = gameState.board[square];
        let type = piece.type;
        let color = piece.color;
        let moves = [];
        if (type === 'king') moves = this.kingMoves(color, square, gameState);
        else if (type === 'queen') moves = this.queenMoves(color, square, gameState);
        else if (type === 'rook') moves = this.rookMoves(color, square, gameState);
        else if (type === 'bishop') moves = this.bishopMoves(color, square, gameState);
        else if (type === 'knight') moves = this.knightMoves(color, square, gameState);
        else if (type === 'pawn') moves = this.pawnMoves(color, square, gameState);

        return moves.map((move) => {
            return move.to;
        });
    }

    getAllAttacks(color) {
        return this.tgetAllAttacks(color, this.gameState);
    }

    tgetAllAttacks(color, gameState) {
        let attacks = [];
        for (let i = 0; i < gameState.board.length; i++) {
            if (gameState.board[i] && gameState.board[i].color === color) {
                attacks = attacks.concat(this.tattacks(i, gameState));
            }
        }
        return attacks;
    }

    moves(square) {
        return this.tmoves(square, this.gameState);
    }

    tmoves(square, gameState) { // generates legal moves
        let piece = gameState.board[square];
        let type = piece.type;
        let color = piece.color;
        let moves = [];
        if (type === 'king') moves = this.kingMoves(color, square, gameState);
        else if (type === 'queen') moves = this.queenMoves(color, square, gameState);
        else if (type === 'rook') moves = this.rookMoves(color, square, gameState);
        else if (type === 'bishop') moves = this.bishopMoves(color, square, gameState);
        else if (type === 'knight') moves = this.knightMoves(color, square, gameState);
        else if (type === 'pawn') moves = this.pawnMoves(color, square, gameState);

            let legalMoves = [];
            for (let i = 0; i < moves.length; i++) {
                let theoreticalBoard = gameState.board.map(x => x); //this.board.map
                let theoreticalgameState = {
                    board: theoreticalBoard,
                    isWhiteTurn: gameState.isWhiteTurn,
                    moveCount: gameState.moveCount,
                    kings: {white: gameState.kings.white, black: gameState.kings.black},
                    pawns: {white: gameState.pawns.white, black: gameState.pawns.black}
                };
                this.tmove(moves[i].from, moves[i].to, theoreticalgameState);

                if (!this.tin_check(color, theoreticalgameState)) {
                    legalMoves.push(moves[i]);
                }
            }
            return legalMoves;
    }


    getAllMoves(color) { // gets all moves for color
        let allMoves = [];
    
        for (let i = 0; i < this.gameState.board.length; i++) {
            if (this.gameState.board[i] && this.gameState.board[i].color === color) {
                let m = this.moves(i);

                allMoves = allMoves.concat(m);
            }
        }
        return allMoves;
    }

    createMove(f, t) {
        return ({from: f, to: t})
    }

    jump(from, to, moves, color, board) {
        if (!board[to] || board[to].color !== color) {
            moves.push(this.createMove(from, to));
        }
    }

    pawnMoves(color, from, gameState) { // FIX LOGIC
        let moves = [];
        if (color === 'white') {
            if (from < 17) this.jump(from, from + 1, moves, color, gameState.board);

            if(gameState.pawns.white && !gameState.board[from + 1]) {
                this.jump(from, from + 2, moves, color, gameState.board);
            }
        }
        else {
            if (from > 0) this.jump(from, from - 1, moves, color, gameState.board);

            if(gameState.pawns.black && !gameState.board[from - 1]) {
                this.jump(from, from - 2, moves, color, gameState.board);
            }
        }
        return moves;
    }

    knightMoves(color, from, gameState) {
        let moves = [];

        if (from + 2 < 18) this.jump(from, from + 2, moves, color, gameState.board);
        if (from + 3 < 18) this.jump(from, from + 3, moves, color, gameState.board);
        if (from - 2 >= 0)  this.jump(from, from - 2, moves, color, gameState.board);
        if (from - 2 >= 0)  this.jump(from, from - 3, moves, color, gameState.board);

        return moves;
    }

    bishopMoves(color, from, gameState) {
        return this.brMoves(color, from, gameState, 2);
    }

    rookMoves(color, from, gameState) {
        return this.brMoves(color, from, gameState, 1);
    }

    brMoves(color, from, gameState, dist) {
        let moves = [];
        let to = from + dist;
        let hitPiece = false;
        while (to < 18 && !hitPiece) {
            if (gameState.board[to] !== null) hitPiece = true;
            this.jump(from, to, moves, color, gameState.board);
            to += dist;
        }

        to = from - dist;
        hitPiece = false;

        while (to >= 0  && !hitPiece) {
            if (gameState.board[to] !== null) hitPiece = true;
            this.jump(from, to, moves, color, gameState.board);
            to -= dist;
        }

        return moves
    }

    queenMoves(color, from, gameState) {
        return this.bishopMoves(color, from, gameState).concat(this.rookMoves(color, from, gameState));
    }

    kingMoves(color, from, gameState) {
        let moves = [];
        if (from < 17) this.jump(from, from + 1, moves, color, gameState.board);
        if (from > 0) this.jump(from, from - 1, moves, color, gameState.board);

        if (from < 16 && !gameState.board[from + 1]) this.jump(from, from + 2, moves, color, gameState.board);
        if (from > 1  && !gameState.board[from - 1]) this.jump(from, from - 2, moves, color, gameState.board);

        return moves;
    }


    game_over() { // returns boolean whether game is over
        if (this.in_checkmate() || this.in_stalemate() || this.in_draw()) {
            return true;
        }
        return false;
    }

    in_check() { // checks whether king is in check
        let color = this.gameState.isWhiteTurn ? 'white' : 'black';
        return this.tin_check(color, this.gameState);
    }

    tin_check(color, gameState) {
        let oppColor = (color === 'white') ? 'black' : 'white'; // IS THIS RIGHT???
        let kingPos = (color === 'white') ? gameState.kings.white : gameState.kings.black;
        if (this.tgetAllAttacks(oppColor, gameState).includes(kingPos)) return true;
        return false;
    }

    in_checkmate() { // checks whether king is in checkmate
        if (this.getAllMoves(this.gameState.isWhiteTurn ? 'white' : 'black').length === 0 && this.in_check()) return true;
        return false;
    }

    in_stalemate() { // checks whether stalemate
        if (this.getAllMoves(this.gameState.isWhiteTurn ? 'white' : 'black').length === 0 && !this.in_check()) return true;

        let count = 0;
        for (let i = 0; i < this.gameState.board.length; i++) {

            if (this.gameState.board[i] !== null) count++;
        }
        if (count <= 2) return true;
        return false;
    }

    
}

export default Chess;
