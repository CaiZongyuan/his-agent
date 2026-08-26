# 问诊教学管线架构图

- 生成模式：Codex custom provider（Neoil Lab，`OPENAI_BASE_URL` 指向 provider `base_url` + `/v1`），模型 `gpt-image-2`，`quality=high`，尺寸 `1536x1024`
- 原始母版：`outputs/imagegen/teaching-wedge-pipeline-v1.png`（1.09 MB，Git 忽略）
- 教程成品：`docs/lessons/teaching-wedge-pipeline/assets/teaching-wedge-pipeline.webp`（WebP quality 90，约 109 KB），插入 `docs/lessons/teaching-wedge-pipeline/teaching-wedge-pipeline.md`
- 角色说明：无参考图，纯 prompt 生成；作教学讲解图。机制与标签的准确性以配套文档核验为准，图本身不是系统架构证据
- 生成日期：2026-08-26

## Prompt

```text
A wide horizontal architecture infographic diagram for a medical-education AI pipeline. Clean modern flat vector style, precise and professional. Near-white background. Palette: medical teal, deep navy, soft cyan, one warm orange accent. Generous whitespace, crisp edges.

The diagram flows LEFT to RIGHT through FIVE connected rounded rectangular panels arranged in one row, with a title area on top.

Title (top-left, large, exact Chinese text): 问诊教学管线
Subtitle (below title, smaller, exact Chinese text): 从合成患者到可验证评分

Panel 1, leftmost, navy header bar, exact Chinese header: 数据来源
Three small white item cards inside, exact Chinese text, one per line:
- Synthea 合成病史
- AI Hospital 中文病历
- AgentClinic 病例难度

Panel 2, teal header bar, exact Chinese header: 病例工坊
Three item cards, exact Chinese:
- 隐藏真值 CaseTruth
- 证据与揭示规则
- 编译为不可变病例

Panel 3, center, largest panel, deep teal header bar, exact Chinese header: 问诊沙盘
Four item cards, exact Chinese:
- 医学生与 Agent 学生
- 问诊 查体 检查 诊断 处方
- 患者智能体
- 全程轨迹记录

Panel 4, orange header bar, exact Chinese header: 评分层
Three item cards, exact Chinese:
- 评分细则 Rubric
- LLM 评委
- 信度门槛 ≥0.8

Panel 5, rightmost, blue header bar, exact Chinese header: 沉淀飞轮
Three item cards, exact Chinese:
- 高分入病例经验库
- 低分入错例库
- 支持下次问诊

Connectors:
- Four thick horizontal teal arrows connecting panel 1 to 2, 2 to 3, 3 to 4, 4 to 5, vertically centered between panels.
- One curved teal return arrow along the BOTTOM from panel 5 back to panel 3, labeled with exact Chinese: 经验召回
- One curved orange return arrow along the BOTTOM from panel 4 back to panel 2, labeled with exact Chinese: 评分校准
- One dashed red arc ABOVE the panels from panel 2 to panel 4, passing over panel 3 without touching it, labeled with exact Chinese: 真值仅评委可见

Render ALL Chinese characters exactly as quoted, sharp and legible. No other text anywhere. No watermark, no logo, no decorative humans. This is an explanatory system architecture diagram for teaching.
```

## 修订记录

- v1（2026-08-26）：一次生成通过。视觉核验（AI 辅助逐项核对）：26 个中文标签逐字正确、无乱码、无水印、无裁切或重叠；4 条主箭头、2 条底部回流、顶部红虚线弧全部按规格呈现。唯一偏差：底部「经验召回」回流（规格为青色）画成了橙色，与「评分校准」同为橙色——两条回流同色在语义上反而分组清晰，不修正。
