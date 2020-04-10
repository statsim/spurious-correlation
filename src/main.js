var corr = require('node-correlation')
var Dygraph = require('dygraphs')
var LinReg = require('ml-regression-simple-linear')
var rand = require('random')

class Spurious {
  constructor () {
    var outputs = document.getElementById('outputs')
    this.h = document.createElement('h5')
    this.divTrace = document.createElement('div')
    this.divTrace.style.height = '250px'
    this.divTrace.style.width = '100%'
    this.divTrace.style.maxWidth = '600px'

    this.divPlot = document.createElement('div')
    this.divPlot.style.height = '600px'
    this.divPlot.style.width = '100%'
    this.divPlot.style.maxWidth = '600px'

    this.norm = rand.normal(0, 1)
    outputs.appendChild(this.h)
    outputs.appendChild(this.divTrace)
    outputs.appendChild(this.divPlot)
  }
  run (params) {
    var n = params.n || 1000
    console.log(rand.normal(0, 1))
    var data = [[0, Math.random() * 100, Math.random() * 100]]
    for (var i = 1; i <= n; i++) {
      data.push([i, data[i - 1][1] + this.norm(), data[i - 1][2] + this.norm(0, 1)])
    }
    var lr = new LinReg(data.map(a => a[1]), data.map(a => a[2]))
    var graphTrace = new Dygraph(
      this.divTrace,
      data,
      {
        'labels': ['i', 'x', 'y'],
        'series': {
          'x': {
            'strokeWidth': 1.5,
            'color': '#2CB5E8'
          },
          'y': {
            'strokeWidth': 1.5,
            'color': '#30BA6F'
          }
        }
      }
    )
    var plotData = data.map(arr => [arr[1], arr[2], lr.predict(arr[1])]).sort((a, b) => a[0] > b[0])
    console.log('Plot data:', plotData)
    var graphPlot = new Dygraph(
      this.divPlot,
      plotData,
      {
        'drawPoints': true,
        'labels': ['x', 'y', 'yp'],
        'series': {
          'y': {
            'strokeWidth': 0.0,
            'drawPoints': true,
            'pointSize': 2,
            'highlightCircleSize': 6,
            'color': '#AAA'
          },
          'yp': {
            'strokeWidth': 2,
            'drawPoints': false,
            'color': '#FF0043'
          }
        }
      }
    )
    this.h.innerText = 'Corr: ' + corr.calc(plotData.map(a => a[0]), plotData.map(a => a[1])).toFixed(3)
    console.log(data)
  }
}

module.exports = Spurious
