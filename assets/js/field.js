"use strict";

class Field{
    constructor(context) {
        this.context = context;
        this.score = 0;
        this.drawField();
        this.drawHoldBlock();
        this.drawNextBlock();
    }

    // Нарисовать поле
    drawField() {
        // Рисуем сетку поля
        context.lineWidth = 1;
        context.strokeStyle = "rgb(100, 100, 100)"; //
        for (let i = fieldLeft; i <= fieldLeft + fieldScreenParam.width; i += blockSize){ // Вертикальные линии
            context.beginPath();
            context.moveTo(i, 0);
            context.lineTo(i, fieldScreenParam.height);
            context.stroke();
        }
        for (let i = 0; i <= fieldScreenParam.height; i += blockSize){ // Горизонтальные линии
            context.beginPath();
            context.moveTo(fieldLeft, i);
            context.lineTo(fieldScreenParam.width / 2 + fieldScreenParam.width, i);
            context.stroke();
        }

        // Рисуем обводку поля
        context.strokeStyle = "white";
        context.lineWidth = 4;
        context.beginPath();
        context.moveTo(fieldLeft - outlineGap, 0);
        context.lineTo(fieldLeft, fieldScreenParam.height - outlineGap);
        context.lineTo(fieldRight, fieldScreenParam.height - outlineGap);
        context.lineTo(fieldRight + outlineGap * 2, 0);
        context.stroke();
    }

    // Нарисовать NEXT блок
    drawNextBlock() {
        // Контур
        context.beginPath();
        context.strokeStyle = "white";
        context.lineWidth = outlineWidth;
        context.moveTo(fieldRight + outlineGap * 2, outlineGap);
        context.lineTo(canvas.width - outlineGap, outlineGap);
        context.lineTo(canvas.width - outlineGap, blockSize * 15.8 - 20);
        context.lineTo(canvas.width - outlineGap - 20, blockSize * 15.8);
        context.lineTo(fieldRight + outlineGap * 2, blockSize * 15.8);
        context.lineTo(fieldRight + outlineGap * 2, 0);
        context.stroke();
        // Шапка
        context.beginPath();
        context.fillStyle = "white";
        context.moveTo(fieldRight + outlineGap * 2, outlineGap);
        context.lineTo(canvas.width - outlineGap, outlineGap);
        context.lineTo(canvas.width - outlineGap, blockSize * 0.8 - outlineGap);
        context.lineTo(fieldRight + outlineGap * 2, blockSize * 0.8 - outlineGap);
        context.lineTo(fieldRight + outlineGap * 2, 0);
        context.fill();
        // Текст шапки
        context.beginPath();
        context.fillStyle = "black";
        context.lineWidth = 100;
        context.font = "bold 20px 'Press Start 2P'";
        context.fillText("NEXT", fieldRight + outlineGap * 4, outlineGap + (32 * 0.75));
        context.closePath();
    }

    // Нарисовать HOLD блок
    drawHoldBlock() {
        // Контур
        context.beginPath();
        context.strokeStyle = "white";
        context.lineWidth = outlineWidth;
        context.moveTo(outlineGap, outlineGap);
        context.lineTo(fieldScreenParam.width / 2, outlineGap);
        context.lineTo(fieldScreenParam.width / 2, blockSize * 3.8);
        context.lineTo(20, blockSize * 3.8);
        context.lineTo(outlineGap, blockSize * 3.8 - 20);
        context.lineTo(outlineGap, 0);
        context.stroke();
        // Шапка
        context.beginPath();
        context.fillStyle = "white";
        context.moveTo(outlineGap, outlineGap);
        context.lineTo(fieldScreenParam.width / 2, outlineGap);
        context.lineTo(fieldScreenParam.width / 2, blockSize * 0.8);
        context.lineTo(outlineGap, blockSize * 0.8);
        context.fill();
        // Текст шапки
        context.fillStyle = "black";
        context.lineWidth = 100;
        context.font = "bold 20px 'Press Start 2P'";
        context.fillText("HOLD", outlineGap * 3, outlineGap + (32 * 0.75));
    }

    // Перерисовать поле
    redraw() {
        // Зарисовать поле
        this.context.fillStyle = "black";
        this.context.fillRect(fieldLeft, 0, blockSize * 10, this.context.canvas.height);
        // Перерисовать поле
        this.drawField();
    }

