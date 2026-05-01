const fs = require('fs');
const path = require('path');

const readJsonData = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            return [];
        }

        const fileContent = fs.readFileSync(filePath, 'utf8');

        if (!fileContent.trim()) {
            return [];
        }

        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Ошибка чтения JSON-файла:', error);
        return [];
    }
};

const writeJsonData = (filePath, data) => {
    const directoryPath = path.dirname(filePath);

    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

module.exports = {
    readJsonData,
    writeJsonData
};
