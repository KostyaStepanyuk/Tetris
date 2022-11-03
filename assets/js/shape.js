"use strict";

class Shape{
    constructor(context, color, shape){
        this.context = context;
        this.color = 'red';
        this.shape = [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]];
        
        // Начальная позиция
        this.x = fieldLeft + blockSize * 3;
        this.y = blockSize * 0;
    }

    draw() {
        this.context.fillStyle = this.color;
        for (let i = 0; i < this.shape.length; i++){
            for (let j = 0; j < this.shape[i].length; j++){
                if (this.shape[i][j] > 0)
                    this.context.fillRect(this.x + blockSize * j, this.y + blockSize * i, blockSize, blockSize);
            }
        }
    }

}