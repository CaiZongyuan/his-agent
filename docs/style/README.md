# 视觉风格素材库

这里保存供 Agent 生成或维护教程图片时复用的视觉输入，不保存文档正文消费的最终图片。

## 目录约定

- `references/`：构图、配色、图标语言或视觉风格参考图。每张图必须在下方索引中记录来源、角色和证据边界。
- `sources/`：可重复渲染的 HTML、React、CSS、canvas 等图稿源文件；依赖或渲染入口写入索引。
- `prompts/`：值得复用的生成式图片 prompt、参考图角色和人工修订记录，不包含密钥或机器地址。
- 文档采用的最终 PNG/WebP 放回对应 `docs/**/assets/`；生成式原始母版和候选图保留在被 Git 忽略的 `outputs/imagegen/`。

## 使用规则

1. 生成前先从索引选择最少且相关的素材，并在 prompt 中逐张标明 `style/layout reference`、`edit target` 或其他角色。
2. 参考图只提供明确指定的视觉属性；其中的文字、数据和结论不能自动迁移，也不能作为项目证据。
3. 新增参考图时记录原始 URL、作者或用户提供状态、日期和版权状态；未知项明确写“待核验”。
4. 标签和机制准确性优先于风格相似度。生成式中文、数字和箭头必须人工核对，不可靠时用 HTML/CSS 确定性覆盖。

## 索引

| 文件 | 类型与角色 | 来源与状态 | 适用场景 |
|---|---|---|---|
| `prompts/medical-agent-banner.md` | 生成式图片 prompt 与修订记录 | 本仓库生成（Codex custom provider，`gpt-image-2`）；2026-08-25 | 重建或调整仓库 README 头图（医疗领域 × 智能体封面插画） |
| `prompts/teaching-wedge-pipeline.md` | 生成式图片 prompt 与修订记录 | 本仓库生成（Codex custom provider，`gpt-image-2`）；2026-08-26 | 重建或调整教学楔子五层管线架构图（`docs/lessons/teaching-wedge-pipeline/`） |
| `sources/sandbox-figures/` | HTML/CSS 确定性图稿源（问诊沙盘架构图 1–4）＋共享设计系统 `sandbox-figure.css` | 本仓库生成（HTML/CSS + Chromium @2x，入口 `scripts/render-html-figure.mjs`，需 `PLAYWRIGHT_DIR` 指向含 node_modules/playwright 的目录）；2026-08-26 | 重建或调整 `docs/platform/Consultation_Sandbox_Architecture_v0.1.md` 四张配图：总体架构 / 运行时双引擎 / 轨迹走查 / 评分器双轨。改图→改 HTML→重渲染→cwebp -q 90 回写 `docs/platform/assets/` |
| `sources/outpatient-agent-panorama/` | HTML/CSS 确定性图稿源（门诊 Agent 五段全景与客户机会矩阵） | 本仓库生成（HTML/CSS + Chromium @2x，复用 `sandbox-figure.css`）；2026-09-03 | 重建或调整 `docs/platform/Outpatient_Agent_Scenario_Panorama_v0.1.md` 的一页全景图；渲染母版放 `outputs/imagegen/`，WebP 成品放 `docs/platform/assets/` |
