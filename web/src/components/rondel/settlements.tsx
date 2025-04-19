import { match, P } from 'ts-pattern'
import { housePath, houseTextY, INCOME_RADIUS, rot } from './constants'
import { useInstanceContext } from '@/context/InstanceContext'

const RondelSettlementsFourLong = () => (
  <>
    <g id="settlement-a" transform={`rotate(${rot.H})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        A
      </text>
    </g>
    <g id="settlement-b" transform={`rotate(${rot.K})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        B
      </text>
    </g>
    <g id="settlement-c" transform={`rotate(${rot.D})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        C
      </text>
    </g>
    <g id="settlement-d" transform={`rotate(${rot.G})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        D
      </text>
    </g>
    <g id="settlement-e" transform={`rotate(${rot.M})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        E
      </text>
    </g>
  </>
)

const RondelSettlementsThreeLong = () => (
  <>
    <g id="settlement-a" transform={`rotate(${rot.G})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        A
      </text>
    </g>
    <g id="settlement-b" transform={`rotate(${rot.L})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        B
      </text>
    </g>
    <g id="settlement-c" transform={`rotate(${rot.C})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        C
      </text>
    </g>
    <g id="settlement-d" transform={`rotate(${rot.H})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        D
      </text>
    </g>
    <g id="settlement-e" transform={`rotate(${rot.M})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        E
      </text>
    </g>
  </>
)

const BASE_S3 = 'https://hathora-et-labora.s3-us-west-2.amazonaws.com'

const RondelSettlementsThreeFourShort = () => (
  <>
    <g id="income-a" transform={`rotate(${rot.B})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Sh.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Gn.jpg`} />
    </g>
    <g id="income-b" transform={`rotate(${rot.C})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Cl.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Gn.jpg`} />
    </g>
    <g id="income-c" transform={`rotate(${rot.D})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Wo.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Gn.jpg`} />
    </g>
    <g id="settlement-a" transform={`rotate(${rot.D})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        A
      </text>
    </g>
    <g id="income-d" transform={`rotate(${rot.E})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Sn.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Gn.jpg`} />
    </g>
    <g id="income-e" transform={`rotate(${rot.F})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Sn.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Pt.jpg`} />
    </g>
    <g id="settlement-b" transform={`rotate(${rot.F})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        B
      </text>
    </g>
    <g id="income-f" transform={`rotate(${rot.G})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Sn.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Cl.jpg`} />
    </g>
    <g id="income-g" transform={`rotate(${rot.H})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Sn.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Wo.jpg`} />
    </g>
    <g id="settlement-c" transform={`rotate(${rot.H})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        C
      </text>
    </g>
    <g id="income-h" transform={`rotate(${rot.I})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Sn.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Ni.jpg`} />
    </g>
    <g id="income-i" transform={`rotate(${rot.J})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Sn.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Mt.jpg`} />
    </g>
    <g id="settlement-d" transform={`rotate(${rot.J})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        D
      </text>
    </g>
    <g id="income-j" transform={`rotate(${rot.K})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Bo.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Gn.jpg`} />
    </g>
    <g id="income-k" transform={`rotate(${rot.L})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Ce.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Cl.jpg`} />
    </g>
    <g id="income-l" transform={`rotate(${rot.M})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Or.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Wo.jpg`} />
    </g>
    <g id="settlement-e" transform={`rotate(${rot.A})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        E
      </text>
    </g>
  </>
)

const RondelSettlementsSolitare = () => (
  <>
    <g id="settlement-a" transform={`rotate(${rot.M})`}>
      <path d={`${housePath}`} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        A
      </text>
    </g>
    <g id="settlement-b" transform={`rotate(${rot.D})`}>
      <path d={`${housePath}`} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        B
      </text>
    </g>
    <g id="settlement-c" transform={`rotate(${rot.J})`}>
      <path d={`${housePath}`} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        C
      </text>
    </g>
    <g id="settlement-d" transform={`rotate(${rot.A})`}>
      <path d={`${housePath}`} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        D
      </text>
    </g>
    <g id="settlement-e" transform={`rotate(${rot.G})`}>
      <path d={`${housePath}`} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        E
      </text>
    </g>
  </>
)

const RondelSettlementsDuel = () => (
  <>
    {/* <%-- this is the same for both short and long --%> */}
    <g id="settlement-a" transform={`rotate(${rot.H})`}>
      <path d={`${housePath}`} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={`${houseTextY}`} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        A
      </text>
    </g>
    <g id="settlement-b" transform={`rotate(${rot.B})`}>
      <path d={`${housePath}`} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={`${houseTextY}`} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        B
      </text>
    </g>
    <g id="settlement-c" transform={`rotate(${rot.I})`}>
      <path d={`${housePath}`} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={`${houseTextY}`} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        C
      </text>
    </g>
    <g id="settlement-d" transform={`rotate(${rot.C})`}>
      <path d={`${housePath}`} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={`${houseTextY}`} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        D
      </text>
    </g>
  </>
)

export const RondelSettlements = () => {
  const { state } = useInstanceContext()
  return match(state?.config)
    .with({ players: 4, length: 'long' }, () => <RondelSettlementsFourLong />)
    .with({ players: 3, length: 'long' }, () => <RondelSettlementsThreeLong />)
    .with({ players: 4, length: 'short' }, () => <RondelSettlementsThreeFourShort />)
    .with({ players: 3, length: 'short' }, () => <RondelSettlementsThreeFourShort />)
    .with({ players: 2 }, () => <RondelSettlementsDuel />)
    .with({ players: 1 }, () => <RondelSettlementsSolitare />)
    .with(undefined, () => <></>)
    .exhaustive()
}
