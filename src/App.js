import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
} from "reactstrap";
import "./index.css";
import TaskItemInput from "./TaskItemInput";

function App() {

  
  const [modal, setModal] = useState(false);

  /*card name */
  const [taskName, setTaskName] = useState("");


  /* cards  in begining it will be empty array but once i add task card it will contain list of object =>
     const newTask = {
      taskName: trimmedTaskName,
      id: Date.now(),
      items: [],
    };
 the items will be empty array but once i add item it will containe list of object */
  const [taskList, setTaskList] = useState([]);

  /*validation */
  const [taskNameError, setTaskNameError] = useState("");

  /* state for new item input */
  // const [newItemName, setNewItemName] = useState(""); 

  /* take the task name (cardname) */
  function handleInputTaskName(event) {
    setTaskName(event.target.value);
    if (event.target.value.trim() === "") {
      setTaskNameError("Please enter the task name");
    } else {
      setTaskNameError("");
    }
  }

  /* when you create new task (card) */
  function createTask() {
    const trimmedTaskName = taskName.trim();

    if (!trimmedTaskName) {
      setTaskNameError("* Please enter the task name");
      return;
    }

    const newTask = {
      taskName: trimmedTaskName,
      id: Date.now(),
      items: [],
    };
    setTaskList([...taskList, newTask]);
    setModal(false);
    setTaskName("");
  }

  /* change the task card title */
  function handleTitleChange(event, taskId) {
    const newTitle = event.target.value;
    setTaskList(
      taskList.map((task) =>
        task.id === taskId ? { ...task, taskName: newTitle } : task
      )
    );
  }

  /*delete the task (card) */
  const handleDeleteCard = (taskId) => {
    setTaskList(taskList.filter((task) => task.id !== taskId));
  };

  
/*change the item text */
  function handleItemChange(event, taskId, itemId) {
    const newText = event.target.value;
    setTaskList(
      taskList.map((task) =>
        task.id === taskId
          ? {
              ...task,
              items: task.items.map((item) =>
                item.id === itemId ? { ...item, text: newText } : item
              ),
            }
          : task
      )
    );
  }

  /* delete the item inside the task(card) */
  const handleDeleteItem = (taskId, itemId) => {
    const updatedTaskList = taskList.map((task) =>
      task.id === taskId
        ? { ...task, items: task.items.filter((item) => item.id !== itemId) }
        : task
    );
    setTaskList(updatedTaskList);
  };

  /* button of add new item input */
  function handleAddItem(taskId ,newItemName) {
    if (newItemName.trim() !== "") {
      const newItem = { id: Math.random(), text: newItemName.trim() };
      setTaskList(
        taskList.map((task) =>
          task.id === taskId ? { ...task, items: [...task.items, newItem] } : task
        )
      );
    }
  }
  
/*drag and drop function */
const handleDragEnd = (result) => {

  console.log("handleDragEnd");
  // destination is null when we drop it outside the drop
  // destination is the column we drop card
  // source is the column card was drag from
  // draggabledId is the task that we are moving
  const { destination, source, draggableId } = result;
  console.log("destination : ", destination);
  console.log("source : ", source);
  console.log("draggableId : ", draggableId);

  // task is dropped in the same card (column) - do nothing
  if (!destination || source.droppableId === destination.droppableId) return;

  const task = findItemById(draggableId, [...taskList]);
  
  console.log("Task to add : ", task);

  // source.droppabledId is the column.id
  removeTaskFromColumn(source.droppableId, draggableId);

  console.log("Updated columns : ", taskList);

  // add task to the destination
  addDroppedTaskToDestinationColumn(destination.droppableId, task);

};

// function to find task from state column array and column.task array
function findItemById(itemId, taskList) {
  for (let i = 0; i < taskList.length; i++) {
    const task = taskList[i];
    const items = task.items;
    for (let j = 0; j < items.length; j++) {
      if (items[j].id === itemId) {
        return items[j]; // Return the items if found
      }
    }
  }
  return null; // Return null if item not found
}

// this function is called by handleDragEnd to delete task from a column
function removeTaskFromColumn(sourceDroppableId, taskId) {

  console.log("deletePreviousState sourceDroppableId : ", sourceDroppableId);
  console.log("deletePreviousState taskId : ", taskId);

  setTaskList(prevtaskLists=> {

      const updatedColumns = [...prevtaskLists]; // Create a copy of the columns array
  
      for (let i = 0; i < updatedColumns.length; i++) {
        if (updatedColumns[i].id === sourceDroppableId) { // find the column 
          const tasks = updatedColumns[i].tasks;
          for (let j = 0; j < tasks.length; j++) {
            if (tasks[j].id === taskId) { // find the task
              // Remove the task from the tasks array
              updatedColumns[i].tasks.splice(j, 1);
              break; // Task found and removed, exit the loop
            }
          }
          break; // Column found and task removed, exit the loop
        }
      }
  
      return updatedColumns;
    });
}

// this function add the task dragged to the new column i dropped
function addDroppedTaskToDestinationColumn(destinationDroppableId, draggedtask) {

  let  updateditem = { ...draggedtask, completed: false };

  setTaskList(
      taskList.map((task) => {
        if (task.id === destinationDroppableId) {
          return {
            ...task,
            items: [...task.items, updateditem],
          };
        }
        return task;
      })
    );

}

  const toggle = () => setModal(!modal);

  return (
    <>
      <div className="header">
        <h3>Todo List</h3>
        <button className="btn btn-danger" onClick={toggle}>
          Create Task
        </button>
      </div>
      <div className="modal">
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Create Task</ModalHeader>
          <ModalBody>
            <form>
              <div className="form-group">
                <label>Task Name :</label>
                <input
                  onChange={handleInputTaskName}
                  type="text"
                  className="form-control"
                  placeholder="Enter the new task name ..."
                  value={taskName}
                />
                {taskNameError && (
                  <span className="text-danger">{taskNameError}</span>
                )}
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={createTask}>
              Create
            </Button>{" "}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}> 
      
      <div className="task-container">
        <div className="card-wrapper">
          {taskList.map((task) => (
            <div className="card-column" key={task.id}>
              <Card>
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <input
                      type="text"
                      value={task.taskName}
                      onChange={(event) => handleTitleChange(event, task.id)}
                    />
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteCard(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="card-body">
                    <p className="card-text">{task.description}</p>
                  </div>
                  <ul>
                    {task.items.map((item) => (
                      <p className="card-text" key={item.id}>
                        <textarea
                          className="input-border"
                          value={item.text}
                          onChange={(event) =>
                            handleItemChange(event, task.id, item.id)
                          }
                          style={{ width: "80%", height: "auto" }}
                        />
                        <button
                          onClick={() => handleDeleteItem(task.id, item.id)}
                          className="btn btn-danger"
                        >
                          delete item
                        </button>
                      </p>
                     
                    ))}
                 
                    
                  </ul>
                </div>  
                 <TaskItemInput taskId={task.id}  handleAddItem={(taskId, newItemName) => handleAddItem(taskId, newItemName)}/>
              </Card>
            </div>
          ))}
        </div>
      </div>
      </DragDropContext>
    </>
  );
}

export default App;
