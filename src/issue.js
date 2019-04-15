import React from 'react';

export class IssueFilter extends React.Component {
    render() {
        return (
            <div>
                <h1>Placeholder for Issue Filter</h1>
            </div>
        )
    }
}

export class IssueAdd extends React.Component {
    render() {
        return (
            <div>
                <h1>Placeholder for Issue Add</h1>
            </div>
        )
    }
}

export class IssueRow extends React.Component {
    render() {
        // IssueRow.propTypes = {
        //     issue_id: React.propTypes.number.isRequired,
        //     issue_title: React.propTypes.string
        // }
        // IssueRow.defaultProps = {
        //     issue_title: '--No-Title--',
        //     issue_id: 1
        // }
        const issue = this.props.issue;
        return (
            <tr>
                <td>{issue.id}</td>
                <td>{issue.status}</td>
                <td>{issue.owner}</td>
                <td>{issue.created.toDateString()}</td>
                <td>{issue.effort}</td>
                <td>{issue.completionDate ? issue.completionDate.toDateString() : 'Not Specified'}</td>
                <td>{issue.title}</td>
            </tr>
        )
    }
}



export class IssueTable extends React.Component {
    render() {
        const issueRows = this.props.issues.map((issue) => {
            return (
                <IssueRow key={issue.id} issue={issue} />
            )
        });
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
        )
    }
}

const issues = [
    {
        id: 1,
        status: 'Open',
        owner: 'Ravan',
        created: new Date('2016-08-15'),
        effort: 5,
        completionDate: undefined,
        title: 'Error in console when clicking Add',
    },
    {
        id: 2,
        status: 'Assigned',
        owner: 'Eddie',
        created: new Date('2016-08-16'),
        effort: 14,
        completionDate: new Date('2016-08-30'),
        title: 'Missing bottom border on panel',
    },
];

export class IssueList extends React.Component {
    constructor() {
        super();
        this.state = {
            issues: issues
        }
        setTimeout(this.createTestIssue.bind(this), 2000)
    }
    createIssue(newIssue) {
     const newIssues = this.state.issues.slice();
     newIssue.id = this.state.issues.length + 1;
     newIssues.push(newIssue);
     this.setState({issues: newIssues})
    }
    createTestIssue() {
        this.createIssue({
            status: 'New', 
            owner: 'Pieta', 
            created: new Date(),
            title: 'Completion date should be optional',
        })
    }
    render() {
        return (
            <div className="App">
                <h4>ISSUE TRACKER</h4>
                <IssueFilter />
                <hr /><br />
                <IssueTable issues={issues} />
                <hr /><br />
                <IssueAdd />
            </div>
        );
    }
}