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
                    if (field.grid[i][j] === 8) 
                        this.context.fillStyle = this.color;
                    else 
                        this.context.fillStyle = colors[field.grid[i][j]];
                    this.context.fillRect(fieldLeft + j * blockSize, i * blockSize, 
                                          blockSize, blockSize);
                    this.context.lineWidth = 3;
                    this.context.strokeStyle = "rgb(200, 200, 200)";
                    this.context.strokeRect(fieldLeft + j * blockSize, i * blockSize, 
                                            blockSize, blockSize);
                    // this.context.strokeRect(fieldLeft + j * blockSize + (blockSize / 4), i * blockSize + (blockSize / 4), 
                    //                         blockSize - (blockSize / 4) * 2, blockSize - (blockSize / 4) * 2);
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
        if (action === 'hardDrop'){
            for (;;){
                if (isNextMoveAvaible(field, this, 'ArrowDown')) this.y += 1;
                else break;
            }
        }
    }

    checkPosition() {
        if (this.x < 0) this.x = 0;
        if (this.x + this.shape.length - 1 > 9) 
            this.x -= this.x + (this.shape.length - 1) - (field.grid[0].length - 1);
        if (this.y === -1) this.y = 0;
        if (this.y + this.shape.length > 19) this.y = this.y - (this.y + (this.shape.length - 1) - 19);
    }

    rotate() {
        let tempShape = JSON.parse(JSON.stringify(this)); // Создаём временную копию фигурки
        
        // Поворачиваем временную фигурку
        for (let y = 0; y < tempShape.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
              [tempShape.shape[x][y], tempShape.shape[y][x]] = 
              [tempShape.shape[y][x], tempShape.shape[x][y]];
            }
        }
        tempShape.shape.forEach(row => row.reverse());
        
        // Проверяем валидность временной фигурки
        for (let y = 0; y < tempShape.shape.length; y++){
            for (let x = 0; x < tempShape.shape[y].length; x++){
                if (tempShape.shape[y][x] > 0){
                    if (tempShape.x + x < 0) {
                        if (tempShape.x === this.x) {
                            this.x -= tempShape.x + x;
                            //debugger;
                        }
                    }
                    if (tempShape.x + x > 9) {
                        if (tempShape.x === this.x) {
                            this.x -= tempShape.x + x - 9;
                            //debugger;
                        }
                    }
                    if (tempShape.y + y < 0) {
                        if (tempShape.y === this.y) {
                            this.y -= tempShape.y + y;
                            //debugger;
                        }
                    }
                    if (field.grid[tempShape.y + y][tempShape.x + x] !== 0 && field.grid[tempShape.y + y][tempShape.x + x] !== 8) {
                        ////////////////////////////////////////////
                        // TODO: Добавить крутую обработку поворотов
                        ////////////////////////////////////////////
                        return;
                    }
                }       
            }
        }

        // Поворачиваем фигурку
        for (let y = 0; y < this.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
              [this.shape[x][y], this.shape[y][x]] = 
              [this.shape[y][x], this.shape[x][y]];
            }
        }
        this.shape.forEach(row => row.reverse());
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
        this.shape = JSON.parse(JSON.stringify(shapes[this.shapeType]));
        // Присваеваем фигурке цвет
        this.color = colors[this.shapeType];
    }

    randomizeShapeType(){
        return Math.floor(Math.random() * 7 + 1);
    }
}