    // Обнулить поле
    reset() {
        //Получить чистое поле
        this.grid = this.getEmptyField();
        this.redraw();
    }

    getEmptyField() {
        return Array.from(
          {length: FIELD.height}, () => Array(FIELD.width).fill(0)
        );
    } 

    updateCoordinates(currentTetramino) {
        if (isGameOver) return;

        for (let y = 0; y < FIELD.height; y++){
            for (let x = 0; x < FIELD.width; x++){
                if (this.grid[y][x] === 8 || this.grid[y][x] === 9) {
                    this.grid[y][x] = 0;
                }
            }
        }

        // Создаём аватар тетрамино
        let tetraminoAvatar = JSON.parse(JSON.stringify(currentTetramino));
        for (;;){
            if (isNextMoveAvaible(field, tetraminoAvatar, 'ArrowDown')) tetraminoAvatar.y += 1;
            else break;
        }

        // Обновляем новые координаты
        for (let i = 0; i < currentTetramino.shape.length; i++){
            for (let j = 0; j < currentTetramino.shape[i].length; j++){
                if (currentTetramino.shape[i][j] > 0){
                    this.grid[tetraminoAvatar.y + i][tetraminoAvatar.x + j] = 9;
                    this.grid[currentTetramino.y + i][currentTetramino.x + j] = 8;
                }
            }
        }

        // Очищаем поле
        this.redraw();
        
        // Перерисовываем фигурку
        tetramino.draw(this);
    }

    drop() {
        tetramino.move('moveDown');
    }

    freeze(currentTetramino) {
        if (!holdedTetramino.tetramino === undefined) holdedTetramino.movesPassed++;

        if (isNextMoveAvaible(field, tetramino, 'ArrowDown')) return;

        let colorID;
        for (let color in COLORS){
            if (currentTetramino.color === COLORS[color]) colorID = color;
        }

        // Обнуляем все старые координаты
        if (currentTetramino.oldX !== undefined && currentTetramino.oldY !== undefined) {
            for (let y = 0; y < currentTetramino.shape.length; y++){
                for (let x = 0; x < currentTetramino.shape[y].length; x++){
                    if (currentTetramino.shape[y][x] !== 0) {
                        if (currentTetramino.oldY === -1)
                            currentTetramino.oldY = 0;
                        if (this.grid[currentTetramino.oldY + y][currentTetramino.oldX + x] !== undefined)
                            this.grid[currentTetramino.oldY + y][currentTetramino.oldX + x] = 0;
                    }
                }
            }
        }

        
        
        // Обновляем новые координаты
        for (let i = 0; i < currentTetramino.shape.length; i++){
            for (let j = 0; j < currentTetramino.shape[i].length; j++){
                if (currentTetramino.shape[i][j] > 0){
                    this.grid[currentTetramino.y + i][currentTetramino.x + j] = Number(colorID);
                }       
            }
        }

        // Очищаем поле
        this.redraw();

        // Обновляем NEXT-блок
        tetramino.drawNextTetraminos();
        
        // Генерируем новое тетрамино
        tetramino.spawnTetramino();

        // Обновляем информацию о HOLDED-тетрамино
        if (holdedTetramino.tetramino !== undefined) holdedTetramino.movesPassed++;
        if (holdedTetramino.movesPassed > 0) tetramino.drawHoldedTetramino();

        // Обновляем счёт
        this.score += 26;
    }

    clearLines() {
        let lines = 0;

        this.grid.forEach((row, index) => {
            if (row.every(element => element !== 0 && element !== 8 && element !== 9)) {
                lines++;

                this.grid.splice(index, 1);

                this.grid.unshift(Array(10).fill(0));
            }
        });

        this.updateCoordinates(tetramino);

        // Обновляем счёт
        this.updateScore(lines, tetramino);

        clearLinesSound(lines);
    }

    updateScore(numberOfClearedLines = 0, tetramino) {
        switch (numberOfClearedLines) {
            case 1:
                this.score += 100;
                break;
            case 2:
                this.score += 300;
                break;
            case 3:
                this.score += 500;
                break;
            case 4:
                this.score += 800;
                break;
        }

        // Обновляем счётчик
        document.querySelector('#score-counter').innerHTML = this.score;
    }
}


