import React from 'react';
import { Video, Shield, Circle, CheckCircle2, XCircle, Loader2, Clock } from 'lucide-react';

const ICON_MAP = { video: Video, shield: Shield };
const NODE_W = 200;
const NODE_H = 72;
const H_GAP  = 80;
const SVG_PAD = 32;

const STATUS_STYLES = {
  pending:   { ring: '#3b3f5c', bg: '#1c2033', text: '#7b82a6', dot: '#3b3f5c' },
  running:   { ring: '#6270f3', bg: '#1e2145', text: '#a5b8fb', dot: '#6270f3' },
  completed: { ring: '#10b981', bg: '#0f2b22', text: '#6ee7b7', dot: '#10b981' },
  failed:    { ring: '#ef4444', bg: '#2b0f0f', text: '#fca5a5', dot: '#ef4444' },
  skipped:   { ring: '#3b3f5c', bg: '#161927', text: '#4a5174', dot: '#3b3f5c' },
};

function NodeBox({ node, x, y, isActive }) {
  const Icon  = ICON_MAP[node.icon] || Circle;
  const style = STATUS_STYLES[node.status] || STATUS_STYLES.pending;

  return (
    <g transform={`translate(${x},${y})`}>
      {/* Glow for active */}
      {node.status === 'running' && (
        <rect
          x={-4} y={-4}
          width={NODE_W + 8} height={NODE_H + 8}
          rx={14}
          fill="none"
          stroke={style.ring}
          strokeWidth={2}
          opacity={0.35}
        />
      )}
      {/* Card */}
      <rect
        width={NODE_W} height={NODE_H}
        rx={10}
        fill={style.bg}
        stroke={style.ring}
        strokeWidth={1.5}
      />
      {/* Icon circle */}
      <circle cx={36} cy={NODE_H / 2} r={16} fill={style.ring} fillOpacity={0.25} />
      <foreignObject x={27} y={NODE_H / 2 - 9} width={18} height={18}>
        <Icon style={{ width: 18, height: 18, color: style.text }} />
      </foreignObject>
      {/* Label */}
      <text x={60} y={NODE_H / 2 - 8} fill={style.text}
            fontSize={12} fontWeight={600} fontFamily="Syne, system-ui">
        {node.label || node.nodeId}
      </text>
      {/* Duration */}
      <text x={60} y={NODE_H / 2 + 10} fill={style.text}
            fontSize={10} fontFamily="DM Sans, system-ui" opacity={0.7}>
        {node.durationMs != null ? `${node.durationMs}ms` : node.status}
      </text>
      {/* Status dot */}
      <circle cx={NODE_W - 14} cy={14} r={5} fill={style.dot}
        opacity={node.status === 'running' ? 1 : 0.8}>
        {node.status === 'running' && (
          <animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite" />
        )}
      </circle>
    </g>
  );
}

/**
 * DAGCanvas
 * Renders the workflow DAG as an SVG.
 * Accepts:
 *   definition  — { nodes: [{id, label, icon}], edges: [{from, to}] }
 *   activeNodes — Map<nodeId, { status, durationMs }>  (from live run trace)
 */
export default function DAGCanvas({ definition, activeNodes = new Map() }) {
  if (!definition) return null;

  const { nodes: defNodes, edges } = definition;

  // ── Layout: left-to-right horizontal chain ─────────────────────────────────
  const totalW = defNodes.length * NODE_W + (defNodes.length - 1) * H_GAP + SVG_PAD * 2;
  const totalH = NODE_H + SVG_PAD * 2;

  const positions = {};
  defNodes.forEach((n, i) => {
    positions[n.id] = { x: SVG_PAD + i * (NODE_W + H_GAP), y: SVG_PAD };
  });

  // Merge definition with live trace data
  const nodes = defNodes.map((n) => ({
    ...n,
    nodeId:    n.id,
    status:    activeNodes.get(n.id)?.status    || 'pending',
    durationMs: activeNodes.get(n.id)?.durationMs ?? null,
  }));

  return (
    <svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      width="100%"
      style={{ maxHeight: 140, overflow: 'visible' }}
    >
      {/* Edges */}
      {edges.map((e, i) => {
        const from = positions[e.from];
        const to   = positions[e.to];
        if (!from || !to) return null;
        const x1 = from.x + NODE_W;
        const y1 = from.y + NODE_H / 2;
        const x2 = to.x;
        const y2 = to.y + NODE_H / 2;
        const mx = (x1 + x2) / 2;

        const fromStatus = activeNodes.get(e.from)?.status;
        const edgeColor  = fromStatus === 'completed' ? '#10b981'
                         : fromStatus === 'failed'    ? '#ef4444'
                         : '#3b3f5c';

        return (
          <g key={i}>
            <path
              d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
              fill="none" stroke={edgeColor} strokeWidth={1.5} strokeDasharray={fromStatus === 'completed' ? '0' : '5,4'}
            />
            {/* Arrowhead */}
            <polygon
              points={`${x2},${y2} ${x2 - 8},${y2 - 4} ${x2 - 8},${y2 + 4}`}
              fill={edgeColor}
            />
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map((n) => {
        const pos = positions[n.id];
        if (!pos) return null;
        return (
          <NodeBox
            key={n.id}
            node={n}
            x={pos.x}
            y={pos.y}
          />
        );
      })}
    </svg>
  );
}
