"use strict";

class Tetramino{
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

    drawHoldedTetramino() {
        // Зарисовываем область HOLDED фигурки
        this.context.fillStyle = 'black';
        this.context.beginPath();
        this.context.moveTo(holdBlockLeft, holdBlockTop);
        this.context.lineTo(holdBlockLeft + holdBlockWidth, holdBlockTop);
        this.context.lineTo(holdBlockLeft + holdBlockWidth, holdBlockTop + holdBlockHeight);
        this.context.lineTo(20, holdBlockTop + holdBlockHeight);
        this.context.lineTo(holdBlockLeft, holdBlockTop + holdBlockHeight - 20);
        this.context.closePath();
        this.context.fill();


        let drawingColor; // Цвет рисования

        if (holdedTetramino.movesPassed === 0) 
            drawingColor = "rgb(100, 100, 100)"; // Первый ход - фигурка серая
        else 
            drawingColor = holdedTetramino.tetramino.color; // не первый ход - фигурка своего цвета

        let startPositionTop, // Верхний край фигурки
            startPositionLeft; // Левый край фигурки
        
        switch (holdedTetramino.tetramino.shape.length){
            case 2:
                startPositionLeft = 1 * blockSize; // Сместить фигурку на 1 блок левее центра, если её ширина - 2
                break;
            case 3:
                startPositionLeft = 1.5 * blockSize; // Сместить фигурку на 1.5 блока левее центра, если её ширина - 3
                break;
            case 4:
                startPositionLeft = 2 * blockSize; // Сместить фигурку на 2 блок левее центра, если её ширина - 4
                break;
        }

        switch (holdedTetramino.tetramino.tetraminoShapeType){
            case 1:
                startPositionTop = 1.5 * blockSize; // Сместить фигурку на 1.5 блока вверх, если ее высота - 1
                break;
            default:
                startPositionTop = 1 * blockSize; // Сместить фигурку на 1 блок вверх, если ее высота - 2
                break;
        }

        this.context.fillStyle = drawingColor;

        for (let i = 0; i < holdedTetramino.tetramino.shape.length; i++){
            for (let j = 0; j < holdedTetramino.tetramino.shape[i].length; j++){
                if (holdedTetramino.tetramino.shape[i][j] > 0){
                    this.context.fillRect(holdBlockLeft + (holdBlockWidth / 2) - startPositionLeft + j * blockSize, 
                                          holdBlockTop + (holdBlockHeight / 2) - startPositionTop + i * blockSize, 
                                          blockSize, blockSize);
                    // this.context.lineWidth = 3;
                    // this.context.strokeStyle = "rgb(200, 200, 200)";
                    // this.context.strokeRect(holdBlockLeft + j * blockSize, i * blockSize, 
                    //                         blockSize, blockSize);
                }
            }
        }
    }

    move(action) {
        // Записываем старые координаты
        this.oldX = tetramino.x;
        this.oldY = tetramino.y;
        if (action === 'moveLeft') this.x -= 1;
        if (action === 'moveRight') this.x += 1;
        if (action === 'moveDown') this.y += 1;
        if (action === 'rotate') this.rotate();
        field.updateCoordinates(this);
    }

    hardDrop() {
        this.isHardDropped = true;
            for (;;){
                if (isNextMoveAvaible(field, this, 'ArrowDown')) this.y += 1;
                else break;
            }
            field.freeze(this);
        field.updateCoordinates(this);
    }

