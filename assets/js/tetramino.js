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
                    switch (field.grid[i][j]) {
                        case 8:
                            this.context.fillStyle = this.color;
                            break;
                        case 9:
                            this.context.fillStyle = "rgb(100, 100, 100)";
                            break;
                        default:
                            this.context.fillStyle = COLORS[field.grid[i][j]];
                            break;
                    }
                    this.context.fillRect(fieldLeft + j * blockSize, i * blockSize, 
                                          blockSize, blockSize);
                    this.context.lineWidth = 3;
                    this.context.strokeStyle = "rgb(200, 200, 200)";
                    this.context.strokeRect(fieldLeft + j * blockSize, i * blockSize, 
                                            blockSize, blockSize);
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

        switch (holdedTetramino.tetramino.shapeType){
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
                    this.context.lineWidth = 3;
                    this.context.strokeStyle = "rgb(200, 200, 200)";
                    this.context.strokeRect(holdBlockLeft + (holdBlockWidth / 2) - startPositionLeft + j * blockSize, 
                                            holdBlockTop + (holdBlockHeight / 2) - startPositionTop + i * blockSize, 
                                            blockSize, blockSize);
                }
            }
        }
    }

    drawNextTetraminos() {
        // Зарисовываем область NEXT фигурок
        this.context.fillStyle = 'black';
        this.context.beginPath();
        this.context.moveTo(nextBlockLeft, nextBlockTop);
        this.context.lineTo(nextBlockLeft + nextBlockWidth, nextBlockTop);
        this.context.lineTo(nextBlockLeft + nextBlockWidth, nextBlockTop + nextBlockHeight - 20);
        this.context.lineTo(nextBlockLeft + nextBlockWidth - 20, nextBlockTop + nextBlockHeight);
        this.context.lineTo(nextBlockLeft, nextBlockTop + nextBlockHeight);
        this.context.closePath();
        this.context.fill();

        let nextBlockHeightForOneTetramino = nextBlockHeight / 5;

        for (let i = 0; i < 5; i++) {

            let nextTetraminoShapeType;

            if (currentTetraminoIndex + i + 1 > 6) {
                nextTetraminoShapeType = mainBag[1][currentTetraminoIndex + i + 1 - 7];
            }
            else {
                nextTetraminoShapeType = mainBag[0][currentTetraminoIndex + i + 1];
            }

            let nextTetraminoShape = SHAPES[nextTetraminoShapeType];
            
            let drawingColor = COLORS[nextTetraminoShapeType]; 

            let startPositionTop, // Верхний край фигурки
                startPositionLeft; // Левый край фигурки

            switch (nextTetraminoShape.length){
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
    
            switch (nextTetraminoShape){
                case 1:
                    startPositionTop = 1.5 * blockSize; // Сместить фигурку на 1.5 блока вверх, если ее высота - 1
                    break;
                default:
                    startPositionTop = 1 * blockSize; // Сместить фигурку на 1 блок вверх, если ее высота - 2
                    break;
            }

            this.context.fillStyle = drawingColor;

            for (let x = 0; x < nextTetraminoShape.length; x++){
                for (let y = 0; y < nextTetraminoShape[x].length; y++){
                    if (nextTetraminoShape[x][y] > 0){
                        this.context.fillRect(nextBlockLeft + (nextBlockWidth / 2) - startPositionLeft + (y * blockSize), 
                                              nextBlockTop + (nextBlockHeightForOneTetramino * i) + (nextBlockHeightForOneTetramino / 2) - startPositionTop + (x * blockSize), 
                                              blockSize, blockSize);
                        this.context.lineWidth = 3;
                        this.context.strokeStyle = "rgb(200, 200, 200)";
                        this.context.strokeRect(nextBlockLeft + (nextBlockWidth / 2) - startPositionLeft + (y * blockSize), 
                                                nextBlockTop + (nextBlockHeightForOneTetramino * i) + (nextBlockHeightForOneTetramino / 2) - startPositionTop + (x * blockSize), 
                                                blockSize, blockSize);
                    }
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
            holdedTetramino.tetramino.shape = SHAPES[holdedTetramino.tetramino.shapeType];
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
                this.x = holdedTetramino.tetramino.shapeType === 4 ? 4 : 3;
                this.y = holdedTetramino.tetramino.shapeType === 1 ? -1 : 0;

                this.oldX;
                this.oldY;

                this.shape = JSON.parse(JSON.stringify(SHAPES[holdedTetramino.tetramino.shapeType]));
                this.color = COLORS[holdedTetramino.tetramino.shapeType];

                // Обновляем текущее HOLDED тетрамино
                holdedTetramino.tetramino = JSON.parse(JSON.stringify(tempTetraminoCopy));
                holdedTetramino.tetramino.shape = SHAPES[holdedTetramino.tetramino.shapeType];
                holdedTetramino.movesPassed = 0;
                
                // Отрисовываем его в HOLD-блоке
                this.drawHoldedTetramino();

                field.updateCoordinates(this);
            }
        }
        tetramino.drawNextTetraminos();
    }

    checkWithSRS(tetromino, oldRotationState, newRotationState, rotationDirection) {
        let tests;
        if (tetromino.shapeType === 1) {
            tests = SuperRotationSystem.I[oldRotationState + '>>' + newRotationState];
            let correctRotate = this.runTestsForSRS(tests, tetromino, rotationDirection);
            return correctRotate;
        }
        else {
            tests = SuperRotationSystem.JLTSZ[oldRotationState + '>>' + newRotationState];
            let correctRotate = this.runTestsForSRS(tests, tetromino, rotationDirection);
            return correctRotate;
        }
    }

    runTestsForSRS(tests, tetromino, rotationDirection){
        // Запомнить старые координаты
        let oldX = tetromino.x,
            oldY = tetromino.y;
        
        for (let i = 1; i < 6; i++) {
            // Присвоить новые координаты
            tetromino.x += tests[i][0];
            tetromino.y -= tests[i][1];

            // Проверить результаты
            if (this.isNewPositionValid(tetromino)) 
                return i;
            else {
                tetromino.x = oldX;
                tetromino.y = oldY;
            }
        }
        return 0;
    }

    rotateClockwise(shape) {
        // Поворачиваем временную фигурку по часовой
        for (let y = 0; y < shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [shape[x][y], shape[y][x]] = 
                [shape[y][x], shape[x][y]];
            }
        }
        shape.forEach(row => row.reverse());
        return shape;
    }

    rotateCounterclockwise(shape) {
        // Поворачиваем временную фигурку против часовой
        shape.forEach(row => row.reverse());
        for (let y = 0; y < shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [shape[x][y], shape[y][x]] = 
                [shape[y][x], shape[x][y]];
            }
        }
        return shape;
    }

    isNewPositionValid(tetramino) {
        for (let y = 0; y < tetramino.shape.length; y++){
            for (let x = 0; x < tetramino.shape[y].length; x++){
                if (tetramino.shape[y][x] > 0){
                    if (tetramino.x + x < 0) { // Блок фигурки левее поля
                        return false;
                    }
                    if (tetramino.x + x > FIELD.width - 1) { // Блок фигурки правее поля
                        return false;
                    }
                    if (tetramino.y + y < 0) { // Блок фигурки выше поля
                        return false;
                    }
                    if (field.grid[tetramino.y + y] !== undefined) { // Блок фигурки сталкивается с блоком другой размещенной фигурки
                        if (field.grid[tetramino.y + y][tetramino.x + x] !== 0 && field.grid[tetramino.y + y][tetramino.x + x] !== 8) {
                            return false;
                        }
                    }
                }       
            }
        }
        return true;
    }

    rotate(direction) {
        let isRotateAvaible = true; // Возможен ли поворот фигурки
        let tempTetramino = JSON.parse(JSON.stringify(this)); // Создаём временную копию фигурки
        
        // Поворачиваем временную фигурку
        if (direction === 'clockwise') {
            tempTetramino.shape = this.rotateClockwise(tempTetramino.shape);
            tempTetramino.rotationState = ++tempTetramino.rotationState % 4;
        }
        else{
            tempTetramino.shape = this.rotateCounterclockwise(tempTetramino.shape);
            if (tempTetramino.rotationState === 0) tempTetramino.rotationState = 4;
                tempTetramino.rotationState = --tempTetramino.rotationState % 4;
        }

        // Устанавливаем позицию для основной фигурки
        let testNumber = this.checkWithSRS(tempTetramino, this.rotationState, tempTetramino.rotationState, direction);
        let correctCoordinates;

        if (testNumber !== 0) {
            if (this.shapeType === 1) {
                correctCoordinates = SuperRotationSystem.I[this.rotationState + '>>' + tempTetramino.rotationState][testNumber];
            }
            else {
                correctCoordinates = SuperRotationSystem.JLTSZ[this.rotationState + '>>' + tempTetramino.rotationState][testNumber];
            }
        }
        else {
            return;
        }

        this.x += correctCoordinates[0];
        this.y -= correctCoordinates[1];

        if (isRotateAvaible) {
            if (direction === 'clockwise') {
                this.shape = this.rotateClockwise(this.shape);
                this.rotationState = ++this.rotationState % 4;
            }
            else {
                this.shape = this.rotateCounterclockwise(this.shape);
                if (this.rotationState === 0) this.rotationState = 4;
                this.rotationState = --this.rotationState % 4;
            }
        }

        field.updateCoordinates(this);
    }

    spawnTetramino(){
        this.isHardDropped = false;
        // Выбираем следующую фигурку
        this.shapeType = mainBag[0][currentTetraminoIndex];
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
        this.x = this.shapeType === 4 ? 4 : 3;
        this.y = this.shapeType === 1 ? -1 : 0;

        // Создаём переменные для хранения предыдущих координат
        this.oldX;
        this.oldY;

        // Присваеваем фигурке форму
        this.shape = JSON.parse(JSON.stringify(SHAPES[this.shapeType]));
        // Присваеваем фигурке цвет
        this.color = COLORS[this.shapeType];
        // Присваеваем текущее состояние
        this.rotationState = 0;

        for (let y = 0; y < this.shape.length; y++){
            for (let x = 0; x < this.shape[y].length; x++){
                if (this.shape[y][x] > 0){
                    if (field.grid[this.y + y][this.x + x] !== 0 && field.grid[this.y + y][this.x + x] !== 8){
                        gameOver();
                        return;
                    }
                }
            }
        }

        field.updateCoordinates(this);
    }
}