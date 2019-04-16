import React from 'react';
import NumInput from './numInput';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
// import Form from 'react-bootstrap/Form'
import DateInput from './dateInput';
// import { Link } from 'react-router-dom';

class IssueEdit extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            issue: {
                _id: '', title: '', status: '', owner: '', effort: null,
                completionDate: null, created: null,
            },
            invalidFields: {},
            showingValidation: false,
        };
        this.dismissValidation = this.dismissValidation.bind(this);
        this.showValidation = this.showValidation.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onValidityChange = this.onValidityChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.loadData();
        }
    }

    onSubmit(event) {
        event.preventDefault();
        this.showValidation();
        if (Object.keys(this.state.invalidFields).length !== 0) {
            return;
        }
        fetch(`http://localhost:4003/api/issues/${this.props.match.params.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.issue),
        }).then(response => {
            if (response.ok) {
                response.json().then(updatedIssue => {
                    updatedIssue.created = new Date(updatedIssue.created);
                    if (updatedIssue.completionDate) {
                        updatedIssue.completionDate = new Date(updatedIssue.completionDate);
                    }
                    this.setState({ issue: updatedIssue });
                    alert('Updated issue successfully.');
                });
            } else {
                response.json().then(error => {
                    alert(`Failed to update issue: ${error.message}`);
                });
            }
        }).catch(err => {
            alert(`Error in sending data to server: ${err.message}`);
        });
    }

    showValidation() {
        this.setState({ showingValidation: true });
    }
    dismissValidation() {
        this.setState({ showingValidation: false });
    }

    onValidityChange(event, valid) {
        const invalidFields = Object.assign({}, this.state.invalidFields);
        if (!valid) {
            invalidFields[event.target.name] = true;
        } else {
            delete invalidFields[event.target.name];
        }
        this.setState({ invalidFields });
    }

    onChange(event, convertedValue) {
        const issue = Object.assign({}, this.state.issue);
        const value = (convertedValue !== undefined)
            ? convertedValue
            : event.target.value;
        issue[event.target.name] = value;
        this.setState({ issue });
    }

    loadData() {
        console.log(this.props)
        fetch(`http://localhost:4003/api/issues/${this.props.match.params.id}`).then(response => {
            if (response.ok) {
                response.json().then(issue => {
                    issue.created = new Date(issue.created).toDateString();
                    issue.created = new Date(issue.created);
                    issue.completionDate = issue.completionDate != null
                        ? new Date(issue.completionDate)
                        : null;
                    issue.effort = issue.effort != null ? issue.effort.toString() : '';
                    this.setState({ issue });
                });
            } else {
                response.json().then(error => {
                    alert(`Failed to fetch issue: ${error.message}`);
                });
            }
        }).catch(err => {
            alert(`Error in fetching data from server: ${err.message}`);
        });
    }

    render() {
        const issue = this.state.issue;
        let validationMessage = null;
        if (Object.keys(this.state.invalidFields).length !== 0 && this.state.showingValidation) {
            validationMessage = (
                <Alert dismissible variant="danger">
                    Please correct invalid fields before submitting.
                </Alert>
            );
        }
        return (
            <div>
                <Form onSubmit={this.onSubmit}>
                    <Row>
                        <Col md={3} > <Form.Label>ID: </Form.Label> </Col>
                        <Col md={9} > {issue._id} </Col>
                    </Row>
                    <Row>
                        <Col md={3}><Form.Label>Created: </Form.Label></Col>
                        <Col md={9}>{issue.created ? issue.created.toDateString() : ''}</Col>
                    </Row>
                    <Row>
                        <Col md={3}><Form.Label>Status</Form.Label></Col>
                        <Col md={9}>
                            <Form.Control as="select" name="status" value={issue.status} onChange={this.onChange}>
                                <option value="New">New</option>
                                <option value="Open">Open</option>
                                <option value="Assigned">Assigned</option>
                                <option value="Fixed">Fixed</option>
                                <option value="Verified">Verified</option>
                                <option value="Closed">Closed</option>
                            </Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3}><Form.Label>Owner: </Form.Label></Col>
                        <Col md={9}>
                            <Form.Control name="owner" value={issue.owner} onChange={this.onChange} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3}><Form.Label>Effort: </Form.Label></Col>
                        <Col md={9}>
                            <NumInput size={5} name="effort" value={issue.effort} onChange={this.onChange} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3}><Form.Label>Completion Date: </Form.Label></Col>
                        <Col md={9}>
                            <DateInput name="completionDate" value={issue.completionDate} onChange={this.onChange}
                                onValidityChange={this.onValidityChange} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3}><Form.Label>Title: </Form.Label></Col>
                        <Col md={9}>
                            <Form.Control name="title" size={50} value={issue.title} onChange={this.onChange} />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="m-auto">
                            <Button type="submit" variant="dark">Save</Button>
                            &nbsp;
                        <a href="/issuesList" variant="warning">Back to list</a>
                        </Col>
                    </Row>
                </Form>
                <Row>
                    <Col sm={12} md={8}>{validationMessage}</Col>
                </Row>
            </div>
        );
    }
}

// IssueEdit.propTypes = {
//     params: React.PropTypes.object.isRequired,
// };

export default IssueEdit;


// <form onSubmit={this.onSubmit}>
//                     ID: {issue._id}
//                     <br />
//                     Created: {issue.created ? issue.created.toDateString() : ''}
//                     <br />
//                     Status: <select name="status" value={issue.status} onChange={this.onChange}>
//                         <option value="New">New</option>
//                         <option value="Open">Open</option>
//                         <option value="Assigned">Assigned</option>
//                         <option value="Fixed">Fixed</option>
//                         <option value="Verified">Verified</option>
//                         <option value="Closed">Closed</option>
//                     </select>
//                     <br />
//                     Owner: <input name="owner" value={issue.owner}
//                         onChange={this.onChange} />
//                     <br />
//                     Effort: <NumInput size={5} name="effort" value={issue.effort}
//                         onChange={this.onChange} />
//                     <br />
//                     Completion Date: <DateInput
//                         name="completionDate" value={issue.completionDate}
//                         onChange={this.onChange}
//                         onValidityChange={this.onValidityChange}
//                     />
//                     <br />
//                     Title: <input name="title" size={50} value={issue.title}
//                         onChange={this.onChange} />
//                     <br />
//                     {validationMessage}
//                     <button type="submit">Submit</button>
//                     <Link to="/issuesList">Back to issue list</Link>
//                 </form>