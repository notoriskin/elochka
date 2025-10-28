module.exports = { createChristmasTree };

function createChristmasTree(levels, filepath) {
    const fs = require('fs');
    
    let output = '';
    const width = levels * 6; // примерная ширина елки

    // Верхушка
    output += ' '.repeat((width - 1) / 2) + 'W\n';
    output += ' '.repeat((width - 1) / 2) + '*\n';

    // "Этажи" ёлки
    for (let i = 1; i <= levels; i++) {
        let stars = '* '.repeat(i * 2 + 3);
        let line = stars.trim();
        if (i % 2 === 0) {
            line = '@' + line + '@';
        } else {
            line = '*' + line + '*';
        }
        const padding = Math.max(0, Math.floor((width - line.length) / 2));
        output += ' '.repeat(padding) + line + '\n';
    }

    // Ствол
    for (let i = 0; i < 2; i++) {
        const padding = Math.max(0, Math.floor((width - 5) / 2));
        output += ' '.repeat(padding) + 'TTTTT\n';
    }

    fs.writeFileSync(filepath, output, 'utf-8');
}

// Пример использования:
createChristmasTree(4, 'tree.txt');

