import React, { Component } from 'react';
import CardDeck from 'react-bootstrap/CardDeck';
import Card from 'react-bootstrap/Card';

export default class Tile extends Component {
  renderTiles() {
    return (
      this.props.data.map(tile => {
        return (
          <Card className="text-center" key={tile.title}>
            <Card.Body>
              <Card.Title>{tile.title}</Card.Title>
              <Card.Text>
                <span>{ tile.measureOneLabel + ': ' + tile.measureOneValue.toFixed(2) }</span>
                <br/>
                <span>{ tile.measureTwoLabel + ': ' + tile.measureTwoValue.toFixed(2) }</span>
              </Card.Text>
            </Card.Body>
          </Card>
        )
      })
    )
  }

  render() {
    return (
      <CardDeck className="pt-3 pb-3 mt-3 mb-3" style={{backgroundColor: "lightgray"}}>
        {this.renderTiles()}
      </CardDeck>
    )
  }
}