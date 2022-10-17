import { mapStyles } from './layers/map-style-layers'

const selectMapStyle = (layers) => {
  const select = document.getElementById('layer-select')

  const onChange = () => {
    const style = select.value
    const totalLayers = layers.length - 1

    for (let i = 0; i < totalLayers; ++i) {
      layers[i].setVisible(mapStyles[i] === style)
    }
  }

  select.addEventListener('change', onChange)

  onChange()
}

export {
  selectMapStyle
}
