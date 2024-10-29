interface Props {
  plots: number[]
}

export const UnbuiltPlots = ({ plots }: Props) => (
  <div style={{ margin: 10 }}>
    Plots:
    {plots.map((plot, i) => (
      <span style={{ padding: 3, margin: 3, border: '1px solid #DDD' }} key={i}>
        {plot}
      </span>
    ))}
  </div>
)
