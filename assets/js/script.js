var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompleteEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");
var tasks = [];

var taskFormHandler = function (event) {
  //prevents browser from refreshing
  event.preventDefault();

  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  //check if input values are empty strings
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }

  //designed for only <form> elements. resets the form to default values
  formEl.reset();

  var isEdit = formEl.hasAttribute("data-task-id");

  //package up data as an object
//   var taskDataObj = {
//     name: taskNameInput,
//     type: taskTypeInput,
//   };

  //send it as an argument to createTaskEl
  //has data attribute 'data-task-id', so get task id and call function to complete edit process
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } /* no data attribute, so create object as normal and pass to createTaskEl function */ else {
    //package up data as an object
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do"
      };
      
      createTaskEl(taskDataObj);
  }
};

var completeEditTask = function (taskName, taskType, taskId) {
    //find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    saveTasks();

    alert("Task updated");

    //remove task id and change button to default
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}

var createTaskEl = function (taskDataObj) {
    //create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //add task id as a custom attribute. .setAttribute can be used to add or update any attribute on an HTML element
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    //create div to hold task info to add to do list item
    var taskInfoEl = document.createElement("div");
    //give it a class name
    taskInfoEl.className = "task-info";

    //add html content to div with .innerHTML (.addTextContent would add everything as a string instead of as HTML elements)
    taskInfoEl.innerHTML =
        "<h3 class='task-name'>" +
        taskDataObj.name +
        "</h3><span class='task-type'>" +
        taskDataObj.type +
        "</span>";
    
    //add div to li
    listItemEl.appendChild(taskInfoEl);

    //variable to call function to create buttons and dropdown
    var taskActionsEl = createTaskActions(taskIdCounter);
    
    //add buttons and dropdown to list item
    listItemEl.appendChild(taskActionsEl);

    //add entire list item to list 
    tasksToDoEl.appendChild(listItemEl);

    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);
    
    saveTasks();

    //increase task counter for next unique id
    taskIdCounter++;
};

var createTaskActions = function (taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    //create select dropdown
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];

      /*for loop breakdown: 
    var i = 0; defines an initial counter(iterator) variable. 
    i < statusChoices.length keeps the for loop running by checking the iterator against the number of items in the array (.length returns the number of items).  
    i++ increments the counter by 1 after each loop iteration. 
    statusChoices[i] returns the value of the array at the given index (when i=0, the first item in the array will be returned).
    When i is greater than the length of, in this case, the array, the for loop will stop.*/

    for (var i = 0; i < statusChoices.length; i++){
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    };

    return actionContainerEl;
};

var taskButtonHandler = function (event) {
    //get target element from event
    var targetEl = event.target;

    //edit button was clicked
     if (targetEl.matches(".edit-btn")) {
        //get the element's task id
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    } /*delete button was clicked*/ else if (targetEl.matches(".delete-btn")) {
        //get the element's task id
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var deleteTask = function (taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    //create new array to hold updated list of tasks
    var updatedTaskArr = [];

    //loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        //if tasks[i].id doesn't match the value of taskId, keep that task
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    //reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    saveTasks();
};

var editTask = function (taskId) {
    //get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get content from task name and type
    //.querySelector can be used to search any DOM element, not just the document object
    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);
};

var taskStatusChangeHandler = function (event) {
    //get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    //get the currently selected options value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //moves selected task to appropriate column
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    } else if (statusValue === "completed") {
        tasksCompleteEl.appendChild(taskSelected);
    }

    //update tasks in tasks array
    for (i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    saveTasks();
};

var saveTasks = function () {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var loadTasks = function () {
    //get task items from local localStorage
    var savedTasks = localStorage.getItem("tasks");

    //if there are no saved tasks, sets tasks to an empty array and return out of the function
    if (savedTasks === null) {
        return false;
    }
   
    //converts tasks from string format back into array of objects
    savedTasks = JSON.parse(savedTasks);

    //iterates through a task's array and creates task elements on the page from it
    for (var i = 0; i < savedTasks.length; i++) {
        createTaskEl(savedTasks[i]);
    }
}

//submit event listens for both click and enter key to submit a form 
formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);


 loadTasks();