import { Draw, Modify, Snap } from 'ol/interaction'
import { landParcelStyles } from './styles/map-styles'
import { drawStyles } from './styles/map-draw-styles'

let draw
let snap

const addInteraction = (map, source, drawSource, freehand, tracing, type = 'Polygon') => {
  const modify = new Modify({ source: source.getSource() })
  map.addInteraction(modify)

  draw = new Draw({
    source: source.getSource(),
    type,
    freehand,
    trace: tracing,
    traceSource: drawSource.getSource(),
    style: drawStyles
  })

  map.addInteraction(draw)

  snap = new Snap({ source: source.getSource() })
  map.addInteraction(snap)

  draw.on('drawstart', (e) => {
    e.feature.setStyle(landParcelStyles.PolygonNew)
  })
}

const selectInteraction = (map, source, drawSource) => {
  // const selectDraw = document.getElementById('draw-select')
  const selectFreehand = document.getElementById('draw-freehand')
  // const selectTracing = document.getElementById('draw-tracing')

  const onChange = () => {
    map.removeInteraction(draw)
    map.removeInteraction(snap)
    addInteraction(map, source, drawSource, selectFreehand.checked, false)
  }

  // selectDraw.addEventListener('change', onChange)
  selectFreehand.addEventListener('change', onChange)
  // selectTracing.addEventListener('change', onChange)

  onChange()
}

export {
  selectInteraction,
  addInteraction
}
