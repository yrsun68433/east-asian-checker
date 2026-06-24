import { useState, useMemo } from "react";

// lastOffered: 最近一次開設學期，格式 "YYY-S"（民國年-學期），用於排序
// 未知者填 "000-0" 排最後
const COURSE_DB = [
  // ── 東亞政治與國際關係 ──
  { id: "NtlDev5343", name: "東亞的獨裁與民主",              category: "politics", lang: "en", lastOffered: "114-1" },
  { id: "NtlDev5342", name: "當代台灣政治導讀",              category: "politics", lang: "en", lastOffered: "114-1" },
  { id: "NtlDev7150", name: "文明視野下的世界局勢",          category: "politics", lang: "zh", lastOffered: "114-1" },
  { id: "PS5672",     name: "東亞政治經濟專題",              category: "politics", lang: "en", lastOffered: "114-1" },
  { id: "PS5715",     name: "兩岸政經互動專題",              category: "politics", lang: "zh", lastOffered: "114-1" },
  { id: "PS5701",     name: "東亞民主化專題",                category: "politics", lang: "zh", lastOffered: "114-1" },
  { id: "PS7567",     name: "全球化與東亞政經發展專題",      category: "politics", lang: "zh", lastOffered: "114-1" },
  { id: "PS7581",     name: "國際關係理論與中共外交專題",    category: "politics", lang: "zh", chinaStudies: true, lastOffered: "114-1" },
  { id: "NtlDev5313", name: "鄧小平後的大陸政經改革專題",   category: "politics", lang: "zh", chinaStudies: true, lastOffered: "114-1" },
  { id: "NtlDev7158", name: "歐盟莫內講座-兩岸經濟發展專題",category: "politics", lang: "zh", chinaStudies: true, lastOffered: "114-1" },
  { id: "PS7042",     name: "中國大陸政經發展專題",          category: "politics", lang: "zh", chinaStudies: true, lastOffered: "114-1" },
  { id: "PS5676",     name: "中國大陸政治經濟專題",          category: "politics", lang: "zh", chinaStudies: true, lastOffered: "113-2" },
  { id: "PS5720",     name: "比較東南亞政治專題",            category: "politics", lang: "zh", lastOffered: "114-1" },
  { id: "NtlDev5337", name: "世界視野中的東亞",              category: "politics", lang: "zh", lastOffered: "113-2" },
  { id: "NtlDev5339", name: "東亞的民族主義與認同",          category: "politics", lang: "en", lastOffered: "113-2" },
  { id: "NtlDev5336", name: "當代台灣政治",                  category: "politics", lang: "en", lastOffered: "113-2" },
  { id: "PS5675",     name: "亞洲區域主義專題",              category: "politics", lang: "zh", lastOffered: "113-2" },
  { id: "PS5066",     name: "東亞專題",                      category: "politics", lang: "zh", lastOffered: "113-2" },
  { id: "PS7052",     name: "區域研究方法專題",              category: "politics", lang: "zh", lastOffered: "113-2" },
  { id: "PS5683",     name: "古希臘與印度現實主義淵源專題",  category: "politics", lang: "zh", lastOffered: "113-2" },
  { id: "Prog3002",   name: "日本外交探討",                  category: "politics", lang: "zh", lastOffered: "113-2" },
  { id: "Hist1630",   name: "東亞歷史上的政教關係",          category: "politics", lang: "zh", lastOffered: "113-2" },
  { id: "Hist5426",   name: "現代日本政治外交史",            category: "politics", lang: "zh", lastOffered: "113-2" },
  { id: "PS3102",     name: "台灣地區政治經濟發展",          category: "politics", lang: "zh", lastOffered: "113-2" },
  { id: "NtlDev8045", name: "比較政治與中國大陸研究專題",    category: "politics", lang: "zh", chinaStudies: true, lastOffered: "113-2" },
  { id: "PS7622",     name: "冷戰時期的東亞國際關係專題",    category: "politics", lang: "zh", lastOffered: "113-1" },
  { id: "NtlDev5335", name: "東亞的獨裁化與民主化",          category: "politics", lang: "en", lastOffered: "113-1" },
  { id: "Prog3001",   name: "日本政治探討",                  category: "politics", lang: "zh", lastOffered: "113-1" },
  { id: "PS4650",     name: "東亞政治",                      category: "politics", lang: "zh", lastOffered: "113-1" },
  { id: "Soc5094",    name: "日本的民主與公民社會",          category: "politics", lang: "zh", lastOffered: "113-1" },
  { id: "PS4646",     name: "現代日本政治思想",              category: "politics", lang: "zh", lastOffered: "113-1" },
  { id: "PS7613",     name: "日本政治思想專題",              category: "politics", lang: "zh", lastOffered: "113-1" },
  { id: "PS7011",     name: "中國政治思想專題",              category: "politics", lang: "zh", chinaStudies: true, lastOffered: "114-1" },
  { id: "NtlDev5317", name: "中國科技、政治與社會",          category: "politics", lang: "zh", chinaStudies: true, lastOffered: "113-1" },
  { id: "COSS1001",   name: "東亞導論",                      category: "politics", lang: "en", lastOffered: "113-2" },
  { id: "PS5686",     name: "近代日本國際關係專題",          category: "politics", lang: "zh", lastOffered: "113-2" },
  { id: "PS5730",     name: "國際政治經濟學",                category: "politics", lang: "zh", lastOffered: "112-2" },
  { id: "PS7608",     name: "兩岸政經互動專題（碩）",        category: "politics", lang: "zh", lastOffered: "110-1" },
  { id: "NtlDev7153", name: "中國與全球氣候治理專題",        category: "politics", lang: "zh", chinaStudies: true, lastOffered: "113-2" },
  { id: "NtlDev7075", name: "中國大陸法政專題",              category: "politics", lang: "zh", chinaStudies: true, lastOffered: "111-2" },
  { id: "PS7532",     name: "兩岸關係研究途徑專題",          category: "politics", lang: "zh", chinaStudies: true, lastOffered: "108-1" },
  { id: "PS5061",     name: "中共黨史導論專題",              category: "politics", lang: "zh", chinaStudies: true, lastOffered: "109-1" },
  { id: "NtlDev5295", name: "中國大陸與世界政治專題",        category: "politics", lang: "zh", chinaStudies: true, lastOffered: "110-1" },
  { id: "NtlDev5017", name: "兩岸關係專題研究",              category: "politics", lang: "zh", chinaStudies: true, lastOffered: "111-2" },
  { id: "NtlDev7091", name: "兩岸經濟發展專題",              category: "politics", lang: "zh", chinaStudies: true, lastOffered: "110-1" },
  { id: "NtlDev5062", name: "現階段大陸政策分析專題",        category: "politics", lang: "zh", chinaStudies: true, lastOffered: "110-1" },
  { id: "PS8567",     name: "中國大陸國際關係案例專題研究",  category: "politics", lang: "zh", chinaStudies: true, lastOffered: "110-2" },
  { id: "PS4572",     name: "政治經濟分析",                  category: "politics", lang: "zh", lastOffered: "112-1" },
  { id: "PS4638",     name: "東南亞政治",                    category: "politics", lang: "zh", lastOffered: "110-1" },
  { id: "PS5010",     name: "東北亞安全專題",                category: "politics", lang: "zh", lastOffered: "109-2" },
  { id: "PS7057",     name: "東亞政經發展專題",              category: "politics", lang: "zh", lastOffered: "110-2" },
  { id: "PS7583",     name: "東南亞國際關係專題",            category: "politics", lang: "zh", lastOffered: "111-1" },
  { id: "PS4640",     name: "琉球與東亞國際關係",            category: "politics", lang: "zh", lastOffered: "107-2" },
  { id: "PS4643",     name: "東亞各國政治文化經濟",          category: "politics", lang: "zh", lastOffered: "108-1" },
  { id: "NtlDev5327", name: "全球化時代的日本",              category: "politics", lang: "zh", lastOffered: "111-1" },
  { id: "PS7616",     name: "比較東南亞政治專題",            category: "politics", lang: "zh", lastOffered: "109-1" },
  { id: "PS4632",     name: "亞太政治導論",                  category: "politics", lang: "en", lastOffered: "106-1" },
  { id: "PS7603",     name: "防擴散國際安全與國際法專題",    category: "politics", lang: "en", lastOffered: "105-2" },
  { id: "NtlDev7152", name: "中國國家資本主義專題",          category: "politics", lang: "zh", lastOffered: "110-2" },

  // ── 東亞經濟 ──
  { id: "PS7567b",    name: "全球化與東亞政經發展專題",      category: "economics", lang: "zh", lastOffered: "114-1" },
  { id: "IB7089",     name: "中國經濟專題研討",              category: "economics", lang: "zh", chinaStudies: true, lastOffered: "114-1" },
  { id: "AGEC7111",   name: "中國經濟",                      category: "economics", lang: "zh", chinaStudies: true, lastOffered: "114-1" },
  { id: "Prog3013",   name: "日本經濟動向分析",              category: "economics", lang: "zh", lastOffered: "113-2" },
  { id: "Prog3008",   name: "日本經濟發展與結構變化",        category: "economics", lang: "zh", lastOffered: "113-1" },
  { id: "ECON3008",   name: "經濟史二",                      category: "economics", lang: "en", lastOffered: "112-2" },
  { id: "PS7057b",    name: "東亞政經發展專題",              category: "economics", lang: "zh", lastOffered: "110-2" },
  { id: "NtlDev7152b",name: "中國國家資本主義專題",          category: "economics", lang: "zh", lastOffered: "110-2" },
  { id: "NtlDev5213", name: "中國經濟發展與改革專題",        category: "economics", lang: "zh", chinaStudies: true, lastOffered: "109-2" },
  { id: "ECON5153",   name: "國際政治經濟",                  category: "economics", lang: "en", lastOffered: "107-2" },
  { id: "ECON5003",   name: "市場與台灣經濟發展二",          category: "economics", lang: "en", lastOffered: "111-2" },
  { id: "ECON4016",   name: "日文經濟學選讀一",              category: "economics", lang: "zh", lastOffered: "107-1" },

  // ── 東亞社會與媒體 ──
  { id: "NtlDev5329", name: "東亞勞動力市場政策",            category: "society",   lang: "en", lastOffered: "114-1" },
  { id: "Soc5023",    name: "當代台灣社會",                  category: "society",   lang: "en", lastOffered: "114-1" },
  { id: "NtlDev7180", name: "淨零碳排與公正轉型：東亞觀點",  category: "society",   lang: "zh", lastOffered: "114-1" },
  { id: "Soc5034",    name: "亞洲的家庭與性別",              category: "society",   lang: "en", lastOffered: "113-2" },
  { id: "NtlDev5333", name: "東亞社會不平等治理",            category: "society",   lang: "en", lastOffered: "113-2" },
  { id: "BP7221",     name: "當代亞洲的後殖民空間再現",      category: "society",   lang: "zh", lastOffered: "113-2" },
  { id: "Soc5009",    name: "東亞社會比較研究",              category: "society",   lang: "en", lastOffered: "113-2" },
  { id: "Soc3060",    name: "東亞社會運動",                  category: "society",   lang: "en", lastOffered: "113-1" },
  { id: "Soc5094b",   name: "日本的民主與公民社會",          category: "society",   lang: "zh", lastOffered: "113-1" },
  { id: "CHIN4073",   name: "東亞越境文學與文化",            category: "society",   lang: "zh", lastOffered: "113-1" },
  { id: "Soc2062",    name: "東亞社會田野研究工作坊",        category: "society",   lang: "zh", lastOffered: "114-1" },
  { id: "PS5672b",    name: "東亞政治經濟專題",              category: "society",   lang: "en", lastOffered: "114-1" },
  { id: "PS5715b",    name: "兩岸政經互動專題",              category: "society",   lang: "zh", lastOffered: "114-1" },
  { id: "PS5730b",    name: "國際政治經濟學",                category: "society",   lang: "zh", lastOffered: "112-2" },
  { id: "NtlDev7132", name: "東亞發展研究中的性別視角",      category: "society",   lang: "en", lastOffered: "113-2" },
  { id: "SW7033",     name: "高齡社會與福利政策專題",        category: "society",   lang: "zh", lastOffered: "111-2" },
  { id: "SW5022",     name: "社會企業與創新",                category: "society",   lang: "zh", lastOffered: "111-1" },
  { id: "PS5676b",    name: "中國大陸政治經濟專題",          category: "society",   lang: "zh", chinaStudies: true, lastOffered: "113-2" },
  { id: "NtlDev5213b",name: "中國經濟發展與改革專題（研）",  category: "society",   lang: "zh", chinaStudies: true, lastOffered: "109-2" },
  { id: "AGEC7111b",  name: "中國經濟（農）",                category: "society",   lang: "zh", chinaStudies: true, lastOffered: "114-1" },
  { id: "IB7089b",    name: "中國經濟專題研討（管）",        category: "society",   lang: "zh", chinaStudies: true, lastOffered: "114-1" },
  { id: "Soc5013",    name: "東亞政治經濟分析",              category: "society",   lang: "zh", lastOffered: "113-2" },
  { id: "SW3024",     name: "東亞社會政策",                  category: "society",   lang: "zh", lastOffered: "111-1" },
  { id: "COSS5001",   name: "全球在地化：慈善機構在臺灣",    category: "society",   lang: "en", lastOffered: "107-2" },
  { id: "PS7608b",    name: "兩岸政經互動專題（碩）",        category: "society",   lang: "zh", lastOffered: "110-1" },
  { id: "PS4572b",    name: "政治經濟分析",                  category: "society",   lang: "zh", lastOffered: "112-1" },
  { id: "JOUR5012",   name: "東亞新聞專題",                  category: "society",   lang: "zh", lastOffered: "112-1" },
  { id: "PS4643b",    name: "東亞各國政治文化經濟",          category: "society",   lang: "zh", lastOffered: "108-1" },
  { id: "Anth7082",   name: "東南亞當代議題專題討論",        category: "society",   lang: "zh", lastOffered: "106-1" },
  { id: "Soc3042",    name: "大眾文化與東亞社會",            category: "society",   lang: "zh", lastOffered: "105-2" },
  { id: "Soc3016",    name: "當代中國政治與社會",            category: "society",   lang: "zh", chinaStudies: true, lastOffered: "108-1" },

  // ── 東亞文化與文明 ──
  { id: "NtlDev5340", name: "近現代日本導論",                category: "culture",   lang: "zh", lastOffered: "114-1" },
  { id: "NtlDev7157", name: "東亞的傳統與解釋",              category: "culture",   lang: "zh", lastOffered: "114-1" },
  { id: "NtlDev1084", name: "朝鮮王朝的建立與發展",          category: "culture",   lang: "zh", lastOffered: "114-1" },
  { id: "Hist1626",   name: "東亞文化交流史",                category: "culture",   lang: "zh", lastOffered: "114-1" },
  { id: "JpnL7069",   name: "近代日本的中國認識與亞洲論上",  category: "culture",   lang: "zh", lastOffered: "114-1" },
  { id: "Hist2139",   name: "日本近代史",                    category: "culture",   lang: "zh", lastOffered: "113-1" },
  { id: "ARHY1018",   name: "日本建築史導論",                category: "culture",   lang: "zh", lastOffered: "113-2" },
  { id: "ARHY1011",   name: "東亞陶瓷文化史",                category: "culture",   lang: "zh", lastOffered: "113-2" },
  { id: "Hist5424",   name: "東亞佛教史",                    category: "culture",   lang: "zh", lastOffered: "113-1" },
  { id: "NtlDev7126", name: "韓日文化與思想專題",            category: "culture",   lang: "zh", lastOffered: "113-2" },
  { id: "CHIN4073b",  name: "東亞越境文學與文化（中文）",    category: "culture",   lang: "zh", lastOffered: "113-1" },
  { id: "Hist1630b",  name: "東亞歷史上的政教關係（史）",    category: "culture",   lang: "zh", lastOffered: "113-2" },
  { id: "TwLit7165",  name: "日本統治時期臺灣、朝鮮文學比較研究專題", category: "culture", lang: "zh", lastOffered: "113-2" },
  { id: "Music5001",  name: "亞洲音樂文化",                  category: "culture",   lang: "zh", lastOffered: "113-2" },
  { id: "LING5205",   name: "越南語的語言結構與文化",        category: "culture",   lang: "zh", lastOffered: "113-2" },
  { id: "NtlDev7092", name: "東亞史專題",                    category: "culture",   lang: "zh", lastOffered: "113-1" },
  { id: "Hist1600",   name: "東亞現代史",                    category: "culture",   lang: "zh", lastOffered: "114-1" },
  { id: "Hist1609",   name: "東亞近代史",                    category: "culture",   lang: "zh", lastOffered: "112-2" },
  { id: "NtlDev7098", name: "近代日本思想專題",              category: "culture",   lang: "zh", lastOffered: "112-1" },
  { id: "Hist3145",   name: "韓國近代史",                    category: "culture",   lang: "zh", lastOffered: "112-1" },
  { id: "NtlDev7162", name: "東亞孟子學專題討論",            category: "culture",   lang: "zh", lastOffered: "111-1" },
  { id: "JpnL7070",   name: "近代日本的中國認識與亞洲論下",  category: "culture",   lang: "zh", lastOffered: "112-2" },
  { id: "Music5099",  name: "戰前東亞唱片工業史",            category: "culture",   lang: "zh", lastOffered: "111-1" },
  { id: "Hist5120",   name: "十七世紀東亞海域與臺灣",        category: "culture",   lang: "zh", lastOffered: "112-1" },
  { id: "NtlDev7143", name: "東亞知識份子史",                category: "culture",   lang: "zh", lastOffered: "110-1" },
  { id: "Hist1604",   name: "歷史上東亞的帝國及其敵人",      category: "culture",   lang: "zh", lastOffered: "110-1" },
  { id: "NtlDev1088", name: "東亞歷史概論",                  category: "culture",   lang: "zh", lastOffered: "108-1" },
  { id: "Hist1570",   name: "東亞海域與臺灣",                category: "culture",   lang: "zh", lastOffered: "110-2" },
  { id: "Hist7085",   name: "東亞古代政治史專題",            category: "culture",   lang: "zh", lastOffered: "111-1" },
  { id: "NtlDev5299", name: "東亞陽明學專題研究",            category: "culture",   lang: "zh", lastOffered: "106-2" },
  { id: "Anth5109",   name: "東亞與東南亞考古文化",          category: "culture",   lang: "en", lastOffered: "112-1" },
  { id: "ARHY7077",   name: "亞洲陶瓷貿易史研究",            category: "culture",   lang: "en", lastOffered: "106-2" },
  { id: "ARHY7091",   name: "佛教藝術在南、中、東南亞",      category: "culture",   lang: "en", lastOffered: "107-1" },
  { id: "ARHY7073",   name: "東亞與歐洲工藝美術",            category: "culture",   lang: "zh", lastOffered: "112-1" },
  { id: "NtlDev7106", name: "韓日儒學史專題",                category: "culture",   lang: "zh", lastOffered: "109-2" },
  { id: "NtlDev7083", name: "東亞文化與思想專題",            category: "culture",   lang: "zh", lastOffered: "107-1" },
  { id: "NtlDev7096", name: "近世日本文化與思想專題",        category: "culture",   lang: "zh", lastOffered: "107-1" },
  { id: "Hist1562",   name: "日本文化史",                    category: "culture",   lang: "zh", lastOffered: "109-2" },
  { id: "Hist1601",   name: "日本近代歷史人物",              category: "culture",   lang: "zh", lastOffered: "109-2" },
  { id: "Hist2141",   name: "東北亞近代史",                  category: "culture",   lang: "zh", lastOffered: "109-1" },
  { id: "Hist5016",   name: "日本近代外交史料解析一",        category: "culture",   lang: "zh", lastOffered: "106-2" },
  { id: "CHIN5058",   name: "亞洲共同體：東亞文學與文化",    category: "culture",   lang: "zh", lastOffered: "113-2" },
  { id: "CHIN7457",   name: "東亞古典夢論研究",              category: "culture",   lang: "zh", lastOffered: "107-1" },
  { id: "CHIN7443",   name: "東亞使節詩學",                  category: "culture",   lang: "zh", lastOffered: "106-2" },
  { id: "TwLit5013",  name: "東亞近代文學選讀",              category: "culture",   lang: "zh", lastOffered: "111-1" },
  { id: "TwLit7105",  name: "東亞歷史小說專題研究",          category: "culture",   lang: "zh", lastOffered: "105-2" },
  { id: "Anth7065",   name: "東亞考古學專題討論",            category: "culture",   lang: "zh", lastOffered: "107-1" },
  { id: "Geog5107",   name: "當代都市景觀與東亞文化",        category: "culture",   lang: "zh", lastOffered: "106-1" },
  { id: "LibEdu1062", name: "東亞儒家人文精神",              category: "culture",   lang: "zh", lastOffered: "106-1" },
  { id: "JpnL7038",   name: "日本與周邊國家互動研究上",      category: "culture",   lang: "zh", lastOffered: "106-1" },
  { id: "JpnL7039",   name: "日本與周邊國家互動研究下",      category: "culture",   lang: "zh", lastOffered: "106-2" },
  { id: "NtlDev5321", name: "全球脈絡中的東亞",              category: "culture",   lang: "zh", lastOffered: "110-2" },
  { id: "NtlDev5327b",name: "全球化時代的日本（文）",        category: "culture",   lang: "zh", lastOffered: "111-1" },

  // ── 東亞法制 ──
  { id: "LAW4011",    name: "日文法學名著選讀一",            category: "law",       lang: "zh", lastOffered: "114-1" },
  { id: "LAW4013",    name: "日文法學名著選讀三",            category: "law",       lang: "zh", lastOffered: "114-1" },
  { id: "LAW4014",    name: "日文法學名著選讀四",            category: "law",       lang: "zh", lastOffered: "114-1" },
  { id: "LAW5245",    name: "亞洲憲法專題討論",              category: "law",       lang: "zh", lastOffered: "113-2" },
  { id: "NtlDev5170", name: "中華人民共和國法制專題",        category: "law",       lang: "zh", chinaStudies: true, lastOffered: "111-2" },
  { id: "NtlDev1050", name: "中國大陸法律發展",              category: "law",       lang: "zh", chinaStudies: true, lastOffered: "110-1" },
  { id: "NtlDev7075b",name: "中國大陸法政專題（法）",        category: "law",       lang: "zh", chinaStudies: true, lastOffered: "111-2" },
];

