const container = document.querySelector('.container');
const todo = document.getElementById('inputTodo');
const list = document.querySelector('ul');
const form = document.querySelector('form');
const checkIcon = document.querySelector('span.check__icon');
const clearCompleted = document.querySelector('.desktop__states > a');
const filterStates = document.querySelectorAll('.states__list > a');

checkIcon.addEventListener('click', toggleCheck);

clearCompleted.addEventListener('click', deleteTodoCompleted);

form.addEventListener('submit', addTodo);

window.addEventListener('DOMContentLoaded', function() {
    setUpTodos();
});

function setUpTodos() {
    let todosItems = getLocalStorage();
    if (todosItems.length > 0) {
        displayTodos(todosItems);
    };
};

function toggleCheck() {
   checkIcon.classList.toggle('checked');
};

function displayTodos(todos) {
    const stringHtml = todos.map(todo => {
        return `<li data-id="${todo.id}" draggable="true">
                    <span class="check__icon ${todo.state ? 'checked' : ''}">
                    <img style="visibility: hidden" 
                    src="app/images/icon-check.svg" alt="icon-check">
                    </span>
                    <a href="#" ${todo.state ? 'style="color: hsl(233, 14%, 35%); font-weight: normal; text-decoration: line-through;"': ''}>
                        ${todo.value}
                    </a>
                    <i>
                        <img src="app/images/icon-cross.svg" alt="icon-cross">
                    </i>
                </li>`;
    }).join('');

    list.innerHTML = stringHtml;

    const deleteElement = list.querySelectorAll('li i');
    deleteElement.forEach(element => {
        element.addEventListener('click', deleteTodo);
    });

    const spanChecked = list.querySelectorAll('li .check__icon');
    spanChecked.forEach(span => {
        span.addEventListener('click', changeCheckedElement)
    });
    ItemsLeft();
}


// CRUD
function addTodo(e) {
    e.preventDefault();
    let value = todo.value;

    if (value !== '') {
        let id = new Date().getTime().toString();
        let stateBoolean = e.currentTarget.children[0].children[0].classList.contains('checked');
        addTodoToLocalStorage(id, value, stateBoolean);
        setResetInput();
    }
};


function deleteTodo(e) {
    let element = e.currentTarget.parentElement;
    let id = element.dataset.id;

    list.removeChild(element);
    removeTodoToLocalStorage(id);
    ItemsLeft();
};

function deleteTodoCompleted() {
    const todos = document.querySelectorAll('li');

    if (todos.length > 0) {
        todos.forEach(todo => {
            if (todo.children[0].classList.contains('checked')) {
                list.removeChild(todo);
            } else {
                // alert('no existen valores completados');
            }
        });
    }
    // alert('no existen valores completados');

    let todosItems = getLocalStorage();
    todosItems = todosItems.filter(todo => !todo.state);

    localStorage.setItem('todos', JSON.stringify(todosItems));
    ItemsLeft();
};

function changeCheckedElement(e) {
    e.currentTarget.classList.toggle('checked');
    let id = e.currentTarget.parentElement.dataset.id;
    let currentState = e.currentTarget.classList.contains('checked');

    if (currentState) {
        e.currentTarget.nextSibling.nextSibling.style.cssText = 
            `color: hsl(233, 14%, 35%); 
            font-weight: normal; 
            text-decoration: line-through;`;
    } else {
        e.currentTarget.nextSibling.nextSibling.style.cssText = `font-weight: normal;`;
    }
    updateStateToLocalStorage(id, currentState);
    ItemsLeft();
};

// local Storage
function getLocalStorage() {
    return localStorage.getItem('todos') 
        ? JSON.parse(localStorage.getItem('todos'))
        : [];
};

function addTodoToLocalStorage(id, value, state) {
    const objTodo = { id, value, state };
    let todosItems = getLocalStorage();
    todosItems.push(objTodo);

    localStorage.setItem('todos', JSON.stringify(todosItems));

    displayTodos(todosItems);
};

function updateStateToLocalStorage(id, currentState) {
    let todosItems = getLocalStorage();

    todosItems = todosItems.map(todo => {
        if (todo.id === id) {
            todo.state = currentState;
        }
        return todo;
    });

    localStorage.setItem('todos', JSON.stringify(todosItems));
};

function removeTodoToLocalStorage(id) {
    let todosItems = getLocalStorage();

    todosItems = todosItems.filter(todo => {
        if (todo.id !== id) {
            return todo;
        }
    });
    localStorage.setItem('todos', JSON.stringify(todosItems));
};

function setResetInput() {
    todo.value = '';
    if (checkIcon.classList.contains('checked')) {
        checkIcon.classList.remove('checked');
    }
};

function ItemsLeft() {
    let todosItems = getLocalStorage();
    const span = document.querySelector('.desktop__states > span');
    if (todosItems.length > 0) {
        span.innerHTML = `${todosItems.filter(todo => !todo.state).length} items left`;
    } else {
        span.innerHTML = `0 items left`;
    }
};

filterStates.forEach(filterState => {
    filterState.addEventListener('click', () => {
        filterStates.forEach(item => {
            if (item !== filterState) {
                item.classList.remove('active');
            }
        });
        filterState.classList.toggle('active');


        switch (filterState.textContent.trim()) {
			case 'Completed':
				FilterCompleted();
				break;
			case 'Active':
				FilterActive();
				break;
			default:
                let todosItems = getLocalStorage();
                    if (todosItems.length > 0) {
                        displayTodos(todosItems);
                    };
            }
    });
});

function FilterCompleted() {
    let todosItems = getLocalStorage();
    todosItems = todosItems.filter(todo => !!todo.state);
    displayTodos(todosItems);
}

function FilterActive() {
    let todosItems = getLocalStorage();
    todosItems = todosItems.filter(todo => !todo.state);
    displayTodos(todosItems);
}
