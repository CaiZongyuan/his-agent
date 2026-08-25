(function(){
  const defaults = {
    mode:'learn',
    view:'doctor',
    simTime:'06:30:00',
    selectedPatient:'pat_1028',
    ui:{},
    criticalPublished:false,
    criticalAcknowledged:false,
    criticalEscalated:false,
    criticalTaskStatus:'none',
    oxygenLow:false,
    dentalAnalyzed:false,
    dentalConfirmed:false,
    dentalAnnotation:'candidate',
    bedOverrides:{},
    extraOrders:{},
    stoppedOrders:[],
    dischargeStarted:{},
    dischargeDone:{},
    emrDrafts:{},
    signedDocs:[],
    sampleOverrides:{},
    deviceOverrides:{},
    identityResolved:false,
    identityManualLink:null,
    generatedPatient:null,
    adapterMappings:null,
    adapterConnected:true,
    runtimePaused:false,
    runRetries:0,
    benchmarkConfig:{
      defaultUntouched:true,
      copiedConfig:false,
      splitDemographics:false,
      omrPrefix:false,
      hospitalLabPrefix:false,
      icuChartPrefix:false,
      runtimeOverride:false
    },
    benchmarkRun:null,
    eventLog:[
      {time:'06:30:00',type:'simulation.started',label:'虚拟医院开始运行',system:'HospitalSim',severity:'info'}
    ]
  };

  function clone(x){ return JSON.parse(JSON.stringify(x)); }
  function read(){
    let saved=null;
    try{ saved=localStorage.getItem('hospitalAcademyStateV2'); }catch(e){}
    if(!saved && window.name && window.name.startsWith('HOSPITAL_ACADEMY_V2:')) saved=window.name.slice('HOSPITAL_ACADEMY_V2:'.length);
    try{ return Object.assign(clone(defaults), saved?JSON.parse(saved):{}); }catch(e){ return clone(defaults); }
  }

  let state=read();

  function save(){
    const txt=JSON.stringify(state);
    try{ localStorage.setItem('hospitalAcademyStateV2',txt); }catch(e){}
    window.name='HOSPITAL_ACADEMY_V2:'+txt;
  }

  function emit(){ save(); window.dispatchEvent(new CustomEvent('hospital-state',{detail:state})); }

  function log(type,label,time,system='Platform',severity='info',meta={}){
    state.eventLog.push({time:time||state.simTime,type,label,system,severity,meta});
    if(state.eventLog.length>120) state.eventLog=state.eventLog.slice(-120);
    save();
  }

  function set(patch){ state=Object.assign(state,patch); emit(); }
  function mutate(fn){ fn(state); emit(); }
  function setUi(page,patch){ state.ui[page]=Object.assign({},state.ui[page]||{},patch); emit(); }
  function getUi(page){ return state.ui[page]||{}; }
  function reset(){ state=clone(defaults); emit(); }
  function resetWorkflow(){
    state.criticalPublished=false;
    state.criticalAcknowledged=false;
    state.criticalEscalated=false;
    state.criticalTaskStatus='none';
    state.runtimePaused=false;
    state.runRetries=0;
    state.eventLog=state.eventLog.filter(e=>!String(e.type).startsWith('critical')&&!String(e.type).startsWith('agent.')&&!String(e.type).startsWith('task.'));
    log('workflow.reset','危急值工作流已重置',state.simTime,'HospitalSim','info');
    emit();
  }

  function tick(seconds){
    const [h,m,s]=state.simTime.split(':').map(Number);
    let total=h*3600+m*60+s+seconds;
    total=(total+86400)%86400;
    const hh=String(Math.floor(total/3600)).padStart(2,'0');
    const mm=String(Math.floor((total%3600)/60)).padStart(2,'0');
    const ss=String(total%60).padStart(2,'0');
    state.simTime=`${hh}:${mm}:${ss}`;
    emit();
  }

  window.HospitalState={
    get:()=>state,
    set,
    mutate,
    setUi,
    getUi,
    log,
    reset,
    resetWorkflow,
    tick
  };
})();
