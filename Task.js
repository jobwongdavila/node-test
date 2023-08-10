var fs = require('fs/promises');

const TASKS_FILE = 'tasks.json';

const validateTask = (task) => {
	return task.hasOwnProperty('id') &&
		task.hasOwnProperty('title') &&
		task.hasOwnProperty('description');
};

const validateTaskToUpdate = (task) => {
	return task.hasOwnProperty('title') &&
		task.hasOwnProperty('description') &&
		task.hasOwnProperty('completed');
};

const addTask = async (task) => {
	const taskLists = await getAllTasks();

	taskLists.push({
		...task,
		completed: false,
	});

	return fs.writeFile(TASKS_FILE, JSON.stringify(taskLists, null, 2));
};

const getAllTasks = async () => {
	return fs.readFile(TASKS_FILE)
		.then(JSON.parse);
};

const getTask = async (id) => {
	const taskLists = await getAllTasks();

	const [taskFound] = taskLists.filter(task => task.id === id);

	return taskFound;
};

const updateTask = async (id, updatedTask) => {
	const rebuildTasks = (task) => {
		if (task.id !== id) return task;
		return { id, ... updatedTask };
	};

	const taskLists = await getAllTasks()
		.then(list => list.map(rebuildTasks));

	return fs.writeFile(TASKS_FILE, JSON.stringify(taskLists, null, 2));
};

const deleteTask = async (id) => {
	const removeFromTasks = (task) => task.id !== id;
	const taskLists = await getAllTasks()
		.then(list => list.filter(removeFromTasks));

	return fs.writeFile(TASKS_FILE, JSON.stringify(taskLists, null, 2));
};

module.exports = {
	add: addTask,
	validateGet: validateTask,
	validatePut: validateTaskToUpdate,
	getAll: getAllTasks,
	get: getTask,
	update: updateTask,
	delete: deleteTask,
};
