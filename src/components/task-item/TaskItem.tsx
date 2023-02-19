import { useSortable } from "@dnd-kit/sortable";
import { FC } from "react";
import styles from "./TaskItem.module.css";
import { CSS } from "@dnd-kit/utilities";

interface ITaskItem {
  title: string;
}

const TaskItem: FC<ITaskItem> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props.title
    });
  return (
    <li
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition
      }}
      className={styles["list-item"]}
    >
      {props.title}
    </li>
  );
};

export default TaskItem;
