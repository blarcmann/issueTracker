import React, { Component } from 'react';
import 'whatwg-fetch';
import './App.css';
import { IssueAdd } from './issueAdd';
import IssueFilter from './issueFilter';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
const axios = require('axios');

const IssueRow = (props) => (
  <tr>
    <td><Link to={`/issues/${props.issue._id}`}>{props.issue._id.substr(-4)}</Link></td>
    <td>{props.issue.status}</td>
    <td>{props.issue.owner}</td>
    <td>{props.issue.created.toDateString()}</td>
    <td>{props.issue.effort}</td>
    <td>{props.issue.completionDate ? props.issue.completionDate.toDateString() : ''}</td>
    <td>{props.issue.title}</td>
  </tr>
)

function IssueTable(props) {
  const issueRows = props.issues.map(issue =>
    <IssueRow key={issue._id} issue={issue} />);
  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Completion Date</th>
          <th>Title</th>
        </tr>
      </thead>
      <tbody>{issueRows}</tbody>
    </table>
  );
}

const baseUrl = 'http://localhost:4003';
axios.defaults.headers.post['Content-Type'] = 'application/json';
class App extends Component {
  constructor() {
    super();
    this.state = {
      issues: []
    }
    this.loadData = this.loadData.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.createIssue = this.createIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const oldQuery = queryString.parse(prevProps.location.search);
    const newQuery = queryString.parse(this.props.location.search);
    if (oldQuery.status === newQuery.status && oldQuery.effort_gte === newQuery.effort_gte &&
      oldQuery.effort_lte === newQuery.effort_lte) {
      return;
    }
    this.loadData();
  }

  setFilter(query){
    this.props.history.push({ pathname: this.props.location.pathname });
  }

  loadData() {
    fetch(`${baseUrl}/api/issues${this.props.location.search}`).then(response => {
      if (response.ok) {
        response.json().then(data => {
          console.log("Total count of records:", data._metadata.total_count);
          console.log(data.records);
          data.records.forEach(issue => {
            issue.created = new Date(issue.created);
            if (issue.completionDate)
              issue.completionDate = new Date(issue.completionDate);
          });
          this.setState({ issues: data.records });
        });
      } else {
        response.json().then(error => {
          alert("Failed to fetch issues:" + error.message)
        });
      }
    }).catch(err => {
      alert("Error in fetching data from server:", err);
    });
  }

  createIssue(newIssue) {
    fetch('http://localhost:4003/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newIssue),
    }).then(response => {
      if (response.ok) {
        response.json().then(updatedIssue => {
          updatedIssue.created = new Date(updatedIssue.created);
          if (updatedIssue.completionDate)
            updatedIssue.completionDate = new Date(updatedIssue.completionDate);
          const newIssues = this.state.issues.concat(updatedIssue);
          this.setState({ issues: newIssues });
        });
      } else {
        response.json().then(error => {
          alert("Failed to add issue: " + error.message)
        });
      }
    }).catch(err => {
      alert("Error in sending data to server: " + err.message);
    });
  }
  render() {
    return (
      <div className="App">
        <div className="header">
          <h4>ISSUE TRACKER</h4>
        </div>
        <div className="content">
        <IssueFilter setFilter={this.setFilter} initFilter={this.props.location} />
          <hr /><br />
          <IssueTable issues={this.state.issues} />
          <hr /><br />
          <IssueAdd createIssue={this.createIssue} />
        </div>
        <div className="footer">FOOTIE</div>
      </div>
    );
  }
}

export default App;
