import React, { Component } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

export default class Filter extends Component {
  state = {
    selectedValue: ""
  }

  handleFilterSelect = (field, value) => {
    if (this.state.selectedValue !== value) {
      this.setState({selectedValue: value})
      this.props.addFilter(field, value)
    } else {
      this.setState({selectedValue: ""})
      this.props.clearFilter()
    }
  }

  renderDropdownItems = () => {
    return (
      this.props.data.map(d => {
        return (
          <Dropdown.Item 
            key={d}
            active={this.state.selectedValue === d}
            onClick={() => this.handleFilterSelect(this.props.title, d)}
          >
            {d}
          </Dropdown.Item>
        )
      })
    )
  }
  render() {
    return (
      <DropdownButton 
        className="mt-1 mb-1"
        variant="light"
        title={this.state.selectedValue === "" ? this.props.title : this.state.selectedValue} 
        id={this.props.id}
      >
        {this.renderDropdownItems()}
      </DropdownButton>
    )
  }
}