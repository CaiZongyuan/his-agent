Healthcare Agent Service 是微软基于Microsoft Copilot Studio推出的医疗专用AI智能体构建平台。它让医疗机构能够以低代码方式，在安全合规的框架内构建面向患者或医护人员的生成式AI应用。
一、产品定位与核心能力
Healthcare Agent Service 是Copilot Studio的医疗增强版本，核心能力包括：
图片
二、预建应用场景
微软提供了多个开箱即用的医疗场景模板：
患者自助服务：预约查询、健康问答、服务导航。
临床分诊：症状评估与分级引导。
药物信息查询：基于可信数据库的用药指导。
临床指南检索：实时调取最新医学指南。
临床文档辅助：与Dragon Copilot联动，辅助笔记生成。
临床试验匹配：帮助患者匹配适合的临床研究。
三、医疗级安全与合规保障
这是Healthcare Agent Service的核心差异化优势：
1. Healthcare-Adapted Orchestrator（医疗适配编排器）
针对医疗场景优化的AI调度层，确保生成内容符合医疗安全标准。
2. Clinical Safeguards API（私有预览）
提供五项临床验证能力：
图片
四、定价模式
Healthcare Agent Service 采用按Action计费的灵活模式（Agent Tier C1），2025年11月起旧版S1固定月费模式已弃用。
图片
Free Tier (F0)：限15 RPS，用于评估和开发。
Agent Tier (C1)：限50 RPS，按实际使用付费。
五、落地案例
Cleveland Clinic（克利夫兰诊所）
参与私有预览，利用智能体改善患者信息获取体验：
Bayer Pharmaceuticals（拜耳制药）
构建多智能体决策板，用于全球药物上市策略：
AKH Wien（维也纳总医院）
扩展Dragon Copilot，自动化麻醉前评估，显著减轻麻醉科医生行政负担。
Galilee Medical Center（加利利医疗中心）
使用Clinical Provenance Safeguard将复杂放射学报告转化为患者易懂的语言，并确保每条简化信息都可追溯原始报告来源。
六、与 Dragon Copilot 的关系
Healthcare Agent Service 并非Dragon Copilot的替代品，而是其扩展层：
Dragon Copilot专注于环境语音 + 临床文档自动化。
Healthcare Agent Service专注于对话式AI + 多场景智能体构建。
两者可深度集成：机构可通过Healthcare Agent Service创建定制化智能体，直接嵌入Dragon Copilot的工作界面，为医生提供基于患者病史和可信医学源的实时问答支持。
七、部署前提
需要Azure订阅；
在Azure门户中创建Healthcare Agent Service资源，选择Agent Tier (C1)；
下载并导入Copilot Studio解决方案模板；
配置安全权限（Skill Consumer Bot App ID）。
Healthcare Agent Service 是微软医疗AI战略中"对话层"的核心产品，填补了Dragon Copilot（文档层）与Azure Health Data Services（数据层）之间的缺口。它通过低代码 + 医疗级安全 + 按量计费的组合，降低了医疗机构部署生成式AI的门槛，尤其适合需要快速构建患者服务、临床辅助查询、药物信息检索等场景的机构。