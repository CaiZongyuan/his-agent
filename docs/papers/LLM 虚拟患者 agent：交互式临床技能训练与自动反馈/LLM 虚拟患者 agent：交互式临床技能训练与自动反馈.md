# LLM-Powered Virtual Patient Agents for Interactive Clinical Skills Training with Automated Feedback

Henrik Voigt Department of Computer Science University of Jena Jena, Germany henrik.voigt@uni-jena.de

Sina Zarrieß Department of Computational Linguistics Bielefeld University Bielefeld, Germany sina.zarriess@uni-bielefeld.de

Yurina Sugamiya Department of Robotics Tokyo Denki University Tokyo, Japan sugamiya@aoni.waseda.jp

Kai Lawonn Department of Computer Science University of Jena Jena, Germany kai.lawonn@uni-jena.de

Atsuo Takanishi Department of Robotics Waseda University Tokyo, Japan takanisi@waseda.jp

Abstract—Objective Structured Clinical Examinations (OSCEs) are essential for medical training, but they require significant resources, including professional actors and expert medical feedback. Although Large Language Models (LLMs) have introduced text-based virtual patients for communication practice, these simulations often lack the capability for richer, non-textual interactions. This paper presents a novel framework that significantly enhances LLM-based simulated patients by equipping them with action spaces, thereby enabling more realistic and dynamic patient behaviors that extend beyond text. Furthermore, our system incorporates virtual tutors that provide students with instant, personalized feedback on their performance at any time during these simulated encounters. We have conducted a rigorous evaluation of the framework’s real-time performance, including system latency and component accuracy. Preliminary evaluations with medical experts assessed the naturalness and coherence of the simulated patients, as well as the usefulness and appropriateness of the virtual tutor’s assessments. This innovative system provides medical students with a low-cost, accessible platform for personalized OSCE preparation at home.

Index Terms—Medical Education, Clinical Skills Training, OSCE, Simulated Patients, Intelligent Tutoring Systems

## I. INTRODUCTION

Objective Structured Clinical Examinations (OSCEs) play a key role in medical education, providing a means of assessing students’ clinical competencies in a variety of scenarios. However, ensuring that students receive sufficient and effective OSCE practice poses a significant challenge. Traditional training requires substantial resources, such as professional actors to simulate patients and medical experts to provide real-time feedback, which makes frequent, personalized practice costly and difficult to implement on a large scale.

Various simulation technologies have been explored in medical education to mitigate these challenges. These range from digital patient simulators to physical robotic patients, which offer more realistic and engaging training by physically embodying patients. Using simulated patients can reduce reliance on human actors and associated costs. However, two major limitations persist. Firstly, many existing patient simulators, particularly those leveraging recent technological advances, are limited to text-based interactions. Secondly, simulating the nuanced role of an OSCE examiner — especially generating high-quality, comprehensive feedback that goes beyond simple keyword matching for complex clinical skills — remains a significant hurdle. Current automatic scoring systems often rely on predefined state graphs, which struggle to evaluate intricate skills such as thorough symptom gathering.

The recent emergence of powerful LLMs, such as GPT-4, Llama and Mistral, has opened up new possibilities for humanmachine interaction. This has led to the development of LLMdriven, text-based patient simulations in medical education. While these simulations allow students to practise communication skills, clinical practice involves richer interactions that go beyond text. For example, clinicians instruct patients to perform movements or observe their responses to actions, which are crucial for accurate diagnoses.

This paper introduces a novel framework to enhance OSCE training simulators, addressing these limitations in two key areas.

• Enhanced Patient Behavior Simulation. We have extended the capabilities of patient simulators beyond text by introducing functional action spaces. This enables simulated patients (whether virtual or robotic, as our framework is implementation-agnostic) to perform movements and actions, resulting in more realistic and interactive encounters.

• Advanced Automatic Feedback Generation. We move beyond keyword-based scoring by using LLMs’ understanding of language to provide comprehensive feedback. We introduce virtual tutors that interact with students, respond to queries and provide detailed post-session evaluations. This dialogue-based assessment provides timely, targeted feedback to enhance student engagement and

![](assets/8797549dbeed1092c1325a1184bfbb9f88afb56299be4dd2728ec37340006b7d.jpg)  
Fig. 1. The Basic Clinical Skills Training Simulator Interface. This example illustrates a training session, showcasing: (Left) the multi-modal chat window for student interaction (voice or text) with the simulated patient; (Top-Right) the interactive Unity-based virtual patient capable of performing actions; and (Bottom-Right) the OSCE task description guiding the student.

## learning.

To validate our framework, we conducted a multifaceted evaluation. First, we assessed the objective performance of the system, including the critical real-time applicability metrics of latency and accuracy for the speech-to-text and language modelling components. Secondly, in a preliminary study, medical experts evaluated the quality of the patient simulation, focusing on the naturalness and coherence of the responses in a clinical skills scenario. Thirdly, these experts provided initial feedback on the quality of the automatically generated feedback, particularly in terms of its alignment with professional judgement. The aim of this work is to provide students with a more realistic, interactive and effective platform for preparing for the OSCE. In the long term, this framework serves as a blueprint for simulators that can deliver standardised, repeatable, and controlled training scenarios, thereby improving the consistency and reliability of OSCE evaluations.

## II. RELATED WORK

This section first provides an overview of the principles of OSCEs in medical assessment, before discussing technological advancements in medical education systems designed to improve OSCE training.

## A. Medical Background: Objective Structured Clinical Examinations

OSCEs provide an objective method for assessing the clinical skills of medical students through standardised, simulated clinical scenarios [1], [2]. Each scenario typically comprises the following: a) a detailed patient profile describing symptoms and behavior; b) a task description outlining the student’s objectives; and c) a checklist of actions for objective evaluation by an examiner. OSCE scenarios, or stations, vary by clinical focus and student demands, but generally fall into four categories.

• Clinical Examination: Systematic investigation of a real or simulated patient.

• Clinical Procedures: Performing skills like venipuncture.

• Communication Skills: Interactions such as history taking or patient information delivery.

• Data Interpretation: Analyzing X-rays or blood test results.

While in-person OSCE training with human-simulated patients (fellow students or professional actors) offers engaging experiences, it is often constrained by the high cost of actors and the limited variety of readily enactable scenarios. These limitations highlight the need for more scalable and versatile training solutions.

## B. Technological Advances in Medical Education

To address the challenges of traditional OSCEs, various technologies have been employed to simulate patients and enhance the learning experience, focusing on reducing costs and increasing accessibility.