    hold() {
        if (holdedTetramino.tetramino === undefined) {
            // Закидываем текущее тетрамино в HOLD-блок
            holdedTetramino.tetramino = JSON.parse(JSON.stringify(this));
            holdedTetramino.tetramino.shape = SHAPES[holdedTetramino.tetramino.tetraminoShapeType];
            holdedTetramino.movesPassed = 0;

            // Отрисовываем его в HOLD-блоке
            this.drawHoldedTetramino();

            // Создаём следующее тетрамино
            field.redraw();
            this.spawnTetramino();
        }
        else {
            if (holdedTetramino.movesPassed > 0) {
                let tempTetraminoCopy = JSON.parse(JSON.stringify(this));
                // Спавним следующее
                this.x = holdedTetramino.tetramino.tetraminoShapeType === 4 ? 4 : 3;
                this.y = holdedTetramino.tetramino.tetraminoShapeType === 1 ? -1 : 0;

                this.oldX;
                this.oldY;

                this.shape = JSON.parse(JSON.stringify(SHAPES[holdedTetramino.tetramino.tetraminoShapeType]));
                this.color = COLORS[holdedTetramino.tetramino.tetraminoShapeType];

                // Обновляем текущее HOLDED тетрамино
                holdedTetramino.tetramino = JSON.parse(JSON.stringify(tempTetraminoCopy));
                holdedTetramino.tetramino.shape = SHAPES[holdedTetramino.tetramino.tetraminoShapeType];
                holdedTetramino.movesPassed = 0;
                
                // Отрисовываем его в HOLD-блоке
                this.drawHoldedTetramino();

                field.updateCoordinates(this);
            }
        }
        
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
        let tempTetramino = JSON.parse(JSON.stringify(this)); // Создаём временную копию фигурки
        
        // Поворачиваем временную фигурку
        for (let y = 0; y < tempTetramino.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
              [tempTetramino.shape[x][y], tempTetramino.shape[y][x]] = 
              [tempTetramino.shape[y][x], tempTetramino.shape[x][y]];
            }
        }
        tempTetramino.shape.forEach(row => row.reverse());
        
        // Проверяем валидность временной фигурки
        for (let y = 0; y < tempTetramino.shape.length; y++){
            for (let x = 0; x < tempTetramino.shape[y].length; x++){
                if (tempTetramino.shape[y][x] > 0){
                    if (tempTetramino.x + x < 0) { // Блок фигурки левее поля
                        if (tempTetramino.x === this.x) {
                            this.x -= tempTetramino.x + x;
                            //debugger;
                        }
                    }
                    if (tempTetramino.x + x > FIELD.width - 1) { // Блок фигурки правее поля
                        if (tempTetramino.x === this.x) {
                            this.x -= tempTetramino.x + x - (FIELD.width - 1);
                            if (tempTetramino.tetraminoShapeType === 1){
                                this.x--;    
                            }
                            //debugger;
                        }
                    }
                    if (tempTetramino.y + y < 0) { // Блок фигурки выше поля
                        if (tempTetramino.y === this.y) {
                            this.y -= tempTetramino.y + y;
                            //debugger;
                        }
                    }
                    if (field.grid[tempTetramino.y + y] !== undefined) {
                        if (field.grid[tempTetramino.y + y][tempTetramino.x + x] !== 0 && field.grid[tempTetramino.y + y][tempTetramino.x + x] !== 8) {
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

    spawnTetramino(){
        this.isHardDropped = false;
        // Выбираем следующую фигурку
        this.tetraminoShapeType = mainBag[0][currentTetraminoIndex];
        currentTetraminoIndex++;

        if (currentTetraminoIndex > 6){
            // Удалить первый мешок
            mainBag.splice(0, 1);
            // Создать новый мешок
            let newInnerBag = createInnerBag();
            // Закинуть новый мешок в конец
            mainBag.push(newInnerBag);
            // Обнулить счётчик текущей фигуры
            currentTetraminoIndex = 0;
        }

        // Присваем начальные координаты фигурке (Если это кубик, то x = 4)
        this.x = this.tetraminoShapeType === 4 ? 4 : 3;
        this.y = this.tetraminoShapeType === 1 ? -1 : 0;

        // Создаём переменные для хранения предыдущих координат
        this.oldX;
        this.oldY;

        // Присваеваем фигурке форму
        this.shape = JSON.parse(JSON.stringify(SHAPES[this.tetraminoShapeType]));
        // Присваеваем фигурке цвет
        this.color = COLORS[this.tetraminoShapeType];

        field.updateCoordinates(this);
    }
}