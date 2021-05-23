//Funcion anonima
(function() {
    //Se define una variable como clase y en ella se crea un constructor
    self.Board = function(width, height) {
        //Se asigna a variables de la clase (Constructor)
        //Ancho
        this.width = width;
        //Alto
        this.height = height;
        //Si esta jugando
        this.playing = false;
        //Finalizo el juego
        this.game_over = false;
        //Las barras
        this.bars = [];
        //La pelota
        this.ball = null;
    }

    //Se modifica el prototipo de Board
    self.Board.prototype = {
        //Geter(Seran las barras)
        get elements() {
            var elements = this.bars;
            //Se agrega una pelota
            elements.push(ball);
            return elements;
        }
    }
})();

(function() {
    self.BoardView = function(canvas, board) {
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        //Con este dibujaremos
        this.ctx = canvas.getContext("2d");
    }
})();

window.addEventListener("load", main);

function main() {
    var board = new Board(800, 400);
    var canvas = document.getElementById('canvas');
    var board_view = new BoardView(canvas, board);

}