Virtual Patient Simulation. Virtual patient simulators aim to replicate patient behavior for training in various clinical skills, including history taking [3], [4] and clinical decisionmaking [5]. Virtual reality environments can further enhance the perceived realism of these simulations [6], [7]. Historically, many virtual patients operated on hard-coded logic, limiting their response diversity to varied user inputs [8].

![](assets/1826804f283212bf8a1f08a8aa984bf687a76b569a275bcc4ffbd71d690a322e.jpg)  
Fig. 2. System Architecture Overview: Data Flow for Dynamic Prompt Generation. User interactions with the Robot or Simulator (frontend, e.g., physical robot or virtual environment) generate events (text, actions). These are written to a ROS Log-inspired message stream. The Conversation Manager (backend) filters this log based on the agent’s defined Action/Perception Space functions. It then updates and constructs the dynamic Prompt for the LLM by incorporating the Patient Role Description, Perception/Action Space Functions, current Observed Variables, and the recent Message Feed (interaction history) The LLM’s response then drives the subsequent behavior of the Robot or Simulator, completing the interaction loop.

The advent of LLMs, with their advanced capabilities in nuanced role-playing and character consistency [9], has significantly changed this landscape. LLMs are now integrated to create more dynamic text-based patient simulations, leveraging their extensive knowledge to portray diverse character traits and conversational abilities [10], [11]. For instance, frameworks like CureFun [12] specifically leverage LLMs as simulated patients for clinical education, facilitating natural conversation practice and providing feedback on students inquiry skills. Some ambitious projects [13] even construct entire simulated medical environments where LLM agents representing patients, doctors, and nurses interact, allowing doctor agents to learn and evolve their diagnostic and treatment capabilities through simulated experience.

While these systems demonstrate the power of LLMs for complex medical simulations and text-based dialogue training, many remain primarily confined to textual interactions. Our framework distinctively focuses on extending patient simulation beyond text to include functional action spaces critical for many OSCE examination scenarios, directly addressing the need for interactive, non-textual patient behaviors in training for medical students.

Robotic Patient Simulation. For skills involving physical procedures (e.g. venipuncture, suturing and ultrasound scanning), robotic simulators offer valuable hands-on training [14]–[16]. Dental robots, for example, simulate patient behavior in a cost-effective way for dental training [17], and other systems teach therapeutic examination techniques [18], suturing [19] and surgical skills [20]. These systems excel at simulating specific physical responses. Our work builds upon this by combining the structured, state-based behavioral aspects often seen in robotics with the nuanced, context-aware predictive power of LLMs. This enables more coherent and diverse simulated behaviors that extend beyond text-based interactions.

Tutoring Systems. Automated tutoring systems strive to facilitate learning by offering immediate feedback and performance assessment [21]. A prominent example is Khan Academy’s Khanmigo, an LLM-powered chatbot providing students with hints and feedback [22]. Research in this area has explored generating step-by-step instructional strategies for LLM tutors [23] and their application in domains like mathematics [24]. The application of LLMs extends to broader skill training, including social skills like communication and conflict resolution, where AI agents can act as practice partners and mentors, providing tailored feedback [25].

Specific to OSCEs, [26] developed a state graph-based system for automatic assessment, where progression is tracked via speech recognition and keyword matching. While effective for structured procedures, this approach is less suited for open-ended dialogue scenarios or complex skill evaluations. Other LLM-based systems for medical education, such as CureFun [12], also incorporate mechanisms to evaluate student dialogue by offering suggestions. Our work is inspired by such automated scoring and feedback approaches but seeks to enhance their capabilities by using LLMs to interpret the entirety of the student-patient interaction (including non-textual actions), thereby providing nuanced feedback applicable to a broader range of clinical interactions without relying on predefined keywords.

## III. SYSTEM ARCHITECTURE

Our framework for enhanced clinical skills training is realized through an application divided into a frontend and a backend. The backend (Section III-A) manages the core logic, utilizing an LLM to simulate dynamic patient and tutor agents. The frontend (Section III-B) provides the user interface, including speech-to-text capabilities and a virtual patient simulator built with Unity. Figure 2 provides a visual overview. A key design principle is frontend independence, which allows the system to interface with either a virtual simulator or a physical robot, provided that a generic communication protocol is adhered to.

## A. Backend: LLM-Powered Agent Simulation

The backend’s primary role is to simulate patient and tutor agent behaviors using prompts that instruct an LLM—in our implementation, Google’s Gemini 1.5 Flash model, chosen for its balance of speed and quality in real-time interactions. The dialogue history management in the agent architecture is inspired by the Robot Operating Systems (ROS) publish-subscribe mechanism. This ensures platform modularity. The agents are accessible via a REST API.

Patient Agent: Enabling Dynamic and Interactive Behaviors. The patient agent simulates realistic patient responses during clinical scenarios. Its behavior, manifested as function calls executable by the frontend (virtual or robotic), encompasses motion, text, or speech. The agent’s prompt (see Figure 3) is structured to facilitate natural and coherent interactions:

• Patient Role Description: Defines the patient’s medical history, symptoms, and behavioral cues for the specific OSCE scenario.

• Perception Space: A list of functions triggered by sensor inputs. These inputs, logged via the pub-sub mechanism, update the agent’s context, allowing the LLM to generate relevant responses. For example, a perception space function such as def on\_text\_input(text: str) would log the student’s utterance (e.g., perception::sensor::text\_input("Please raise your arm.")) for the LLM to process and incorporate into its situational awareness.

• Action Space: A list of functions the agent can execute (e.g., movements, speech). Logging these actions allows the LLM to consider recent behaviors when predicting subsequent actions. For instance, an action space function like def move\_arm(action\_type: str, parameters: dict) would be logged for the LLM (e.g., action::patient::move\_arm("left\_arm", {"s":"left", "d":"up"})) and simultaneously trigger the corresponding animation in the Unity simulator. This directly enables movement behavior, where patients can be instructed to move limbs or adopt postures for examination, going beyond text-only interactions.

• Observed Variables: A subset of relevant state variables (e.g., limb positions) made visible to the LLM, creating a notion of the agent’s current state.

• Message Feed: A log of recent interactions of the pubsub mechanism, providing a conversational and action history. The combination of Perception Space, Observed Variables, and the Message Feed facilitates sophisticated reactive behavior. For instance, if a student manipulates the virtual patient’s arm, the agent perceives this change via its observed variables and message feed, and can then respond appropriately (e.g., indicating pain based on its role description). Standard chat interaction for history taking and communication practice is also supported, building on established LLM capabilities.

