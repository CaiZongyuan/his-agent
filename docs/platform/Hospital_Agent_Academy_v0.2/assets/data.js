window.HospitalData = {
  hospital: {
    name: '华夏大学附属第一医院',
    englishName: 'Huaxia University First Affiliated Hospital (Synthetic)',
    synthetic: true,
    beds: 1500,
    inpatients: 1284,
    outpatients: 3421,
    departments: 38,
    campuses: ['本部院区', '东院区'],
    systems: [
      {id:'his', name:'医院信息系统', acronym:'HIS', owner:'信息中心 / 住院处', role:'挂号、住院、床位、医嘱、费用等综合业务', protocol:'REST + Oracle SQL View', freshness:'秒级/分钟级'},
      {id:'emr', name:'电子病历系统', acronym:'EMR', owner:'医务处 / 临床科室', role:'入院记录、病程记录、诊断、手术和出院文书', protocol:'SOAP + XML', freshness:'文书保存/签名后'},
      {id:'lis', name:'检验信息系统', acronym:'LIS', owner:'检验科', role:'检验申请、样本、仪器、审核和报告', protocol:'Legacy REST + DB View', freshness:'报告审核后'},
      {id:'pacs', name:'医学影像归档与通信系统', acronym:'PACS', owner:'放射科 / 影像科', role:'影像检查、序列、DICOM 对象和报告', protocol:'DICOM + DICOMweb', freshness:'检查/报告完成后'},
      {id:'nursing', name:'护理信息系统', acronym:'NIS', owner:'护理部', role:'生命体征、出入量、护理记录、风险评估', protocol:'SQL View + REST', freshness:'分钟级'},
      {id:'devices', name:'医疗设备网关', acronym:'Device Gateway', owner:'设备科 / 信息中心', role:'监护仪、输注泵等实时状态与事件', protocol:'WebSocket + Vendor SDK', freshness:'实时'}
    ]
  },

  patients: [
    {id:'pat_1028',name:'张某某',sex:'男',age:68,dob:'1958-03-18',dept:'心内科',deptCode:'CARD_01',bed:'12床',ward:'心内一病区',doctor:'王医生',doctorId:'D0918',admit:'2026-08-11 14:20',admitDiagnosis:'急性失代偿性心力衰竭',hisPatientNo:'00092882',inpatientNo:'ZY260813021',emrKey:'133884821',visitId:'V22881',lisId:'92882',pacsId:'P00092882',nursingId:'ZY260813021',idCardMasked:'310***********281X',phoneMasked:'138****6621',problems:['心力衰竭','慢性肾功能异常','高血压'],allergy:'青霉素（患者自述）',status:'在院',insurance:'城镇职工医保'},
    {id:'pat_1104',name:'李某某',sex:'女',age:54,dob:'1972-11-02',dept:'呼吸科',deptCode:'RESP_01',bed:'08床',ward:'呼吸一病区',doctor:'陈医生',doctorId:'D1041',admit:'2026-08-12 09:10',admitDiagnosis:'社区获得性肺炎',hisPatientNo:'00093210',inpatientNo:'ZY260814008',emrKey:'133891144',visitId:'V22940',lisId:'93210',pacsId:'P00093210',nursingId:'ZY260814008',idCardMasked:'320***********542X',phoneMasked:'139****1240',problems:['社区获得性肺炎','2型糖尿病'],allergy:'无已知药物过敏',status:'在院',insurance:'居民医保'},
    {id:'pat_1201',name:'周某某',sex:'男',age:36,dob:'1990-06-11',dept:'口腔科',deptCode:'DENT_01',bed:'门诊',ward:'口腔门诊',doctor:'赵医生',doctorId:'D3012',admit:'2026-08-14 08:30',admitDiagnosis:'右下第三磨牙阻生',hisPatientNo:'D0031092',inpatientNo:'-',emrKey:'DENT88421',visitId:'DV3102',lisId:'-',pacsId:'DENT-P31092',nursingId:'-',idCardMasked:'330***********363X',phoneMasked:'137****9088',problems:['右下第三磨牙阻生'],allergy:'无已知药物过敏',status:'门诊',insurance:'自费'},
    {id:'pat_1307',name:'吴某某',sex:'女',age:47,dob:'1979-01-23',dept:'普通外科',deptCode:'SURG_01',bed:'25床',ward:'普外二病区',doctor:'刘医生',doctorId:'D1188',admit:'2026-08-13 11:45',admitDiagnosis:'胆囊结石伴胆囊炎',hisPatientNo:'00093577',inpatientNo:'ZY260814025',emrKey:'133894778',visitId:'V22993',lisId:'93577',pacsId:'P00093577',nursingId:'ZY260814025',idCardMasked:'310***********474X',phoneMasked:'136****1459',problems:['胆囊结石伴胆囊炎'],allergy:'无已知药物过敏',status:'在院',insurance:'城镇职工医保'},
    {id:'pat_1402',name:'赵某某',sex:'男',age:72,dob:'1954-09-07',dept:'重症医学科',deptCode:'ICU_01',bed:'ICU-06',ward:'综合 ICU',doctor:'孙医生',doctorId:'D2217',admit:'2026-08-10 03:20',admitDiagnosis:'重症肺炎伴呼吸衰竭',hisPatientNo:'00092512',inpatientNo:'ZY260810006',emrKey:'133880006',visitId:'V22731',lisId:'92512',pacsId:'P00092512',nursingId:'ZY260810006',idCardMasked:'310***********721X',phoneMasked:'135****7763',problems:['重症肺炎','呼吸衰竭'],allergy:'磺胺类药物',status:'在院',insurance:'城镇职工医保'}
  ],

  beds: [
    {ward:'心内一病区',bed:'10床',status:'占用',patient:'pat_1500',sex:'女'},
    {ward:'心内一病区',bed:'11床',status:'空闲',patient:null,sex:null},
    {ward:'心内一病区',bed:'12床',status:'占用',patient:'pat_1028',sex:'男'},
    {ward:'心内一病区',bed:'13床',status:'清洁中',patient:null,sex:null},
    {ward:'心内一病区',bed:'14床',status:'占用',patient:'pat_1511',sex:'男'},
    {ward:'心内一病区',bed:'15床',status:'空闲',patient:null,sex:null},
    {ward:'呼吸一病区',bed:'08床',status:'占用',patient:'pat_1104',sex:'女'},
    {ward:'普外二病区',bed:'25床',status:'占用',patient:'pat_1307',sex:'女'},
    {ward:'综合 ICU',bed:'ICU-06',status:'占用',patient:'pat_1402',sex:'男'}
  ],

  orders: {
    pat_1028: [
      {id:'ORD-8821',type:'药物',name:'呋塞米注射液 20 mg',route:'静脉',frequency:'q12h',status:'执行中',start:'2026-08-12 08:00',doctor:'王医生'},
      {id:'ORD-8822',type:'药物',name:'螺内酯片 20 mg',route:'口服',frequency:'qd',status:'执行中',start:'2026-08-12 08:00',doctor:'王医生'},
      {id:'ORD-8823',type:'检验',name:'电解质 + 肾功能',route:'-',frequency:'复查',status:'已完成',start:'2026-08-14 05:40',doctor:'王医生'},
      {id:'ORD-8814',type:'药物',name:'氯化钾缓释片',route:'口服',frequency:'bid',status:'已停止',start:'2026-08-11 18:00',stop:'2026-08-13 09:00',doctor:'王医生'}
    ],
    pat_1104:[
      {id:'ORD-9121',type:'药物',name:'头孢曲松 2 g',route:'静脉',frequency:'qd',status:'执行中',start:'2026-08-12 11:00',doctor:'陈医生'},
      {id:'ORD-9122',type:'检验',name:'血常规 + CRP',route:'-',frequency:'qd',status:'已完成',start:'2026-08-14 05:30',doctor:'陈医生'}
    ],
    pat_1307:[{id:'ORD-9401',type:'手术申请',name:'腹腔镜胆囊切除术',route:'-',frequency:'一次',status:'待安排',start:'2026-08-15 09:00',doctor:'刘医生'}]
  },

  billing: {
    pat_1028:[
      {time:'08-11 14:22',category:'床位',item:'普通病房床位费',amount:80,status:'已记账'},
      {time:'08-12 09:05',category:'检查',item:'胸部 CT',amount:420,status:'已记账'},
      {time:'08-13 08:00',category:'药品',item:'呋塞米注射液',amount:18.6,status:'已记账'},
      {time:'08-14 05:40',category:'检验',item:'电解质 + 肾功能',amount:126,status:'已记账'}
    ]
  },

  dischargeChecklist: {
    pat_1028:[
      {id:'dc1',label:'责任医生发起出院',done:false,owner:'医生'},
      {id:'dc2',label:'完成出院小结',done:false,owner:'医生'},
      {id:'dc3',label:'完成出院带药核对',done:false,owner:'药师/医生'},
      {id:'dc4',label:'确认待回报检查',done:false,owner:'医生'},
      {id:'dc5',label:'结算与床位释放',done:false,owner:'住院处'}
    ]
  },

  notes: {
    pat_1028:[
      {id:'DOC-1001',type:'病程记录',time:'2026-08-14 05:50',author:'王医生',status:'已签名',title:'今日病程记录',text:'患者夜间气促较昨日加重，双下肢水肿仍明显。夜间尿量偏少，继续观察肾功能及电解质变化。'},
      {id:'DOC-1002',type:'入院记录',time:'2026-08-11 16:10',author:'王医生',status:'已签名',title:'入院记录',text:'因活动后气促及双下肢水肿入院。既往高血压病史，慢性肾功能异常。'},
      {id:'DOC-1003',type:'会诊记录',time:'2026-08-13 15:20',author:'李医生',status:'已签名',title:'肾内科会诊意见',text:'建议密切监测肾功能、电解质与尿量，结合容量状态调整治疗。'}
    ],
    pat_1104:[
      {id:'DOC-2001',type:'病程记录',time:'2026-08-14 06:10',author:'陈医生',status:'已签名',title:'今日病程记录',text:'咳嗽、发热，夜间血氧下降，继续抗感染并监测氧合。'},
      {id:'DOC-2002',type:'入院记录',time:'2026-08-12 10:20',author:'陈医生',status:'已签名',title:'入院记录',text:'发热、咳嗽三天入院，胸部影像提示感染性改变。'}
    ],
    pat_1307:[{id:'DOC-3001',type:'术前小结',time:'2026-08-14 09:20',author:'刘医生',status:'草稿',title:'术前小结',text:'拟行腹腔镜胆囊切除术，等待麻醉评估。'}]
  },

  diagnoses: {
    pat_1028:[{code:'I50.9',name:'心力衰竭',type:'主要诊断',status:'活动'},{code:'N18.9',name:'慢性肾脏病',type:'伴随诊断',status:'活动'},{code:'I10',name:'原发性高血压',type:'伴随诊断',status:'活动'}],
    pat_1104:[{code:'J18.9',name:'肺炎',type:'主要诊断',status:'活动'},{code:'E11.9',name:'2型糖尿病',type:'伴随诊断',status:'活动'}]
  },

  labs: [
    {patient:'pat_1028',sample:'SMP-8821',code:'K001',short:'K',name:'血钾',value:6.7,unit:'mmol/L',ref:'3.5–5.3',flag:'危急',time:'06:31',collected:'06:12',reported:'06:31',source:'LAB8842821',status:'待审核'},
    {patient:'pat_1028',sample:'SMP-8821',code:'CREA',short:'Cr',name:'肌酐',value:188,unit:'μmol/L',ref:'57–97',flag:'高',time:'06:31',collected:'06:12',reported:'06:31',source:'LAB8842822',status:'待审核'},
    {patient:'pat_1028',sample:'SMP-8821',code:'NA01',short:'Na',name:'血钠',value:136,unit:'mmol/L',ref:'137–147',flag:'低',time:'06:31',collected:'06:12',reported:'06:31',source:'LAB8842823',status:'待审核'},
    {patient:'pat_1028',sample:'SMP-8710',code:'K001',short:'K',name:'血钾',value:4.8,unit:'mmol/L',ref:'3.5–5.3',flag:'',time:'2026-08-13 06:20',collected:'2026-08-13 06:02',reported:'2026-08-13 06:20',source:'LAB8839102',status:'已发布'},
    {patient:'pat_1104',sample:'SMP-9022',code:'CRP',short:'CRP',name:'C反应蛋白',value:91,unit:'mg/L',ref:'0–8',flag:'高',time:'06:05',collected:'05:42',reported:'06:05',source:'LAB8842701',status:'已发布'}
  ],

  labSamples:[
    {id:'SMP-8821',patient:'pat_1028',type:'血清',barcode:'260814-005821',collected:'06:12',received:'06:19',status:'检测完成',quality:'合格',instrument:'AU5800-02'},
    {id:'SMP-9022',patient:'pat_1104',type:'血清',barcode:'260814-005940',collected:'05:42',received:'05:51',status:'报告完成',quality:'合格',instrument:'AU5800-01'},
    {id:'SMP-9107',patient:'pat_1307',type:'全血',barcode:'260814-006102',collected:'06:44',received:'06:55',status:'待检测',quality:'轻度溶血',instrument:'XN-1000'}
  ],

  labInstruments:[
    {id:'AU5800-01',name:'生化分析仪 01',status:'在线',queue:4,lastQC:'05:30',interface:'ASTM/TCP'},
    {id:'AU5800-02',name:'生化分析仪 02',status:'在线',queue:2,lastQC:'05:32',interface:'ASTM/TCP'},
    {id:'XN-1000',name:'血液分析仪',status:'在线',queue:7,lastQC:'05:10',interface:'HL7 v2'},
    {id:'BC-01',name:'血培养系统',status:'维护',queue:0,lastQC:'昨日 22:00',interface:'Vendor API'}
  ],

  vitals: {
    pat_1028:[['00:00','37.1','88','132/76','95','18'],['02:00','37.4','94','128/72','93','20'],['04:00','38.1','102','126/70','91','24'],['06:00','37.8','98','124/68','92','22']],
    pat_1104:[['00:00','38.0','96','118/71','94','21'],['04:00','38.5','104','116/69','91','25'],['06:00','38.2','100','120/72','92','23']],
    pat_1402:[['00:00','38.3','110','102/58','90','30'],['02:00','38.1','106','108/62','92','28'],['04:00','37.9','104','110/64','93','27']]
  },

  nursingNotes:{
    pat_1028:[
      {time:'00:40',type:'一般护理',author:'护士李',text:'患者诉轻度气促，取半卧位，继续观察。'},
      {time:'04:10',type:'异常观察',author:'护士李',text:'SpO₂ 降至 91%，复测后 92%，已告知值班医生。'},
      {time:'05:30',type:'出入量',author:'护士张',text:'夜间尿量偏少，已记录 6 小时尿量 240 mL。'}
    ]
  },

  ioRecords:{
    pat_1028:[
      {period:'00:00–06:00',intake:520,urine:240,otherOutput:0,balance:280},
      {period:'昨日 18:00–24:00',intake:650,urine:430,otherOutput:0,balance:220}
    ]
  },

  riskAssessments:{
    pat_1028:[
      {name:'跌倒风险',score:35,level:'中风险',time:'08-13 20:00'},
      {name:'压疮风险',score:18,level:'低风险',time:'08-13 20:00'},
      {name:'静脉血栓风险',score:3,level:'中风险',time:'08-13 20:00'}
    ]
  },

  devices:[
    {id:'MON-12',type:'床旁监护仪',location:'心内一病区 12床',patient:'pat_1028',vendor:'Synthetic Monitor',status:'在线',metrics:{HR:98,SpO2:92,RR:22,BP:'124/68'},protocol:'Vendor TCP → Device Gateway'},
    {id:'PUMP-12A',type:'输注泵',location:'心内一病区 12床',patient:'pat_1028',vendor:'Synthetic Pump',status:'运行中',metrics:{drug:'呋塞米',rate:'4 mL/h',remaining:'38 mL'},protocol:'Vendor SDK'},
    {id:'MON-ICU06',type:'床旁监护仪',location:'综合 ICU 06床',patient:'pat_1402',vendor:'Synthetic Monitor',status:'在线',metrics:{HR:104,SpO2:93,RR:27,BP:'110/64'},protocol:'Vendor TCP → Device Gateway'},
    {id:'CBCT-D01',type:'口腔 CBCT',location:'口腔影像室 1',patient:null,vendor:'Synthetic Dental',status:'空闲',metrics:{worklist:3,lastStudy:'08:42'},protocol:'DICOM Modality Worklist'}
  ],

  imaging:[
    {id:'STUDY-CT-889',patient:'pat_1028',study:'胸部 CT',date:'2026-08-12 10:18',accession:'CT260812889',modality:'CT',status:'报告完成',report:'双肺散在炎性改变，少量双侧胸腔积液。',series:[{id:'SER-1',name:'Scout',count:2},{id:'SER-2',name:'Lung 1.0mm',count:286},{id:'SER-3',name:'Mediastinum 3.0mm',count:96}],uid:'1.2.840.113619.2.55.3.604688.20260812.889'},
    {id:'STUDY-CBCT-031',patient:'pat_1201',study:'口腔 CBCT',date:'2026-08-14 08:42',accession:'CBCT260814031',modality:'CBCT',status:'影像完成',report:'待口腔医生阅片。',series:[{id:'D-SER-1',name:'Axial',count:412},{id:'D-SER-2',name:'Coronal',count:318},{id:'D-SER-3',name:'Sagittal',count:295},{id:'D-SER-4',name:'3D Reconstruction',count:1}],uid:'1.2.840.113619.2.55.3.604688.20260814.031'},
    {id:'STUDY-CT-104',patient:'pat_1104',study:'胸部 CT',date:'2026-08-12 11:03',accession:'CT260812904',modality:'CT',status:'报告完成',report:'右下肺片状实变影。',series:[{id:'R-SER-1',name:'Lung 1.0mm',count:244},{id:'R-SER-2',name:'Mediastinum 3.0mm',count:82}],uid:'1.2.840.113619.2.55.3.604688.20260812.904'}
  ],

  identityRecords:[
    {system:'HIS',identifier:'ZY260813021',type:'住院号',patient:'pat_1028',name:'张某某',dob:'1958-03-18',sex:'男',confidence:'authoritative'},
    {system:'EMR',identifier:'133884821',type:'PATIENT_KEY',patient:'pat_1028',name:'张某某',dob:'1958-03-18',sex:'男',confidence:'linked'},
    {system:'LIS',identifier:'92882',type:'PATID',patient:'pat_1028',name:'张某某',dob:'1958-03-18',sex:'男',confidence:'linked'},
    {system:'PACS',identifier:'P00092882',type:'PatientID',patient:'pat_1028',name:'张某某',dob:'1958-03-18',sex:'男',confidence:'linked'},
    {system:'旧系统 CSV',identifier:'ZMM-19580318',type:'LEGACY_ID',patient:null,name:'张某某',dob:'1958-03-18',sex:'男',confidence:'candidate'}
  ],

  fhirResources: {
    Patient:{resourceType:'Patient',id:'fhir-pat-1028',identifier:[{system:'urn:hospital:mrn',value:'00092882'}],name:[{text:'张某某'}],gender:'male',birthDate:'1958-03-18'},
    Encounter:{resourceType:'Encounter',id:'enc-22881',status:'in-progress',class:{code:'IMP',display:'inpatient encounter'},subject:{reference:'Patient/fhir-pat-1028'},period:{start:'2026-08-11T14:20:00+08:00'},serviceProvider:{display:'华夏大学附属第一医院'}},
    Observation:{resourceType:'Observation',id:'obs-lab8842821',status:'final',category:[{text:'Laboratory'}],code:{coding:[{system:'urn:hospital:lis',code:'K001',display:'血钾'}],text:'血钾'},subject:{reference:'Patient/fhir-pat-1028'},effectiveDateTime:'2026-08-14T06:12:00+08:00',issued:'2026-08-14T06:31:00+08:00',valueQuantity:{value:6.7,unit:'mmol/L'}},
    MedicationRequest:{resourceType:'MedicationRequest',id:'med-8821',status:'active',intent:'order',medicationCodeableConcept:{text:'呋塞米注射液 20 mg'},subject:{reference:'Patient/fhir-pat-1028'},authoredOn:'2026-08-12T08:00:00+08:00'},
    DiagnosticReport:{resourceType:'DiagnosticReport',id:'dr-ct889',status:'final',code:{text:'胸部 CT 报告'},subject:{reference:'Patient/fhir-pat-1028'},effectiveDateTime:'2026-08-12T10:18:00+08:00',conclusion:'双肺散在炎性改变，少量双侧胸腔积液。'},
    Task:{resourceType:'Task',id:'task-critical-1028',status:'requested',intent:'order',description:'复核并处理危急血钾结果',for:{reference:'Patient/fhir-pat-1028'},owner:{display:'心内科责任组'}}
  },

  meds:{pat_1028:['呋塞米 20 mg 静脉 q12h','螺内酯 20 mg 口服 qd','氯化钾缓释片（昨日已停）'],pat_1104:['头孢曲松 2 g 静脉 qd','胰岛素按血糖调整']},

  adapterMappings:{
    PATID:'patient_id',ITEM_CD:'code.source_code',ITEM_NAME:'code.source_display',RESULT_VAL:'value.value',RESULT_UNIT:'value.unit',REPORT_TIME:'clinical_time'
  },

  healthAgentBench:{
    stats:{tasks:54,categories:7,agents:10,trials:162,bestSuccess:42},
    categories:[
      {id:'meds',name:'电子健康记录（EHR）格式转换',en:'EHR Format Conversion',count:1,modality:'结构化电子健康记录',taskType:'流水线定制',challenge:'理解真实代码仓库、修改抽取配置并运行完整转换。',success:'所有配置检查与输出检查通过',accent:'green'},
      {id:'xray',name:'X 光报告纠错',en:'X-ray Report Correction',count:10,modality:'二维影像 + 文本',taskType:'报告纠错',challenge:'结合当前影像和既往检查修正有临床意义的错误。',success:'多数评审判定报告不存在临床显著错误',accent:'blue'},
      {id:'trials',name:'临床试验匹配',en:'Clinical Trial Matching',count:9,modality:'自由文本',taskType:'资格匹配',challenge:'从数百份试验方案中找全符合患者条件的试验。',success:'所有合格试验进入最有把握的前 50 项',accent:'orange'},
      {id:'ct',name:'计算机断层扫描（CT）异常分类',en:'CT Abnormality Classification',count:10,modality:'三维计算机断层扫描',taskType:'多标签分类',challenge:'分解数百张切片并识别所有要求的异常。',success:'每一个异常标签都正确',accent:'blue'},
      {id:'tumor',name:'病理肿瘤区域选择',en:'Pathology Tumor Area Selection',count:10,modality:'全切片病理影像',taskType:'区域选择',challenge:'在十亿像素级病理切片中定位肿瘤区域。',success:'切片级 F1 综合评分（精确率与召回率的调和平均）不低于 0.90',accent:'red'},
      {id:'ehrshot',name:'电子健康记录（EHR）临床事件建模',en:'EHR Event Modelling',count:6,modality:'纵向电子健康记录',taskType:'临床事件预测',challenge:'自主探索数据、构造特征、训练并改进预测模型。',success:'受试者工作特征曲线下面积（AUROC）达到人工特征基线',accent:'green'},
      {id:'dq',name:'电子健康记录（EHR）数据质量审计',en:'EHR Data Quality Auditing',count:8,modality:'表格型电子健康记录',taskType:'数据审计',challenge:'在 8 张、超过 80 万行的表中搜索并组合判断错误。',success:'找全注入的错误簇且精确率达到最低要求',accent:'orange'}
    ]
  },

  referenceStack:[
    {name:'Synthea',cn:'合成患者生成器',role:'背景人群与纵向病历',decision:'直接复用',layer:'模拟数据',replaceable:true,why:'避免自己从零构造数千名纵向患者。',ours:'中国本地化、Golden Patient、Source Projector、场景真相。'},
    {name:'Medplum',cn:'FHIR 医疗开发平台',role:'参考 FHIR EHR / FHIR Server / UI primitives',decision:'参考系统 + 选择性复用',layer:'FHIR / EHR',replaceable:true,why:'提供真实可运行的 FHIR 资源世界。',ours:'HACM/HACT 与 Agent Runtime 不依赖 Medplum。'},
    {name:'Orthanc',cn:'轻量医学影像服务器',role:'虚拟 PACS / DICOMweb',decision:'独立服务复用',layer:'医学影像',replaceable:true,why:'避免重造 DICOM 存储与 DICOMweb。',ours:'PACS Adapter、影像 Evidence、Agent Tool。'},
    {name:'OHIF',cn:'开放医疗影像 Web 查看器',role:'CT / MRI / CBCT Viewer',decision:'集成/扩展',layer:'医学影像',replaceable:true,why:'避免重造成熟 Viewer。',ours:'Dental Workspace、AI annotation、确认与审计。'},
    {name:'OpenMRS O3',cn:'开放医疗记录系统 O3 前端',role:'临床模块 / Extension Slot / Workspace 架构参考',decision:'架构参考',layer:'Clinical UX',replaceable:true,why:'其模块化临床前端思想与 Agent extension 很契合。',ours:'自己的 Product Module / Agent UI API。'},
    {name:'HealthAgentBench',cn:'医疗智能体评测基准',role:'任务 + 环境 + 轨迹 + 验证器设计',decision:'评测参考',layer:'Evaluation',replaceable:true,why:'帮助定义 executable healthcare task。',ours:'生产 Runtime、Scenario SDK、Verifier SDK。'},
    {name:'MedAgentBench',cn:'虚拟 EHR 智能体评测',role:'FHIR/EHR tool task 参考',decision:'研究参考',layer:'Evaluation',replaceable:true,why:'借任务语义和评测思路，不作为生产框架。',ours:'真实跨系统工具和中国医院场景。'},
    {name:'Inferno',cn:'FHIR / SMART 符合性测试框架',role:'协议符合性验证',decision:'测试工具',layer:'Conformance',replaceable:true,why:'标准协议验证不应该自己重复实现。',ours:'HACM/HACT contract test + 临床 Skill verifier。'}
  ],

  glossary:[
    ['HIS','医院信息系统','Hospital Information System','医院综合业务系统，常覆盖挂号、住院、医嘱、床位、收费等。','企业 ERP + 业务数据库','医院系统'],
    ['EMR','电子病历系统','Electronic Medical Record','保存医生书写的临床病历、诊断、病程和各类医疗文书。','面向临床叙事的文档/知识系统','医院系统'],
    ['LIS','检验信息系统','Laboratory Information System','管理检验申请、样本、检测过程和检验结果。','实验室工作流系统 + 结果数据库','医院系统'],
    ['PACS','医学影像归档与通信系统','Picture Archiving and Communication System','保存、查询和分发 CT、MRI、X 光、CBCT 等医学影像。','大对象存储 + 影像索引 + Viewer 后端','医院系统'],
    ['NIS','护理信息系统','Nursing Information System','支持护士记录生命体征、出入量、护理文书和风险评估。','实时患者状态 + 护理任务系统','医院系统'],
    ['DICOM','医学数字成像和通信标准','Digital Imaging and Communications in Medicine','医学影像对象、元数据及其网络交换的标准。','结构化媒体对象 + 元数据 + 网络协议','标准'],
    ['DICOMweb','基于网页协议的 DICOM 接口','DICOMweb','通过 HTTP/Web 技术查询、上传和获取 DICOM 影像的标准接口集合。','医学影像领域的 Web API','标准'],
    ['FHIR','快速医疗互操作资源','Fast Healthcare Interoperability Resources','HL7 定义的医疗数据交换标准，把患者、检验、就诊等拆为标准资源。','医疗领域的标准化资源 API','标准'],
    ['HACM','医院智能体临床模型','Hospital Agent Clinical Model','面向 Agent 的临床数据投影，建立在 FHIR、中国标准和医院原始数据之上。','Agent 的 domain model / canonical projection','我们平台'],
    ['HACT','医院智能体命令工具','Hospital Agent Command Tools','Agent 读取医院数据和执行获准动作的稳定命令集合。','面向 Agent 的 typed tool API','我们平台'],
    ['HACP','医院智能体能力说明','Hospital Agent Capability Profile','描述某医院/连接当前实际支持哪些能力；它不是最终授权。','capability negotiation','我们平台'],
    ['MPI','主患者索引','Master Patient Index','将不同系统中的患者标识解析到同一个真实患者。','entity resolution / identity graph','接入'],
    ['CBCT','锥形束计算机断层扫描','Cone Beam Computed Tomography','牙科常见三维 X 线断层成像方式。','牙科三维影像数据源','影像'],
    ['CPOE','计算机化医嘱录入','Computerized Provider Order Entry','医生录入药物、检验、检查等医嘱的系统/模块。','高风险 action system','医院系统'],
    ['SMART on FHIR','基于 FHIR 的医疗应用授权框架','SMART App Launch','让应用在 EHR/FHIR 环境中带患者上下文和授权安全启动。','OAuth/OIDC + healthcare scopes/context','标准'],
    ['Synthea','合成患者生成器','Synthetic Patient Population Simulator','开源的合成人群模拟器，可生成纵向患者记录并导出 FHIR 等格式。','synthetic data generator','参考实现'],
    ['Medplum','FHIR 医疗开发平台','Medplum','提供 FHIR 数据仓库、FHIR API、认证和 React 医疗组件的开源平台。','reference FHIR backend + UI primitives','参考实现'],
    ['Orthanc','轻量医学影像服务器','Orthanc','可作为独立 DICOM/PACS 服务，并通过插件支持 DICOMweb。','local image archive / PACS service','参考实现'],
    ['OHIF','开放医疗影像 Web Viewer','Open Health Imaging Foundation Viewer','面向 DICOMweb 的开源 Web 医学影像查看平台。','medical image web frontend','参考实现'],
    ['Verifier','验证器','Verifier','根据场景的必须项、禁止项和结果标准自动判断 Agent 任务是否完成。','task-specific test oracle','Agent'],
    ['Provenance','来源追踪','Provenance','记录数据来自哪个系统、哪条记录、哪一版连接器/映射以及读取时间。','data lineage','接入'],
    ['Clinical Time','临床发生时间','Clinical / Effective Time','事件在患者身上真正发生的时间，不等同于录入或报告发布时间。','event time vs processing time','数据'],
    ['Critical Value','危急值','Critical Laboratory Value','检验结果达到需要快速临床关注和闭环通知的预设范围。实际阈值与流程由医院制度定义。','high-priority event + acknowledgement workflow','工作流'],
    ['Study','影像检查','Imaging Study','一次影像检查的顶层对象，下面通常包含多个 Series。','media job / dataset','影像'],
    ['Series','影像序列','DICOM Series','同一次影像检查中使用相同采集条件形成的一组图像。','dataset partition / image stack','影像'],
    ['Source Projector','来源投影器','Hospital Source Projector','把模拟真相投影成不同医院系统的私有数据形态。','fixture generator / adapter inverse','模拟'],
    ['Simulation Truth','模拟真相层','Synthetic Clinical Truth','模拟器内部知道的真实患者状态；Agent 默认看不到，验证器可以读取。','hidden environment state / oracle','模拟'],
    ['AgentRun','智能体运行','Agent Run','一次有目标、权限、工具、证据、审批、结果和评测的完整执行记录。','workflow execution trace','Agent'],
    ['Human Gate','人工把关','Human Approval / Review Gate','流程必须等待有权限的人确认后才能继续的节点。','approval checkpoint','安全']
  ]
};
