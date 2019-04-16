import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';


export class IssueAdd extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        let form = document.forms.issueAdd;
        this.props.createIssue({
            owner: form.owner.value,
            title: form.title.value,
            status: 'Open',
            created: new Date(),
        });
        form.owner.value = '';
        form.title.value = '';
    }
    render() {
        return (
            <div>
                <Form name="issueAdd" onSubmit={this.handleSubmit}>
                <Row>
                    <Col>
                     <Form.Control type="text" name="owner" placeholder="Owner" /></Col>
                    <Col>
                    <Form.Control type="text" name="title" placeholder="Title" /></Col>
                    <Col>
                        <Button>Add Issue</Button>
                    </Col>
                </Row>
                </Form>
            </div>
        )
    }
}

export default IssueAdd;