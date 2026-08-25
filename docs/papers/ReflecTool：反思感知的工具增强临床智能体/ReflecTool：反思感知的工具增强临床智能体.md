> **ReflecTool: Towards Reflection-Aware Tool-Augmented Clinical Agents**（ClinicalAgent Bench 出处）
>
> Yusheng Liao、Shuyang Jiang、Yanfeng Wang、Yu Wang（同济大学 / 上海人工智能实验室等）
>
> + 原文：ACL 2025 长文，DOI [10.18653/v1/2025.acl-long.663](https://doi.org/10.18653/v1/2025.acl-long.663)；预印本 [arXiv:2410.17657](https://arxiv.org/abs/2410.17657)
> + 本地核验 PDF：`outputs/papers/pdf/2025.acl-long.663_ReflecTool.pdf`（Git 忽略）
> + 本文件为 MinerU（vlm）机器转换的英文阅读版，未翻译；逐字引用、公式与数据核验以 PDF 原文为准。转换日期 2026-08-25。

# REFLECTOOL: Towards Reflection-Aware Tool-Augmented Clinical Agents

Yusheng Liao<sup>,</sup>}, Shuyang Jiang|<sup>,</sup>}, Yanfeng Wang<sup>,</sup>}, Yu Wang\*<sup>,</sup><sup>,</sup>}

Shanghai Jiao Tong University

}Shanghai Artificial Intelligence Laboratory

|Fudan University

{liao20160907,wangyanfeng622,yuwangsjtu}@sjtu.edu.cn shuyangjiang23@m.fudan.edu.cn

## Abstract

Large Language Models (LLMs) have shown promising potential in the medical domain, assisting with tasks like clinical note generation and patient communication. However, current LLMs are limited to text-based communication, hindering their ability to interact with diverse forms of information in clinical environments. Despite clinical agents succeeding in diverse signal interaction, they are oriented to a single clinical scenario and hence fail for broader applications. To evaluate clinical agents holistically, we propose ClinicalAgent Bench (CAB), a comprehensive medical agent benchmark consisting of 18 tasks across five key realistic clinical dimensions. Building on this, we introduce REFLECTOOL, a novel framework that excels at utilizing domain-specific tools within two stages. The first optimization stage progressively enlarges a long-term memory by saving successful solving processes and toolwise experience of agents in a tiny pre-defined training set. In the following inference stage, REFLECTOOL can search for supportive successful demonstrations from already built longterm memory to guide the tool selection strategy, and a verifier improves the tool usage according to the tool-wise experience with two verification methods–iterative refinement and candidate selection. Extensive experiments on CAB demonstrate that REFLECTOOL surpasses the pure LLMs with more than 10 points and the well-established agent-based methods with 3 points, highlighting its adaptability and effectiveness in solving complex clinical tasks. Our code and datasets are available at https: //github.com/BlueZeros/ReflecTool.

## 1 Introduction

Large Language Models (LLMs) have shown significant potential in the medical domain (Singhal et al., 2023; Nori et al., 2023; Chen et al., 2023a), demonstrating their ability to assist with tasks such as generating clinical notes (Biswas and Talukdar, 2024; Jung et al., 2024) and supporting patient communication (Tu et al., 2024; Liao et al., 2024). However, LLMs are restricted to direct text-based responses rather than serving as a bridge to leverage the information in other forms, thus impeding their effective application in realistic clinical scenarios.

To address such shortcoming, numerous works developed more advanced clinical agents, which enable models to leverage complex information through specialized tools (Jin et al., 2024; Li et al., 2024a; Lin et al., 2024). For instance, EHRAgent (Shi et al., 2024) can access electronic health records (EHRs) via a code interface, and MMedAgent (Li et al., 2024a) can interpret medical images via several medical visual models (Li et al., 2024b; Ma et al., 2024). While these agents enhance LLMs’ ability to interact with various types of data, they remain limited to addressing specific clinical scenarios with a narrow range of tools, impeding their ability to interact with the diverse forms of information intrinsic to clinical environments (Hu et al., 2024b; Lee et al., 2022; Adams et al., 2024). This lack of integration limits their effectiveness for further application in clinical scenarios.

In this paper, we analyze representative public benchmarks in the medical field and categorize them based on the capability requirements of medical agents. We build a comprehensive medical agent benchmark, ClinicalAgent Bench (CAB), comprising 18 tasks across five dimensions in total. Specifically, the dimensions of CAB include Knowledge & Reasoning, MultiModal, Numerical Analysis, Data Understanding, and Trustworthiness. These dimensions require clinical agents to reason with medical knowledge effectively, integrate information from diverse clinical data sources (including medical images, EHRs, clinical text, and multiple clinical documents), and reduce hallucinations to ensure trustworthiness. Compared to previous benchmarks, CAB provides a more holistic evaluation framework by encompassing a wider range of clinical tasks and assessing agent capabilities across multiple scenarios.

<table><tr><td rowspan="2">Methods</td><td colspan="5">Agent Capacities</td><td colspan="4">Agent Methods</td></tr><tr><td>Knowledge&amp; Reasoning</td><td>MultiModal</td><td>Numerical Analysis</td><td>Data Understanding</td><td>Trustworthiness</td><td>Tool Use</td><td>Long-Term Memory</td><td>Tool-wise Reflection</td><td>w/o Fine Tuning</td></tr><tr><td>MedAgent (Tang et al., 2024)</td><td>√</td><td>✕</td><td>✕</td><td>√</td><td>✕</td><td>✕</td><td>✕</td><td>✕</td><td>√</td></tr><tr><td>MMedAgent (Li et al., 2024a)</td><td>√</td><td>√</td><td>✕</td><td>✕</td><td>✕</td><td>√</td><td>✕</td><td>✕</td><td>✕</td></tr><tr><td>MedRAG (Xiong et al., 2024)</td><td>√</td><td>✕</td><td>✕</td><td>✕</td><td>✕</td><td>√</td><td>✕</td><td>✕</td><td>√</td></tr><tr><td>OmniRAG (Chen et al., 2025)</td><td>√</td><td>✕</td><td>✕</td><td>✕</td><td>✕</td><td>√</td><td>✕</td><td>✕</td><td>✕</td></tr><tr><td>AgentMD (Jin et al., 2024)</td><td>√</td><td>✕</td><td>√</td><td>✕</td><td>✕</td><td>√</td><td>✕</td><td>✕</td><td>√</td></tr><tr><td>EHRAgent (Shi et al., 2024)</td><td>√</td><td>✕</td><td>√</td><td>✕</td><td>√</td><td>√</td><td>√</td><td>✕</td><td>√</td></tr><tr><td>CTAgent (Yue and Fu, 2024)</td><td>√</td><td>√</td><td>✕</td><td>✕</td><td>√</td><td>√</td><td>✕</td><td>✕</td><td>✕</td></tr><tr><td>BKGAgent (Lin et al., 2024)</td><td>√</td><td>✕</td><td>✕</td><td>✕</td><td>✕</td><td>√</td><td>✕</td><td>✕</td><td>√</td></tr><tr><td>REFLECTOOL (Ours)</td><td>√</td><td>√</td><td>√</td><td>√</td><td>√</td><td>√</td><td>√</td><td>√</td><td>√</td></tr></table>

Table 1: Comparison of previous medical agents and REFLECTOOL on both agent capacities and methods.

Motivated by five critical aspects of CAB, we develop a set of clinical tools that enables agents to handle diverse tasks encompassed in the benchmark. Building upon the clinical toolbox, we proposed REFLECTOOL, a framework that allows agents to learn how to choose and leverage domainspecific tools to solve tasks. Specifically, REFLEC-TOOL consists of two stages. The first stage is the optimization stage. The agent attempts to solve problems using tools on a small proportion of sam ples and generates successful trajectories through self-reflection. By comparing successful and failed trajectories, the agent produces the tool-wise suggestion and stores successful trajectories as longterm memory. In the inference stage, the agent retrieves similar successful cases from long-term memory to optimize the tool selection. Each time a tool is used, the agent improves tool usage accord ing to the accumulated tool-wise experience from the optimization stage. Furthermore, we adopt two verification methods, iterative refinement and candidate selection, to investigate the effectiveness of the tool-wise experience. We find that these two methods perform better under different model strengths, thereby enhancing the applicability of our approach. As discussed, REFLECTOOL demonstrates not only proficiency in a wide range of clin ical critical aspects from CAB but also more effective tool utilization strategies, as the comparison with existing clinical agents shown in Table 1.

In summary, our contributions are as follows:

• Holistic Benchmark: We introduce CAB, a benchmark comprising 18 tasks across five principal dimensions. To the best of our knowledge, CAB is the first benchmark covering a wide range of tasks to evaluate the capabilities of clinical agents comprehensively.

• Almighty Tool-Augmented Agent: We propose REFLECTOOL, a novel framework that enables models to effectively utilize domainspecific tools. REFLECTOOL uses long-term memory and tool-wise verification to alleviate the problem in domain-tool selection and usage, thus improving adaptability across a wide range of clinical scenarios.

• Revision-based explorations: We explore two tool-wise verification methods, i.e., Iterative Refinement and Candidate Selection, designed to optimize tool usage. Our findings indicate that Iterative Refinement is more effective when the model exhibits lower capabilities, whereas Candidate Selection outperforms the former on more intelligent models.

• Superior downstream improvements: We conduct extensive experiments on CAB, benchmarking REFLECTOOL against a diverse array of established methods. Our results demonstrate the superior performance of REFLECTOOL, highlighting its effectiveness in clinical tool utilization.

## 2 ClinicalAgent Bench

In this section, we introduce the CAB, a novel benchmark to evaluate the capacity of the medical agent in clinical scenarios. The overview of the benchmark is shown in Figure 1. We first discuss the composition of the CAB in detail and then introduce the construction of the pre-built toolbox.

## 2.1 Composition

The agents in clinical scenarios need to process the medical data in different formats, like medical images (Hu et al., 2024b; Liu et al., 2021; Lau et al.,

![](assets/e2f565b8edaeca089dbd8d7d17fdef7473e04b469c5851a5ebe2298ed20e9798.jpg)  
Figure 1: Overview of the proposed CAB. The numbers in the inner circle represent the proportion of data in each dimension, and the numbers in the outer circle represent the size of each dataset.

2018) and electronic health records (EHR) (Lee et al., 2022; Johnson et al., 2016; Pollard et al., 2018), to complete the analysis or diagnosis. However, previous works only focused on a simple scenario, with only limited types of tools to solve the problem (Shi et al., 2024; Li et al., 2024a; Tang et al., 2024). To approximate realistic clinical scenarios and evaluate the general capabilities of the agent in the medical field, we investigate existing public medical datasets and divide them according to the ability requirement of the agents. We built a benchmark term CAB, which contains five capacity dimensions and 18 tasks in total. The details about the definition of the five dimensions and the corresponding tasks can be found in Appendix B.

## 2.2 Clinical Toolbox

Based on the proposed CAB, we develop a toolbox that contains 15 types of tools to enable agents to handle diverse tasks. For example, knowledge databases in the clinical toolbox enhance the medical knowledge of the agent, and calculators give the agent the ability to calculate indicators accurately. In order to allow the agent to solve problems more flexibly, we did not limit the types and number of tools when solving a specific type of task. Compared with medical agents that limit the tools to complete tasks (Li et al., 2024a; Jin et al., 2024), our method can give the agent better generalization and scalability. The details of the clinical toolbox are discussed in Appendix B.2.

## 3 REFLECTOOL

In this section, we first formulate the problem of solving tasks in CAB with the clinical toolbox. Then, we introduce the optimization and inference stage of the proposed REFLECTOOL. The overview of the REFLECTOOL are shown in Figure 2.

## 3.1 Problem Formulations

