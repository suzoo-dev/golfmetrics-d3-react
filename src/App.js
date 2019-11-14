import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { csv, nest, sum, mean } from 'd3';

import ChartWrapper from './ChartWrapper';
import Tile from './Tile';
import Filter from './Filter';

class App extends Component {
  state = {
    data: [],
    filteredData: []
  }

  componentWillMount() {
    csv("./golfmetrics.csv")
      .then(data => this.setState({ data: data, filteredData: data }))
      .catch(err => console.log(err))
  }

  getScatterData = () => this.state.filteredData.filter(d => !isNaN(d.proximity))

  getTileData = () => {
    return nest()
      .key(d => d.shotcategory)
      .rollup(d => {
        return {
          total: sum(d, g => g.scrsg),
          avg: mean(d, g => g.scrsg)
        }
      })
      .entries(this.state.filteredData)
      .map(group => {
        return {
          title: group.key,
          measureOneLabel: "Total SG",
          measureOneValue: group.value.total,
          measureTwoLabel: "Per Shot",
          measureTwoValue: group.value.avg,
        }
      })
  }

  addFilter = (field, value) => {
    this.setState({
      filteredData: this.state.data.filter(d => d[field] === value)
    })
  }

  clearFilter = () => {
    this.setState({filteredData: this.state.data})
  }

  getFieldList = (field) => this.state.data.map(d => d[field]).filter((v, i, a) => a.indexOf(v) === i)

  render() {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh"
    }}>
        <Navbar bg="light" variant="light">
          <Navbar.Brand>
            <img
              alt=""
              src="./golf-ball.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            Golfmetrics
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Graham Fletcher Dashboard
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
        <Container fluid="true" style={{
          height: "100%",
          display: "flex"
      }}>
          <Row style={{width: "100%"}}>
            <Col 
              xs="auto"
              style={{
                backgroundColor: "#353535",
                color: "white"
              }}
            >
              <div className="mt-2 mb-3">Filters</div>
              <ButtonGroup vertical>
                <Filter 
                  data={this.getFieldList("course")} 
                  title="course" 
                  id="bg-vertical-dropdown-1"
                  addFilter={this.addFilter}
                  clearFilter={this.clearFilter}
                />
                <Filter 
                  data={this.getFieldList("date")} 
                  title="date" 
                  id="bg-vertical-dropdown-2"
                  addFilter={this.addFilter}
                  clearFilter={this.clearFilter}
                />
              </ButtonGroup>
            </Col>
            <Col>
              <Container fluid="true" >
                <Tile data={this.getTileData()}/>
              </Container>
              <Container fluid="true">
                <Row>
                  <Col md={6} xs={12} style={{border: "14px solid lightgray"}}>
                    {this.state.filteredData.length > 0 ? <ChartWrapper type="BarChart" data={this.getTileData()}/> : "No Data"}
                  </Col>
                  <Col md={6} xs={12} style={{border: "14px solid lightgray"}}>
                    {this.state.filteredData.length > 0 ? <ChartWrapper type="ScatterChart" data={this.getScatterData()}/> : "No Data"}
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