Tutor Agent: Providing Comprehensive, Contextual Feedback. The tutor agent simulates an OSCE examiner, offering assistance and detailed evaluations. It can be invoked anytime and provides feedback via function calls executed on the frontend. Its core function is to deliver a textual evaluation and an OSCE score post-training, leveraging the LLM’s understanding rather than simple keyword matching. The Tutor Agent’s prompt includes:

• Tutor Role Description: Instructions on evaluation conduct, response style, and score calculation.

• Student Task Description: The specific clinical task assigned to the student.

• Patient Role Description: Provides the tutor with the same patient context the student has.

• Student-Patient Message Feed: The complete transcript of the student-patient interaction, including all dialogue and actions.

• OSCE Checklist: The critical list of steps the student should perform, with each correctly performed item typically scoring 1 point.

This design empowers several key tutor features:

Interactive Help. Students can query the tutor (e.g., ”what next?”). The tutor, using its role description and knowledge of the student’s task and patient profile, provides motivating, contextual hints. Scenario-specific knowledge can be added to the prompt for deeper support.

Training Summary. Post-session, the tutor generates a detailed summary highlighting positive and negative aspects of the student’s performance. By analyzing the full Student-Patient Message Feed against the OSCE Checklist, the tutor identifies addressed, missed, or poorly executed steps. This offers far more nuanced feedback than keyword-based systems, assessing conversational quality and thoroughness.

OSCE Score Calculation. The tutor systematically reviews the OSCE Checklist against the interaction log (inspired by chain-of-thought reasoning [27]), assigning points for completed items. This LLM-based scoring offers significant advantages over keyword matching. LLMs can infer from conversational context whether checklist items are met, handling ambiguity better than keyword systems. New OSCE scenarios can be created rapidly by providing only the role description, task description, and checklist, without needing to program new keyword logic. This is crucial for OSCE scenario management, where training scenarios stored in the backend can be easily updated.

## B. Frontend: User Interaction and Simulation Environment

The frontend illustrated in Figure 1 comprises:

Chat Component. Displays user, patient, and tutor messages. User messages prefixed with ”@tutor” are routed to the tutor agent; tutor replies are color-coded.

![](assets/8334d0bee2f9beeea8dd4133a676f1340a4ebc7296a5e770884b4ed01decf3cf.jpg)  
Fig. 3. Comparative Prompt Architectures for the Patient and Tutor Agents. The figure details the distinct prompt structures fed to the LLM for (Left) the Patient Agent and (Right) the Tutor Agent. The Patient Agent’s prompt includes its Role Description, definable Perception and Action Space Functions (with example function signatures), current Observed Variables (e.g., ‘left\_arm\_pos‘), and a Message Feed of recent interactions. The Tutor Agent’s prompt incorporates its own Role Description, the Student Task Description, the Patient Role Description (for context), the full Student-Patient Message Feed, and the OSCE Checklist used for evaluation.

Speech Recognition. In-browser voice interaction is enabled using a Whisper model [28] via transformers.js [29], ensuring low latency.

Virtual Patient Simulator. Implemented in Unity and exported to WebGL. The rigged patient model executes behavioral functions (e.g. movements) defined in its action space and logs events using the ROS-inspired pub-sub mechanism.

## C. System Interaction Flow During a Training Session

A typical training interaction (see Figure 2) begins with user input (text or voice) into the chat. Voice is transcribed by Whisper. The text is sent to the designated agent API (patient or tutor) in the backend. The backend’s conversation manager dynamically constructs the LLM prompt by:

• Accessing the agent’s defined action/perception spaces.

• Filtering the pub-sub log stream for relevant function calls and updating observed variables.

• Appending the recent interaction history (message feed).

• Including the agent’s role description and action/perception function definitions.

• Inserting the current user query.

The LLM is tasked to complete the prompt, typically by generating a function call (with arguments) from the agent’s action space in JSON format. This JSON is validated by the backend and sent to the frontend for execution by the virtual patient simulator or a connected robot. This loop continues throughout the OSCE training session.

## IV. EVALUATION

This section presents an evaluation of our framework. We first assess quantitative performance benchmarks for critical system components (Section IV-A) and then discuss a preliminary expert evaluation focusing on the patient agent’s behavioral fidelity and the tutor agent’s feedback quality (Section IV-B).

![](assets/2355fb17c407e53e529a5704ae85a53f4440992e6f0d5072a945785c8e96849a.jpg)  
Fig. 4. Example of the Virtual Tutor’s Automated OSCE Score Evaluation. The display shows a detailed checklist for an OSCE scenario, where each item is marked by the LLM-powered tutor as completed (green check) or missed (red cross) based on its analysis of the student-patient interaction.

## A. Performance Benchmarks

Real-time interaction is crucial for an effective training system. We quantified the latency and accuracy of speech recognition and language model components to select optimal models for our application.

1) Speech Recognition: To select an optimal speech-to-text (STT) model, we compared three Whisper model versions [28] on real-time factor (RTF; audio length to transcription time ratio) and word error rate (WER). Benchmarking used a LibriSpeech corpus subset [30] (audio files ≤10s) on a standard Intel Core i7 CPU, reflecting our browser-based deployment.

Results are shown in Table I. The whisper-tiny model (39M parameters) achieved the best RTF (0.325), indicating realtime transcription capability, with a WER (0.245) comparable to the larger whisper-base (74M params, RTF 0.567, WER 0.231) and whisper-small (244M params, RTF 1.91, WER 0.243) models. Given its significantly smaller size, faster loading, and superior real-time performance, whisper-tiny was selected for our application. The whisper-small model’s RTF >1 disqualified it due to potential interaction delays.

2) LLM Response Times: We evaluated the response times of three LLMs: Gemini-1.5-Pro, Gemini-1.5-Flash (both Google Cloud-inferred [31]), and the open-source, browserexecutable Qwen-1.5-0.5B [32]. Each generated a 50-word story (approximating typical patient agent response length), repeated 10 times.

As detailed in Table II, Gemini-1.5-Flash was the fastest (average response time: 2.07s ± 0.27), followed by Gemini-1.5-Pro (2.51s ± 0.13). The offline-capable Qwen-1.5-0.5B was substantially slower (14.82s ± 0.32). These results underscore that current offline models struggle to meet the <3-second response times generally desired for real-time interaction, unlike GPU-powered cloud models. Consequently, Gemini-1.5-Flash was chosen for its optimal balance of speed and quality. While cloud-based models have accessibility considerations, their performance is currently vital for this application, though future advancements may enable viable open-source, offline alternatives.

TABLE I  
SPEECH RECOGNITION MODEL COMPARISON

