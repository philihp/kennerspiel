interface Props {
  plots: number[]
}

export const UnbuiltPlots = ({ plots }: Props) => (
  <div style={{ margin: 10 }}>
    Plots:
    {plots.map((plot, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <span style={{ padding: 3, margin: 3, border: '1px solid #DDD' }} key={i}>
        {plot}
      </span>
    ))}
  </div>
)
