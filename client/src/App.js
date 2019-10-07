import React, { Component } from "react";
import axios from "axios";
//import logo from './logo.svg';
import './App.css';
import todologo from "./logo-todoapp.png";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      tasks: [],
      projectName: '',
      taskContent: '',
      activeProject: 0,
      isDone: false,
      editableProject: "",
      editableTask: ""
    };
  }
  componentWillMount() {
    document.addEventListener("click", this.cancelEditMode, false);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.cancelEditMode, false)
  }
  componentDidMount() {
    console.log('mount')
    this.getProjects();
  }
  getProjects = () => {
    axios
      .get("http://localhost:3001/api/projects")
      .then(response => {
        //console.log("getproject response", response.data);
        this.setState({ projects: response.data });
        if (response.data) {
          //console.log('response data', response.data)
          axios
            .get("http://localhost:3001/api/tasks", { params: { projectId: response.data[0]._id } })
            .then(result => {
              //console.log("get first project tasks response", result.data);
              this.setState({ tasks: result.data });
            }).catch(error => {
              console.log(error);
            });
        }
      }).catch(error => {
        console.log(error);
      });

  }
  addProject = () => {
    axios
      .post("http://localhost:3001/api/projects", {
        name: this.state.projectName
      })
      .then(response => {
        console.log("response", response);
      })
      .then(this.getProjects)
      .catch(error => {
        console.log(error);
      })
  }
  addTask = (projectId) => {
    axios
      .post("http://localhost:3001/api/tasks", {
        content: this.state.taskContent,
        projectId: projectId
      })
      .then(response => {
        console.log("response", response);
        this.getTasks(projectId)
      })
      .catch(error => {
        console.log(error);
      })
  }
  getTasks = (projectId) => {
    console.log("gettasks", projectId);
    axios
      .get("http://localhost:3001/api/tasks", { params: { projectId: projectId } })
      .then(response => {
        console.log("gettasks response", response.data);
        this.setState({ tasks: response.data }, () => console.log('get tasks', this.state.tasks));
      }).catch(error => {
        console.log(error);
      });
  }
  handleClick = (project, index) => {
    console.log('handleclick', project, index);
    let previousIndex = this.state.activeProject;
    this.setState({ activeProject: index }, () => {
      if (previousIndex !== this.state.activeProject) this.getTasks(project._id);
    });

  }
  changeEditMode = i => {
    this.setState({ editableProject: i })
  }
  cancelEditMode = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      // alert('You clicked outside of me!');
      this.setState({ editableProject: "" });
    }

  }
  setWrapperRef = (node) => {
    this.wrapperRef = node;
  }
  renderProjects = () => {
    if (this.state.projects) {
      //console.log('yes', this.state.projects);
      return (
        <div>
          <h3>Your projects</h3>
          <ol>
            {this.state.projects.map((project, i) => {
              const className = this.state.activeProject === i ? 'project active' : 'project';
              let projectO = { id: project._id, index: i };
              return this.state.editableProject === i ?
                <div ref={this.setWrapperRef} key={i}><input type="text" name="projectName"
                  onChange={this.handleChange}
                  defaultValue={project.name} />
                  <button onClick={() => this.editProject(projectO)} >Edit</button>
                  <button onClick={() => this.removeProject(projectO)} >-</button></div> :
                <div className={className} key={i} onClick={() => this.handleClick(project, i)}
                  onDoubleClick={() => this.changeEditMode(i)}>
                  {project.name}
                </div>
            }

            )} </ol></div>
      );
    }
  }

  renderTasks = () => {
    if (this.state.tasks) {
      console.log('yes for tasks', this.state.tasks);
      return (
        <div>
          {this.state.projects.length > 0 ?
            <div>
              <input type="text" value={this.state.taskContent} name="taskContent"
                onChange={this.handleChange} />
              <button onClick={() => this.addTask(this.state.projects[this.state.activeProject]._id)} >Create</button>
            </div> : null}
          <h2>In progress</h2>
          <ol>
            {this.state.tasks.map((task, i) => {
              let taskO = { id: task._id, index: i };
              const className = this.state.editable === i ? 'task editable' : 'task';
              return (task.isDone === false ? (<div key={i}><label>
                <input
                  name="isDone"
                  type="checkbox"
                  checked={false}
                  onChange={(e) => this.handleStatusChange(taskO, e)} />
                <input type="text" name="taskContent" className={className}
                  defaultValue={task.content}
                  onChange={this.handleChange} />
              </label><button onClick={() => this.editTask(taskO)} >Edit</button>
                <button onClick={() => this.removeTask(taskO)} >-</button></div>) : null)
            }

            )}
          </ol>
          <h2>Done</h2>
          <ol>
            {this.state.tasks.map((task, i) => {
              let taskO = { id: task._id, index: i };
              const className = this.state.editable === i ? 'task editable' : 'task';
              return (task.isDone === true ? (<div key={i}><label >
                <input
                  name="isDone"
                  type="checkbox"
                  checked={true}
                  onChange={(e) => this.handleStatusChange(taskO, e)} />
                <input type="text" name="taskContent" className={className}
                  defaultValue={task.content}
                  onChange={this.handleChange}
                  style={{ textDecoration: true ? "line-through" : "" }} />
              </label><button onClick={() => this.editTask(taskO)} >Edit</button>
                <button onClick={() => this.removeTask(taskO)} >-</button></div>) : null)
            }

            )}
          </ol>
        </div>)
    }
  }
  editTask = (task) => {
    console.log('edit', task)
    axios
      .put("http://localhost:3001/api/tasks/" + task.id + "/content", {
        content: this.state.taskContent
      })
      .then(response => {
        console.log("response", response.data.task);
        const tasks = [...this.state.tasks];
        tasks[task.index] = { ...tasks[task.index], content: response.data.task.content };
        this.setState({ tasks });
      })
      .catch(error => {
        console.log(error);
      })
  }
  removeTask = (task) => {
    console.log('edit', task)
    axios
      .delete("http://localhost:3001/api/tasks/" + task.id)
      .then(response => {
        console.log("response", response.data.id);
        let tasks = [...this.state.tasks];
        tasks = tasks.filter(function (obj) {
          return obj._id !== task.id;
        });
        this.setState({ tasks });
      })
      .catch(error => {
        console.log(error);
      })
  }
  editProject = (project) => {
    console.log('edit', project)
    axios
      .put("http://localhost:3001/api/projects/" + project.id, {
        name: this.state.projectName
      })
      .then(response => {
        console.log("response", response.data.project);
        const projects = [...this.state.projects];
        projects[project.index] = { ...project[project.index], name: response.data.project.name };
        this.setState({ projects });
      })
      .catch(error => {
        console.log(error);
      })
  }
  removeProject = (project) => {
    console.log('edit', project)
    axios
      .delete("http://localhost:3001/api/projects/" + project.id)
      .then(response => {
        console.log("response", response.data.id);
        let projects = [...this.state.projects];
        projects = projects.filter(function (obj) {
          return obj._id !== project.id;
        });
        this.setState({ projects });
      })
      .catch(error => {
        console.log(error);
      })
  }
  handleStatusChange = (task, event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    }, () => {
      axios
        .put("http://localhost:3001/api/tasks/" + task.id + "/completed", {
          isDone: this.state.isDone
        })
        .then(response => {
          console.log("response", response.data.task.isDone);
          const tasks = [...this.state.tasks];
          tasks[task.index] = { ...tasks[task.index], isDone: response.data.task.isDone };
          this.setState({ tasks });
        })
        .catch(error => {
          console.log(error);
        })
    });
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value // the value of the text input
    });
  }
  render() {
    return (
      <div className="App" >
        <header className="App-header">
          <img src={todologo} className="App-logo" alt="logo" />
          <div className='rows'>
            <div className='row'>
              <input type="text" value={this.state.projectName} name="projectName"
                onChange={this.handleChange} />
              <button onClick={this.addProject} >Create</button>
              {this.renderProjects()}
            </div>
            <div className='row'>
              {this.renderTasks()}
            </div>
          </div>


        </header>
      </div>
    );
  }
}


export default App;
