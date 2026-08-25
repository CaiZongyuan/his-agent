# 在 DSH 中实现医疗平台 DSH — 实现设计 v0.1

> 文档状态：实现映射设计草案
> 上游依据：`Hospital_Agent_Platform_Unified_Design_v0.2.md`（业务架构）与 DeepSeek Harness 源码（`/home/caii/agents/deepseek-harness`）
> 目标：把「医院智能体产品」的五层架构与五类扩展，逐条落到 DSH 现有的 Cordis 插件、能力接缝、profile/bundle、client-plugin 与 slot 机制上，形成可实施、可验证的落地路径。
> 语言约定：正文优先中文；DSH 专有名词（profile、bundle、seam、slot、Cordis）保留英文。

---

# 1. 一句话结论

**医疗平台 DSH 不是给 DSH 换皮肤，也不是写一堆孤立插件，而是在 DSH 上新增一个「医院能力接缝」（`ctx.hospital`）+ 一个独立的医院 profile/bundle + 一组 client 插件，让医院数据、命令、事件和能力经过受控投影后，进入 DSH 已有的运行 / 工具 / 审批 / 产物 / 审计 / 评测链。**

DSH 的架构原则「everything is a plugin」（`docs/architecture.md`）恰好与医院设计里「不让产品模块绕过平台内核」的边界一致：新增的一切都挂在既有扩展点上，**不改 agent-loop、不改内核**。

---

# 2. 对齐：DSH 的插件心智模型

读源码后确认的 DSH 事实，也是本设计的全部立足点：

| DSH 事实 | 出处 | 对本设计的含义 |
|---|---|---|
| 一切都是 Cordis 插件，注册即 effect，可卸载 | `docs/architecture.md` §Cordis | 医疗能力作为插件挂载，不侵入内核 |
| **profile / bundle** 是构建期装配层，`package.json` 里 `dsh.profile` / `dsh.bundle` 声明，`cordis.patch.yml` 是 patch 层 | `packages/bundle/README.md`、`packages/boot/app-boot` | 这就是「产品定义 / 产品外壳」的 DSH 承载 |
| **能力接缝 = Service Definition / Service Provider / Consumer 三角色** | `docs/capability-seams.md`、`docs/subsystems/web.md` | HACT 连接器层照抄 `ctx.web`/`ctx.shell` 的形态 |
| **工具**：`ctx.tools.register()` + `defineTool`，schema 自动进 prompt | `docs/cookbook/adding-a-tool.md` | HACT 命令 = 工具 Consumer |
| **技能**：`ctx.skills` provider registry + `skill` 工具 | `docs/subsystems/skills.md` | 智能体技能 = skill provider |
| **per-session 组合**：agent preset（`agent.cordis.yml`） | `packages/preset/README.md` | 按病区/技能给单个会话不同能力集 |
| **持久会话事件**：`SessionEventMap` 声明合并，可重放 | `docs/architecture.md` §Session log | 医院事件 / 证据 / AgentRun 记录 |
| **审批**：`ctx.approval.request` + `tools/pre-execute` 瀑布返回 `ask`，闭集 `ApprovalOutcome` 默认拒 | `docs/subsystems/approval.md` | 人工把关 / 人工批准 |
| **client 插件**：`dsh.client` 声明 + `/client` 导出 + `window.__DSH_BOOT__` | `docs/subsystems/client-modules.md` | UI 通过插件系统注入 |
| **slot**：`root/sidebar/conversation/details/conversation.empty/shell.overlay` | `packages/client/ui-layout`、`ui-slots` | 医生工作台 / 患者面板 / Agent Theatre |
| **ConversationNode**：`ConversationNodeDefinition` + 键控渲染器 | `docs/cookbook/adding-a-conversation-node.md` | 证据卡 / 危急值卡 / 任务卡 |
| **主题**：`ui-theme` 拥有 `--dsw-*` token 与语义别名 | `docs/web-styling.md` | 品牌与主题 |

