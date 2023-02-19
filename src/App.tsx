import { DndContext, DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import styles from "./App.module.css";
import TaskList from "./components/task-list/TaskList";

interface ITaskList {
  [key: string]: string[];
}

const App = () => {
  const [taskList, setTaskList] = useState<ITaskList>({
    Planned: ["Learn React", "Learn dnd-kit", "Learn Typescript"],
    Processed: ["Learn CSS"],
    Done: []
  });

  const dragEndHandler = (e: DragEndEvent) => {
    // Check if item is drag into unknown area
    if (!e.over || !e.active.data.current || !e.over.data.current) return;

    // Check if item position is the same
    if (e.active.id === e.over.id) return;

    // Check if item is moved outside of the column
    if (
      e.active.data.current.sortable.containerId !==
      e.over.data.current.sortable.containerId
    )
      return;

    // Sort the items list order based on item target position
    const containerName = e.active.data.current.sortable.containerId;
    setTaskList((taskList) => {
      const temp = { ...taskList };
      if (!e.over) return temp;
      const oldIdx = temp[containerName].indexOf(e.active.id.toString());
      const newIdx = temp[containerName].indexOf(e.over.id.toString());
      temp[containerName] = arrayMove(temp[containerName], oldIdx, newIdx);
      return temp;
    });
  };

  const dragOverHandler = (e: DragOverEvent) => {
    // Check if item is drag into unknown area
    if (!e.over) return;

    // Get the initial and target sortable list name
    const initialContainer = e.active.data.current?.sortable?.containerId;
    const targetContainer = e.over.data.current?.sortable?.containerId;

    // if there are none initial sortable list name, then item is not sortable item
    if (!initialContainer) return;

    // Order the item list based on target item position
    setTaskList((taskList) => {
      const temp = { ...taskList };

      // If there are no target container then item is moved into a droppable zone
      // droppable = whole area of the sortable list (works when the sortable list is empty)
      if (!targetContainer) {
        // If item is already there then don't re-added it
        if (taskList[e.over!.id].includes(e.active.id.toString())) return temp;

        // Remove item from it's initial container
        temp[initialContainer] = temp[initialContainer].filter(
          (task) => task !== e.active.id.toString()
        );

        // Add item to it's target container which the droppable zone belongs to
        temp[e.over!.id].push(e.active.id.toString());

        return temp;
      }

      // If the item is drag around in the same container then just reorder the list
      if (initialContainer === targetContainer) {
        const oldIdx = temp[initialContainer].indexOf(e.active.id.toString());
        const newIdx = temp[initialContainer].indexOf(e.over!.id.toString());
        temp[initialContainer] = arrayMove(
          temp[initialContainer],
          oldIdx,
          newIdx
        );
      } else {
        // If the item is drag into another different container

        // Remove item from it's initial container
        temp[initialContainer] = temp[initialContainer].filter(
          (task) => task !== e.active.id.toString()
        );

        // Add item to it's target container
        const newIdx = temp[targetContainer].indexOf(e.over!.id.toString());
        temp[targetContainer].splice(newIdx, 0, e.active.id.toString());
      }

      return temp;
    });
  };

  return (
    // Attach the dragEnd and dragOver event listeners
    <DndContext onDragEnd={dragEndHandler} onDragOver={dragOverHandler}>
      <main className={styles.main}>
        <h1>Multi Sortable List</h1>
        <section className={styles.container}>
          {Object.keys(taskList).map((key) => (
            <TaskList key={key} title={key} tasks={taskList[key]} />
          ))}
        </section>
      </main>
    </DndContext>
  );
};

export default App;