<table><tr><td>Model</td><td>Real Time Factor</td><td>Word Error Rate</td><td>Params</td></tr><tr><td>whisper-tiny</td><td>0.325</td><td>0.245</td><td>39M</td></tr><tr><td>whisper-base</td><td>0.567</td><td>0.231</td><td>74M</td></tr><tr><td>whisper-small</td><td>1.91</td><td>0.243</td><td>244M</td></tr></table>

TABLE II  
LLM COMPARISON

<table><tr><td>Model</td><td>Response Time</td><td>Free Access</td><td>Offline</td></tr><tr><td>Qwen 1.5-0.5B-Chat</td><td> $14.82s \pm 0.32$ </td><td>√</td><td>√</td></tr><tr><td>Gemini-1.5-Pro</td><td> $2.51s \pm 0.13$ </td><td>x</td><td>x</td></tr><tr><td>Gemini-1.5-Flash</td><td> $2.07s \pm 0.27$ </td><td>x</td><td>x</td></tr></table>

## B. Expert Evaluation: Patient Fidelity and Tutor Utility

We conducted a preliminary evaluation with 18 medical professionals (8 experienced physicians (>5 yrs exp.), 4 medical assistants (3-5 yrs), 6 medical students (<3 yrs)) to assess the framework’s practical utility.

Scenario and Procedure. Participants engaged in a simulated OSCE scenario – an upper limb neurological examination – lasting approximately ten minutes. This common task enabled the assessment of basic clinical skills. To illustrate, checklist items included tasks such as introducing themselves and stating the purpose of the examination, inspecting the upper limbs for signs of wasting or abnormal posture, ensuring correct patient posture, and performing a pronator drift test (see Figure 4). Throughout the examination, experts rated the behavior of the virtual patient (chat interaction, movement and reactivity) and the feedback of the virtual tutor (chat assistance, summary and appropriateness of OSCE score) on a 5-point Likert scale (1=poor, 5=very good) at each stage. Alongside these quantitative ratings, qualitative feedback regarding specific interactions and suggestions for improvement was gathered from each expert through a structured postsession questionnaire and encouraged during brief, open discussions. This mixed-methods approach aimed to provide a comprehensive initial understanding of the system’s perceived strengths and critical areas for future development.

Overall Performance. The virtual patient received a high average rating of 4.38 (SD=0.74), and the virtual tutor averaged 4.33 (SD=0.71). Experienced physicians rated the patient highest (4.56, SD=0.61), followed by students (4.43, SD=0.47) and assistants (4.01, SD=0.99). Tutor ratings were more consistent across groups (physicians: 4.38, SD=0.79; assistants: 4.38, SD=0.62; students: 4.16, SD=0.91). These scores suggest experts perceived the system as ”good” to ”very good.”

![](assets/cc68ee7e08bde6d30bfe8ca5a6c014d45389a7d8f1dec11f7f9d8a2ea4b2f5a4.jpg)  
Fig. 5. Mean Expert Ratings: by Feature Category for Virtual Patient (VP) and Virtual Tutor (VT) performance. Ratings are on a 5-point Likert scale (1=poor, 5=very good). Error bars represent standard deviation. VP features include Chat, Movement, and Reactive behavior. VT features include Summary quality, OSCE Score appropriateness, and interactive assistance.

Categorical Performance and Qualitative Insights. Figure 5 details mean ratings per category. For the virtual patient, chat interaction was rated highest (M=4.78, SD=0.42). Experts praised its realism: ”Wow, that was much more realistic than expected!” (E1) and responsiveness: ”The patient reacts well to the commands!” (E7). Reactive behavior (M=4.11, SD=0.81) and movement behavior (M=4.25, SD=1.02) received slightly lower, though still positive, ratings. Feedback indicated areas for enhancement, such as simulating nuanced conditions (”Is it difficult to simulate the senile behavior of patients?” - E11) and handling complex instructions (”If possible, let the patient understand two commands in one sentence” - E5). For the virtual tutor, the helpfulness of the summary was rated highest (M=4.39, SD=0.68), while interactive assistance/help during the scenario was rated slightly lower (M=4.22, SD=0.79). The experts showed a high agreement with the scores given by the virtual tutor (M=4.39, SD=0.68).

Evaluation Summary and Future Directions. The results of the preliminary expert study illustrate our framework’s potential for realistic OSCE training, particularly highlighting the success of LLM-driven dialogue generation for both patient interaction and tutor feedback summaries. The quantitative benchmarks confirm the feasibility of real-time performance with current cloud-based LLMs and optimized local STT.

Key areas for future development, informed by expert feedback, include enhancing the sophistication of the patient’s reactive and movement behaviors, such as improving multicommand understanding and modeling more nuanced communication patterns associated with specific medical conditions. This involves refining prompts to elicit more subtle behavioral cues, thereby enriching the diagnostic challenge for students. Further work will also explore optimizing tutor interactions to provide even more effective in-scenario guidance. Addressing these points will further strengthen the realism and pedagogical value of the training system.

## V. CONCLUSION

This paper introduced a novel framework leveraging LLMs to create dynamic patient and tutor agents, offering an enhanced digital training environment for OSCE preparation. Our primary contributions advance existing OSCE training methodologies by: (1) endowing simulated patients with movement and reactive behaviors that extend beyond text-only interactions, and (2) replacing simplistic keyword-based scoring with a comprehensive, LLM-driven evaluation of the entire student-patient interaction, culminating in a detailed summary and an interpretable OSCE score. Performance benchmarks confirmed the system’s capability for real-time interaction, with core LLM responses averaging around 2 seconds. Crucially, preliminary evaluations by medical experts illustrated the pedagogical potential of our approach. They rated the virtual patient’s behavior as notably natural and coherent, and the virtual tutor’s feedback as helpful and appropriate. Future work will focus on several key areas: striving to integrate performant open-source, offline LLMs to improve accessibility and reduce operational costs; further refining patient simulations to capture the nuances of complex medical conditions and support more intricate action sequences; and continuing to enhance the sophistication of the virtual tutor’s interactive guidance and assessment mechanisms. Ultimately, this line of research aims to provide medical students with increasingly realistic, accessible, and effective tools for mastering essential clinical skills.

## REFERENCES

[1] R. M. Harden, M. Stevenson, W. W. Downie, and G. Wilson, “Assessment of clinical competence using objective structured examination.” British medical journal, vol. 1, no. 5955, p. 447, 1975.

