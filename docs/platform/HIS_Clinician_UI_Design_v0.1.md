# 医生工作台（HIS 界面 + Agent 融合）设计 v0.1

> 文档状态：界面设计草案
> 上游依据：`Hospital_Agent_Platform_Unified_Design_v0.2.md` §11「医生界面与智能体界面」、§25「Clinical UI 设计原则」、§27「Agent UI Kit」，以及 `DSH_Medical_Platform_Implementation_v0.1.md` 的 `ctx.hospital` 接缝。
> 目标：给医生一个**传统 HIS 形态的结构化工作台**，把 Agent 作为「增强」缝进既有工作流，而不是把医生赶进聊天框。
> 语言约定：正文中文；DSH 专有名词（slot / projection / Remote API / ConversationNode）保留英文。

---

# 1. 一句话结论

**医生用熟悉的 HIS 界面工作（患者列表、病区、检验、病历、任务），Agent 在这些页面上以「摘要条 + 证据芯片 + 待确认项 + 审批卡」的形式出现；医生点击结构化页面的同时，也能用自然语言让 Agent 干活，两者共享同一个 `ctx.hospital` 后台处理器。**

不是「聊天优先」（Chat-first），而是 **Clinical Workspace + Agent Augmentation**。

---

# 2. 设计原则

1. **传统 HIS 优先**：主导航是「今日工作 / 病区 / 我的患者 / 我的任务」，不是「Ask AI anything」。
2. **Agent 渗透原工作流**：检验页里血钾旁有「[Agent 复核中]」；病历旁有「[2 处不一致]」；出院页有 Agent 核对清单——Agent 不只在「Agent 页面」里。
3. **同一后台**：医生界面与 Agent 命令都调 `ctx.hospital`，不建两套后端、两套权限、两套审计。
4. **证据优先**：Agent 的每个临床结论都能点开 `EvidenceChip` 回溯到来源（LIS/记录号/映射版本）。
5. **人工把关是独立事实**：批准一次工具调用 ≠ 医生确认了模型结论；「待确认项」是显式的工作流节点。
6. **结构化页面承载固定输入，对话承载自由探索**（设计 doc §7.3）。

---

# 3. 信息架构（传统 HIS 导航）

```
┌─────────────┬────────────────────────────────────────┬────────────────────┐
│ 导航(左)     │ 工作区(中)                               │ 上下文/Agent(右)    │
├─────────────┼────────────────────────────────────────┼────────────────────┤
│ 今日工作     │  病区 3 · 32 床                            │  患者全景           │
│ ▸ 待确认 (3) │  ┌──────────────────────────────────┐    │  ─ 摘要            │
│ ▸ 追踪中 (5) │  │ 患者列表                         │    │  ─ 时间线          │
│             │  │ 张伟 68 心内 · [K 6.7↑ 危急]      │    │  ─ 检验            │
│ 病区         │  │ 李娜 54 呼吸 · [稳定]            │    │  ─ 用药            │
│  3 病区      │  │ 王强 41 骨科 · [术后第2天]        │    │  ─ 任务            │
│  2 病区      │  └──────────────────────────────────┘    │  ─ Agent 摘要      │
│             │                                          │  ─ 证据           │
│ 我的患者     │  选中张伟 → 患者 360                       │  ─ 待确认          │
│             │  ┌──────────────────────────────────┐    │                    │
│ 我的任务     │  │ 检验 | 影像 | 病历 | 用药 | 任务   │    │  AgentBrief        │
│             │  │                                  │    │  ┌──────────────┐  │
│ Agent       │  │ 血钾 6.7 ↑↑ [Agent 复核中]        │    │  │ 危急值处置     │  │
│  待确认      │  │ 肌酐 132    [证据]               │    │  │ 证据 3 · 待确认 │  │
│  追踪中      │  └──────────────────────────────────┘    │  └──────────────┘  │
└─────────────┴────────────────────────────────────────┴────────────────────┘
         └ 底部：Agent 输入条（自然语言，可引用当前患者/当前检验）
```

三个竖栏正好对应 DSH 客户端已有的三栏 `AppFrame`：

