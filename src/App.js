import React, { Component } from 'react';
import 'whatwg-fetch';
import './App.css';
import { Navbar, Nav, Table, Button }
  from 'react-bootstrap';
import { IssueAdd } from './issueAdd';
import IssueFilter from './issueFilter';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
const axios = require('axios');

const IssueRow = (props) => {
  function onDeleteClick() {
    props.deleteIssue(props.issue._id);
  }
  return (
    <tr>
      <td><Link to={`/issues/${props.issue._id}`}>{props.issue._id.substr(-4)}</Link></td>
      <td>{props.issue.status}</td>
      <td>{props.issue.owner}</td>
      <td>{props.issue.created.toDateString()}</td>
      <td>{props.issue.effort}</td>
      <td>{props.issue.completionDate
        ? props.issue.completionDate.toDateString()
        : ''}</td>
      <td>{props.issue.title}</td>
      <td><Button variant="outline-danger" size="sm" onClick={onDeleteClick}>Delete</Button></td>
    </tr>
  );
};

function IssueTable(props) {
  const issueRows = props.issues.map(issue =>
    <IssueRow key={issue._id} issue={issue} deleteIssue={props.deleteIssue} />);
  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>Id</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Completion Date</th>
          <th>Title</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{issueRows}</tbody>
    </Table>
  );
}

const Header = () => (
  <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Navbar.Brand href="/issuesList">Issue Tracker</Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="m-auto">
      <Nav.Link href="/issuesList">Issues</Nav.Link>
      <Nav.Link href="/reports">Reports</Nav.Link>
    </Nav>
    <Nav className="pull-right right">
      <Nav.Link> <b> + </b>  Create Issue</Nav.Link>
    </Nav>
  </Navbar.Collapse>
</Navbar>
);

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
    this.deleteIssue = this.deleteIssue.bind(this);
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

  deleteIssue(id) {
    fetch(`http://localhost:4003/api/issues/${id}`, { method: 'DELETE' }).then(response => {
      if (!response.ok) alert('Failed to delete issue');
      else this.loadData();
    });
  }

  setFilter(query) {
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
      <div>
        <Header />
        <br/>
        <div className="container-fluid">
          <div className="content">
              <IssueFilter setFilter={this.setFilter} initFilter={this.props.location.search} />
              <br />
              <br />
            <IssueTable issues={this.state.issues} deleteIssue={this.deleteIssue} />
            <hr /><br />
            <IssueAdd createIssue={this.createIssue} />
          </div>
          <div className="footer">FOOTIE</div>
        </div>
      </div>
    );
  }
}

export default App;
