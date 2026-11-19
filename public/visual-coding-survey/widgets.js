/* Interactive Pedagogical Widgets for Visual Coding Academic Blog (Zero external deps) */
(function () {
  const MODES_3D = [
    {
      id: "ok",
      label: "✓ 正常基准（铰链开合宝箱）",
      rate: "理想目标态",
      code: "// 1. 统一 Y-up 坐标，地板微偏防闪烁\nfloor.position.set(0, 0, 0);\nrug.position.set(0, 0.004, 0); // +4mm 深度偏移\n// 2. 枢轴移至箱体后上沿 (y=1.0, z=-0.6) 再绕 X 轴掀起\nlidPivot.position.set(0, 1.0, -0.6);\nlidMesh.position.set(0, 0.12, +0.6);\nlidPivot.rotation.x = -openAngle;",
      desc: "箱底紧贴地面（y = 0），地毯施加 +0.004 微偏移消除深度冲突；箱盖挂载在后沿铰链节点下旋转，全部外法线朝外，开合轨迹与物理直觉完全一致。"
    },
    {
      id: "yup",
      label: "① Y-up / Z-up 轴混淆",
      rate: "3JSBench 16% 朝向错",
      code: "// 错误：按 Blender (Z-up) 习惯把高度写在 Z 轴\nchestBody.position.set(0, 0, 0.5);\n// 导入的 Z-up 网格未做绕 X 轴 -90° 校准\nscene.add(importedBlenderChest);",
      desc: "Blender 与 CAD 默认 +Z 朝天空，而 Three.js / WebGL 默认 +Y 朝天空、+Z 朝屏幕外。漏做坐标系转换会导致整个箱体直接向前翻倒 90° 趴在地板上，编译器零报错。"
    },
    {
      id: "pivot",
      label: "② 矩阵乘序与枢轴错位",
      rate: "穿模 20% + 朝向错 16%",
      code: "// 错误：几何原点仍在箱盖中心 (0,0,0)\nlidMesh.position.set(0, 1.12, 0);\n// 直接对自身中心旋转，未先平移至后沿铰链\nlidMesh.rotation.x = -openAngle;",
      desc: "三维刚体变换不满足交换律（T·R ≠ R·T）。箱盖绕自身几何中心原地翻转，后半截直接切入箱体木板内部发生严重穿模，前半截悬空翘起，丧失铰链连接关系。"
    },
    {
      id: "backface",
      label: "③ 顶点绕序写反（背面剔除）",
      rate: "3JSBench 19% 单面透明",
      code: "// 错误：手写 BufferGeometry 时顺时针排列正面顶点\n// 法线 n = (v1-v0) × (v2-v0) 指向箱子内部\nconst indices = [0, 2, 1,  0, 3, 2];\nmaterial.side = THREE.FrontSide; // GPU 默认剔除背面",
      desc: "GPU 光栅化默认开启背面剔除（Backface Culling）。仅仅把三角面两个顶点下标调换，外法线就反转 180° 指向内部，正对镜头的箱体前壁瞬间变成单向透明的「隐形墙」。"
    },
    {
      id: "zfight",
      label: "④ 共面深度竞争（Z-fighting）",
      rate: "3JSBench 17% 画面闪烁",
      code: "// 错误：预训练代码偏好整洁数字，两平面同处 y = 0\nfloorMesh.position.y = 0.0;\nrugDecalMesh.position.y = 0.0; // 浮点深度完全相等！",
      desc: "地板与地毯处在完全相同的高度 y = 0.0。在 24-bit 深度缓冲（Z-buffer）中两者浮点舍入误差随机交替胜出，镜头哪怕移动 0.1° 都会产生剧烈跳变闪烁的锯齿条纹。"
    },
    {
      id: "floating",
      label: "⑤ 漏算半高偏移（悬空断连）",
      rate: "3JSBench 16% 部件断连",
      code: "// 错误：随手硬编码经验高度，未按包围盒尺寸对齐\nchestBody.position.set(0, 0.45, 0); // 悬在半空\nlidMesh.position.set(0, 1.85, 0);   // 箱盖与箱体脱节",
      desc: "没有物理重力引擎兜底时，模型靠猜数字硬编码各部件坐标。正面特定角度看似上下对齐，稍微转动摄像机就会暴露出箱体与地面、箱盖与箱身之间巨大的悬空断连间隙。"
    }
  ];

  function init3DLab() {
    const root = document.getElementById("widget-3d-lab");
    if (!root) return;
    let cur = MODES_3D[0];
    let t = 0;

    root.innerHTML = `
      <div class="w-head">
        <div>
          <span class="w-badge">交互式图解 1 · 零图形学基础沙盘</span>
          <h4>点击切换：为什么语法 100% 正确的三维代码，渲染出来却全是硬伤？</h4>
        </div>
        <span class="w-rate" id="w3d-rate">${cur.rate}</span>
      </div>
      <div class="w-pills" id="w3d-pills"></div>
      <div class="w-body-grid">
        <div class="w-canvas-wrap">
          <canvas id="w3d-canvas" width="440" height="270"></canvas>
          <div class="w-canvas-hint">实时三维投影模拟（自动环绕视角 + 开合动画）</div>
        </div>
        <div class="w-code-panel">
          <div class="w-code-label">触发该现象的典型生成代码片段：</div>
          <pre id="w3d-code"></pre>
          <p class="w-explain" id="w3d-desc"></p>
        </div>
      </div>
    `;

    const pillsEl = document.getElementById("w3d-pills");
    const rateEl = document.getElementById("w3d-rate");
    const codeEl = document.getElementById("w3d-code");
    const descEl = document.getElementById("w3d-desc");
    const canvas = document.getElementById("w3d-canvas");
    const ctx = canvas.getContext("2d");

    function syncUI() {
      rateEl.textContent = cur.rate;
      codeEl.textContent = cur.code;
      descEl.textContent = cur.desc;
      Array.from(pillsEl.children).forEach((btn, idx) => {
        btn.classList.toggle("active", MODES_3D[idx].id === cur.id);
      });
    }

    MODES_3D.forEach((m) => {
      const b = document.createElement("button");
      b.className = "w-pill";
      b.textContent = m.label;
      b.onclick = () => { cur = m; syncUI(); };
      pillsEl.appendChild(b);
    });
    syncUI();

    function project(x, y, z, yaw) {
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const rx = x * cy - z * sy;
      const rz = x * sy + z * cy;
      const pitch = 0.46;
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      const py = y * cp - rz * sp;
      const pz = y * sp + rz * cp + 5.5;
      const scale = 250 / pz;
      return [220 + rx * scale, 182 - py * scale, pz];
    }

    function drawPoly(pts3d, yaw, fill, stroke, dashed) {
      const p2 = pts3d.map((p) => project(p[0], p[1], p[2], yaw));
      ctx.save();
      ctx.beginPath();
      p2.forEach((p, i) => (i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
      ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (dashed) ctx.setLineDash([5, 4]);
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.6; ctx.stroke(); }
      ctx.restore();
    }

    function rotX(p, ang) {
      const c = Math.cos(ang), s = Math.sin(ang);
      return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
    }

    function renderFrame() {
      t += 0.025;
      const yaw = -0.52 + Math.sin(t * 0.55) * 0.38;
      const openAng = 0.25 + (Math.sin(t * 1.4) * 0.5 + 0.5) * 0.72;
      ctx.clearRect(0, 0, 440, 270);
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, 440, 270);

      // Floor grid
      drawPoly([[-1.9, 0, -1.5], [1.9, 0, -1.5], [1.9, 0, 1.5], [-1.9, 0, 1.5]], yaw, "#e2e8f0", "#94a3b8");

      // Rug decal (Z-fighting demo vs clean offset)
      if (cur.id === "zfight") {
        for (let k = -5; k < 5; k++) {
          const x0 = k * 0.24, x1 = x0 + 0.24;
          const flicker = ((Math.floor(t * 9) + k) % 2 === 0) ? "#ef4444" : "#cbd5e1";
          drawPoly([[x0, 0, -0.9], [x1, 0, -0.9], [x1, 0, 0.9], [x0, 0, 0.9]], yaw, flicker, null);
        }
      } else {
        drawPoly([[-1.15, 0.01, -0.95], [1.15, 0.01, -0.95], [1.15, 0.01, 0.95], [-1.15, 0.01, 0.95]], yaw, "#dbeafe", "#60a5fa");
      }

      // Axes indicator
      const o = project(-1.65, 0.02, 1.25, yaw);
      const axY = project(-1.65, 0.85, 1.25, yaw);
      const axZ = project(-1.65, 0.02, 1.95, yaw);
      ctx.strokeStyle = "#16a34a"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(axY[0], axY[1]); ctx.stroke();
      ctx.fillStyle = "#15803d"; ctx.font = "bold 11px sans-serif"; ctx.fillText("+Y", axY[0] - 8, axY[1] - 4);
      ctx.strokeStyle = "#2563eb";
      ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(axZ[0], axZ[1]); ctx.stroke();
      ctx.fillStyle = "#1d4ed8"; ctx.fillText("+Z", axZ[0] + 3, axZ[1]);

      // Base chest dimensions: x in [-0.75, 0.75], y in [yBase, yBase+0.75], z in [-0.5, 0.5]
      const yBase = cur.id === "floating" ? 0.52 : 0.02;
      let bodyFaces = [
        { name: "back", pts: [[-0.75, yBase, -0.5], [0.75, yBase, -0.5], [0.75, yBase + 0.75, -0.5], [-0.75, yBase + 0.75, -0.5]], fill: "#b45309" },
        { name: "left", pts: [[-0.75, yBase, -0.5], [-0.75, yBase, 0.5], [-0.75, yBase + 0.75, 0.5], [-0.75, yBase + 0.75, -0.5]], fill: "#d97706" },
        { name: "right", pts: [[0.75, yBase, -0.5], [0.75, yBase, 0.5], [0.75, yBase + 0.75, 0.5], [0.75, yBase + 0.75, -0.5]], fill: "#d97706" },
        { name: "bottom", pts: [[-0.75, yBase, -0.5], [0.75, yBase, -0.5], [0.75, yBase, 0.5], [-0.75, yBase, 0.5]], fill: "#78350f" },
        { name: "front", pts: [[-0.75, yBase, 0.5], [0.75, yBase, 0.5], [0.75, yBase + 0.75, 0.5], [-0.75, yBase + 0.75, 0.5]], fill: "#f59e0b" }
      ];

      if (cur.id === "yup") {
        bodyFaces.forEach((f) => {
          f.pts = f.pts.map((p) => {
            const r = rotX([p[0], p[1], p[2]], Math.PI / 2);
            return [r[0], r[1] + 0.52, r[2] - 0.35];
          });
        });
      }

      bodyFaces.forEach((f) => {
        if (cur.id === "backface" && f.name === "front") {
          drawPoly(f.pts, yaw, "rgba(239,68,68,0.10)", "#dc2626", true);
        } else {
          drawPoly(f.pts, yaw, f.fill, "#78350f", false);
        }
      });

      // Lid geometry
      const lidLocal = [
        [[-0.77, 0, -0.5], [0.77, 0, -0.5], [0.77, 0.24, -0.5], [-0.77, 0.24, -0.5]],
        [[-0.77, 0.24, -0.5], [0.77, 0.24, -0.5], [0.77, 0.24, 0.5], [-0.77, 0.24, 0.5]],
        [[-0.77, 0, 0.5], [0.77, 0, 0.5], [0.77, 0.24, 0.5], [-0.77, 0.24, 0.5]]
      ];

      lidLocal.forEach((face) => {
        const trans = face.map((p) => {
          if (cur.id === "yup") {
            const r = rotX([p[0], p[1] + 0.77, p[2]], Math.PI / 2);
            return [r[0], r[1] + 0.52, r[2] - 0.35];
          }
          if (cur.id === "pivot") {
            const r = rotX([p[0], p[1] - 0.12, p[2]], -openAng);
            return [r[0], r[1] + yBase + 0.75, r[2]];
          }
          if (cur.id === "floating") {
            return [p[0], p[1] + yBase + 1.15, p[2]];
          }
          // Correct hinge around rear edge (0, yBase+0.75, -0.5)
          const r = rotX([p[0], p[1], p[2] + 0.5], -openAng);
          return [r[0], r[1] + yBase + 0.75, r[2] - 0.5];
        });
        const isErr = cur.id === "pivot" || cur.id === "floating" || cur.id === "yup";
        drawPoly(trans, yaw, isErr ? "rgba(252,165,165,0.88)" : "#fbbf24", isErr ? "#b91c1c" : "#92400e", false);
      });

      requestAnimationFrame(renderFrame);
    }
    requestAnimationFrame(renderFrame);
  }

  window.__init3DLab = init3DLab;

  const VERIFIERS = [
    {
      id: "pixel",
      name: "1. 逐像素差分 (Pixelmatch)",
      signal: "无头浏览器固定视口截图 I_gen(x,y) 与黄金参考图 I_ref(x,y) 逐坐标 RGB 相减",
      reps: "SWE-bench Multimodal (Chart.js / OpenLayers 69 道视觉回归题)",
      cases: {
        exact: { verdict: "✓ PASS (误差 0.0%)", tone: "ok", why: "与参考图逐像素完全重合，适合修补固定组件库的 2px 回归 Bug。" },
        valid_alt: { verdict: "✗ 误杀正确解 (假阴性，差异 64%)", tone: "bad", why: "候选实现仅仅多留了 8px 顶部间距或换了合法自建模型，后续整页像素全部错位标红。" },
        hack: { verdict: "✓ 拦截部分作弊 / ✗ 怕静态截图复刻", tone: "warn", why: "若只比对单帧静态截图，直接贴一张目标截图的 <img> 标签即可骗过纯像素比对。" }
      }
    },
    {
      id: "dom_icp",
      name: "2. 结构对齐 (DOM 块匹配 / 3D ICP+Chamfer)",
      signal: "2D 匈牙利匹配 DOM 包围盒；3D 网格采样万级点云经 ICP 刚体对齐算双向最近邻均值 CD(P,Q)",
      reps: "Design2Code, VISTA (2D) · CADPrompt, CAD-Coder, BlenderGym (3D)",
      cases: {
        exact: { verdict: "✓ PASS (IoU = 0.98 / CD = 0.17)", tone: "ok", why: "ICP 自动消除了整体平移旋转偏差，精确度量零件表面贴合度，平滑信号可直接训 GRPO。" },
        valid_alt: { verdict: "△ 2D 微偏可容忍 / ✗ 3D 创意造型误杀", tone: "warn", why: "DOM 块匹配能容忍 8px 偏移；但 3D 点云要求唯一标准网格，合法的不同风格破碎机外壳会产生巨大 Chamfer 距离。" },
        hack: { verdict: "✗ 无法检验物理交互与运动状态", tone: "bad", why: "静态网格或 DOM 摆对了就能拿高分，按钮点不动、滚筒冻住不转完全不会扣分。" }
      }
    },
    {
      id: "scene_probe",
      name: "3. 引擎原生场景图与物理探针",
      signal: "经 Part Mapper 或 manifest 绑定语义部件后，直接读内存 Scene Tree 测碰撞、支撑间隙、穿模体积与背面法线",
      reps: "3JSBench (696 项检查), GameDevBench (GDScript), Code4Scene, ModBench",
      cases: {
        exact: { verdict: "✓ PASS (100% 确定性零误差)", tone: "ok", why: "绕开屏幕像素噪点，直接在三维内存数据结构上验证连接、防穿模、库存守恒与跨进程读档。" },
        valid_alt: { verdict: "✓ 完美兼容异构合法实现", tone: "ok", why: "只要通过 manifest 或轻量 Mapper 绑定了部件角色，模型自由起类名、自建不同风格网格均可满分通过。" },
        hack: { verdict: "✓ 彻底封死静态假图 / △ 测不出贴图美观度", tone: "warn", why: "静态假图没有真实物理状态必得 0 分；但纯几何探针无法判断贴图画得像不像一把霰弹枪。" }
      }
    },
    {
      id: "optical",
      name: "4. 受控时间钟与屏幕光流 (Optical Flow)",
      signal: "注入外部时钟补丁测昼夜亮度 Luma / 四季色度差；固定相机连拍算变化像素比 f_i 与 RAFT 局部速度场 u(x,y)",
      reps: "WorldBench (时钟补丁+连拍门控), VisPhyWorld (RAFT), OpenGame-Bench",
      cases: {
        exact: { verdict: "✓ PASS (ΔLuma=71.3, f_i=38.4%)", tone: "ok", why: "无需唯一参考图即可物理实测昼夜变暗、秋季变橙、雨滴下落以及左右双滚筒切向光流方向相反。" },
        valid_alt: { verdict: "✓ 完美兼容任意合法美术风格", tone: "ok", why: "只测量物理光学变化量与运动方向关系，不限定具体像素长相。" },
        hack: { verdict: "✓ 一票否决「静态雨滴假图」(f_i = 0%)", tone: "ok", why: "WorldBench 中 VLM 把 0% 变化的静止画脑补成下雨，像素连拍门控直接测出 f_i=0.0% 当场拒给运动分。" }
      }
    },
    {
      id: "vlm_blind",
      name: "5. 单通道 VLM 裁判 vs. 盲测洗牌 CodeVQA",
      signal: "隐藏全部 UI 文字防剧透 → 打乱盲认身份 → 随机洗牌 k 次重选回答二值客观结构清单",
      reps: "ArtifactsBench (三帧清单), VCode (CodeVQA), BlenderGym (Verifier Scaling)",
      cases: {
        exact: { verdict: "✓ PASS (与人类专家一致率 90%–94%)", tone: "ok", why: "把主观审美打分拆成「双滚筒是否可见、左脚是否踩踏板」等客观二值问答，洗牌采样消除了位置偏见。" },
        valid_alt: { verdict: "✓ 跨框架、跨造型泛化能力最强", tone: "ok", why: "像人类评审一样理解不同几何拓扑下的相同语义部件。" },
        hack: { verdict: "✗ 单独使用会被「漂亮假壳 / 死代码」欺骗", tone: "bad", why: "若不与引擎状态和光流门控串联，只看几张截图仍会给无后台守恒逻辑的前端假动画打高分。" }
      }
    },
    {
      id: "state_inject",
      name: "6. 白盒运行期状态注入 + 双通道证伪 (SOTA)",
      signal: "提取规格霍尔三元组 {P_k} a_k {Q_k} → 直接向内存/存档注入前置态 s_k 并发短测 + 源码∧画面双通道合分",
      reps: "GameGen-Verifier (2026-05, 提速 16.6×), WorldBench, ModBench 混合架构",
      cases: {
        exact: { verdict: "✓ PASS (人类一致率 92.2%，秒级并发)", tone: "ok", why: "跳过半小时冗长打怪铺垫，直接注入满电超载或半程存档状态执行 3 步断言，兼顾深层覆盖与 RL 高吞吐。" },
        valid_alt: { verdict: "✓ 完整支持异构架构与自由三维建模", tone: "ok", why: "通过参数映射契约注入等价前置态，只考核外部可观测后置行为与受控多视角问答。" },
        hack: { verdict: "✓ 同时封死「死代码未上屏」与「静态假壳」", tone: "ok", why: "源码/引擎状态 c_i 与实机画面/运动门控 v_i·m_i 缺一不可，人为删掉渲染挂载的变异体必丢分。" }
      }
    }
  ];

  function initVerifierSandbox() {
    const root = document.getElementById("widget-verifier-sandbox");
    if (!root) return;
    let vIdx = 5;
    let caseKey = "hack";

    root.innerHTML = `
      <div class="w-head">
        <div>
          <span class="w-badge">交互式图解 2 · 六类 Verifier 判分机制与防作弊压力测试</span>
          <h4>先选左侧「验证器设置方案」，再切换右上角「被测提交类型」观察判分表现：</h4>
        </div>
        <div class="w-case-tabs" id="wv-cases">
          <button data-k="exact">标准正确实现</button>
          <button data-k="valid_alt">合法异构实现 (+8px/自建模)</button>
          <button data-k="hack" class="active">投机假实现 (静态图/死代码)</button>
        </div>
      </div>
      <div class="wv-layout">
        <div class="wv-list" id="wv-list"></div>
        <div class="wv-detail" id="wv-detail"></div>
      </div>
    `;

    const listEl = document.getElementById("wv-list");
    const detailEl = document.getElementById("wv-detail");
    const casesEl = document.getElementById("wv-cases");

    function render() {
      const v = VERIFIERS[vIdx];
      const c = v.cases[caseKey];
      Array.from(listEl.children).forEach((el, i) => el.classList.toggle("active", i === vIdx));
      Array.from(casesEl.children).forEach((el) => el.classList.toggle("active", el.dataset.k === caseKey));

      detailEl.innerHTML = `
        <div class="wv-meta-label">观测信号与数学机制</div>
        <div class="wv-signal">${v.signal}</div>
        <div class="wv-meta-label">采用该方案的代表性 Benchmark</div>
        <div class="wv-reps">${v.reps}</div>
        <div class="wv-verdict wv-${c.tone}">
          <div class="wv-vtitle">当前提交下的判分结果：${c.verdict}</div>
          <div class="wv-vwhy">${c.why}</div>
        </div>
      `;
    }

    VERIFIERS.forEach((v, i) => {
      const btn = document.createElement("button");
      btn.className = "wv-item";
      btn.textContent = v.name;
      btn.onclick = () => { vIdx = i; render(); };
      listEl.appendChild(btn);
    });

    Array.from(casesEl.children).forEach((btn) => {
      btn.onclick = () => { caseKey = btn.dataset.k; render(); };
    });
    render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    init3DLab();
    initVerifierSandbox();
  });
})();