[2] K. Z. Khan, S. Ramachandran, K. Gaunt, and P. Pushkar, “The objective structured clinical examination (osce): Amee guide no. 81. part i: an historical and theoretical perspective,” Medical teacher, vol. 35, no. 9, pp. e1437–e1446, 2013.

[3] D. R. Danforth, M. Procter, R. Chen, M. Johnson, and R. Heller, “Development of virtual patient simulations for medical education,” Journal For Virtual Worlds Research, vol. 2, no. 2, 2009.

[4] L. Campillos-Llanos, C. Thomas, E. Bilinski, P. Zweigenbaum, and S. Rosset, “Designing a virtual patient dialogue system based on terminology-rich resources: Challenges and evaluation,” Natural Language Engineering, vol. 26, pp. 183 – 220, 2019. [Online]. Available: https://api.semanticscholar.org/CorpusID:199008654

[5] J. McCallum, V. Ness, and T. M. Price, “Exploring nursing students’ decision-making skills whilst in a second life clinical simulation laboratory.” Nurse education today, vol. 31 7, pp. 699–704, 2011. [Online]. Available: https://api.semanticscholar.org/CorpusID:207077332

[6] A. A. Rizzo, T. Bowerly, J. G. Buckwalter, D. Klimchuk, R. Mitura, and T. D. Parsons, “A virtual reality scenario for all seasons: The virtual classroom,” CNS Spectrums, vol. 11, pp. 35 – 44, 2009. [Online]. Available: https://api.semanticscholar.org/CorpusID:11918016

[7] C. Pensieri and M. Pennacchini, “Overview: Virtual reality in medicine,” The Journal of Virtual Worlds Research, vol. 7, 2014. [Online]. Available: https://api.semanticscholar.org/CorpusID:63776596

[8] L. Campillos-Llanos, C. Thomas, E. Bilinski, A. Neuraz, S. Rosset, and P. Zweigenbaum, “Lessons learned from the usability evaluation of a simulated patient dialogue system,” Journal of Medical Systems, vol. 45, 2021. [Online]. Available: https://api.semanticscholar.org/CorpusID:234684719

[9] X. T. Zhu, H. Cheerman, M. Cheng, S. R. Kiami, L. Chukoskie, and E. McGivney, “Designing vr simulation system for clinical communication training with llms-based embodied conversational agents,” in Proceedings ofthe Extended Abstracts ofthe CHI Conference on Human Factors in Computing Systems, 2025, pp. 1–9.

[10] R. Furlan, M. Gatti, R. Mene, D. Shiffer, C. Marchiori, A. G.´ Levra, V. Saturnino, E. Brunetta, and F. Dipaola, “A natural language processing–based virtual patient simulator and intelligent tutoring system for the clinical diagnostic process: Simulator development and case study,” JMIR Medical Informatics, vol. 9, 2020. [Online]. Available: https://api.semanticscholar.org/CorpusID:232242828

[11] J. S. Park, J. O’Brien, C. J. Cai, M. R. Morris, P. Liang, and M. S. Bernstein, “Generative agents: Interactive simulacra of human behavior,” in Proceedings of the 36th Annual ACM Symposium on User Interface Software and Technology, 2023, pp. 1–22.

[12] Y. Li, C. Zeng, J. Zhong, R. Zhang, M. Zhang, and L. Zou, “Leveraging large language model as simulated patients for clinical education,” arXiv preprint arXiv:2404.13066, 2024.

[13] I. Steenstra, F. Nouraei, and T. Bickmore, “Scaffolding empathy: Training counselors with simulated patients and utterance-level performance visualizations,” in Proceedings of the 2025 CHI Conference on Human Factors in Computing Systems, 2025, pp. 1–22.

[14] S. Marcos-Pablos and F. J. Garc´ıa-Penalvo, “More than surgical tools:˜ a systematic review of robots as didactic tools for the education of professionals in health sciences,” Advances in Health Sciences Education, vol. 27, pp. 1139 – 1176, 2022. [Online]. Available: https://api.semanticscholar.org/CorpusID:250146615

[15] Z. Huang, C. Lin, M. Kanai-Pak, J. Maeda, Y. Kitajima, M. Nakamura, N. Kuwahara, T. Ogata, and J. Ota, “Robot patient design to simulate various patients for transfer training,” IEEE/ASME Transactions on Mechatronics, vol. 22, no. 5, pp. 2079–2090, 2017.

[16] T. Hashimoto, S. Honma, T. Fujikura, Y. Hayasaka, T. Takeshita, Y. Ito, K. Okubo, and H. Takemura, “Voice dialog system for simulated patient robot and detection of interviewer nodding,” in 2021 IEEE Symposium Series on Computational Intelligence (SSCI). IEEE, 2021, pp. 01–06.

[17] H. Takanobu, A. Okino, A. Takanishi, M. Madokoro, Y. Miyazaki, and K. Maki, “Dental patient robot,” in 2006 IEEE/RSJ International Conference on Intelligent Robots and Systems. IEEE, 2006, pp. 1273– 1278.

[18] S. Ishikawa, S. Okamoto, K. Isogai, Y. Akiyama, N. Yanagihara, and Y. Yamada, “Assessment of robotic patient simulators for training in manual physical therapy examination techniques,” Plos one, vol. 10, no. 4, p. e0126392, 2015.

[19] J. Solis, N. Oshima, H. Ishii, N. Matsuoka, K. Hatake, and A. Takanishi, “Development of a sensor system towards the acquisition of quantitative information of the training progress of surgical skills,” in 2008 2nd IEEE RAS & EMBS International Conference on Biomedical Robotics and Biomechatronics. IEEE, 2008, pp. 959–964.

[20] K. K. Howard, H. Makki, N. M. Novotny, M. Mi, and N. Nguyen, “Value of robotic surgery simulation for training surgical residents and attendings: a systematic review protocol,” BMJ Open, vol. 12, 2022. [Online]. Available: https://api.semanticscholar.org/CorpusID:249675756

[21] S. Feng, A. J. Magana, and D. Kao, “A systematic review of literature on the effectiveness of intelligent tutoring systems in stem,” 2021 IEEE Frontiers in Education Conference (FIE), pp. 1–9, 2021. [Online]. Available: https://api.semanticscholar.org/CorpusID:245388778

[22] M. U. Hadi, R. Qureshi, A. Shah, M. Irfan, A. Zafar, M. B. Shaikh, N. Akhtar, J. Wu, S. Mirjalili et al., “Large language models: a comprehensive survey of its applications, challenges, limitations, and future prospects,” Authorea Preprints, 2023.

