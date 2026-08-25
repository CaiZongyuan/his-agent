# 医疗智能体 README 头图

- 生成模式：Codex custom provider（Neoil Lab，`OPENAI_BASE_URL` 指向 provider `base_url` + `/v1`），模型 `gpt-image-2`，`quality=high`，尺寸 `1536x1024`
- 原始母版：`outputs/imagegen/medical-agent-banner-v1.png`（1.36 MB，Git 忽略）
- 教程成品：`assets/medical-agent-banner.webp`（WebP quality 90，约 105 KB），插入根目录 `README.md`
- 角色说明：无参考图，纯 prompt 生成；作仓库封面插画，不作为系统架构或机制证据
- 生成日期：2026-08-25

## Prompt

```text
A wide horizontal hero banner illustration for a software repository about medical AI agents. Modern flat vector illustration style, clean, professional and friendly.

Composition flows left to right in three connected zones:
1. Left zone: an abstract AI agent — a glowing hexagonal core with subtle circuit patterns, orbited by small floating tool icons (magnifier, document, calendar, chart).
2. Middle zone: thin elegant connecting lines with small glowing data dots flowing between the agent core and the medical scenes, suggesting the agent reading medical data and assisting clinical work.
3. Right zone: healthcare scenes — a soft hospital building silhouette, a doctor with a stethoscope talking to a patient, a heartbeat monitor line, medical record cards, a DNA helix, and a medicine bottle.

Palette: medical teal, deep navy blue, soft cyan, one warm orange accent, on a very light near-white background. Generous whitespace, no clutter.

Text: only a large clean Chinese title "医疗智能体" and a smaller English subtitle "Medical AI Agent" placed in the upper-left area, rendered accurately. No other text anywhere, no watermark, no logo.

This is a decorative conceptual cover illustration, not a scientific diagram.
```

## 修订记录

- v1（2026-08-25）：一次生成通过。视觉核验：中文与英文标题逐字正确，无乱码、水印、裁切或构图失衡；无需 HTML/CSS 文字覆盖。
