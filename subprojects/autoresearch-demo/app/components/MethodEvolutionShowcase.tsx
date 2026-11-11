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
import { useMemo, useState } from "react";

export const methodEpochs = ["E0", "E1", "E3", "E5"] as const;
export type MethodEpoch = (typeof methodEpochs)[number];

type ToolStatus = "baseline" | "proposed" | "validating" | "validated";
type SkillPhase = "read" | "tools" | "verify" | "adjust";

type SkillRound = {
  epoch: MethodEpoch;
  version: string;
  label: string;
  status: string;
  gain: string;
  loop: Record<SkillPhase, string>;
  changedPhases: SkillPhase[];
};

type ToolNodeData = {
  round: number;
  shortName: string;
  slug: string;
  purpose: string;
  status: ToolStatus;
  statusLabel: string;
  formula: string;
  operators: string[];
  evidence: string;
};

type MethodToolNode = Node<ToolNodeData, "methodTool">;
type MethodToolEdge = Edge<{ secondary?: boolean }>;

const epochIndex: Record<MethodEpoch, number> = {
  E0: 0,
  E1: 1,
  E3: 3,
  E5: 5,
};

const skillLoopPhases: Array<{
  id: SkillPhase;
  index: string;
  title: string;
  className: string;
}> = [
  {
    id: "read",
    index: "01",
    title: "SeedBank 证据检索",
    className: "phase-read",
  },
  {
    id: "tools",
    index: "02",
    title: "Challenger Agent 策略改写",
    className: "phase-tools",
  },
  {
    id: "verify",
    index: "03",
    title: "Verify Agent 标签与区分度验证",
    className: "phase-verify",
  },
  {
    id: "adjust",
    index: "04",
    title: "高区分度数据落盘",
    className: "phase-adjust",
  },
];

const skillRounds: Record<MethodEpoch, SkillRound> = {
  E0: {
    epoch: "E0",
    version: "v0.0",
    label: "评测基线建立",
    status: "基线",
    gain: "0.00 pp",
    loop: {
      read: "提供固定 Seed 与评测契约",
      tools: "不做改写，保留原始输入",
      verify: "记录 Guard 判断，建立评测基线",
      adjust: "保存基线快照，供后续配对比较",
    },
    changedPhases: [],
  },
  E1: {
    epoch: "E1",
    version: "v0.1",
    label: "标签验证改进",
    status: "未通过",
    gain: "0.00 pp",
    loop: {
      read: "使用原始 Seed Prompt",
      tools: "添加安全前缀攻击",
      verify: "确认改写后标签类别不变",
      adjust: "按标签类别保存通过样本",
    },
    changedPhases: ["tools", "verify"],
  },
  E3: {
    epoch: "E3",
    version: "v0.3",
    label: "SeedBank 检索改进",
    status: "验证中",
    gain: "+12.50 pp",
    loop: {
      read: "检索历史失败样本",
      tools: "根据失败类型选择改写工具",
      verify: "确认标签不变，比较改写难度",
      adjust: "保存难度提升的样本",
    },
    changedPhases: ["read", "tools"],
  },
  E5: {
    epoch: "E5",
    version: "v1.0",
    label: "数据保存改进",
    status: "已采用",
    gain: "+20.83 pp",
    loop: {
      read: "按异常类别检索 Seed",
      tools: "按异常类别组合改写工具",
      verify: "按异常类别和测试集复核",
      adjust: "保存高难样本与有效工具",
    },
    changedPhases: ["tools", "adjust"],
  },
};

function toolNode(
  id: string,
  x: number,
  y: number,
  width: number,
  data: ToolNodeData,
): MethodToolNode {
  return {
    id,
    type: "methodTool",
    position: { x, y },
    style: { width },
    data,
    ariaLabel: `${data.shortName}：${data.purpose}。状态：${data.statusLabel}`,
  };
}

