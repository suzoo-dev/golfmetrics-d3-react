import React, { Component } from 'react';
import Chart from './Chart';

export default class ChartWrapper extends Component {
	componentDidMount() {
		this.setState({
			chart: new Chart(this.props.type, this.refs.chart, this.props.data)
		})
	}

	shouldComponentUpdate() {
		return false
	}

	componentWillReceiveProps(nextProps) {
		this.state.chart.update(nextProps.data)
	}

	render() {
		return <div className={`chart-area ${this.props.type}`} ref="chart"></div>
	}
}