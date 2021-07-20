import Chess from './Chess';

let pieceValues = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 0
}


let evaluation = (game, color) => {
    if (game.in_stalemate()) return 0;
    if (game.in_checkmate()) {
        if (game.getTurn() === color) return -999;
        else return 999;
    }
    let total = 0;

    let board = game.getBoard();

    for (let i = 0; i < board.length; i++) {

        if (board[i]) {
            let sign = color === board[i].color ? 1 : -1
            total = total + pieceValues[`${board[i].type}`] * sign;
            // total += game.moves(i).length;
        }
    }
    
    return total;
}

function findMove(game, depth) {
    let bestMove = null;
    let bestEval = Number.NEGATIVE_INFINITY;
    let moves = game.getAllMoves(game.getTurn());
    for (let i = 0; i < moves.length; i++) {
        // makes move on gameState
        let newGS = game.getGameState();
        game.tmove(moves[i].from, moves[i].to, newGS);

        // imports gameState to new Chess object
        let child = new Chess();
        child.importGameState(newGS);

        let score = minimax(child, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false, game.getTurn());
        if (score > bestEval) {
            bestEval = score;
            bestMove = moves[i];
        }
    }
    console.log(bestEval);
    return bestMove;
}

function minimax(game, depth, alpha, beta, isMaximizing, color) {

    if (depth === 0 || game.in_checkmate() || game.in_stalemate()) {
        return evaluation(game, color);
    }

    if (isMaximizing) {
        let maxEval = Number.NEGATIVE_INFINITY;
        let moves = game.getAllMoves(game.getTurn());
        for (let i = 0; i < moves.length; i++) {
            // makes move on gameState
            let newGS = game.getGameState();
            game.tmove(moves[i].from, moves[i].to, newGS);

            // imports gameState to new Chess object
            let child = new Chess();
            child.importGameState(newGS);

            let score = minimax(child, depth - 1, alpha, beta, false, color);
            maxEval = Math.max(maxEval, score);

            if (beta <= alpha) break;
        }
        return maxEval;
    }
    else {
        let minEval = Number.POSITIVE_INFINITY;
        let moves = game.getAllMoves(game.getTurn());
        for (let i = 0; i < moves.length; i++) {
            // makes move on gameState
            let newGS = game.getGameState();
            game.tmove(moves[i].from, moves[i].to, newGS);

            // imports gameState to new Chess object
            let child = new Chess();
            child.importGameState(newGS);

            let score = minimax(child, depth - 1, alpha, beta, false, color);
            minEval = Math.min(minEval, score);

            if (beta <= alpha) break;
        }
        return minEval;
    }
}

export default findMove;
