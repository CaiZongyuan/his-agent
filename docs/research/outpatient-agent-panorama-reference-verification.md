# 门诊医疗智能体场景全景参考来源核验

- 核验日期：2026-09-03
- 核验范围：客户场景全景实际使用的官方政策、DOI 和 arXiv 条目
- 核验方法：政府原文页面、Crossref DOI 元数据和 arXiv 官方 API 交叉检查

## 结果摘要

- Verified：8 项
- Needs fix：3 项，已同步修正本地索引或阅读版头部
- Unverifiable：1 项，保留为内部线索，不进入客户引用

## 必须修正

| 来源 | 原记录 | 核验结果 | 处理 |
|---|---|---|---|
| MedAgentBench | *A Realistic Virtual EHR Environment...*；NEJM AI 2(6) | DOI `10.1056/AIdbp2500144` 的 Crossref 记录为 *A Virtual EHR Environment to Benchmark Medical LLM Agents*，NEJM AI 2(9)，2025-08-28 | `docs/papers/INDEX.md` 改用正式版题名和期号；阅读版明确自身来自预印本 |
| HealthAgentBench | *Real-World Healthcare Agent Environments for Frontier AI Agents* | arXiv `2606.31179` 当前题名为 *A Unified Benchmark Suite of Realistic Agentic Healthcare Environments for Challenging Frontier AI Agents* | 修正 `docs/papers/INDEX.md` 题名 |
| AutoMedBench | *Medical Auto-Research* | arXiv `2606.01961` 当前题名使用 *Medical AutoResearch* | 修正索引和阅读版头部题名 |

## 已核验来源

| 状态 | 来源 | 权威入口 | 核验要点 |
|---|---|---|---|
| Verified | 《关于促进和规范“人工智能+医疗卫生”应用发展的实施意见》 | <https://www.gov.cn/zhengce/zhengceku/202511/content_7047018.htm> | 中国政府网页面可访问，题名一致 |
| Verified | Towards conversational diagnostic artificial intelligence | <https://doi.org/10.1038/s41586-025-08866-7> | Crossref：Nature 642(8067):442-450，2025 |
| Verified after fix | MedAgentBench: A Virtual EHR Environment to Benchmark Medical LLM Agents | <https://doi.org/10.1056/AIdbp2500144> | Crossref：NEJM AI 2(9)，2025 |
| Verified | HealthBench: Evaluating Large Language Models Towards Improved Human Health | <https://arxiv.org/abs/2505.08775> | arXiv 题名与 ID 一致 |
| Verified | Sequential Diagnosis with Language Models | <https://arxiv.org/abs/2506.22405> | arXiv 题名与 ID 一致 |
| Verified | CP-Env: Evaluating Large Language Models on Clinical Pathways in a Controllable Hospital Environment | <https://arxiv.org/abs/2512.10206> | arXiv 题名与 ID 一致 |
| Verified | HealthAdminBench: Evaluating Computer-Use Agents on Healthcare Administration Tasks | <https://arxiv.org/abs/2604.09937> | arXiv 题名与 ID 一致 |
| Verified | PhysicianBench: Evaluating LLM Agents in Real-World EHR Environments | <https://arxiv.org/abs/2605.02240> | arXiv 题名与 ID 一致 |
| Verified after fix | HealthAgentBench: A Unified Benchmark Suite of Realistic Agentic Healthcare Environments for Challenging Frontier AI Agents | <https://arxiv.org/abs/2606.31179> | arXiv 当前题名与 ID 一致 |
| Verified after fix | AutoMedBench: Towards Medical AutoResearch with Agentic AI Models | <https://arxiv.org/abs/2606.01961> | arXiv 当前题名与 ID 一致 |

## 未进入客户引用

| 状态 | 来源 | 原因 |
|---|---|---|
| Unverifiable | `docs/articles/卫生健康行业人工智能应用场景参考指引.md` | 本地文件未记录权威原文 URL；在补齐发布机关、发布日期和官方链接前只作场景发现线索 |
| Internal only | `docs/articles/DSH院内AI网关7大医疗落地场景.md` | 项目分析稿，不作为真实医院落地或商业成效证据 |
| Internal only | `docs/articles/HealthcareAgentService微软医疗专用AI智能体平台.md` | 多处产品能力和案例内容缺少可核验细节，不进入客户正文 |

## 核验边界

本次只核验客户报告实际使用的来源元数据和入口可访问性，没有重新复核每篇论文的全部实验数值。客户正文若新增具体样本量、成功率或效果差异，仍需回到正式论文或预印本对应页码逐项核验。
