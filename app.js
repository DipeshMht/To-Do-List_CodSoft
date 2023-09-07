const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dbPath = path.join(__dirname, 'tasks.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT)');
});

app.post('/api/tasks', (req, res) => {
    const task = req.body.task;

    db.run('INSERT INTO tasks (task) VALUES (?)', [task], (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Unable to add task' });
            return;
        }
        res.json({ message: 'Task added successfully' });
    });
});


app.put('/api/tasks/:id', (req, res) => {
    const id = req.params.id;
    const newTask = req.body.task;

    db.run('UPDATE tasks SET task = ? WHERE id = ?', [newTask, id], (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Unable to edit task' });
            return;
        }
        res.json({ message: 'Task edited successfully' });
    });
});

app.delete('/api/tasks/:id', (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM tasks WHERE id = ?', [id], (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Unable to delete task' });
            return;
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
