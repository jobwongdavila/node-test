
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('logger');
const Task = require('./Task');

var app = express();
var Log = new logger.Logger();

app.use(bodyParser.json());


app.get('/tasks', async (req, res) => {
	const PAGE_SIZE = 2;
	const page = parseInt(req.query.page ?? 1);

	const allTasks = await Task.getAll();

	const startIndex = ( ( page - 1 ) * PAGE_SIZE );
	const data = allTasks.slice(startIndex, startIndex + PAGE_SIZE);

	const response = {
		total: allTasks.length,
		data,
		page,
	};
	return res.send(JSON.stringify(response, null, 2), 200);
});

app.post('/tasks', async (req, res) => {
	const { body } = req;

	const isRequestValid = Task.validateGet(body);

	if(!isRequestValid) {
		return res.send('', 400);
	}

	await Task.add(body);

	return res.send('', 201);
});

app.get('/tasks/:id', async (req, res) => {
	const id = req.params.id;

	const task = await Task.get(parseInt(id));

	if (!task) {
		return res.send('', 404);
	}

	return res.send(JSON.stringify(task, null, 2), 200);
});

app.put('/tasks/:id', async (req, res) => {
	const id = req.params.id;
	const { body } = req;

	const isRequestValid = Task.validatePut(body);

	if(!isRequestValid) {
		return res.send('', 400);
	}

	await Task.update(parseInt(id), body);

	return res.send('', 200);
});

app.delete('/tasks/:id', async (req, res) => {
	const id = req.params.id;

	await Task.delete(parseInt(id));

	return res.send('', 200);
});

app.listen(3000);