| HIS 语义 | DSH slot | 内容 |
|---|---|---|
| 导航 | `sidebar` | 今日工作 / 病区 / 我的患者 / 我的任务 / Agent |
| 工作区 | `conversation` | 患者列表 → 患者 360（检验/影像/病历/用药/任务） |
| 上下文/Agent | `details` | 患者摘要、时间线、AgentBrief、证据、待确认项 |
| 未选中会话 | `conversation.empty` | 「今日工作」仪表盘 |

---

# 4. 映射到 DSH 的 client 插件机制

医生工作台落成一个 **dual-half client 插件** `@deepseek-ai/dsh-client-ui-hospital`（照 `ui-goal`/`ui-sidebar` 的结构）：

| DSH 机制 | 用途 | 医院内容 |
|---|---|---|
| `dsh.client` 声明 + `exports["./client"]` | 浏览器半包被 `window.__DSH_BOOT__` 注入 | 插件本体 |
| slot `sidebar` 的子槽 | 导航候选项 | 今日工作 / 病区 / 我的患者 / 任务 / Agent |
| slot `conversation` / `conversation.empty` | 工作区主面 | 患者列表、患者 360、今日工作仪表盘 |
| slot `details` | 右侧上下文 | 患者摘要 / 时间线 / AgentBrief / 证据 |
| `conversation.input.dock` | 底部输入条上方 | Agent 输入条（可引用当前患者） |
| `conversation.chat.node` + `ConversationNodeDefinition` | 证据/任务/审批卡片 | `EvidenceChip`、危急值卡、`ApprovalGate`、任务卡 |
| session projection（`useProjection`） | 会话派生的只读视图 | 患者摘要、Agent 运行状态、待确认清单 |
| Remote API（`ctx.remote.hospital.*`，Typert） | 医生界面调后台 | 患者查询、患者全景、检验查询、任务动作 |
| `shell.overlay` | 演示/信息科浮层 | Agent Theatre 三栏 |
| `ui-theme` token | 医院品牌/主题 | 名称、色彩、受控术语 |

关键判断：**DSH 的三栏 AppFrame + slot + projection + Remote API 已经提供了传统 HIS 界面所需的全部机制**，不需要重写 shell。

---

# 5. 数据流：医生界面与 Agent 共享同一后台

这是设计 doc §6.1 的落地，也是「不是两套后端」的核心：

```text
医生界面（结构化页面）
    │ 通过 ctx.remote.hospital.*（Typert RPC，类型安全）
    ▼
ctx.hospital（Service Definition + 适配器注册表）   ← 唯一后台处理器
    ▲
    │ 通过 HACT 工具（hospital_patient_snapshot 等）
Agent（对话/工具调用）
```

- **查询**（患者列表、患者全景、检验）：医生界面走 `ctx.remote.hospital`，与 Agent 的 `hospital_patient_snapshot` 工具调**同一个** `ctx.hospital.snapshot()`。
- **动作**（创建任务、确认、关闭）：两者都走 `ctx.hospital.act()`，共享前置条件、风险级别、`ctx.approval` 与审计。
- **权限**：同一套 `tools/pre-execute` guard + `ctx.approval`，医生界面按钮与 Agent 工具调用落在同一条授权链上。
- **大数据**（DICOM/PDF）：两边都拿到 `ResourceRef` + 元数据 + 有界摘要，内容走产物/数据流通道。

因此，医生在页面上点「血钾」看到的证据，与 Agent 在对话里引用的证据，是**同一个来源记录**（`LIS/LAB8842821` + 映射版本）。

---

# 6. 组件清单（Agent UI Kit 的落地）

设计 doc §27 的 Agent UI Kit 落成 client 组件（React + CSS Modules，用 `--dsw-*` 语义 token）：

