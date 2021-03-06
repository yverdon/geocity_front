import styles from '@/components/map/helpers/styles.json'

export function pointer(typeStyle, hover = false) {
  const style = hover ? 'hoverStyle' : 'genericStyle'
  return {
    strokeColor: typeStyle.color,
    strokeWidth: styles[style].strokeWidth,
    imageColor: typeStyle.color,
    imageFillColor: typeStyle.color,
    imageRadius: styles[style].imageRadius,
    imageOpacity: styles[style].imageOpacity,
  }
}

export function fill(typeStyle, hover = false) {
  const style = hover ? 'hoverStyle' : 'genericStyle'
  const color = [...typeStyle.color]
  color[3] = styles[style].colorFill
  return color
}

export function mapMarker(typeStyle, hover = false) {
  const style = hover ? 'hoverStyle' : 'genericStyle'
  let pathname = '/mapmarkers'
  if (process.env.NODE_ENV === 'production') {
    pathname = `${process.env.PRODUCTION_PATH}/mapmarkers`
  }
  return {
    imageScale: styles[style].imageScale,
    imageSrc: `${pathname}/${typeStyle.name}.svg`,
  }
}
