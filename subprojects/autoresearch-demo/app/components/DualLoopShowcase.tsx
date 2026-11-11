"use client";

import {
  Background,
  BackgroundVariant,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { useEffect, useMemo, useState } from "react";

type LoopKind = "outer" | "inner";
type LoopFocus = "all" | LoopKind;
type EdgeKind = LoopKind | "cross";
type NodeTone = "evidence" | "method" | "input" | "inner" | "data";

type AgentRole = {
  code: "C" | "V" | "M";
  label: string;
  tone: "challenger" | "verify" | "moderator";
};

type LoopNodeData = {
  loop: LoopKind;
  tone: NodeTone;
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
  detail: string;
};

type ParallelNodeData = LoopNodeData & {
  agents: AgentRole[];
  lanes: Array<{
    id: string;
    outcome: string;
    delta: string;
    tone: "negative" | "positive";
  }>;
};

type LoopNode = Node<LoopNodeData, "loopNode">;
type ParallelNode = Node<ParallelNodeData, "parallelNode">;
type DiagramNode = LoopNode | ParallelNode;
type DiagramEdge = Edge<{ loop: EdgeKind }>;

const colors = {
  outer: "#8b20d7",
  inner: "#006bff",
  cross: "#737373",
};

const agentRoles: AgentRole[] = [
  { code: "C", label: "Challenger", tone: "challenger" },
  { code: "V", label: "Verify", tone: "verify" },
  { code: "M", label: "Moderator", tone: "moderator" },
];

const focusContent: Record<
  LoopKind,
  {
    eyebrow: string;
    title: string;
    detail: string;
    tags: string[];
  }
> = {
  outer: {
    eyebrow: "OUTER LOOP · 方法进化",
    title: "从历史运行证据到新版 Skills / Tools",
    detail:
      "基于版本历史、成功与失败信号完成观察、归因和跨实验裁决，提出候选 Skills / Tools；经并行 Inner Loop 回放与回归验证后，胜出方法晋升为 vK+1。",
    tags: ["历史记录", "观察与归因", "Method Gate", "版本晋升"],
  },
  inner: {
    eyebrow: "INNER LOOP · 数据增强",
    title: "并行生成、验证并保留高区分度数据",
    detail:
      "多个 Inner Loop 在统一评测契约下加载不同候选策略，由 Challenger 生成、Verify 守住标签、Moderator 实测区分度；通过 Data Gate 的样本进入 Benchmark vN+1。",
    tags: ["×M 并行", "标签守恒", "Moderator 实测", "Data Gate"],
  },
};

function loopNode(
  id: string,
  x: number,
  y: number,
  width: number,
  data: LoopNodeData,
): LoopNode {
  return {
    id,
    type: "loopNode",
    position: { x, y },
    data,
    style: { width },
    ariaLabel: `${data.eyebrow}：${data.title}。${data.description}`,
  };
}

function parallelNode(
  id: string,
  x: number,
  y: number,
  width: number,
  data: ParallelNodeData,
): ParallelNode {
  return {
    id,
    type: "parallelNode",
    position: { x, y },
    data,
    style: { width },
    ariaLabel: `${data.eyebrow}：${data.title}。${data.description}`,
  };
}

function loopEdge(
  id: string,
  source: string,
  target: string,
  loop: EdgeKind,
  label?: string,
  options?: {
    sourceHandle?: string;
    targetHandle?: string;
    type?: "smoothstep" | "default" | "straight";
    animated?: boolean;
    width?: number;
  },
): DiagramEdge {
  const color = colors[loop];
  return {
    id,
    source,
    target,
    type: options?.type ?? "smoothstep",
    sourceHandle: options?.sourceHandle,
    targetHandle: options?.targetHandle,
    label,
    animated: options?.animated ?? false,
    data: { loop },
    style: {
      stroke: color,
      strokeWidth: options?.width ?? (loop === "inner" ? 2.8 : 2.2),
      strokeDasharray: loop === "cross" ? "7 6" : undefined,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color,
      width: 17,
      height: 17,
    },
    labelStyle: {
      fill: loop === "outer" ? colors.outer : loop === "inner" ? colors.inner : "#525252",
      fontSize: 11,
      fontWeight: 600,
    },
    labelBgStyle: {
      fill: "#ffffff",
      fillOpacity: 0.94,
    },
    labelBgPadding: [6, 4],
    labelBgBorderRadius: 5,
  };
}

const diagramNodes: DiagramNode[] = [
  loopNode("method-current", 40, 52, 250, {
    loop: "outer",
    tone: "method",
    eyebrow: "OUTER LOOP · CURRENT",
    title: "Skills / Tools vK",
    description: "当前已验证的出题策略、提示方法、工具与验证规则。",
    tags: ["当前方法版本", "可回放", "可追溯"],
    detail:
      "每一轮从稳定的方法版本出发。候选策略只能在实验轨道中运行，不能直接覆盖正式 Skills / Tools。",
  }),
  loopNode("evidence-hub", 455, 52, 280, {
    loop: "outer",
    tone: "evidence",
    eyebrow: "OUTER LOOP · EVIDENCE HUB",
    title: "历史记录、观察归因与裁决",
    description: "合并跨轮记录、成败归因与跨实验比较，提出下一轮候选方法。",
    tags: ["版本历史", "Experience 归因", "比较裁决"],
    detail:
      "观察、归因和比较裁决在同一证据中心完成：失败样本不入库，但失败模式会转化为下一轮 Skills / Tools 的改进假设。",
  }),
  loopNode("method-next", 890, 52, 250, {
    loop: "outer",
    tone: "method",
    eyebrow: "OUTER LOOP · NEXT",
    title: "Skills / Tools vK+1",
    description: "回放与回归通过的候选方法，沉淀为下一轮正式版本。",
    tags: ["Method Gate", "回归通过", "策略能力提升"],
    detail:
      "只有在多个 Inner Loop 中稳定提升区分度、同时保持原有验证纪律的方法，才能晋升为 vK+1。",
  }),
  loopNode("benchmark-input", 40, 384, 230, {
    loop: "inner",
    tone: "input",
    eyebrow: "INNER LOOP · INPUT",
    title: "SeedBank + 评测契约",
    description: "固定风险类别、样本组、目标 Moderator、预算与标签约束。",
    tags: ["统一起点", "风险分类", "Moderator 基线"],
    detail:
      "统一评测契约保证不同候选策略在同一数据切片、预算与标签约束下比较，避免把样本差异误判为策略差异。",
  }),
  parallelNode("parallel-inner", 350, 244, 500, {
    loop: "inner",
    tone: "inner",
    eyebrow: "INNER LOOP · PARALLEL EXECUTION",
    title: "×M 并行生成与验证",
    description: "候选策略在相同契约下并行运行；仅显著提升区分度的轨道进入 Data Gate。",
    agents: agentRoles,
    lanes: [
      {
        id: "Sₖ¹",
        outcome: "提升不足",
        delta: "Δ +0.6 pp",
        tone: "negative",
      },
      {
        id: "Sₖ²",
        outcome: "区分度下降",
        delta: "Δ −2.1 pp",
        tone: "negative",
      },
      {
        id: "Sₖᴹ",
        outcome: "区分度提升",
        delta: "Δ +8.4 pp",
        tone: "positive",
      },
    ],
    tags: ["标签守恒是硬门槛", "仅保留显著提升轨道", "失败信号回流"],
    detail:
      "每条轨道均由 Challenger 生成与改写、Verify 复核语义和标签、Moderator 面板实测区分度。提升不足或下降的轨道标为淡红色并回流失败证据；显著提升的轨道标为淡绿色并进入 Data Gate。",
  }),
  loopNode("benchmark-output", 930, 384, 230, {
    loop: "inner",
    tone: "data",
    eyebrow: "INNER LOOP · DATA OUTPUT",
    title: "Benchmark Pool vN+1",
    description: "标签正确、区分度更高且来源可追溯的数据进入下一版本。",
    tags: ["Data Gate", "区分度提升", "有效覆盖扩展"],
    detail:
      "高质量数据必须同时通过标签守恒与区分度门槛。成功样本进入下一版 Benchmark，失败样本只保留为外环证据。",
  }),
];

const diagramEdges: DiagramEdge[] = [
  loopEdge(
    "outer-current-evidence",
    "method-current",
    "evidence-hub",
    "outer",
    "历史版本与候选方法",
    {
      sourceHandle: "source-right",
      targetHandle: "target-left",
      type: "straight",
    },
  ),
  loopEdge(
    "outer-evidence-next",
    "evidence-hub",
    "method-next",
    "outer",
    "Method Gate · 晋升",
    {
      sourceHandle: "source-right",
      targetHandle: "target-left",
      type: "straight",
      width: 2.8,
    },
  ),
  loopEdge(
    "outer-next-current",
    "method-next",
    "method-current",
    "outer",
    undefined,
    {
      sourceHandle: "source-top",
      targetHandle: "target-top",
      type: "default",
      animated: true,
    },
  ),
  loopEdge(
    "inner-input-parallel",
    "benchmark-input",
    "parallel-inner",
    "inner",
    undefined,
    {
      sourceHandle: "source-right",
      targetHandle: "target-left",
      type: "straight",
    },
  ),
  loopEdge(
    "inner-parallel-output",
    "parallel-inner",
    "benchmark-output",
    "inner",
    undefined,
    {
      sourceHandle: "source-right",
      targetHandle: "target-left",
      type: "straight",
      width: 3.4,
    },
  ),
  loopEdge(
    "inner-output-input",
    "benchmark-output",
    "benchmark-input",
    "inner",
    "Benchmark vN+1 → 下一轮",
    {
      sourceHandle: "source-bottom",
      targetHandle: "target-bottom",
      type: "default",
      animated: true,
    },
  ),
  loopEdge(
    "cross-method-parallel",
    "method-current",
    "parallel-inner",
    "cross",
    "×M 策略注入",
    {
      sourceHandle: "source-bottom-right",
      targetHandle: "target-top-left",
    },
  ),
  loopEdge(
    "cross-parallel-evidence",
    "parallel-inner",
    "evidence-hub",
    "cross",
    "运行证据 · 归因",
    {
      sourceHandle: "source-top-right",
      targetHandle: "target-bottom-right",
      animated: true,
    },
  ),
];

const compactPositions: Record<string, { x: number; y: number; width: number }> = {
  "method-current": { x: 12, y: 0, width: 280 },
  "evidence-hub": { x: 12, y: 178, width: 280 },
  "method-next": { x: 12, y: 356, width: 280 },
  "benchmark-input": { x: 12, y: 570, width: 280 },
  "parallel-inner": { x: 12, y: 748, width: 280 },
  "benchmark-output": { x: 12, y: 1110, width: 280 },
};

function ConnectionHandles() {
  return (
    <>
      <Handle
        className="loop-graph-handle"
        id="target-left"
        type="target"
        position={Position.Left}
      />
      <Handle
        className="loop-graph-handle"
        id="source-left"
        type="source"
        position={Position.Left}
      />
      <Handle
        className="loop-graph-handle"
        id="target-right"
        type="target"
        position={Position.Right}
      />
      <Handle
        className="loop-graph-handle"
        id="source-right"
        type="source"
        position={Position.Right}
      />
      <Handle
        className="loop-graph-handle"
        id="target-top"
        type="target"
        position={Position.Top}
      />
      <Handle
        className="loop-graph-handle"
        id="source-top"
        type="source"
        position={Position.Top}
      />
      <Handle
        className="loop-graph-handle"
        id="target-bottom"
        type="target"
        position={Position.Bottom}
      />
      <Handle
        className="loop-graph-handle"
        id="source-bottom"
        type="source"
        position={Position.Bottom}
      />
      <Handle
        className="loop-graph-handle"
        id="target-top-left"
        type="target"
        position={Position.Top}
        style={{ left: "25%" }}
      />
      <Handle
        className="loop-graph-handle"
        id="source-top-right"
        type="source"
        position={Position.Top}
        style={{ left: "75%" }}
      />
      <Handle
        className="loop-graph-handle"
        id="source-bottom-right"
        type="source"
        position={Position.Bottom}
        style={{ left: "75%" }}
      />
      <Handle
        className="loop-graph-handle"
        id="target-bottom-right"
        type="target"
        position={Position.Bottom}
        style={{ left: "75%" }}
      />
    </>
  );
}

function AgentChain({ agents }: { agents: AgentRole[] }) {
  return (
    <span className="loop-agent-chain" aria-label="Agent 协作链">
      {agents.map((agent, index) => (
        <span className="loop-agent-step" key={agent.code}>
          <span
            className={`loop-agent-avatar loop-agent-avatar-${agent.tone}`}
            aria-hidden="true"
          >
            {agent.code}
          </span>
          <small>{agent.label}</small>
          {index < agents.length - 1 ? (
            <b aria-hidden="true">{index === 0 ? "↔" : "→"}</b>
          ) : null}
        </span>
      ))}
    </span>
  );
}

function NodeTags({ tags }: { tags: string[] }) {
  return (
    <div className="loop-graph-node-tags">
      {tags.slice(0, 3).map((tag) => (
        <span key={tag}>{tag}</span>
      ))}
    </div>
  );
}

function LoopNodeCard({ data, selected }: NodeProps<LoopNode>) {
  return (
    <div
      className={`loop-graph-node loop-graph-node-${data.tone} loop-graph-node-${data.loop} ${
        selected ? "is-selected" : ""
      }`}
    >
      <ConnectionHandles />
      <span className="loop-graph-node-eyebrow">{data.eyebrow}</span>
      <strong>{data.title}</strong>
      <p>{data.description}</p>
      <NodeTags tags={data.tags} />
    </div>
  );
}

function ParallelNodeCard({ data, selected }: NodeProps<ParallelNode>) {
  return (
    <div
      className={`loop-graph-node loop-graph-node-parallel loop-graph-node-${data.loop} ${
        selected ? "is-selected" : ""
      }`}
    >
      <ConnectionHandles />
      <div className="loop-parallel-heading">
        <div>
          <span className="loop-graph-node-eyebrow">{data.eyebrow}</span>
          <strong>{data.title}</strong>
        </div>
        <span>× M</span>
      </div>
      <p>{data.description}</p>
      <div className="loop-parallel-transfer" aria-label="双环之间的信息交换">
        <span>Skills / Tools 注入 ↓</span>
        <span>运行证据回流 ↑</span>
      </div>
      <div className="loop-parallel-lanes" aria-label="并行 Inner Loop 轨道">
        {data.lanes.map((lane) => (
          <div className={`is-${lane.tone}`} key={lane.id}>
            <strong>{lane.id}</strong>
            <AgentChain agents={data.agents} />
            <span className={`loop-lane-result is-${lane.tone}`}>
              <b aria-hidden="true">
                {lane.tone === "positive" ? "✅" : "❌"}
              </b>
              <span>
                <strong>{lane.outcome}</strong>
                <small>{lane.delta}</small>
              </span>
            </span>
          </div>
        ))}
      </div>
      <NodeTags tags={data.tags} />
    </div>
  );
}

const nodeTypes = {
  loopNode: LoopNodeCard,
  parallelNode: ParallelNodeCard,
};

export default function DualLoopShowcase() {
  const [focus, setFocus] = useState<LoopFocus>("all");
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 540px)");
    const updateCompactMode = () => setIsCompact(mediaQuery.matches);
    updateCompactMode();
    mediaQuery.addEventListener("change", updateCompactMode);
    return () => mediaQuery.removeEventListener("change", updateCompactMode);
  }, []);

  const renderedNodes = useMemo(
    () =>
      diagramNodes.map((node) => {
        const compact = compactPositions[node.id];
        return {
          ...node,
          position: isCompact ? { x: compact.x, y: compact.y } : node.position,
          style: isCompact
            ? {
                ...node.style,
                width: compact.width,
              }
            : node.style,
          selected: node.id === activeNodeId,
          className:
            focus !== "all" && node.data.loop !== focus
              ? "loop-graph-element-muted"
              : "",
        };
      }),
    [activeNodeId, focus, isCompact],
  );

  const renderedEdges = useMemo(() => {
    const availableEdges = isCompact
      ? diagramEdges.filter(
          (edge) =>
            edge.data?.loop !== "cross" &&
            edge.id !== "outer-next-current" &&
            edge.id !== "inner-output-input",
        )
      : diagramEdges;

    return availableEdges.map((edge) => {
      const group = edge.data?.loop ?? "cross";
      const isConnected =
        activeNodeId !== null &&
        (edge.source === activeNodeId || edge.target === activeNodeId);
      const matchesFocus =
        focus === "all" || group === focus || group === "cross";
      return {
        ...edge,
        animated: edge.animated || isConnected,
        className: `${
          matchesFocus ? "" : "loop-graph-element-muted"
        } ${
          isConnected || (focus !== "all" && group === focus)
            ? "loop-graph-edge-active"
            : ""
        } loop-graph-edge-${group}`.trim(),
      };
    });
  }, [activeNodeId, focus, isCompact]);

  const activeNode =
    activeNodeId === null
      ? null
      : diagramNodes.find((node) => node.id === activeNodeId) ?? null;
  const detailContent =
    activeNode?.data ?? (focus === "all" ? null : focusContent[focus]);
  const detailTone = activeNode?.data.loop ?? focus;

  const selectFocus = (nextFocus: LoopFocus) => {
    setFocus(nextFocus);
    setActiveNodeId(null);
  };

  return (
    <div className="dual-loop-showcase">
      <div
        className="dual-loop-focus"
        role="group"
        aria-label="选择双循环说明"
      >
        <button
          aria-pressed={focus === "all" && activeNodeId === null}
          className="is-all"
          onClick={() => selectFocus("all")}
          type="button"
        >
          <span aria-hidden="true"></span>
          <strong>全部流程</strong>
          <small>方法与数据协同演进</small>
        </button>
        <button
          aria-pressed={focus === "outer" && activeNodeId === null}
          className="is-outer"
          onClick={() => selectFocus("outer")}
          type="button"
        >
          <span aria-hidden="true"></span>
          <strong>Outer Loop</strong>
          <small>提出、验证并沉淀 Skills / Tools</small>
        </button>
        <button
          aria-pressed={focus === "inner" && activeNodeId === null}
          className="is-inner"
          onClick={() => selectFocus("inner")}
          type="button"
        >
          <span aria-hidden="true"></span>
          <strong>Inner Loop</strong>
          <small>生成、验证并保留高区分度数据</small>
        </button>
      </div>

      <div
        aria-label="方案 A：控制面与并行执行双循环流程图"
        className="dual-loop-stage"
      >
        <div className="dual-loop-stage-head">
          <div>
            <span>方案 A · CONTROL PLANE / PARALLEL EXECUTION</span>
            <strong>方法外环负责“改进出题方式”，数据内环负责“生成高区分度数据”</strong>
          </div>
          <small>点击按钮查看双环职责；点击节点查看详细说明</small>
        </div>

        <div
          className="dual-loop-canvas"
          style={isCompact ? { height: "1325px" } : undefined}
        >
          <div className="loop-band-marker loop-band-marker-outer">
            <span>OUTER LOOP</span>
            <strong>方法进化 · Skills / Tools</strong>
          </div>
          <div className="loop-band-marker loop-band-marker-inner">
            <span>INNER LOOP</span>
            <strong>数据增强 · Benchmark Pool</strong>
          </div>
          <div className="loop-edge-callout loop-edge-callout-version">
            <span>↺</span>
            <strong>下一轮版本</strong>
          </div>
          <div className="loop-edge-callout loop-edge-callout-contract">
            <span>SeedBank</span>
            <strong>Contract →</strong>
          </div>
          <div className="loop-edge-callout loop-edge-callout-gate">
            <span>Data Gate</span>
            <strong>高区分度数据 →</strong>
          </div>

          <ReactFlow
            colorMode="light"
            edges={renderedEdges}
            edgesFocusable={false}
            elementsSelectable
            fitView
            fitViewOptions={{
              padding: isCompact ? 0.035 : 0.1,
              minZoom: isCompact ? 0.45 : 0.72,
              maxZoom: 1,
            }}
            key={isCompact ? "control-compact" : "control-wide"}
            maxZoom={1.12}
            minZoom={0.45}
            nodeTypes={nodeTypes}
            nodes={renderedNodes}
            nodesConnectable={false}
            nodesDraggable={false}
            nodesFocusable
            onNodeClick={(_, node) =>
              setActiveNodeId((current) => (current === node.id ? null : node.id))
            }
            onPaneClick={() => setActiveNodeId(null)}
            onlyRenderVisibleElements
            panOnDrag={!isCompact}
            preventScrolling={false}
            proOptions={{ hideAttribution: true }}
            selectionOnDrag={false}
            zoomOnDoubleClick={false}
            zoomOnPinch
            zoomOnScroll={false}
          >
            <Background
              color="#d7d7d7"
              gap={24}
              size={1}
              variant={BackgroundVariant.Dots}
            />
          </ReactFlow>
        </div>

        {detailContent ? (
          <div
            className={`dual-loop-detail is-${detailTone}`}
            aria-live="polite"
          >
            <div>
              <span>{detailContent.eyebrow}</span>
              <strong>{detailContent.title}</strong>
            </div>
            <p>{detailContent.detail}</p>
            <div>
              {detailContent.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="dual-loop-legend" aria-label="流程图颜色说明">
          <span className="is-outer">紫色 · Outer Loop 方法版本演进</span>
          <span className="is-inner">蓝色 · Inner Loop 数据质量提升</span>
          <span className="is-evidence">灰色虚线 · 策略注入与运行证据回流</span>
        </div>
      </div>
    </div>
  );
}