| 组件 | 挂载点 | 职责 |
|---|---|---|
| `PatientList` | `conversation` | 病区/我的患者列表，危急值/变化角标 |
| `Patient360` | `conversation` | 检验/影像/病历/用药/任务标签页 |
| `AgentBrief` | `details` / 行内 | 患者当前摘要 + 重点变化 + 分级 |
| `EvidenceChip` | 检验表、Agent 文本 | 可点开的来源追踪（sourceSystem/sourceRecordId/mappingVersion） |
| `SourceTrace` | `EvidenceChip` 展开 | 三层溯源：平台值 → 原始值 → 适配器版本 |
| `AgentStatus` | 行内角标 | `[Agent 复核中]` / `[3 处不一致]` |
| `ApprovalGate` | `conversation.chat.node` | 待批准动作 + 批准/拒绝 |
| `AgentTask` | `details` / 任务页 | 危急值/出院/会诊任务的确认、升级、关闭 |
| `AgentRunTimeline` | `details` | 一次运行的 plan/tool-calls/evidence/gates |
| `EvaluatorResult` | 评测模式 | 场景必须项/禁止项/结果 |

这些组件是**自研差异化资产**；表格、表单等基础件复用 `ui-primitives`。

---

# 7. 三种视图

沿用设计 doc §26，但在 DSH 里用「同一插件、不同 slot 组合」表达，而非独立路由堆：

| 视图 | 面向 | slot 组合 | 隐藏 |
|---|---|---|---|
| 医生工作台 | 临床医生 | `sidebar`+`conversation`+`details`（默认） | prompt/token/原始工具 JSON |
| Agent Theatre | 演示/信息科/院长 | `shell.overlay` 浮层三栏 | —（展示医院世界→标准层→Agent 世界） |
| 评测/科研 | 研发/医学院 | 独立评测面（场景/轨迹/验证器） | 临床工作流 |

正式发行物在构建时排除研发/评测入口；现场支持版是独立且明显标识的发行物。

---

# 8. 实现分阶段

| 阶段 | DSH 落地 | 出口 |
|---|---|---|
| 1 患者列表 + 患者 360 | client 插件：`PatientList`/`Patient360` 挂 `conversation`，数据走 `ctx.remote.hospital`（Remote API 暴露 `listPatients`/`snapshot`） | 能看患者 |
| 2 AgentBrief + 证据 | host 注册 projection（患者摘要、Agent 运行），client `EvidenceChip` 渲染来源 | 结论可溯源 |
| 3 检验/任务结构化页 | 检验表 + 任务列表，角标 `AgentStatus` | 传统 HIS 形态完整 |
| 4 人工把关 | `ApprovalGate` 接 `ctx.approval`，任务确认/升级/关闭走 `ctx.hospital.act` | 医生可确认 |
| 5 Agent 输入条 + 引用上下文 | `conversation.input.dock` 输入条，可 @当前患者 / 引用当前检验 | 自然语言增强 |
| 6 品牌主题 | `ui-theme-hospital` 独立主题包（token + 受控术语） | 可换医院 |
| 7 Agent Theatre | `shell.overlay` 三栏浮层 | 演示 |

首版切片建议复用设计 doc §14：**牙科 CT**（结构化影像页 + Agent 建议 + 牙医确认）或**危急值**（事件 → Agent 摘要 → 证据 → 待确认任务 → 医生确认 → 关闭）。

---

# 9. 首版完成标准（UI 侧）

- 医生能从患者列表点进患者 360，看到检验/用药/任务，全程**不需要终端**；
- 每个检验值可点开 `EvidenceChip` 看到来源与版本；
- Agent 摘要以 `AgentBrief` 形式出现在患者页，不在独立「AI 页」里；
- 高风险动作（如写回）在 `ApprovalGate` 前不生效；
- 医生界面与 Agent 工具调用共享同一 `ctx.hospital`（同一处理器、同一权限、同一审计）；
- 同一界面换一套医院适配器后仍可用（`ctx.hospital` 换 provider，UI 不变）。

---

# 10. 与既有产物的衔接

- 教学原型 `apps/Hospital_Agent_Academy_v0.2/` 里的 `his.html`/`emr.html`/`lis.html`/`hact.html`/`agent-runtime.html` 是「长什么样」的可交互样本；本设计把这些页面的语义映射成 DSH 的 slot / projection / ConversationNode。
- 已在 `packages/hospital/hospital` 实现的 `ctx.hospital` + 3 个 HACT 工具，是本 UI 的数据底座：医生界面走 Remote API 调它，Agent 走工具调它。
- 品牌/主题、权限、审计仍以 `Hospital_Agent_Platform_Unified_Design_v0.2.md` 为准。
