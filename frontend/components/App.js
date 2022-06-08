import React from 'react';
import axios from 'axios';

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    todoNameInput: '',
    displayCompleteds: true
  }

  onTodoNameInputChange = (evt) => {
    const {value} = evt.target;
    this.setState({
      ...this.state, todoNameInput: value
    });
  }

  resetForm = () => {
    this.setState({ ...this.state, todoNameInput: '' })
  }

  postNewTodo = () => {
    axios.post(URL, { name: this.state.todoNameInput })
      .then(res => {
        this.setState({
          ...this.state, todos: this.state.todos.concat(res.data.data)
        })
        this.resetForm();
      })
      .catch(err => {
        console.error(err)
      })
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    this.postNewTodo() 
  }

  fetchAllTodos = () => {
    axios.get(URL)
      .then(res => {
        this.setState({
          ...this.state, todos: res.data.data
        })
      })
      .catch(err => {
        console.error(err)
      })
  }

  toggleCompleted = (id) => () => {
    axios.patch(`${URL}/${id}`)
      .then(res => {
        this.setState({
          ...this.state, todos: this.state.todos.map(todo => {
            if (todo.id !== id) return todo
            return res.data.data
          })
        })
      })
      .catch(err => {
        console.error(err)
      })
  }

  toggleDisplayCompleteds = () => {
    this.setState({
      ...this.state, displayCompleteds: !this.state.displayCompleteds
    })
  }

  componentDidMount() {
    // fetch all todos from server
    this.fetchAllTodos()
  }

  render() {
    return (
      <div>
        {
          this.state.todos.map(todo => {
            return <div onClick={this.toggleCompleted(todo.id)} key={todo.id}> {todo.name} {todo.completed ? ' Complete' : ''} </div>
          })
        }
      </div>
    )
  }
}
