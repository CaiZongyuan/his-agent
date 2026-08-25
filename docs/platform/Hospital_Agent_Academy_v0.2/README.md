# 医院智能体开发者学院 v0.2

这是一个完全本地、无需后端的交互式 HospitalSim 教学原型。目标读者是有 Agent 工程经验、但不了解医疗信息化的开发者。

## 启动

直接双击 `index.html`。页面通过浏览器本地状态共享同一所合成虚拟医院。

## 学习原则

不是先背术语，而是先操作系统：

1. 在 HIS 管患者、床位、医嘱、费用和出院；
2. 在 EMR 读写合成临床文书；
3. 在 LIS 处理样本、仪器、检验结果和危急值；
4. 在 PACS 理解 Study / Series / DICOMweb；
5. 在护理与设备系统观察连续患者状态；
6. 进入 Identity / FHIR / Adapter / HACM 理解跨系统标准化；
7. 在 HACT 与 Agent Runtime 中观察 Agent 如何工作；
8. 在 HealthAgentBench 评测课中理解任务、环境、轨迹、产物和验证器，并完成一次电子健康记录（EHR）格式转换实验；
9. 跑完危急值和牙科 CBCT 两条端到端场景。

## 深度交互页面

- `his.html`：住院患者、床位、CPOE 医嘱、费用、出院流程。
- `emr.html`：病程文书、诊断、入院记录、出院小结草稿与签名。
- `lis.html`：结果审核、样本、仪器、危急值工作台。
- `pacs.html`：Study/Series、合成 Viewer、报告、DICOMweb 请求。
- `nursing.html`：生命体征、护理记录、出入量、风险评估、护理任务。
- `devices.html`：设备总览、监护仪、输注泵、设备网关。
- `identity.html`：来源身份、候选匹配、规则、人工复核与审计。
- `synthetic-data.html`：Synthea 角色、Golden Patient、Simulation Truth、Source Projector、故障注入。
- `fhir.html`：FHIR Resource Browser、API、FHIR→HACM、SMART on FHIR。
- `adapter.html`：连接、身份、字段映射、术语/单位、校验、来源追踪。
- `hacm.html`：Resource、PatientSnapshot、Timeline、Source Trace。
- `hact.html`：Agent Terminal、工具目录、能力/权限、调用历史。
- `agent-runtime.html`：AgentRun、Plan/State、Tool Calls、Evidence、Policy、Human Gate、Evaluation。
- `critical-result.html`：危急值逐步交互剧场和 Hidden Verifier。
- `dental-ct.html`：CBCT 病例、合成 Viewer、Agent Skill、牙医确认、审计。
- `healthagentbench.html`：HealthAgentBench 七类任务、任务结构、评测结果与平台映射。
- `healthagentbench-labs.html`：七类任务各自独立的可视化互动实验与任务专属验证器。
- `ehr-format-conversion.html`：从重症监护医学信息数据库第四版（MIMIC-IV）到医疗事件数据标准（MEDS）的配置修改、流水线运行与严格验证器实验。

## 共享模拟状态

所有交互使用 `assets/state.js` 的 `HospitalSimulationState`。例如：

- HIS 转床会改变患者有效床位并写入审计事件；
- LIS 发布危急结果会激活 Critical Result workflow；
- Device Gateway 可注入 SpO2 下降事件；
- Adapter mapping 改错后 contract validation 会失败；
- Agent Human Gate 的确认/升级会改变同一个 AgentRun 状态；
- 所有页面可从共享事件日志观察这些变化。

## 参考实现与产品边界

页面中明确区分：

- 直接/选择性复用：Synthea、Medplum、Orthanc、OHIF、Inferno；
- 架构/评测参考：OpenMRS O3、HealthAgentBench、MedAgentBench；
- 自研差异化：医院 Adapter Framework、HACM、HACT、Identity、Source Projector、Golden Patients、Evidence、Skills、Scenarios、Verifiers、Clinical Agent UI。

## 安全说明

所有患者、医院、检验和临床工作流均为合成教学数据。原有 CT / CBCT 画面由 CSS 生成；HealthAgentBench 课程中的 X 光、CT 和病理图片来自论文示例素材，仅用于说明评测任务。站内任何影像都不能用于诊断。高风险医疗写入只用于说明权限边界，不代表产品应允许通用 Agent 自主执行。