[23] S. Sonkar, L. Liu, D. B. Mallick, and R. Baraniuk, “Class: A design framework for building intelligent tutoring systems based on learning science principles,” in Conference on Empirical Methods in Natural Language Processing, 2023. [Online]. Available: https://api.semanticscholar.org/CorpusID:258832520

[24] J. Macina, N. Daheim, S. P. Chowdhury, T. Sinha, M. Kapur, I. Gurevych, and M. Sachan, “Mathdial: A dialogue tutoring dataset with rich pedagogical properties grounded in math reasoning problems,” ArXiv, vol. abs/2305.14536, 2023. [Online]. Available: https://api.semanticscholar.org/CorpusID:258865403

[25] D. Yang, C. Ziems, W. Held, O. Shaikh, M. S. Bernstein, and J. Mitchell, “Social skill training with large language models,” arXiv preprint arXiv:2404.04204, 2024.

[26] Y. Sugamiya, T. Otani, R. Nakadate, and A. Takanishi, “Construction of automatic scoring system to support objective evaluation of clinical skills in medical education,” in 2019 41st Annual International Conference of the IEEE Engineering in Medicine and Biology Society (EMBC). IEEE, 2019, pp. 4177–4181.

[27] J. Wei, X. Wang, D. Schuurmans, M. Bosma, F. Xia, E. Chi, Q. V. Le, D. Zhou et al., “Chain-of-thought prompting elicits reasoning in large language models,” Advances in neural information processing systems, vol. 35, pp. 24 824–24 837, 2022.

[28] A. Radford, J. W. Kim, T. Xu, G. Brockman, C. McLeavey, and I. Sutskever, “Robust speech recognition via large-scale weak supervision,” in International Conference on Machine Learning. PMLR, 2023, pp. 28 492–28 518.

[29] T. Wolf, L. Debut, V. Sanh, J. Chaumond, C. Delangue, A. Moi, P. Cistac, T. Rault, R. Louf, M. Funtowicz et al., “Transformers: Stateof-the-art natural language processing,” in Proceedings of the 2020 conference on empirical methods in natural language processing: system demonstrations, 2020, pp. 38–45.

[30] V. Panayotov, G. Chen, D. Povey, and S. Khudanpur, “Librispeech: an asr corpus based on public domain audio books,” in 2015 IEEE international conference on acoustics, speech and signal processing (ICASSP). IEEE, 2015, pp. 5206–5210.

[31] G. Team, R. Anil, S. Borgeaud, Y. Wu, J.-B. Alayrac, J. Yu, R. Soricut, J. Schalkwyk, A. M. Dai, A. Hauth et al., “Gemini: a family of highly capable multimodal models,” arXiv preprint arXiv:2312.11805, 2023.

[32] J. Bai, S. Bai, Y. Chu, Z. Cui, K. Dang, X. Deng, Y. Fan, W. Ge, Y. Han, F. Huang et al., “Qwen technical report,” arXiv preprint arXiv:2309.16609, 2023.

# LLM-Powered Virtual Patient Agents for Interactive Clinical Skills Training with Automated Feedback Supplementary Material

## Contents

1 Medical Background 2   
2 Implementation Details 3   
2.1 System Architecture Overview 3   
2.2 Feature Implementations 4   
2.2.1 OSCE Scenario Management 4   
2.2.2 Patient Features 4   
2.2.3 Tutor Features 6   
3 Prompting Details 8   
3.1 Patient Prompt 8   
3.2 Tutor Prompt 9   
4 Expert Evaluation Scenario 10

## 1 Medical Background

An Objective Structured Clinical Examination (OSCE) attempts to objectively assess the clinical skills of medical students using representative, simulated clinical scenarios [Harden et al., 1975, Khan et al., 2013]. A scenario consists of the following artifacts: a) a detailed patient profile, which contains information about the patient’s symptoms and behavior, b) a task description, which conveys what the student must do in this assessment, and c) a checklist, which contains a list of actions to be performed by the student. These actions are relevant to an objective assessment by an examiner, such as a medical professional. OSCE scenarios, also known as stations, are conducted in a variety of ways depending on the clinical area they target and the demands they place on students [Harden et al., 2015]. However, most scenarios fall into one of the following four categories:

• Clinical Examination involves performing a systematic investigation on a real or simulated patient.

• Clinical Procedures, including the performance of a clinical skill such as venipuncture.

• Communication Skills, including interaction skills such as taking a patient’s history or communicating information to a patient.

• Data Interpretation, such as the interpretation of X-rays or blood tests.

Nowadays, training courses and examinations based on the OSCE scheme are usually conducted in person. Patients are either simulated by fellow students or by professional actors. Although this provides an engaging learning experience for students, these forms of practice are very limited due to the costly use of actors and the small variety of scenarios that can be re-enacted.

![](assets/36523d430ac778a4b2afc2abf3e5ff17f6a590faf8011a51eb48807d055ce528.jpg)  
Figure 1: Overview of an Objective Structured Clinical Examination (OSCE) scenario. The figure illustrates the core components of a typical OSCE station. A patient is assigned a role with specific symptoms (e.g., John Miller, 46, with neck pain). A student is given a clinical task to perform, such as an upper limb neurological examination. An examiner uses a checklist to assess the student’s performance on key actions.

## 2 Implementation Details

## 2.1 System Architecture Overview

To illustrate the functionality of our framework, we implemented a basic clinical skills training application. The system architecture is divided into two parts: the frontend and the backend. The backend contains an API service that coordinates a language model to simulate the behavior of patient and tutor agents. Thefrontend hosts a speech-to-text component that transcribes spoken words into text, as well as a virtual patient simulator implemented using the Unity game engine [Haas, 2014]. An overview of the system architecture is shown in Figure 2. The backend of the system is not bound to a specific frontend and can be used either with a virtual patient simulator as the frontend or with a physical robot that then represents the patient, provided that the outlined generic communication protocol is used.

![](assets/4db8b56e1345a18271c81bf77f2b61faf481e8ea029b46043e67769062c2afca.jpg)  
Figure 2: System architecture overview. The diagram illustrates the data flow for a user interaction. (1) A user interacts with the patient simulation via the frontend. (2) Spoken input is transcribed to text through Automatic Speech Recognition (ASR). (3) The conversation manager assembles the interaction history and current state into a prompt. (4) This prompt is sent to a Large Language Model (LLM) via the Google Cloud Vertex API, which generates a function call. (5) After format verification, the resulting JSON-RPC function call is executed by the frontend to update the simulation.

