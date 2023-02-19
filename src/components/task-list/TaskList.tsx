import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { FC } from "react";
import TaskItem from "../task-item/TaskItem";
import styles from "./TaskList.module.css";

interface ITaskList {
  title: string;
  tasks: string[];
}

const TaskList: FC<ITaskList> = (props) => {
  const { setNodeRef } = useDroppable({ id: props.title });

  return (
    <article className={styles.column}>
      <h1>{props.title}</h1>
      <div className={styles.divider} />
      <SortableContext id={props.title} items={props.tasks}>
        <ul ref={setNodeRef} className={styles.list}>
          {props.tasks.map((task) => (
            <TaskItem key={task} title={task} />
          ))}
        </ul>
      </SortableContext>
    </article>
  );
};

export default TaskList;
