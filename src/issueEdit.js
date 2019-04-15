import React from 'react';
import { Link } from 'react-router-dom';

class IssueEdit extends React.Component {
    render() {
        const { params } = this.props.match;
        return (
            <div>
                <p>Placeholder for the edit {params.id}.</p>
                <Link to="/issueslist">Back to issue list</Link>
            </div>
        )
    }
}

// IssueEdit.propTypes = {
//     params: React.PropTypes.object.isRequired,
// };

export default IssueEdit;