const express = require('express');
const path = require('path');
const app = express();
const port = 443;

// Устанавливаем статическую папку
app.use(express.static(path.join(__dirname, 'public')));

// Запускаем сервер
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});