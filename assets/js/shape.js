"use strict";

class Shape{
    constructor(context, color, shape, coordinates){
        this.context = context;
        this.color = color;
        this.shape = shape;
        
        // Начальная позиция
        this.x = coordinates[0];
        this.y = coordinates[1];

        // Предыдущие координаты
        this.oldX;
        this.oldY;
    }

    draw(shape, field) {
        this.context.fillStyle = this.color;
        for (let i = 0; i < field.grid.length; i++){
            for (let j = 0; j < field.grid[i].length; j++){
                if (field.grid[i][j] > 0)
                    this.context.fillRect(fieldLeft + j * blockSize, 
                                          i * blockSize, 
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