const CATEGORIES = {
  politics:  { label: "東亞政治與國際關係", color: "#1a3a5c", light: "#e8f0f8", accent: "#2563eb" },
  economics: { label: "東亞經濟",           color: "#1a4a2e", light: "#e8f5ed", accent: "#16a34a" },
  society:   { label: "東亞社會與媒體",     color: "#4a1a3a", light: "#f5e8f2", accent: "#9333ea" },
  culture:   { label: "東亞文化與文明",     color: "#4a2a1a", light: "#f5ede8", accent: "#ea580c" },
  law:       { label: "東亞法制",           color: "#3a1a1a", light: "#f5e8e8", accent: "#dc2626" },
};

function computeStatus(selected, creditMap, manualLang) {
  const selectedCredits   = selected.reduce((sum, c) => sum + (creditMap[c.id] || 0), 0);
  const manualLangCredits = manualLang.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
  const totalLangCredits  = manualLangCredits;
  const engCredits   = selected.filter(c => c.lang === "en").reduce((sum, c) => sum + (creditMap[c.id] || 0), 0);
  const chinaCredits = selected.filter(c => c.chinaStudies).reduce((sum, c) => sum + (creditMap[c.id] || 0), 0);
  const totalRaw     = selectedCredits + manualLangCredits;
  const langOver     = Math.max(0, totalLangCredits - 6);
  const chinaOver    = Math.max(0, chinaCredits - 6);
  const effectiveTotal = totalRaw - langOver - chinaOver;
  const categoryCount  = new Set(selected.map(c => c.category)).size;
  return {
    totalRaw, effectiveTotal, engCredits,
    totalLangCredits, manualLangCredits, chinaCredits,
    langOver, chinaOver, categoryCount,
    meetsTotal: effectiveTotal >= 15,
    meetsEng: engCredits >= 4,
    meetsCategories: categoryCount >= 2,
  };
}

