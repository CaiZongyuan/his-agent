<p align="center">
  <img src="assets/medical-agent-banner.webp" alt="HIS-agent · 医疗智能体" width="880">
</p>

<h1 align="center">HIS-agent</h1>

<p align="center"><strong>探索医疗领域 × Agent 的结合：真实场景、能力边界与可运行的 demo</strong></p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white" alt="Python 3.13">
  <img src="https://img.shields.io/badge/domain-Medical%20AI%20Agent-0e9aa7" alt="Medical AI Agent">
  <img src="https://img.shields.io/badge/stage-探索与原型-f6a821" alt="stage">
</p>

---

## 🎯 在做什么

围绕「医疗领域与 Agent 结合」推进三条工作流，核心产出是**面向具体场景、可运行、可复盘的 demo 与案例**：

| 工作流 | 做什么 | 沉淀到 |
|---|---|---|
| 🔍 **场景探索与 demo** | 分析具体医疗场景下智能体的任务、数据与工具边界，做 demo 和案例验证，沉淀提升该场景 agent 能力的方法 | `demos/` |
| 📚 **学习与教学** | 学习理解相关论文与开源项目，产出教程、讲解与练习 | [`docs/papers/`](docs/papers/INDEX.md) · [`docs/lessons/`](docs/lessons/) |
| 🧪 **实验** | 在理解的基础上做实验：数据、模型与产物管理 | `data/` · `models/` · `outputs/` |

## 🔥 当前主线：问诊沙盘（Consultation Sandbox）

**一个引擎，四种部署**——辅助问诊 / 虚拟问诊 / 问诊教学 / 问诊评估，本质都是「医生席 × 患者 agent × 虚拟 HIS × 评分器」的不同开关组合：

- 📐 [问诊沙盘架构 v0.1](docs/platform/Consultation_Sandbox_Architecture_v0.1.md) —— 完整设计：CaseTruth 病例编译、患者 agent 五步流水线、虚拟 HIS 三级结果解析、auto/judge 双轨评分器，全部机制附代码级参考先例（AgentClinic / AI Hospital / Synthea / HealthBench）
- 🧪 [P0 黄金案例](docs/platform/p0-golden-case/README.md) —— 2 型糖尿病问诊全量 CaseTruth + 22 条 rubric，含追问松口（second_ask_concede）、目录边界转诊等考点设计

## 📁 仓库结构

**文档与代码（提交到 Git）**

| 目录 | 用途 |
|---|---|
| [`docs/papers/`](docs/papers/INDEX.md) | 参考论文的 Markdown 阅读版与[论文索引](docs/papers/INDEX.md) |
| [`docs/lessons/`](docs/lessons/) | 学习产出的教程、讲解与练习 |
| [`docs/research/`](docs/research/) | 调研笔记与实验记录 |
| [`docs/platform/`](docs/platform/) | 医疗智能体平台设计文档 |
| [`docs/style/`](docs/style/README.md) | 教程图片的可复用视觉素材（参考图、图稿源、prompt） |
| `demos/` | 面向具体医疗场景的 demo 与案例项目 |
| `scripts/` | 可复用工具脚本，如 [`mineru-pdf-to-markdown.sh`](scripts/mineru-pdf-to-markdown.sh)（论文 PDF 转 Markdown） |
| `notebook/` | 实验 notebook |

**大文件目录（Git 忽略，仅本地）**

| 目录 | 用途 |
|---|---|
| `references/` | 克隆的参考项目源码：问诊沙盘谱系（AgentClinic、AI_Hospital、synthea、simple-evals）与基准（PhysicianBench、HealthAgentBench、AutoMedBench、MedAgentSim、health-admin-bench 等） |
| `data/` | 数据集与实验数据 |
| `models/` | 模型权重与 checkpoint |
| `outputs/` | 实验与生成产物（PDF、视频、图片母版等） |

## 🛠️ 环境准备

```bash
# Python 3.13 + uv
uv sync

# 复制示例文件并填入外部 API 密钥（MinerU 等）
cp .env.example .env
```

`.env` 已被 Git 忽略，只提交不含真实值的 `.env.example`。

## 📌 约定与规范

| 文档 | 内容 |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Agent 协作、科研检索流程、目录约定、证据与图片管理规范 |
| [`CONTEXT.md`](CONTEXT.md) | 业务术语表（平台与产品的稳定语言） |
| [`docs/papers/INDEX.md`](docs/papers/INDEX.md) | 论文索引：采用 / 备选 / 排除及理由 |