关键判断：**医院设计里反复强调的「五类扩展必须分开」「不让产品模块直连医院系统」「产品定义是类型校验的构建期配置」，DSH 都已经有对应的第一公民机制**，不需要新造一套框架。

---

# 3. 五层架构 → DSH 映射

医院设计的五层，落到 DSH 上：

| 医院设计层 | DSH 承载 | 是否新增 |
|---|---|---|
| 医院现有系统（HIS/EMR/LIS/PACS/设备） | 外部系统；首期由 HospitalSim mock 适配器模拟 | 外部 |
| 医院接入层（连接器/身份/映射/来源追踪） | `ctx.hospital` 接缝的 **Service Provider（适配器）** | 新增 |
| 医院领域层（HACM/HACT/事件/HACP） | `dsh-hospital-model`（类型）+ `dsh-tool-hospital`（Consumer）+ 会话事件 | 新增 |
| 通用智能体平台内核（运行/审批/产物/审计/评测） | DSH core（`session/agent-loop/tools/approval/interaction/...`） | **不改** |
| 医院智能体产品（UI/模块/品牌） | 医院 profile + bundle + client 插件 + 主题 | 新增 |

图形化：

```text
医院现有系统 (HIS/EMR/LIS/PACS/Devices)         ← HospitalSim mock 或真实适配器
        │ 适配器 = ctx.hospital Service Provider
        ▼
ctx.hospital (Service Definition)                ← dsh-hospital
        │ Consumer = dsh-tool-hospital (HACT 工具)
        ▼
DSH 内核 (session → agent-loop → tools → approval → artifacts → audit → eval)
        │
        ▼
医院产品 (profile/bundle + client 插件 + 主题)
```

---

# 4. 五类扩展 → DSH 机制映射

医院设计禁止「把所有扩展都叫插件、共用一个启用开关」。DSH 天然具备对应分层：

| 医院设计类型 | DSH 机制 | 加入时机 | 示例 |
|---|---|---|---|
| **产品模块**（业务页面/领域对象/工作流） | dual-half 包：host 半注册领域服务与工具，client 半注册 slot/ConversationNode | 构建时（进 bundle） | 牙科 CT 辅助检查 |
| **连接器**（连医院系统/认证/查询/动作/事件） | `ctx.hospital` 的 Service Provider（适配器） | 部署或运行时 | 某院 PACS 适配器 |
| **工具插件**（受审可执行命令） | `ctx.tools.register()` | 运行时 | 影像处理命令行工具 |
| **智能体技能**（如何完成某类工作） | `ctx.skills` provider + `skill` 工具 | 运行时 | 危急值处置技能 |
| **品牌与主题**（名称/标志/色彩/字体/术语） | `ui-theme` token 包 + 独立主题插件 | 部署时 | 某院品牌主题 |

「功能状态」三段（未打包/已停用/仅隐藏）在 DSH 上的落点：

- **未打包**：不进入医院 bundle 的 `cordis.patch.yml` 行，`verify-cordis-config` / `verify-config-catalog` 保证不存在即不可达；
- **已停用**：cordis.yml 行的 `disabled`，导航、直达 URL、后台命令、`ctx.tools` 可见集一并失效；
- **仅隐藏**：只改 UI 可见性，**不是权限**——权限走 `ctx.tools.restrict()` + `tools/pre-execute` guard + approval。

---

# 5. 核心：新增 `ctx.hospital` 能力接缝

这是整个落地里唯一的「新接缝」，照抄 `ctx.web` 的三角色形态（`packages/web/web` 是最佳模板）。

## 5.1 三角色

| 角色 | 包 | 职责 |
|---|---|---|
| Service Definition | `@deepseek-ai/dsh-hospital` | `ctx.hospital`：`HospitalService` 接口、适配器注册表、选择策略、请求/结果词汇、`HospitalError` 码表、能力协商 |
| Service Provider | `dsh-hospital-adapter-*` / `dsh-hospitalsim-*` | 把某来源系统的数据/动作/事件投影成稳定接口；只转换与校验，不做临床推理 |
| Consumer | `dsh-tool-hospital` | 唯一拥有面向模型的名字、描述、prompt 引导、JSON schema、渲染意图 |

