
type DotParam = {
  color: string,
  response?: string
}

const Dot = ({ color, response }: DotParam) => <>
  <svg height="10" width="20">
    <circle cx="10" cy="5" r="5" fill={color} />
  </svg>
  {response ?? ''}
</>

export default Dot