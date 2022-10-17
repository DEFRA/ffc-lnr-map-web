import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import { defaults } from 'ol/interaction'
import { initiateMap } from './map-static'
import { selectInteraction, addInteraction } from './map-interaction'
import { buildRasterLayers, tilegrid } from './layers/raster-layers'
import { selectMapStyle } from './map-type-select'
import { getParcelLayers } from './layers/parcel-layers'
import { getDrawLayers } from './layers/draw-layers'

export function displayInteractiveMap (apiKey, sbi, parcels, amendedParcels, coordinates, selectedParcels = [], allowSelect = false, target = 'map') {
  initiateMap('parcelCoverMap', apiKey, coordinates)

  const rasterLayer = buildRasterLayers(apiKey)
  const { parcelLayer, parcelSource } = getParcelLayers(parcels)

  const drawLayer = getDrawLayers(amendedParcels)

  const view = new View({
    center: coordinates,
    zoom: 7,
    extent: [-238375.0, 0.0, 900000.0, 1376256.0],
    resolutions: tilegrid.getResolutions()
  })

  const map = new Map({ // eslint-disable-line no-unused-vars
    interactions: defaults({
      dragPan: false
    }),
    layers: [...rasterLayer, parcelLayer, drawLayer],
    target,
    view
  })

  // parcelSelection(map, allowSelect, selectedParcels, parcelSource, sbi)
  map.getView().fit(parcelSource.getExtent(), { size: map.getSize(), maxZoom: 16 })
  selectMapStyle(rasterLayer)
  addInteraction(map, parcelLayer, drawLayer)
  selectInteraction(map, sbi, parcelLayer, drawLayer)
}
