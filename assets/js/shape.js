"use strict";

class Shape{
    constructor(context){
        this.context = context;
        // this.color = color;
        // this.shape = shape;
        
        // // Начальная позиция
        // this.x = coordinates[0];
        // this.y = coordinates[1];

        // Предыдущие координаты
        this.oldX;
        this.oldY;
    }

    draw (field) {
        for (let i = 0; i < field.grid.length; i++){
            for (let j = 0; j < field.grid[i].length; j++){
                if (field.grid[i][j] > 0){
                    if (field.grid[i][j] === 8) this.context.fillStyle = this.color;
                    else this.context.fillStyle = colors[field.grid[i][j]];
                    this.context.fillRect(fieldLeft + j * blockSize, 
                                          i * blockSize, 
                                          blockSize, blockSize);
                }
            }
        }
    }

    move(action) {
        // Записываем старые координаты
        this.oldX = shape.x;
        this.oldY = shape.y;
        if (action === 'moveLeft') this.x -= 1;
        if (action === 'moveRight') this.x += 1;
        if (action === 'moveDown') this.y += 1;
        if (action === 'rotate') this.rotate();
    }

    checkPosition() {
        if (this.x < 0) this.x = 0;
        if (this.x + this.shape.length - 1 > 9) 
            this.x -= this.x + (this.shape.length - 1) - (field.grid[0].length - 1);
        if (this.y === -1) this.y = 0;
        if (this.y + this.shape.length > 19) this.y = this.y - (this.y + (this.shape.length - 1) - 19);
    }

    rotate() {
        for (let y = 0; y < shape.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
              [shape.shape[x][y], shape.shape[y][x]] = 
              [shape.shape[y][x], shape.shape[x][y]];
            }
        }
        this.shape.forEach(row => row.reverse());
        this.checkPosition();
    }

    spawnShape(){
        // Генерируем случайный тип фигурки
        this.shapeType = this.randomizeShapeType();

        // Присваем начальные координаты фигурке (Если это кубик, то x = 4)
        this.x = this.shapeType === 4 ? 4 : 3;
        this.y = this.shapeType === 1 ? -1 : 0;

        // Создаём переменные для хранения предыдущих координат
        this.oldX;
        this.oldY;

        // Присваеваем фигурке форму
        this.shape = shapes[this.shapeType];
        // Присваеваем фигурке цвет
        this.color = colors[this.shapeType];
    }

    randomizeShapeType(){
        return Math.floor(Math.random() * 7 + 1);
    }
}