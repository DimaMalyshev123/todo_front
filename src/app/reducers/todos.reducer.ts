import { createReducer, on } from "@ngrx/store";
import { State } from "../models/todo";
import * as actionsTodos from "../actions/todo.actions";

export const initialState: State = {
  todos: null,
  selectedTodo: null,
  filter: "all"
};

const changeFilter = (state, filter, todoList) => ({
  ...state,
  filter: filter,
  todos: todoList,
  selectedTodo: null
});

const selectedTodo = (state, selectTodo) => ({
  ...state,
  selectedTodo: selectTodo
});

const addTodo = (state, todo) => ({
  ...state,
  todos: [...state.todos, todo],
  selectedTodo: null
});

const editTodo = (state, todoList) => ({
  ...state,
  todos: todoList,
  selectedTodo: null
});

const deleteTodo = (state, todoList) => ({
  ...state,
  todos: todoList,
  selectedTodo: null
});

const initAction = (state, todoList) => ({
  ...state,
  todos: todoList
});

export const TodoReducer = createReducer(
  initialState,
  on(actionsTodos.changeFilter, (state, { filter, todoList }) =>
    changeFilter(state, filter, todoList)
  ),

  on(actionsTodos.selectedTodo, (state, { selectTodo }) =>
    selectedTodo(state, selectTodo)
  ),

  on(actionsTodos.addTodo, (state, { todo }) => addTodo(state, todo)),
  on(actionsTodos.editTodo, (state, { todoList }) => editTodo(state, todoList)),

  on(actionsTodos.deleteTodo, (state, { todoList }) =>
    deleteTodo(state, todoList)
  ),

  on(actionsTodos.initAction, (state, { todoList }) =>
    initAction(state, todoList)
  )
);
