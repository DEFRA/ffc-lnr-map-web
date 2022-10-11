import { Stroke, Icon, Style } from 'ol/style'
import { MultiPoint, LineString } from 'ol/geom'

const drawStyles = (feature) => {
  const styles = []

  const image = {
    small: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"%3E%3Ccircle cx="16" cy="16" r="4" style="fill:%230b0c0c"/%3E%3C/svg%3E',
    large: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"%3E%3Ccircle cx="16" cy="16" r="7" style="fill:white;fill-opacity:0.01;stroke:black;stroke-width:2px;"/%3E%3C/svg%3E'
  }

  if (feature.getGeometry().getType() === 'Polygon') {
    const coordinates = feature.getGeometry().getCoordinates()[0]
    if (coordinates.length > 2) {
      styles.push(new Style({
        geometry: new LineString(coordinates.slice(coordinates.length - 3, coordinates.length - 1)),
        stroke: new Stroke({ color: '#b1b4b6', width: 3 }),
        zIndex: 1
      }))

      styles.push(new Style({
        geometry: new LineString(coordinates.slice(0, coordinates.length - 2)),
        stroke: new Stroke({ color: '#0b0c0c', width: 3 }),
        zIndex: 1
      }))
    }
  }
  // Points
  styles.push(new Style({
    geometry: (feature) => {
      if (feature.getGeometry().getType() === 'Polygon') {
        const coordinates = feature.getGeometry().getCoordinates()[0]
        if (coordinates.length > 2) {
          coordinates.splice(coordinates.length - 2, 2)
        }
        return new MultiPoint(coordinates)
      } else if (feature.getGeometry().getType() === 'Point') {
        return feature.getGeometry()
      }
    },
    image: new Icon({
      opacity: 1,
      size: [32, 32],
      scale: 1,
      src: feature.getGeometry().getType() === 'Point' ? image.large : image.small
    }),
    zIndex: 3
  }))
  return styles
}

export {
  drawStyles
}
