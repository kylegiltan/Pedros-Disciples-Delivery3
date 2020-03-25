import React, { Component } from "react";
import { render } from "react-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false,
      placeholder: "Loading"
    };
  }

  componentDidMount() {
    fetch("api/login")
      .then(response => {
        console.log(response)
        if (response.status > 400) {
          return this.setState(() => {
            return { placeholder: "Something went wrong!" };
          });
        }
        return response.json();
      })
      .then(data => {
        this.setState(() => {
          return {
            data,
            loaded: true
          };
        });
      })
      .catch()
      {
        console.log("Failed to produce readable json");
      };
  }

  render() {
    return (
      <ul>
        {this.state.data.map(person => {
          return (
            <li key={person.id}>
              {person.username} - {person.password}
            </li>
          );
        })}
      </ul>
    );
  }
}

export default App;

const container = document.getElementById("root");
render(<App />, container);