In this work, we focus on addressing clinicalrelated tasks with tool-use agents. The task is composed of $\begin{array} { r } { \boldsymbol { \mathcal { X } } \ = \ \{ \boldsymbol { q } , \boldsymbol { \mathcal { Z } } \} } \end{array}$ and $y .$ , where $q$ is the instruction,  is the inputs with different formats, and $y$ is the ground-truth answer. The agents are required to leverage the input information and complete the task in a multi-step manner. For initialization, the action space of the agents is composed of a set of pre-built tool action ${ \mathcal { A } } _ { T } = \{ A _ { 1 } , A _ { 2 } , \ldots \}$ and three types of inner actions $\mathcal { A } _ { I } = \{ \mathrm { P l a n }$ , Think, Finish . The whole action space of the agent can be noted as follows:

$$
\mathcal {A} = \mathcal {A} _ {T} \cup \mathcal {A} _ {I},\tag{1}
$$

In the i-th step, the clinical agent takes action $a _ { i } \in { \mathcal { A } } .$ . The action<sup>1</sup> in the clinical agent setting can be treated as the function, giving the proper parameter and getting the observation results $o _ { i } =$ $a _ { i } ( \mathrm { p a r a m } _ { a _ { i } } )$ $\operatorname { p a r a m } _ { a _ { i } }$ indicates the parameters of the action controlled by the agents. The next step action follows the policy:

$$
a _ {i + 1} \sim \pi_ {\theta} (a | c _ {i}, \mathcal {X})\tag{2}
$$

where $a _ { 0 }$ is the first action and ✓ indicates the parameter of the agent. $c _ { i } = \{ a _ { 0 } , o _ { 0 } , . . . a _ { i } , o _ { i } \}$ is the trajectory history.

## 3.2 Optimization Stage

To enable the agent to better select and use the domain-specific tools, we choose a subset of samples to optimize the agent’s capacities. In the optimization stage, REFLECTOOL saves the successful trajectory into the long-term memory and collects the experience for each type of tool.

Specifically, the REFLECTOOL first attempts to solve the problem with the clinical toolbox and create the first trajectory $\mathcal { C } _ { 1 }$ . The agent then reflects on $\mathcal { C } _ { 1 }$ by comparing it with the groundtruth answer $y$ and producing a suggestion $\boldsymbol { \mathcal { S } }$ with $\operatorname { L L M } ( \mathcal { X } , \mathcal { C } _ { 1 } , y ) \to S .$ . Utilizing this suggestion, the agent regenerates a refined trajectory $\mathcal { C } _ { \mathrm { 2 } } \mathrm { : }$ $\operatorname { L L M } ( \mathcal { X } , \mathcal { C } _ { 1 } , \mathcal { S } ) \to \mathcal { C } _ { 2 }$ . If $C _ { 2 }$ successfully completes the task, the reflective trajectory will be saved into the long-term memory to assist the agent in solving similar problems during inference:

![](assets/b5247a3afc65d0e98c87d477f6698458efd61b3364d71717b5daddaa73cfce68.jpg)  
Figure 2: Overview of the REFLECTOOL.

$$
\mathcal {M} = \left\{ \begin{array}{l l} \mathcal {M} \cup \{\mathcal {X}, \mathcal {C} _ {2} \}, & y ^ {\mathcal {C} _ {2}} = y \\ \mathcal {M}, & y ^ {\mathcal {C} _ {2}} \neq y \end{array} \right.\tag{3}
$$

where $y ^ { \mathcal { C } _ { 2 } }$ indicates the prediction of trajectory $\mathcal { C } _ { 2 }$ For the successful $\mathcal { C } _ { 2 }$ , the agent turns to compare the usage of each action that appears in two trajectories, to generate action-wise suggestions

$$
\operatorname{LLM} (\mathcal {X}, \mathcal {C} _ {1}, \mathcal {C} _ {2}, y) \to \mathcal {E} _ {\mathcal {X}}\tag{4}
$$

Then, $\mathcal { E } _ { \mathcal { X } }$ will be merge into the tool-wise experience $\mathcal { E } = \{ E _ { 1 } , E _ { 2 } , . . . \} \cup \{ E _ { \mathrm { P l a n } } , E _ { \mathrm { T h i n k } } , E _ { \mathrm { F i n i s h } } \}$ where $E _ { i }$ is the experience of the $A _ { i }$ . The optimization process is shown in Algorithm 1.

## 3.3 Inference Stage

During the inference stage, REFLECTOOL utilizes the long-term memories and tool-wise experiences learned from the optimization stage to solve the task better. At first, REFLECTOOL retrieves similar cases from the long-term memory:

$$
\mathcal {M} (q) = \mathrm{TopK} _ {\max} (\mathrm{sim} (q, q _ {i} | q _ {i} \in \mathcal {M}))\tag{5}
$$

where $\mathrm { T o p K } _ { \operatorname* { m a x } }$ return the top k most similar elements from the long-term memory. sim( , ) is the similarity function with BM25 (Robertson et al., 2009) used in implementations. Then, the REFLEC-TOOL can take the action with the help of similar successful trajectories as below:

$$
a _ {i + 1} \sim \pi_ {\theta} (a | c _ {i}, \mathcal {X}, \mathcal {M} (q))\tag{6}
$$

The agent then solves the task with tool-wise reflection, where the verifier evaluates the agent’s action in each step according to the action-wise experience. Inspired by Snell et al. (2024), we adopt two types of verification methods, iterative refinement and candidate selection, to fully explore the effectiveness of tool-wise experience in the toolwise reflection process. in §5.2, we find that each variant has its own advantages: Iterative Refinement performs better when the model’s capabilities are limited, while Candidate Selection is more effective when the model is stronger, thereby maximizing the model’s potential.

<table><tr><td>Models</td><td>Know.</td><td>MM.</td><td>Num.</td><td>Data.</td><td>Trust.</td><td>Total</td></tr><tr><td colspan="7">Large Language Models</td></tr><tr><td>MedLlama3-8B</td><td>59.88</td><td>-</td><td>11.61</td><td>23.02</td><td>6.07</td><td>25.14</td></tr><tr><td>Qwen2-7B (Yang et al., 2024)</td><td>60.86</td><td>-</td><td>18.49</td><td>44.50</td><td>28.19</td><td>38.01</td></tr><tr><td>Llama3-8B (AI@Meta, 2024)</td><td>63.32</td><td>-</td><td>19.87</td><td>35.23</td><td>24.06</td><td>35.62</td></tr><tr><td>Llama3.1-8B (Dubey et al., 2024)</td><td>67.43</td><td>-</td><td>22.07</td><td>49.58</td><td>30.75</td><td>42.46</td></tr><tr><td>Qwen2-72B* (Yang et al., 2024)</td><td>72.90</td><td>-</td><td>31.07</td><td>50.61</td><td>40.45</td><td>48.76</td></tr><tr><td>Llama3.1-70B* (Dubey et al., 2024)</td><td>76.91</td><td>-</td><td>29.23</td><td>45.80</td><td>38.40</td><td>47.59</td></tr><tr><td>GPT-3.5-turbo (OpenAI, 2022)</td><td>63.64</td><td>-</td><td>19.18</td><td>24.26</td><td>18.17</td><td>31.31</td></tr><tr><td colspan="7">MultiModal Large Language Models</td></tr><tr><td>MiniCPM-V-2.6 (Yao et al., 2024)</td><td>56.29</td><td>56.53</td><td>4.60</td><td>13.86</td><td>15.12</td><td>29.28</td></tr><tr><td>InternVL-Chat-V1.5 (Chen et al., 2023b)</td><td>52.92</td><td>53.21</td><td>18.95</td><td>34.50</td><td>25.52</td><td>37.02</td></tr><tr><td>HuatuoGPT-Vision-7B (Chen et al., 2024)</td><td>60.96</td><td>66.24</td><td>9.07</td><td>42.73</td><td>26.36</td><td>41.07</td></tr><tr><td>HuatuoGPT-Vision-34B (Chen et al., 2024)</td><td>62.25</td><td>67.33</td><td>13.22</td><td>29.01</td><td>34.76</td><td>41.31</td></tr><tr><td>GPT-4o-mini (OpenAI, 2023)</td><td>73.65</td><td>48.47</td><td>29.61</td><td>50.05</td><td>57.91</td><td>51.94</td></tr><tr><td colspan="7">Agent (Qwen2-7B)</td></tr><tr><td>COT (Wei et al., 2022)</td><td>58.91</td><td>-</td><td>19.98</td><td>36.17</td><td>44.68</td><td>39.94</td></tr><tr><td>ReAct (Yao et al., 2023)</td><td>62.03</td><td>49.47</td><td>24.05</td><td>29.24</td><td>53.87</td><td>43.73</td></tr><tr><td>CRITIC (Gou et al., 2024)</td><td>56.61</td><td>53.87</td><td>24.49</td><td>37.35</td><td>47.54</td><td>43.97</td></tr><tr><td>Reflexion (Shinn et al., 2023)</td><td>60.92</td><td>56.95</td><td>20.83</td><td>37.41</td><td>50.14</td><td>45.25</td></tr><tr><td>REFLECTOOL (Iterative Refinement, n=2)</td><td>63.79†</td><td>60.83†</td><td>21.97†</td><td>51.65‡</td><td>48.60</td><td>49.37‡</td></tr><tr><td>REFLECTOOL (Candidates Selection, n=2)</td><td>62.81†</td><td>61.91‡</td><td>26.78‡</td><td>52.20‡</td><td>41.72</td><td>49.08‡</td></tr><tr><td colspan="7">Agent (Qwen2-72B*)</td></tr><tr><td>COT (Wei et al., 2022)</td><td>69.11</td><td>-</td><td>24.47</td><td>52.51</td><td>56.22</td><td>50.58</td></tr><tr><td>ReAct (Yao et al., 2023)</td><td>76.47</td><td>56.37</td><td>31.44</td><td>53.29</td><td>48.98</td><td>53.31</td></tr><tr><td>CRITIC (Gou et al., 2024)</td><td>74.01</td><td>54.96</td><td>30.92</td><td>55.15</td><td>46.69</td><td>52.35</td></tr><tr><td>Reflexion (Shinn et al., 2023)</td><td>76.79</td><td>60.95</td><td>31.99</td><td>58.37</td><td>53.75</td><td>56.37</td></tr><tr><td>REFLECTOOL (Iterative Refinement, n=2)</td><td>76.81</td><td>63.74‡</td><td>38.45†</td><td>63.51‡</td><td>54.65</td><td>59.43‡</td></tr><tr><td>REFLECTOOL (Candidates Selection, n=2)</td><td>76.27</td><td>62.70†</td><td>38.06†</td><td>64.54‡</td><td>56.73‡</td><td>59.66‡</td></tr></table>

Table 2: Experimental results of four types of models on Clinical Agent Bench. The ‘COT’ method indicates the agent runs without the pre-built tools. ‘\*’ indicates the models use 4-bit GPTQ quantization. ‘-’ means the model is not capable of solving such a task. The best results are Bold, while the second best results are underlining. and indicate the p-value $< 0 . 0 5$ and $< 0 . 0 1$ comparing with the strongest baseline Reflexion, respectively.

Iterative Refinement In the sequence refinement method, the verifier will keep refining the agent action until it achieves the max refine step. This process can be early-stopped if the verifier outputs an identical action at any refinement step. Specifically, the i-th step initial action $a _ { i } ^ { 0 }$ is generated as the Eq. 6. Then, the verifier will refine the action based on the tool-wise experience:

$$
a _ {i} ^ {j} = \mathrm{LLM} (c _ {i}, a _ {i} ^ {0: j - 1}, \mathcal {X}, \mathcal {M} (q), \mathcal {E} (a _ {i} ^ {0: j - 1}))\tag{7}
$$

and the final refined result is chosen as the action of the current step:

$$
a _ {i} = \left\{ \begin{array}{l l} a _ {i} ^ {j}, & \text { if } a _ {i} ^ {j} = a _ {i} ^ {j - 1} \\ a _ {i} ^ {n}, & \text { otherwise } \end{array} \right.\tag{8}
$$

where $j = 1 , 2 , . . . , n$ means the refinement step index, n is the max refinement step. The refined history $a _ { i } ^ { 0 : j } = \{ a _ { i } ^ { 0 } , a _ { i } ^ { 1 } , . . . , a _ { i } ^ { j } \}$ and $\mathcal { E } ( a _ { i } ^ { j } )$ indicates the corresponding experience of the action type.

Candidates Selection For the candidate selection method, REFLECTOOL first samples n candidate actions from the output space. Then, the verifier will select the most effective action from the candidate list $a _ { i } ^ { 0 : n }$ :

$$
a _ {i + 1} = \arg \max _ {a \in a _ {i} ^ {0: n}} p _ {\theta} (a | c _ {i}, \mathcal {X}, \mathcal {M} (q), \mathcal {E} (a _ {i} ^ {0: n}))\tag{9}
$$

where $p _ { \theta } ( \cdot )$ indicates the preference of the reflector. Here, n is the size of the candidate list.

## 4 Experiments

## 4.1 Baselines

To comprehensively validate the effectiveness of the proposed method, we select several types of methods as the baselines. Considering that the proposed agent bench covers a wide range of tasks and requires the models to leverage the input information in different formats, we only choose the methods with strong instruction-following capacity. The baselines include three types of methods: LLMs, MLLMs, and agent-based methods. For LLMs, we choose MedLlama3-8B<sup>2</sup>, Qwen2-7B/72B (Yang et al., 2024), Llama3- 8B (AI@Meta, 2024), Llama3.1-8B/70B (Dubey et al., 2024), and GPT-3.5-turbo (OpenAI, 2022). For MLLMs, we choose MiniCPM-V-2.6 (Yao et al., 2024), InternVL-Chat-V1.5 (Chen et al., 2023b), HuatuoGPT-Vision-7B/34B (Chen et al., 2024), and GPT-4o-mini (OpenAI, 2023). For agent-based methods, COT (Wei et al., 2022) and ReAct (Yao et al., 2023) indicate the agent solving the task without and with the pre-build toolbox, respectively. CRITIC (Gou et al., 2024) and Reflexion (Shinn et al., 2023) improve agent capacity with self-reflection methods.

<table><tr><td rowspan="2">Reflect Type</td><td colspan="2">Reflective Memory</td><td colspan="2">Tool-wise Reflection</td><td rowspan="2">PubMedQA</td><td rowspan="2">VQA-RAD</td><td rowspan="2">EHRSQL</td><td rowspan="2">MedMen</td><td rowspan="2">MedHalt</td><td rowspan="2">Avg.</td></tr><tr><td>Long-Term Memory</td><td>Memory Reflection</td><td>Step Reflection</td><td>Action Eperience</td></tr><tr><td rowspan="2">None</td><td>X</td><td>X</td><td>X</td><td>X</td><td>66.00</td><td>60.50</td><td>31.87</td><td>50.99</td><td>52.50</td><td>52.37</td></tr><tr><td>√</td><td>√</td><td>X</td><td>X</td><td>66.50</td><td>58.25</td><td>44.00</td><td>57.78</td><td>47.75</td><td>54.86</td></tr><tr><td rowspan="4">Iterative Refinement</td><td>X</td><td>X</td><td>√</td><td>√</td><td>68.50</td><td>60.00</td><td>40.50</td><td>52.27</td><td>45.00</td><td>53.25</td></tr><tr><td>√</td><td>X</td><td>√</td><td>√</td><td>69.50</td><td>58.00</td><td>47.00</td><td>54.09</td><td>48.00</td><td>55.32</td></tr><tr><td>√</td><td>√</td><td>√</td><td>X</td><td>66.50</td><td>56.00</td><td>46.00</td><td>53.18</td><td>49.50</td><td>54.24</td></tr><tr><td>√</td><td>√</td><td>√</td><td>√</td><td>68.00</td><td>58.50</td><td>46.00</td><td>57.06</td><td>55.50</td><td>57.01</td></tr><tr><td rowspan="4">Candidate Selection</td><td>X</td><td>X</td><td>√</td><td>√</td><td>69.50</td><td>59.50</td><td>33.33</td><td>51.38</td><td>52.50</td><td>53.24</td></tr><tr><td>√</td><td>X</td><td>√</td><td>√</td><td>67.00</td><td>59.00</td><td>38.29</td><td>58.76</td><td>54.00</td><td>55.41</td></tr><tr><td>√</td><td>√</td><td>√</td><td>X</td><td>67.50</td><td>57.00</td><td>45.34</td><td>60.72</td><td>47.50</td><td>55.61</td></tr><tr><td>√</td><td>√</td><td>√</td><td>√</td><td>69.50</td><td>61.00</td><td>48.16</td><td>60.24</td><td>62.50</td><td>60.28</td></tr></table>

Table 3: Ablation results of Refinement and Selection verification methods. All the experiments are conducted on Qwen2-72B. The modules of the REFLECTOOL contain Reflective Memory and Tool-wise Reflection.

## 4.2 Main Results

We choose the Qwen2 series models as the backbone of the REFLECTOOL for the promising performance in tool usage and select the model parameters with 7B and 72B to observe the impact of the model size. We show the average performance of each dimension in Table 2, and the complete results are shown in Table 10. For the intragroup comparison, Qwen2-72B and GPT-4o-mini achieve the best performance in LLM-based and MLLMbased methods, respectively. For the agent-based method, REFLECTOOL surpasses the strong baseline method, Reflexion, with at least 3 points with both Qwen2-7B/72B. As both methods are based on self-reflection, these results highlight the advantage of the REFLECTOOL in using the domain tool. Besides, both types of tool-wise reflection methods show similar results when the reflection size is 2. For intergroup comparison, though MLLM-based methods are capable of Multi-modal tasks, they fall short in Numerical Analysis and Data Understanding. It is noteworthy that REFLECTOOL surpasses the base models with more than 10 points on both Qwen2-7B/72B, showing the effectiveness of the proposed methods again.

## 4.3 Ablation

To validate the effectiveness and the impact of each module in REFLECTOOL, we conduct the ablation experiments on the subset of CAB. We randomly select 200 samples from one dataset for each dimension. The results of the iterative refinement and the candidate selection are both shown in Table 3. The selection methods perform better than the refinement methods in most cases. It is observed that the reflective long-term memory plays the most important role in REFLECTOOL, and its absence leads to performance degradation with nearly 4 points for refinement and 7 points for selection. Besides, the action-wise reflection also shows its importance. These results show the effectiveness of each module in the proposed REFLECTOOL.

## 5 Analysis

In this section, all experiments are conducted on the same subset as the ablation experiments.

## 5.1 Effect of Optimization Step

In this section, we investigate the impact of the optimization step, which indicates the number of tasks completed during the optimization stage. Each successful task can provide one memory item and a list of tool-wise suggestions. A larger optimization step implies that the model will have larger long-term memory and accumulate more tool-wise experience. The results are shown in Figure 3. Both Iterative Refinement and Candidate Selection show a general improvement in performance as the number of optimization steps increases. This indicates that the optimization stage effectively enhances the agents’ capabilities. Besides, at the initial optimization step, Candidate Selection already has a significant performance advantage over Iterative Refinement, with an average performance of around 62.5 compared to approximately 58. This difference highlights that even without optimization, Candidate Selection is a more effective strategy, likely due to its inherent ability to evaluate multiple options before making a decision.

![](assets/9d1f1d8df0f5c1eaa268d2f2613a70bb01746007dc7b7ccf3a4ade979e55f458.jpg)

Figure 3: Impact of the optimization step on refinement and selection methods. The average performance is calculated using the same datasets in the ablation study.  
![](assets/4acadc7aa4b79e02a8a0b7d21a1cdab4ae0b86ce3fcec7479e5bfa2bbc84e3cc.jpg)

![](assets/2b3edc5b782b119353c04436bf84f7e85b3e9155c3e2916e782d39504bb28991.jpg)  
Figure 4: Impact of the verification size on refinement and selection methods. The average performance is calculated using the same datasets in the ablation study.

## 5.2 Size of Verification methods

The verification size n indicates the max refinement step for iterative refinement and the size of the candidate list for the candidate selection. We conduct experiments to explore the performance boundary of the two verification methods as the computational requirements increase. The results are shown in Figure 4. For iterative refinement, it achieves the best performance when n reaches 2, with decreasing performance as n grows. Additionally, although its ability to enhance already good actions is limited, it yields significant improvements when no memory is present, indicating its strong capability to enhance suboptimal actions.

<table><tr><td>Few-shot</td><td>Methods</td><td>Avg.</td></tr><tr><td rowspan="5">Standard</td><td>ReAct (Yao et al., 2023)</td><td>57.50</td></tr><tr><td>Reflexion (Gou et al., 2024)</td><td>56.87</td></tr><tr><td>CRITIC (Gou et al., 2024)</td><td>50.78</td></tr><tr><td>REFLECTOOL (Iterative Refinement)</td><td>59.07</td></tr><tr><td>REFLECTOOL (Candidate Selection)</td><td>60.72</td></tr><tr><td rowspan="5">Long-Term Memory</td><td>ReAct (Yao et al., 2023)</td><td>60.73</td></tr><tr><td>Reflexion (Gou et al., 2024)</td><td>62.20</td></tr><tr><td>CRITIC (Gou et al., 2024)</td><td>57.35</td></tr><tr><td>REFLECTOOL (Iterative Refinement)</td><td>59.76</td></tr><tr><td>REFLECTOOL (Candidate Selection)</td><td>63.31</td></tr></table>

Table 4: Impact of the long-term memory on agentbased methods. Note that the baseline methods only adopt the success trajectories from the long-term memory instead of the tool-wise experience. ‘Standard’ indicates the few-shot sample is a fixed successful trajectory.

For candidate selection, its performance steadily improves as the verification size increases, with performance gains exceeding 4 points at most. In contrast to iterative refinement, candidate selection shows greater improvement when memory is present. This is because the demonstrations from long-term memory effectively enhance the quality of candidate actions, allowing candidate selection to pick better actions. A comparative analysis reveals that candidate selection performs better in the presence of memory, whereas iterative refinement is more effective at improving the model’s performance in the absence of memory.

## 5.3 Impact of the Long-Term Memory

To better investigate the impact of long-term memory, we compare the proposed REFLECTOOL and other agent-based methods under different types of few-shot. As shown in Table 4, long-term memory can effectively improve the performance of all agent-based methods. However, the proposed methods, REFLECTOOL, still outperform all baselines with both types of few-shot samples. The results again show the effectiveness of the tool-wise reflection mechanism.

## 5.4 Tool Distribution in Trajectory

To better investigate the impact of REFLECTOOL on tool selection, we visualize the tool distribution of different methods across various datasets in Figure 5. Since the task types in the Trustworthiness dimension overlap with the other four dimensions, we exclude Trustworthiness in the visualization of the tool distribution. The figure illustrates the advantages of REFLECTOOL. First, REFLECTOOL encourages the model to invoke a higher proportion of tools. Specifically, in the Knowledge & Reasoning dimension, ReAct tends to directly answer questions rather than utilize tools, whereas both variants of REFLECTOOL exhibit a higher rate of tool usage, leading to better task completion. Second, REFLEC-TOOL leads to more frequent use of similar types of tools. In the Knowledge dimension, ReAct and CRITIC tend to use only a limited number of tools from the same dimension without attempting to leverage different tools to solve problems. This makes the model susceptible to the limitations of individual tools. In contrast, REFLECTOOL uses multiple tools of the same type to integrate information from diverse sources, thereby improving task performance. Finally, REFLECTOOL also demonstrates a higher proportion of invoking tools from different categories. This indicates that REFLEC-TOOL is more flexible in tool usage, being capable of experimenting with a broader range of tools to solve problems.

![](assets/8de3516272858983bb55f740dbb896f15ea0a6a6092d2a3e2c465129e2f00152.jpg)  
Figure 5: Tool distributions of the agent-based methods on four types of tasks. The bars show the proportion of each tool used by the agent. The height of the bars represents the proportion of the action using tools (otherwise, it is the inner action, including Plan, Think, and Finish). The same color scheme indicates that the task type and tool match.

## 5.5 Tool Usage Error

Although we categorized tools based on the capability dimensions of the model (as shown in Table 9), using tools from other dimensions is not necessarily incorrect. For example, when addressing questions in the Knowledge dimension, it is reasonable to employ the NER model from the Data Understanding dimension to extract specialized terms, which can then be used to query a knowledge graph more effectively. However, there are still some cases of incorrect tool usage for specific tools: (1) invoking an MLLM without a medical image input, (2) using SQLCoder and DBManual without a database input, and (3) employing LongDocRAG without document file input. Based on these points, we analyze the behavior of different methods in selecting tools. As shown in Table 5, REFLECTOOL can significantly reduce the tool selection error on both step-level and task-level. The results support that the tool-wise reflection mechanism can improve agents’ ability to use appropriate domain tools.

<table><tr><td rowspan="2">Methods</td><td colspan="2">Tool Selection Error ↓</td></tr><tr><td>Step-Level</td><td>Task-Level</td></tr><tr><td>ReAct (Yao et al., 2023)</td><td>1.44</td><td>4.03</td></tr><tr><td>Reflexion (Gou et al., 2024)</td><td>0.92</td><td>1.67</td></tr><tr><td>CRITIC (Shinn et al., 2023)</td><td>0.24</td><td>0.33</td></tr><tr><td>REFLECTOOL (Iterative Refinement)</td><td>0.06</td><td>0.15</td></tr><tr><td>REFLECTOOL (Candidate Selection)</td><td>0.02</td><td>0.08</td></tr></table>

Table 5: Tool Selection Error among agent-based methods. ‘Step-Level’ indicates the error rate of tool selection in each step, and ‘Task-Level’ indicates the proportion of whether the tool selection errors happen in the instance reasoning process.

To further understand the distribution of tool selection errors, we separately counted the instances of invocation errors for different methods across tools and datasets. The results are shown in Table 6. From the perspective of tool types, it can be seen that errors mainly occur with three types of tools: SQLCoder, DBManual, and LongDocRAG. These tools require specific inputs to function, namely databases and uploaded files. Therefore, it is likely that the model misuses these tools when the corresponding inputs are missing. From the perspective of task types, errors are predominantly concentrated in LongHealth, EMRQA, and EHR tasks.

<table><tr><td rowspan="2">Methods</td><td colspan="4">Tools Error Rate</td><td colspan="10">Task Error Rate</td></tr><tr><td>SQLCoder</td><td>DBManual</td><td>LongDocRAG</td><td>Avg.</td><td>MedQA</td><td>MMLU</td><td>BioASQ</td><td>SLAKE</td><td>MedCalc</td><td>EHRSQL</td><td>MedMen</td><td>LongHealth</td><td>EMRQA</td><td>Avg.</td></tr><tr><td>ReAct</td><td>11.99</td><td>0.00</td><td>5.86</td><td>5.95</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.08</td><td>0.00</td><td>0.07</td><td>0.08</td><td>8.71</td><td>12.35</td><td>2.36</td></tr><tr><td>CRITIC</td><td>1.74</td><td>20.51</td><td>1.19</td><td>7.81</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.03</td><td>0.07</td><td>0.00</td><td>5.12</td><td>0.38</td><td>0.62</td></tr><tr><td>Reflexion</td><td>3.13</td><td>2.05</td><td>34.05</td><td>13.08</td><td>0.02</td><td>0.02</td><td>0.04</td><td>0.00</td><td>0.73</td><td>0.25</td><td>0.00</td><td>1.30</td><td>8.79</td><td>1.24</td></tr><tr><td>ReflecTool (Iterative Refinement)</td><td>0.02</td><td>0.00</td><td>6.40</td><td>2.14</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.21</td><td>0.02</td><td>0.00</td><td>0.00</td><td>0.43</td><td>0.07</td></tr><tr><td>ReflecTool (Candidate Selection)</td><td>0.07</td><td>0.00</td><td>1.95</td><td>0.67</td><td>0.00</td><td>0.02</td><td>0.04</td><td>0.00</td><td>0.11</td><td>0.02</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0.02</td></tr></table>

Table 6: Tool selection error rates with specific tool and task. Each value indicates the percentage of incorrect too selections made by the model when using that tool or performing that task. Columns with an entirely zero error rate have been omitted.

<table><tr><td>Methods</td><td>Avg.</td></tr><tr><td>ReAct (Yao et al., 2023)</td><td>55.85</td></tr><tr><td>Reflexion (Gou et al., 2024)</td><td>58.78</td></tr><tr><td>CRITIC (Gou et al., 2024)</td><td>57.29</td></tr><tr><td>REFLECTOOL (Iterative Refinement)</td><td>62.26</td></tr><tr><td>REFLECTOOL (Candidates Selection)</td><td>60.72</td></tr></table>

Table 7: Performance of agent-based methods with Llama3-70B-Instruction as the backbone.

<table><tr><td>Methods</td><td>Qwen2-7b</td><td>Qwen2-72b*</td></tr><tr><td>ReAct (Yao et al., 2023)</td><td>11.01</td><td>20.04</td></tr><tr><td>CRITIC (Gou et al., 2024)</td><td>4.33</td><td>17.87</td></tr><tr><td>Reflexion (Gou et al., 2024)</td><td>12.42</td><td>57.27</td></tr><tr><td>REFLECTOOL (Iterative Refinement)</td><td>11.95</td><td>47.90</td></tr><tr><td>REFLECTOOL (Candidate Selection)</td><td>11.26</td><td>28.56</td></tr></table>

Table 8: Runtime (seconds per sample) of the agentbased method in single-sample tests. Note that lower values indicate higher agent efficiency.

These tasks share common points of confusion because their input context is similar, but with different formats. For instance, both LongHealth and EMRQA involve contextual question answering, but LongHealth, due to its ultra-long context, must be uploaded as a file. This again confirms that the model’s ability to match other information and appropriate tool usage, aside from image inputs, is relatively weak. In such scenarios, REFLECTOOL can effectively identify the relationship between tools and their corresponding input information modalities, thereby preventing such errors. Besides, we also analyze the parameter error of tool usage in Appendix C.1.

## 5.6 Performance with Different Backbones

During our experiments, we found that the instruction-following capabilities of the Llama series models were inferior to those of the Qwen2 series models, often resulting in formatting errors. Therefore, we prioritized the Qwen series to implement our methodology. After carefully adjusting the prompts, we also tested the performance of

Agent-based methods on ablation subsets using the Llama3-70B-Instruction<sup>3</sup> model. The results in Table 7 showed that the proposed ReflecTool method is also effective on the Llama3-70B-Instruction model, demonstrating the generalization ability of this method across different models and thus indicating better application potential.

## 5.7 Time Cost Analysis

A practical method should enhance performance without incurring excessive resource consumption. It can be observed from Table 8 that for the strong baseline Reflxion, ReflecTool consumes less time on both 7b and 70b models. It’s noteworthy that Candidates Selection is faster than Iteration Refinement, which is due to the higher degree of parallelism in the former. Besides, the time consumption of CRITIC is less for it does not utilize too many tools to solve tasks in many cases. Given that tool invocation requires more time compared to decision-making by large models (for instance, MedRAG requires retrieval, and UMLS needs internet access), this leads to lower time consumption but poor performance. In summary, ReflecTool proves to be highly efficient from the perspective of resource consumption.

## 6 Conclusions

In this paper, we introduce CAB, a holistic benchmark for clinical agents comprising 18 tasks across five key dimensions. Building upon it, we propose REFLECTOOL, a reflection-aware tool-augmented framework that optimizes tool utilization through long-term memory and tool-wise verification. To adaptively improve agent performance given varying backbones, we adopt Iterative Refinement and Candidate Selection to verify actions. Empirical results show that REFLECTOOL outperforms existing clinical agents, demonstrating superior adaptability and efficacy in real-world healthcare scenarios.

## Limitations

For CAB, while it provides an extensive evaluation covering 18 tasks across five key dimensions, it may not fully encompass the complexity of realworld clinical scenarios, which are highly diverse and continuously evolving. This requires ongoing updates to the benchmark to ensure relevance. Moreover, the medical tools collected for CAB do not perfectly align with the tasks in the evaluation. Although this misalignment introduces challenges, it also serves as a test of the model’s generalization capabilities and its ability to leverage available tools effectively. Regarding REFLECTOOL, the use of long-term memory has demonstrated clear benefits in ablation studies, enhancing the model’s decision-making through the retention of successful experiences. However, the reliability of the generated trajectories remains an issue. The fact that some trajectories lead to correct results does not guarantee that the underlying processes are entirely correct, suggesting that further work is needed to validate the accuracy of these trajectories to ensure they are consistently optimal.

## Ethic Considerations

In developing clinical agent REFLECTOOL, it is crucial to address ethical considerations that arise when utilizing AI in healthcare environments. Below are the key ethical considerations that have been taken into account:

Performance vs. Potential Risks: While RE-FLECTOOL demonstrates significant enhancements in clinical tool reasoning and and task performance, it is important to acknowledge the inherent limitations of AI models. These models can generate misleading information or "hallucinations," which could pose risks in clinical settings. Therefore, REFLECTOOL is not intended to replace medical professionals or provide definitive clinical decisions but rather to assist healthcare providers under appropriate supervision.

Data Ethics and Privacy Compliance All patient data has been anonymized, and informed consent was obtained for its use, ensuring full compliance with privacy policies and obtaining explicit permission for all data usage. Additionally, data usage has been approved by relevant ethics committees, ensuring compliance with ethical standards and privacy protection requirements.

## Acknowledgements

This work was supported by the National Key R&D Program of China (No. 2022ZD0162101) and STCSM (No. 22DZ2229005)

## References

Lisa Adams, Felix Busch, Tianyu Han, Jean-Baptiste Excoffier, Matthieu Ortala, Alexander Löser, Hugo JWL Aerts, Jakob Nikolas Kather, Daniel Truhn, and Keno Bressem. 2024. Longhealth: A question answering benchmark with long clinical documents. arXiv preprint arXiv:2401.14490.

AI@Meta. 2024. Llama 3 model card.

Anjanava Biswas and Wrick Talukdar. 2024. Intelligent clinical documentation: Harnessing generative ai for patient-centric clinical note generation. arXiv preprint arXiv:2405.18346.

Junying Chen, Ruyi Ouyang, Anningzhe Gao, Shunian Chen, Guiming Hardy Chen, Xidong Wang, Ruifei Zhang, Zhenyang Cai, Ke Ji, Guangjun Yu, Xiang Wan, and Benyou Wang. 2024. Huatuogpt-vision, towards injecting medical visual knowledge into multimodal llms at scale. CoRR, abs/2406.19280.

Zeming Chen, Alejandro Hernández Cano, Angelika Romanou, Antoine Bonnet, Kyle Matoba, Francesco Salvi, Matteo Pagliardini, Simin Fan, Andreas Köpf, Amirkeivan Mohtashami, et al. 2023a. Meditron-70b: Scaling medical pretraining for large language models. arXiv preprint arXiv:2311.16079.

Zhe Chen, Yusheng Liao, Shuyang Jiang, Pingjie Wang, Yiqiu Guo, Yanfeng Wang, and Yu Wang. 2025. Towards omni-rag: Comprehensive retrieval-augmented generation for large language models in medical applications. arXiv preprint arXiv:2501.02460.

Zhe Chen, Jiannan Wu, Wenhai Wang, Weijie Su, Guo Chen, Sen Xing, Muyan Zhong, Qinglong Zhang, Xizhou Zhu, Lewei Lu, Bin Li, Ping Luo, Tong Lu, Yu Qiao, and Jifeng Dai. 2023b. Internvl: Scaling up vision foundation models and aligning for generic visual-linguistic tasks. arXiv preprint arXiv:2312.14238.

Abhimanyu Dubey, Abhinav Jauhri, Abhinav Pandey, Abhishek Kadian, Ahmad Al-Dahle, Aiesha Letman, Akhil Mathur, Alan Schelten, Amy Yang, Angela Fan, Anirudh Goyal, Anthony Hartshorn, Aobo Yang, Archi Mitra, Archie Sravankumar, Artem Korenev, Arthur Hinsvark, Arun Rao, Aston Zhang, Aurélien Rodriguez, Austen Gregerson, Ava Spataru, Baptiste Rozière, Bethany Biron, Binh Tang, Bobbie Chern, Charlotte Caucheteux, Chaya Nayak, Chloe Bi, Chris Marra, Chris McConnell, Christian Keller, Christophe Touret, Chunyang Wu, Corinne Wong, Cristian Canton Ferrer, Cyrus Nikolaidis, Damien Allonsius, Daniel Song, Danielle Pintz, Danny Livshits, David Esiobu, Dhruv Choudhary, Dhruv Mahajan,

Diego Garcia-Olano, Diego Perino, Dieuwke Hupkes, Egor Lakomkin, Ehab AlBadawy, Elina Lobanova, Emily Dinan, Eric Michael Smith, Filip Radenovic, Frank Zhang, Gabriel Synnaeve, Gabrielle Lee, Georgia Lewis Anderson, Graeme Nail, Grégoire Mialon, Guan Pang, Guillem Cucurell, Hailey Nguyen, Hannah Korevaar, Hu Xu, Hugo Touvron, Iliyan Zarov, Imanol Arrieta Ibarra, Isabel M. Kloumann, Ishan Misra, Ivan Evtimov, Jade Copet, Jaewon Lee, Jan Geffert, Jana Vranes, Jason Park, Jay Mahadeokar, Jeet Shah, Jelmer van der Linde, Jennifer Billock, Jenny Hong, Jenya Lee, Jeremy Fu, Jianfeng Chi, Jianyu Huang, Jiawen Liu, Jie Wang, Jiecao Yu, Joanna Bitton, Joe Spisak, Jongsoo Park, Joseph Rocca, Joshua Johnstun, Joshua Saxe, Junteng Jia, Kalyan Vasuden Alwala, Kartikeya Upasani, Kate Plawiak, Ke Li, Kenneth Heafield, Kevin Stone, and et al. 2024. The llama 3 herd of models. CoRR, abs/2407.21783.

Zhibin Gou, Zhihong Shao, Yeyun Gong, Yelong Shen, Yujiu Yang, Nan Duan, and Weizhu Chen. 2024. CRITIC: large language models can self-correct with tool-interactive critiquing. In The Twelfth International Conference on Learning Representations, ICLR 2024, Vienna, Austria, May 7-11, 2024. Open-Review.net.

Dan Hendrycks, Collin Burns, Steven Basart, Andy Zou, Mantas Mazeika, Dawn Song, and Jacob Steinhardt. Measuring massive multitask language understanding. In International Conference on Learning Representations.

Shengding Hu, Yuge Tu, Xu Han, Chaoqun He, Ganqu Cui, Xiang Long, Zhi Zheng, Yewei Fang, Yuxiang Huang, Weilin Zhao, et al. 2024a. Minicpm: Unveiling the potential of small language models with scalable training strategies. arXiv preprint arXiv:2404.06395.

Yutao Hu, Tianbin Li, Quanfeng Lu, Wenqi Shao, Junjun He, Yu Qiao, and Ping Luo. 2024b. Omnimedvqa: A new large-scale comprehensive evaluation benchmark for medical lvlm. In Proceedings ofthe IEEE/CVF Conference on Computer Vision and Pat tern Recognition, pages 22170–22183.

Di Jin, Eileen Pan, Nassim Oufattole, Wei-Hung Weng, Hanyi Fang, and Peter Szolovits. 2021. What disease does this patient have? a large-scale open domain question answering dataset from medical exams. Ap plied Sciences, 11(14):6421.

Qiao Jin, Bhuwan Dhingra, Zhengping Liu, William Cohen, and Xinghua Lu. 2019. Pubmedqa: A dataset for biomedical research question answering. In Proceedings ofthe 2019 Conference on Empirical Methods in Natural Language Processing and the 9th In ternational Joint Conference on Natural Language Processing (EMNLP-IJCNLP), pages 2567–2577.

Qiao Jin, Zhizheng Wang, Yifan Yang, Qingqing Zhu, Donald Wright, Thomas Huang, W John Wilbur, Zhe He, Andrew Taylor, Qingyu Chen, et al. 2024.

Agentmd: Empowering language agents for risk prediction with large-scale clinical tool learning. arXiv preprint arXiv:2402.13225.

Alistair EW Johnson, Tom J Pollard, Lu Shen, Li-wei H Lehman, Mengling Feng, Mohammad Ghassemi, Benjamin Moody, Peter Szolovits, Leo Anthony Celi, and Roger G Mark. 2016. Mimic-iii, a freely accessible critical care database. Scientific data, 3(1):1–9.

HyoJe Jung, Yunha Kim, Heejung Choi, Hyeram Seo, Minkyoung Kim, JiYe Han, Gaeun Kee, Seohyun Park, Soyoung Ko, Byeolhee Kim, et al. 2024. Enhancing clinical efficiency through llm: Discharge note generation for cardiac patients. arXiv preprint arXiv:2404.05144.

Nikhil Khandekar, Qiao Jin, Guangzhi Xiong, Soren Dunn, Serina S Applebaum, Zain Anwar, Maame Sarfo-Gyamfi, Conrad W Safranek, Abid A Anwar, Andrew Zhang, et al. 2024. Medcalc-bench: Evaluating large language models for medical calculations. arXiv preprint arXiv:2406.12036.

Anastasia Krithara, Anastasios Nentidis, Konstantinos Bougiatiotis, and Georgios Paliouras. 2023. Bioasqqa: A manually curated corpus for biomedical question answering. Scientific Data, 10(1):170.

Jason J Lau, Soumya Gayen, Asma Ben Abacha, and Dina Demner-Fushman. 2018. A dataset of clinically generated visual questions and answers about radiology images. Scientific data, 5(1):1–10.

Gyubok Lee, Hyeonji Hwang, Seongsu Bae, Yeonsu Kwon, Woncheol Shin, Seongjun Yang, Minjoon Seo, Jong-Yeup Kim, and Edward Choi. 2022. Ehrsql: A practical text-to-sql benchmark for electronic health records. Advances in Neural Information Processing Systems, 35:15589–15601.

Binxu Li, Tiankai Yan, Yuanting Pan, Zhe Xu, Jie Luo, Ruiyang Ji, Shilong Liu, Haoyu Dong, Zihao Lin, and Yixin Wang. 2024a. Mmedagent: Learning to use medical tools with multi-modal agent. arXiv preprint arXiv:2407.02483.

Chunyuan Li, Cliff Wong, Sheng Zhang, Naoto Usuyama, Haotian Liu, Jianwei Yang, Tristan Naumann, Hoifung Poon, and Jianfeng Gao. 2024b. Llava-med: Training a large language-and-vision assistant for biomedicine in one day. Advances in Neural Information Processing Systems, 36.

Yusheng Liao, Yutong Meng, Yuhao Wang, Hongcheng Liu, Yanfeng Wang, and Yu Wang. 2024. Automatic interactive evaluation for large language models with state aware patient simulator. arXiv preprint arXiv:2403.08495.

Xinna Lin, Siqi Ma, Junjie Shan, Xiaojing Zhang, Shell Xu Hu, Tiannan Guo, Stan Z Li, and Kaicheng Yu. 2024. Biokgbench: A knowledge graph checking benchmark of ai agent for biomedical science. arXiv preprint arXiv:2407.00466.

Bo Liu, Li-Ming Zhan, Li Xu, Lin Ma, Yan Yang, and Xiao-Ming Wu. 2021. Slake: A semantically-labeled knowledge-enhanced dataset for medical visual question answering. In 2021 IEEE 18th International Symposium on Biomedical Imaging (ISBI), pages 1650–1654. IEEE.

Jun Ma, Yuting He, Feifei Li, Lin Han, Chenyu You, and Bo Wang. 2024. Segment anything in medical images. Nature Communications, 15(1):654.

Sunil Mohan and Donghui Li. 2019. Medmentions: A large biomedical corpus annotated with umls concepts. arXiv preprint arXiv:1902.09476.

Harsha Nori, Nicholas King, Scott Mayer McKinney, Dean Carignan, and Eric Horvitz. 2023. Capabilities of gpt-4 on medical challenge problems. arXiv preprint arXiv:2303.13375.

OpenAI. 2022. Chatgpt: Optimizing language models for dialogue. Website. https://openai.com/ blog/chatgpt.

OpenAI. 2023. GPT-4 technical report. CoRR, abs/2303.08774.

Ankit Pal, Logesh Kumar Umapathi, and Malaikannan Sankarasubbu. 2023. Med-halt: Medical domain hallucination test for large language models. arXiv preprint.

Anusri Pampari, Preethi Raghavan, Jennifer Liang, and Jian Peng. 2018. emrqa: A large corpus for question answering on electronic medical records. In Proceed ings ofthe 2018 Conference on Empirical Methods in Natural Language Processing, pages 2357–2368.

Tom J Pollard, Alistair EW Johnson, Jesse D Raffa, Leo A Celi, Roger G Mark, and Omar Badawi. 2018. The eicu collaborative research database, a freely available multi-center database for critical care research. Scientific data, 5(1):1–13.

Stephen Robertson, Hugo Zaragoza, et al. 2009. The probabilistic relevance framework: Bm25 and beyond. Foundations and Trends® in Information Retrieval, 3(4):333–389.

Wenqi Shi, Ran Xu, Yuchen Zhuang, Yue Yu, Jieyu Zhang, Hang Wu, Yuanda Zhu, Joyce Ho, Carl Yang, and May D Wang. 2024. Ehragent: Code empowers large language models for complex tabular rea soning on electronic health records. arXiv preprint arXiv:2401.07128.

Noah Shinn, Federico Cassano, Ashwin Gopinath, Karthik Narasimhan, and Shunyu Yao. 2023. Reflexion: language agents with verbal reinforcement learning. In Advances in Neural Information Processing Systems 36: Annual Conference on Neural Information Processing Systems 2023, NeurIPS 2023, New Orleans, LA, USA, December 10 - 16, 2023.

Karan Singhal, Shekoofeh Azizi, Tao Tu, S Sara Mahdavi, Jason Wei, Hyung Won Chung, Nathan Scales, Ajay Tanwani, Heather Cole-Lewis, Stephen Pfohl, et al. 2023. Large language models encode clinical knowledge. Nature, 620(7972):172–180.

Charlie Snell, Jaehoon Lee, Kelvin Xu, and Aviral Kumar. 2024. Scaling llm test-time compute optimally can be more effective than scaling model parameters. arXiv preprint arXiv:2408.03314.

Xiangru Tang, Anni Zou, Zhuosheng Zhang, Ziming Li, Yilun Zhao, Xingyao Zhang, Arman Cohan, and Mark Gerstein. 2024. Medagents: Large language models as collaborators for zero-shot medical reasoning. In ICLR 2024 Workshop on Large Language Model (LLM) Agents.

Tao Tu, Anil Palepu, Mike Schaekermann, Khaled Saab, Jan Freyberg, Ryutaro Tanno, Amy Wang, Brenna Li, Mohamed Amin, Nenad Tomasev, et al. 2024. Towards conversational diagnostic ai. arXiv preprint arXiv:2401.05654.

Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten Bosma, Brian Ichter, Fei Xia, Ed H. Chi, Quoc V. Le, and Denny Zhou. 2022. Chain-of-thought prompting elicits reasoning in large language models. In Advances in Neural Information Processing Systems 35: Annual Conference on Neural Information Processing Systems 2022, NeurIPS 2022, New Orleans, LA, USA, November 28 - December 9, 2022.

Jinge Wu, Yunsoo Kim, and Honghan Wu. 2024. Hallucination benchmark in medical visual question answering. arXiv preprint arXiv:2401.05827.

Yunfei Xie, Ce Zhou, Lang Gao, Juncheng Wu, Xianhang Li, Hong-Yu Zhou, Sheng Liu, Lei Xing, James Zou, Cihang Xie, and Yuyin Zhou. 2024. Medtrinity-25m: A large-scale multimodal dataset with multigranular annotations for medicine. Preprint, arXiv:2408.02900.

Guangzhi Xiong, Qiao Jin, Zhiyong Lu, and Aidong Zhang. 2024. Benchmarking retrieval-augmented generation for medicine. In Findings ofthe Associationfor Computational Linguistics ACL 2024, pages 6233–6251, Bangkok, Thailand and virtual meeting. Association for Computational Linguistics.

An Yang, Baosong Yang, Binyuan Hui, Bo Zheng, Bowen Yu, Chang Zhou, Chengpeng Li, Chengyuan Li, Dayiheng Liu, Fei Huang, Guanting Dong, Haoran Wei, Huan Lin, Jialong Tang, Jialin Wang, Jian Yang, Jianhong Tu, Jianwei Zhang, Jianxin Ma, Jin Xu, Jingren Zhou, Jinze Bai, Jinzheng He, Junyang Lin, Kai Dang, Keming Lu, Keqin Chen, Kexin Yang, Mei Li, Mingfeng Xue, Na Ni, Pei Zhang, Peng Wang, Ru Peng, Rui Men, Ruize Gao, Runji Lin, Shijie Wang, Shuai Bai, Sinan Tan, Tianhang Zhu, Tianhao Li, Tianyu Liu, Wenbin Ge, Xiaodong Deng, Xiaohuan Zhou, Xingzhang Ren, Xinyu Zhang, Xipin Wei, Xuancheng Ren, Yang Fan, Yang Yao, Yichang Zhang, Yu Wan, Yunfei Chu, Yuqiong Liu, Zeyu

Cui, Zhenru Zhang, and Zhihao Fan. 2024. Qwen2 technical report. arXiv preprint arXiv:2407.10671.

Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik R. Narasimhan, and Yuan Cao. 2023. React: Synergizing reasoning and acting in language models. In The Eleventh International Conference on Learning Representations, ICLR 2023, Kigali, Rwanda, May 1-5, 2023. OpenReview.net.

Yuan Yao, Tianyu Yu, Ao Zhang, Chongyi Wang, Junbo Cui, Hongji Zhu, Tianchi Cai, Haoyu Li, Weilin Zhao, Zhihui He, et al. 2024. Minicpm-v: A gpt-4v level mllm on your phone. arXiv preprint arXiv:2408.01800.

Ling Yue and Tianfan Fu. 2024. Ct-agent: Clinical trial multi-agent with large language model-based reasoning. arXiv preprint arXiv:2404.14777.

## A Related Works

## A.1 Medical Agentic Methods

There are plenty of works that adopt the clinical agent to solve specific clinical scenarios. One type of work focuses on medical knowledge argument with retrieval from the knowledge base. For example, BioKGBench (Lin et al., 2024) proposes a knowledge graph-based evaluation benchmark to mitigate hallucination issues by testing biomedical agents on scientific claim verification and their abil ity to interact with structured knowledge graphs. MedRAG (Xiong et al., 2024) presents a retrievalaugmented generation (RAG) benchmark designed to evaluate medical question-answering systems, focusing on reducing hallucinations and enhancing factual accuracy by incorporating external knowl edge retrieval. Other types of work attempt to lever age the multi-modal information from medical images. CT-Agent (Yue and Fu, 2024) introduces a clinical multi-agent system that autonomously manages clinical trial tasks, employing advanced reasoning methods to enhance efficiency in the clin ical trial process. MMedAgent (Li et al., 2024a) in tegrates multiple specialized tools to create a multi modal medical AI agent capable of handling di verse medical imaging and language tasks, thereby demonstrating superior performance over existing methods across several medical modalities. EHRAgent (Shi et al., 2024) addresses challenges related to electronic health records (EHRs) by enabling LLMs to autonomously generate, execute, and re fine code, allowing for more efficient multi-step reasoning over EHR data. Different from the agents mentioned above, MedAgents (Tang et al., 2024) adopts a role-playing multi-agent framework to simulate expert collaboration instead of using clin ical tools and effectively improves the zero-shot reasoning capabilities of LLMs in the medical do main without requiring extensive fine-tuning.

## A.2 Medical Large Language Models

## B ClinicalAgent Bench

The case demonstrations of the ClinicalAgent Bench are shown in Figure 6. In this section, we introduce the detailed information of the dataset and the pre-built clinical toolbox.

<div class="mineru-algorithm" style="white-space: pre-wrap; font-family:monospace;">
Algorithm 1 Optimization Step of REFLECTOOL
Require: Clinical task input $\mathcal{X} = \{q, \mathcal{I}\}$ and ground-truth answer $y$
1: Initialize empty long-term memory $\mathcal{M}$ and tool-wise experience $\mathcal{E}$
2: Generate initial trajectory $\mathcal{C}_1$: LLM($\mathcal{X}$) $\rightarrow$ $\mathcal{C}_1$
3: Compare $\mathcal{C}_1$ with ground-truth $y$ and generate suggestion $\mathcal{S}$: LLM($\mathcal{X}, \mathcal{C}_1, y$) $\rightarrow$ $\mathcal{S}$.
4: Regenerate refine trajectory $\mathcal{C}_2$ based on suggestion: LLM($\mathcal{X}, \mathcal{C}_1, \mathcal{S}$) $\rightarrow$ $\mathcal{C}_2$
5: if $y^{\mathcal{C}_2} = y$ then
6: Save the successful trajectory into long-term memory:
$\mathcal{M} \cup \{\mathcal{X}, \mathcal{C}_2\} \rightarrow \mathcal{M}$
7: Generate action-wise suggestions:
LLM($\mathcal{X}, \mathcal{C}_1, \mathcal{C}_2, y$) $\rightarrow$ $\mathcal{E}_{\mathcal{X}}$
8: for all $a \in \mathcal{A}$ do
9: Merge each tool suggestion into the corresponding tool-wise experience:
LLM($\mathcal{E}(a), \mathcal{E}_{\mathcal{X}}(a)$) $\rightarrow$ $\mathcal{E}(a)$
10: end for
11: end if
12: Return updated long-term memory $\mathcal{M}$ and tool-wise experience $\mathcal{E}$
</div>

## B.1 Details of Datasets

## B.1.1 Knowledge&Reasoning

Medical knowledge and reasoning is a critical capacity for the medical agent to analyze and complete tasks (Jin et al., 2019). To evaluate the agent performance, we choose PubMedQA (Jin et al., 2019), MMLU (Hendrycks et al.), and BioASQ (Krithara et al., 2023) for the medical knowledge question-answering (QA) and MedQA (Jin et al., 2021) for medical reasoning.

MedQA MedQA (Jin et al., 2021) is a medical question-answering dataset primarily used for evaluating large language models’ understanding of medical knowledge. It includes questions similar to those in medical exams, testing the model’s ability to answer complex, domain-specific questions.

MMLU MMLU (Hendrycks et al.) (Massive Multitask Language Understanding) dataset consists of questions across 57 subjects, including both STEM and humanities. It is designed to evaluate models on a broad spectrum of human knowledge, making it suitable for testing general-purpose large language models on diverse subject matters.

BioASQ BioASQ (Krithara et al., 2023) is a biomedical question-answering challenge that provides a benchmark for testing systems on biomedical information retrieval and reasoning. The dataset contains factoids, lists, and summary questions based on biomedical texts and PubMed articles, making it valuable for evaluating biomedical understanding.

PubMedQA PubMedQA (Jin et al., 2019) is a dataset that comprises question-answer pairs extracted from biomedical literature abstracts, specifically PubMed. It focuses on testing models’ abilities to provide correct answers to research questions based on evidence from scientific articles, supporting biomedical inference and comprehension tasks.

## B.1.2 MultiModal

Medical images<sup>4</sup> are a common form of information in clinical scenarios. Many diseases require a combination of image examination information to be accurately diagnosed. Here, we choose three datasets with 12 modalities and a wide range of task types. We chose SLAKE (Liu et al., 2021) and VQA-RAD (Lau et al., 2018) for the open-ended QA and OmniMedVQA (Hu et al., 2024b) for the closed-ended QA.

![](assets/49976cff5e701966375427c2cf50a1ad76ba5ee62909051188af0afc982d1ca8.jpg)  
Figure 6: Overview of the ClinicalAgent Bench.

VQA-RAD VQA-RAD (Lau et al., 2018) is a manually constructed medical visual question answering (VQA) dataset that consists of 451 radiology images along with naturally occurring questions generated by clinicians and reference answers. This dataset aims to help AI systems better understand radiology images and assist in clinical decision-making.

SLAKE SLAKE (Liu et al., 2021) is a semantically-labeled, knowledge-enhanced dataset for medical visual question answering, containing 642 images and 14,028 question-answer pairs. It includes a variety of modalities, annotated by experienced physicians, and provides comprehensive semantic labels such as segmentation and bounding boxes. We only choose the English questions part of the test subset, resulting in 1061 instances.

OmniMedQA OmniMedQA (Hu et al., 2024b) is a large-scale medical visual question-answering benchmark with 118,010 images and 127,995 question-answer pairs collected from 73 medical datasets covering 12 different imaging modalities and more than 20 anatomical regions. Here, we randomly sample the 1000 instances from the public part of the dataset and keep the data component proportions to avoid bias.

## B.1.3 Numerical Analysis

Numerical analysis mainly contains two perspectives. One is the numerical calculation, commonly used in test results analysis and risk prediction (Jin et al., 2024). We choose MedCalc (Khandekar et al., 2024) to evaluate the agent capacity in equation-based and rule-based calculation tasks. The other is the database operation and understanding, where agents need to gather patient information from the EHR database to conduct further analysis. We evaluate agents on EHRSQL (Lee et al., 2022), MIMIC-III (Johnson et al., 2016), eICU (Pollard et al., 2018).

MedCalc MedCalc (Khandekar et al., 2024) is a novel dataset designed to evaluate the medical calculation capabilities of large language models (LLMs). It contains over 1,000 manually reviewed instances spanning 55 different medical calculation tasks, including both rule-based and equationbased calculations. Each instance provides a patient note, a specific medical question, a ground truth answer, and a step-by-step explanation. The dataset aims to assess LLMs’ ability to handle medical calculations commonly used in clinical settings, focusing on arithmetic computations and extraction of relevant attributes from patient notes.

<table><tr><td>Type</td><td>Id.</td><td>Name</td><td>Descriptions</td><td>Input</td></tr><tr><td rowspan="3">Inner Tools</td><td>1</td><td>Plan</td><td>Plan step-by-step solutions for a task. Usually take at the beginning of the solving process.</td><td>A</td></tr><tr><td>2</td><td>Think</td><td>Conduct thinking and reasoning process for solving task.</td><td>A</td></tr><tr><td>3</td><td>Finish</td><td>Complete the task with a response.</td><td>A</td></tr><tr><td rowspan="4">Knowledge Tools</td><td>4</td><td>Google Search</td><td>Using this action to search online content with google.</td><td>A</td></tr><tr><td>5</td><td>Medrag</td><td>Use this action to retrieve medical knowledge from the public, textbooks, and statpearls to solve problems.</td><td>A</td></tr><tr><td>6</td><td>DrugBank</td><td>Use this action to search the information about specific drug</td><td>A</td></tr><tr><td>7</td><td>UMLS</td><td>Use this action to query the definition and the related medical concept of the medical_terminology.</td><td>A</td></tr><tr><td rowspan="3">MultiModal Tools</td><td>8</td><td>HuatuoGPT</td><td>Use this action to gather information from the medical image with a medical-domain multi-modal large language model.</td><td>A</td></tr><tr><td>9</td><td>MedCaptioner</td><td>Use this action to generate a comprehensive caption for the medical image with a medical captioner.</td><td>A</td></tr><tr><td>10</td><td>MiniCPM</td><td>Use this action to gather information from the medical image with a general multi-modal large language model.</td><td>A</td></tr><tr><td rowspan="3">Numerical Tools</td><td>11</td><td>Calculator</td><td>Use this action to perform mathematical calculations.</td><td>A</td></tr><tr><td>12</td><td>DBManual</td><td>Use this action to obtain the SQL database description and usage method related to the query. This action is helpful when the SQLCoder cannot find the information.</td><td>A</td></tr><tr><td>13</td><td>SQLCoder</td><td>Use this action to gather the patient information from the sql_database. The SQLCoder will transfer the natural language query into the SQL command and get the information from the sql_database.</td><td>A</td></tr><tr><td rowspan="2">Data Tools</td><td>14</td><td>Spacy</td><td>Using this action to recognize the biomedical entities in the sentence.</td><td>A</td></tr><tr><td>15</td><td>LongDocRAG</td><td>Using this action to construct a retrieval knowledge base from the uploaded files and query the information from the knowledge base. The action can only be taken when the upload files are not None</td><td>A</td></tr></table>

Table 9: The description of the tools in the clinical toolbox. The column of Input shows the tools’ input format, which indicates the form of the information that the tool can leverage. Specifically, ‘!’ indicates free text, ‘! indicates the medical image, ‘"’ indicates the Python or SQL command, and ‘"’ indicates the documentation file. Input with two icons indicates the tools need two types of inputs.

EHRSQL EHRSQL (Lee et al., 2022) is a practical text-to-SQL benchmark designed for electronic health records (EHRs). It consists of 24,411 natural questions collected from 222 hospital staff, including physicians, nurses, and administrators, aimed at addressing various data retrieval needs from EHR databases. The dataset includes both answerable and unanswerable questions to evaluate trustworthy QA systems that can refuse unanswerable queries. Specifically, we only keep the answerable question in the dataset and putMed the unanswerable parts into the EHR-Halt dataset in the Trustworthiness capacity dimension.

MIMIC-III MIMIC-III (Johnson et al., 2016)<sup>5</sup> covers 38,597 patients and 49,785 hospital admissions information in critical care units at the Beth Israel Deaconess Medical Center ranging from 2001 to 2012. It includes deidentified administrative information such as demographics and highly granular clinical information, including vital signs, laboratory results, procedures, medications, caregiver notes, imaging reports, and mortality. Our datasets are derived from the code base of Lee et al. (2022). Specifically, we only keep the answerable question in the dataset and put the unanswerable parts into the EHR-Halt dataset in the Trustworthiness capacity dimension.

eICU Similar to MIMIC-III, eICU (Pollard et al., 2018)<sup>6</sup> includes over 200,000 admissions from multiple critical care units across the United States in 2014 and 2015. It contains unidentified administrative information following the US Health Insurance Portability and Accountability Act (HIPAA) standard and structured clinical data, including vital signs, laboratory measurements, medications, treatment plans, admission diagnoses, and medical histories. We also derive the dataset from the code base of Lee et al. (2022). Specifically, we only keep the answerable question in the dataset and put the unanswerable parts into the EHR-Halt dataset in the Trustworthiness capacity dimension.

## B.1.4 Data Understanding

Clinical data understanding is the focus of conventional medical natural language processing (NLP). Agents are required to extract the key information or relations from the redundant report to understand the patient stats better. Therefore, we choose the name entity recognition dataset MedMentions (Mohan and Li, 2019), information extraction dataset emrQA (Pampari et al., 2018), and long context QA dataset LongHealthQA (Adams et al., 2024) to evaluate the data understanding capacity of the agents.

MedMentions MedMentions (Mohan and Li, 2019) is a biomedical corpus consisting of over 4,000 abstracts sourced from PubMed and manually annotated with over 350,000 linked mentions of concepts from the Unified Medical Language System (UMLS). It covers a wide range of biomedical disciplines and includes over 3 million concepts from the UMLS 2017 release. MedMentions aims to support research in biomedical named entity recognition and entity linking, providing a rich resource for developing systems with broad coverage of biomedical concepts.

emrQA emrQA (Pampari et al., 2018) is a largescale question-answering (QA) dataset specifically designed for clinical notes. It is constructed by leveraging existing expert annotations from the i2b2<sup>7</sup> datasets, resulting in a dataset with over 1 million question-logical form pairs and more than 400,000 question-answer evidence pairs. emrQA aims to support the development of QA systems capable of understanding complex clinical narratives and providing answers based on longitudinal patient records. Here, we derive the emrQA dataset from Huggingface<sup>8</sup>.

LongHealthQA LongHealthQA (Adams et al., 2024) is a comprehensive benchmark designed to evaluate the capabilities of LLMs in processing and interpreting extensive clinical documentation. This benchmark consists of 20 detailed fictional patient cases across various diseases, with each case containing between 5,090 to 6,754 words. The LongHealthQA benchmark challenges LLMs with 400 multiple-choice questions categorized into information extraction, negation, and sorting, providing a robust assessment tool for LLMs in the healthcare context. In this paper, we simulate multiple documentation question-answering scenarios by randomly selecting numeral other cases and constructing the LongHealthQA with context longer than 22k tokens. There are 400 questions in LongHealthQA; we chose 200 as the optimization samples and the other as the test samples.

## B.1.5 Trustworthiness

For the application of the clinical agents, the trustworthiness of the response is very important. If clinical agents experience hallucinations while completing tasks, their responses may result in severe medical accidents. To comprehensively evaluate the hallucination that happened in the agents’ solving process, we choose four types of datasets to validate the trustworthiness in four types of tasks: MedHalt-Rht (Pal et al., 2023), MedVQA-Halt (Wu et al., 2024), EHR-Halt (Lee et al., 2022; Johnson et al., 2016; Pollard et al., 2018), and Long-Halt (Adams et al., 2024).

MedHalt-Rht Med-HALT (Medical Domain Hallucination Test) is a comprehensive benchmark and dataset for evaluating hallucination in large language models (LLMs) within the medical domain. It includes reasoning and memory-based hallucination tests, with data derived from multinational medical examinations such as AIIMS (India), USMLE (U.S.), and more. Med-HALT aims to improve the safety and reliability of LLMs in healthcare by evaluating their problem-solving and information retrieval abilities under scenarios that could induce hallucinations.

MedVQA-Halt This benchmark is designed to evaluate hallucination in medical visual question answering (Med-VQA) using medical images paired with question-answer sets. It aims to assess state-of-the-art large vision and language models performance in detecting and avoiding hallucinatory responses. The benchmark includes modified versions of existing VQA datasets like PMC-VQA, PathVQA, and VQA-RAD, with scenarios such as fake questions, "None of the Above" (NOTA), and image swaps to test the models’ robustness against hallucination.

EHR-Halt EHR-Halt is the trustworthiness dataset with SQL database question-answering. The dataset is constructed with the unanswerable questions derived from the EHRSQL, MIMIC-III, and eICU, resulting in 1032 samples. For this type of question, the agents need to generate the correct SQL command and retrieve it with the blank value.

LongHalt Similarly to EHR-Halt, LongHalt is also derived from LongHealthQA after the operation described in Adams et al. (2024). We randomly sample multiple documentation except for the note containing the answer to the question. The model without the answer in the context can only refuse to answer the question.

## B.2 Clinical Toolbox

In this section, we introduce the details of the implementation of each tool in the clinical toolbox proposed. The description of the tool in the prebuilt toolbox is shown in Table 9.

## B.2.1 Knowledge Tools

Google Search We use the implementation of the python library googlesearch-python<sup>9</sup>. To avoid the context becoming too lengthy due to retrieval results, we have only used the titles and abstracts of the first ten retrieved results.

Medrag Following the implementation of Xiong et al. (2024), the knowledge base in our method is composed of PubMed<sup>10</sup>, StatPearls<sup>11</sup>, and Textbooks (Jin et al., 2021). We adopt BM25<sup>12</sup> (Robertson et al., 2009) as the retriever to search the information from the medical knowledge base.

DrugBank We download the drug table from the website of DrugBankOnline<sup>13</sup>. The table consists of drugs and their relative information, including description, state, indication, dosages, and so on.

UMLS For UMLS knowledge graph, we use the API provided by the National Institute of Health (NIH)<sup>14</sup>.

## B.2.2 MultiModal Tools

HuatuoGPT HuatuoGPT is a medical MLLM for medical image understanding. We adopt HuatuoGPT-Vision-7B<sup>15</sup> as the medical image information gather. HuatuoGPT will provide the answer to the question generated by the agents.

MedCaptioner MedCaptioner (Xie et al., 2024) is a medical image captioner which can generate the caption without any query. Besides, it decomposes the image report into five parts, including the Modality Classification, Structure Detection, ROI Analysis, Leison Texture, and Local-global Relation. The structured report gives a comprehensive description and can help the agent to better understand the medical image.

MiniCPM MiniCPM (Hu et al., 2024a) is the MLLM developed for general domains. Here, we choose general domain MLLM as a supplement to medical MLLM to provide more options for the agent and improve the robustness of image understanding.

## B.2.3 Numerical Tools

Calculator The calculator is used to receive mathematical expressions generated by the agent and execute the calculations using Python logic. This functionality is implemented with Python’s built-in eval function.

DBManual For DBManual, we refer to the implementation of the SQL knowledge base in EHRAgent (Shi et al., 2024), providing a detailed description of each SQL database, including its tables and columns. This allows the model to utilize DBManual to understand the structure of each database and the semantics of its columns, thereby improving task performance.

SQLCoder The role of SQL Coder is to convert the agent-generated intent into SQL queries and return the results retrieved from the database. In the implementation, the SQL Coder and the agent share the same model. Since the model’s conversion to SQL syntax is not always successful, the SQL Coder can make up to three attempts based on the error messages encountered.

## B.2.4 Data Tools

Spacy SpaCy is used to extract all medicalspecific terms from the input paragraph. To enhance the efficiency of entity extraction, we employ the en\_core\_sci\_sm<sup>16</sup> model from SciSpaCy<sup>17</sup> as the NER model.

LongDocRAG LongDocRAG is utilized to divide multiple user-uploaded documents into chunks and perform retrieval using Retrieval-Augmented Generation (RAG), enabling the agent to handle long contexts. In the implementation, we employ Llama-Index<sup>18</sup> to accomplish this operation. It is worth noting that Llama-Index can handle multimodal data; however, in this work, we limit its use to processing textual data only.

## B.3 Further Discussion

## B.3.1 Clinical Tool

For the coverage of tools in the proposed Clinical Toolbox, it is intractable to account for any existing medical tool due to the diversity and complexity of medical tasks. However, to ensure that our work can be broadly applicable across various clinical scenarios, we have made a conscious effort to include a diverse range of tools. For Knowledge & Reasoning dimension, where task types are relatively uniform, we constructed a set of heterogeneous knowledge tools, including free text (Medrag), knowledge graphs (UMLS), tables (DrugBank), and search engines (Google Search). For the MultiModal dimension, three On the other hand, dimensions with inherently diverse task types naturally feature a wider variety of tools. Furthermore, our proposed method, ReflecTool, imposes no restrictions on tool types, enabling it to generalize effectively to other tools. In terms of MultiModal dimensions, the three selected multimodal models exhibit distinct areas of specialization. HuatuoGPT is tailored to the medical domain, providing domain-specific capabilities. MiniCPM serves as a general-purpose model, supplementing the medical model to enhance the diversity and functionality of the tools. MedCaptioner, designed specifically for generating descriptions of medical images, operates independently of queries provided by agents, thereby offering a unique utility within the framework. For other dimensions defined by diversity, a variety of tools is naturally required to ensure the comprehensive diversity of tools within the Clinical Toolbox.

## B.3.2 Clinical Scenarios

Following the discussion on the comprehensiveness of tools, this section examines the medical scenarios in which agents can be applied. The five proposed dimensions correspond to five distinct types of scenarios anticipated for agent deployment. The Knowledge & Reasoning dimension equips the model with the ability to leverage medical knowledge for tasks such as medical questionanswering and reasoning-based decision-making in clinical diagnoses. The MultiModal dimension enables the model to process diverse types of medical images. For instance, the selected multimodal medical models, HuatuoGPT and MedCaption, support the analysis of all common imaging modalities, including X-rays, CT scans, and MRI, thereby ensuring robust coverage in medical image interpretation. The Numerical Analysis dimen sion allows the model to integrate with hospital Electronic Health Record (EHR) systems, enhancing its capacity to assist physicians in delivering medical services. This capability also improves the model’s proficiency in interpreting numerical data, enabling accurate evaluations of clinical indicators for normalcy. The Data Understanding dimension enhances the model’s ability to process medical text, such as patient reports and long-form records like longitudinal follow-ups. Lastly, the Trustworthiness dimension focuses on minimiz ing hallucinations during medical task execution, thereby improving the model’s reliability in clinical applications.

## C Case Study

## C.1 Parameter Error in Tool Usage

There are two types of errors in the process of an agent utilizing tools to solve problems. The first is tool selection errors, as discussed in Section 5.5, where the agent employs an inappropriate tool for the task. The second is parameter errors, which occur when the agent uses the correct tool but fails to provide appropriate parameters, leading to unexpected results. A common example is when an agent invokes a knowledge tool but generates an unsuitable query, causing the tool to retrieve knowledge with low relevance to the task, thereby failing to provide the agent with effective information. Figure 7 presents a case study to illustrate this phenomenon more clearly. It can be observed that while both agents invoked the same tool, Medrag, Reflexion-Qwen2-72B failed to obtain the correct result. In contrast, ReflecTool-Qwen2-72B, despite initially failing to retrieve relevant information, successfully generated the correct query after reflection, ultimately retrieving effective information. This demonstrates that ReflecTool not only enhances the model’s ability to select the appropriate domain-specific tools but also enables the agent to leverage the tool-wise reflection mechanism to provide better parameters when invoking tools, thereby maximizing their effectiveness.

## D Experiments Details

## D.1 Implementations

All the LLMs and MLLMs methods solve the task under the zero-shot settings while all the agentbased methods are one-shot to demonstrate the action format for the agents. Besides, considering that the multimodal tools can only be used in multimodal tasks, we remove the multimodal tools when agents are solving other types of tasks to save the cost of memory. All the experiments are run on two NVIDIA A100 80GB.

## D.2 Prompt Used in REFLECTOOL

The prompts of the optimization stage are shown in Figure 8 and Figure 9. The prompts of the inference stage are shown in Figure 10, and two types of verifiers are shown in Figure 11.

<table><tr><td>Question</td></tr><tr><td>Prognosis of well differentiated small hepatocellular carcinoma--is well differentiated hepatocellular carcinoma clinically early cancer? A. yes B. no C. maybe</td></tr><tr><td>Reflexion-Qwen2-72B</td></tr><tr><td>Action:Plan[{&quot;response&quot;: &quot;To determine the prognosis of well differentiated small hepatocellular carcinoma and whether it is clinically early cancer, I will use the Medrag action to retrieve medical knowledge from pubmed, textbooks, and statpearls. Then, I will use the Finish action to provide the answer to the question.&quot;}]Observation:OKAction:Medrag[{&quot;query&quot;: &quot;prognosis of well differentiated small hepatocellular carcinoma&quot;}]Observation:Document [0] (Title: Lnc-ATG9B-4 aggravates progress of hepatocellular carcinoma through cell proliferation and migration by upregulating CDK5.) ...Document [1] (Title: Clinicopathological characteristics of surgically resected minute hepatocellular carcinomas.) The multistep development of ...Action:Think[{&quot;response&quot;: &quot;The Medrag action did not provide direct information on the prognosis of well differentiated small hepatocellular carcinoma or whether it is clinically early cancer. However, based on general medical knowledge, well differentiated hepatocellular carcinoma often has a better prognosis than poorly differentiated tumors and can be considered clinically early if it is small and localized. Without specific information, the most appropriate response would be &#x27;maybe&#x27;, as the prognosis can vary depending on several factors including tumor size, stage, and patient health status.&quot;}]Observation:OKAction:Finish[{&quot;response&quot;: &quot;C. maybe&quot;}]</td></tr><tr><td>ReflecTool-Qwen2-72B (Candidate Selection)</td></tr><tr><td>Action:Plan[{&quot;response&quot;: &quot;First, I will use the Medrag action to search for studies or articles that discuss the prognosis of well-differentiated small hepatocellular carcinoma and whether it can be considered clinically early cancer. Based on the findings, I will determine if well-differentiated hepatocellular carcinoma is clinically early cancer. Finally, I will answer the question with either A, B, or C.&quot;}]Observation:OKAction:Medrag[{&quot;query&quot;: &quot;prognosis of well differentiated small hepatocellular carcinoma&quot;}]Observation:Document [0] (Title: Lnc-ATG9B-4 aggravates progress of hepatocellular carcinoma through cell proliferation and migration by upregulating CDK5.)... Document [1] (Title: Clinicopathological characteristics of surgically resected minute hepatocellular carcinomas.) The multistep development of ...Action:Think[{&quot;response&quot;: &quot;The Medrag action did not provide any information specifically about the prognosis of well-differentiated small hepatocellular carcinoma or whether it can be considered clinically early cancer. I need to refine the search query to get more relevant results.&quot;}]Observation:OKAction:Medrag[{&quot;query&quot;: &quot;prognosis well differentiated small hepatocellular carcinoma clinically early cancer&quot;}]Observation:Document [0] (Title: Prognosis of well differentiated small hepatocellular carcinoma--is well differentiated hepatocellular carcinoma clinically early cancer?)Action:Think[{&quot;response&quot;: &quot;The Medrag action provided a document that directly addresses the question. Document [0] states that well-differentiated (w-d) hepatocellular carcinoma is not clinically early cancer, as there was no significant difference in disease-free survival between patients with w-d and less differentiated (l-d) HCCs. This information allows me to answer the question.&quot;}]Observation:OKAction:Finish[{&quot;response&quot;: &quot;B. no&quot;}]</td></tr></table>

Figure 7: Case study for parameter error in tool usage. The figure compares the reasoning trajectories of two agent-based methods for the same task.

![](assets/7433946d1aaa2e3520bba882c8c324d0ba13c83bfdf9ca2314bf8e73d2f2745c.jpg)  
Figure 8: Prompt for the reflection on the first trajectory in optimization stage.

![](assets/a21abc73ba2bb4d069dbc0a65fd8d25c52ed36686b020b0052e7f70b3919cc1d.jpg)  
Figure 9: Prompt for the tool-wise suggestion and tool-wise experience generation.

![](assets/9c114b52b6734e2425348ec45eae66ffce5e804a05e8159f2e996303fdb2e528.jpg)  
Figure 10: Prompt for the REFLECTOOL.

![](assets/6045deb4a129293a42698194907e91fe7758867783c2c2029974d24aeed47cf5.jpg)  
Figure 11: Prompt for two type of Verifier.

<table><tr><td rowspan="2">Methods</td><td colspan="5">Knowledge&amp;Reasoning</td><td colspan="4">MultModal</td><td colspan="5">Numerical Analysis</td><td colspan="4">Data Understanding</td><td colspan="5">Trustworthiness</td><td rowspan="2">Total</td></tr><tr><td>MedQA</td><td>MMLU</td><td>BioASQ</td><td>Pub MedQA</td><td>Avg.</td><td>VQA RAD</td><td>SLAKE</td><td>Omni MedQA</td><td>Avg.</td><td>MedCalc</td><td>EHR SQL</td><td>MIMIC -III</td><td>eICU</td><td>Avg.</td><td>Med Mentions</td><td>emrQA</td><td>Long HealthQA</td><td>Avg.</td><td>MedHalt -Rht</td><td>MedVQA -Halt</td><td>EHR -Halt</td><td>Long Halt</td><td>Avg.</td></tr><tr><td colspan="25">Large Language Models</td></tr><tr><td>MedLlama3-8b</td><td>58.13</td><td>72.82</td><td>66.18</td><td>42.40</td><td>59.88</td><td>-</td><td>-</td><td>-</td><td>-</td><td>22.45</td><td>7.92</td><td>8.65</td><td>7.40</td><td>11.61</td><td>22.93</td><td>23.10</td><td>-</td><td>23.02</td><td>9.90</td><td>-</td><td>2.23</td><td>-</td><td>6.07</td><td>25.14</td></tr><tr><td>Qwen2-7B (Yang et al., 2024)</td><td>54.04</td><td>69.51</td><td>71.68</td><td>48.20</td><td>60.86</td><td>-</td><td>-</td><td>-</td><td>-</td><td>14.42</td><td>18.09</td><td>19.70</td><td>21.73</td><td>18.49</td><td>18.38</td><td>39.86</td><td>75.25</td><td>44.50</td><td>14.11</td><td>-</td><td>3.97</td><td>66.50</td><td>28.19</td><td>38.01</td></tr><tr><td>Llama3-8b (AI@Meta, 2024)</td><td>56.32</td><td>70.34</td><td>72.82</td><td>53.80</td><td>63.32</td><td>-</td><td>-</td><td>-</td><td>-</td><td>28.08</td><td>17.02</td><td>12.53</td><td>21.83</td><td>19.87</td><td>28.54</td><td>41.92</td><td>-</td><td>35.23</td><td>29.22</td><td>-</td><td>18.90</td><td>-</td><td>24.06</td><td>35.62</td></tr><tr><td>Llama3.1-8b (Dubey et al., 2024)</td><td>65.20</td><td>76.58</td><td>74.92</td><td>53.00</td><td>67.43</td><td>-</td><td>-</td><td>-</td><td>-</td><td>37.44</td><td>11.35</td><td>17.42</td><td></td><td>22.07</td><td>32.08</td><td>42.41</td><td>74.25</td><td>49.58</td><td>27.78</td><td>-</td><td>3.97</td><td>60.50</td><td>30.75</td><td>42.46</td></tr><tr><td>Qwen2-72B* (Yang et al., 2024)</td><td>71.25</td><td>84.48</td><td>82.85</td><td>53.00</td><td>72.90</td><td>-</td><td>-</td><td>-</td><td>-</td><td>32.19</td><td>23.98</td><td>33.95</td><td>34.15</td><td>31.07</td><td>29.20</td><td>42.89</td><td>79.75</td><td>50.61</td><td>31.56</td><td>-</td><td>31.30</td><td>58.50</td><td>40.45</td><td>48.76</td></tr><tr><td>Llama3.1-70b* (Dubey et al., 2024)</td><td>79.58</td><td>88.15</td><td>82.52</td><td>57.40</td><td>76.91</td><td>-</td><td>-</td><td>-</td><td>-</td><td>48.52</td><td>16.49</td><td>25.44</td><td>26.47</td><td>29.23</td><td>25.71</td><td>31.69</td><td>80.00</td><td>45.80</td><td>28.22</td><td>-</td><td>22.48</td><td>64.50</td><td>38.40</td><td>47.59</td></tr><tr><td>GPT-3.5-turbo (OpenAI, 2022)</td><td>58.68</td><td>69.88</td><td>75.40</td><td>50.60</td><td>63.64</td><td>-</td><td>-</td><td>-</td><td>-</td><td>20.53</td><td>17.57</td><td>24.31</td><td>14.30</td><td>19.18</td><td>26.88</td><td>21.64</td><td>-</td><td>24.26</td><td>9.78</td><td>-</td><td>26.55</td><td>-</td><td>18.17</td><td>31.31</td></tr><tr><td colspan="25">MultiModal Large Language Models</td></tr><tr><td>MiniCPM-V-2.6 (Yao et al., 2024)</td><td>46.58</td><td>61.16</td><td>70.23</td><td>47.20</td><td>56.29</td><td>48.78</td><td>47.12</td><td>73.70</td><td>56.53</td><td>13.28</td><td>1.61</td><td>1.63</td><td>1.88</td><td>4.60</td><td>18.92</td><td>17.42</td><td>5.25</td><td>13.86</td><td>12.44</td><td>36.89</td><td>8.91</td><td>2.25</td><td>15.12</td><td>29.28</td></tr><tr><td>InternVL-Chat-V1.5 (Chen et al., 2023b)</td><td>50.82</td><td>65.56</td><td>64.89</td><td>30.40</td><td>52.92</td><td>49.67</td><td>41.47</td><td>68.50</td><td>53.21</td><td>18.91</td><td>17.99</td><td>18.05</td><td>20.83</td><td>18.95</td><td>26.47</td><td>42.53</td><td>-</td><td>34.50</td><td>25.78</td><td>50.78</td><td>0.00</td><td>*</td><td>25.52</td><td>37.02</td></tr><tr><td>HuatuoGPT-Vision-7B (Chen et al., 2024)</td><td>50.43</td><td>66.12</td><td>73.30</td><td>54.00</td><td>60.96</td><td>53.65</td><td>52.97</td><td>92.10</td><td>66.24</td><td>13.56</td><td>4.39</td><td>9.27</td><td>9.76</td><td>9.25</td><td>16.74</td><td>38.44</td><td>73.00</td><td>42.73</td><td>14.33</td><td>23.44</td><td>2.42</td><td>65.25</td><td>26.36</td><td>41.11</td></tr><tr><td>HuatuoGPT-Vision-34B (Chen et al., 2024)</td><td>54.83</td><td>72.36</td><td>73.79</td><td>48.00</td><td>62.25</td><td>56.76</td><td>53.72</td><td>91.50</td><td>67.33</td><td>25.79</td><td>8.14</td><td>9.15</td><td>9.79</td><td>13.22</td><td>16.34</td><td>41.68</td><td>-</td><td>29.01</td><td>28.44</td><td>43.77</td><td>32.07</td><td>*</td><td>34.76</td><td>41.31</td></tr><tr><td>GPT-4o-mini (OpenAI, 2023)</td><td>76.90</td><td>85.67</td><td>82.84</td><td>49.20</td><td>73.65</td><td>50.47</td><td>46.47</td><td>59.20</td><td>52.05</td><td>50.43</td><td>21.73</td><td>28.07</td><td>18.19</td><td>29.61</td><td>31.66</td><td>40.00</td><td>78.50</td><td>50.05</td><td>62.11</td><td>53.78</td><td>45.74</td><td>70.00</td><td>57.91</td><td>52.65</td></tr><tr><td colspan="25">Agent (Qwen2-7b)</td></tr><tr><td>COT (Wei et al., 2022)</td><td>52.47</td><td>69.97</td><td>72.21</td><td>41.00</td><td>58.91</td><td>-</td><td>-</td><td>-</td><td>-</td><td>19.10</td><td>16.06</td><td>23.81</td><td>20.95</td><td>19.98</td><td>22.83</td><td>19.92</td><td>65.75</td><td>36.17</td><td>45.56</td><td>-</td><td>31.49</td><td>57.00</td><td>44.68</td><td>39.94</td></tr><tr><td>ReAct (Yao et al., 2023)</td><td>51.61</td><td>67.68</td><td>80.24</td><td>48.60</td><td>62.03</td><td>35.92</td><td>39.59</td><td>72.90</td><td>49.47</td><td>18.62</td><td>18.52</td><td>25.06</td><td>34.00</td><td>24.05</td><td>22.19</td><td>24.04</td><td>41.50</td><td>29.24</td><td>49.89</td><td>35.33</td><td>61.49</td><td>48.75</td><td>53.87</td><td>42.73</td></tr><tr><td>CRITIC (Gou et al., 2024)</td><td>52.87</td><td>58.68</td><td>71.68</td><td>43.20</td><td>56.61</td><td>48.12</td><td>42.70</td><td>70.80</td><td>53.87</td><td>13.09</td><td>23.55</td><td>28.20</td><td>33.12</td><td>24.49</td><td>25.47</td><td>36.33</td><td>50.25</td><td>37.35</td><td>30.44</td><td>28.33</td><td>57.64</td><td>73.75</td><td>47.54</td><td>43.97</td></tr><tr><td>Reflexion (Shinn et al., 2023)</td><td>51.78</td><td>66.48</td><td>74.60</td><td>50.80</td><td>60.92</td><td>45.68</td><td>47.97</td><td>77.20</td><td>56.95</td><td>13.37</td><td>17.56</td><td>22.16</td><td>30.23</td><td>20.83</td><td>30.30</td><td>28.92</td><td>53.00</td><td>37.41</td><td>50.55</td><td>36.33</td><td>62.91</td><td>50.75</td><td>50.14</td><td>45.25</td></tr><tr><td>MedToolAgent (Iterative Refinement, k=2)</td><td>50.12</td><td>65.47</td><td>76.37</td><td>63.20</td><td>63.79</td><td>53.88</td><td>45.71</td><td>82.90</td><td>60.83</td><td>24.68</td><td>24.20</td><td>16.92</td><td>22.08</td><td>21.97</td><td>43.69</td><td>50.27</td><td>61.00</td><td>51.65</td><td>54.44</td><td>37.99</td><td>56.73</td><td>45.25</td><td>48.60</td><td>49.37</td></tr><tr><td>MedToolAgent (Candidates Selection, k=2)</td><td>50.81</td><td>64.84</td><td>72.98</td><td>62.60</td><td>62.81</td><td>56.76</td><td>49.76</td><td>79.20</td><td>61.91</td><td>24.64</td><td>29.87</td><td>25.13</td><td>27.48</td><td>26.78</td><td>59.21</td><td>43.40</td><td>54.00</td><td>52.20</td><td>53.44</td><td>34.21</td><td>55.97</td><td>23.25</td><td>41.72</td><td>49.08</td></tr><tr><td colspan="25">Agent (Qwen2-72b*)</td></tr><tr><td>COT (Wei et al., 2022)</td><td>72.51</td><td>85.45</td><td>81.07</td><td>37.40</td><td>69.11</td><td>-</td><td>-</td><td>-</td><td>-</td><td>29.89</td><td>18.73</td><td>23.55</td><td>25.72</td><td>24.47</td><td>24.43</td><td>52.09</td><td>81.00</td><td>52.51</td><td>57.11</td><td>-</td><td>40.79</td><td>70.75</td><td>56.22</td><td>50.58</td></tr><tr><td>ReAct (Yao et al., 2023)</td><td>72.43</td><td>85.67</td><td>85.38</td><td>62.40</td><td>76.47</td><td>50.09</td><td>46.01</td><td>73.00</td><td>56.37</td><td>26.46</td><td>35.97</td><td>31.45</td><td>31.87</td><td>31.44</td><td>42.11</td><td>55.02</td><td>62.75</td><td>53.29</td><td>56.89</td><td>24.75</td><td>55.78</td><td>58.50</td><td>48.98</td><td>53.31</td></tr><tr><td>CRITIC (Gou et al., 2024)</td><td>71.85</td><td>85.31</td><td>87.86</td><td>51.00</td><td>74.01</td><td>40.58</td><td>50.80</td><td>73.50</td><td>54.96</td><td>22.44</td><td>35.48</td><td>32.47</td><td>33.28</td><td>30.92</td><td>33.60</td><td>56.36</td><td>75.50</td><td>55.15</td><td>51.77</td><td>24.22</td><td>52.03</td><td>58.75</td><td>46.69</td><td>52.35</td></tr><tr><td>Reflexion (Shinn et al., 2023)</td><td>70.78</td><td>84.30</td><td>87.06</td><td>65.00</td><td>76.79</td><td>54.99</td><td>50.05</td><td>77.80</td><td>60.95</td><td>22.45</td><td>40.14</td><td>31.94</td><td>33.42</td><td>31.99</td><td>52.37</td><td>58.73</td><td>64.00</td><td>58.37</td><td>59.00</td><td>33.00</td><td>59.00</td><td>64.00</td><td>53.75</td><td>56.37</td></tr><tr><td>MedToolAgent (Iterative Refinement, k=2)</td><td>73.30</td><td>84.11</td><td>84.63</td><td>65.20</td><td>76.81</td><td>57.21</td><td>48.82</td><td>85.20</td><td>63.74</td><td>36.01</td><td>47.43</td><td>33.96</td><td>36.39</td><td>38.45</td><td>54.57</td><td>67.96</td><td>68.00</td><td>63.51</td><td>59.55</td><td>38.21</td><td>57.82</td><td>63.00</td><td>54.65</td><td>59.43</td></tr><tr><td>MedToolAgent (Candidates Selection, k=2)</td><td>71.37</td><td>84.00</td><td>83.50</td><td>66.20</td><td>76.27</td><td>57.66</td><td>48.54</td><td>81.90</td><td>62.70</td><td>36.77</td><td>49.89</td><td>31.20</td><td>34.38</td><td>38.06</td><td>60.51</td><td>66.61</td><td>66.50</td><td>64.54</td><td>60.77</td><td>39.63</td><td>59.78</td><td>66.75</td><td>56.73</td><td>59.66</td></tr></table>