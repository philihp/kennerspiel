type DotParam = {
  color: string
  response?: string
  border?: string
}

const Dot = ({ color, response, border }: DotParam) => (
  <>
    <svg height="10" width="16">
      <circle cx="8" cy="5" r="5" fill={border} />
      <circle cx="8" cy="5" r="4" fill={color} />
    </svg>
    {response ?? ''}
  </>
)

export default Dot
