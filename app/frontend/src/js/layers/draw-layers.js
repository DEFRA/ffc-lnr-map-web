import GeoJSON from 'ol/format/GeoJSON'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import { landParcelStyles } from '../styles/map-styles'

const buildDrawLayers = (amendedParcels) => {
  let drawSource

  if (!Object.keys(amendedParcels).length) {
    drawSource = new VectorSource()
  } else {
    const features = new GeoJSON().readFeatures(amendedParcels)
    drawSource = new VectorSource({ features })
  }

  const drawLayer = new VectorLayer({
    source: drawSource,
    style: landParcelStyles.PolygonNew
  })
  return drawLayer
}

export {
  buildDrawLayers
}
