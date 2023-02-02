const tasksContainer = document.querySelector(`[data-list]`)
const newTaskForm = document.querySelector(`[data-new-task-form]`)
const newTaskInput = document.querySelector(`[data-new-task-input]`)
const itemsLeft = document.querySelector('.items-left')
const activityCheck = document.querySelectorAll('.completor')
const chameleons = document.querySelectorAll('.chameleon')
const submitbtn = document.querySelector('.submit-task')
const taskTemplate = document.getElementById('task-template')
const toggle = document.getElementById('toggle')
let darkMode = localStorage.getItem("darkMode")
const LOCAL_STORAGE_TASKS_KEY = 'task.storage'

let taskStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASKS_KEY)) || []


toggle.addEventListener('click', () => {
    darkMode = localStorage.getItem("darkMode")
    darkMode!=="enabled"? applyDark() : disableDark()
})

function applyDark() {
    document.body.classList.add("dark-mode") 
    localStorage.setItem("darkMode", "enabled")
}

function disableDark() {
    document.body.classList.remove("dark-mode") 
    localStorage.setItem("darkMode", null)
}





newTaskForm.addEventListener('click', e =>{
    submitbtn.style.animation = "spin 2s linear";
    setInterval(function(){submitbtn.style.animation = "";},3000)
})

newTaskForm.addEventListener('submit', e =>{
    e.preventDefault()
    const taskName = newTaskInput.value
    if(taskName.length<1) return
    const task = createTask(taskName)
    newTaskInput.value = null
    taskStorage.push(task)
    saveTask()
    renderTasks()
    renderActiveCount()
})

tasksContainer.addEventListener("dragover", e =>{
    e.preventDefault()
    const isDragged = document.querySelector(".drag-active")
    const afterElement = dragAfter(e.clientY)
    if(afterElement == null){
        tasksContainer.appendChild(isDragged)
    }
    else{
        tasksContainer.insertBefore(isDragged, afterElement)
    }
    
})

function dragAfter(y){
   const staticDraggables = [...tasksContainer.querySelectorAll('.drag:not(.drag-active)')]

   return staticDraggables.reduce((closest,child) => {
       const box = child.getBoundingClientRect()
       const offset = y - box.top - box.height/2

       if(offset < 0 && offset > closest.offset){
           return{offset: offset, element: child}
       }
       else{
           return closest
       }
   }, {offset: Number.NEGATIVE_INFINITY}).element
   
}

function createTask(newTask){
   return {id: Date.now().toString(), name: newTask, done: false}
}

function saveTask(){
    localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(taskStorage))
}

function renderTasks(){
    clear(tasksContainer)
    taskStorage.forEach( element => {
       const taskElement = document.importNode(taskTemplate.content, true)
       const checkBox = taskElement.querySelector('input')
       checkBox.id = element.id
       checkBox.checked = element.done
       const label = taskElement.querySelector('label')
       label.htmlFor = element.id
       label.append(element.name)
       element.done?label.children[0].classList.add("checked-task") : label.children[0].classList.remove("checked-task")
       element.done?label.classList.add("crossed"): label.classList.remove("crossed")
       tasksContainer.appendChild(taskElement)
       const draggables = document.querySelectorAll('.drag')
       dragging(draggables)
    });
}

function filterActive(){
    clear(tasksContainer)
    taskStorage.forEach( element => {
        if(!element.done){
            const taskElement = document.importNode(taskTemplate.content, true)
            const checkBox = taskElement.querySelector('input')
            checkBox.id = element.id
            checkBox.checked = element.done
            const label = taskElement.querySelector('label')
            label.htmlFor = element.id
            label.append(element.name)
            element.done?label.children[0].classList.add("checked-task") : label.children[0].classList.remove("checked-task")
            element.done?label.classList.add("crossed"): label.classList.remove("crossed")
            tasksContainer.appendChild(taskElement)
            const draggables = document.querySelectorAll('.drag')
            dragging(draggables)
        }
    });
}

function filterComplete(){
    clear(tasksContainer)
    taskStorage.forEach( element => {
        if(element.done){
            const taskElement = document.importNode(taskTemplate.content, true)
            const checkBox = taskElement.querySelector('input')
            checkBox.id = element.id
            checkBox.checked = element.done
            const label = taskElement.querySelector('label')
            label.htmlFor = element.id
            label.append(element.name)
            const button = taskElement.querySelector('button')
            button.id = element.id
            element.done?label.children[0].classList.add("checked-task") : label.children[0].classList.remove("checked-task")
            element.done?label.classList.add("crossed"): label.classList.remove("crossed")
            tasksContainer.appendChild(taskElement)
            const draggables = document.querySelectorAll('.drag')
            dragging(draggables)
        }
    });
}

function dragging(element){
    element.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
          draggable.classList.add("drag-active")
        })
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove("drag-active")
          })
    })
}


function renderActiveCount(){
    const activeTasks = taskStorage.filter(task => !task.done).length
    itemsLeft.textContent = activeTasks + " left"
}

function clear(element){
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }
}

tasksContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedTask = taskStorage.find(task => task.id === e.target.id)
        selectedTask.done = e.target.checked
        const customMark = e.target.parentNode.children[1].children[0]
        selectedTask.done? customMark.classList.add("checked-task") : customMark.classList.remove("checked-task") 
        selectedTask.done? e.target.parentNode.children[1].classList.add("crossed") : e.target.parentNode.children[1].classList.remove("crossed")
        saveTask()
        renderActiveCount()
    }
    if (e.target.tagName.toLowerCase() === 'img') {
        const selectedTask = taskStorage.find(task => task.id === e.target.parentNode.parentNode.children[0].id)
        taskStorage = taskStorage.filter(task => task.id !== e.target.parentNode.parentNode.children[0].id)
        saveTask()
        renderActiveCount()
        renderTasks()
    }
})

function clearCompleted(){
    taskStorage = taskStorage.filter(task => !task.done)
    saveTask()
    renderTasks()
}


if (darkMode === 'enabled') {
    applyDark();
}
renderTasks()
renderActiveCount()
//localStorage.clear()
