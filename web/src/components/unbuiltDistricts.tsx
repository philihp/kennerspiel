interface Props {
  districts: number[]
}

export const UnbuiltDistricts = ({ districts }: Props) => (
  <div style={{ margin: 10 }}>
    Districts:
    {districts.map((district, i) => (
      <span style={{ padding: 3, margin: 3, border: '1px solid #DDD' }} key={i}>
        {district}
      </span>
    ))}
  </div>
)