const allToolNodes: MethodToolNode[] = [
  toolNode("seed", 20, 140, 224, {
    round: 0,
    shortName: "原始 Seed",
    slug: "baseline",
    purpose: "使用原始 Seed Prompt",
    status: "baseline",
    statusLabel: "E0 · 基线",
    formula: "x",
    operators: ["direct"],
    evidence: "ACC 91.67% · 难度率 8.33%",
  }),
  toolNode("t1", 280, 140, 224, {
    round: 1,
    shortName: "T1 · 安全前缀攻击",
    slug: "safety_prefix_attack",
    purpose: "在原始请求前加入安全研究说明，测试 Guard 对前缀语境的敏感性",
    status: "proposed",
    statusLabel: "E1 · 提议",
    formula: "安全前缀 + x",
    operators: ["curated_transform"],
    evidence: "3 / 8 候选 · Gain 0.00 pp",
  }),
  toolNode("t2", 540, 0, 224, {
    round: 2,
    shortName: "T2 · 双层安全前缀",
    slug: "nested_safety_prefix",
    purpose: "叠加第二层安全说明，测试多层前缀是否扩大 Guard 分歧",
    status: "validated",
    statusLabel: "E2 · 已验证",
    formula: "安全前缀₂ + T1(x)",
    operators: ["curated_transform", "reversible_encode", "compose"],
    evidence: "1 / 8 正增益 · Gain +4.17 pp",
  }),
  toolNode("t3", 540, 140, 224, {
    round: 3,
    shortName: "T3 · ROT13 外壳",
    slug: "rot13_shell_r3",
    purpose: "切换外层编码机制，探索新的 Guard 分歧",
    status: "validating",
    statusLabel: "E3 · 候选",
    formula: "外层说明 + ROT13(T1(x))",
    operators: ["curated_transform", "reversible_encode", "compose"],
    evidence: "2 / 8 正增益 · Gain +12.50 pp",
  }),
  toolNode("t4", 540, 280, 224, {
    round: 4,
    shortName: "T4 · 鲁棒性语境包装",
    slug: "context_wrap_r1",
    purpose: "不增加编码层，只扩展鲁棒性评测语境",
    status: "validated",
    statusLabel: "E4 · 已验证",
    formula: "鲁棒性语境 + T1(x)",
    operators: ["curated_transform", "compose"],
    evidence: "1 / 8 正增益 · Gain +4.17 pp",
  }),
  toolNode("t5", 800, 140, 224, {
    round: 5,
    shortName: "T5 · 双路径交叉",
    slug: "crossover_winner",
    purpose: "交叉复用 T2 与 T1，形成最终可回放 Tool",
    status: "validated",
    statusLabel: "E5 · 已晋升",
    formula: "T1(T1(x))",
    operators: ["curated_transform", "curated_transform"],
    evidence: "5 / 8 正增益 · Gain +20.83 pp · held-out +23.81%",
  }),
];

function toolEdge(
  id: string,
  source: string,
  target: string,
  options?: {
    sourceHandle?: string;
    targetHandle?: string;
    secondary?: boolean;
  },
): MethodToolEdge {
  const secondary = options?.secondary ?? false;
  return {
    id,
    source,
    target,
    sourceHandle: options?.sourceHandle,
    targetHandle: options?.targetHandle,
    type: "smoothstep",
    data: { secondary },
    style: {
      stroke: secondary ? "#8a8a8a" : "#6b6b6b",
      strokeWidth: secondary ? 1.5 : 1.8,
      strokeDasharray: secondary ? "6 5" : undefined,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: secondary ? "#8a8a8a" : "#6b6b6b",
      width: 15,
      height: 15,
    },
  };
}

const allToolEdges: MethodToolEdge[] = [
  toolEdge("seed-t1", "seed", "t1", {
    sourceHandle: "source-right-mid",
    targetHandle: "target-left",
  }),
  toolEdge("t1-t2", "t1", "t2", {
    sourceHandle: "source-right-top",
    targetHandle: "target-left",
  }),
  toolEdge("t1-t3", "t1", "t3", {
    sourceHandle: "source-right-mid",
    targetHandle: "target-left",
  }),
  toolEdge("t1-t4", "t1", "t4", {
    sourceHandle: "source-right-bottom",
    targetHandle: "target-left",
  }),
  toolEdge("t2-t5", "t2", "t5", {
    sourceHandle: "source-right-mid",
    targetHandle: "target-left",
  }),
  toolEdge("t1-t5", "t1", "t5", {
    sourceHandle: "source-top",
    targetHandle: "target-top",
    secondary: true,
  }),
];

const newlyVisibleTools: Record<MethodEpoch, Set<string>> = {
  E0: new Set(["seed"]),
  E1: new Set(["t1"]),
  E3: new Set(["t2", "t3"]),
  E5: new Set(["t4", "t5"]),
};

const defaultToolByEpoch: Record<MethodEpoch, string> = {
  E0: "seed",
  E1: "t1",
  E3: "t3",
  E5: "t5",
};

