import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  loadingTodo: number[];
  handleToggle: (todo: Todo) => void;
  handleEdit: (todo: Todo, updatedTitle: string) => Promise<boolean>;
  inputRef: React.RefObject<HTMLInputElement>;
  error: string;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  loadingTodo,
  handleToggle,
  handleEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  // Сохраняем изменения в заголовке
  async function handleSave() {
    const normalizedTitle = editedTitle.trim();

    if (normalizedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (normalizedTitle === '') {
      onDelete(todo.id);

      return;
    }

    const success = await handleEdit(todo, normalizedTitle);

    if (success) {
      setIsEditing(false);
    } else {
    }
  }

  // Включаем режим редактирования
  function handleDoubleClick() {
    setIsEditing(true);
  }

  // Обработчик нажатия клавиш
  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  }

  // Обработчик потери фокуса
  function handleBlur() {
    handleSave();
  }

  // Обработчик отправки формы
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSave();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggle(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            data-cy="TodoTitleField"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            placeholder="Empty todo will be deleted"
            onKeyDown={handleKeyDown} // Используем onKeyDown, а не onKeyUp
            className="todo__title-field"
            autoFocus
            onBlur={handleBlur}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodo.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
