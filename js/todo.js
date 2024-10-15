function initTodo () {
    const inputForm = document.querySelector('#todo-form');
    const todoInput = inputForm.querySelector('.todo__input');
    const listEl = document.querySelector('.todo__list');
    const removeAllBtn = document.querySelector('.todo__removeAllBtn');

    // формируем массив с задачами
    let todoArray = localStorage.getItem('todoArray') 
        ? JSON.parse(localStorage.getItem('todoArray'))
        : [
            { title: 'Открыть страницу', done: true },
            { title: 'Потестить функционал' }
        ];
    
    renderTodoList();

    // добавление задачи
    inputForm.onsubmit = (e) => {
        e.preventDefault();
        const newTask = new FormData(inputForm).get('newTask');
        if (!newTask) {
            todoInput.classList.add('todo__input__wrong');
            todoInput.setAttribute('placeholder', 'Заполните поле');
            setTimeout(() => {
                todoInput.classList.remove('todo__input__wrong');
                todoInput.setAttribute('placeholder', 'Новая задача');
            }, 1000);
            return
        }
        todoArray.push({title: newTask});
        inputForm.reset();
        renderTodoList();
    };

    
    // рендер списка, выполняется при каждом изменении списка
    function renderTodoList () {
        // записываем данные в localstorage
        localStorage.setItem('todoArray', JSON.stringify(todoArray))

        // сбрасываем данные
        listEl.innerHTML = '';
        // записываем новые данные
        todoArray.forEach((item, i) => {
            const li = document.createElement('li');
            li.classList.add('todo__list-item');
            if (item.done) li.classList.add('todo__list-item__done')
            li.innerHTML = `
                <input type="checkbox" class="todo__itemCheckbox" id="todo${i}" name="todo${i}">
                <label for="todo${i}" class="todo__itemLabel">${item.title}</label>
                <button data-i="${i}" class="todo__removeItemBtn"></button>
            `;
            listEl.append(li);
        });
        
        const listItemEls = document.querySelectorAll('.todo__list-item');
        listItemEls.forEach((li, i) => {
            // удаление задачи
            const btn = li.querySelector('.todo__removeItemBtn');
            const checkbox = li.querySelector('.todo__itemCheckbox');
            btn.addEventListener('click', (e) => {
                const i = parseInt(e.currentTarget.getAttribute('data-i'));
                todoArray.splice(i, 1);
                renderTodoList();
            });
            // выполнение задачи
            if (li.classList.contains('todo__list-item__done')) checkbox.checked = true
            checkbox.addEventListener('click', () => {
                li.classList.toggle('todo__list-item__done');
                todoArray[i].done = !todoArray[i].done
                renderTodoList()
            });
        });

        // удаление выполненных задач
        if (todoArray.length > 0) {
            removeAllBtn.style.display = 'block'
        } else {
            removeAllBtn.style.display = 'none'
        }
        removeAllBtn.addEventListener('click', () => {
            const newArray = [];
            todoArray.forEach(item => {
                if (!item.done) newArray.push(item)
            });
            // если были изменения, то рендерим
            if (todoArray.length !== newArray.length) {
                todoArray = newArray;
                renderTodoList();
            }
        });
    }
}