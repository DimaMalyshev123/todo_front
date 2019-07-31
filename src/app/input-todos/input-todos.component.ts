import { Todo, State } from "./../models/todo";
import { Component, OnInit } from "@angular/core";
import { TestService } from "../services/test.service";
import { TodoService } from "./../todo.service";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import * as actionsTodos from "../actions/todo.actions";

@Component({
  selector: "app-input-todos",
  templateUrl: "./input-todos.component.html",
  styleUrls: ["./input-todos.component.css"]
})
export class InputTodosComponent implements OnInit {
  selected: Todo = { title: "", description: "", _id: "", completed: false };
  isLoading: boolean = false;
  filter: string = "all";
  modeFormAdd: boolean = true;
  ButtonText: string = "Add";
  toDoList: Todo[] = [];
  nothingTodo: boolean;
  remove: boolean = false;
  stateTodo$: Observable<State>;
  _state: State;

  constructor(
    private testService: TestService,
    private todoService: TodoService,
    private store: Store<{ State }>
  ) {
    this.stateTodo$ = store.pipe(select("todoState"));
    this.stateTodo$.subscribe(state => {
      this._state = state;
      console.log(this._state);
    });
  }

  ngOnInit() {
    this.todoService.getAllTodo().subscribe(res => {
      this.updateList(res);

      this.store.dispatch(actionsTodos.initAction({ todoList: this.toDoList }));
    });
  }

  updateList(res: Todo[]) {
    this.toDoList = [];
    this.nothingTodo = true;

    for (let i = 0; i < res.length; i++) {
      this.toDoList.push(res[i]);
    }
    if (this.toDoList.length) this.nothingTodo = false;
    this.isLoading = true;
  }

  addToDo(todos: Todo): void {
    this.isLoading = false;
    this.todoService.addTodo(todos).subscribe(res => {
      this.updateList(res);

      this.store.dispatch(actionsTodos.addTodo({ todo: todos }));
    });

    this.filter = "all";

    this.testService.openSnackBar(
      `Title ${todos.title}. Record successfully added!`,
      "Done"
    );
  }

  changeFilter(value: string): void {
    this.filter = value;

    let list = this.toDoList;
    if (value == "active") {
      list = list.filter(todo => {
        if (!todo.completed) return true;
      });
    }

    if (value == "completed") {
      list = list.filter(todo => {
        if (todo.completed) return true;
      });
    }

    this.store.dispatch(
      actionsTodos.changeFilter({ todoList: list, filter: value })
    );
  }

  toggleText(id: string): void {
    if (!this.remove) {
      for (let i = 0; i < this.toDoList.length; i++) {
        if (this.toDoList[i]._id == id) {
          this.selected = this.toDoList[i];

          this.store.dispatch(
            actionsTodos.selectedTodo({ selectTodo: this.selected })
          );

          this.modeFormAdd = false;
          this.ButtonText = "Edit";
        }
      }
    }
    this.remove = false;
  }

  removeTodos(id: string): void {
    this.isLoading = false;
    this.todoService.deleteTodo(id).subscribe(res => {
      this.updateList(res);

      this.store.dispatch(actionsTodos.deleteTodo({ todoList: this.toDoList }));
    });

    this.testService.openSnackBar("Record successfully deleted!", "Done");
    this.remove = true;
    this.filter = "all";

    this.clearForm();
  }

  allCompleted(): void {
    this.isLoading = false;
    this.todoService.allCompleted().subscribe(res => {
      this.updateList(res);
    });
  }

  removeCompleted(): void {
    this.isLoading = false;
    this.todoService.deleteCompleted().subscribe(res => {
      this.updateList(res);

      this.store.dispatch(actionsTodos.deleteTodo({ todoList: this.toDoList }));

      this.filter = "all";
    });
    this.clearForm();
  }

  editToDo(todo: Todo) {
    this.isLoading = false;
    this.todoService.editTodo(todo).subscribe(res => {
      this.updateList(res);

      this.store.dispatch(actionsTodos.editTodo({ todoList: this.toDoList }));
    });

    this.testService.openSnackBar(
      `Title ${todo.title}. Record successfully edited!`,
      "Done"
    );

    this.modeFormAdd = true;
    this.ButtonText = "Add";
    this.filter = "all";
  }

  clearForm() {
    this.selected = { title: "", description: "", _id: "", completed: false };
  }
}
