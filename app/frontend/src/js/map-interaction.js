import { Select, Draw, Modify, Snap, Pointer } from 'ol/interaction'
import GeoJSON from 'ol/format/GeoJSON'
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
  const showAll = document.getElementById('show-all')

  const onClick = () => {
    select.getFeatures().clear()
    map.getView().fit(source.getSource().getExtent(), { size: map.getSize(), maxZoom: 16 })
  }

  const onChange = () => {
    map.removeInteraction(draw)
    map.removeInteraction(snap)
    map.removeInteraction(modify)
    map.removeInteraction(select)

    if (selectModify.checked) {

      let dblClickInteraction

      map.getInteractions().getArray().forEach(function(interaction) {
        if (interaction instanceof Pointer) {
          dblClickInteraction = interaction
        }
      })

      map.removeInteraction(dblClickInteraction)

      select = new Select({
        wrapX: false
      })

      select.on('select', (e) => {
        const formatGeoJSON = new GeoJSON()
        const feature = e.target.getFeatures().getArray()[0]
        const featureClone = feature.clone()
        const geojson = formatGeoJSON.writeFeature(featureClone)
        console.log('geojson', geojson)
        const extent = feature.getGeometry().getExtent();
        map.getView().fit(extent)
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
  showAll.addEventListener('click', onClick)

  onChange()
}

export {
  selectInteraction,
  addInteraction
}
