import React from 'react'

const LoadMicroApp = () => {
  const ref = React.useRef<HTMLDivElement>(null)

  return <div ref={ref}></div>
}

export default () => {
  return <LoadMicroApp />
}
