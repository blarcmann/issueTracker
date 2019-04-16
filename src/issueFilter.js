import React from 'react';
import { Col, Row, ButtonToolbar, Button, Form } from 'react-bootstrap';

class IssueFilter extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      status: props.initFilter.status || '',
      effort_gte: props.initFilter.effort_gte || '',
      effort_lte: props.initFilter.effort_lte || '',
      changed: false
    }

    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeEffortGte = this.onChangeEffortGte.bind(this);
    this.onChangeEffortLte = this.onChangeEffortLte.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      status: newProps.initFilter.status || '',
      effort_gte: newProps.initFilter.effort_gte || '',
      effort_lte: newProps.initFilter.effort_lte || '',
      changed: false,
    });
  }

  resetFilter() {
    this.setState({
      status: this.props.initFilter.status || '',
      effort_gte: this.props.initFilter.effort_gte || '',
      effort_lte: this.props.initFilter.effort_lte || '',
      changed: false,
    });
  }


  clearFilter(e) {
    e.preventDefault();
    this.props.setFilter({});
  }

  onChangeStatus(e) {
    this.setState({ status: e.target.value, changed: true });
  }

  onChangeEffortGte(e) {
    const effortString = e.target.value;
    if (effortString.match(/^\d*$/)) {
      this.setState({ effort_gte: e.target.value, changed: true });
    }
  }

  onChangeEffortLte(e) {
    const effortString = e.target.value;
    if (effortString.match(/^\d*$/)) {
      this.setState({ effort_lte: e.target.value, changed: true });
    }
  }

  applyFilter() {
    const newFilter = {};
    if (this.state.status) {
      newFilter.status = this.state.status;
    }
    if (this.state.effort_gte) {
      newFilter.effort_gte = this.state.effort_gte;
    }
    if (this.state.effort_lte) {
      newFilter.effort_lte = this.state.effort_lte;
    }
    this.props.setFilter(newFilter);
  }

  // clearFilter() {
  //   this.props.setFilter({});
  // }

  render() {
    return (
      <Row>
        <Col xs={12} sm={6} md={4}>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Control size="sm" as="select" value={this.state.status} onChange={this.onChangeStatus}>
              <option value="">(Any)</option>
              <option value="New">New</option>
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="Fixed">Fixed</option>
              <option value="Verified">Verified</option>
              <option value="Closed">Closed</option>
            </Form.Control>
          </Form.Group>
        </Col>

        <Col xs={12} sm={6} md={4}>
          <Form.Group>
           <Form.Label>Effort</Form.Label>
            <Row>
              <Col>
                <Form.Control size="sm" value={this.state.effort_gte} onChange={this.onChangeEffortGte} placeholder="MIN"/>
              </Col>
              <Col>
                <Form.Control size="sm" value={this.state.effort_lte} onChange={this.onChangeEffortLte} placeholder="MAX" />
              </Col>
            </Row>
          </Form.Group>
        </Col>

        <Col xs={12} sm={6} md={4}>
          <Form.Group>
          <Form.Label>&nbsp;</Form.Label>
            <ButtonToolbar>
              <Button size="sm" variant="warning" onClick={this.applyFilter}>Apply</Button>&nbsp;
              <Button size="sm" variant="primary" onClick={this.resetFilter} disabled={!this.state.changed}>Reset</Button>&nbsp;
              <Button size="sm" onClick={this.clearFilter} variant="success">Clear</Button>&nbsp;
            </ButtonToolbar>
          </Form.Group>
        </Col>
      </Row >
    );
  }
}



export default IssueFilter;