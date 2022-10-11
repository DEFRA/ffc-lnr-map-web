import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import { landParcelStyles } from '../styles/map-styles'

const getDrawLayers = () => {
  const drawSource = new VectorSource()
  const drawLayer = new VectorLayer({
    source: drawSource,
    style: landParcelStyles.Polygon
  })
  return drawLayer
}

export {
  getDrawLayers
}