适配器注册 **capability，不注册工具**；工具 Consumer 是唯一「面向模型面」的拥有者——这与 `dsh-web` / `dsh-tool-web` 的分工完全一致，天然满足「医生界面客户端与智能体命令进入同一处理器」的要求（两边都调 `ctx.hospital`，不建两套后端）。

## 5.2 Service API（示意）

```ts
// Service Definition 侧（dsh-hospital）
ctx.hospital.registerAdapter(adapter)            // 返回 disposer
ctx.hospital.capabilities()                      // HACP：当前医院/连接实际能力
ctx.hospital.query(resource, request, signal?)   // HACT 读（资源/查询）
ctx.hospital.act(action, request, signal?)       // HACT 写（低风险动作，需审批）
ctx.hospital.onEvent(listener)                   // 医院事件入口
```

选择策略同 `ctx.web`：配置的适配器 id 未注册/不可用/多义时抛结构化 `HospitalError`；能力不足默认失败而非静默降级。

---

# 6. 数据模型 HACM → `dsh-hospital-model`

HACM 是「面向智能体的临床数据投影」，不是新医疗标准。落成**纯类型 + 边界校验包**，不承载运行时事实（运行事实属于会话事件）：

- 品牌 id：`PatientId` / `EncounterId` / `ObservationId` / `TaskId`（`Branded<B>`，同 DSH 的「不透明跨边界 id」约定）；
- 三层表示：通用资源外壳（身份/来源/版本/观察时间/敏感等级/能力）+ 领域数据 + 带命名空间的来源扩展；
- **来源追踪为强制字段**：`provenance { sourceSystem, sourceRecordId, adapterVersion, mappingVersion, readAt }`；
- 时间语义显式：`clinicalTime / recordedAt / updatedAt / effectivePeriod / performedPeriod`；
- 保留 `sourceCode / sourceDisplay / sourceValue / sourceUnit`（normalize 但不摧毁原始真相）；
- 派生视图 `PatientSnapshot` / `Timeline` 标注为 derived、必须可回溯来源；
- 校验只发生在 parser/config、模型/工具 JSON、worker、进程、wire 边界（DSH 的「信任 TS 静态边界」约定）。

包形态：`dsh-hospital-model`（类型 + 边界校验器），被 `dsh-hospital`、`dsh-tool-hospital`、`dsh-hospitalsim-*`、client 插件共同依赖。

---

# 7. 命令 HACT → `dsh-tool-hospital`

HACT 是「智能体能做什么」，落成 Consumer 包注册的模型工具（英文稳定 id，中文展示名）：

```text
patient.resolve      patient.get        patient.snapshot
timeline.query
labs.query           medications.list   conditions.list   observations.query
documents.search     documents.get
reports.list         imaging.list       imaging.get
task.create          task.acknowledge   task.close
capabilities.get
```

关键约束（对齐医院设计）：

- 智能体**不接触**医院私有 URL / 数据库表 / 厂商命令，只走 `ctx.hospital`；
- `task.create` 等低风险写动作走 `ctx.approval`（`tools/pre-execute` 返回 `ask`）；
- 高风险动作（`medication.order` / `procedure.order` / 写回核心病历）首期**不注册工具**，只暴露 `action.prepare` / `action.validate` / `action.request_approval` 的「准备」面；
- 大数据（DICOM / PDF / 长病历）**不进入工具输出与默认模型上下文**：工具返回受控 `ResourceRef` + 元数据 + 有界摘要 + 可用处理能力，内容读取走产物/数据流通道。

---

# 8. 事件与长程运行

医院事件（`observation.finalized` / `patient.admitted` / `task.created` / `device.alert`）落两处：

