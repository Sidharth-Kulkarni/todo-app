const addTask = document.querySelector('.add--task');
const enterTask = document.querySelector('#enter--task');
const taskList = document.querySelector('.task--list');
const importance = document.querySelector('#importance');
const difficulty = document.querySelector('#difficulty');
let detailArr = JSON.parse(localStorage.getItem("tasks")) || [];
let i =0;
function renderTask(){
    taskList.querySelectorAll('.task-row:not(.header)').forEach(el=>el.remove());
    i=0;
    detailArr.forEach(details=>{
        const task = `
            <li class="task-row">
                <span class="col status "><input type="checkbox" name="check" class="col status" ${details.done ? "checked" : "" }></span>
                <span class="col no">${i+1}</span>
                <span class="col name ${details.done ? "done" : ""}">${details.taskName}</span>
                <span class="col important">${details.importance}</span>
                <span class="col difficult">${details.difficulty}</span>
                <span class="col delete"><button class="delete delete-btn"><i class = "fa-solid fa-trash"></i></span>
                <span class="col edit"><button class="edit edit-btn"><i class="fa-solid fa-pen"></i></button</span>
            </li>
            `;
        i++;
        taskList.insertAdjacentHTML('beforeend',task);
    })

}


function saveToLocal() {
    localStorage.setItem("tasks", JSON.stringify(detailArr));
}


addTask.addEventListener('click',function(){
    let details = {
        taskName: enterTask.value,
        importance: importance.value.toUpperCase(),
        difficulty: difficulty.value.toUpperCase(),
        done: false
    }
    detailArr.push(details);
    saveToLocal();
    renderTask();
    enterTask.value = "";
    importance.value = "";
    difficulty.value = "";


})

//TICKING A TASK

taskList.addEventListener('click',function(e){
    if(e.target.type === "checkbox"){
        const taskName = e.target.closest('li').querySelector('.name')  ;
        console.log(taskName); 
        taskName.classList.toggle('done');
        const index = [...taskList.querySelectorAll('.task-row:not(.header)')].indexOf(e.target.closest('li'));
        detailArr[index].done = e.target.checked;
        saveToLocal();

    }
})

//DELETING A TASK

taskList.addEventListener('click',function(e){
     if(e.target.closest('.delete-btn')){
        const allrows = taskList.querySelectorAll('.task-row:not(.header)');
        const index = [...taskList.querySelectorAll('.task-row:not(.header)')].indexOf(e.target.closest('li'));
        detailArr.splice(index,1);
        i=0;
        allrows.forEach(function(row,index){
            const sno = row.querySelector('.no');
            sno.textContent = i+1;
            i++;
        })
        saveToLocal();
        renderTask();
     }
})

//EDITING THE FIELDS

taskList.addEventListener('click',function(e){
    if(e.target.closest('.edit-btn')){
        console.log('selectedhahahahah');
        const namespan = e.target.closest('li').querySelector('.name');
        const difficulty = e.target.closest('li').querySelector('.difficult');
        const importance = e.target.closest('li').querySelector('.important');
        const importanceVal = importance.textContent.trim().toUpperCase();
        const difficultyVal = difficulty.textContent.trim().toUpperCase();
        importance.outerHTML = `
            <select name="importance" class="task--details edit-imp">
                <option value="not-important" ${importanceVal==="NOT IMPORTANT"?"selected":""}>NOT IMPORTANT</option>
                <option value="important" ${importanceVal==="IMPORTANT"?"selected":""}>IMPORTANT</option>
                <option value="crucial" ${importanceVal==="CRUCIAL"?"selected":""}>CRUCIAL</option>
            </select>`;
        difficulty.outerHTML = `
            <select name="difficulty" class="task--details edit-diff">
                <option value="easy" ${difficultyVal==="EASY"?"selected":""}>EASY</option>
                <option value="medium" ${difficultyVal==="MEDIUM"?"selected":""}>MEDIUM</option>
                <option value="difficult" ${difficultyVal==="DIFFICULT"?"selected":""}>DIFFICULT</option>
            </select>`;
        namespan.outerHTML = `<input type="text" class ="edit-input" value="${namespan.textContent}">`;
        const input = e.target.closest('li').querySelector('.edit-input');
        const new_important = e.target.closest('li').querySelector('.edit-imp');
        const new_difficulty = e.target.closest('li').querySelector('.edit-diff');   
        input.focus();
        input.setSelectionRange(input.value.length,input.value.length); 
        input.addEventListener('keydown',function(e){
            if(e.key === "Enter"){
                saveEdit(input,new_difficulty,new_important);
            }
        });
        input.addEventListener('blur',function(e){
            const next = e.relatedTarget;
            console.log(next);
            if(next && (next.classList.contains('edit-imp') || next.classList.contains('edit-diff'))){
                return;
            }
            saveEdit(input,new_difficulty,new_important);
        })
        new_important.addEventListener('keydown',function(e){
            if(e.key === "Enter"){
                saveEdit(input,new_difficulty,new_important)
            }
        })
        new_important.addEventListener('blur',function(e){
            const next = e.relatedTarget;
            console.log(next);
            if(next && (next.classList.contains('edit-imp') || next.classList.contains('edit-diff'))){
                return;
            }
            saveEdit(input,new_difficulty,new_important);
        })
        new_difficulty.addEventListener('keydown',function(e){
            if(e.key === "Enter"){
                saveEdit(input,new_difficulty,new_important)
            }
        })
        new_difficulty.addEventListener('blur',function(e){
            const next = e.relatedTarget;
            console.log(next);
            if(next && (next.classList.contains('edit-imp') || next.classList.contains('edit-diff'))){
                return;
            }
            saveEdit(input,new_difficulty,new_important);
        })
    }
})
// SAVING AN EDIT
const saveEdit = function(inp,difficulty,importance){
    // inp.outerHTML =`<span class="col name">${inp.value.trim() || "Untitled Task"}</span>`;
    // difficulty.outerHTML=`<span class= "col difficult">${difficulty.value.trim().toUpperCase()}</span>`;
    // importance.outerHTML=`<span class= "col important">${importance.value.trim().toUpperCase()}</span>`;
    const index = [...taskList.querySelectorAll('.task-row:not(.header)')].indexOf(inp.closest('li'));
    detailArr[index] = {
        taskName: inp.value.trim() || "Untitled Task",
        importance: importance.value.trim().toUpperCase(),
        difficulty: difficulty.value.trim().toUpperCase()
    };
    saveToLocal();
    renderTask();
} 
// RESET BUTTON
const resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', function() {
    detailArr = [];
    localStorage.removeItem("tasks");
    renderTasks();
});

renderTask();