import { Select, Draw, Modify, Snap } from 'ol/interaction'
import { landParcelStyles } from './styles/map-styles'
import { drawStyles } from './styles/map-draw-styles'

let draw
let snap
let modify
let select

const addInteraction = (map, source, drawSource, freehand, tracing, type = 'Polygon') => {
  // const modify = new Modify({ source: drawSource.getSource() })
  // map.addInteraction(modify)

  draw = new Draw({
    source: drawSource.getSource(),
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

  draw.on('drawend', (e) => {
    document.getElementById('draw').checked = false
    map.removeInteraction(draw)
    map.removeInteraction(snap)
  })
}

const selectInteraction = (map, source, drawSource) => {
  const selectModify = document.getElementById('select-modify')
  const selectDraw = document.getElementById('draw')
  const selectFreehand = document.getElementById('draw-freehand')
  // const selectTracing = document.getElementById('draw-tracing')

  const onChange = () => {
    map.removeInteraction(draw)
    map.removeInteraction(snap)
    map.removeInteraction(modify)
    map.removeInteraction(select)

    if (selectModify.checked) {

      select = new Select({
        wrapX: false
      })

      select.on('select', (e) => {
        console.log(e)
      })

      console.log('select', select)

      modify = new Modify({ source: drawSource, features: select.getFeatures() })
      map.addInteraction(select)
      map.addInteraction(modify)
    }

    if(selectDraw.checked) {
      addInteraction(map, source, drawSource, selectFreehand.checked, false)
    }
  }

  selectModify.addEventListener('change', onChange)
  selectDraw.addEventListener('change', onChange)
  selectFreehand.addEventListener('change', onChange)
  // selectTracing.addEventListener('change', onChange)

  onChange()
}

export {
  selectInteraction,
  addInteraction
}
