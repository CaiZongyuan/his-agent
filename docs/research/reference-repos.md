# references/ 克隆项目台账

- `references/` 被 Git 忽略，本文件是仓库内对所克隆上游项目的登记处；新增、删除克隆时同步更新本文件。
- 克隆统一 `git clone --depth 1`，`commit` 为克隆时上游 HEAD；上游代码只读参考，不修改、不复制进仓库主体。
- 体积提醒：大仓库仅本地保留（当前最大 MedAgentSim 317M、synthea 149M），任何内容入库前按 AGENTS.md 体积规则评估。

## 台账

| 目录 | 上游 | 许可证 | 克隆日期 | commit | 用途（与本项目的关系） |
|---|---|---|---|---|---|
| HealthAgentBench | github.com/microsoft/HealthAgentBench | MIT | 先于台账（待补） | ce89def | 54 任务终端医疗智能体基准；学习与实验首要参考（阅读版见 `docs/papers/`） |
| PhysicianBench | github.com/PhysicianBench/PhysicianBench（以仓库 remote 为准） | Apache-2.0 | 先于台账（待补） | c7efa8f | FHIR EHR 长程医师工作流基准；"验证执行后状态"的评估设计参考 |
| health-admin-bench | github.com/…（health-admin-bench） | Apache-2.0 | 先于台账（待补） | e71a8f4 | 行政 GUI 计算机使用基准；治理轨（审查/支付）评估设计参考 |
| AutoMedBench | github.com/…（AutoMedBench） | MIT | 先于台账（待补） | 5394fe7 | 医疗自动研究基准（预设五阶段 + 过程分）；自动科研场景参考 |
| Camyla | github.com/…（Camyla） | Apache-2.0 | 先于台账（待补） | df4434f | 医学影像分割自主科研系统（数据集进、论文出） |
| DSH-AGUI-demo | 无（用户自研，非克隆） | — | 2026-08-24 | a7496a0 | 门诊 HIS + CopilotKit/AG-UI + DSH Gateway 自研 demo；平台"壳"的原型 |
| AgentClinic | github.com/SamuelSchmidgall/AgentClinic | MIT | 2026-08-26 | b6570ed | 模拟诊室（患者/医生/测量 agent）+ 24 种偏置注入；教学楔子的患者模拟器与评委参考 |
| AI_Hospital | github.com/LibertFan/AI_Hospital | MIT | 2026-08-26 | 870fc38 | 中文真实病历 `src/data/patients.json` + NPC 模拟 + MVME 评分脚本；教学楔子的中文剧本源 |
| MedAgentSim | github.com/MAXNORM8650/MedAgentSim | Creative Commons（代码仓库用 CC 少见，具体条款待核验） | 2026-08-26 | 6d14097 | 具身诊室（Phaser）+ 自进化双记忆；记忆/经验库设计参考；含大量资源文件（317M） |
| synthea | github.com/synthetichealth/synthea | Apache-2.0 | 2026-08-26 | d9d07a6 | 合成患者一生就诊史生成器（FHIR R4 / CSV / C-CDA / CPCDS）；教学楔子"事实层金标准"与治理轨沙盘数据源 |
| Awesome-LLM-Patient-Simulators | github.com/FreedomIntelligence/Awesome-LLM-Patient-Simulators | 无 LICENSE 文件（内部参考用） | 2026-08-26 | 1651ea5 | LLM 患者模拟器生态清单；后续选型索引 |
| simple-evals | github.com/openai/simple-evals | MIT | 2026-08-26 | 652c89d | HealthBench 数据（48,562 条 rubric）与评委代码；评分层方法论参考 |
| ppt-master | github.com/hugohe3/ppt-master | MIT | 2026-09-03 | 6a8e91e | 文档/主题 → 原生可编辑 PPTX 的 agent skill（51.7k stars）；非纯参考——经 `.claude/skills/ppt-master` 符号链接作为工作 skill 启用，依赖装在 uv `ppt-master` group；用于把 `docs/` 论文阅读版与平台文档转汇报 PPT |
