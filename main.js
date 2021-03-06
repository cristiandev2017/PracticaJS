//Este es el MODELO (MVC)
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
        //Las barras
        this.bars = [];
        //La pelota
        this.ball = null;
    }

    //Se modifica el prototipo de Board
    self.Board.prototype = {
        //Geter(Seran las barras)
        get elements() {
            var elements = this.bars.map(function(bar) { return bar; });
            //Se agrega una pelota
            elements.push(this.ball);
            return elements;
        }
    }
})();

//Ahora se creara la funcion de la pelota
(function() {
    self.Ball = function(x, y, radius, board) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.board = board;
            this.speed_y = 0;
            this.speed_x = 3;
            this.board = board;
            this.direction = 1;
            this.bounce_angle = 0;
            this.max_bounce_angle = Math.PI / 12;
            this.speed = 3;

            board.ball = this;
            this.kind = "circle";
        }
        //Haremos que la pelota se mueva
    self.Ball.prototype = {
        move: function() {
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);
        },
        get width() {
            return this.radius * 2;
        },
        get height() {
            return this.radius * 2;
        },

        collision: function(bar) {
            //Reacciona a la colision a la barra que recibe como parametro
            var relative_intersect_y = (bar.y + (bar.height / 2)) - this.y;

            var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);

            if (this.x > (this.board.width / 2)) this.direction = -1;
            else this.direction = 1;

        }
    }
})();

//Se generara una nueva clase (Dibuja las barras)
(function() {
    //Aca se le pasara la posicion(x,y) el alto y el ancho y el tablero
    self.Bar = function(x, y, width, height, board) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;

        //Accedo al vector(arreglo) que iniciamos arriba y le mandamos el objeto total osea la barra 
        this.board.bars.push(this);
        //Este es para decirle que elemento es para que canvas sepa como dibujarlo
        this.kind = "rectangle";
        this.speed = 10;
    }

    self.Bar.prototype = {
        down: function() {
            this.y += this.speed;
        },
        up: function() {
            this.y -= this.speed;
        },
        toString: function() {
            return "x:" + this.x + "y:" + this.y;

        }
    }
})();

//Esta es la vista en el modelo (MVC)
(function() {
    self.BoardView = function(canvas, board) {
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        //Con este dibujaremos
        this.ctx = canvas.getContext("2d");
    }

    self.BoardView.prototype = {
        clean: function() {
            this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        },
        draw: function() {
            for (var i = this.board.elements.length - 1; i >= 0; i--) {
                var el = this.board.elements[i];

                draw(this.ctx, el);
            };
        },
        check_collisions: function() {
            for (var i = this.board.bars.length - 1; i >= 0; i--) {
                var bar = this.board.bars[i];
                if (hit(bar, this.board.ball)) {
                    this.board.ball.collision(bar);
                }
            };
        },
        play: function() {
            if (this.board.playing) {
                this.clean();
                this.draw();
                this.check_collisions();
                this.board.ball.move();
            }

        }
    }

    function hit(a, b) {

        if (this.ball.x < 0 || this.ball.x > 800) {
            board.playing = false;
            let mensaje = document.getElementById("gameover");
            mensaje.innerHTML = "<h3 style='color:green;'>Juego terminado!</h3>";
            setTimeout(function() {
                location.reload()
            }, 2000);
            //location.reload()
        }
        //Revisa si a colisiona con b
        var hit = false;
        //Colisiones horizontales
        if (b.x + b.width >= a.x && b.x < a.x + a.width) {
            //Colisiones verticales
            if (b.y + b.height >= a.y && b.y < a.y + a.height)
                hit = true;
        }
        //Colisiones de a con b
        if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
            if (b.y <= a.y && b.y + b.height >= a.y + a.height)
                hit = true;
        }
        //Colisiones de b con a
        if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
            if (a.y <= b.y && a.y + a.height >= b.y + b.height)
                hit = true;
        }
        return hit;

    }
    //Aca implementaremos unas funciones las cuales no son de un objeto, pero que nos ayudan a realizar ciertas cosas
    //Este dibujara los elementos
    function draw(ctx, element) {
        //Dibuja el objeto la pelotica y las barras
        switch (element.kind) {
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radius, 0, 7);
                ctx.fill();
                ctx.closePath();
                break;
        }
    }

})();

//Creo el tablero
var board = new Board(800, 400);
//Creo la barra
var bar = new Bar(20, 100, 10, 100, board);
var bar_2 = new Bar(738, 100, 10, 100, board);
var bar_up = new Bar(0, 0, 800, 10, board);
var bar_down = new Bar(0, 390, 800, 10, board);
var canvas = document.getElementById('canvas');
var board_view = new BoardView(canvas, board);
var ball = new Ball(350, 100, 10, board);



//Aca esta pendiente del keydown el cual es un evento de teclado sucede cuando se preciona una tecla
document.addEventListener("keydown", function(ev) {
    //aca inicializa con las teclas de arriba y la tecla hacia abajo
    console.log(ev.keyCode);
    if (ev.keyCode === 87) {
        ev.preventDefault();
        bar.up();
    } else if (ev.keyCode === 83) {
        ev.preventDefault();
        bar.down();
    } else if (ev.keyCode === 38) {
        ev.preventDefault();
        bar_2.up();
    } else if (ev.keyCode === 40) {
        ev.preventDefault();
        bar_2.down();
    } else if (ev.keyCode === 32) {
        ev.preventDefault();
        board.playing = !board.playing;
    }
    //Con esta linea podemos saber la coordenada con la que esta cambiando la barra
    //console.log(bar.toString()) = console.log(""+bar);
});

board_view.draw();

//Aca esta pendiente de que cargue la pagina cuando carga llama el metodo main
//self.addEventListener("load", main);

window.requestAnimationFrame(controller);
//Este seria el Controlador (MVC)
function controller() {
    board_view.play();
    window.requestAnimationFrame(controller);
}