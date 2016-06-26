import React from 'react'

export default function Avatar({src, size, rounded, style, ...otherProps}) {
  otherProps = {
    ...otherProps,
    style: {
      ...style,
      width: size,
      height: size,
      borderRadius: rounded === true
        ? size
        : typeof rounded === 'number'
          ? rounded
          : null
    }
  }
  return <div {...otherProps}>
    <img src={src} />
  </div>
}
