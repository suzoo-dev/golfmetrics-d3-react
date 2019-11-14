import * as d3 from 'd3'

const MARGIN = { TOP: 10, BOTTOM: 80, LEFT: 50, RIGHT: 60 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM;

class BarChart {
	constructor(element, data) {
		let vis = this

		vis.g = d3.select(element)
			.append("svg")
				.attr("viewBox", `0 0 ${WIDTH + MARGIN.LEFT + MARGIN.RIGHT} ${HEIGHT + MARGIN.TOP + MARGIN.BOTTOM}`)
			.append("g")
				.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

		vis.xLabel = vis.g.append("text")
			.attr("x", WIDTH / 2)
			.attr("y", HEIGHT + 40)
			.attr("text-anchor", "middle")
			.attr("font-size", "14px")
			.text("Shot Category")

		vis.yLabel = vis.g.append("text")
			.attr("x", - (HEIGHT / 2))
			.attr("y", -40)
			.attr("text-anchor", "middle")
			.attr("font-size", "14px")

		vis.y2Label = vis.g.append("text")
			.attr("x", - (HEIGHT / 2))
			.attr("y", (WIDTH + 60))
			.attr("text-anchor", "middle")
			.attr("font-size", "14px")

		vis.xAxisGroup = vis.g.append("g")
			.attr("transform", `translate(0, ${HEIGHT})`)

		vis.yAxisGroup = vis.g.append("g")

		vis.y2AxisGroup = vis.g.append("g")
			.attr("transform", `translate(${WIDTH}, 0)`)

		vis.update(data)
	}

	update(data) {
		let vis = this
		vis.data = data

		vis.yLabel.text(vis.data[0].measureOneLabel)
			.attr("transform", "rotate(-90)")
		
		vis.y2Label.text(vis.data[0].measureTwoLabel)
			.attr("transform", "rotate(-90)")

		vis.y0 = Math.max(Math.abs(d3.min(vis.data, d => d.measureOneValue)), Math.abs(d3.max(vis.data, d => d.measureOneValue))) * 1.025

		vis.y20 = Math.max(Math.abs(d3.min(vis.data, d => d.measureTwoValue)), Math.abs(d3.max(vis.data, d => d.measureTwoValue))) * 1.025

		vis.y = d3.scaleLinear()
      .domain([-vis.y0, vis.y0])
			.range([HEIGHT, 0])
				
		vis.y2 = d3.scaleLinear()
			.domain([-vis.y20, vis.y20])
			.range([HEIGHT, 0])
      
		vis.x = d3.scaleBand()
			.domain(vis.data.map(d => d.title))
			.range([0,WIDTH])
			.padding(0.4)

		const xAxisCall = d3.axisBottom(vis.x)
		vis.xAxisGroup.transition().duration(500).call(xAxisCall)

		const yAxisCall = d3.axisLeft(vis.y)
		vis.yAxisGroup.transition().duration(500).call(yAxisCall)

		const y2AxisCall = d3.axisRight(vis.y2)
		vis.y2AxisGroup.transition().duration(500).call(y2AxisCall)

		// DATA JOIN
		const rects = vis.g.selectAll("rect")
			.data(vis.data)

		// EXIT
		rects.exit()
			.transition().duration(500)
				.attr("height", 0)
				.attr("y", HEIGHT)
				.remove()

		// UPDATE
		rects.transition().duration(500)
			.attr("x", d => vis.x(d.title))
			.attr("y", d => vis.y(Math.max(0, d.measureOneValue)))
			.attr("width", vis.x.bandwidth)
			.attr("height", d => Math.abs(vis.y(d.measureOneValue) - vis.y(0)))
			.attr("fill", d => (d.measureOneValue < 0) ? "red" : "green")

		// ENTER
		rects.enter().append("rect")
			.attr("x", d => vis.x(d.title))
			.attr("width", vis.x.bandwidth)
			.attr("y", HEIGHT)
			.attr("fill", d => (d.measureOneValue < 0) ? "red" : "green")
			.transition().duration(500)
				.attr("y", d => vis.y(Math.max(0, d.measureOneValue)))
				.attr("height", d => Math.abs(vis.y(d.measureOneValue) - vis.y(0)))

		// DATA JOIN
		const circles = vis.g.selectAll("circle")
			.data(vis.data)

		// EXIT
		circles.exit()
			.transition().duration(500)
				.attr("cy", d => vis.y2(0))
				.remove()

		// UPDATE
		circles.transition().duration(500)
			.attr("cx", d => vis.x(d.title) + (vis.x.bandwidth() / 2))
			.attr("cy", d => vis.y2(d.measureTwoValue))
			.attr("fill", d => (d.measureTwoValue < 0) ? "darkred" : "darkgreen")

		// ENTER
		circles.enter().append("circle")
			.attr("cy", vis.y2(0))
			.attr("cx", d => vis.x(d.title) + (vis.x.bandwidth() / 2))
			.attr("r", 5)
			.attr("fill", d => (d.measureOneValue < 0) ? "darkred" : "darkgreen")
			.transition(1000)
				.attr("cy", d => vis.y2(d.measureTwoValue))
		
	}
}

export default BarChart