The interaction of the simulator frontend with the backend during a training session proceeds as follows: The user either types or speaks an intended command into the chat component. If the microphone is used, the Whisper speech recognition model transcribes the audio into text. This text is then sent to the appropriate agent API (patient or tutor) in the backend component, depending on which agent is being addressed in the conversation. Once the message is received, the prompt is constructed. The dynamic prompt construction process is performed by the conversation manager. The conversation manager has access to the function sets of the agent’s action and perception space. It then filters the stream of logs resulting from the pub-sub mechanism from the simulator for these functions. When a change in the observed variables is detected, the conversation manager updates the observed variables object with those changes (e.g., a change in the position of the arms, legs, or head) and writes them to the prompt. It then adds the last 20 messages from the filtered log to the prompt to provide the language model with the recent history of the interaction. It also copies the role description and action/perception space functions into the prompt. Finally, the user query is inserted into the prompt. The task given to the LLM is to complete the prompt after the action:: token with an appropriate function and arguments from the action space. This allows the language model to re-enact the given role and return a function call in JSON-RPC format. Once the function call string is generated, it is validated in the backend and then sent to the frontend where it is executed (in this case, the virtual agent in the Unity-based simulator environment). This completes the interaction loop and a new cycle is initiated until the end of the OSCE training session.

## 2.2 Feature Implementations

## 2.2.1 OSCE Scenario Management

The system allows the creation and management of OSCE scenarios, as illustrated in Figure 3. To create a scenario for training, it is necessary to provide a patient’s role description and a task description for the student. In addition, an OSCE checklist must be provided so that the tutor can perform an evaluation after the training. Training scenarios are stored in the backend and can be updated and modified at any time. In its standard configuration, the system covers the creation of customized OSCE scenarios for which the necessary perception and action functions of the underlying agent have been implemented.

The framework is designed to separate content creation from technical development to ensure scalability. The process is two-tiered:

• Educator: A non-technical user can create a new scenario by providing text-based assets through a simple interface: the patient persona, the student tasks, the tutor persona, and the OSCE checklist. If materials are prepared, this can be done in a few hours.

• Developer: If a scenario requires a novel physical action not already in the library (e.g., a specific movement or gesture), a developer must code and animate this function. This is a more involved task, potentially taking a few days.

This modular design allows educators to rapidly create many new scenarios using the existing, extensive library of common physical movements, while providing a clear path for expansion.

## 2.2.2 Patient Features

The first goal of the proposed framework is to enhance the naturalness and coherence of the simulated patient character in training by extending its action capabilities beyond text to include interactive behavior. The following three features illustrate the capabilities of the simulated patient:

Chat interaction. Chat interaction with the simulated patient allows for the practice of communication skills such as taking a patient’s history or providing information to the patient. This has also been covered in previous work [Danforth et al., 2009, Campillos-Llanos et al., 2019]. The student talks to the patient using either voice or text, and responses are returned in the chat.

![](assets/657494aa0cdaaa064bd7e4af5081f80413b709a7d09eee9ee9a00a0360f2f6a5.jpg)  
Figure 3: Interface for creating custom OSCE scenarios. Educators can author new training scenarios using this structured form. The figure shows the creation of a "Breaking Bad News with Empathy" scenario, which falls under the ‘Communication Skills‘ category. The author defines the steps of the task for the student, creates a detailed role description for the patient (including history and emotional state), and specifies the OSCE checklist items for the examiner to use during evaluation.

Movement behavior. By introducing an action space of functions in our framework, simulated agents now support interactive movements in addition to pure text-based interaction. To perform an examination, patients can be instructed to move their arms, legs, or joints to certain positions and postures, and the students examine the trajectories.

Reactive behavior. By introducing a perception space, an internal state of observed variables as well as a message feed of the recent history of the interaction, the simulated patient is now capable of reactive behavior with respect to its internal state. For example, a student can change the position of the arm or push the patient’s arm in a certain direction. The agent notices this change in position and, when asked, can tell if the movement is painful or not, depending on the medical condition specified.

![](assets/f2e58b29b5d1c0e6e3c5f53fae1670c5ce3441986d7b85dbcf9d02e7f685ccf2.jpg)  
Figure 4: Demonstration of the patient agent’s multimodal behaviors. This figure showcases the agent’s ability to simulate a clinical encounter through three distinct interaction types. First, the agent conducts realistic chat interactions (left) to answer questions and in a conversation. Second, it translates commands into physical actions or movement behaviors (center), allowing the student to direct the patient during a training session. Third, the agent possesses reactive behaviors (right), where it reports on sensory input by accessing its internal state, providing crucial feedback for procedures like a neurological test.

## 2.2.3 Tutor Features

The second goal of the proposed framework is to increase the detail and quality of feedback provided by identifying the steps performed in an OSCE checklist. This extends the keyword matching of existing work to a comprehensive performance assessment that encompasses the entirety of the interaction between the student and the patient agent. The following three features illustrate the capabilities of the tutor agent:

Interactive help. At any point during a training session, students can ask the tutor for help, such as ’what step to take next’. The tutor is prompted with the patient’s role description and knows the task the student is about to perform. In the tutor’s role description, the tutor agent is encouraged to respond in a motivating way to help the student figure out how to proceed based on the information given. It is also possible to include additional scenario-related knowledge into the tutor agent prompt to allow for even more detailed case-based support and question-answering.

Training summary. After a training session is completed, the tutor agent provides a detailed summary of the training session. The summary is structured to list positive and negative aspects of the student’s performance. Based on the OSCE checklist the tutor agent summarizes which checkpoints were appropriately targeted, which were forgotten, or which need to be improved in the future (see Figure 5). By having access to the logs of the entire interaction, the agent can take into account everything that was said or done when summarizing the behavior. This allows for much more fine-grained feedback than a scoring approach that only checks whether certain keywords were used. In addition, by using the LLM’s language understanding capabilities, the quality of the conversation can be evaluated much more deeply, allowing students to improve their conversational style and skills with patients.

OSCE Score. Finally, after the training session has been summarized, the tutor agent distills the evaluation into an OSCE score. To do this, the agent is asked to think through the OSCE checklist step by step [Wei et al., 2022]. Each successfully completed checklist item is worth 1 point, and each missed item is worth 0 points. The sum of all points is the OSCE score, which gives the student a concrete idea of how well it has performed. The student then knows which scenarios they are good at and which need further study. In contrast to a keyword-matching approach, calculating the OSCE score based on the entire interaction logs and the OSCE checklist has several advantages. First, new training scenarios can be generated very easily by providing only the artifacts role description, task description and checklist, and no hard-coded keyword matching has to be programmed. This makes the training application very flexible and extensible. Second, newly generated training scenarios can be automatically evaluated by LLMs because the language understanding capabilities of LLMs, in combination with the applied step-by-step evaluation procedure, allow them to infer from the context of the conversation whether an OSCE checklist item has been resolved or not. This is much more practical than approaches based on keyword-matching, since keywords may be ambiguous.

