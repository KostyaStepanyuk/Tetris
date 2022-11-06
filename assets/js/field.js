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
        for (let i = fieldLeft; i <= fieldLeft + fieldParam.width; i += blockSize){ // Вертикальные линии
            context.beginPath();
            context.moveTo(i, 0);
            context.lineTo(i, fieldParam.height);
            context.stroke();
        }
        for (let i = 0; i <= fieldParam.height; i += blockSize){ // Горизонтальные линии
            context.beginPath();
            context.moveTo(fieldLeft, i);
            context.lineTo(fieldParam.width / 2 + fieldParam.width, i);
            context.stroke();
        }

        // Рисуем обводку поля
        context.strokeStyle = "white";
        context.lineWidth = 4;
        context.beginPath();
        context.moveTo(fieldLeft - outlineGap, 0);
        context.lineTo(fieldLeft, fieldParam.height - outlineGap);
        context.lineTo(fieldRight, fieldParam.height - outlineGap);
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
        context.lineTo(fieldParam.width / 2, outlineGap);
        context.lineTo(fieldParam.width / 2, blockSize * 3.8);
        context.lineTo(20, blockSize * 3.8);
        context.lineTo(outlineGap, blockSize * 3.8 - 20);
        context.lineTo(outlineGap, 0);
        context.stroke();
        // Шапка
        context.beginPath();
        context.fillStyle = "white";
        context.moveTo(outlineGap, outlineGap);
        context.lineTo(fieldParam.width / 2, outlineGap);
        context.lineTo(fieldParam.width / 2, blockSize * 0.8);
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
        this.drawField();
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
    }

    getEmptyField() {
        return Array.from(
          {length: 20}, () => Array(10).fill(0)
        );
    } 

    updateCoordinates(currentShape) {
        // Обнуляем старые координаты
        if (currentShape.oldX !== undefined && currentShape.oldY !== undefined) {
            for (let i = 0; i < currentShape.shape.length; i++){
                for (let j = 0; j < currentShape.shape[i].length; j++){
                    if (currentShape.shape[i][j] > 0)
                        this.grid[currentShape.oldY + i][currentShape.oldX + j] = 0;
                }
            }
        }
        // Обновляем новые координаты
        for (let i = 0; i < currentShape.shape.length; i++){
            for (let j = 0; j < currentShape.shape[i].length; j++){
                if (currentShape.shape[i][j] > 0)
                    this.grid[currentShape.y + i][currentShape.x + j] = 8;
            }
        }
    }
}


