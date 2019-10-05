import React, { Component } from "react";
import axios from "axios";
import logo from './logo.svg';
import './App.css';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      tasks: [],
      projectName: '',
      taskContent: '',
      activeProject: 0
    };
  }
  componentDidMount() {
    console.log('mount')
    this.getProjects();
  }
  getProjects = () => {
    axios
      .get("http://localhost:3001/api/projects")
      .then(response => {
        console.log("getproject response", response.data);
        this.setState({ projects: response.data });
        if (response.data) {
          console.log('response data', response.data)
          axios
            .get("http://localhost:3001/api/tasks", { params: { projectId: response.data[0]._id } })
            .then(result => {
              console.log("get first project tasks response", result.data);
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
      })
      .then(this.getTasks(projectId))
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
        this.setState({ tasks: response.data });
      }).catch(error => {
        console.log(error);
      });
  }
  handleClick = (project, index) => {
    //console.log('handleclick');
    this.setState({ activeProject: index });
    this.getTasks(project._id);
  }
  renderProjects = () => {
    if (this.state.projects) {
      //console.log('yes', this.state.projects);
      return (
        <ol>
          {this.state.projects.map((project, i) => {
            const className = this.state.activeProject === i ? 'project active' : 'project';
            return (<div className={className} key={i} onClick={() => this.handleClick(project, i)}>
              {project.name}
            </div>)
          }

          )} </ol>
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
          <ol>
            {this.state.tasks.map((task, i) => {
              return (<div key={i} onClick={() => console.log("task clicked", i)}>
                {task.content}
              </div>)
            }

            )}
          </ol>
        </div>)
    }
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value // the value of the text input
    });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>
            <input type="text" value={this.state.projectName} name="projectName"
              onChange={this.handleChange} />
            <button onClick={this.addProject} >Create</button>
          </div>
          {this.renderProjects()}
          {this.renderTasks()}
          <p>
            Edit <code>src/App.js</code> and save to reload.
        </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
        </a>
        </header>
      </div>
    );
  }
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
