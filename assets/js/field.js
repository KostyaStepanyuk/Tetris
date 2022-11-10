"use strict";

class Field{
    constructor(context) {
        this.context = context;
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
        context.font = "bold 32px sans-serif";
        context.fillText("NEXT", fieldRight + outlineGap * 2, outlineGap + (32 * 0.75));
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
        context.font = "bold 32px sans-serif";
        context.fillText("HOLD", outlineGap, outlineGap + (32 * 0.75));
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

    updateCoordinates(currentShape) {
        // Обнуляем все старые координаты
        // if (currentShape.oldX !== undefined && currentShape.oldY !== undefined) {
        //     for (let i = 0; i < currentShape.shape.length; i++){
        //         for (let j = 0; j < currentShape.shape[i].length; j++){
        //             if (currentShape.oldY === -1)
        //                 currentShape.oldY = 0;
        //             if (this.grid[currentShape.oldY + i] !== undefined) {
        //                 if (this.grid[currentShape.oldY + i][currentShape.oldX + j] === 8)
        //                     this.grid[currentShape.oldY + i][currentShape.oldX + j] = 0;
        //             }
        //         }
        //     }
        // }

        for (let y = 0; y < FIELD.height; y++){
            for (let x = 0; x < FIELD.width; x++){
                if (this.grid[y][x] === 8) {
                    this.grid[y][x] = 0;
                }
            }
        }

        // Обновляем новые координаты
        for (let i = 0; i < currentShape.shape.length; i++){
            for (let j = 0; j < currentShape.shape[i].length; j++){
                if (currentShape.shape[i][j] > 0){
                    this.grid[currentShape.y + i][currentShape.x + j] = 8;
                }       
            }
        }

        // Очищаем поле
        this.redraw();
        
        // Перерисовываем фигурку
        shape.draw(this);
    }

    drop() {
        shape.move('moveDown');
    }

    freeze(currentShape) {
        if (isNextMoveAvaible(field, shape, 'ArrowDown')) return;

        let colorID;
        for (let color in COLORS){
            if (currentShape.color === COLORS[color]) colorID = color;
        }

        // Обнуляем все старые координаты
        if (currentShape.oldX !== undefined && currentShape.oldY !== undefined) {
            for (let y = 0; y < currentShape.shape.length; y++){
                for (let x = 0; x < currentShape.shape[y].length; x++){
                    if (currentShape.shape[y][x] !== 0) {
                        if (currentShape.oldY === -1)
                            currentShape.oldY = 0;
                        if (this.grid[currentShape.oldY + y][currentShape.oldX + x] !== undefined)
                            this.grid[currentShape.oldY + y][currentShape.oldX + x] = 0;
                    }
                }
            }
        }

        
        
        // Обновляем новые координаты
        for (let i = 0; i < currentShape.shape.length; i++){
            for (let j = 0; j < currentShape.shape[i].length; j++){
                if (currentShape.shape[i][j] > 0){
                    this.grid[currentShape.y + i][currentShape.x + j] = Number(colorID);
                }       
            }
        }

        // Очищаем поле
        this.redraw();
        
        shape.spawnShape();
    }

    clearLines() {
        let lines = 0;

        this.grid.forEach((row, index) => {
            if (row.every(element => element !== 0 && element !== 8)) {
                lines++;

                this.grid.splice(index, 1);

                this.grid.unshift(Array(10).fill(0));
            }
        });

        this.updateCoordinates(shape);
    }
}


