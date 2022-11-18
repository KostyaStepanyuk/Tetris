"use strict";

// Параметры поля
let fieldScreenParam = {
    width: 400,
    height: 880
}

// Счётчик текущей фигуры
let currentTetraminoIndex = 0;

// Создаём общий "мешок" фигурок
let mainBag = Array(7);
(function createMainBag() {
    // Заполняем главный мешок 9 мешков по 7 элементов:
    for (let i = 0; i < 9; i++) {
        // Создаём внутренний мешок
        let innerBag = createInnerBag(); 
        
        // Закидываем готовый внутренний мешок в главный
        mainBag[i] = innerBag;
    }
})();

// Создать внутренний мешок
function createInnerBag() {
    let innerBag;
    // Генерируем готовый внутренний мешок
    for (let j = 0; j < 7; j++) {
        innerBag = Array.from({length: 7}, (_, i) => i + 1); // Заполняем внутренний мешок числами от 1 до 7
        shuffle(innerBag); // Перемешиваем содержимое 'мешка'
    }
    return innerBag;
}

// Holded фигура
let holdedTetramino = {
    tetramino : undefined,
    movesPassed : undefined
}
 


let blockSize = fieldScreenParam.width / 10;                                        // Ширина/высота кубика
let outlineWidth = 4;                                                               // Ширина линии обводки
let outlineGap = outlineWidth / 2;                                                  // Ширина промежутка линии обводки

// Параметры игрового поля
let fieldLeft = fieldScreenParam.width / 2 + outlineGap,                            // Левый край поля
    fieldRight = fieldScreenParam.width / 2 + fieldScreenParam.width + outlineGap;  // Правый край поля

// Параметры HOLD-блока
let holdBlockLeft = outlineGap,
    holdBlockTop = blockSize * 0.8,
    holdBlockHeight = 3 * blockSize,
    holdBlockWidth = fieldScreenParam.width / 2;

// Параметры NEXT-блока
let nextBlockLeft = fieldRight + outlineGap * 3,
    nextBlockTop = blockSize * 0.8 - outlineGap,
    nextBlockHeight = 15 * blockSize,
    nextBlockWidth = fieldScreenParam.width / 2 - outlineWidth * 3;

// Поиск канваса
let canvas = document.getElementById("canvas");
canvas.width = fieldScreenParam.width * 2;    // Устанавливаем ширину канваса
canvas.height = fieldScreenParam.height;      // Устанавливаем высоту канваса
let context = canvas.getContext('2d');  // Получаем контекст для рисования


let field = new Field(context); // Создаём экземпляр поля
let tetramino = new Tetramino(context); // Создаём экземпляр фигурки

let backgroundMusic = document.querySelector("#background-music"); // Фоновая музыка

// Передвинуть фигурку
function controlTetramino(EO){
    EO = EO || window.event;
    EO.preventDefault();

    // Получить текущие координаты и фигурку
    let currentValues = {
        tetramino : tetramino.tetramino,
        x: tetramino.x,
        y: tetramino.y
    }
    console.log(EO.key);

    switch (EO.key) {
        case 'ArrowUp':
        case 'x':
        case '1':
        case '5':
        case '9':
            tetramino.rotate('clockwise');
            break;
        case ' ':
        case '8':
            tetramino.hardDrop();
            break;
        case 'Shift':
        case 'c':
        case '0':
            tetramino.hold();
            break;
        case 'Control':
        case 'z':
        case '3':
        case '7':
            tetramino.rotate('counterclockwise');
            break;
        case 'Escape':
        case 'F1':
            pause();
            break;
        case 'ArrowLeft':
        case '4':
            if (isNextMoveAvaible(field, tetramino, EO.key)) tetramino.move('moveLeft');
            break;
        case 'ArrowRight':
        case '6':
            if (isNextMoveAvaible(field, tetramino, EO.key)) tetramino.move('moveRight');
            break;
        case 'ArrowDown':
        case '2':
            if (isNextMoveAvaible(field, tetramino, EO.key)) tetramino.move('moveDown');
            break;
            
    }

    // Обновляем новые координаты
    field.updateCoordinates(tetramino);

    // Очищаем поле
    field.redraw();
    
    // Перерисовываем фигурку
    tetramino.draw(field);
}

// Проверить доступность следующего хода
function isNextMoveAvaible(field, currentTetramino, nextMove) {
    let posibleX = 0, posibleY = 0;
    
    if (nextMove === 'ArrowLeft') posibleX = -1;
    if (nextMove === 'ArrowRight') posibleX = 1;
    if (nextMove === 'ArrowDown') posibleY = 1;
    
    for (let i = 0; i < currentTetramino.shape.length; i++){
        for (let j = 0; j < currentTetramino.shape[i].length; j++){
            if (currentTetramino.shape[i][j] > 0){
                if (currentTetramino.x + j + posibleX < 0 || currentTetramino.x + j + posibleX > FIELD.width - 1) 
                    return false;
                if (currentTetramino.y + i + posibleY > field.grid.length - 1) 
                    return false;
                if (field.grid[currentTetramino.y + i + posibleY][currentTetramino.x + j + posibleX] >= 1 && 
                    field.grid[currentTetramino.y + i + posibleY][currentTetramino.x + j + posibleX] <= 7) 
                    return false;
            }
        }
    }
    return true;
}

// Начать игру
function play(){
    // Обнуляем поле
    field.reset();

    // Добавляем обработчик события нажатия на стрелочки
    document.addEventListener('keydown', controlTetramino);

    tetramino.drawNextTetraminos();

    // Генерируем фигурку
    tetramino.spawnTetramino();

    // Обновляем массив поля
    field.updateCoordinates(tetramino);

    backgroundMusic.volume = 0.1;
    backgroundMusic.play();

    animate();


}

// Анимировать кадр
const time = { start: 0, elapsed: 0, level: 1000 };
function animate(now = 0) {
    let freezeTimeout = undefined;

    time.elapsed = now - time.start; // Истёкшее время

    let isNextMoveDownAvaible = true;
    
    // Опускаем фигурку каждую секунду на блок вниз
    if (time.elapsed > time.level) {
        time.start = now; // Начать отсчёт сначала

        // Проверить доступность следющего смещения вниз
        isNextMoveDownAvaible = isNextMoveAvaible(field, tetramino, 'ArrowDown');
        
        if (isNextMoveDownAvaible){
            tetramino.move("moveDown"); // Опустить фигурку на 1 блок
        }
    }
    if (!isNextMoveDownAvaible){
        if (!tetramino.isHardDropped){
            freezeTimeout = setTimeout(function () {
                field.freeze(tetramino);
            }, 500);
        }
    }
    // Очищаем линии
    field.clearLines();
    requestAnimationFrame(animate);
}

function clearLinesSound(lines) {
    let clearLinesMusicElement;
    switch (lines) {
        case 1:
            clearLinesMusicElement = document.querySelector("#clear-1-line-music");
            clearLinesMusicElement.play();
            break;
        case 2:
            clearLinesMusicElement = document.querySelector("#clear-2-lines-music");
            clearLinesMusicElement.play();
            break;
        case 3:
            clearLinesMusicElement = document.querySelector("#clear-3-lines-music");
            clearLinesMusicElement.play();
            break;
        case 4:
            clearLinesMusicElement = document.querySelector("#clear-4-lines-music");
            clearLinesMusicElement.play();
            break;
    }
    
}

// Перемешать массив
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

// Сымитировать проблемму
function immitateProblem(){
    clearLinesMusicSourceElement.src = "../assets/sounds/4 lines.mp3";
    clearLinesMusicElement.play();
}