import React, { useState } from 'react';

function TaskItemInput({taskId, handleAddItem }) {

    /* state for new item input */
    const [newItemName, setNewItemName] = useState("");

    function addItem(taskId) {
        handleAddItem(taskId, newItemName);
        setNewItemName("");
    }

    return (
        <div className="card-footer mt-3 d-flex justify-content-between align-items-center">
            <input
                placeholder="Enter the new item"
                value={newItemName}
                onChange={(event) => setNewItemName(event.target.value)}
            />
            <button
                onClick={() => addItem(taskId)}
                className="btn btn-primary"
            >
                Add Item
            </button>
        </div>
    );
}

export default TaskItemInput;