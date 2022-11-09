"use strict";

class Shape{
    constructor(context){
        this.context = context;

        // Предыдущие координаты
        this.oldX;
        this.oldY;
        
        this.isHardDropped = false;
    }

    draw (field) {
        for (let i = 0; i < field.grid.length; i++){
            for (let j = 0; j < field.grid[i].length; j++){
                if (field.grid[i][j] > 0){
                    if (field.grid[i][j] === 8) 
                        this.context.fillStyle = this.color;
                    else 
                        this.context.fillStyle = COLORS[field.grid[i][j]];
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
            this.isHardDropped = true;
            for (;;){
                if (isNextMoveAvaible(field, this, 'ArrowDown')) this.y += 1;
                else break;
            }
        }
        field.updateCoordinates(this);
    }

    checkPosition() {
        if (this.x < 0) this.x = 0;
        if (this.x + this.shape.length - 1 > FIELD.width - 1) 
            this.x -= this.x + (this.shape.length - 1) - (FIELD.width - 1);
        if (this.y === -1) this.y = 0;
        if (this.y + this.shape.length > FIELD.height - 1) this.y = this.y - (this.y + (this.shape.length - 1) - (FIELD.height - 1));
    }

    rotate() {
        let isRotateAvaible = true;
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
                    if (tempShape.x + x < 0) { // Блок фигурки левее поля
                        if (tempShape.x === this.x) {
                            this.x -= tempShape.x + x;
                            //debugger;
                        }
                    }
                    if (tempShape.x + x > FIELD.width - 1) { // Блок фигурки правее поля
                        if (tempShape.x === this.x) {
                            this.x -= tempShape.x + x - (FIELD.width - 1);
                            if (tempShape.shapeType === 1){
                                this.x--;    
                            }
                            //debugger;
                        }
                    }
                    if (tempShape.y + y < 0) { // Блок фигурки выше поля
                        if (tempShape.y === this.y) {
                            this.y -= tempShape.y + y;
                            //debugger;
                        }
                    }
                    if (field.grid[tempShape.y + y] !== undefined) {
                        if (field.grid[tempShape.y + y][tempShape.x + x] !== 0 && field.grid[tempShape.y + y][tempShape.x + x] !== 8) {
                            isRotateAvaible = false;
                        }
                    }
                }       
            }
        }

        if (isRotateAvaible) {
            // Поворачиваем фигурку
            for (let y = 0; y < this.shape.length; ++y) {
                for (let x = 0; x < y; ++x) {
                [this.shape[x][y], this.shape[y][x]] = 
                [this.shape[y][x], this.shape[x][y]];
                }
            }
            this.shape.forEach(row => row.reverse());
        }

        field.updateCoordinates(this);
    }

    spawnShape(){
        // Выбираем следующую фигурку
        this.shapeType = mainBag[0][currentShapeNumber];
        currentShapeNumber++;

        if (currentShapeNumber > 6){
            // Удалить первый мешок
            mainBag.splice(0, 1);
            // Создать новый мешок
            let newInnerBag = createInnerBag();
            // Закинуть новый мешок в конец
            mainBag.push(newInnerBag);
            // Обнулить счётчик текущей фигуры
            currentShapeNumber = 0;
        }


        //this.shapeType = this.randomizeShapeType();

        // Присваем начальные координаты фигурке (Если это кубик, то x = 4)
        this.x = this.shapeType === 4 ? 4 : 3;
        this.y = this.shapeType === 1 ? -1 : 0;

        // Создаём переменные для хранения предыдущих координат
        this.oldX;
        this.oldY;

        // Присваеваем фигурке форму
        this.shape = JSON.parse(JSON.stringify(SHAPES[this.shapeType]));
        // Присваеваем фигурке цвет
        this.color = COLORS[this.shapeType];
    }
}