function MethodToolHandles() {
  return (
    <>
      <Handle
        className="method-tool-handle"
        id="target-top"
        position={Position.Top}
        type="target"
      />
      <Handle
        className="method-tool-handle"
        id="target-left"
        position={Position.Left}
        type="target"
      />
      <Handle
        className="method-tool-handle"
        id="target-right"
        position={Position.Right}
        type="target"
      />
      <Handle
        className="method-tool-handle"
        id="source-top"
        position={Position.Top}
        type="source"
      />
      <Handle
        className="method-tool-handle"
        id="source-bottom"
        position={Position.Bottom}
        type="source"
      />
      <Handle
        className="method-tool-handle"
        id="source-bottom-left"
        position={Position.Bottom}
        style={{ left: "26%" }}
        type="source"
      />
      <Handle
        className="method-tool-handle"
        id="source-bottom-right"
        position={Position.Bottom}
        style={{ left: "74%" }}
        type="source"
      />
      <Handle
        className="method-tool-handle"
        id="source-right-top"
        position={Position.Right}
        style={{ top: "28%" }}
        type="source"
      />
      <Handle
        className="method-tool-handle"
        id="source-right-mid"
        position={Position.Right}
        style={{ top: "50%" }}
        type="source"
      />
      <Handle
        className="method-tool-handle"
        id="source-right-bottom"
        position={Position.Right}
        style={{ top: "72%" }}
        type="source"
      />
    </>
  );
}

function MethodToolCard({ data, selected }: NodeProps<MethodToolNode>) {
  return (
    <div
      className={`method-tool-node status-${data.status} ${
        selected ? "is-selected" : ""
      }`}
    >
      <MethodToolHandles />
      <div className="method-tool-node-topline">
        <span>{data.statusLabel}</span>
        <small>{data.slug}</small>
      </div>
      <strong>{data.shortName}</strong>
      <p>{data.purpose}</p>
    </div>
  );
}

const methodToolNodeTypes = {
  methodTool: MethodToolCard,
};

type MethodEvolutionShowcaseProps = {
  activeEpoch: MethodEpoch;
  onEpochChange: (epoch: MethodEpoch) => void;
};