1. **持久会话事件**：扩展 `SessionEventMap`，让事件可重放、可回溯、可驱动 UI（满足 DSH「模型可见 ⟺ 已记录」不变式）；
2. **触发**：适配器把来源事件翻译后 `agent.inject()`（忙时注入上下文）或 `followup()`（闲时开启新 turn），复用 DSH 的 inbox/驱动，不自造调度总线。

长程临床工作流复用 DSH 既有第一公民能力：

| 医院需求 | DSH 能力 |
|---|---|
| 危急值超时升级 / 今日早班触发 | `schedule`（durable 提醒，会话内回灌）或 `jobs`（后台任务） |
| 同一目标跨多轮持续（出院准备） | `goal`（same-session rounds） |
| 多步骤结构化子任务（会诊/质控） | `workflow`（结构化子 agent + 输出 schema） |

医院设计里的 **AgentRun 记录**，DSH 的 session + agent-loop + telemetry 已覆盖「为什么启动/读了什么/调了什么/用了什么证据/等了什么审批/最后如何」；只需把「临床证据引用」「人工确认结果」作为额外会话事件追加，而不是另建运行表。

---

# 9. 授权与安全

医院设计 §6.4 的「最终授权 = 多事实求交」落到 DSH 的四个独立轴：

| 医院设计事实 | DSH 机制 |
|---|---|
| 连接器能力与授权范围 | `ctx.hospital.capabilities()` + 适配器自身可用性 |
| 产品与部署策略 / 模块数据授权 | bundle 装配 + `ctx.tools.restrict()` |
| 智能体权限配置 | per-session preset + `tools/pre-execute` guard |
| 运行环境能力 / 数据敏感等级 / 模型方规则 | `ctx.sandbox` + `tools/pre-execute` 瀑布（默认拒） |
| 本次高风险动作人工批准 | `ctx.approval.request`（`ApprovalOutcome` 闭集，缺省拒） |

两条红线直接沿用 DSH 语义：

- **数据进入模型前拒绝优先**：在 `agent/pre-step` / `tools/pre-execute` 上做「敏感等级 ∩ 来源规则 ∩ 产品规则 ∩ 模块声明 ∩ 运行能力 ∩ 模型方」求交，任一事实缺失即拒；首期只放行合成/脱敏/最小化派生数据；
- **日志不是原文备份**：正式日志只记人员/模块/运行 id + 不透明资源引用 + 来源版本 + 授权与批准结果；患者正文、影像、完整模型响应按数据分类另行保存，不进默认日志。

连接密码、短时最小权限凭证绝不下发浏览器/命令参数/运行轨迹/模型上下文——这与 DSH 的 credential 引用能力（`credentials`）对齐。

---

# 10. 产品装配 → profile / bundle / theme / preset

「医院智能体产品是独立发行物，不是隐藏菜单形成的模式」，DSH 上这样表达：

```text
dsh-hospital-profile          (package.json 的 dsh.profile)
  ├── dsh-base                (通用内核 bundle，复用)
  ├── dsh-web-app             (浏览器外壳，复用)
  └── dsh-hospital-app        (新增：医院 patch 层 bundle)
        ├── dsh-hospital            (ctx.hospital Service Definition)
        ├── dsh-tool-hospital       (HACT Consumer)
        ├── dsh-hospital-model      (HACM 类型)
        ├── dsh-hospitalsim-*       (模拟医院适配器，可替换为真实院适配器)
        ├── dsh-hospital-skills     (危急值/出院/病区重点等 skill 包)
        └── dsh-client-ui-hospital-* (client 插件 + 医院主题)
```

- **产品定义** = 医院 profile 的 bundle 清单 + `cordis.patch.yml` 行集合，经 `verify-cordis-config` / `verify-config-catalog` 类型校验——正是医院设计要的「构建期类型校验配置」，而非散落环境变量；
- **牙科/医美/科研组合** = 同一 profile 模板叠不同 bundle 子集（不同连接器、工具、技能、主题），构建时选定，不是运行时开关；
- **品牌与主题** = 独立 `dsh-client-ui-theme-hospital` 包，只改 `--dsw-*` 语义别名与受控术语，**不改变路由/权限/加载任意代码**；
- **按病区/技能的能力集** = agent preset（`agent.cordis.yml`），给单个会话装不同工具集，而不污染进程全局。

