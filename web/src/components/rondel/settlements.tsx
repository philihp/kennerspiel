import { match, P } from 'ts-pattern'
import {
  housePath,
  houseTextY,
  INCOME_RADIUS,
  rotA,
  rotB,
  rotC,
  rotD,
  rotE,
  rotF,
  rotG,
  rotH,
  rotI,
  rotJ,
  rotK,
  rotL,
  rotM,
} from './constants'
import { useInstanceContext } from '@/context/InstanceContext'

const RondelSettlementsFourLong = () => (
  <>
    <g id="settlement-a" transform={`rotate(${rotG})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        A
      </text>
    </g>
    <g id="settlement-b" transform={`rotate(${rotJ})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        B
      </text>
    </g>
    <g id="settlement-c" transform={`rotate(${rotC})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        C
      </text>
    </g>
    <g id="settlement-d" transform={`rotate(${rotF})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        D
      </text>
    </g>
    <g id="settlement-e" transform={`rotate(${rotL})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        E
      </text>
    </g>
  </>
)

const RondelSettlementsThreeLong = () => (
  <>
    <g id="settlement-a" transform={`rotate(${rotF})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        A
      </text>
    </g>
    <g id="settlement-b" transform={`rotate(${rotK})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        B
      </text>
    </g>
    <g id="settlement-c" transform={`rotate(${rotB})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        C
      </text>
    </g>
    <g id="settlement-d" transform={`rotate(${rotG})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        D
      </text>
    </g>
    <g id="settlement-e" transform={`rotate(${rotL})`}>
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
    <g id="income-a" transform={`rotate(${rotA})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Sh.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Gn.jpg`} />
    </g>
    <g id="income-b" transform={`rotate(${rotB})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Cl.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Gn.jpg`} />
    </g>
    <g id="income-c" transform={`rotate(${rotC})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Wo.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Gn.jpg`} />
    </g>
    <g id="settlement-a" transform={`rotate(${rotC})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        A
      </text>
    </g>
    <g id="income-d" transform={`rotate(${rotD})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Sn.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Gn.jpg`} />
    </g>
    <g id="income-e" transform={`rotate(${rotE})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Sn.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Pt.jpg`} />
    </g>
    <g id="settlement-b" transform={`rotate(${rotE})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        B
      </text>
    </g>
    <g id="income-f" transform={`rotate(${rotF})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Sn.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Cl.jpg`} />
    </g>
    <g id="income-g" transform={`rotate(${rotG})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Sn.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Wo.jpg`} />
    </g>
    <g id="settlement-c" transform={`rotate(${rotG})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px;', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        C
      </text>
    </g>
    <g id="income-h" transform={`rotate(${rotH})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Sn.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Ni.jpg`} />
    </g>
    <g id="income-i" transform={`rotate(${rotI})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Sn.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Mt.jpg`} />
    </g>
    <g id="settlement-d" transform={`rotate(${rotI})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        D
      </text>
    </g>
    <g id="income-j" transform={`rotate(${rotJ})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Bo.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Gn.jpg`} />
    </g>
    <g id="income-k" transform={`rotate(${rotK})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Ce.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Cl.jpg`} />
    </g>
    <g id="income-l" transform={`rotate(${rotL})`}>
      <image height="24" width="24" x="-25" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Or.jpg`} />
      <image height="24" width="24" x="0" y={-INCOME_RADIUS} xlinkHref={`${BASE_S3}/Wo.jpg`} />
    </g>
    <g id="settlement-e" transform={`rotate(${rotM})`}>
      <path d={housePath} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        E
      </text>
    </g>
  </>
)

const RondelSettlementsSolitare = () => (
  <>
    <g id="settlement-a" transform={`rotate(${rotL})`}>
      <path d={`${housePath}`} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        A
      </text>
    </g>
    <g id="settlement-b" transform={`rotate(${rotC})`}>
      <path d={`${housePath}`} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        B
      </text>
    </g>
    <g id="settlement-c" transform={`rotate(${rotI})`}>
      <path d={`${housePath}`} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        C
      </text>
    </g>
    <g id="settlement-d" transform={`rotate(${rotM})`}>
      <path d={`${housePath}`} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={houseTextY} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        D
      </text>
    </g>
    <g id="settlement-e" transform={`rotate(${rotF})`}>
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
    <g id="settlement-a" transform={`rotate(${rotG})`}>
      <path d={`${housePath}`} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={`${houseTextY}`} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        A
      </text>
    </g>
    <g id="settlement-b" transform={`rotate(${rotA})`}>
      <path d={`${housePath}`} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={`${houseTextY}`} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        B
      </text>
    </g>
    <g id="settlement-c" transform={`rotate(${rotH})`}>
      <path d={`${housePath}`} style={{ fill: 'url(#housefill)', fillOpacity: 1, stroke: '#202020', strokeWidth: 1 }} />
      <text x="0" y={`${houseTextY}`} style={{ fontSize: '9px', fontWeight: 100, textAnchor: 'middle', fill: '#fff' }}>
        C
      </text>
    </g>
    <g id="settlement-d" transform={`rotate(${rotB})`}>
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
