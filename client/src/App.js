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
      projectName: ''
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
  renderProjects = () => {
    if (this.state.projects) {
      console.log('yes', this.state.projects)
      return (
        <ol>
          {this.state.projects.map((project, i) =>
            <div ><p>
              {project.name}
            </p></div>


          )} </ol>
      );
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