---

# 11. UI → client 插件 + slot + ConversationNode

「医生不需要终端，智能体不应该点击医生界面」。DSH 的 client-plugin 系统正好同时服务两个平面：

## 11.1 医生工作台（结构化）

复用 shell 已有 slot（`sidebar` / `details` / `root` / `conversation.empty`），医院 client 插件注册：

| slot | 医院内容 |
|---|---|
| `sidebar` | 今日工作 / 病区 / 我的患者 / 我的任务 / Agent（待确认、追踪中） |
| `details` | 患者 360：时间线 / 检验 / 影像 / 病历 / 用药 / 任务 / 证据 |
| `conversation.empty` | 患者全景 / 待确认事项（替代「Ask AI anything」主界面） |

## 11.2 Agent 执行界面（对话 + 证据）

- HACT 工具调用 = DSH 内建工具卡（`ui-tool`），无需新造终端；
- 证据/危急值/任务/人工确认 = 新增 `ConversationNodeDefinition`，键控渲染成证据卡、危急值卡、任务卡、ApprovalGate，从会话事件重放（见 `docs/cookbook/adding-a-conversation-node.md`）；
- Agent Theatre（演示/信息科） = `shell.overlay` 浮层（同 `ui-cordis` 先例），三栏展示「医院世界 → 标准层 → Agent 世界」。

## 11.3 核心产品资产

医院设计 §27 的 Agent UI Kit 落成 client 包 `dsh-client-ui-hospital`：`AgentBrief / EvidenceChip / SourceTrace / ApprovalGate / AgentRunTimeline / ToolCallInspector / EvaluatorResult`——这些是自研差异化 UI，作为 client 插件挂进 slot 与 ConversationNode。

---

# 12. HospitalSim 与验证器

模拟医院 = 一组 **mock 适配器（Service Provider）**，故意暴露异构接口（HIS 用 REST+SQL、EMR 用 SOAP/XML、LIS 用旧式 REST/DB、PACS 用 DICOMweb、护理用 DB view、设备用事件流），但智能体只能看到统一的 `ctx.hospital` 契约——以此证明接入层的价值。

- 金标准患者（20–50）/ 背景人群（2k–10k）/ 压力人群（100k+）三层数据，先定义潜在临床状态与照护路径，再投影出相互一致的检验/文书/用药/任务/事件；
- **场景与验证器**：复用 DSH `workflow`（结构化子 agent + 输出 schema）或新增轻量 verifier 接缝；每个 skill 包同时带 `scenarios/` 与 `evaluators/`（必须项/禁止项/结果标准）；
- 生产与模拟跑**同一份 skill 代码、命令接口、验证逻辑**，差异只在数据来源、连接实例、授权策略。

---

# 13. 新增包与目录布局

```text
packages/
  hospital/
    hospital-model/        # HACM 类型 + 边界校验器 (纯类型)
    hospital/              # ctx.hospital Service Definition (三角色之定义)
    tool-hospital/         # HACT Consumer (模型工具)
    hospital-events/       # 事件翻译 → 会话事件 + inject/followup
    hospital-skills/       # 危急值/出院/病区重点 skill 包 (ctx.skills provider)
    hospitalsim/           # 模拟医院数据引擎 + mock HIS/EMR/LIS/PACS 适配器
  client/
    ui-hospital/           # AgentBrief/EvidenceChip/ApprovalGate/... (client 插件)
    ui-theme-hospital/     # 医院品牌与主题 (ui-theme token)
apps/
  hospital-app/            # 医院 bundle (cordis.patch.yml) + profile 声明
```

命名遵循 DSH 约定（`@deepseek-ai/dsh-hospital-*`），每组是一个「能力接缝」的三角色完整拆分，不搞「一个插件包通吃」。

---

# 14. 分阶段实施路线（对齐医院设计 §15）

