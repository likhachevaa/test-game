class GameAlgorithm {
    constructor(obj) {
        this.rows = obj.rows;
        this.columns = obj.columns;
        this.items = obj.items;
    }

    /* Создание игрового поля */

    createBoard() {
        this.newGameArray = [];
        for (let i = 0; i < this.rows; i++) {
            this.newGameArray[i] = [];
            for (let j = 0; j < this.columns; j++) {
                let randomValue = Math.floor(Math.random() * this.items);
                this.newGameArray[i][j] = {
                    value: randomValue,
                    isEmpty: false,
                    row: i,
                    column: j
                }
            }
        }
    }

    /* Возвращаем строки игрового поля */

    getRows() {
        return this.rows;
    }

    /* возвращаем колонки игрового поля */

    getColumns() {
        return this.columns;
    }

    /* Возращаем val куба если есть совпадение, иначе это не верный куб */

    getValue(row, column) {
        if (!this.valPick(row, column)) {
            return false;
        }
        return this.newGameArray[row][column].value;
    }

    /* Проверка на совпадение val кубов */

    valPick(row, column) {
        return row >= 0 && row < this.rows && column >= 0 && column < this.columns && this.newGameArray[row] !== undefined && this.newGameArray[row][column] !== undefined;
    }

    /* Задаем рандом val выбранному el */

    setCustomData(row, column, customData) {
        this.newGameArray[row][column].customData = customData;
    }

    /* Возвращаем рандом val куба */

    getCustomData(row, column) {
        return this.newGameArray[row][column].customData;
    }

    /* Возращаем объект с кубами которые рядом (соприкосаются) */

    listConnectItems(row, column) {
        if (!this.valPick(row, column) || this.newGameArray[row][column].isEmpty) {
            return;
        }
        this.colorToLookFor = this.newGameArray[row][column].value;
        this.plotFillArray = [];
        this.plotFillArray.length = 0;
        this.plotFill(row, column);
        return this.plotFillArray;
    }

    /* Возвращаем count(число) соединенных кубов */

    countConnectItems(row, column) {
        return this.listConnectItems(row, column).length;
    }

    /* Поиск совпадений участков */

    plotFill(row, column) {
        if (!this.valPick(row, column) || this.newGameArray[row][column].isEmpty) {
            return;
        }
        if (this.newGameArray[row][column].value === this.colorToLookFor && !this.wasCompleted(row, column)) {
            this.plotFillArray.push({
                row: row,
                column: column
            });
            this.plotFill(row + 1, column);
            this.plotFill(row - 1, column);
            this.plotFill(row, column + 1);
            this.plotFill(row, column - 1);
        }
    }

    /* Проверка на клик куба */

    wasCompleted(row, column) {
        let found = false;
        this.plotFillArray.forEach(function (item) {
            if (item.row === row && item.column === column) {
                found = true;
            }
        });
        return found;
    }

    /* Проверка на заполненность куба */

    isEmpty(row, column) {
        return this.newGameArray[row][column].isEmpty;
    }

    /* Удаление всех соединенных кубов */

    removeConnectItems(row, column) {
        let items = this.listConnectItems(row, column);
        items.forEach(function (item) {
            this.newGameArray[item.row][item.column].isEmpty = true;
        }.bind(this))
    }

    /* Падение кубов */

    fallBoard() {
        let result = [];
        for (let i = this.getRows() - 2; i >= 0; i--) {
            for (let j = 0; j < this.getColumns(); j++) {
                let emptyPlaces = this.emptyPlaces(i, j);
                if (!this.isEmpty(i, j) && emptyPlaces > 0) {
                    this.swapItems(i, j, i + emptyPlaces, j);
                    result.push({
                        row: i + emptyPlaces,
                        column: j,
                        deltaRow: emptyPlaces
                    });
                }
            }
        }
        return result;
    }

    /* Возвращаем пустые места на игровом поле */

    emptyPlaces(row, column) {
        let result = 0;
        if (row !== this.getRows()) {
            for (let i = row + 1; i < this.getRows(); i++) {
                if (this.isEmpty(i, column)) {
                    result++;
                }
            }
        }
        return result;
    }

    /* Перемешиваем кубы местами на пустых строках */

    swapItems(row, column, row2, column2) {
        let tempObject = Object.assign(this.newGameArray[row][column]);
        this.newGameArray[row][column] = Object.assign(this.newGameArray[row2][column2]);
        this.newGameArray[row2][column2] = Object.assign(tempObject);
    }

    /* Заполняем игровое поле недостающими кубами */


    refillBoard() {
        let result = [];
        for (let i = 0; i < this.getColumns(); i++) {
            if (this.isEmpty(0, i)) {
                let emptyPlaces = this.emptyPlaces(0, i) + 1;
                for (let j = 0; j < emptyPlaces; j++) {
                    let randomValue = Math.floor(Math.random() * this.items);
                    result.push({
                        row: j,
                        column: i,
                        deltaRow: emptyPlaces
                    });
                    this.newGameArray[j][i].value = randomValue;
                    this.newGameArray[j][i].isEmpty = false;
                }
            }
        }
        return result;
    }
}

export default GameAlgorithm;
