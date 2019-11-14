import BarChart from './BarChart';
import ScatterChart from './ScatterChart';

const charts = {
	BarChart,
	ScatterChart
}

class Chart {
    constructor (chartType, ref, data) {
        return new charts[chartType](ref, data);
    }
}

export default Chart;