function parseCourseInput(text) {
  const lines = text.split(/[\n,，、]+/).map(s => s.trim()).filter(Boolean);
  const found = [], notFound = [];
  for (const line of lines) {
    const match = COURSE_DB.find(c => line.includes(c.id) || c.id.toLowerCase() === line.toLowerCase())
                || COURSE_DB.find(c => line.includes(c.name) || c.name.includes(line));
    if (match) { if (!found.find(f => f.id === match.id)) found.push(match); }
    else if (line.length > 1) notFound.push(line);
  }
  return { found, notFound };
}

function groupOrder(c) {
  if (c.chinaStudies) return 2;
  if (c.lang === "en") return 0;
  return 1;
}

function isEastAsia(name) {
  return name.startsWith("東亞") || name.startsWith("東南亞") || name.startsWith("東北亞");
}

export default function EastAsiaChecker() {
  const [selected, setSelected]       = useState([]);
  const [creditMap, setCreditMap]     = useState({});
  const [manualLang, setManualLang]   = useState([]);
  const [mlName, setMlName]           = useState("");
  const [mlCredits, setMlCredits]     = useState(2);
  const [inputText, setInputText]     = useState("");
  const [parseResult, setParseResult] = useState(null);
  const [activeTab, setActiveTab]     = useState("manual");
  const [searchQ, setSearchQ]         = useState("");
  const [filterCat, setFilterCat]     = useState("all");
  const [filterLang, setFilterLang]   = useState("all");

  const status = useMemo(() => computeStatus(selected, creditMap, manualLang), [selected, creditMap, manualLang]);

  const COURSE_INDEX = Object.fromEntries(COURSE_DB.map((c, i) => [c.id, i]));

  const sortedDB = useMemo(() => {
    return [...COURSE_DB].sort((a, b) => {
      const gDiff = groupOrder(a) - groupOrder(b);
      if (gDiff !== 0) return gDiff;
      const aEA = isEastAsia(a.name) ? 0 : 1;
      const bEA = isEastAsia(b.name) ? 0 : 1;
      if (aEA !== bEA) return aEA - bEA;
      return (COURSE_INDEX[a.id] ?? 999) - (COURSE_INDEX[b.id] ?? 999);
    });
  }, []);

  const filteredDB = useMemo(() => {
    return sortedDB.filter(c => {
      if (filterCat !== "all" && c.category !== filterCat) return false;
      if (filterLang === "en" && c.lang !== "en") return false;
      if (filterLang === "zh" && c.lang !== "zh") return false;
      if (searchQ && !c.name.includes(searchQ) && !c.id.toLowerCase().includes(searchQ.toLowerCase())) return false;
      return true;
    });
  }, [sortedDB, filterCat, filterLang, searchQ]);

  function toggleCourse(course) {
    if (selected.find(c => c.id === course.id)) {
      setSelected(prev => prev.filter(c => c.id !== course.id));
    } else {
      setSelected(prev => [...prev, course]);
      if (!creditMap[course.id]) setCreditMap(prev => ({ ...prev, [course.id]: 3 }));
    }
  }

  function handleParse() {
    const result = parseCourseInput(inputText);
    setParseResult(result);
    setSelected(prev => {
      const next = [...prev];
      const nextCr = { ...creditMap };
      for (const c of result.found) {
        if (!next.find(s => s.id === c.id)) { next.push(c); if (!nextCr[c.id]) nextCr[c.id] = 3; }
      }
      setCreditMap(nextCr);
      return next;
    });
  }

  function addManualLang() {
    if (!mlName.trim()) return;
    setManualLang(prev => [...prev, { id: `ml_${Date.now()}`, name: mlName.trim(), credits: Number(mlCredits) }]);
    setMlName(""); setMlCredits(2);
  }

  function removeManualLang(id) { setManualLang(prev => prev.filter(c => c.id !== id)); }
  function updateManualLangCredits(id, val) { setManualLang(prev => prev.map(c => c.id === id ? { ...c, credits: Number(val) } : c)); }
  function clearAll() { setSelected([]); setCreditMap({}); setManualLang([]); setParseResult(null); setInputText(""); }

  const selectedByCategory = useMemo(() => {
    const map = {};
    for (const cat of Object.keys(CATEGORIES)) map[cat] = selected.filter(c => c.category === cat);
    return map;
  }, [selected]);

  const allPass = status.meetsTotal && status.meetsEng && status.meetsCategories;

  const S = {
    card:  { background: "#fff", borderRadius: 10, padding: 16, border: "1px solid #e0e0e0", marginBottom: 16 },
    label: { fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 10, letterSpacing: 1 },
    tag:   (bg, color) => ({ background: bg, color, padding: "1px 5px", borderRadius: 3, fontSize: 11 }),
  };

  return (
    <div style={{ fontFamily: "'Noto Serif TC', Georgia, serif", minHeight: "100vh", background: "#f7f5f0", color: "#1a1a1a" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* Header — full width, no maxWidth */}
      <div style={{ background: "#1a1a2e", color: "#f0ebe0", padding: "28px 32px 24px", borderBottom: "3px solid #c9a84c" }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "#c9a84c", marginBottom: 6, fontFamily: "monospace" }}>NTU COLLEGE OF SOCIAL SCIENCES</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: 1, color: "#f0ebe0" }}>東亞研究學分學程　修課審核試算系統</h1>
        <div style={{ marginTop: 8, fontSize: 13, color: "#a89880", lineHeight: 1.6 }}>
          依據 114.04.02 發布設置要點　｜　至少 15 學分・至少 4 英語學分・涵蓋至少 2 領域
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: "#f0c060", background: "rgba(255,255,255,0.07)", borderLeft: "3px solid #c9a84c", padding: "8px 12px", borderRadius: "0 6px 6px 0", lineHeight: 1.7 }}>
          ⚠️ 試算結果僅供參考，最終認定以學程承辦單位審核為準。
        </div>
      </div>

      {/* Main layout — full width, no maxWidth */}
      <div style={{ padding: "24px 16px", display: "grid", gridTemplateColumns: "1fr 330px", gap: 24 }}>

        {/* Left */}
        <div>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "2px solid #ddd", marginBottom: 20 }}>
            {[["manual","📋 手動選課"],["paste","📄 貼上修課紀錄"]].map(([t, label]) => (
              <button key={t} onClick={() => setActiveTab(t)} style={{
                padding: "10px 20px", border: "none", cursor: "pointer", fontSize: 14, fontFamily: "inherit",
                background: activeTab === t ? "#1a1a2e" : "transparent",
                color: activeTab === t ? "#f0ebe0" : "#555",
                borderBottom: activeTab === t ? "2px solid #c9a84c" : "none", marginBottom: -2,
              }}>{label}</button>
            ))}
          </div>

          {activeTab === "paste" && (
            <div style={{ ...S.card, marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 10 }}>貼上修課紀錄（每行一門課，或以逗號分隔），支援課號或課名比對。</div>
              <textarea value={inputText} onChange={e => setInputText(e.target.value)}
                placeholder={"例如：\nPS5672\n東亞政治經濟專題\nCOSS1001, PS7567"}
                style={{ width: "100%", height: 120, padding: 10, border: "1px solid #ccc", borderRadius: 6, fontFamily: "monospace", fontSize: 13, resize: "vertical", boxSizing: "border-box" }} />
              <button onClick={handleParse} style={{ marginTop: 10, padding: "8px 20px", background: "#1a1a2e", color: "#c9a84c", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
                匯入課程
              </button>
              {parseResult && (
                <div style={{ marginTop: 12, fontSize: 13 }}>
                  <span style={{ color: "#16a34a" }}>✓ 找到 {parseResult.found.length} 門課程</span>
                  {parseResult.notFound.length > 0 && <span style={{ color: "#dc2626", marginLeft: 12 }}>✗ 無法辨識：{parseResult.notFound.join("、")}</span>}
                </div>
              )}
            </div>
          )}

          {/* 語言課程手動認列 */}
          <div style={{ ...S.card, borderLeft: "4px solid #c9a84c", marginBottom: 20 }}>
            <div style={{ ...S.label, color: "#92400e" }}>📚 東亞語言課程（上限 6 學分，僅能手動登打）</div>
            <div style={{ fontSize: 12, color: "#777", marginBottom: 12, lineHeight: 1.6 }}>
              日文、韓文等東亞相關語言課程不列於課程清單，請在此手動登打。如不確定課程是否可列為相關課程，請洽學程承辦單位。
            </div>
            {manualLang.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                {manualLang.map(c => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "#fefce8", border: "1px solid #fde68a", borderRadius: 6, marginBottom: 6 }}>
                    <span style={{ flex: 1, fontSize: 13 }}>{c.name}</span>
                    <select value={c.credits} onChange={e => updateManualLangCredits(c.id, e.target.value)}
                      style={{ padding: "2px 4px", border: "1px solid #ccc", borderRadius: 4, fontSize: 12, width: 56 }}>
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} 學分</option>)}
                    </select>
                    <span style={S.tag("#fde68a","#92400e")}>語言</span>
                    <button onClick={() => removeManualLang(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 16, lineHeight: 1 }}>×</button>
                  </div>
                ))}
                <div style={{ fontSize: 12, color: "#92400e", textAlign: "right" }}>
                  已登錄：{status.manualLangCredits} 學分
                  {status.totalLangCredits > 6 && <span style={{ color: "#dc2626", marginLeft: 8 }}>（超過上限，將扣除 {status.langOver} 學分）</span>}
                </div>
              </div>
            )}
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <input value={mlName} onChange={e => setMlName(e.target.value)} onKeyDown={e => e.key === "Enter" && addManualLang()}
                placeholder="課程名稱，如：日語一"
                style={{ flex: 1, minWidth: 200, padding: "7px 10px", border: "1px solid #ccc", borderRadius: 6, fontFamily: "inherit", fontSize: 13 }} />
              <select value={mlCredits} onChange={e => setMlCredits(e.target.value)}
                style={{ padding: "7px 8px", border: "1px solid #ccc", borderRadius: 6, fontFamily: "inherit", fontSize: 13 }}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} 學分</option>)}
              </select>
              <button onClick={addManualLang} style={{ padding: "7px 16px", background: "#92400e", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: "inherit", whiteSpace: "nowrap" }}>
                ＋ 新增
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div style={{ display: "flex", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="搜尋課名或課號…"
              style={{ flex: 1, minWidth: 180, padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontFamily: "inherit", fontSize: 13 }} />
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
              style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontFamily: "inherit", fontSize: 13 }}>
              <option value="all">所有領域</option>
              {Object.entries(CATEGORIES).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select value={filterLang} onChange={e => setFilterLang(e.target.value)}
              style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontFamily: "inherit", fontSize: 13 }}>
              <option value="all">中英文</option>
              <option value="zh">中文授課</option>
              <option value="en">英語授課</option>
            </select>
          </div>
          <div style={{ fontSize: 11, color: "#999", marginBottom: 14, lineHeight: 1.8 }}>
            排序依據：英語授課 → 中文授課 → 中國大陸課程；各組內「東亞」開頭課程優先排列　｜　學期碼（如 <span style={{ fontFamily: "monospace", color: "#666" }}>114-1</span>）為最近一次開課學期
          </div>

          {/* Course list by category */}
          {Object.entries(CATEGORIES).map(([catKey, catInfo]) => {
            const courses = filteredDB.filter(c => c.category === catKey);
            if (!courses.length) return null;
            return (
              <div key={catKey} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 4, height: 20, background: catInfo.accent, borderRadius: 2 }} />
                  <span style={{ fontWeight: 700, fontSize: 14, color: catInfo.color }}>{catInfo.label}</span>
                  <span style={{ fontSize: 12, color: "#999" }}>{courses.length} 門</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 6 }}>
                  {courses.map(course => {
                    const isSel = !!selected.find(c => c.id === course.id);
                    return (
                      <div key={course.id} onClick={() => toggleCourse(course)} style={{
                        padding: "8px 12px", borderRadius: 6, cursor: "pointer",
                        border: `1.5px solid ${isSel ? catInfo.accent : "#e0e0e0"}`,
                        background: isSel ? catInfo.light : "#fff",
                        transition: "all 0.15s", display: "flex", alignItems: "flex-start", gap: 8,
                      }}>
                        <div style={{ width: 16, height: 16, borderRadius: 3, flexShrink: 0, marginTop: 2,
                          border: `2px solid ${isSel ? catInfo.accent : "#ccc"}`,
                          background: isSel ? catInfo.accent : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {isSel && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, lineHeight: 1.4 }}>{course.name}</div>
                          <div style={{ fontSize: 11, color: "#888", marginTop: 2, display: "flex", gap: 5, flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "monospace" }}>{course.id}</span>
                            <span style={{ color: "#aaa" }}>{course.lastOffered}</span>
                            {course.lang === "en"  && <span style={S.tag("#dbeafe","#1d4ed8")}>英語</span>}
                            {course.chinaStudies   && <span style={S.tag("#fee2e2","#991b1b")}>中國大陸</span>}
                          </div>
                        </div>
                        {isSel && (
                          <div onClick={e => e.stopPropagation()} style={{ flexShrink: 0 }}>
                            <select value={creditMap[course.id] || 3} onChange={e => setCreditMap(prev => ({ ...prev, [course.id]: Number(e.target.value) }))}
                              style={{ padding: "2px 4px", border: "1px solid #ccc", borderRadius: 4, fontSize: 12, width: 54 }}>
                              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} 分</option>)}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Status Panel — sticky */}
        <div style={{ position: "sticky", top: 20, alignSelf: "start" }}>
          <div style={{ background: "#1a1a2e", color: "#f0ebe0", borderRadius: 10, padding: 20, marginBottom: 16, border: "2px solid #c9a84c" }}>
            <div style={{ fontSize: 12, letterSpacing: 2, color: "#c9a84c", marginBottom: 12 }}>畢業審核狀態</div>
            {[
              { label: "有效總學分", value: `${status.effectiveTotal} / 15`, pass: status.meetsTotal,
                detail: (status.langOver > 0 || status.chinaOver > 0) ? `原 ${status.totalRaw} 分，超限扣 ${status.langOver + status.chinaOver} 分` : `共 ${status.totalRaw} 學分` },
              { label: "英語授課學分", value: `${status.engCredits} / 4`,    pass: status.meetsEng },
              { label: "涵蓋領域數",  value: `${status.categoryCount} / 2`, pass: status.meetsCategories },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #2a2a4e" }}>
                <div>
                  <div style={{ fontSize: 13 }}>{item.label}</div>
                  {item.detail && <div style={{ fontSize: 11, color: "#a89880", marginTop: 2 }}>{item.detail}</div>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: item.pass ? "#4ade80" : "#f87171" }}>{item.value}</span>
                  <span style={{ fontSize: 16 }}>{item.pass ? "✅" : "❌"}</span>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 8, textAlign: "center", background: allPass ? "#14532d" : "#450a0a" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: allPass ? "#4ade80" : "#f87171" }}>
                {allPass ? "✓ 符合畢業資格" : "✗ 尚未符合畢業資格"}
              </div>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.label}>上限規定</div>
            {[
              { label: "語言課程（手動登打）", used: status.totalLangCredits, cap: 6 },
              { label: "中國大陸課程",           used: status.chinaCredits,     cap: 6 },
            ].map(item => (
              <div key={item.label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span>{item.label}</span>
                  <span style={{ color: item.used > item.cap ? "#dc2626" : "#555", fontWeight: item.used > item.cap ? 700 : 400 }}>
                    {item.used} / {item.cap} 學分{item.used > item.cap ? " ⚠️ 超限" : ""}
                  </span>
                </div>
                <div style={{ height: 6, background: "#f0f0f0", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, transition: "width 0.3s",
                    width: `${Math.min(100, (item.used / item.cap) * 100)}%`,
                    background: item.used > item.cap ? "#dc2626" : "#c9a84c" }} />
                </div>
              </div>
            ))}
            <div style={{ fontSize: 11, color: "#888", marginTop: 4, lineHeight: 1.6 }}>
              ※ 非清單課程至多承認 6 學分，需附課程大綱及修課證明送委員會審查。
            </div>
          </div>

          <div style={S.card}>
            <div style={S.label}>已選課程（{selected.length} 門 + 語言課程 {manualLang.length} 門）</div>
            {manualLang.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#c9a84c" }} />
                  <span style={{ fontSize: 12, color: "#92400e", fontWeight: 600 }}>手動登錄語言課程</span>
                  <span style={{ fontSize: 11, color: "#999", marginLeft: "auto" }}>{status.manualLangCredits} 學分</span>
                </div>
                {manualLang.map(c => (
                  <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555", padding: "2px 14px" }}>
                    <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
                    <span style={{ color: "#888", marginLeft: 4 }}>{c.credits} 分</span>
                  </div>
                ))}
              </div>
            )}
            {Object.entries(CATEGORIES).map(([catKey, catInfo]) => {
              const cats = selectedByCategory[catKey];
              const catTotal = cats.reduce((s, c) => s + (creditMap[c.id] || 0), 0);
              return (
                <div key={catKey} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: cats.length > 0 ? catInfo.accent : "#ddd" }} />
                    <span style={{ fontSize: 12, color: cats.length > 0 ? catInfo.color : "#aaa", fontWeight: cats.length > 0 ? 600 : 400 }}>
                      {catInfo.label}
                    </span>
                    <span style={{ fontSize: 11, color: "#999", marginLeft: "auto" }}>{catTotal} 學分</span>
                  </div>
                  {cats.map(c => (
                    <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555", padding: "2px 14px" }}>
                      <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
                      <span style={{ color: "#888", marginLeft: 4 }}>{creditMap[c.id] || 0} 分</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <button onClick={clearAll} style={{ width: "100%", padding: 10, background: "#fff", color: "#dc2626", border: "1.5px solid #dc2626", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
            清除所有選課
          </button>
        </div>
      </div>
    </div>
  );
}
