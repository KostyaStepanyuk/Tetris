"use strict";

class Shape{
    constructor(context, color, shape, coordinates){
        this.context = context;
        this.color = color;
        this.shape = shape;
        
        // Начальная позиция
        this.x = coordinates[0];
        this.y = coordinates[1];
    }

    draw(shape) {
        this.context.fillStyle = this.color;
        for (let i = 0; i < this.shape.length; i++){
            for (let j = 0; j < this.shape[i].length; j++){
                if (shape.shape[i][j] > 0)
                    this.context.fillRect(fieldLeft + this.x * blockSize + blockSize * j, 
                                          this.y * blockSize + blockSize * i, 
                                          blockSize, blockSize);
            }
        }
    }

    move(action) {
        if (action === 'moveLeft') this.x -= 1;
        if (action === 'moveRight') this.x += 1;
        if (action === 'moveDown') this.y += 1;
    }
}