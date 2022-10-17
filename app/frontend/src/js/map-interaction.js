import { Select, Draw, Modify, Snap, Pointer } from 'ol/interaction'
import GeoJSON from 'ol/format/GeoJSON'
import { landParcelStyles } from './styles/map-styles'
import { drawStyles } from './styles/map-draw-styles'

const editParcels = []
let draw
let snap
let modify
let select

const addInteraction = (map, source, drawSource, freehand, tracing, type = 'Polygon') => {
  draw = new Draw({
    source: drawSource.getSource(),
    type,
    freehand,
    trace: tracing,
    traceSource: drawSource.getSource(),
    style: drawStyles
  })

  map.addInteraction(draw)

  snap = new Snap({ source: source.getSource(), pixelTolerance: 10 })
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

const opacityInteraction = (source, drawSource) => {
  const opacityParcel = document.getElementById('opacity-parcel')
  const opacityAmendedParcel = document.getElementById('opacity-parcel-amended')

  const updateOpacityParcel = () => {
    const opacity = parseFloat(opacityParcel.value)
    source.setOpacity(opacity)
  }

  const updateOpacityAmendedParcel = () => {
    const opacity = parseFloat(opacityAmendedParcel.value)
    drawSource.setOpacity(opacity)
  }

  opacityParcel.addEventListener('input', updateOpacityParcel)
  opacityAmendedParcel.addEventListener('input', updateOpacityAmendedParcel)
}

const saveAmendedmentInteraction = (sbi, data) => {
  const submitChanges = document.getElementById('submit')

  const onSubmit = () => {
    const request = new XMLHttpRequest()
    request.open('POST', '/map', true)
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
    request.send(JSON.stringify({ sbi, data }))

    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        const res = JSON.parse(request.response)
        console.log(res)
        window.location.replace(`/confirmation?sbi=${sbi}&reference=${res.reference}`)
      }
    }
  }

  submitChanges.addEventListener('click', onSubmit)
}

const selectInteraction = (map, sbi, source, drawSource) => {
  let selectedParcel

  opacityInteraction(source, drawSource)
  saveAmendedmentInteraction(sbi, editParcels)

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

      map.getInteractions().getArray().forEach((interaction) => {
        if (interaction instanceof Pointer) {
          dblClickInteraction = interaction
        }
      })

      map.removeInteraction(dblClickInteraction)

      select = new Select({
        wrapX: false
      })

      select.on('select', (e) => {
        const interactions = map.getInteractions()
        map.removeInteraction(interactions)
        const formatGeoJSON = new GeoJSON()
        const feature = e.target.getFeatures().getArray()[0]
        const featureClone = feature.clone()
        const geojson = formatGeoJSON.writeFeature(featureClone)
        selectedParcel = JSON.parse(geojson).properties
        const extent = feature.getGeometry().getExtent()
        map.getView().fit(extent)
        selectModify.checked = false
        map.removeInteraction(modify)
        map.removeInteraction(select)
      })

      modify = new Modify({ source: drawSource, features: select.getFeatures() })
      map.addInteraction(select)
      map.addInteraction(modify)
    }

    if (selectDraw.checked) {
      addInteraction(map, source, drawSource, selectFreehand.checked, false)

      draw.on('drawend', (e) => {
        const formatGeoJSON = new GeoJSON()
        const feature = e.feature
        map.removeInteraction(draw)
        selectDraw.checked = false
        const featureClone = feature.clone()
        const geojson = JSON.parse(formatGeoJSON.writeFeature(featureClone))
        geojson.properties = selectedParcel
        editParcels.push(geojson)
      })
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
