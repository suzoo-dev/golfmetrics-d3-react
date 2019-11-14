import * as d3 from 'd3'

const MARGIN = { TOP: 10, BOTTOM: 80, LEFT: 100, RIGHT: 10 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM;

class ScatterChart {
	constructor(element, data) {
		let vis = this

		vis.g = d3.select(element)
			.append("svg")
				.attr("viewBox", `0 0 ${WIDTH + MARGIN.LEFT + MARGIN.RIGHT} ${HEIGHT + MARGIN.TOP + MARGIN.BOTTOM}`)
			.append("g")
				.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

		vis.xAxisGroup = vis.g.append("g")
			.attr("transform", `translate(0, ${HEIGHT})`)
		vis.yAxisGroup = vis.g.append("g")

		vis.xAxisLabel = vis.g.append("text")
			.attr("x", WIDTH / 2)
			.attr("y", HEIGHT + 40)
			.attr("font-size", 20)
			.attr("text-anchor", "middle")
			.attr("font-size", "14px")
			.text("Proximity")
		
		vis.yAxisLabel = vis.g.append("text")
			.attr("x", -(HEIGHT / 2))
			.attr("y", -75)
			.attr("transform", "rotate(-90)")
			.attr("font-size", 20)
			.attr("text-anchor", "middle")
			.attr("font-size", "14px")
			.text("Shot Category")

		vis.update(data)
	}

	update(data) {
		let vis = this
		vis.data = data

		vis.x = d3.scaleLinear()
			.domain([-50, d3.max(vis.data, d => Number(d.proximity))])
			.range([0 , WIDTH])
			
		vis.y = d3.scaleBand()
			.domain(vis.data.map(d => d.shotcategory).reverse())
			.range([HEIGHT, 0])
		
		vis.xColor = d3.scaleLinear()
			.domain([-50, d3.max(vis.data, d => Number(d.proximity))])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#008000"), d3.rgb('#ff0000')]);

		const xAxisCall = d3.axisBottom(vis.x)
		const yAxisCall = d3.axisLeft(vis.y)

		vis.xAxisGroup.transition(500).call(xAxisCall)
		vis.yAxisGroup.transition(500).call(yAxisCall)

		// DATA JOIN
		const circles = vis.g.selectAll("circle")
			.data(vis.data, d => d.shotid)

		// EXIT
		circles.exit()
			.transition(500)
				.attr("cy", vis.y(0))
				.remove()

		// UPDATE
		circles.transition(500)
			.attr("cx", d => vis.x(Number(d.proximity)))
			.attr("cy", d => vis.y(d.shotcategory) + (vis.y.bandwidth() / 2))

		// ENTER
		circles.enter().append("circle")
			.attr("cy", vis.y(0))
			.attr("cx", d => vis.x(Number(d.proximity)))
			.attr("r", 5)
			.attr("fill", d => vis.xColor(d.proximity))
			.attr("opacity", "0.8")
			.transition(500)
				.attr("cy", d => vis.y(d.shotcategory) + (vis.y.bandwidth() / 2))
		
	}
}

export default ScatterChart