![](assets/138a6bfcb101921c6f1892bdd5e8d9405a0a3ea62a747004bcf8ea5e50f67225.jpg)  
Figure 5: Formative and summative feedback provided by the tutor agent. The agent offers both on-demand guidance and post-session evaluation. (Left) During the simulation, it provides formative feedback through interactive help, guiding students with Socratic questions rather than direct answers. (Center and Right) After the session, it delivers summative feedback, including a training summary with qualitative observations and a detailed OSCE score that quantitatively measures performance against a checklist.

## 3 Prompting Details

## 3.1 Patient Prompt

The patient prompt used in the training scenario is as follows:

Imagine you’re a real patient in an OSCE medical exam.

Your goal: Clearly explain your symptoms and concerns to the doctor for an accurate diagnosis and treatment plan.

## Background:

{role\_description}

Think like a real person:

• Describe your pain naturally, using your own words.

• Answer questions honestly and openly.

• React to the doctor’s instructions and inquiries in a believable way based on your emotional state (use prompts if needed).

The more believable and natural your responses are, the better the learning experience will be for the medical student.

## Remember:

• Use your best judgment to stay true to your character and situation.

• Feel free to ask clarifying questions if needed.

Patient State:

{observed\_variables}

Perception Space:

{perception\_space}

Action Space:

{action\_space}

Please follow the instructions of the doctor and use only the actions from the Action Space provided to engage in the conversation effectively.

Current Conversation:

{history}

## 3.2 Tutor Prompt

The tutor prompt used in the training scenario is as follows:

You are a seasoned medical teacher with over 20 years of experience, here to guide a student doctor preparing for their OSCE exam.

## The Task at Hand:

The student doctor is tasked with:

{task\_description}

## Your Role as a Mentor:

• You have access to the assessment checklist, which outlines key steps for the examination.

• The student doctor can request your help at any point.

• Provide subtle hints based on the checklist to nudge them in the right direction. Don’t give away the answer!

• Focus on helping the student doctor develop essential skills like critical thinking, information recall, and effective communication.

• Offer positive reinforcement throughout the simulation to keep the doctor motivated.

The assessment checklist for the examination is as follows: {checklist}

## Current Conversation:

The conversation between the student doctor and the patient is as follows: {history}

## 4 Expert Evaluation Scenario

This section contains a transcript of the OSCE scenario of the upper limb neurological examination used to conduct the expert evaluation.

All results were obtained using the following 5-point Likert scale:

• (1) Strongly Disagree

• (2) Disagree

• (3) Neutral

• (4) Agree

• (5) Strongly Agree

The virtual exam contains the following 5 tasks:

Task 1: History Taking. Imagine you are a physician performing a brief neurological exam on a patient, including checking the function of the nerves in the neck and shoulders.

The first task in this training cycle is to take the patient’s medical history.

An examination might include the following steps:

• Introducing yourself to the patient.

• Confirming the patient’s name and date of birth.

• Explain what the examination will entail.

• Obtaining consent to proceed with the examination.

Q1: The text answers given by the patient agent are reasonable and give the impression of a coherent character.

Task 2: Neck Posture Check. After taking the patient’s history, our next step is to evaluate the posture and mobility of the neck.

An examination may include the following steps:

• Having the patient sit down.

• Having the patient perform head movements and identify painful movements.

Q2: The patient agent executes the given commands as intended.

Task 3: Pronator Drift Test. Now we will execute a pronator drift test, which gives us insight about upper limb muscle weakness.

An examination may include the following steps

• Having the patient stand up.

• Having the patient move their arms straight in front of their body while eyes closed.

• Identifying drifting directions in the arms and communicating the observations to the patient.

Q3: The patient agent executes the given commandsflawlessly.

Task 4: Sensitivity Test. In this part of the training we test if there are any differences in sensitivity between the two arms.

An examination may include the following steps

• Having the patient stand up.

• Having the patient move their arms straight in front of their body while eyes closed.

• Touching the arms and/or hands of the patient and observing if the touched areas are sensitive.

• Communicating the results to the patient.

Q4: The patient executes the given commands well and gives reasonable answers to the requests.

Task 5: Training Summary. Now that you have completed the last step, it is time to get feedback from the Tutor Agent.

Please click the end session button on the right.

A pop-up window will open and the Tutor will give you a summary of your performance.

Q5: The summary given by the teacher is helpful and would help me as a student to improve.

Task 6: OSCE Score. The OSCE Score is an objective, transparent, checklist-based evaluation of a medical student’s performance on a clinical skills examination.

To obtain the OSCE SCORE for the training you have completed, please click on the calculate OSCE score button.

Q6: The OSCE score calculated by the teacher agent is fair and reasonable for my performance.

Task 7: Assistance. Please evaluate the quality of the help of the tutor during the training session. Q7: The teacher’s answers to my questions were helpful and helped me to moveforward during the training.

## References

Leonardo Campillos-Llanos, Catherine Thomas, Eric Bilinski, Pierre Zweigenbaum, and Sophie Rosset. Designing a virtual patient dialogue system based on terminology-rich resources: Challenges and evaluation. Natural Language Engineering, 26:183 – 220, 2019. URL https://api. semanticscholar.org/CorpusID:199008654.

Douglas R Danforth, Mike Procter, Richard Chen, Mary Johnson, and Robert Heller. Development of virtual patient simulations for medical education. Journal For Virtual Worlds Research, 2(2), 2009.

John K Haas. A history of the unity game engine. 2014.

Ronald M Harden, Mary Stevenson, W Wilson Downie, and GM Wilson. Assessment of clinical competence using objective structured examination. British medical journal, 1(5955):447, 1975.

Ronald M Harden, Pat Lilley, and Madalena Patricio. The Definitive Guide to the OSCE: The Objective Structured Clinical Examination as a performance assessment. Elsevier Health Sciences, 2015.

Kamran Z Khan, Sankaranarayanan Ramachandran, Kathryn Gaunt, and Piyush Pushkar. The objective structured clinical examination (osce): Amee guide no. 81. part i: an historical and theoretical perspective. Medical teacher, 35(9):e1437–e1446, 2013.

Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten Bosma, Fei Xia, Ed Chi, Quoc V Le, Denny Zhou, et al. Chain-of-thought prompting elicits reasoning in large language models. Advances in neural information processing systems, 35:24824–24837, 2022.