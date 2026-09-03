# 论文索引

记录所有已评估的候选论文，不只记录最终采用的论文。每条至少包含：规范标题、原文链接/DOI、本地 Markdown 文件、与项目的核心关联、状态（采用/备选/排除）及理由、检索日期；缺失项明确标为待核验。评估新论文后同步更新本索引，避免重复检索。

| 状态 | 标题 | 原文 | 本地文件 | 与项目的关联 | 检索日期 |
|---|---|---|---|---|---|
| 采用 | HealthAgentBench: A Unified Benchmark Suite of Realistic Agentic Healthcare Environments for Challenging Frontier AI Agents（HealthAgentBench：面向前沿 AI 智能体的真实医疗智能体环境统一基准套件） | [arXiv:2606.31179](https://arxiv.org/abs/2606.31179)；官网 <https://microsoft.github.io/HealthAgentBench/> | [`HealthAgentBench：面向前沿 AI 智能体的真实医疗智能体环境统一基准套件.md`](HealthAgentBench：面向前沿 AI 智能体的真实医疗智能体环境统一基准套件.md)（MinerU 机器转换阅读版） | 医疗智能体评估基准；源码在 `references/HealthAgentBench`，是学习与实验的首要参考 | 2026-08-25 |
| 采用 | ReflecTool: Towards Reflection-Aware Tool-Augmented Clinical Agents（ReflecTool：反思感知的工具增强临床智能体；**ClinicalAgent Bench 出处**） | ACL 2025 长文，DOI [10.18653/v1/2025.acl-long.663](https://doi.org/10.18653/v1/2025.acl-long.663)；预印本 [arXiv:2410.17657](https://arxiv.org/abs/2410.17657) | [`ReflecTool：反思感知的工具增强临床智能体/`](ReflecTool：反思感知的工具增强临床智能体/ReflecTool：反思感知的工具增强临床智能体.md) | HealthAgentBench 相关工作第一脉络（静态问答式医疗智能体基准）；工具增强 + 反思的临床智能体方法参考 | 2026-08-25 |
| 采用 | MedAgentBoard: Benchmarking Multi-Agent Collaboration with Conventional Methods for Diverse Medical Tasks（MedAgentBoard：医疗任务上多智能体协作的综合评估基准） | [arXiv:2505.12371](https://arxiv.org/abs/2505.12371)；项目主页 <https://medagentboard.netlify.app/> | [`MedAgentBoard：医疗任务上多智能体协作的综合评估基准/`](MedAgentBoard：医疗任务上多智能体协作的综合评估基准/MedAgentBoard：医疗任务上多智能体协作的综合评估基准.md) | 多智能体 vs 单 LLM vs 传统方法的系统比较；HealthAgentBench 相关工作第一脉络 | 2026-08-25 |
| 采用 | HealthBench: Evaluating Large Language Models Towards Improved Human Health（HealthBench：面向改善人类健康的大语言模型评估） | [arXiv:2505.08775](https://arxiv.org/abs/2505.08775) | [`HealthBench：面向改善人类健康的大语言模型评估/`](HealthBench：面向改善人类健康的大语言模型评估/HealthBench：面向改善人类健康的大语言模型评估.md) | 医患对话 + 医生撰写评分准则的评估范式（OpenAI）；HealthAgentBench 相关工作第二脉络 | 2026-08-25 |
| 采用 | HealthBench Professional: Evaluating Large Language Models on Real Clinician Chats（HealthBench Professional：真实临床医生对话上的 LLM 评估） | [arXiv:2604.27470](https://arxiv.org/abs/2604.27470) | [`HealthBench Professional：真实临床医生对话上的 LLM 评估/`](HealthBench%20Professional：真实临床医生对话上的%20LLM%20评估/HealthBench%20Professional：真实临床医生对话上的%20LLM%20评估.md) | HealthBench 的临床医生真实对话扩展；专科与难例维度对场景探索有参考 | 2026-08-25 |
| 采用 | Sequential Diagnosis with Language Models（MAI-DxO：语言模型的顺序诊断） | [arXiv:2506.22405](https://arxiv.org/abs/2506.22405) | [`MAI-DxO：语言模型的顺序诊断/`](MAI-DxO：语言模型的顺序诊断/MAI-DxO：语言模型的顺序诊断.md) | NEJM 病例上的成本意识顺序诊断智能体编排（Microsoft MAI-DxO）；诊断场景智能体设计参考 | 2026-08-25 |
| 采用 | AgentClinic: a multimodal agent benchmark to evaluate AI in simulated clinical environments（AgentClinic：模拟临床环境的多模态智能体基准） | [arXiv:2405.07960](https://arxiv.org/abs/2405.07960) | [`AgentClinic：模拟临床环境的多模态智能体基准/`](AgentClinic：模拟临床环境的多模态智能体基准/AgentClinic：模拟临床环境的多模态智能体基准.md) | 医生/患者/测量智能体的模拟诊室；多智能体医疗模拟环境设计参考 | 2026-08-25 |
| 采用 | AI Hospital: Benchmarking Large Language Models in a Multi-agent Medical Interaction Simulator（AI Hospital：多智能体医疗交互模拟器基准） | [arXiv:2402.09742](https://arxiv.org/abs/2402.09742) | [`AI Hospital：多智能体医疗交互模拟器基准/`](AI%20Hospital：多智能体医疗交互模拟器基准/AI%20Hospital：多智能体医疗交互模拟器基准.md) | 中文医疗多智能体问诊模拟基准；对话式评估脉络 | 2026-08-25 |
| 采用 | MedAgentSim: Self-Evolving Multi-Agent Simulations for Realistic Clinical Interactions（MedAgentSim：真实临床交互的自进化多智能体模拟） | [arXiv:2503.22678](https://arxiv.org/abs/2503.22678) | [`MedAgentSim：真实临床交互的自进化多智能体模拟/`](MedAgentSim：真实临床交互的自进化多智能体模拟/MedAgentSim：真实临床交互的自进化多智能体模拟.md) | 自进化临床对话模拟；模拟诊室脉络 | 2026-08-25 |
| 采用 | CP-Env: Evaluating Large Language Models on Clinical Pathways in a Controllable Hospital Environment（CP-Env：可控医院环境中的临床路径 LLM 评估） | [arXiv:2512.10206](https://arxiv.org/abs/2512.10206) | [`CP-Env：可控医院环境中的临床路径 LLM 评估/`](CP-Env：可控医院环境中的临床路径%20LLM%20评估/CP-Env：可控医院环境中的临床路径%20LLM%20评估.md) | 可控医院环境中的临床路径执行评估；诊断-治疗全流程模拟 | 2026-08-25 |
| 采用 | MedAgentBench: A Virtual EHR Environment to Benchmark Medical LLM Agents（MedAgentBench：虚拟 EHR 环境医疗 LLM 智能体基准） | NEJM AI 2(9)，DOI [10.1056/AIdbp2500144](https://doi.org/10.1056/AIdbp2500144)；阅读版转换自预印本 [arXiv:2501.14654](https://arxiv.org/abs/2501.14654) | [`MedAgentBench：虚拟 EHR 环境医疗 LLM 智能体基准/`](MedAgentBench：虚拟%20EHR%20环境医疗%20LLM%20智能体基准/MedAgentBench：虚拟%20EHR%20环境医疗%20LLM%20智能体基准.md) | FHIR EHR 可执行环境（检索/下医嘱任务族）；HealthAgentBench 可执行环境脉络的直接前身 | 2026-08-25 |
| 采用 | MedAgentGym: A Scalable Agentic Training Environment for Code-Centric Reasoning in Biomedical Data Science（MedAgentGym：生物医学数据科学代码中心推理的可扩展智能体训练环境） | [arXiv:2506.04405](https://arxiv.org/abs/2506.04405)；HealthAgentBench 引其为 ICLR 2026（OpenReview jHDZEUgS4r，待核验） | [`MedAgentGym：生物医学数据科学代码中心推理的可扩展智能体训练环境/`](MedAgentGym：生物医学数据科学代码中心推理的可扩展智能体训练环境/MedAgentGym：生物医学数据科学代码中心推理的可扩展智能体训练环境.md) | 代码中心生物医学数据科学智能体的训练（含 RL）环境；与 EHR 事件建模任务能力相关 | 2026-08-25 |
| 采用 | HealthAdminBench: Evaluating Computer-Use Agents on Healthcare Administration Tasks（HealthAdminBench：医疗行政任务的计算机使用智能体评估） | [arXiv:2604.09937](https://arxiv.org/abs/2604.09937) | [`HealthAdminBench：医疗行政任务的计算机使用智能体评估/`](HealthAdminBench：医疗行政任务的计算机使用智能体评估/HealthAdminBench：医疗行政任务的计算机使用智能体评估.md) | GUI 计算机使用智能体 × 医疗行政工作流；源码在 `references/health-admin-bench` | 2026-08-25 |
| 采用 | PhysicianBench: Evaluating LLM Agents in Real-World EHR Environments（PhysicianBench：真实 EHR 环境中的 LLM 智能体评估） | [arXiv:2605.02240](https://arxiv.org/abs/2605.02240) | [`PhysicianBench：真实 EHR 环境中的 LLM 智能体评估/`](PhysicianBench：真实%20EHR%20环境中的%20LLM%20智能体评估/PhysicianBench：真实%20EHR%20环境中的%20LLM%20智能体评估.md) | 基于 FHIR EHR 的长程、执行可验证工作流基准；源码在 `references/PhysicianBench`，可做实验对照 | 2026-08-25 |
| 采用 | Camyla: Scaling Autonomous Research in Medical Image Segmentation（Camyla：医学图像分割自主科研的规模化） | [arXiv:2604.10696](https://arxiv.org/abs/2604.10696) | [`Camyla：医学图像分割自主科研的规模化/`](Camyla：医学图像分割自主科研的规模化/Camyla：医学图像分割自主科研的规模化.md) | 数据集进、论文出的端到端医学影像自主科研智能体（CamylaBench）；源码在 `references/Camyla`，与自动研究场景直接相关 | 2026-08-25 |
| 采用 | AutoMedBench: Towards Medical AutoResearch with Agentic AI Models（AutoMedBench：迈向智能体 AI 模型的医疗自动研究） | [arXiv:2606.01961](https://arxiv.org/abs/2606.01961) | [`AutoMedBench：迈向智能体 AI 模型的医疗自动研究/`](AutoMedBench：迈向智能体%20AI%20模型的医疗自动研究/AutoMedBench：迈向智能体%20AI%20模型的医疗自动研究.md) | 医疗自动研究 agentic 基准（多模态、端到端原始数据流水线）；源码在 `references/AutoMedBench` | 2026-08-25 |
| 采用 | AMIE / Towards Conversational Diagnostic AI（AMIE：对话式诊断人工智能） | Nature 2025 正式版 DOI [10.1038/s41586-025-08866-7](https://doi.org/10.1038/s41586-025-08866-7)；阅读版转换自预印本 [arXiv:2401.05654](https://arxiv.org/abs/2401.05654) | [`AMIE：对话式诊断人工智能/`](AMIE%EF%BC%9A%E5%AF%B9%E8%AF%9D%E5%BC%8F%E8%AF%8A%E6%96%AD%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD/AMIE%EF%BC%9A%E5%AF%B9%E8%AF%9D%E5%BC%8F%E8%AF%8A%E6%96%AD%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD.md)（MinerU 机器转换阅读版） | Google 的诊断对话智能体：自我对弈模拟环境（内环 in-context 批评 + 外环微调迭代）+ OSCE 式真人对演 RCT（预印本：149 场景、20 名 PCP 对照、专科医生评 28/32 轴、患者演员评 24/26 轴 AMIE 胜）；问诊教学楔子的方法论标杆；代码未开源 | 2026-08-26 |
| 采用 | LLM-Powered Virtual Patient Agents for Interactive Clinical Skills Training with Automated Feedback（LLM 虚拟患者 agent：交互式临床技能训练与自动反馈） | [arXiv:2508.13943](https://arxiv.org/abs/2508.13943) | [`LLM 虚拟患者 agent：交互式临床技能训练与自动反馈/`](LLM%20%E8%99%9A%E6%8B%9F%E6%82%A3%E8%80%85%20agent%EF%BC%9A%E4%BA%A4%E4%BA%92%E5%BC%8F%E4%B8%B4%E5%BA%8A%E6%8A%80%E8%83%BD%E8%AE%AD%E7%BB%83%E4%B8%8E%E8%87%AA%E5%8A%A8%E5%8F%8D%E9%A6%88/LLM%20%E8%99%9A%E6%8B%9F%E6%82%A3%E8%80%85%20agent%EF%BC%9A%E4%BA%A4%E4%BA%92%E5%BC%8F%E4%B8%B4%E5%BA%8A%E6%8A%80%E8%83%BD%E8%AE%AD%E7%BB%83%E4%B8%8E%E8%87%AA%E5%8A%A8%E5%8F%8D%E9%A6%88.md)（MinerU 机器转换阅读版） | OSCE 虚拟患者（文本之外的动作空间，Unity/机器人实现无关）+ 虚拟导师即时反馈（超越关键词匹配的状态图评分）；Voigt 等（耶拿大学/比勒费尔德大学/早稻田大学）；教学楔子直接相关 | 2026-08-26 |
| 采用 | Agent Hospital: A Simulacrum of Hospital with Evolvable Medical Agents（Agent Hospital：具有可演化医疗智能体的医院模拟） | [arXiv:2405.02957](https://arxiv.org/abs/2405.02957) | [`Agent Hospital：具有可演化医疗智能体的医院模拟/`](Agent%20Hospital%EF%BC%9A%E5%85%B7%E6%9C%89%E5%8F%AF%E6%BC%94%E5%8C%96%E5%8C%BB%E7%96%97%E6%99%BA%E8%83%BD%E4%BD%93%E7%9A%84%E5%8C%BB%E9%99%A2%E6%A8%A1%E6%8B%9F/Agent%20Hospital%EF%BC%9A%E5%85%B7%E6%9C%89%E5%8F%AF%E6%BC%94%E5%8C%96%E5%8C%BB%E7%96%97%E6%99%BA%E8%83%BD%E4%BD%93%E7%9A%84%E5%8C%BB%E9%99%A2%E6%A8%A1%E6%8B%9F.md)（MinerU 机器转换阅读版） | 清华 AIR 团队的医院级模拟与自演化医生智能体；商业产品紫荆智康（TAIREX）线上虚拟诊室的创始团队论文与直接前身（实机分析见 `references/DSH-AGUI-demo/docs/research/tairex-virtual-clinic-analysis.md`）；与 AI Hospital（arXiv:2402.09742）为不同工作，勿混淆 | 2026-08-26 |
| 备选 | MedSimAI: simulation and formative feedback generation to enhance deliberate practice in medical education | ACM DL，DOI [10.1145/3785022.3785092](https://doi.org/10.1145/3785022.3785092)（元数据待核验） | 无（未转换） | 刻意练习 + 形成性反馈生成；rubric 评分器设计参考 | 2026-08-26 |

## 排除（本轮）

- ReflecTool 的 arXiv 预印本（arXiv:2410.17657）单独转换版：与 ACL 2025 正式版重复，正式版已入库；预印本 PDF 留存于 `outputs/papers/pdf/backup/` 备查。

## 待核验

- HealthAgentBench 条目的作者、发表版本（arXiv 是否已有正式出版版）与引用格式待核验。
- HealthAdminBench、Camyla、AutoMedBench 的完整作者与机构列表待核验（头注仅记第一作者）。
- AgentClinic 的 NeurIPS 2024 Datasets and Benchmarks 正式版信息、MedAgentGym 的 ICLR 2026 信息、MAI-DxO 是否有正式出版版本，均待核验。
- MedAgentBench 阅读版转换自 arXiv 预印本 v2（2025-02-12），预印本题名为 *A Realistic Virtual EHR Environment to Benchmark Medical LLM Agents*；Crossref 于 2026-09-03 核验的正式版题名为 *A Virtual EHR Environment to Benchmark Medical LLM Agents*，刊于 NEJM AI 2(9)，内容引用以正式版为准。
- 数据可得性核查（2026-08-26）：SDBench（MAI-DxO）无官方代码/数据发布，仅社区复刻 The-Swarm-Corporation/Open-MAI-Dx-Orchestrator，NEJM 病例原文受版权限制；CP-Env 声称提供基准与评估工具，仓库入口待核验；HBP 自称 open benchmark，发布位置待核验。
- AMIE：Nature 2025 正式版 PDF 未能获取（付费墙，cookie 重定向无法核验 OA 状态）；阅读版转换自 arXiv 预印本（149 场景、专科医生评 28/32 轴、患者演员评 24/26 轴），此前初检 Nature 条目摘要显示的数字（159 场景、30/32 轴）与预印本不同，正式版差异与更新内容待核验，引用以正式版为准。

## 检索台账（2026-08-25）

- 线索来源：`docs/papers/HealthAgentBench…md` 相关工作与数据来源小节 + `references/` 各仓库 README 的论文徽章；范围经用户确认为「references/ 仓库论文 + 相关工作医疗智能体基准」（A+B，共 15 篇）。
- 查询与核验：arXiv HTML 引文核验 1 次（arxiv.org/html/2606.31179v1，解析 10 个基准的出处）；infra-scholar-search 题名查询 3 次（ReflecTool、MedAgentBench、MedAgentGym，QPS 限制内串行）；arXiv abs 页核验 1 次（2501.14654）。所有采用条目的 arXiv ID 均经下载 PDF 首页标题比对确认。
- 失败与处理：AgentClinic 直链下载失败一次，带版本号重试成功；MedAgentBench 的 NEJM AI PDF 下载被拦，改用 arXiv 预印本（DOI 已记录）；MinerU 偶发 "parsing failed" 2 次（ReflecTool、Camyla）与上传连接重置 1 次（AutoMedBench），重试均成功。
- 工具修复：`scripts/mineru-pdf-to-markdown.sh` 图片清单缺少尾换行导致 `while read` 丢弃最后一个图片引用（每篇恰好缺 1 图，含此前 HealthAgentBench 的一次转换），已修复（`process.stdout.write` → `console.log`）并全量重转验证 0 缺图。此前 HealthAgentBench 阅读版的最后一张图可能因此缺失，如需补全可用修复后脚本重转。
- 未解决缺口（C 类，用户选择暂不做）：Terminal-Bench（arXiv:2601.11868）、OSWorld、GAIA、WebArena 等通用智能体基准；EHRSHOT（arXiv:2307.02028，已知 ID 可直接补）、CheXprompt、CT-RATE、MIMIC-CXR、MIMIC-IV、MedQA、CAMELYON16、TREC-CT 2021 等数据与组件论文。

## 检索台账（2026-08-26，数据可得性核查）

- 目的：教学楔子（虚拟问诊 + rubric 评分）Phase 1 的开源数据源核查。
- 本地 grep（7 篇阅读版发布声明）：AgentClinic 代码与数据开源（AgentClinic.github.io）；AI Hospital 数据/代码/结果开源（github.com/LibertFan/AI_Hospital，MIT，含 `src/data/patients.json` 中文病历与 eval 脚本）；MedAgentSim 代码/环境/基准数据公开（medagentsim.netlify.app）；HealthBench 数据与代码随 openai/simple-evals 发布（含 48,562 条 rubric）。
- Web 核验 3 次：Synthea README（Apache-2.0；FHIR R4/STU3/DSTU2 + Bulk FHIR ndjson + CSV/C-CDA/CPCDS 导出；2025 仍活跃维护）；AI_Hospital 仓库页（许可证与内容确认，仓库仅 6 commits）；WebSearch「SDBench MAI-DxO microsoft github」1 次（结论：无官方发布）。
- 失败与缺口：CP-Env、HBP 的发布入口未定位；Synthea payers/claims（CPCDS）模块细节未逐文件核验；均待后续补查。

## 检索台账（2026-08-26，教学楔子文献检索 + 克隆台账建立）

- 主题：问诊教学楔子（虚拟 SP 对话 + rubric 评分）的方法论文献与配套开源项目。
- infra-scholar-search 1 次：「LLM agent standardized patient simulation OSCE medical dialogue training」（前 10 条；AMIE、arXiv:2508.13943、MedSimAI 记为备选入索引）。WebSearch 1 次：定位 MedAgentSim 官方仓库（github.com/MAXNORM8650/MedAgentSim）与患者模拟器清单仓库 FreedomIntelligence/Awesome-LLM-Patient-Simulators。
- 克隆：新增 6 仓库至 `references/`（AgentClinic、AI_Hospital、MedAgentSim、synthea、Awesome-LLM-Patient-Simulators、simple-evals），全部 `--depth 1`，登记于 `docs/research/reference-repos.md`。
- 缺口：AMIE 代码未开源（仅论文）；MedSimAI 仅 ACM DL 摘要级核验，全文待读；中文问诊教学模拟文献本轮未检索；MedAgentSim 许可证检测为 Creative Commons，代码仓库用 CC 少见，具体条款待核验。
- 后续入库（同日，用户授权自主沉淀论文）：补查 AMIE 预印本（infra-scholar-search 题名查询 1 次定位 arXiv:2401.05654）；AMIE 与 arXiv:2508.13943 两篇经 MinerU 转换入库 `docs/papers/`（38+10 张图片引用零缺失，合计 2.7M，无超 1MiB 文件），状态由备选升为采用；MedSimAI 因 ACM 付费墙暂缓，维持备选。
- Agent Hospital 入库（同日晚）：用户提供其 demo 仓库内的 TAIREX（紫荆智康）线上虚拟诊室实机分析（`references/DSH-AGUI-demo/docs/research/tairex-virtual-clinic-analysis.md`，证据截至 2026-08-22），确认 TAIREX 是教学楔子的中国商业同类产品、其创始团队论文即 Agent Hospital（arXiv:2405.02957）；PDF 直链下载 + MinerU 转换入库（42 图零缺失，3.3M）。附带发现：demo 仓库 `docs/research/` 另有合成医院数据来源、虚拟患者与病例创作系统两篇深度调研，与本项目教学楔子设计高度互补，本轮已读取吸收。
