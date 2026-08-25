(function(){
const A=window.Academy,{S}=A;
const PAGE='healthagentbench-labs';
const requestedLab=new URLSearchParams(location.search).get('lab');

const labs=[
  {id:'meds',num:'01',name:'电子健康记录格式转换',short:'格式转换',count:1,input:'MIMIC-IV 表格 + 转换代码仓库',work:'修改配置并运行抽取、转换、加载流水线',output:'MEDS 患者事件文件',gate:'配置与输出检查全部通过'},
  {id:'xray',num:'02',name:'X 光报告纠错',short:'X 光纠错',count:10,input:'当前胸片 + 历史影像与报告 + 错误草稿',work:'只纠正草稿中有临床意义的错误',output:'仅含影像所见（FINDINGS）的纠正报告',gate:'5 个评审中至少 3 个认为无显著错误'},
  {id:'trials',num:'03',name:'临床试验匹配',short:'试验匹配',count:9,input:'患者入院记录 + 约 300 至 450 份试验方案',work:'先粗筛，再逐条核对纳入与排除条件',output:'按信心排序的试验编号列表',gate:'前 50 项找全所有合格试验'},
  {id:'ct',num:'04',name:'计算机断层扫描异常分类',short:'CT 分类',count:10,input:'200 至 700 层胸部 CT + 待判断标签',work:'生成不同窗位和方向的视图并逐标签判断',output:'每个标签一行 yes / no',gate:'所有标签全部正确'},
  {id:'tumor',num:'05',name:'病理肿瘤区域选择',short:'病理选区',count:10,input:'十亿像素级全切片病理图像 + 固定网格',work:'多倍率观察并选择所有肿瘤瓦片',output:'肿瘤瓦片的 x、y 网格坐标',gate:'精确率与召回率的 F1 综合评分不低于 0.90'},
  {id:'ehrshot',num:'06',name:'电子健康记录事件建模',short:'事件建模',count:6,input:'纵向临床事件 + 训练和验证标签',work:'构造截止时间前特征并训练预测模型',output:'每位患者的风险概率',gate:'测试集受试者工作特征曲线下面积（AUROC）不低于基线'},
  {id:'dq',num:'07',name:'电子健康记录数据质量审计',short:'数据审计',count:8,input:'8 张、超过 80 万行的带错误表格',work:'形成假设、查询并标记可疑行',output:'table、_row_id 两列的逗号分隔值文件（CSV）',gate:'找全错误簇，且精确率不低于 0.01'}
];
if(requestedLab&&labs.some(x=>x.id===requestedLab)&&S.getUi(PAGE).lab!==requestedLab)S.setUi(PAGE,{lab:requestedLab});

function state(){return {
  lab:requestedLab&&labs.some(x=>x.id===requestedLab)?requestedLab:'meds',
  xrayFixes:[],xrayResult:null,
  trialPicks:[],trialResult:null,
  ctSlice:20,ctWindow:'lung',ctLabels:{},ctResult:null,
  tumorTiles:[],tumorZoom:'overview',tumorResult:null,
  modelFeatures:[],modelType:'logistic',modelResult:null,
  dqTask:'combined',dqClues:false,dqFlags:[],dqResult:null,
  ...S.getUi(PAGE)
};}
function set(patch){S.setUi(PAGE,patch);A.refreshPage();}
function meta(id){return labs.find(x=>x.id===id)||labs[0];}
function toggle(arr,value){return arr.includes(value)?arr.filter(x=>x!==value):[...arr,value];}

function navigator(active){return `<div class="lab-switcher">${labs.map(x=>`<button class="lab-switch ${active===x.id?'active':''}" data-action="hab-lab" data-lab="${x.id}"><span>${x.num}</span><strong>${x.short}</strong><small>${x.count} 个任务</small></button>`).join('')}</div>`;}
function taskFacts(m){return `<div class="task-facts"><div><small>智能体拿到什么</small><strong>${m.input}</strong></div><div><small>必须完成的工作</small><strong>${m.work}</strong></div><div><small>交付物</small><strong>${m.output}</strong></div><div><small>奖励 1 的条件</small><strong>${m.gate}</strong></div></div>`;}
function strategy(steps){return `<div class="strategy-strip">${steps.map((x,i)=>`<div><span>${i+1}</span><strong>${x[0]}</strong><small>${x[1]}</small></div>`).join('')}</div>`;}
function explanation(why,hard,fail,platform){return `<div class="lab-explain"><div><small>为什么这样设计</small><p>${why}</p></div><div><small>真正的难点</small><p>${hard}</p></div><div><small>常见失败</small><p>${fail}</p></div><div><small>对平台的启示</small><p>${platform}</p></div></div>`;}
function verdict(result){if(!result)return `<div class="lab-verdict idle"><strong>尚未提交</strong><p>完成操作后运行任务专属验证器。</p></div>`;return `<div class="lab-verdict ${result.pass?'pass':'fail'}"><small>任务奖励</small><strong>${result.pass?'1 · 通过':'0 · 失败'}</strong><p>${result.message}</p>${result.metrics?`<div class="verdict-metrics">${result.metrics.map(x=>`<span><b>${x[1]}</b>${x[0]}</span>`).join('')}</div>`:''}</div>`;}
function labTitle(m,kicker,desc){return `<div class="lab-title"><div><div class="eyebrow">${m.num} · ${kicker}</div><h3>${m.name}</h3><p>${desc}</p></div><div class="lab-title-actions">${A.tag(`${m.count} 个任务`,'blue')}<button class="btn" data-action="hab-lab-reset" data-lab="${m.id}">重置当前实验</button></div></div>${taskFacts(m)}`;}

function medsLab(){const m=meta('meds'),c={defaultUntouched:true,copiedConfig:false,splitDemographics:false,omrPrefix:false,hospitalLabPrefix:false,icuChartPrefix:false,runtimeOverride:false,...S.get().benchmarkConfig},run=S.get().benchmarkRun;
const checks=[['defaultUntouched','默认配置保持不变','稳定入口不能被实验修改污染'],['copiedConfig','复制为医院专用配置','从默认模板产生 custom_event_configs.yaml'],['splitDemographics','拆分四类人口学事件','保险、语言、婚姻状态、种族成为独立事件'],['omrPrefix','门诊测量使用 OMR//','不同来源的同名代码不能混在一起'],['hospitalLabPrefix','医院检验使用 HOSP_LAB//','保留检验数据来源域'],['icuChartPrefix','重症监护使用 ICU_CHARTEVENT//','保留重症监护数据来源域'],['runtimeOverride','运行时显式选择新配置','只影响这次转换，不改变默认行为']];
return `${labTitle(m,'流水线定制','这不是把一种 JSON 改成另一种 JSON，而是在真实代码仓库中找到配置入口，做最小范围修改，运行完整转换，并检查最终患者事件是否与标准答案一致。')}
${strategy([['先定向','查看仓库、默认配置和原始输入'],['再限界','复制配置，不直接改默认入口'],['执行','显式传入新配置运行转换'],['核对','检查文件、行数、事件和内容哈希']])}
<div class="lab-workbench"><div><h4>观察一次入院记录如何拆成事件</h4><div class="event-transform"><div><small>默认输出</small><code>HOSPITAL_ADMISSION//EMERGENCY</code><p>insurance、language、marital_status、race 都塞在入院事件里</p></div><b>→</b><div><small>目标输出</small><code>ADMISSION + 4 个独立事件</code><p>${c.splitDemographics?'当前配置已经拆分':'勾选“拆分四类人口学事件”后才会出现'}</p></div></div><div class="lab-check-grid">${checks.map(x=>`<label class="lab-check ${c[x[0]]?'checked':''}"><input type="checkbox" data-action="benchmark-toggle" data-key="${x[0]}" ${c[x[0]]?'checked':''}><span><strong>${x[1]}</strong><small>${x[2]}</small></span></label>`).join('')}</div><div class="actions"><button class="btn primary" data-action="benchmark-run">运行转换与验证器</button><button class="btn" data-action="benchmark-apply-reference">应用完整参考方案</button><button class="btn" data-action="benchmark-reset">重置</button><a class="btn soft" href="ehr-format-conversion.html">进入配置深挖页</a></div></div>${verdict(run?{pass:run.passed,message:run.passed?'配置意图和最终 MEDS 文件都与标准答案一致。':'至少一项配置或输出检查失败。部分完成不会得到奖励。',metrics:[['通过检查',run.checks.filter(x=>x.ok).length+'/7'],['奖励',run.passed?'1.0':'0.0']]}:null)}</div>
${explanation('同时检查配置和输出，可以排除“配置写了但没运行”以及“绕过要求直接伪造结果”两种情况。','理解真实仓库的配置继承关系，并保证自定义行为不破坏默认行为。','直接修改默认配置、遗漏来源前缀、没有在运行命令中选择新配置。','医院接入助手可以建议映射，但必须经过样本转换、契约测试和工程师批准。')}`;}

const xrayItems=[
  {id:'volume',draft:'双肺容积偏低。',fix:'双肺过度充气，肺野透亮度增高。',truth:true},
  {id:'opacity',draft:'右下肺见新发局灶性实变。',fix:'未见局灶性肺实变。',truth:true},
  {id:'effusion',draft:'可见少量左侧胸腔积液。',fix:'未见胸腔积液。',truth:true},
  {id:'pneumo',draft:'未见气胸。',fix:'可见小量右侧气胸。',truth:false}
];
function xrayLab(){const m=meta('xray'),u=state();return `${labTitle(m,'影像 + 文本纠错','智能体面对的是一份被故意改错的报告。它要结合当前胸片和既往检查，只改草稿已经提到的内容，不能顺手添加新的影像发现。')}
${strategy([['列出争议句','先读草稿和既往报告'],['回到影像','用当前影像解决矛盾'],['最小修改','只改被证据推翻的句子'],['格式复核','只提交 FINDINGS，不加诊断印象']])}
<div class="xray-lab"><div class="xray-evidence"><div class="image-stage"><img src="assets/healthagentbench-xray.png" alt="胸部 X 光教学示例"><span>教学示意 · 不用于诊断</span></div><div class="prior-stack"><div><small>较早检查</small><strong>双肺过度充气，无局灶性肺实变</strong></div><div><small>最近一次既往报告</small><strong>慢性肺气肿改变稳定，无胸腔积液</strong></div><div><small>当前检查提示</small><strong>影像应决定当前状态，既往报告只用于比较</strong></div></div></div><div class="report-editor"><div class="panel-head"><h4>住院医师草稿 · 勾选需要纠正的句子</h4><span>${u.xrayFixes.length} / 4 已标记</span></div>${xrayItems.map(x=>`<label class="report-line ${u.xrayFixes.includes(x.id)?'selected':''}"><input type="checkbox" data-action="hab-xray-fix" data-id="${x.id}" ${u.xrayFixes.includes(x.id)?'checked':''}><span><del>${u.xrayFixes.includes(x.id)?x.draft:''}</del><strong>${u.xrayFixes.includes(x.id)?x.fix:x.draft}</strong></span></label>`).join('')}<div class="submission-preview"><small>submission.json / final_answer</small><p>FINDINGS: ${xrayItems.map(x=>u.xrayFixes.includes(x.id)?x.fix:x.draft).join(' ')}</p></div><button class="btn primary" data-action="hab-xray-run">提交给 5 票临床错误评审器</button></div>${verdict(u.xrayResult)}</div>
${explanation('草稿只通过否定、部位、程度或时间变化翻转来制造错误，所以任务是纠错，不是重新写一份更漂亮的报告。','当前影像、既往影像和文字报告可能互相冲突，最终必须用当前影像落地。','漏掉一个原始错误；纠错时新增草稿未提及的发现；提交缺少 FINDINGS 头。','生产系统要把“建议修改”与“正式签发”分开，并保留原句、证据和修改差异供放射科医生确认。')}`;}

const trialCandidates=[
  {id:'NCT-VT001',title:'持续性室性心动过速电生理研究',why:'18–80 岁；有持续性室速；允许尚未植入除颤器',gold:true},
  {id:'NCT-CAD02',title:'冠心病导管检查路径研究',why:'有冠心病和既往心肌梗死；本次计划导管检查',gold:true},
  {id:'NCT-ICD03',title:'已植入除颤器患者远程随访',why:'排除未植入除颤器者；患者只有植入式心电记录器',gold:false},
  {id:'NCT-AF004',title:'房颤节律控制比较研究',why:'要求确诊房颤；患者明确无房颤',gold:false},
  {id:'NCT-BRAD5',title:'症状性心动过缓自然史研究',why:'有晕厥和症状性心动过缓；尚未植入起搏器',gold:true},
  {id:'NCT-HF006',title:'射血分数降低型心衰药物研究',why:'要求射血分数不高于 35%；当前病历没有证据',gold:false},
  {id:'NCT-ARST7',title:'心脏骤停生存者二级预防研究',why:'患者曾发生并成功复苏的心脏骤停',gold:true},
  {id:'NCT-NICM8',title:'非缺血性心肌病消融研究',why:'要求非缺血性心肌病；患者为缺血性冠心病',gold:false}
];
function trialLab(){const m=meta('trials'),u=state();return `${labTitle(m,'自由文本检索与资格判断','论文中的每个任务有约 300 至 450 份试验方案。下面缩小为 8 份候选，并把“前 50 项”缩小为最多 5 项，让你体验为什么先粗筛、再逐条核对排除条件。')}
${strategy([['结构化患者','同时写清“有什么”和“没有什么”'],['脚本粗筛','按年龄、性别、疾病和关键词压缩候选'],['逐条裁决','检查每一条纳入和排除条件'],['排序复核','把合格和边界项放入有限名单']])}
<div class="trial-patient"><div><small>患者摘要</small><strong>65 岁男性 · 冠心病 · 既往心肌梗死 · 持续性室速 · 晕厥 · 症状性心动过缓 · 心脏骤停复苏后</strong></div><div><small>关键否定信息</small><strong>无房颤 · 尚未植入除颤器或起搏器 · 不是非缺血性心肌病</strong></div></div><div class="trial-layout"><div><div class="candidate-head"><h4>教学候选池</h4><span>已选 ${u.trialPicks.length} / 5</span></div><div class="trial-candidates">${trialCandidates.map(x=>`<label class="trial-card ${u.trialPicks.includes(x.id)?'selected':''}"><input type="checkbox" data-action="hab-trial-pick" data-id="${x.id}" ${u.trialPicks.includes(x.id)?'checked':''}><span><strong>${x.id} · ${x.title}</strong><small>${x.why}</small></span></label>`).join('')}</div></div><div><div class="ranked-list"><h4>信心排序名单</h4>${u.trialPicks.length?u.trialPicks.map((id,i)=>`<div><b>${i+1}</b><span>${id}</span></div>`).join(''):'<p>从左侧选择，选择顺序就是信心顺序。</p>'}</div><button class="btn primary" data-action="hab-trial-run">计算前列召回率</button>${verdict(u.trialResult)}</div></div>
${explanation('临床招募更怕漏掉合格试验，所以以召回率为主要门槛；前 50 项限制防止智能体把几百项全部上报。','排除条件常用复杂否定表达，而且患者没有某疾病或没有某设备同样是关键证据。','只看标题和摘要；把排除条件误当纳入条件；合格试验被埋在低信心长尾。','医院平台需要患者结构化摘要、试验语义检索、逐条件证据和人工招募复核，而不是只返回一个相似度分数。')}`;}

const ctGold={opacity:'yes',effusion:'yes',pneumothorax:'no',hernia:'no',nodes:'no'};
const ctFindings=[['opacity','肺部阴影或实变'],['effusion','胸腔积液'],['pneumothorax','气胸'],['hernia','食管裂孔疝'],['nodes','纵隔淋巴结肿大']];
function ctLab(){const m=meta('ct'),u=state(),x=((u.ctSlice-1)%8)*12.5,y=Math.floor((u.ctSlice-1)/8)*20,notes={lung:'肺窗适合观察肺野、胸膜线和肺底阴影。',mediastinal:'纵隔窗适合观察积液、纵隔结构和淋巴结。',slab:'小范围平均密度层可以降低非增强扫描的噪声。'};return `${labTitle(m,'三维影像多标签分类','真实任务给智能体一个 200 至 700 层、采用神经影像信息技术标准（NIfTI）的体数据文件。智能体必须先把体数据制造成可观察的窗位、切面和连续层，再对给定标签逐项回答。')}
${strategy([['读取体数据','检查层数、方向和体素间距'],['制造视图','生成肺窗、纵隔窗和三方向接触图'],['逐项判断','每个标签独立寻找支持和反证'],['格式检查','每个标签恰好出现一次 yes / no']])}
<div class="ct-lab-layout"><div><div class="ct-toolbar"><div class="segmented">${[['lung','肺窗'],['mediastinal','纵隔窗'],['slab','平均密度层']].map(x=>`<button class="${u.ctWindow===x[0]?'active':''}" data-action="hab-ct-window" data-window="${x[0]}">${x[1]}</button>`).join('')}</div><label>观察层 ${u.ctSlice} / 40<input type="range" min="1" max="40" value="${u.ctSlice}" data-action="hab-ct-slice"></label></div><div class="ct-contact ${u.ctWindow}"><img src="assets/healthagentbench-ct.png" alt="胸部 CT 连续切片教学示例"><span class="slice-focus" style="left:${x}%;top:${y}%"></span></div><div class="observation-note"><strong>当前观察策略</strong><p>${notes[u.ctWindow]}</p><small>黄色框表示正在放大核对的连续层区域；这是任务机制教学示意，不用于诊断。</small></div></div><div><h4>predictions.txt</h4><div class="ct-label-list">${ctFindings.map(f=>`<div><strong>${f[1]}</strong><span><button class="${u.ctLabels[f[0]]==='yes'?'active yes':''}" data-action="hab-ct-label" data-id="${f[0]}" data-value="yes">yes</button><button class="${u.ctLabels[f[0]]==='no'?'active no':''}" data-action="hab-ct-label" data-id="${f[0]}" data-value="no">no</button></span></div>`).join('')}</div><button class="btn primary" data-action="hab-ct-run">运行全标签精确匹配</button>${verdict(u.ctResult)}</div></div>
${explanation('二元标签看似简单，但奖励采用全标签精确匹配：5 项对 4 项仍然是失败。','智能体不能直接“看到”三维体数据，能力取决于它能否生成正确的窗位、切面和连续层视图。','只看少数轴位切片；只用肺窗；遗漏一个标签或输出标签名不一致。','平台应提供受控的体数据渲染与测量工具，让模型引用具体切片和窗位，最终由影像医生确认。')}`;}

const tumorGold=[14,15,16,20,21,22];
function tumorLab(){const m=meta('tumor'),u=state(),selected=u.tumorTiles;return `${labTitle(m,'全切片病理图像选区','真实全切片图像可能达到十亿像素。智能体不能把原图一次放入上下文，而要读取图像金字塔，在低倍率定位组织，再逐级放大并把判断对齐到评分网格。')}
${strategy([['低倍率定位','找到组织碎片和可疑区域'],['中倍率分块','按 4096×4096 像素网格生成接触图'],['高倍率判别','用形态而不是单纯颜色判断肿瘤'],['边界复核','检查漏选和多选后输出坐标']])}
<div class="path-lab-layout"><div><div class="segmented">${[['overview','低倍率总览'],['region','中倍率区域'],['detail','高倍率细节']].map(x=>`<button class="${u.tumorZoom===x[0]?'active':''}" data-action="hab-tumor-zoom" data-zoom="${x[0]}">${x[1]}</button>`).join('')}</div><div class="path-grid ${u.tumorZoom}">${Array.from({length:24},(_,i)=>`<button class="${selected.includes(i)?'selected':''}" data-action="hab-tumor-tile" data-tile="${i}" title="瓦片 x=${i%6}, y=${Math.floor(i/6)}"><span>${i%6},${Math.floor(i/6)}</span></button>`).join('')}</div><div class="observation-note"><strong>${u.tumorZoom==='overview'?'先区分组织与空白':'观察细胞与组织形态'}</strong><p>${u.tumorZoom==='overview'?'教学样本的可疑区域位于下方组织碎片；不要把上方所有深色区域都当成肿瘤。':u.tumorZoom==='region'?'比较相邻瓦片的组织连续性，重点处理肿瘤边界。':'高倍率用于区分癌组织、淋巴组织和炎症，颜色阈值不能替代形态判断。'}</p></div></div><div><h4>predicted_tumor_tiles</h4><div class="tile-output">${selected.length?selected.map(i=>`<code>{x:${i%6}, y:${Math.floor(i/6)}}</code>`).join(''):'<p>点击左侧网格选择瓦片。</p>'}</div><button class="btn primary" data-action="hab-tumor-run">与隐藏肿瘤掩膜比较</button>${verdict(u.tumorResult)}</div></div>
${explanation('F1 综合评分把精确率和召回率合并为一个分数。边界本身存在一定模糊性，因此论文要求 F1 达到 0.90，而不是网格完全一致。','多倍率视图必须和最终 4096 像素网格严格对齐；错一行坐标会让视觉判断全部失效。','只看缩略图漏掉小病灶；用染色深浅做阈值而过选；没有检查边界外的可疑瓦片。','生产系统应把模型选区作为候选标注，保存倍率、坐标、证据图和版本，由病理医生复核。')}`;}

const modelFeatures=[
  ['age','年龄与性别','稳定的基础人口学特征'],['dx','既往诊断计数','只统计预测时点之前的诊断'],['labs','检验趋势','使用最近值、斜率和异常次数'],['meds','用药历史','使用处方类别和时间间隔'],['recency','就诊时间间隔','描述事件的新近程度'],['future','出院后的事件','泄漏：真实预测时不可见'],['patientId','患者编号','容易记忆训练患者，无法泛化']
];
function modelLab(){const m=meta('ehrshot'),u=state();return `${labTitle(m,'纵向事件预测','六个任务分别预测高脂血症、乳糜泻、急性心肌梗死、胰腺癌、系统性红斑狼疮和原发性高血压是否首次发生。模型只能使用预测时间之前的事件。')}
${strategy([['切分时间线','每个患者只保留预测时点前事件'],['构造特征','计数、趋势、用药和时间间隔'],['验证泛化','训练集、验证集和测试集严格隔离'],['提交概率','输出 0 到 1 的连续风险值']])}
<div class="model-lab-layout"><div><h4>1. 选择特征</h4><div class="feature-list">${modelFeatures.map(x=>`<label class="feature-chip ${u.modelFeatures.includes(x[0])?'selected':''} ${['future','patientId'].includes(x[0])?'danger':''}"><input type="checkbox" data-action="hab-model-feature" data-id="${x[0]}" ${u.modelFeatures.includes(x[0])?'checked':''}><span><strong>${x[1]}</strong><small>${x[2]}</small></span></label>`).join('')}</div><h4>2. 选择模型</h4><div class="segmented">${[['logistic','逻辑回归'],['gbm','梯度提升树'],['xgb','极端梯度提升']].map(x=>`<button class="${u.modelType===x[0]?'active':''}" data-action="hab-model-type" data-model="${x[0]}">${x[1]}</button>`).join('')}</div><button class="btn primary" data-action="hab-model-run">训练并提交隐藏测试集</button></div><div><div class="timeline-cut"><div class="past"><small>允许使用</small><strong>预测时间之前</strong><span>诊断 · 检验 · 用药 · 就诊</span></div><b>预测时点</b><div class="future"><small>禁止使用</small><strong>预测时间之后</strong><span>结果诊断 · 后续治疗</span></div></div>${u.modelResult?`<div class="auroc-chart"><div><span>验证集</span><i style="width:${u.modelResult.val*100}%"></i><b>${u.modelResult.val.toFixed(3)}</b></div><div><span>隐藏测试集</span><i style="width:${u.modelResult.test*100}%"></i><b>${u.modelResult.test.toFixed(3)}</b></div><div class="baseline"><span>基线</span><i style="width:74%"></i><b>0.740</b></div></div>`:'<div class="empty"><strong>等待训练</strong><p>隐藏测试标签不会提供给智能体。</p></div>'}${verdict(u.modelResult)}</div></div>
${explanation('验证集用于选择方案，最终奖励只看隐藏测试集是否达到计数特征加梯度提升树的基线。','避免时间泄漏比换模型更重要；错误地使用预测时点后的事件会制造虚假的高分。','稀有结局过拟合；患者编号记忆；验证代码自身泄漏；读取 2.1GB 事件表超时。','平台需要统一的时间截止语义、特征来源追踪和独立评测集，不能只展示训练分数。')}`;}

const dqRows=[
  {id:'p-102',table:'patients',value:'性别=男',cluster:'demographic',note:'需与其他记录交叉检查'},
  {id:'lab-301',table:'labevents',value:'妊娠试验=阳性',cluster:'demographic',note:'与患者人口学信息矛盾'},
  {id:'lab-614',table:'labevents',value:'血钾=67 mmol/L',cluster:'potassium',note:'疑似小数点移位'},
  {id:'chart-91',table:'chartevents',value:'体重=700 kg',cluster:'weight',note:'单位或小数点异常'},
  {id:'tr-201',table:'transfers',value:'08:00 转入 ICU-01',cluster:'transfer',note:'与下一行时间冲突'},
  {id:'tr-202',table:'transfers',value:'08:00 转入 WARD-03',cluster:'transfer',note:'同一时刻两个位置'},
  {id:'adm-77',table:'admissions',value:'出院时间 08-14 10:00',cluster:'admit',note:'与重复记录冲突'},
  {id:'adm-78',table:'admissions',value:'出院时间 08-13 10:00',cluster:'admit',note:'同一次住院的重复记录'},
  {id:'rx-88',table:'prescriptions',value:'阿司匹林 100 mg qd',cluster:null,note:'合理记录'},
  {id:'lab-900',table:'labevents',value:'血红蛋白 132 g/L',cluster:null,note:'合理记录'}
];
const dqTargets={impossible:['potassium','weight'],inconsistency:['transfer','admit'],demographic:['demographic'],combined:['potassium','weight','transfer','admit','demographic']};
function dqLab(){const m=meta('dq'),u=state(),targets=dqTargets[u.dqTask];return `${labTitle(m,'大表搜索与错误簇召回','论文数据包含不可能值、表内和跨表不一致、人口学矛盾三类错误。下面用 10 行候选演示“错误行”和“错误簇”的区别；真实任务需要搜索 8 张、超过 80 万行的表。')}
${strategy([['先看模式','快速枚举 8 张表的字段和样本'],['形成假设','按错误家族设计查询规则'],['迭代扫描','第一轮后继续寻找遗漏的错误簇'],['回读提交','确认每个 table、_row_id 真实存在']])}
<div class="dq-toolbar"><div class="segmented">${[['impossible','不可能值'],['inconsistency','记录不一致'],['demographic','人口学矛盾'],['combined','三类组合']].map(x=>`<button class="${u.dqTask===x[0]?'active':''}" data-action="hab-dq-task" data-task="${x[0]}">${x[1]}</button>`).join('')}</div><label class="clue-toggle"><input type="checkbox" data-action="hab-dq-clues" ${u.dqClues?'checked':''}>显示论文中的“线索版”提示</label></div>${u.dqClues?`<div class="clue-box"><strong>线索</strong><p>重点检查 ${u.dqTask==='impossible'?'labevents 的小数点移位和 chartevents 的单位异常':u.dqTask==='inconsistency'?'transfers 与 admissions 中同一次事件的冲突记录':u.dqTask==='demographic'?'patients 人口学字段与检验、操作等临床证据的矛盾':'labevents、chartevents、transfers、admissions 和 patients 的组合异常'}。</p></div>`:''}<div class="dq-layout"><div class="dq-table"><div class="dq-row head"><span>标记</span><span>table / _row_id</span><span>值</span><span>审计备注</span></div>${dqRows.map(r=>`<label class="dq-row ${u.dqFlags.includes(r.id)?'selected':''} ${u.dqClues&&targets.includes(r.cluster)?'suspect':''}"><span><input type="checkbox" data-action="hab-dq-flag" data-id="${r.id}" ${u.dqFlags.includes(r.id)?'checked':''}></span><code>${r.table}<br>${r.id}</code><strong>${r.value}</strong><small>${u.dqClues?r.note:'需要查询上下文后判断'}</small></label>`).join('')}</div><div><h4>flagged_rows.csv</h4><div class="flag-output">${u.dqFlags.length?u.dqFlags.map(id=>{const r=dqRows.find(x=>x.id===id);return `<code>${r.table},${r.id}</code>`;}).join(''):'<p>尚未标记行。</p>'}</div><button class="btn primary" data-action="hab-dq-run">计算错误簇召回</button>${verdict(u.dqResult)}</div></div>
${explanation('同一个真实错误可能影响多行，所以按“错误簇”计算召回：每个簇至少找出一行才算覆盖。','搜索空间大，而且组合任务要求一次同时维持多套检测假设。','只找到大部分错误簇便停止；只查单表；没有核对提交行号；组合任务遗漏一种错误家族。','平台需要可复用的数据质量规则、跨表查询工具和可追溯的异常证据，但最终修复应由数据负责人批准。')}`;}

function renderLab(id){return {meds:medsLab,xray:xrayLab,trials:trialLab,ct:ctLab,tumor:tumorLab,ehrshot:modelLab,dq:dqLab}[id]();}

A.registerPage(PAGE,()=>{const u=state(),m=meta(u.lab);return A.hero('HealthAgentBench · 七类互动任务','不要背七个名字，亲手走一遍七种工作方式','每个实验都按论文的真实输入、成功轨迹、交付物和通过门槛构造。页面数据为了教学而缩小，但验证逻辑与论文保持一致。',`<h3>当前实验</h3><div class="kpi-grid"><div class="kpi"><small>任务类别</small><strong>${m.num}/07</strong></div><div class="kpi"><small>该类任务数</small><strong>${m.count}</strong></div><div class="kpi"><small>总任务数</small><strong>54</strong></div><div class="kpi"><small>评分</small><strong>0 / 1</strong></div></div>`)+navigator(u.lab)+`<div class="active-lab">${renderLab(u.lab)}</div>`;});

A.onAction('hab-lab',el=>set({lab:el.dataset.lab}));
A.onAction('hab-lab-reset',el=>{const id=el.dataset.lab,resets={xray:{xrayFixes:[],xrayResult:null},trials:{trialPicks:[],trialResult:null},ct:{ctSlice:20,ctWindow:'lung',ctLabels:{},ctResult:null},tumor:{tumorTiles:[],tumorZoom:'overview',tumorResult:null},ehrshot:{modelFeatures:[],modelType:'logistic',modelResult:null},dq:{dqTask:'combined',dqClues:false,dqFlags:[],dqResult:null}};if(id==='meds'){S.set({benchmarkConfig:{defaultUntouched:true,copiedConfig:false,splitDemographics:false,omrPrefix:false,hospitalLabPrefix:false,icuChartPrefix:false,runtimeOverride:false},benchmarkRun:null});A.refreshPage();return;}set(resets[id]||{});});
A.onAction('hab-xray-fix',el=>{const u=state();set({xrayFixes:toggle(u.xrayFixes,el.dataset.id),xrayResult:null});});
A.onAction('hab-xray-run',()=>{const u=state(),correct=xrayItems.filter(x=>x.truth).map(x=>x.id),missed=correct.filter(x=>!u.xrayFixes.includes(x)),added=u.xrayFixes.filter(id=>!correct.includes(id)),pass=!missed.length&&!added.length,votes=pass?5:Math.max(0,2-missed.length-added.length);set({xrayResult:{pass,message:pass?'只纠正了 3 个被影像和既往资料推翻的句子，没有新增发现。':`仍有 ${missed.length} 个草稿错误未纠正，并产生 ${added.length} 个不应修改的句子。`,metrics:[['零显著错误票',votes+'/5'],['遗漏',String(missed.length)],['不当新增',String(added.length)]]}});});
A.onAction('hab-trial-pick',el=>{const u=state(),id=el.dataset.id;if(!u.trialPicks.includes(id)&&u.trialPicks.length>=5){el.checked=false;A.toast('教学名单最多保留 5 项，对应论文的前 50 项限制','warn');return;}set({trialPicks:toggle(u.trialPicks,id),trialResult:null});});
A.onAction('hab-trial-run',()=>{const u=state(),gold=trialCandidates.filter(x=>x.gold).map(x=>x.id),hit=u.trialPicks.filter(x=>gold.includes(x)),recall=hit.length/gold.length,precision=u.trialPicks.length?hit.length/u.trialPicks.length:0,pass=recall===1;set({trialResult:{pass,message:pass?'所有合格试验都进入了有限名单；额外候选仍需人工逐条复核。':`漏掉 ${gold.length-hit.length} 项合格试验，所以召回率没有达到 1.0。`,metrics:[['召回率',recall.toFixed(2)],['精确率',precision.toFixed(2)],['命中',hit.length+'/'+gold.length]]}});});
A.onAction('hab-ct-window',el=>set({ctWindow:el.dataset.window}));
A.onAction('hab-ct-slice',el=>set({ctSlice:Number(el.value)}));
A.onAction('hab-ct-label',el=>{const u=state();set({ctLabels:{...u.ctLabels,[el.dataset.id]:el.dataset.value},ctResult:null});});
A.onAction('hab-ct-run',()=>{const u=state(),missing=ctFindings.filter(x=>!u.ctLabels[x[0]]).length,wrong=ctFindings.filter(x=>u.ctLabels[x[0]]&&u.ctLabels[x[0]]!==ctGold[x[0]]).length,correct=ctFindings.length-missing-wrong,pass=correct===ctFindings.length;set({ctResult:{pass,message:pass?'5 个标签全部正确，且每个标签恰好输出一次。':`正确 ${correct} 项、错误 ${wrong} 项、未回答 ${missing} 项；全标签精确匹配未通过。`,metrics:[['标签准确率',(correct/ctFindings.length).toFixed(2)],['错误',String(wrong)],['缺失',String(missing)]]}});});
A.onAction('hab-tumor-zoom',el=>set({tumorZoom:el.dataset.zoom}));
A.onAction('hab-tumor-tile',el=>{const u=state();set({tumorTiles:toggle(u.tumorTiles,Number(el.dataset.tile)),tumorResult:null});});
A.onAction('hab-tumor-run',()=>{const u=state(),tp=u.tumorTiles.filter(x=>tumorGold.includes(x)).length,fp=u.tumorTiles.length-tp,fn=tumorGold.length-tp,precision=tp/(tp+fp||1),recall=tp/(tp+fn||1),f1=2*precision*recall/(precision+recall||1),pass=f1>=.9;set({tumorResult:{pass,message:pass?'选区覆盖完整，边界误选控制在允许范围内。':`还有 ${fn} 个肿瘤瓦片漏选、${fp} 个非肿瘤瓦片误选。`,metrics:[['F1',f1.toFixed(3)],['精确率',precision.toFixed(3)],['召回率',recall.toFixed(3)]]}});});
A.onAction('hab-model-feature',el=>{const u=state();set({modelFeatures:toggle(u.modelFeatures,el.dataset.id),modelResult:null});});
A.onAction('hab-model-type',el=>set({modelType:el.dataset.model,modelResult:null}));
A.onAction('hab-model-run',()=>{const u=state(),base={logistic:.65,gbm:.68,xgb:.70}[u.modelType],gain={age:.01,dx:.025,labs:.02,meds:.018,recency:.02},clean=u.modelFeatures.filter(x=>gain[x]).reduce((s,x)=>s+gain[x],0),leak=u.modelFeatures.includes('future'),id=u.modelFeatures.includes('patientId'),val=Math.min(.94,base+clean+(leak?.14:0)+(id?.06:0)),test=Math.max(.3,Math.min(.86,base+clean-(leak?.12:0)-(id?.055:0))),pass=test>=.74;set({modelResult:{pass,val,test,message:pass?'隐藏测试集达到计数特征基线，方案具有可接受的泛化能力。':leak||id?'验证集看起来更高，但泄漏或记忆特征让隐藏测试集明显下降。':'模型或特征仍未达到 0.740 基线。',metrics:[['验证 AUROC',val.toFixed(3)],['测试 AUROC',test.toFixed(3)],['基线','0.740']]}});});
A.onAction('hab-dq-task',el=>set({dqTask:el.dataset.task,dqFlags:[],dqResult:null}));
A.onAction('hab-dq-clues',el=>set({dqClues:!!el.checked}));
A.onAction('hab-dq-flag',el=>{const u=state();set({dqFlags:toggle(u.dqFlags,el.dataset.id),dqResult:null});});
A.onAction('hab-dq-run',()=>{const u=state(),targets=dqTargets[u.dqTask],flagged=u.dqFlags.map(id=>dqRows.find(x=>x.id===id)),found=[...new Set(flagged.map(x=>x.cluster).filter(x=>targets.includes(x)))],tp=flagged.filter(x=>targets.includes(x.cluster)).length,precision=flagged.length?tp/flagged.length:0,recall=found.length/targets.length,pass=recall===1&&precision>=.01;set({dqResult:{pass,message:pass?'每个目标错误簇至少有一行被标记，且没有跌破精确率下限。':`仍有 ${targets.length-found.length} 个错误簇没有任何成员被发现。`,metrics:[['错误簇召回',recall.toFixed(2)],['行级精确率',precision.toFixed(2)],['覆盖簇',found.length+'/'+targets.length]]}});});
})();
