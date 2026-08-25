(function(){
  const D=window.HospitalData, S=window.HospitalState;
  const PAGE=document.body.dataset.page||'index';
  const pages={}, actions={};
  const navGroups=[
    ['开始',[['index','00','进入虚拟医院'],['hospital','01','医院系统全景']]],
    ['医院世界',[['his','02','HIS 医院信息系统'],['emr','03','EMR 电子病历'],['lis','04','LIS 检验系统'],['pacs','05','PACS 医学影像'],['nursing','06','护理系统'],['devices','07','医疗设备']]],
    ['数据与接入',[['identity','08','患者身份匹配'],['synthetic-data','09','合成患者与真相层'],['fhir','10','FHIR / Medplum'],['adapter','11','Adapter 接入工作台'],['hacm','12','HACM 临床模型']]],
    ['Agent 执行',[['hact','13','HACT 命令工具'],['agent-runtime','14','Agent Runtime'],['critical-result','15','危急值剧场'],['dental-ct','16','牙科 CBCT 剧场']]],
    ['评测实验室',[['healthagentbench','17','HealthAgentBench 总览'],['healthagentbench-labs','18','七类互动任务实验'],['ehr-format-conversion','19','格式转换深挖']]],
    ['收束',[['architecture','20','完整架构'],['reference-stack','21','参考实现栈'],['glossary','22','医疗术语字典']]]
  ];
  const titles={index:'欢迎进入虚拟医院',hospital:'一家医院到底有哪些系统',his:'医院信息系统 HIS',emr:'电子病历系统 EMR',lis:'检验信息系统 LIS',pacs:'医学影像系统 PACS',nursing:'护理信息系统 NIS',devices:'医疗设备世界',identity:'张某某到底是谁？','synthetic-data':'虚拟患者怎么产生',fhir:'FHIR 与 Medplum',adapter:'医院接入工作台',hacm:'医院智能体临床模型 HACM',hact:'医院智能体命令工具 HACT','agent-runtime':'Agent Runtime 调试器','critical-result':'危急值完整剧场','dental-ct':'牙科 CBCT 完整剧场',healthagentbench:'HealthAgentBench 评测课','healthagentbench-labs':'七类互动任务实验','ehr-format-conversion':'电子健康记录格式转换实验',architecture:'最终系统架构','reference-stack':'参考实现技术栈',glossary:'医疗术语字典'};
  const layerFor={index:'overview',hospital:'source',his:'source',emr:'source',lis:'source',pacs:'source',nursing:'source',devices:'source',identity:'adapter','synthetic-data':'simulation',fhir:'source',adapter:'adapter',hacm:'model',hact:'tool','agent-runtime':'runtime','critical-result':'workflow','dental-ct':'workflow',healthagentbench:'evaluation','healthagentbench-labs':'evaluation','ehr-format-conversion':'evaluation',architecture:'overview','reference-stack':'overview',glossary:'overview'};

  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function patient(id){return D.patients.find(x=>x.id===id)||D.patients[0];}
  function selectedPatient(){return patient(S.get().selectedPatient);}
  function term(acr){return D.glossary.find(x=>x[0]===acr);}
  function tag(txt,kind=''){return `<span class="tag ${kind}">${txt}</span>`;}
  function fmtMoney(n){return new Intl.NumberFormat('zh-CN',{style:'currency',currency:'CNY'}).format(Number(n||0));}
  function statusTag(s){let k=/危急|异常|离线|失败|停止|超时|拒绝/.test(s)?'red':/待|清洁|草稿|维护|高|低|中风险/.test(s)?'orange':/完成|在线|已签名|已发布|确认|通过|执行中|运行中|在院/.test(s)?'green':'blue';return tag(esc(s),k);}
  function link(k){return k==='index'?'index.html':k+'.html';}
  function raw(obj){return `<pre class="raw">${esc(typeof obj==='string'?obj:JSON.stringify(obj,null,2))}</pre>`;}
  function kv(items){return `<dl class="kv">${items.map(([k,v])=>`<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl>`;}
  function metric(label,value,sub=''){return `<div class="metric-box"><small>${label}</small><strong>${value}</strong>${sub?`<span>${sub}</span>`:''}</div>`;}
  function learn(title,body){return `<div class="learn-note"><strong>${title}</strong><br>${body}</div>`;}
  function tabs(items,active){return `<div class="subtabs">${items.map(([id,name])=>`<button class="subtab ${id===active?'active':''}" data-action="set-tab" data-tab="${id}">${name}</button>`).join('')}</div>`;}
  function patientBanner(p=selectedPatient()){return `<div class="patient-banner"><div><div class="patient-name">${p.name} <span class="tag blue">${p.sex} · ${p.age}岁</span></div><div class="patient-meta"><span>${p.dept}</span><span>${p.ward}</span><span>${p.bed}</span><span>责任医生 ${p.doctor}</span><span>入院 ${p.admit}</span></div></div><div class="tags">${statusTag(p.status)}${tag('HACM '+p.id,'blue')}</div></div>`;}
  function patientSelector(){return `<select class="select" id="patientSelect" data-action="select-patient">${D.patients.map(p=>`<option value="${p.id}" ${p.id===S.get().selectedPatient?'selected':''}>${p.name} · ${p.dept} · ${p.bed}</option>`).join('')}</select>`;}
  function section(title,intro,body,actions=''){return `<section class="section"><div class="section-head"><div><h3>${title}</h3>${intro?`<div class="section-intro">${intro}</div>`:''}</div>${actions}</div>${body}</section>`;}
  function hero(eyebrow,title,desc,side=''){return `<section class="hero"><div class="hero-copy"><div class="eyebrow">${eyebrow}</div><h2>${title}</h2><p>${desc}</p></div><div class="hero-side">${side||`<h3>虚拟医院状态</h3><div class="kpi-grid"><div class="kpi"><small>模拟时间</small><strong class="clock">${S.get().simTime}</strong></div><div class="kpi"><small>当前患者</small><strong>${selectedPatient().name}</strong></div><div class="kpi"><small>事件数</small><strong>${S.get().eventLog.length}</strong></div><div class="kpi"><small>模式</small><strong>${S.get().mode==='learn'?'学习':'产品'}</strong></div></div>`}</div></section>`;}
  function eventTimeline(limit=10,filter=null){let arr=S.get().eventLog.slice().filter(e=>!filter||filter(e)).slice(-limit).reverse();return arr.length?`<div class="timeline">${arr.map(e=>`<div class="timeline-item ${e.severity==='danger'?'danger':''}"><time>${e.time} · ${esc(e.system||'Platform')}</time><strong>${esc(e.type)}</strong><p>${esc(e.label)}</p></div>`).join('')}</div>`:'<div class="empty">暂无事件。</div>';}
  function auditStrip(){let e=S.get().eventLog.at(-1);return `<div class="audit-strip"><span>${e?esc(e.time):'--:--:--'}</span><strong>${e?esc(e.type):'暂无事件'}</strong><span>${e?esc(e.label):''}</span></div>`;}
  function contextBar(){const current=layerFor[PAGE];const nodes=[['source','医院来源系统'],['adapter','接入与身份'],['model','医院智能体临床模型（HACM）'],['tool','医院智能体命令工具（HACT）'],['runtime','智能体运行'],['workflow','医生工作流'],['evaluation','场景与验证']];return `<div class="context-bar">${nodes.map((n,i)=>`${i?'<span>→</span>':''}<span class="architecture-node ${current===n[0]?'active':''}">${n[1]}</span>`).join('')}</div>`;}
  function devPanel(title,body){return `<div class="dev-only side-section"><h5>${title}</h5>${body}</div>`;}
  function empty(title,desc=''){return `<div class="empty"><strong>${title}</strong>${desc?`<p>${desc}</p>`:''}</div>`;}

  function openDrawer(title,html){const d=document.getElementById('drawer'),o=document.getElementById('overlay');d.innerHTML=`<div class="drawer-head"><div><strong>${title}</strong></div><button class="btn" data-action="close-drawer">关闭</button></div><div class="drawer-body">${html}</div>`;d.classList.add('open');o.classList.add('open');}
  function closeDrawer(){document.getElementById('drawer')?.classList.remove('open');document.getElementById('overlay')?.classList.remove('open');}
  function toast(msg,kind='info'){let stack=document.querySelector('.toast-stack');if(!stack){stack=document.createElement('div');stack.className='toast-stack';document.body.appendChild(stack);}const t=document.createElement('div');t.className='toast '+kind;t.textContent=msg;stack.appendChild(t);setTimeout(()=>t.remove(),2400);}
  function glossaryDrawer(){openDrawer('医疗术语速查',`<label class="field-label">搜索术语<input class="input" id="drawerGlossarySearch" placeholder="例如 HIS、FHIR、危急值"></label><div id="drawerGlossaryList">${D.glossary.map(g=>`<div class="term-row" data-drawer-term="${(g.join(' ')).toLowerCase()}"><strong>${g[0]} · ${g[1]}</strong><small>${g[2]}</small><p>${g[3]}</p><div class="mini-callout">Agent 类比：${g[4]}</div></div>`).join('')}</div>`);setTimeout(()=>{document.getElementById('drawerGlossarySearch')?.addEventListener('input',e=>{let q=e.target.value.toLowerCase();document.querySelectorAll('[data-drawer-term]').forEach(x=>x.style.display=x.dataset.drawerTerm.includes(q)?'block':'none');});},0);}

  function shell(){const st=S.get();const nav=navGroups.map(g=>`<div class="nav-group"><div class="nav-label">${g[0]}</div>${g[1].map(n=>`<a class="nav-link ${PAGE===n[0]?'active':''}" href="${link(n[0])}"><span class="nav-num">${n[1]}</span><span>${n[2]}</span></a>`).join('')}</div>`).join('');document.getElementById('app').innerHTML=`<div class="app-shell ${st.mode==='product'?'product-mode':''} ${st.view==='developer'?'developer-view':''}" id="shell"><aside class="sidebar"><div class="brand"><h1>医院智能体开发者学院</h1><p>Hospital Agent Academy<br>在一所虚拟医院里学习医疗 Agent。</p></div>${nav}</aside><main class="main"><header class="topbar"><div class="top-left"><strong>${titles[PAGE]||''}</strong><span class="crumb">${D.hospital.name} · <span class="clock">${st.simTime}</span></span></div><div class="top-actions"><button class="btn mode-btn ${st.mode==='learn'?'active':''}" data-action="mode-learn">学习模式</button><button class="btn mode-btn ${st.mode==='product'?'active':''}" data-action="mode-product">产品模式</button><button class="btn" data-action="toggle-view">${st.view==='developer'?'切回医生视角':'开发者视角'}</button></div></header><div class="content">${contextBar()}<div id="content"></div></div></main></div><div class="overlay" id="overlay"></div><aside class="drawer" id="drawer"></aside><button class="floating-help" data-action="glossary" aria-label="医疗术语" title="医疗术语"><span aria-hidden="true">？</span><span class="help-label">医疗术语</span></button>`;renderPage();}
  function renderPage(){const fn=pages[PAGE];document.getElementById('content').innerHTML=fn?fn():hero('页面建设中',titles[PAGE]||PAGE,'这个页面正在升级为深度交互模拟。');}
  function refresh(){shell();}
  function refreshPage(){renderPage();}
  function setTab(tab){S.setUi(PAGE,{tab});refreshPage();}

  actions['mode-learn']=()=>{S.set({mode:'learn'});refresh();};
  actions['mode-product']=()=>{S.set({mode:'product'});refresh();};
  actions['toggle-view']=()=>{S.set({view:S.get().view==='doctor'?'developer':'doctor'});refresh();};
  actions['glossary']=glossaryDrawer;
  actions['close-drawer']=closeDrawer;
  actions['set-tab']=(el)=>setTab(el.dataset.tab);
  actions['select-patient']=(el)=>{S.set({selectedPatient:el.value});refreshPage();};
  actions['reset-sim']=()=>{S.reset();refresh();toast('虚拟医院已重置');};
  actions['tick-time']=(el)=>{S.tick(Number(el.dataset.seconds||60));refreshPage();};
  actions['show-events']=()=>openDrawer('全院事件与审计日志',eventTimeline(60));

  document.addEventListener('click',e=>{const el=e.target.closest('[data-action]');if(!el)return;if(['SELECT','INPUT','TEXTAREA'].includes(el.tagName))return;const fn=actions[el.dataset.action];if(fn){e.preventDefault();fn(el,e);}});
  document.addEventListener('change',e=>{const el=e.target.closest('[data-action]');if(!el)return;const fn=actions[el.dataset.action];if(fn)fn(el,e);});
  document.getElementById('overlay')?.addEventListener('click',closeDrawer);

  window.Academy={D,S,PAGE,pages,actions,registerPage:(id,fn)=>pages[id]=fn,onAction:(id,fn)=>actions[id]=fn,esc,patient,selectedPatient,term,tag,statusTag,fmtMoney,raw,kv,metric,learn,tabs,patientBanner,patientSelector,section,hero,eventTimeline,auditStrip,devPanel,empty,openDrawer,closeDrawer,toast,refresh,refreshPage,setTab};
})();