| 阶段 | DSH 落地动作 | 出口 |
|---|---|---|
| 0 冻结决策 | 固化本文术语与边界，`hospital-model` 类型定稿 | 类型契约 |
| 1 让产品先消费「产品定义」 | 建 `dsh-hospital-app` bundle + profile，去掉硬编码名称/标志（走 theme） | 可 `dsh --profile hospital --dump-config` |
| 2 产品外壳与功能策略 | 未打包/已停用/仅隐藏三态，统一约束导航/直达 URL/后台命令/工具可见集 | 三态一致 |
| 3 主题与最小模块接口 | `ui-theme-hospital` + 把一个现有功能改造成模块，再对齐牙科 CT 需要 | 主题 + 模块接口 |
| 4 后台模块登记与数据生命周期 | 命名空间后台功能 + 模块数据迁移 + 停用/卸载/导出/保留规则 | 模块生命周期 |
| 5 医院连接与标准数据接口 | 冻结 `ctx.hospital` 资源/查询/动作/事件结构 + 来源/版本/新鲜度/敏感级/能力 | 接缝稳定 |
| 6 统一智能体命令面 | `dsh-tool-hospital` 与医生界面客户端同调 `ctx.hospital`；大数据走资源引用 | 双平面同后端 |
| 7 医院产品与牙科 CT 闭环 | 独立医院发行物 + 牙科 CT 端到端（合成/脱敏 DICOM） | 第一条闭环 |
| 8 临床流程与模拟医院 | `hospitalsim` + 危急值/病区重点两个 skill，同一 skill 在两个 mock 适配器上通过 | 第二条闭环 |
| 9 稳定与交付 | 版本兼容矩阵 + 每个发行物的物料清单（BOM）+ 删除单场景入口 | 可交付 |

---

# 15. 第一版完成标准（DSH 版）

- 医院产品是独立 profile/bundle 发行物，Bio Discovery X 与医院产品**都**消费「产品定义」，无 `if product == hospital` 散落判断；
- `ctx.hospital` 接缝三角色完整（Service Definition / 至少两个适配器 Provider / 一个 Consumer）；
- 同一 skill 换一套适配器仍可运行（连接器可替换，接口稳定）；
- 未打包/已停用能力在前端、后台、智能体侧表现一致；
- 所有重要临床结论可回溯来源与版本（会话事件 + EvidenceChip）；
- 真实敏感原始数据进入模型的路径默认拒绝（`tools/pre-execute` 求交）；
- 模型建议、人工批准、人工确认结果、外部写回四者严格分离（approval 事件独立）；
- 每个 skill 有场景与自动验证器。

---

# 16. 风险与边界

- **不改 agent-loop**：所有新行为挂在文档化扩展点（`ctx.hospital`、`ctx.tools`、会话事件、slot、ConversationNode），loop 变更需另走 `docs/architecture.md` 更新流程；
- **能力接缝必须三角色齐全**：只写 Service Definition 或只写工具都不是接缝，按 `ctx.web` 模板一次配齐；
- **权限绝不等于「隐藏导航」**：可见性、可读、可写、元数据可见、写回批准是不同事实；
- **首期不开放**：自动诊断/自动处方/核心病历写回/真实患者原始影像进云端上下文；
- **HospitalSim 是正式资产**：不是一次性销售 demo，服务开发/回归/评测/培训，生产与模拟同份 skill 与验证逻辑。

---

# 17. 与既有设计文档的衔接

- 业务语义与术语：以 `Hospital_Agent_Platform_Unified_Design_v0.2.md` 与 `CONTEXT.md` 为准；
- 开发者教学原型：`apps/Hospital_Agent_Academy_v0.2/` 的 HACM/HACT/Agent Runtime/危急值/牙科 CT 页面，是「将要落成什么」的可交互教学样本，本设计把它们的页面语义映射为 DSH 的 slot / ConversationNode / 工具卡；
- HealthAgentBench 任务与 verifier：作为 HospitalSim 场景与验证器的设计参照，而非照搬。
