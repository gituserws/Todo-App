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
      editableTask: "",
      createProject: false,
      createTask: false
    };
  }
  componentWillMount() {
    document.addEventListener("click", this.cancelEditMode, false);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.cancelEditMode, false)
  }
  componentDidMount() {
    this.getProjects();
  }
  getProjects = () => {
    axios
      .get("http://localhost:3001/api/projects")
      .then(response => {
        this.setState({ projects: response.data });
        if (response.data) {
          axios
            .get("http://localhost:3001/api/tasks", { params: { projectId: response.data[0]._id } })
            .then(result => {
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
    axios
      .get("http://localhost:3001/api/tasks", { params: { projectId: projectId } })
      .then(response => {
        this.setState({ tasks: response.data }, () => console.log('get tasks', this.state.tasks));
      }).catch(error => {
        console.log(error);
      });
  }
  handleClick = (project, index) => {
    let previousIndex = this.state.activeProject;
    this.setState({ activeProject: index }, () => {
      if (previousIndex !== this.state.activeProject) this.getTasks(project._id);
    });

  }
  changeEditMode = (project, i) => {
    if (project === true)
      this.setState({ editableProject: i })
    else
      this.setState({ editableTask: i })
  }
  cancelEditMode = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      // alert('You clicked outside of me!');
      this.setState({ editableProject: "", editableTask: "" });
    }

  }

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  }
  renderProjects = () => {
    if (this.state.projects) {
      return (
        <div>
          <p className="project-title">Your projects</p>
          <div className="project-container">
            {this.state.projects.map((project, i) => {
              const className = this.state.activeProject === i ? 'project active' : 'project';
              let projectO = { id: project._id, index: i };
              return this.state.editableProject === i ?
                <div ref={this.setWrapperRef} key={i}>
                  <input type="text" name="projectName"
                    onChange={this.handleChange}
                    defaultValue={project.name} />
                  <button className="edit-button" onClick={() => this.editProject(projectO)} >Edit</button>
                  <button className="delete-button" onClick={() => this.removeProject(projectO)} >-</button></div> :
                <div className={className} key={i} onClick={() => this.handleClick(project, i)}
                  onDoubleClick={() => this.changeEditMode(true, i)}>
                  <p className="project-block">P{i + 1}</p>
                  {project.name}
                </div>
            }

            )} </div></div>
      );
    }
  }

  renderTasks = () => {
    if (this.state.tasks) {
      return (
        <div className="task-container">
          <div className="in-progress-container">
            <p className="status-title">In progress</p>
            <div>
              <div className="task-first-row">TASK</div>
              {this.state.tasks.map((task, i) => {
                let taskO = { id: task._id, index: i };
                const className = this.state.editable === i ? 'editable task-input' : 'task-input';
                return (task.isDone === false ?
                  <div key={i} className="task">
                    <div className="task-label">
                      <label htmlFor="checkid1" />
                      <input
                        id="checkid1"
                        name="isDone"
                        type="checkbox"
                        checked={false}
                        onChange={(e) => this.handleStatusChange(taskO, e)} />
                      <input type="text"
                        id="checkid1"
                        name="taskContent" className={className}
                        defaultValue={task.content}
                        onChange={this.handleChange} />
                    </div>
                    <div>
                      <button className="edit-button" onClick={() => this.editTask(taskO)} >Edit</button>
                      <button className="delete-button" onClick={() => this.removeTask(taskO)} >-</button>
                    </div>
                  </div> : null)
              }

              )}
            </div>
          </div>
          <div className="done-container">
            <p className="status-title">Done</p>
            <div>
              <div className="task-first-row">TASK</div>
              {this.state.tasks.map((task, i) => {
                let taskO = { id: task._id, index: i };
                const className = this.state.editable === i ? 'editable task-input' : 'task-input';
                return (task.isDone === true ? (
                  <div key={i} className="task">
                    <div className="task-label">
                      <label htmlFor="checkid" />
                      <input
                        name="isDone"
                        type="checkbox"
                        id="checkid"
                        checked={true}
                        onChange={(e) => this.handleStatusChange(taskO, e)} />
                      <input type="text"
                        id="checkid"
                        name="taskContent" className={className}
                        defaultValue={task.content}
                        onChange={this.handleChange}
                        style={{ textDecoration: true ? "line-through" : "" }} />
                    </div>
                    <div>
                      <button className="edit-button" onClick={() => this.editTask(taskO)} >Edit</button>
                      <button className="delete-button" onClick={() => this.removeTask(taskO)} >-</button>
                    </div>
                  </div>) : null)
              }

              )}
            </div></div>
        </div>)
    }
  }
  editTask = (task) => {
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
  handleCreateProject = () => {
    this.setState({ createProject: !this.state.createProject })
  }
  handleCreateTask = () => {
    this.setState({ createTask: !this.state.createTask })
  }
  render() {
    return (
      <div className="App" >
        <header className="App-header">
          <img src={todologo} className="App-logo" alt="logo" />
          <div id="createButton">
            {this.state.projects.length > 0 ?
              <div>{this.state.createTask ? <div>
                <input type="text" value={this.state.taskContent} name="taskContent"
                  onChange={this.handleChange} />
                <button onClick={() => this.addTask(this.state.projects[this.state.activeProject]._id)} >Create</button>
              </div> : <button className='large' onClick={this.handleCreateTask}>Create Task</button>}
              </div> : null}
          </div>
        </header>
        <div className='main-columns'>
          <div className='project-list'>
            {this.state.createProject ?
              <div>
                <input type="text" value={this.state.projectName} name="projectName"
                  onChange={this.handleChange} />
                <button onClick={this.addProject}>Create</button>
              </div> :
              <button className="project-button" onClick={this.handleCreateProject}>Create Project</button>}
            {this.renderProjects()}
          </div>
          <div className='task-list'>

            {this.renderTasks()}
          </div>
        </div>


      </div>
    );
  }
}


export default App;