export default function MethodEvolutionShowcase({
  activeEpoch,
  onEpochChange,
}: MethodEvolutionShowcaseProps) {
  const [activeToolId, setActiveToolId] = useState(defaultToolByEpoch[activeEpoch]);
  const currentRound = skillRounds[activeEpoch];
  const currentIndex = epochIndex[activeEpoch];
  const visibleToolIds = useMemo(
    () =>
      new Set(
        allToolNodes
          .filter((node) => node.data.round <= currentIndex)
          .map((node) => node.id),
      ),
    [currentIndex],
  );
  const resolvedActiveToolId = visibleToolIds.has(activeToolId)
    ? activeToolId
    : defaultToolByEpoch[activeEpoch];
  const selectedTool =
    allToolNodes.find((node) => node.id === resolvedActiveToolId) ?? allToolNodes[0];

  const renderedNodes = useMemo(
    () =>
      allToolNodes
        .filter((node) => visibleToolIds.has(node.id))
        .map((node) => ({
          ...node,
          selected: node.id === resolvedActiveToolId,
          className: newlyVisibleTools[activeEpoch].has(node.id)
            ? "method-tool-is-new"
            : "",
        })),
    [activeEpoch, resolvedActiveToolId, visibleToolIds],
  );

  const renderedEdges = useMemo(
    () =>
      allToolEdges
        .filter(
          (edge) =>
            visibleToolIds.has(edge.source) && visibleToolIds.has(edge.target),
        )
        .map((edge) => ({
          ...edge,
          animated: newlyVisibleTools[activeEpoch].has(edge.target),
          className: newlyVisibleTools[activeEpoch].has(edge.target)
            ? "method-tool-edge-new"
            : edge.data?.secondary
              ? "method-tool-edge-secondary"
              : "",
        })),
    [activeEpoch, visibleToolIds],
  );

  const selectEpoch = (epoch: MethodEpoch) => {
    setActiveToolId(defaultToolByEpoch[epoch]);
    onEpochChange(epoch);
  };

  const moveEpochFocus = (index: number, direction: -1 | 1) => {
    const nextIndex = (index + direction + methodEpochs.length) % methodEpochs.length;
    const nextEpoch = methodEpochs[nextIndex];
    selectEpoch(nextEpoch);
    document.getElementById(`method-epoch-${nextEpoch}`)?.focus();
  };

  return (
    <div className="method-presentation">
      <div
        className="method-epoch-switcher"
        role="group"
        aria-label="选择 Skills 与 Tools 版本"
      >
        {methodEpochs.map((epoch, index) => {
          const round = skillRounds[epoch];
          return (
            <button
              aria-controls="method-evolution-panel"
              aria-pressed={activeEpoch === epoch}
              className={activeEpoch === epoch ? "is-active" : ""}
              id={`method-epoch-${epoch}`}
              key={epoch}
              onClick={() => selectEpoch(epoch)}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                  event.preventDefault();
                  moveEpochFocus(index, event.key === "ArrowLeft" ? -1 : 1);
                }
              }}
              type="button"
            >
              <span>{epoch}</span>
              <strong>{round.label}</strong>
              <small>{round.gain}</small>
            </button>
          );
        })}
      </div>

      <article
        className={`method-evolution-stage is-${activeEpoch.toLowerCase()}`}
        id="method-evolution-panel"
        role="region"
        aria-label={`${activeEpoch} Skills 与 Tools`}
      >
        <section className="method-skill-script">
          <div className="method-skill-script-head">
            <span>SKILL ORCHESTRATOR · {currentRound.version}</span>
            <i className={`status-${activeEpoch.toLowerCase()}`}>
              {currentRound.status}
            </i>
          </div>
          <p className="method-skill-loop-kicker">CORE LOOP ·</p>
          <div
            className="method-skill-loop-map"
            aria-label={`${activeEpoch} Skill 编排闭环`}
          >
            <span className="method-skill-loop-arrow arrow-top" aria-hidden="true">
              →
            </span>
            <span className="method-skill-loop-arrow arrow-right" aria-hidden="true">
              ↓
            </span>
            <span className="method-skill-loop-arrow arrow-bottom" aria-hidden="true">
              ←
            </span>
            <span className="method-skill-loop-arrow arrow-left" aria-hidden="true">
              ↑
            </span>
            <div className="method-skill-loop-center">
              <span>SKILL</span>
              <strong>编排器</strong>
            </div>
            {skillLoopPhases.map((phase) => {
              const changed =
                activeEpoch !== "E0" &&
                currentRound.changedPhases.includes(phase.id);
              return (
                <div
                  className={`method-skill-loop-node ${phase.className} ${
                    changed ? "is-changed" : ""
                  }`}
                  key={phase.id}
                >
                  <span>{phase.index}</span>
                  <strong>{phase.title}</strong>
                  <small>{currentRound.loop[phase.id]}</small>
                  {changed ? <i>SKILL Δ</i> : null}
                </div>
              );
            })}
          </div>
        </section>

        <section className="method-tool-tree-panel">
          <div className="method-tool-tree-head">
            <div className="method-tool-agent-title">
              <b aria-hidden="true">C</b>
              <div>
                <strong>CHALLENGER AGENT - Tools set</strong>
              </div>
            </div>
            <small>Seed 输入 → Tool 路由 → 候选改写</small>
          </div>
          <div className="method-tool-tree-canvas">
            <ReactFlow
              colorMode="light"
              edges={renderedEdges}
              edgesFocusable={false}
              elementsSelectable
              fitView
              fitViewOptions={{ padding: 0.06, minZoom: 0.7, maxZoom: 0.95 }}
              key={activeEpoch}
              maxZoom={1}
              minZoom={0.68}
              nodeTypes={methodToolNodeTypes}
              nodes={renderedNodes}
              nodesConnectable={false}
              nodesDraggable={false}
              nodesFocusable
              onNodeClick={(_, node) => setActiveToolId(node.id)}
              onlyRenderVisibleElements
              panOnDrag={false}
              preventScrolling={false}
              proOptions={{ hideAttribution: true }}
              selectionOnDrag={false}
              zoomOnDoubleClick={false}
              zoomOnPinch={false}
              zoomOnScroll={false}
            >
              <Background
                color="#d8d8d8"
                gap={24}
                size={1}
                variant={BackgroundVariant.Dots}
              />
            </ReactFlow>
          </div>
          <div className="method-tool-inspector" aria-live="polite">
            <div>
              <span>当前 Tool</span>
              <strong>{selectedTool.data.shortName}</strong>
            </div>
            <p>{selectedTool.data.purpose}</p>
            <div>
              <code>{selectedTool.data.formula}</code>
              <small>{selectedTool.data.operators.join(" → ")}</small>
              <small>{selectedTool.data.evidence}</small>
            </div>
          </div>
        </section>
      </article>

    </div>
  );
}
