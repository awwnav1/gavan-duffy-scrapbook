import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { X, MapPin, Search } from 'lucide-react';

// Palette — kept faithful to the original drapery aesthetic.
const C = {
  // Two-tone editorial: near-white pages, cream as accent only.
  page: '#fbf6ea', pageDeep: '#f6efde',
  cream: '#f4ebd8', creamDeep: '#ebe0c8',
  paper: 'rgba(255,255,255,0.7)',
  ink: '#1f1814', inkSoft: '#3d2817', oxblood: '#7a3b2e', taupe: '#6b5137',
  rule: '#c4a77d', gold: '#b08d3f', rose: '#a86b6b', sage: '#7a8a5d',
};
const FD = "'Playfair Display', Georgia, serif";
const FB = "'EB Garamond', Georgia, serif";
const FM = "'Special Elite', ui-monospace, monospace";

export default function GavanDuffyScrapbook() {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [archiveFilter, setArchiveFilter] = useState('all');
  const [archiveQuery, setArchiveQuery] = useState('');

  const timeline = [
    { year: '1875', event: 'Parents Thomas Duffy (draper) and Mary Flynn (milliner) marry at St Kevin\'s, Dublin', tone: 'family' },
    { year: 'Late 1879 or Jan 1880', event: 'Born in Dublin, son of Thomas Duffy, draper. Civil registration was filed in 1881 but every later age record points to a 1880 birth', tone: 'birth' },
    { year: 'Jan 1880', event: 'Baptised "Patritius Joran Duffy" at St Catherine\'s, Meath Street. Address 1 Thomas Street, godparents Jacobi Claffey and Josephina Sterry, priest E. Dukay. The "Joran" middle name is almost certainly an indexer\'s misreading of "Gavan" in cursive Latin', tone: 'birth' },
    { year: '1883', event: "Father founds Thomas Duffy, Draper and Milliner at 44 Thomas Street", tone: 'business' },
    { year: '1894', event: 'Begins working in the family drapery, aged ~14', tone: 'work' },
    { year: '15 May 1903', event: 'Sails from Liverpool to Quebec on the SS Parisian, destination Calgary', tone: 'travel' },
    { year: '23 May 1903', event: 'Steps off the SS Parisian at Quebec City at 3 p.m. on Saturday 23 May 1903 (Montreal Gazette shipping arrivals). An eight-day Atlantic crossing', tone: 'travel' },
    { year: '30 May 1903', event: 'His mother Mary dies suddenly of a heart attack at 44 Thomas Street, aged 45, while Gavan is mid-Atlantic or newly landed in Canada', tone: 'death' },
    { year: '1903–1910', event: 'Works as a ranch hand in Alberta', tone: 'travel' },
    { year: '14 Aug 1907', event: 'A Patrick Duffy, the only one in the Calgary Herald across his Alberta years, is fined $3.50 in police court for being drunk in public, "admitted he had more than he could comfortably navigate with". A plausible but unconfirmed match', tone: 'scandal' },
    { year: '14 Apr 1910', event: 'Arrives Liverpool aboard the Cunard SS Campania (third class) from New York, occupation given as "Storekeeper". The end of his Alberta years', tone: 'travel' },
    { year: 'Apr 1911', event: 'Back in Dublin, listed on Irish Census as draper\'s assistant', tone: 'work' },
    { year: 'Sep 1912', event: 'Marries Mary Catherine Byrne at Golden Bridge, Inchicore', tone: 'love' },
    { year: 'Jun 1913', event: 'Son Thomas Joseph born at 66 South Circular Road', tone: 'birth' },
    { year: 'Apr 1916', event: 'Daughter Gladys May born at 66 St Michael\'s Terrace, ten days before the Rising', tone: 'birth' },
    { year: '1917', event: 'Inherits the firm with brother Thomas B from father Thomas', tone: 'business' },
    { year: '13 May 1917', event: 'Father Thomas Joseph Duffy dies at Tudor House nursing home, Clontarf, aged 74, of myocarditis. Gavan is present at the death', tone: 'death' },
    { year: 'Feb 1919', event: 'Mary Catherine dies of influenza at Tudor House, Clontarf, aged 27', tone: 'death' },
    { year: 'Sep 1920', event: 'Marries Kathleen Condon, 18, at St Joseph\'s, Crumlin', tone: 'love' },
    { year: 'Mar 1923', event: 'Daughter Olga born at 36 Upper Mount Street; home Queenstown Castle, Dalkey', tone: 'birth' },
    { year: '1926', event: 'Family at Newtownsmith, Dún Laoghaire on census day', tone: 'home' },
    { year: '1939', event: 'Applies to transfer pub licence for 45/46 Thomas Street', tone: 'business' },
    { year: '1941', event: 'Up in court on Thomas Street lottery charge', tone: 'scandal' },
    { year: '1948', event: 'Firm registered as Gavan Duffy Ltd.; daughters Gladys and Olga join board', tone: 'business' },
    { year: 'Jun 1954', event: 'Dies at Undercliffe, Killiney, aged 74. Funeral at St Anne\'s, Shankill; burial at Deansgrange', tone: 'death' },
    { year: '20 Apr 1965', event: 'Gavan Duffy, Limited (CRO No. 13000) is dissolved. Gladys and Olga had run the firm for eleven years after their father\'s death', tone: 'business' },
    { year: '2005', event: 'Daughter Gladys May Duffy dies, aged 89. The last Chairman of the firm', tone: 'death' },
    { year: '2016', event: 'Daughter Olga Duffy (later Ward), the youngest of the second-marriage children and the last of the four, dies aged 92 or 93', tone: 'death' },
  ];

  const people = {
    thomas_sr: {
      name: 'Thomas Joseph Duffy',
      dates: 'c.1843 – 13 May 1917',
      role: 'Founder. Great-great-grandfather.',
      story: 'Born Dublin City c.1843. Son of **Patrick Duffy, Surveyor** — a respectable skilled profession that means Thomas didn\'t come from nothing; he came from a professional Dublin family. A young Dublin haberdashery buyer travelling to London in September 1870 when the Irish Mail train crashed at Tamworth. Thirteen passengers were injured, Thomas among them. He received compensation. Already styling himself **"Draper of Thomas Street"** by 24 November 1875, when he married **Mary Flynn**, milliner, at St Kevin\'s Catholic Church — **eight years earlier than the 1883 date** traditionally given for the shop\'s founding. So either he was already an employed draper on Thomas Street well before 1883, or the shop at No. 44 existed earlier than we had been told. The 1883 date may refer to a specific event: a freehold or lease acquisition, a shopfront refit, or a formal opening. In 1883 he formally leased 44 Thomas Street from Monsieur and Madame Jules Bouvier of Geneva at £50 a year. The shop was known as Thomas Duffy, Draper and Milliner. Mary was still living when the shop opened and the "Milliner" half of the name may well refer to her own trade. Together they had six children, four of whom survived. A Justice of the Peace, Poor Law Guardian (elected 1905), and by the 1911 census he styled himself **Magistrate**. So closely resembled Edward VII that Dubliners doffed their hats to him by mistake. Stood unsuccessfully against W.T. Cosgrave for Dublin Corporation around 1908. Died 13 May 1917 at **Tudor House, Clontarf**, a private nursing home, after five days of myocarditis and pulmonary oedema. His heart gave out. Informant at the death was Gavan, present at the end. Two years later, Gavan sent his own dying first wife Mary Catherine to the same nursing home to die there of the flu. Thomas left an estate of £2,197 (roughly £1.2–1.5 million today), administered by his three sons as joint executors: Gavan, Thomas B and Rev John A. Duffy.',
    },
    mary_duffy: {
      name: 'Mary Duffy (née Flynn)',
      dates: 'c.1854 – 30 May 1903',
      role: "Gavan's mother. Great-great-grandmother. Milliner, later dressmaker.",
      story: 'Born Dublin City c.1854. Maiden name **Flynn**. Daughter of **Patrick Flynn, Tailor**, of South Circular Road, Dublin. Trained as a milliner herself. Married Thomas Duffy at **St Kevin\'s Roman Catholic Church, Dublin, on 24 November 1875** — much earlier than we had first inferred from the 1911 census (which said "26 years married" but appears to have been an underestimate; the cert proves 35 years married by April 1911). On their wedding day, Thomas was a draper of Thomas Street and Mary was a milliner of South Circular Road, so two needle-trade families joining. Her father Patrick Flynn was a tailor, Thomas\'s father Patrick Duffy was a surveyor. The witnesses were Thomas Smyth (for the groom) and **Christina Flynn** (for the bride, almost certainly Mary\'s sister). On her 1903 death cert she is listed as **Dressmaker** — she never stopped working in the trade. She bore six children in about twenty years. Died 30 May 1903 at 44 Thomas Street, at about age 49, of **angina pectoris** after just three hours\' illness. A sudden heart attack. The informant was her 17-year-old son Thomas B, present at death. Her eldest son Gavan was not there. He had sailed for Canada exactly two weeks earlier. Whether a letter reached him in Alberta telling him she was gone, or he only found out by belated post, we cannot know. He did not return for seven years.\n\n**The "Gavan" question finally resolved.** Mary was a Flynn, not a Gavan. Her son Patrick Gavan Duffy\'s middle name therefore has no family connection to Sir Charles Gavan Duffy, the nationalist. The name was tribute, not kinship.',
    },
    gavan: {
      name: 'Patrick Gavan Duffy',
      dates: '1880 – 1954',
      role: 'Great-grandfather. The man himself.',
      story: 'Second-generation draper. Eldest of Thomas and Mary Duffy\'s six children. **Born late 1879 or January 1880** (civil registration was filed in 1881 but every later age record points to 1880 — 23 on the 1903 manifest, 30 on the April 1911 census, 74 at death in June 1954, all consistent only with an 1880 birth). Baptised "Patritius Joran Duffy" at **St Catherine\'s, Meath Street, in January 1880**, with godparents Jacobi Claffey and Josephina Sterry. The "Joran" middle name on the index is almost certainly an indexer\'s misreading of "Gavan" in cursive Latin. Already listed as a Draper aged 20 on the 1901 census, working in his father\'s shop above which the whole family lived. Sailed from Liverpool on the SS Parisian on 15 May 1903 and stepped off at Quebec at 3 p.m. on Saturday 23 May, an eight-day Atlantic crossing, bound for Calgary. One week later his mother died suddenly of a heart attack at 44 Thomas Street. It was his 17-year-old brother Thomas B, not Gavan, who went to the registrar. Whether a letter reached him in Alberta or he only found out later, we don\'t know — but he did not come home for seven years. Back in Dublin by April 1911, aged 31, single, living with his widowed father above the shop along with Thomas B, Aloysius and Lily. Married Mary Catherine Byrne in 1912, had Thomas and Gladys, lost her to the 1919 flu. Remarried Kathleen Condon in 1920, had Olga and George. Inherited the shop with his brother in 1917 and ran it alone from 1918 when Thomas B split off to found Duffy\'s of North Earl Street. Ran Duffy\'s of Thomas Street for nearly forty years. Liked the south Dublin coast — moved from the Liberties through Dalkey and Dún Laoghaire, dying at Undercliffe, Killiney, in 1954. A future Taoiseach attended his funeral. The firm Gavan Duffy, Limited (CRO No. 13000) was finally dissolved on 20 April 1965 under his daughters Gladys and Olga.',
    },
    lily: {
      name: 'Lily (Lillie) Duffy',
      dates: 'b. c.1883',
      role: "Gavan's eldest sister. Probably a Poor Clare at Harold's Cross.",
      story: "Aged 18 in 1901, still listed as a Scholar. By 1911, aged 27, unmarried, at home in Thomas Street — not listed as working in the family shop the way her brothers were. Disappears from the Duffy civil record thereafter. **Family tradition holds that Lillie became an enclosed nun at the Poor Clare Monastery, Harold's Cross, Dublin.** This fits the documentary silence around her from the 1910s onward: enclosed Franciscan contemplatives take a religious name and disappear from civil records under their secular identity. If professed before 1926 she would be enumerated at the monastery rather than at any Duffy household. Her baptismal name was probably Elizabeth (Lillie being a common diminutive of Elizabeth), so her religious name could be Sr Elizabeth, or more likely something like Sr Mary Clare, Sr Mary Francis or Sr Mary Bernard. The Poor Clares at Harold's Cross keep detailed archival records of every sister with secular name, date of clothing, date of profession, and date of death — a letter to the community archivist should settle it. **This revises an earlier hypothesis**: I had suggested Lillie might have married Robert Cassells and become \"Mrs Robert Cassells\" at Gavan's 1954 funeral, but an enclosed sister would not have been able to attend her brother's funeral even if alive (the rule of enclosure generally forbids leaving the monastery, including for family funerals). So \"Mrs Robert Cassells\" must be a different relative, probably from Kathleen Condon's line or from the Byrnes of the first marriage.",
    },
    thomas_b: {
      name: 'Thomas B. Duffy',
      dates: 'b. c.1885',
      role: "Gavan's younger brother. Founded Duffy's of North Earl Street in 1918 (still trading today as Duffy's Curtains). Aged 15 (Scholar) in 1901, 28 (Draper, single) in 1911 still at Thomas Street with Gavan. Witnessed Gavan's 1920 wedding to Kathleen.",
      story: 'Born c.1885 per the 1926 census (aged 40y6m in April 1926). **Married Sara [maiden name unknown], of Co Cork, in April 1917** — about a month before his father died. The dying Thomas Joseph was likely at the wedding; 9 years of marriage were counted by April 1926, and his father\'s final illness (myocarditis, five days) followed within weeks. Thomas B was co-executor of his father\'s 1917 will. Used his inheritance to found **Duffy\'s of North Earl Street in 1918**, a specialist curtain and soft-furnishing firm. Three children by 1926: **Thomas Jr** (b. 1918 or 1919, named for himself and his late father), **Freda** (b. Nov 1920), and **Laura** (b. early 1925). By 1926 the family was settled in Clontarf, same Dublin suburb where Thomas Joseph had died at Tudor House — possibly not a coincidence, Thomas B may have had the dying man moved near his own new household. Thomas B was an Employer by 1926 with one resident servant, Bridget Tuite of Gowran, Co Kilkenny.',
    },
    john_duffy: {
      name: 'Rev John A. Duffy',
      dates: 'b. c.1888',
      role: "Gavan's brother. Roman Catholic clergyman. Confirmed as executor of their father's 1917 will.",
      story: "Aged 13 and a Scholar at home in Thomas Street on the 1901 census. Absent from the 1911 Thomas Street household — he was in seminary training by then. When his father Thomas Duffy died in May 1917, the probate grant names him alongside his brothers Gavan and Thomas B as one of three executors: \"The Reverend John A. Duffy R.C.C.\" He was ordained by then, aged about 29. Three years later, in September 1920, he officiated at Gavan's second wedding to Kathleen Condon at St Joseph's, Crumlin — his brother marrying the barrister's daughter. The 1920 cert styled him OSA (Augustinian) but the 1917 probate styled him R.C.C. (Roman Catholic Clergyman). Those don't quite match, so a quick check of the 1920 cert spelling would be worth it. Either way, a priest in the family, at the heart of the Duffy household\'s major moments.",
    },
    aloysius: {
      name: 'Aloysius Duffy',
      dates: 'b. c.1890',
      role: "Gavan's youngest brother. Student in 1911.",
      story: "Aged 21 on the 1911 census, listed as Student (Visitor) at Thomas Street, suggesting he was home briefly from his studies elsewhere. \"Aloysius\" (after St Aloysius Gonzaga) is a classic Jesuit-educated choice, which hints he may have been at a Jesuit school like Belvedere or Clongowes, and perhaps studying at UCD by 1911. A fourth Duffy brother worth tracking.",
    },
    lizzie: {
      name: 'Lizzie (Elizabeth) Duffy',
      dates: 'b. c.1862',
      role: "Gavan's unmarried aunt, Thomas's sister.",
      story: "Sister of Thomas Duffy the founder. Living with the family at 44 Thomas Street in 1901, aged 39, described as \"Housekeeper\". Born Dublin City. Not at Thomas Street in 1911, so either died or moved out in that decade. An unmarried sister-in-the-household was a very common figure in Victorian Catholic Dublin, often running the domestic side while the wife handled children or business. She was a presence in Gavan's boyhood home.",
    },
    mary_catherine: {
      name: 'Mary Catherine "Mary Kate" Byrne',
      dates: 'c.1892 – 1919',
      role: "Gavan's first wife. Great-grandmother of Thomas and Gladys.",
      story: 'A draper\'s assistant herself, listed as "draperess" on the 1911 census aged 19. Daughter of Benjamin Byrne, a DMP policeman, and Catherine Whelan, a Kilkenny dressmaker. Raised at 10 Mountain View Terrace, South Circular Road. Married Gavan at Golden Bridge, Inchicore, in September 1912. Had Thomas in 1913 and Gladys in 1916. Died of influenza and broncho-pneumonia at Tudor House, a private nursing home in Clontarf, on 28 February 1919, aged 27. Gavan, living at Herbert Lodge, Dalkey, reported the death himself.',
    },
    kathleen: {
      name: 'Kathleen Mary Condon',
      dates: 'c.1900 – 1984',
      role: 'Gavan\'s second wife. Your great-grandmother.',
      story: 'One of at least nine surviving children of John Patrick Condon and Anna Mary Whyte. Raised at 90 South Circular Road, Kilmainham, in a crowded Catholic household with a barrister-administrator father, a Carlow-born mother, seven or eight siblings, and a live-in Cavan servant. The family later moved to 73 Greenmount Road, Terenure, which is where she was living when she married Gavan in September 1920 at St Joseph\'s, Crumlin. She was 19, he was 38, a widower with two small children. Mother of Olga (1923) and George. Outlived Gavan by thirty years. Died at the Sacred Heart Hospital, Ballinderry, near Mullingar in May 1984, buried at Collinstown Cemetery in Westmeath — which now makes sense, as her father was born in Co Meath.',
    },
    thomas_jr: {
      name: 'Thomas Joseph Duffy',
      dates: 'b. 25 June 1913',
      role: 'Eldest son, first marriage. Emigrated to Adelaide.',
      story: 'Born 25 June 1913 at 66 South Circular Road. **Named Thomas Joseph after his grandfather**, not Thomas after his grandfather and Joseph after a saint as we first guessed. His grandfather Thomas Joseph Duffy was alive when he was born, still running the Thomas Street shop. The family naming pattern is exact: firstborn grandson gets the full name of the paternal grandfather. Lost his mother Mary Catherine to the 1919 flu at age six. Raised from age seven by his stepmother Kathleen, who was four years older than his eventual half-brother George. Emigrated to Adelaide, South Australia, at some point between the 1926 census (when he was 13 at home in Dún Laoghaire) and his father\'s 1954 death. Absent from the chief mourners at Gavan\'s funeral in June 1954 — Adelaide to Dublin in three days was not a trip you could make. As the only surviving son of the first marriage, he was the natural heir to the Thomas Street drapery, but by 1948 his half-sisters Gladys (Chairman) and Olga (Director) had taken the board seats. Something either pushed him out or he walked.',
    },
    gladys: {
      name: 'Gladys May Duffy',
      dates: '14 April 1916 – 2005',
      role: 'Daughter, first marriage. Became Chairman of Directors, Gavan Duffy Ltd.',
      story: 'Born 14 April 1916 at 66 St Michael\'s Terrace, South Circular Road — ten days before the Easter Rising began less than a mile away. An unusually English/Protestant-associated name for a Catholic Dublin daughter. **Lost her mother Mary Catherine to the 1919 flu when she was two years and ten months old.** Family tradition holds that she was sent to the **Dominican sisters in Wicklow** (probably the Siena Convent boarding school at Wicklow Town) at around three or four, an unusually young placement that fits the immediate circumstances — a widowed Dublin draper with a toddler daughter and a six-year-old son, unable to raise a small girl in a shop on Thomas Street. She likely stayed with the Dominicans until the family home was re-established under Kathleen from about 1922, because by the April 1926 census she was back at home in Newtownsmith, Dún Laoghaire, aged ten. Never married (listed as "Miss" at her father\'s 1954 funeral). Chaired the family firm as Chairman of Directors from 1948 onward. The Dominican formation would have given her the discipline and presence needed to chair a drapery board at 32. **Died in 2005, aged 89.**',
    },
    olga: {
      name: 'Olga Duffy',
      dates: '30 March 1923 – 2016',
      role: 'Your grandmother. Daughter, second marriage. Director, Gavan Duffy Ltd.',
      story: 'Born at a private nursing home at 36 Upper Mount Street, family home at Queenstown Castle, Dalkey. An exotic name for 1923 Dublin (Grand Duchess Olga Romanov murdered just five years before; Princess Olga of Greece in the society papers). Listed as "Miss" at her father\'s funeral in June 1954, so married William F. Ward after that date. **Died in 2016, aged 92 or 93.**',
    },
    george: {
      name: 'George Duffy',
      dates: 'b. after 1926',
      role: 'Son, second marriage.',
    },
    thomas_jr_nephew: {
      name: 'Thomas Duffy Jr.',
      role: "Nephew, son of Thomas B. Still runs Duffy's of North Earl Street today.",
    },
    benjamin: {
      name: 'Benjamin Byrne',
      dates: 'died before 1911',
      role: "Mary Catherine's father. DMP policeman.",
      story: 'Son of John Byrne, a river pilot (probably on the River Suir). From Carrickbeg. Joined the Dublin Metropolitan Police. Married Catherine Whelan in Kilkenny in 1880. Dead by the 1911 census, leaving Catherine a widow raising five grown children on the South Circular Road.',
    },
    catherine_whelan: {
      name: 'Catherine Whelan',
      role: "Mary Catherine's mother. Kilkenny dressmaker.",
      story: 'Daughter of Martin Whelan, a Kilkenny policeman. Dressmaker at King Street, Kilkenny when she married Benjamin Byrne at St Canice\'s in 1880. Head of household on the 1911 census, age 55, widowed, with grown children: John Francis (railway clerk), Martin Joseph (clerk), Mary Kate (draperess), Richard William (civil service draughtsman). A cousin, Martin Albert Whelan, also lived with them.',
    },
    john_byrne: {
      name: 'John Byrne',
      role: "Mary Catherine's paternal grandfather. River pilot.",
      story: 'Listed on Benjamin\'s 1880 marriage cert as "Pilot". A river or harbour pilot, probably on the Suir given the Carrickbeg reference. This is the line that goes out of Dublin into maritime Ireland.',
    },
    martin_whelan: {
      name: 'Martin Whelan',
      role: "Mary Catherine's maternal grandfather. Kilkenny policeman.",
      story: 'Listed as deceased on his daughter Catherine\'s 1880 marriage cert. RIC records may give his true birthplace — the RIC stationed men away from home counties, so he was probably not a Kilkenny man by birth.',
    },
    john_condon: {
      name: 'John Patrick Condon',
      dates: 'c.1864 – 26 January 1936',
      role: "Kathleen's father. Barrister at Law, Clerk of the South Dublin Union, early GAA figure.",
      story: "Born Co Meath, c.1864. A qualified barrister who never took briefs at the Bar because he held a senior salaried post as Clerk of a Poor Law Union. The 1926 census names the Union exactly: the Dublin Union at James's Street. That is the **South Dublin Union**, the enormous workhouse complex at the top of James's Street that later became St Kevin's Hospital and, eventually, St James's. By 1926 his title had grown to Clerk and Superintendent Registrar of the Commissioners of the Dublin Union. Here is the detail that recasts the whole courtship story: **Gavan's shop at 44 Thomas Street and John Patrick's workplace at James's Street were about four hundred yards apart**, on the same thoroughfare through the Liberties. They worked within a short walk of each other for decades. Gavan was not some stranger who turned up in Terenure to marry the barrister's daughter in 1920. He and John Patrick Condon had almost certainly known each other, at least by sight and reputation, since Gavan was a boy above the shop.\n\nMarried Anna Mary Whyte of Dublin around 1898. Father of ten children, of whom nine were still living in 1911. By 1926 the family was at 22 Greenmount Road, Terenure. **By 1934 they had moved to Queenstown Castle, Dalkey**, the same house Gavan and Kathleen had lived in a decade earlier. Died at Queenstown Castle on **26 January 1936**, aged about 72.\n\nThe Irish Press obituary of 27 January 1936 reveals an extraordinary biographical detail: **as a boy, John Patrick Condon was taught by Michael Cusack, founder of the GAA.** Cusack taught in various Dublin schools in the 1870s, before founding the Gaelic Athletic Association in 1884. John Patrick Condon was therefore pupil to the man who remade Irish sporting and cultural life. He went on to be one of the earliest members of the Christian Brothers' Past Pupils' Union and was associated in its early years with the Gaelic League and Gaelic games. Probate was granted 28 February 1936. His nephew **J. E. Condon** succeeded him as Clerk of the Dublin Union. W. T. Cosgrave TD, leader of Cumann na nGaedheal and former head of the Free State government, attended his funeral.",
    },
    anna_mary: {
      name: 'Anna Mary Whyte',
      dates: 'b. c.1867',
      role: "Kathleen's mother. Of Co Dublin, from a Carlow family.",
      story: 'Married John Patrick Condon in 1898 when she was about 31. Bore ten children. Her sister **Harriett Whyte**, a dressmaker of 30, was living with the family at 90 South Circular Road in April 1911, so the Whytes of Carlow are a line worth tracing.',
    },
    francis_condon: {
      name: 'Francis Xavier "F.X." Condon',
      dates: 'b. c.1905',
      role: "Kathleen's younger brother. Builder's Foreman. Had his own Canadian years.",
      story: "Age 6 on the 1911 census at Kilmainham. Still at the Condon family home at Queenstown Castle, Dalkey, in 1941, when he married Teresa Roche, daughter of Timothy Roche (civil servant), at Blackrock Roman Catholic church on 2 July. Builder's Foreman by trade despite his barrister father. The F.X. Condon at Gavan's 1954 funeral.\n\n**Francis had his own Canadian years.** An Irish Press report of 16 January 1934 on a Dublin Circuit Court partnership case describes Francis Condon of Queenstown Castle, Dalkey, arguing that he had grown tobacco in Canada. In February 1933 he proposed to a Mrs F. Harrison of Shanganagh Grove, Ballybrack, that she should grow a crop at Shanganagh, with her buying seed and implements and him contributing his Canadian agricultural experience. Judge Davitt ruled that the two of them were the sole partners (not six, as the Harrisons alleged) and each was entitled to half the £318 proceeds. So Francis had spent time in Canada before 1933 farming tobacco, came home to Dublin with the expertise, and tried to go into business growing Irish tobacco. **A striking echo of his brother-in-law Gavan's own seven Alberta years three decades earlier.** There may yet be a paper trail on Francis in Canadian agricultural records or passenger lists.",
    },
    eileen_condon: {
      name: 'Eileen Josephine Condon',
      dates: 'b. c.1900',
      role: "Kathleen's eldest sister.",
      story: "Age 11 at the 1911 census. Witness at Gavan and Kathleen's 1920 wedding. Still described as \"Miss Eileen Condon\" at Gavan's 1954 funeral. One of Kathleen's six sisters and brothers who survived to adulthood.",
    },
    other_condons: {
      name: 'The other Condon siblings',
      role: "Kathleen's less-documented brothers and sisters.",
      story: 'From the 1911 census: John Patrick Jr. (b. c.1902), Agnes Gertrude (b. c.1904), Anna Mary Jr. (b. c.1907), James Edmond (b. c.1908), Joseph Raphael (b. c.1910). Plus one more living child not at home on census night, and one who had died before 1911. Nine Condon siblings survived infancy. This is a whole generation of your great-grandmother\'s people worth chasing one by one.',
    },
  };

  const places = {
    thomas_st: {
      name: '42–46 Thomas Street',
      era: '1883–1954',
      desc: "The shop. Founded by Thomas Duffy in 1883 at No. 44, expanded through the 1900s across five adjoining buildings. In the heart of the Liberties, between the South Dublin Union and the Guinness brewery. Home above the shop for young Gavan. Witnessed the 1916 Rising on its doorstep, the Civil War, the Emergency. Still the registered address of Gavan Duffy Ltd. at his death.",
    },
    scr_66: {
      name: '66 South Circular Road',
      era: '1912–1915',
      desc: 'First marital home, where Gavan and Mary Catherine set up after their 1912 wedding. Just down the street from her widowed mother at 10 Mountain View Terrace. Son Thomas born here in June 1913.',
    },
    st_michaels: {
      name: "66 St Michael's Terrace",
      era: '1915–c.1918',
      desc: 'Second home on the South Circular Road, a short move from number 66. Daughter Gladys born here in April 1916, ten days before the Rising. Same street, different house; a small step up.',
    },
    herbert_lodge: {
      name: 'Herbert Lodge, Dalkey',
      era: '1919',
      desc: "Gavan's address when he reported Mary Catherine's death in February 1919. A named house in Dalkey village. The household had moved to the coast, likely for air and quiet, but she was already in a Clontarf nursing home by the end.",
    },
    tudor_house: {
      name: 'Tudor House, Clontarf',
      era: '1917 & 1919',
      desc: 'A private nursing home on Dublin\'s north coast, patronised by well-off Catholic families for convalescence and end-of-life care. **Gavan\'s father Thomas died here on 13 May 1917, of myocarditis after a five-day illness, with Gavan present at the death.** Two years later, when Gavan\'s own first wife Mary Catherine fell seriously ill with influenza in early 1919, he sent her to the same nursing home. She died there on 28 February 1919, aged 27. Tudor House was Gavan\'s family deathbed twice over, and the second choice was almost certainly informed by the first.',
    },
    upper_mount: {
      name: '36 Upper Mount Street',
      era: '1923',
      desc: "A private maternity nursing home in Georgian Dublin 2, run by Martha Conaty. Where Olga was born on 30 March 1923. Not the family home — just the lying-in address.",
    },
    queenstown: {
      name: 'Queenstown Castle, Dalkey',
      era: 'c.1920s–40s',
      desc: "Gavan and Kathleen's first proper marital home together, after they left Thomas Street in the early 1920s. Olga was born from here in 1923. By 1926 they had moved on to Newtownsmith in Dún Laoghaire. After the Duffys vacated, the Condons took the house on. Kathleen's brother Francis gave Queenstown Castle as his address on his 1941 marriage cert, so the house passed from son-in-law to father-in-law's household within a decade. Whether Gavan sold it on to John Patrick Condon, let it to him, or something else, a Registry of Deeds or Valuation Office search would settle. Either way, the flow goes Duffy first, Condon after, not the other way round.",
    },
    newtownsmith: {
      name: 'Newtownsmith, Dún Laoghaire',
      era: '1926',
      desc: 'Family home on the 1926 census — the first census of the Irish Free State. A seafront address between the People\'s Park and Sandycove. Household included Gavan, Kathleen, Thomas, Gladys, Olga, and Maud Brownson, a 20-year-old Church of Ireland servant from Ranelagh.',
    },
    undercliffe: {
      name: 'Undercliff, Killiney',
      era: 'c.1948–1954',
      images: [
        { src: 'https://killineyhistory.ie/wp-content/uploads/2021/07/Undercliffe-with-KH-text-1-1024x792.jpg', caption: 'Undercliff, photographed c.1997. Source: Killiney History Society.' },
        { src: 'https://killineyhistory.ie/wp-content/uploads/2024/02/1888_Undercliff-824x1024.jpg', caption: 'Detail from hand-drawn Ordnance Survey map, Sheet XXVI-17, 1888. Source: OSI / UCD Library.' },
      ],
      desc: 'The last house. Not a suburban villa but a piece of serious Victorian architecture: designed 1861 by **Deane and Woodward**, the same firm behind the Kildare Street Club, the Museum Building at Trinity College Dublin, and the Oxford Museum. Benjamin Woodward himself, the Ruskinian half of the partnership, drew Undercliff as one of his last works before his early death. The first lease was registered on 13 February 1861 for Francis Robinson, and the Killiney History Society calls Undercliff "undoubtedly Woodward\'s work and the apparent prototype" from which the neighbouring houses on Strathmore Road were derived. L-shaped plan, triangular porch, **two turrets** (one containing the secondary staircase with a triangular dormer, the other on the garden side wrapped in first-floor balconies), a triangular fanlight over the front door, granite architrave in the style of the Kildare Street Club, triple-arched dining-room windows with tall shafts, naturalistically carved stone capitals. Three acres of grounds, a gate lodge, a walled kitchen garden and a tennis court. **Bono lives a few doors away today; Strathmore, the mansion opposite, was for decades the Canadian ambassador\'s residence.** Gavan, who grew up above a shop in the Liberties and sailed steerage to Canada as a ranch hand at 22, bought his way into this in his late sixties. He lived at Undercliff no more than five or six years before he died there on 19 June 1954. He was attended at the end by **Delia Tierney, SRN SCM**, a State Registered Nurse and State Certified Midwife who ran a small private nursing home at "Alma", 3 Tubbermore Avenue, Dalkey, less than two miles away. She had been in practice there since at least 1948, and was evidently engaged to nurse Gavan at home through his final illness. She was the informant on his death cert. Kathleen put the house on the auction market five months later, November 1954. The 1948 auction advert shows the lease still had 408 years to run at £26 a year.\n\nHis funeral at **St Anne\u2019s, Shankill** was attended by **Liam Cosgrave TD** (future Taoiseach), P. Dockrell TD, E. Rooney TD, Senator Frank Hugh O\u2019Donnell, Alderman P.S. Doyle, army officers and the entire staff of Gavan Duffy Ltd. He was buried at Deansgrange.\n\n**References:** Killiney History Society page on Undercliff — https://killineyhistory.ie/undercliff/ — includes a photograph of the house c.1997, an 1888 hand-drawn Ordnance Survey map detail showing the site, and a clipping from the **Freeman\'s Journal, Thursday 9 June 1887**. The clipping turned out NOT to be a property notice but a small classified for the sale of a carriage placed by the then-occupant: *"CARRIAGE; for Sale a canoe-shaped Open Carriage, very light and in good order, built by H F Brown and Co, of Redmond\'s hill. Apply C B Undercliffe, Killiney, where it can be seen."* Useful inadvertently because it identifies the 1887 occupant by initials only — **C.B.** — bridging the gap between Francis Robinson (the 1861 lessee) and A. Malcolm (the 1937 owner) by one resident still to be named. The advert image is here: https://killineyhistory.ie/wp-content/uploads/2021/07/The_Freeman_s_Journal_Thu__Jun_9__1887_-1024x173.jpg',
    },
    calgary: {
      name: 'Calgary & Southern Alberta',
      era: '1903–c.1910',
      desc: 'A frontier cattle town of 4,400 people when Gavan arrived off the CPR train in 1903. Surrounded by the great ranches — Bar U, Cochrane, Walrond, Oxley, Quorn. Seven years here, working as a ranch hand. He came home with stories, bow legs, and probably a pair of boots.',
    },
  };


  // Tone colours for timeline dots
  const toneColour = (t) => ({
    birth: '#4a5d3a', death: '#4a3a3f', love: '#a86b6b',
    business: '#b08d3f', travel: '#2f4858', work: '#6b5137',
    home: '#5d4e3a', scandal: '#8b4513', family: '#6b4a3a',
  }[t] || '#3d2817');

  // Anchor events surfaced on the year scrubber — the 30-event timeline distilled.
  // Six anchors only, deliberately spaced so labels never collide on the rail.
  const anchors = [
    { y: 1880, label: 'Born above the shop', href: '/#origins' },
    { y: 1903, label: 'Sails for Canada', href: '/#alberta' },
    { y: 1912, label: 'Marries Mary Catherine', href: '/#first' },
    { y: 1920, label: 'Marries Kathleen', href: '/#second' },
    { y: 1948, label: 'Gavan Duffy Ltd.', href: '/#shop' },
    { y: 1954, label: 'Dies at Killiney', href: '/places' },
  ];

  // Archive: type counts + filter + search.
  const archiveDocs = useMemo(() => archiveData(), []);
  const filtered = archiveDocs.filter(d => {
    if (archiveFilter !== 'all' && d.type.toLowerCase() !== archiveFilter) return false;
    if (archiveQuery) {
      const q = archiveQuery.toLowerCase();
      return (d.title + ' ' + d.note + ' ' + d.src).toLowerCase().includes(q);
    }
    return true;
  });
  const counts = { all: archiveDocs.length };
  archiveDocs.forEach(d => { const k = d.type.toLowerCase(); counts[k] = (counts[k] || 0) + 1; });
  const filterTypes = ['all', ...Array.from(new Set(archiveDocs.map(d => d.type.toLowerCase()))).sort()];

  // Decade buckets for the archive index.
  const buckets = [
    { years: '1851 – 1880', kicker: 'Origins, before the shop', from: 1851, to: 1880 },
    { years: '1881 – 1910', kicker: 'Boyhood above the shop & the Alberta years', from: 1881, to: 1910 },
    { years: '1911 – 1920', kicker: 'Marriage, the Rising, the flu, marriage again', from: 1911, to: 1920 },
    { years: '1921 – 1954', kicker: 'The second life, the shop, the Killiney years', from: 1921, to: 1954 },
    { years: '1955 –', kicker: 'Aftermath', from: 1955, to: 2100 },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${C.page} 0%, ${C.pageDeep} 100%)`,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0.2 0 0 0 0 0.15 0 0 0 0 0.1 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)'/%3E%3C/svg%3E"), linear-gradient(180deg, ${C.page} 0%, ${C.pageDeep} 100%)`,
      fontFamily: FB, color: C.ink,
    }}>
      <Masthead anchors={anchors} />
      <StickyNav />
      <ScrollToTopOnRouteChange />

      <main style={{ maxWidth: 1180, margin: '0 auto' }}>
        <Routes>
          <Route index element={
            <>
              {/* CHAPTER I — Origins */}
              <ChapterAnchor id="origins" />
              <Chapter
                no="I" year="1880" kicker="Origins, above the shop"
                title="Born to a Dublin draper"
                lede='Baptised "Patritius Joran Duffy" at St Catherine’s, Meath Street, in January 1880 — the middle name almost certainly an indexer’s misreading of "Gavan" in cursive Latin. He grew up above the shop at 44 Thomas Street, in the heart of the Liberties.'
                body={[
                  "His father Thomas Duffy was already styling himself draper of Thomas Street eight years before the 1883 date traditionally given for the founding of the shop. The family lived above the premises with a sister-in-law housekeeper and six female drapery assistants. By the 1901 census Gavan was 20, already listed as a draper, working in his father's shop.",
                  "His father had got his start out of misfortune: injured in the Tamworth rail crash of September 1870 and compensated for it. The compensation, kept and saved, became the seed of 44 Thomas Street.",
                ]}
                marginalia={[
                  { kicker: 'On the baptism', body: 'St Catherine’s RC, Meath Street, January 1880. Godparents Jacobi Claffey and Josephina Sterry.', cite: 'irishgenealogy.ie ref DU-RC-BA-505126', italic: true },
                  { kicker: 'The household, 1901', body: 'Thomas (56, draper), Mary (45), Gavan (20), Lillie (18), Thomas Jr (15), John (13), Aloysius — and aunt Lizzie as housekeeper. Six drapery assistants boarded above.' },
                  { kicker: 'Sources', body: 'Open the Family Tree page for everyone in this household, or the Sources page for the certificates and census schedules behind every line.', italic: true },
                ]}
                hero={<DocSlot kind="Photograph" label="44 Thomas Street, c.1900" source="To be sourced" h={240} />}
              />

              {/* CHAPTER II — Alberta */}
              <ChapterAnchor id="alberta" />
              <Chapter
                no="II" year="1903" kicker="The seven Alberta years"
                title="A draper’s son sails for Calgary"
                lede="At twenty-three, second cabin on the SS Parisian out of Liverpool, eight days across the Atlantic to Quebec, a Canadian Pacific train west to a frontier cattle town of 4,400 souls. Two weeks later his mother died at home of a sudden heart attack, and he did not return for seven years."
                body={[
                  "Sailed from Liverpool 15 May 1903 on the Allan Line’s SS Parisian, second cabin, occupation given as junior draper, destination Calgary. The Montreal Gazette’s shipping arrivals column pins his first sight of Canada to 3 p.m. on Saturday 23 May 1903 at Quebec City.",
                  "A week after he stepped off the boat his mother Mary Duffy collapsed and died at 44 Thomas Street of angina pectoris after a three-hour illness. The informant on her death certificate was his seventeen-year-old brother Thomas B. Whether a letter reached him in Alberta or he found out by belated post we cannot know.",
                  "He came home not on the slow Allan Line but on Cunard’s flagship express service, the RMS Campania — twin-screw, 12,950 tons, two enormous funnels, Blue Riband winner — third class from New York to Liverpool, arriving 14 April 1910. Occupation: Storekeeper. Not Draper. Not Ranch hand."
                ]}
                marginalia={[
                  { kicker: 'On the manifest', body: 'Patrick Duffy / 23 / Junior draper / Dublin / Calgary', cite: 'LAC RG76 C1, 1903 arrivals' },
                  { kicker: 'A possible trace', body: 'Calgary Herald police court column, 14 Aug 1907: a Patrick Duffy fined $3.50 for being drunk in public, "admitted he had more than he could comfortably navigate with."', cite: 'Only Patrick Duffy in the Herald 1903–1910', italic: true },
                  { kicker: 'Coming home', body: 'SS Campania, third class, "Storekeeper", arrived Liverpool 14 April 1910.', cite: 'BT26 / TNA Kew' },
                ]}
                hero={<DocSlot kind="Postcard" label="SS Parisian, Allan Line, c.1900" source="To be sourced" h={260} />}
              />

              <PullQuoteSection
                eyebrow="30 May 1903 — while he was mid-Atlantic"
                text="Mary Duffy, dressmaker, of 44 Thomas Street, aged 45 years. Cause of death: angina pectoris, three hours. Informant: T. B. Duffy, son, present at death."
                attribution="Death certificate — GRO ref 4594706"
              />

              {/* CHAPTER III — Marriages & Children */}
              <ChapterAnchor id="marriages" />
              <ChapterAnchor id="first" />
              <Chapter
                no="III" year="1912" kicker="The first marriage"
                title="A draperess from Mountain View Terrace"
                lede="Mary Catherine Byrne — Mary Kate on the 1911 census — a draper’s assistant aged nineteen, daughter of a DMP policeman and a Kilkenny dressmaker."
                body={[
                  "They married at Golden Bridge, Inchicore, on 4 September 1912. Thomas was born June 1913 at 66 South Circular Road. Gladys was born April 1916 at 66 St Michael’s Terrace, ten days before the Easter Rising began less than a mile away.",
                  "In February 1919 the third wave of the influenza pandemic took her. She was twenty-seven. Gavan, by then living at Herbert Lodge in Dalkey, sent her to Tudor House nursing home in Clontarf — the same private nursing home where his own father had died of myocarditis two years earlier — and reported her death himself. Thomas was six. Gladys was three.",
                ]}
                marginalia={[
                  { kicker: 'Two children', body: 'Thomas Joseph, b. 25 Jun 1913. Gladys May, b. 14 Apr 1916.' },
                  { kicker: 'Tudor House', body: 'Gavan’s father died here in May 1917. Two years later, his wife died here of the flu. The same private nursing home, twice.', italic: true },
                ]}
                hero={<DocSlot kind="Newspaper" label="Marriage notice — Freeman’s Journal, 5 Sep 1912" source="To be sourced" h={180} />}
              />

              {/* CHAPTER IV — Second life */}
              <ChapterAnchor id="second" />
              <Chapter
                no="IV" year="1920" kicker="The second life"
                title="An eighteen-year-old barrister’s daughter from Terenure"
                lede="Eighteen months after Mary Catherine’s death, Gavan married Kathleen Mary Condon at St Joseph’s, Crumlin. He was thirty-eight, a widower with two small children. She was eighteen or nineteen."
                body={[
                  "Kathleen’s father John Patrick Condon was a barrister and Clerk of the South Dublin Union at James’s Street. The Union office and Gavan’s shop on Thomas Street stood about four hundred yards apart. The two men had almost certainly known each other for years before Gavan married into the family.",
                  "Olga was born in 1923, George a few years later. The household moved through Queenstown Castle in Dalkey, Newtownsmith in Dún Laoghaire, and finally Undercliff, Killiney — a Deane and Woodward house from 1861, with two turrets and three acres of grounds, bought by a man who had grown up above a shop and sailed steerage to Canada at twenty-two.",
                ]}
                marginalia={[
                  { kicker: 'Officiant', body: 'Fr John A. Duffy OSA — Gavan’s own brother, an Augustinian priest.', italic: true },
                  { kicker: 'Two children', body: 'Olga (b. 1923, d. 2016) and George (b. after 1926).' },
                  { kicker: 'Coastal lives', body: 'Queenstown Castle Dalkey → Newtownsmith Dún Laoghaire → Undercliff Killiney.' },
                ]}
              />

              {/* CHAPTER V — The shop */}
              <ChapterAnchor id="shop" />
              <ShopChapter />

              {/* End-of-story signposts to the reference pages */}
              <ReferenceSignposts />
            </>
          } />

          <Route path="/family-tree" element={
            <FamilyTree people={people} setSelectedPerson={setSelectedPerson} />
          } />

          <Route path="/places" element={
            <section style={{ padding: '60px 28px 40px' }}>
              <SectionHeading kicker="Chapter — The Houses" title="From the Liberties to the sea" sub="Eight addresses, fifty years of moves." />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14, marginTop: 24 }}>
                {Object.entries(places).map(([key, p]) => (
                  <button key={key} onClick={() => setSelectedPlace(key)} style={{
                    display: 'block', textAlign: 'left', background: C.paper,
                    border: `1px solid ${C.rule}`, padding: '16px 18px', cursor: 'pointer',
                    fontFamily: 'inherit', color: 'inherit',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                      <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 17, margin: 0, color: C.ink }}>{p.name}</h3>
                      <span style={{ fontFamily: FM, fontSize: 10, color: C.oxblood, whiteSpace: 'nowrap', letterSpacing: '0.1em' }}>{p.era}</span>
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: 14, color: C.taupe, lineHeight: 1.5 }}>
                      {p.desc.substring(0, 130)}{p.desc.length > 130 ? '…' : ''}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          } />

          <Route path="/sources" element={
            <ArchiveSection
              docs={filtered} all={archiveDocs} counts={counts} types={filterTypes}
              filter={archiveFilter} setFilter={setArchiveFilter}
              query={archiveQuery} setQuery={setArchiveQuery}
              buckets={buckets}
            />
          } />

          <Route path="*" element={
            <section style={{ padding: '80px 28px', textAlign: 'center' }}>
              <p style={{ fontFamily: FM, fontSize: 11, letterSpacing: '0.32em', color: C.oxblood, margin: 0 }}>NOT FOUND</p>
              <h2 style={{ fontFamily: FD, fontWeight: 700, fontSize: 32, margin: '12px 0 18px', color: C.ink }}>This page is not in the archive.</h2>
              <p style={{ fontFamily: FB, fontStyle: 'italic', color: C.taupe, margin: 0 }}>
                <Link to="/" style={{ color: C.oxblood }}>Return to the front page</Link>.
              </p>
            </section>
          } />
        </Routes>
      </main>

      {selectedPerson && (
        <Modal onClose={() => setSelectedPerson(null)}>
          <p style={{ fontFamily: FM, fontSize: 11, letterSpacing: '0.22em', color: C.oxblood, margin: 0 }}>
            {people[selectedPerson].role?.toUpperCase()}
          </p>
          <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 26, margin: '6px 0 4px', color: C.ink }}>
            {people[selectedPerson].name}
          </h3>
          {people[selectedPerson].dates && (
            <p style={{ fontStyle: 'italic', color: C.oxblood, margin: '0 0 14px' }}>
              {people[selectedPerson].dates}
            </p>
          )}
          {(people[selectedPerson].story || 'More research needed.').split('\n\n').map((para, i) => (
            <p key={i} style={{ lineHeight: 1.7, fontSize: 16, margin: '0 0 14px' }}>
              {renderInline(para)}
            </p>
          ))}
        </Modal>
      )}

      {selectedPlace && (
        <Modal onClose={() => setSelectedPlace(null)}>
          <p style={{ fontFamily: FM, fontSize: 11, letterSpacing: '0.22em', color: C.oxblood, margin: 0 }}>
            <MapPin size={11} style={{ display: 'inline', marginRight: 4 }} />
            {places[selectedPlace].era}
          </p>
          <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 24, margin: '6px 0 14px', color: C.ink }}>
            {places[selectedPlace].name}
          </h3>
          {places[selectedPlace].images && places[selectedPlace].images.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: places[selectedPlace].images.length > 1 ? '1fr 1fr' : '1fr', gap: 8, marginBottom: 14 }}>
              {places[selectedPlace].images.map((img, i) => (
                <figure key={i} style={{ margin: 0 }}>
                  <img src={img.src} alt={img.caption} style={{ width: '100%', height: 'auto', border: `1px solid ${C.taupe}`, display: 'block', background: '#ede2c4' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  {img.caption && <figcaption style={{ fontFamily: FM, fontSize: 10, color: C.taupe, marginTop: 4, fontStyle: 'italic' }}>{img.caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}
          {places[selectedPlace].desc.split('\n\n').map((para, i) => (
            <p key={i} style={{ lineHeight: 1.7, fontSize: 16, margin: '0 0 14px' }}>
              {renderInline(para)}
            </p>
          ))}
        </Modal>
      )}

      <Footer />
    </div>
  );
}

// ── Layout primitives ──────────────────────────────────────────────────────

function Masthead({ anchors }) {
  const start = 1875, end = 1965, span = end - start;
  return (
    <header style={{
      background: `radial-gradient(ellipse at top, #2c211b 0%, ${C.ink} 60%, #14100c 100%)`,
      color: C.cream,
      padding: '56px 24px 44px', textAlign: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle paper grain on the dark band */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.18,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
      }} />
      <div style={{ position: 'relative' }}>
        <p style={{ fontFamily: FM, fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: C.gold, margin: 0 }}>
          An archive of the life of
        </p>
        <h1 style={{ fontFamily: FD, fontWeight: 900, fontSize: 'clamp(2.8rem, 8.5vw, 5.4rem)', margin: '10px 0 6px', letterSpacing: '-0.025em', lineHeight: 0.95, color: C.cream }}>
          Patrick <span style={{ fontStyle: 'italic', color: C.gold, fontWeight: 700 }}>Gavan</span> Duffy
        </h1>
        <p style={{ fontFamily: FD, fontStyle: 'italic', fontSize: '1.15rem', margin: 0, color: '#d4c9a8' }}>
          Draper of Thomas Street
        </p>
        <p style={{ fontFamily: FD, fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', margin: '18px 0 0', color: C.cream, letterSpacing: '0.06em', fontWeight: 300 }}>
          1880 <span style={{ color: C.gold }}>—</span> 1954
        </p>

        {/* Drapery motif: thread-and-button on dark */}
        <svg viewBox="0 0 220 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: 'block', margin: '18px auto 30px', width: 'min(180px, 50vw)', height: 'auto' }}>
          <path d="M2,12 Q40,5 80,12 T100,12" stroke={C.gold} strokeWidth="0.8" fill="none" opacity="0.7" />
          <path d="M218,12 Q180,19 140,12 T120,12" stroke={C.gold} strokeWidth="0.8" fill="none" opacity="0.7" />
          <circle cx="110" cy="12" r="6" fill="none" stroke={C.gold} strokeWidth="0.9" />
          <circle cx="110" cy="12" r="4.4" fill="none" stroke={C.gold} strokeWidth="0.4" opacity="0.6" />
          <circle cx="107.5" cy="9.5" r="0.6" fill={C.gold} />
          <circle cx="112.5" cy="9.5" r="0.6" fill={C.gold} />
          <circle cx="107.5" cy="14.5" r="0.6" fill={C.gold} />
          <circle cx="112.5" cy="14.5" r="0.6" fill={C.gold} />
        </svg>

        {/* Hero year scrubber — labels alternate above and below the rail */}
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div style={{ position: 'relative', height: 110 }}>
            <div style={{
              position: 'absolute', left: 0, right: 0, top: 55, height: 2,
              backgroundImage: `linear-gradient(to right, rgba(196,167,125,0.5) 0, rgba(196,167,125,0.5) 4px, transparent 4px, transparent 8px)`,
              backgroundSize: '8px 2px',
            }} />
            <div style={{
              position: 'absolute',
              left: `${((1880 - start) / span) * 100}%`,
              width: `${((1954 - 1880) / span) * 100}%`,
              top: 54, height: 4, background: C.gold, opacity: 0.85,
            }} />
            {anchors.map((a, i) => {
              const x = ((a.y - start) / span) * 100;
              const above = i % 2 === 0;
              return (
                <Link key={i} to={a.href} title={`${a.y} — ${a.label}`} style={{ position: 'absolute', left: `${x}%`, top: 0, transform: 'translateX(-50%)', textAlign: 'center', textDecoration: 'none', width: 90, height: '100%' }}>
                  {above && (
                    <div style={{ position: 'absolute', bottom: 62, left: 0, right: 0 }}>
                      <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 12, color: C.cream, lineHeight: 1 }}>{a.y}</div>
                      <div style={{ fontFamily: FD, fontStyle: 'italic', fontSize: 11, color: '#d4c9a8', marginTop: 2, lineHeight: 1.15 }}>{a.label}</div>
                    </div>
                  )}
                  <div style={{
                    width: 13, height: 13, borderRadius: '50%',
                    background: C.ink, border: `2px solid ${C.gold}`, position: 'absolute', top: 49, left: '50%', transform: 'translateX(-50%)',
                    boxShadow: `0 0 0 2px ${C.ink}`,
                  }} />
                  {!above && (
                    <div style={{ position: 'absolute', top: 70, left: 0, right: 0 }}>
                      <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 12, color: C.cream, lineHeight: 1 }}>{a.y}</div>
                      <div style={{ fontFamily: FD, fontStyle: 'italic', fontSize: 11, color: '#d4c9a8', marginTop: 2, lineHeight: 1.15 }}>{a.label}</div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}

function StickyNav() {
  const story = [
    { id: 'origins', label: 'Origins' },
    { id: 'alberta', label: 'Alberta' },
    { id: 'marriages', label: 'Marriages & Children' },
    { id: 'shop', label: 'The Shop' },
  ];
  const reference = [
    { id: 'family', label: 'Family Tree', path: '/family-tree' },
    { id: 'places', label: 'Places & Houses', path: '/places' },
    { id: 'archive', label: 'Sources', path: '/sources', count: 49 },
  ];

  const location = useLocation();
  const onHome = location.pathname === '/';
  const storyIds = story.map(c => c.id);
  const [active, setActive] = useState(onHome ? 'origins' : null);

  // Scroll-spy only runs on the home page; on routed reference pages the active
  // state is determined by the route itself.
  useEffect(() => {
    if (!onHome) {
      setActive(null);
      return;
    }
    const onScroll = () => {
      let current = storyIds[0];
      for (const id of storyIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top - 140 <= 0) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onHome]);

  const referenceActiveId = reference.find(r => r.path === location.pathname)?.id;

  const linkStyle = (isActive) => ({
    fontFamily: FD, fontSize: 14, color: isActive ? C.ink : C.taupe,
    textDecoration: 'none', padding: '4px 0', position: 'relative',
    fontWeight: isActive ? 700 : 400,
    borderBottom: isActive ? `2px solid ${C.oxblood}` : '2px solid transparent',
    flexShrink: 0,
  });

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(251,246,234,0.96)', backdropFilter: 'blur(8px)', borderBottom: `1px solid ${C.rule}` }}>
      <nav style={{ maxWidth: 1180, margin: '0 auto', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 22, overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <Link to="/" style={{ fontFamily: FM, fontSize: 9, letterSpacing: '0.24em', color: C.oxblood, flexShrink: 0, textDecoration: 'none' }}>P.G.D.</Link>
        {story.map(ch => (
          onHome ? (
            <a key={ch.id} href={`#${ch.id}`} style={linkStyle(active === ch.id)}>{ch.label}</a>
          ) : (
            <Link key={ch.id} to={`/#${ch.id}`} style={linkStyle(false)}>{ch.label}</Link>
          )
        ))}
        <span aria-hidden="true" style={{ width: 1, height: 18, background: C.rule, flexShrink: 0 }} />
        {reference.map(ch => {
          const isActive = referenceActiveId === ch.id;
          return (
            <Link key={ch.id} to={ch.path} style={linkStyle(isActive)}>
              {ch.label}
              {ch.count != null && (
                <span style={{ fontFamily: FM, fontSize: 10, marginLeft: 6, color: C.oxblood, letterSpacing: '0.05em' }}>
                  {ch.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

// Scrolls to the top whenever the route changes. If the new location includes
// a hash (e.g. /#origins from a non-home page), wait one tick for the page to
// render and then scroll the named anchor into view.
function ScrollToTopOnRouteChange() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.startsWith('#') ? hash.slice(1) : hash;
      const t = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
        else window.scrollTo(0, 0);
      }, 60);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

// End-of-story signposts: a quiet, editorial pair of links that lead the
// reader from the end of the four chapters into the reference pages.
function ReferenceSignposts() {
  return (
    <section style={{ padding: '60px 28px 80px', textAlign: 'center', borderTop: `1px solid ${C.rule}` }}>
      <p style={{ fontFamily: FM, fontSize: 11, letterSpacing: '0.32em', color: C.oxblood, margin: 0 }}>
        FURTHER IN
      </p>
      <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', margin: '12px 0 24px', color: C.ink, fontStyle: 'italic' }}>
        Read on, sideways
      </h3>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 28, marginTop: 8 }}>
        <Link to="/family-tree" style={{ fontFamily: FD, fontSize: 16, color: C.oxblood, textDecoration: 'none', borderBottom: `1px solid ${C.oxblood}`, paddingBottom: 2 }}>
          The Family Tree →
        </Link>
        <Link to="/places" style={{ fontFamily: FD, fontSize: 16, color: C.oxblood, textDecoration: 'none', borderBottom: `1px solid ${C.oxblood}`, paddingBottom: 2 }}>
          Places & Houses →
        </Link>
        <Link to="/sources" style={{ fontFamily: FD, fontSize: 16, color: C.oxblood, textDecoration: 'none', borderBottom: `1px solid ${C.oxblood}`, paddingBottom: 2 }}>
          The Sources (49) →
        </Link>
      </div>
    </section>
  );
}

function ChapterAnchor({ id }) {
  return <div id={id} style={{ position: 'relative', top: -100 }} />;
}

function Chapter({ no, year, kicker, title, lede, body, marginalia, hero }) {
  return (
    <section style={{ padding: '64px 28px 44px', borderBottom: `1px solid ${C.rule}` }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '110px 1fr 220px', gap: 32, alignItems: 'start',
      }} className="chapter-grid">
        <div style={{ position: 'sticky', top: 130 }}>
          <div style={{ fontFamily: FM, fontSize: 10, letterSpacing: '0.3em', color: C.taupe }}>CHAPTER {no}</div>
          <div style={{ fontFamily: FD, fontWeight: 900, fontSize: 40, lineHeight: 1, color: C.oxblood, marginTop: 6 }}>{year}</div>
          <div style={{ width: 32, height: 2, background: C.oxblood, margin: '12px 0' }} />
          <div style={{ fontFamily: FD, fontStyle: 'italic', fontSize: 13, color: C.taupe }}>{kicker}</div>
        </div>
        <div>
          <h2 style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', lineHeight: 1.05, color: C.ink, margin: '0 0 12px', letterSpacing: '-0.01em' }}>{title}</h2>
          <p style={{ fontFamily: FD, fontStyle: 'italic', fontSize: 'clamp(1.05rem, 1.8vw, 1.3rem)', lineHeight: 1.45, color: C.inkSoft, margin: '0 0 18px' }}>{lede}</p>
          {hero}
          {body.map((p, i) => (
            <p key={i} style={{ fontSize: '1.05rem', lineHeight: 1.7, margin: '0 0 14px', textWrap: 'pretty' }}>
              {i === 0 ? (
                <>
                  <span style={{
                    float: 'left', fontFamily: FD, fontWeight: 900, fontSize: '4.2rem',
                    lineHeight: 0.85, color: C.oxblood, paddingRight: 10, paddingTop: 6, marginBottom: -4,
                  }}>{p.charAt(0)}</span>
                  {p.slice(1)}
                </>
              ) : p}
            </p>
          ))}
        </div>
        <aside style={{ borderLeft: `1px dashed ${C.taupe}`, paddingLeft: 16 }}>
          <Marginalia items={marginalia} />
        </aside>
      </div>
      <style>{`@media (max-width: 880px) { .chapter-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

function Marginalia({ items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {items.map((it, i) => (
        <div key={i}>
          <div style={{ fontFamily: FM, fontSize: 9, letterSpacing: '0.22em', color: C.oxblood, marginBottom: 4 }}>{it.kicker}</div>
          <div style={{ fontFamily: FD, fontSize: 14, lineHeight: 1.4, color: C.ink, fontStyle: it.italic ? 'italic' : 'normal' }}>{it.body}</div>
          {it.cite && <div style={{ fontFamily: FM, fontSize: 9, letterSpacing: '0.1em', color: C.taupe, marginTop: 4 }}>{it.cite}</div>}
        </div>
      ))}
    </div>
  );
}

function PullQuoteSection({ eyebrow, text, attribution }) {
  return (
    <section style={{ padding: '56px 28px', background: C.ink, borderTop: `1px solid ${C.taupe}`, borderBottom: `1px solid ${C.taupe}` }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontFamily: FM, fontSize: 11, letterSpacing: '0.28em', color: C.gold, margin: 0 }}>{eyebrow}</p>
        <figure style={{ margin: '18px 0 0', padding: '4px 0' }}>
          <blockquote style={{ margin: 0, fontFamily: FD, fontStyle: 'italic', fontSize: 'clamp(1.4rem, 2.8vw, 2rem)', lineHeight: 1.35, color: C.cream }}>
            “{text}”
          </blockquote>
          <figcaption style={{ fontFamily: FM, fontSize: 10, letterSpacing: '0.22em', color: C.gold, marginTop: 14, textTransform: 'uppercase' }}>
            — {attribution}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function DocSlot({ kind, label, source, h = 220 }) {
  return (
    <figure style={{ margin: '4px 0 18px' }}>
      <div style={{
        height: h,
        background: 'repeating-linear-gradient(135deg, #ede2c4 0 8px, #e6d8b8 8px 16px)',
        border: `1px solid ${C.taupe}`, boxShadow: '4px 5px 0 rgba(42,31,26,0.08)',
        transform: 'rotate(-0.4deg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FM, fontSize: 11, color: C.taupe, letterSpacing: '0.18em',
        textAlign: 'center', padding: 16,
      }}>
        [ {kind.toUpperCase()} — {label.toUpperCase()} ]
      </div>
      <figcaption style={{ fontFamily: FM, fontSize: 10, letterSpacing: '0.12em', color: C.taupe, marginTop: 6, textAlign: 'right' }}>
        SOURCE: {source}
      </figcaption>
    </figure>
  );
}

function SectionHeading({ kicker, title, sub }) {
  return (
    <header>
      <p style={{ fontFamily: FM, fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.oxblood, margin: 0 }}>{kicker}</p>
      <h2 style={{ fontFamily: FD, fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 2.6rem)', margin: '6px 0 4px', color: C.ink, letterSpacing: '-0.02em' }}>{title}</h2>
      {sub && <p style={{ fontFamily: FD, fontStyle: 'italic', fontSize: 16, color: C.oxblood, margin: 0 }}>{sub}</p>}
    </header>
  );
}

// ── The Shop chapter — drapery flourishes preserved ────────────────────────
function ShopChapter() {
  return (
    <>
      <Chapter
        no="V" year="1883" kicker="Forty years at 44 Thomas Street"
        title="Duffy’s of Thomas Street"
        lede="Founded by Thomas in 1883 at No. 44, expanded by Gavan through the 1900s and 1940s across five adjoining buildings: 42, 43, 44, 45 and 46. By 1948 his own name was over the door."
        body={[
          'Out of misfortune came opportunity. On Wednesday 14 September 1870, the Irish Mail train crashed at Tamworth. Thomas Duffy, a young Dublin haberdashery buyer travelling to London, was among the injured. He took the compensation and saved it. Thirteen years later he leased No. 44 from Monsieur and Madame Jules Bouvier of Geneva at £50 a year and opened Thomas Duffy, Draper and Milliner.',
          'Thomas B. Duffy left around 1918 to found his own drapery at North Earl Street — Duffy’s of North Earl Street, which still trades today as Duffy’s Curtains. Gavan took sole charge of Thomas Street.',
          'Over the next forty years he expanded from No. 44 through Nos. 42, 43, 45 and 46, knocking the buildings together. In 1939 he applied for the transfer of a seven-day pub licence attached to 45/46 (pragmatism, not thirst). In 1948 he registered as Gavan Duffy Ltd., putting his own name over the door and bringing his daughters Gladys (Chairman) and Olga (Director) onto the board.',
        ]}
        marginalia={[
          { kicker: 'On the lease', body: 'No. 44 leased 1883 from Monsieur and Madame Jules Bouvier of Geneva at £50 a year. The ground had been leased to Charles Eastwood by the Earl of Meath in 1697.' },
          { kicker: 'A favourite saying', body: '"Any fool can make money, but it takes a wise man to keep it."', italic: true, cite: 'A SAYING OF HIS FATHER’S' },
          { kicker: 'Before the court, 1941', body: 'Eight Thomas Street traders charged with organising an unauthorised lottery, Gavan among them.', italic: true, cite: 'Irish Press, 10 Oct 1941' },
        ]}
        hero={
          <div style={{ background: C.ink, color: C.cream, padding: '24px 22px', textAlign: 'center', marginBottom: 16, border: `3px double ${C.gold}` }}>
            <p style={{ fontFamily: FM, fontSize: 10, letterSpacing: '0.3em', margin: 0, color: C.gold }}>
              42 · 43 · 44 · 45 · 46 THOMAS STREET
            </p>
            <h3 style={{ fontFamily: FD, fontStyle: 'italic', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, margin: '6px 0 4px', color: C.cream }}>
              Duffy’s
            </h3>
            <p style={{ fontSize: 13, margin: 0, color: '#d4c9a8', letterSpacing: '0.1em' }}>
              OF DUBLIN · EST. 1883
            </p>
            {/* Drapery touch retained: fabric swatches, like a sample book */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 14 }} aria-hidden="true">
              {[C.oxblood, C.gold, '#4a5d3a', '#2f4858', C.taupe, '#6b4a3a', C.rose, C.inkSoft].map((c, i) => (
                <span key={i} style={{ display: 'inline-block', width: 14, height: 18, background: c, border: '1px solid rgba(244,235,216,0.4)' }} />
              ))}
            </div>
          </div>
        }
      />
    </>
  );
}

// ── The People — SVG family tree ───────────────────────────────────────────
function FamilyTree({ people, setSelectedPerson }) {
  const NW = 170, NH = 88;
  const G1 = 70, G2 = 270, G3 = 480;
  const GAVAN_X = 540;
  // GEN II sibling centres — re-spaced so no card overlaps Gavan’s
  const TB_C = 170;   // Thomas B
  const LL_C = 360;   // Lily
  const JD_C = 820;   // Rev John A. Duffy (was 730 — overlapped Gavan)
  const AL_C = 1060;  // Aloysius (pushed right to keep the gap even)

  const N = ({ id, x, y, accent, faded, highlight }) => {
    const p = people[id]; if (!p) return null;
    const ys = (p.dates || '').match(/\d{4}/g)?.map(Number) || [];
    const start = 1840, end = 2020, span = end - start;
    const lf = ys[0], lt = ys[1];
    return (
      <g transform={`translate(${x},${y})`} style={{ cursor: 'pointer' }} onClick={() => setSelectedPerson(id)}>
        <rect width={NW} height={NH} fill={accent || 'rgba(255,255,255,0.7)'} stroke={highlight ? C.gold : C.taupe} strokeWidth={highlight ? 2 : 1} opacity={faded ? 0.6 : 1} />
        <text x={10} y={20} style={{ fontFamily: FD, fontWeight: 700, fontSize: 13, fill: C.ink }}>{p.name.length > 22 ? p.name.slice(0, 21) + '…' : p.name}</text>
        <text x={10} y={36} style={{ fontFamily: FD, fontStyle: 'italic', fontSize: 11, fill: C.oxblood }}>{p.dates || ''}</text>
        <foreignObject x={10} y={44} width={NW - 20} height={32}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily: FB, fontSize: 11, color: C.taupe, lineHeight: 1.3, overflow: 'hidden', maxHeight: 30 }}>
            {(p.role || '').slice(0, 70)}{(p.role || '').length > 70 ? '…' : ''}
          </div>
        </foreignObject>
        {/* Lifespan bar */}
        {Number.isFinite(lf) && (
          <g transform={`translate(10, ${NH - 8})`}>
            <line x1={0} x2={NW - 20} y1={0} y2={0} stroke={C.rule} strokeWidth={1} />
            <line
              x1={Math.max(0, ((lf - start) / span) * (NW - 20))}
              x2={Math.min(NW - 20, ((Number.isFinite(lt) ? lt : end) - start) / span * (NW - 20))}
              y1={0} y2={0} stroke={C.oxblood} strokeWidth={3}
            />
          </g>
        )}
      </g>
    );
  };

  return (
    <section style={{ padding: '0 0 40px', borderTop: `1px solid ${C.rule}` }}>
      <div style={{ background: `linear-gradient(180deg, ${C.ink} 0%, #2c211b 100%)`, color: C.cream, padding: '52px 28px 44px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.15,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        }} />
        <div style={{ position: 'relative' }}>
          <p style={{ fontFamily: FM, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.gold, margin: 0 }}>Chapter — The People</p>
          <h2 style={{ fontFamily: FD, fontWeight: 900, fontSize: 'clamp(2rem, 4.4vw, 3rem)', margin: '8px 0 6px', color: C.cream, letterSpacing: '-0.02em' }}>Three generations of <span style={{ fontStyle: 'italic', color: C.gold }}>drapers</span></h2>
          <p style={{ fontFamily: FD, fontStyle: 'italic', fontSize: 17, color: '#d4c9a8', margin: 0, maxWidth: 720 }}>Marrying milliners and barristers' daughters, raising priests and nuns and Adelaide emigrants between the famine and the Free State.</p>
        </div>
      </div>
      <div style={{ padding: '28px 28px 0' }}>
      <div style={{ display: 'flex', gap: 16, marginTop: 4, fontFamily: FM, fontSize: 10, letterSpacing: '0.18em', color: C.taupe, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><span style={{ width: 10, height: 10, background: '#f3d9d9', border: `1px solid ${C.rose}` }} /> 1ST MARRIAGE</span>
        <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><span style={{ width: 10, height: 10, background: '#e6ead8', border: `1px solid ${C.sage}` }} /> 2ND MARRIAGE</span>
        <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><span style={{ width: 10, height: 10, background: 'rgba(176,141,63,0.2)', border: `2px solid ${C.gold}` }} /> DIRECT LINE</span>
        <span style={{ marginLeft: 'auto', fontStyle: 'italic', fontFamily: FD, color: C.oxblood, letterSpacing: 0, fontSize: 13 }}>Tap any node for the full story.</span>
      </div>

      <div style={{ overflowX: 'auto', marginTop: 18, paddingBottom: 12 }}>
        <svg width={1240} height={620} style={{ display: 'block', minWidth: 1240 }}>
          {/* GEN I */}
          <N id="thomas_sr" x={310} y={G1} />
          <N id="mary_duffy" x={310 + 260} y={G1} />
          <line x1={310 + NW} x2={310 + 260} y1={G1 + NH / 2} y2={G1 + NH / 2} stroke={C.oxblood} strokeWidth={1.2} />
          <rect x={310 + NW + 4} y={G1 + NH / 2 - 10} width={48} height={20} fill={C.cream} stroke={C.oxblood} strokeWidth={0.5} />
          <text x={310 + NW + 28} y={G1 + NH / 2 + 4} textAnchor="middle" style={{ fontFamily: FM, fontSize: 9, fill: C.oxblood, letterSpacing: '0.05em' }}>m. 1875</text>

          <N id="lizzie" x={70} y={G1 + 8} faded />
          {/* Annotation below Lizzie's card so it can't collide with Thomas Sr */}
          <text x={70} y={G1 + 8 + NH + 14} style={{ fontFamily: FD, fontStyle: 'italic', fontSize: 11, fill: C.taupe }}>unmarried sister</text>
          <text x={70} y={G1 + 8 + NH + 28} style={{ fontFamily: FD, fontStyle: 'italic', fontSize: 11, fill: C.taupe }}>in the household</text>

          {/* drop to GEN II */}
          <g stroke={C.taupe} strokeWidth={1} fill="none">
            <line x1={310 + NW + 28} x2={310 + NW + 28} y1={G1 + NH / 2 + 10} y2={G2 - 30} />
            <line x1={TB_C} x2={AL_C} y1={G2 - 30} y2={G2 - 30} />
            {[TB_C, LL_C, GAVAN_X + NW / 2, JD_C, AL_C].map((cx, i) => (
              <line key={i} x1={cx} x2={cx} y1={G2 - 30} y2={G2} />
            ))}
          </g>

          {/* GEN II */}
          <N id="thomas_b" x={TB_C - NW / 2} y={G2} />
          <N id="lily" x={LL_C - NW / 2} y={G2} faded />
          <N id="gavan" x={GAVAN_X} y={G2} highlight />
          <N id="john_duffy" x={JD_C - NW / 2} y={G2} faded />
          <N id="aloysius" x={AL_C - NW / 2} y={G2} faded />

          {/* Wives flanking Gavan */}
          <N id="mary_catherine" x={GAVAN_X - 270} y={G2 + 130} accent="#f3d9d9" />
          <N id="kathleen" x={GAVAN_X + 200} y={G2 + 130} accent="#e6ead8" />

          {/* First marriage line + label. Label sits over the line midpoint, just above so it never grazes the wife card or Gavan. */}
          <line x1={GAVAN_X - 270 + NW} x2={GAVAN_X} y1={G2 + 130 + NH / 2} y2={G2 + NH - 4} stroke={C.rose} strokeWidth={1.3} />
          <rect x={GAVAN_X - 84} y={G2 + 104} width={68} height={20} fill={C.cream} stroke={C.rose} />
          <text x={GAVAN_X - 50} y={G2 + 118} textAnchor="middle" style={{ fontFamily: FM, fontSize: 9, fill: C.rose, letterSpacing: '0.05em' }}>m. 1912 †19</text>

          <line x1={GAVAN_X + NW} x2={GAVAN_X + 200} y1={G2 + NH - 4} y2={G2 + 130 + NH / 2} stroke={C.sage} strokeWidth={1.3} />
          <rect x={GAVAN_X + 157} y={G2 + 104} width={56} height={20} fill={C.cream} stroke={C.sage} />
          <text x={GAVAN_X + 185} y={G2 + 118} textAnchor="middle" style={{ fontFamily: FM, fontSize: 9, fill: '#4a5d3a', letterSpacing: '0.05em' }}>m. 1920</text>

          {/* Children */}
          <g stroke={C.taupe} strokeWidth={1} fill="none">
            <line x1={GAVAN_X - 270 + NW / 2} x2={GAVAN_X - 270 + NW / 2} y1={G2 + 130 + NH} y2={G3 - 22} />
            <line x1={170} x2={GAVAN_X - 270 + NW / 2} y1={G3 - 22} y2={G3 - 22} />
            <line x1={170} x2={170} y1={G3 - 22} y2={G3} />
            <line x1={350} x2={350} y1={G3 - 22} y2={G3} />

            <line x1={GAVAN_X + 200 + NW / 2} x2={GAVAN_X + 200 + NW / 2} y1={G2 + 130 + NH} y2={G3 - 22} />
            {/* horizontal must span both children, not start at Kathleen — otherwise Olga floats */}
            <line x1={770} x2={985} y1={G3 - 22} y2={G3 - 22} />
            <line x1={770} x2={770} y1={G3 - 22} y2={G3} />
            <line x1={985} x2={985} y1={G3 - 22} y2={G3} />
          </g>
          <N id="thomas_jr" x={170 - NW / 2} y={G3} accent="#f3d9d9" />
          <N id="gladys" x={350 - NW / 2} y={G3} accent="#f3d9d9" />
          <N id="olga" x={770 - NW / 2} y={G3} accent="#e6ead8" highlight />
          <N id="george" x={985 - NW / 2} y={G3} accent="#e6ead8" faded />
        </svg>
      </div>

      {/* In-law branches */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, marginTop: 28 }}>
        <div>
          <p style={{ fontFamily: FM, fontSize: 10, letterSpacing: '0.25em', color: C.rose, margin: 0 }}>BRANCH — MARY CATHERINE’S LINE</p>
          <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 20, margin: '6px 0 10px', color: C.ink }}>The Byrnes & the Whelans</h3>
          <p style={{ fontFamily: FD, fontStyle: 'italic', fontSize: 14, color: C.taupe, margin: '0 0 10px' }}>Policemen and a river pilot. The rural Irish line, into Dublin via the DMP.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {['benjamin', 'catherine_whelan', 'john_byrne', 'martin_whelan'].map(id => (
              <button key={id} onClick={() => setSelectedPerson(id)} style={{ background: C.paper, border: `1px solid ${C.rule}`, padding: '8px 10px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 13, color: C.ink }}>{people[id].name}</div>
                <div style={{ fontFamily: FB, fontSize: 11, color: C.taupe, marginTop: 2 }}>{(people[id].role || '').slice(0, 50)}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontFamily: FM, fontSize: 10, letterSpacing: '0.25em', color: '#4a5d3a', margin: 0 }}>BRANCH — KATHLEEN’S LINE</p>
          <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 20, margin: '6px 0 10px', color: C.ink }}>The Condons & the Whytes</h3>
          <p style={{ fontFamily: FD, fontStyle: 'italic', fontSize: 14, color: C.taupe, margin: '0 0 10px' }}>A Meath barrister, a Carlow mother, ten children. Taught as a boy by Michael Cusack, founder of the GAA.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {['john_condon', 'anna_mary', 'eileen_condon', 'francis_condon', 'other_condons'].map(id => (
              <button key={id} onClick={() => setSelectedPerson(id)} style={{ background: C.paper, border: `1px solid ${C.rule}`, padding: '8px 10px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 13, color: C.ink }}>{people[id].name}</div>
                <div style={{ fontFamily: FB, fontSize: 11, color: C.taupe, marginTop: 2 }}>{(people[id].role || '').slice(0, 50)}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

// ── The Archive ────────────────────────────────────────────────────────────
function ArchiveSection({ docs, all, counts, types, filter, setFilter, query, setQuery, buckets }) {
  // Six "discovery" docs surfaced as featured magazine treatments
  const featuredYears = [1875, 1880, 1936];
  const featured = featuredYears
    .map(y => all.find(d => d.year === y))
    .filter(Boolean);

  return (
    <section style={{ padding: '60px 28px 60px', borderTop: `1px solid ${C.rule}` }}>
      <SectionHeading kicker="Chapter — Sources" title="The paper trail" sub={`${all.length} primary documents — birth, marriage and death certificates; censuses; newspaper clippings; probate grants; passenger manifests.`} />

      {/* Search + filter chips */}
      <div style={{ marginTop: 20, padding: 16, background: C.cream, border: `1px solid ${C.rule}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', border: `1px solid ${C.taupe}`, background: '#fbf6e8', maxWidth: 520, marginBottom: 14 }}>
          <Search size={14} style={{ color: C.taupe }} />
          <input
            type="search"
            placeholder="Search documents — names, places, sources…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1, border: 'none', background: 'transparent', outline: 'none',
              fontFamily: FD, fontSize: 14, color: C.ink,
            }}
          />
          {query && <span style={{ fontFamily: FM, fontSize: 9, color: C.taupe, letterSpacing: '0.15em' }}>{docs.length} RESULTS</span>}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              fontFamily: FM, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
              padding: '6px 12px',
              background: filter === t ? C.oxblood : 'transparent',
              color: filter === t ? C.cream : C.taupe,
              border: `1px solid ${filter === t ? C.oxblood : C.rule}`,
              cursor: 'pointer',
            }}>
              {t === 'all' ? 'All' : t} <span style={{ marginLeft: 4, opacity: 0.7 }}>{counts[t] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured discoveries */}
      {filter === 'all' && !query && (
        <div style={{ marginTop: 36 }}>
          <p style={{ fontFamily: FM, fontSize: 11, letterSpacing: '0.28em', color: C.oxblood, margin: 0 }}>⬦ THE DISCOVERIES ⬦</p>
          <p style={{ fontFamily: FD, fontStyle: 'italic', fontSize: 14, color: C.taupe, margin: '4px 0 18px' }}>Documents that rewrote the family story.</p>
          {featured.map((d, i) => (
            <article key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 360px) 1fr', gap: 24, padding: '20px 0', borderBottom: `1px solid ${C.rule}` }} className="featured-grid">
              <DocSlot kind={d.type} label={d.title.slice(0, 40)} source={d.src} h={220} />
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                  <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 32, color: C.oxblood, lineHeight: 1 }}>{d.year}</span>
                  <span style={{ fontFamily: FM, fontSize: 10, letterSpacing: '0.22em', color: C.taupe, textTransform: 'uppercase' }}>Featured · {d.type}</span>
                </div>
                <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 22, lineHeight: 1.15, color: C.ink, margin: '4px 0 12px' }}>{d.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: C.ink, margin: 0 }}>{d.note.slice(0, 360)}{d.note.length > 360 ? '…' : ''}</p>
              </div>
            </article>
          ))}
          <style>{`@media (max-width: 720px) { .featured-grid { grid-template-columns: 1fr !important; } }`}</style>
        </div>
      )}

      {/* Decade buckets */}
      <div style={{ marginTop: 36 }}>
        <p style={{ fontFamily: FM, fontSize: 11, letterSpacing: '0.28em', color: C.oxblood, margin: '0 0 14px' }}>THE FULL INDEX</p>
        {buckets.map(b => {
          const rows = docs.filter(d => d.year >= b.from && d.year <= b.to);
          if (!rows.length) return null;
          return (
            <section key={b.years} style={{ marginBottom: 28 }}>
              <header style={{ display: 'flex', alignItems: 'baseline', gap: 14, padding: '10px 0', borderBottom: `2px solid ${C.oxblood}`, marginBottom: 4, flexWrap: 'wrap' }}>
                <h3 style={{ fontFamily: FD, fontWeight: 900, fontSize: 24, color: C.ink, margin: 0, letterSpacing: '-0.01em' }}>{b.years}</h3>
                <p style={{ fontFamily: FD, fontStyle: 'italic', fontSize: 14, color: C.taupe, margin: 0 }}>{b.kicker}</p>
                <span style={{ marginLeft: 'auto', fontFamily: FM, fontSize: 10, letterSpacing: '0.18em', color: C.taupe }}>{rows.length} {rows.length === 1 ? 'DOCUMENT' : 'DOCUMENTS'}</span>
              </header>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {rows.map((d, i) => (
                    <tr key={i} style={{ borderBottom: `1px dashed ${C.rule}` }}>
                      <td style={{ padding: '10px 10px 10px 0', fontFamily: FM, fontSize: 11, color: C.oxblood, letterSpacing: '0.08em', verticalAlign: 'top', width: 60 }}>{d.year}</td>
                      <td style={{ padding: '10px 10px', verticalAlign: 'top' }}>
                        <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 14, color: C.ink, lineHeight: 1.3 }}>{d.title}</div>
                        <div style={{ fontFamily: FB, fontSize: 12, color: C.taupe, marginTop: 2, fontStyle: 'italic' }}>
                          {d.src}{d.citation ? <span style={{ fontFamily: FM, fontSize: 10, marginLeft: 8 }}>· ref {d.citation}</span> : null}
                        </div>
                        <div style={{ fontFamily: FB, fontSize: 13, color: C.inkSoft, marginTop: 4, lineHeight: 1.5 }}>
                          {d.note.length > 240 ? d.note.slice(0, 240) + '…' : d.note}
                        </div>
                      </td>
                      <td style={{ padding: '10px 0 10px 10px', verticalAlign: 'top', width: 110, textAlign: 'right' }}>
                        <span style={{ fontFamily: FM, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '3px 8px', border: `1px solid ${C.rule}`, color: C.taupe, whiteSpace: 'nowrap' }}>{d.type}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          );
        })}
      </div>
    </section>
  );
}

// ── Modal & inline renderer ────────────────────────────────────────────────
function Modal({ children, onClose }) {
  return (
    <div role="dialog" aria-modal="true" onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(42,31,26,0.55)', zIndex: 100,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 20, overflowY: 'auto',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.cream, border: `2px solid ${C.oxblood}`, padding: '28px 28px 32px', maxWidth: 720, width: '100%',
        maxHeight: 'calc(100vh - 40px)', overflowY: 'auto', position: 'relative',
        boxShadow: '0 30px 60px rgba(42,31,26,0.3)',
      }}>
        <button onClick={onClose} aria-label="Close" style={{
          position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer', color: C.taupe,
        }}>
          <X size={22} />
        </button>
        {children}
      </div>
    </div>
  );
}

function renderInline(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      urlRegex.lastIndex = 0;
      return <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: C.oxblood, textDecoration: 'underline', wordBreak: 'break-all' }}>{part}</a>;
    }
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((bp, j) => bp.startsWith('**') && bp.endsWith('**')
      ? <strong key={`${i}-${j}`}>{bp.slice(2, -2)}</strong>
      : <React.Fragment key={`${i}-${j}`}>{bp}</React.Fragment>);
  });
}

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.rule}`, marginTop: 48, padding: '32px 24px 22px', textAlign: 'center', fontFamily: FM, fontSize: 11, letterSpacing: '0.15em', color: C.taupe, lineHeight: 1.8 }}>
      <div style={{ marginBottom: 8, fontFamily: FD, fontStyle: 'italic', fontSize: 16, letterSpacing: 0, color: C.oxblood }}>
        — Compiled with love and a paper trail —
      </div>
      <div>An archive of Patrick Gavan Duffy · 1880–1954</div>
      <div style={{ marginTop: 6, opacity: 0.7 }}>Last updated May 2026</div>
    </footer>
  );
}

// ── Archive data — one per source ──────────────────────────────────────────
function archiveData() {
  return ARCHIVE;
}

const ARCHIVE = [
  { year: 1851, type: 'Newspaper', title: 'Fashionable Intelligence — Arrivals at Dalkey', src: "Freeman's Journal, 6 June 1851", note: 'Earliest known mention of Queenstown Castle.' },
  { year: 1870, type: 'Newspaper', title: 'Fatal Accident to the Irish Mail Train — Tamworth', src: "Freeman's Journal, 15 Sep 1870", note: 'The Tamworth crash. "Thomas Duffey, of Dublin" listed among the injured.' },
  { year: 1870, type: 'Newspaper', title: 'Tamworth Inquest — Verdict of Manslaughter', src: 'Drogheda Conservative, 1 Oct 1870', note: 'Manslaughter verdict against the pointsman, establishing LNWR liability.' },
  { year: 1875, type: 'BMD', title: 'Marriage cert — Thomas Duffy & Mary Flynn', src: "St Kevin's, Dublin", note: 'Married 24 November 1875. Thomas already styled "draper of Thomas Street" eight years before the 1883 founding date.' },
  { year: 1880, type: 'Church', title: 'Baptism — Patritius Joran Duffy', src: "St Catherine's RC, Meath St", citation: 'DU-RC-BA-505126', note: 'Baptised January 1880. The "Joran" is almost certainly an indexer’s misreading of "Gavan" in cursive Latin.' },
  { year: 1880, type: 'BMD', title: 'Marriage — Benjamin Byrne & Catherine Whelan', src: "St Canice's, Kilkenny", citation: '8036271', note: 'Mary Catherine’s parents.' },
  { year: 1881, type: 'BMD', title: 'Birth cert — Patrick Gavan Duffy', src: 'GRO', citation: '1590441', note: 'Civil registration filed 1881 of a child born late 1879 / January 1880.' },
  { year: 1901, type: 'Census', title: 'Irish Census — Duffy family at 44 Thomas St', src: 'NAI', note: 'Thomas (56), Mary (45), Gavan (20), Lillie, Thomas Jr, John, plus aunt Lizzie and six drapery assistants.' },
  { year: 1903, type: 'Migration', title: 'SS Parisian outbound passenger manifest', src: 'Library & Archives Canada', note: 'Patrick Duffy, 23, junior draper, Dublin, Calgary. Second cabin.' },
  { year: 1903, type: 'Newspaper', title: 'SS Parisian arrival — Quebec, 23 May', src: 'Montreal Gazette, 25 May 1903', note: '"Steamship Parisian arrived at 3 p.m. Saturday."' },
  { year: 1903, type: 'BMD', title: "Death cert — Mary Duffy (Gavan's mother)", src: 'GRO', citation: '4594706', note: 'Died 30 May 1903 at 44 Thomas Street, angina pectoris, three hours.' },
  { year: 1907, type: 'Newspaper', title: 'Calgary Herald — "Variegated Jags" police court column', src: 'Calgary Herald, 14 Aug 1907', note: 'A possible trace: a Patrick Duffy fined $3.50 for being drunk in public.' },
  { year: 1908, type: 'Newspaper', title: 'Auction of Springfield House & Queenstown Castle', src: 'Irish Independent, 9 Jul 1908', note: 'Re J. Milo Burke, Esq., J.P., D.L., Deceased.' },
  { year: 1909, type: 'Newspaper', title: 'Auction of contents of Queenstown Castle', src: 'Irish Independent, 11 Mar 1909', note: 'Dispersal of Milo Burke’s effects.' },
  { year: 1910, type: 'Migration', title: 'SS Campania return manifest (BT26)', src: 'TNA Kew', citation: 'Ancestry coll. 1518', note: 'Third class, "Storekeeper", 14 April 1910 Liverpool arrival.' },
  { year: 1911, type: 'Census', title: 'Irish Census — Duffy family, 44 Thomas St', src: 'NAI', note: 'Thomas (64, Magistrate). Gavan (30, back from Alberta). Thomas B (28). Aloysius (21, Visitor). Lily (27).' },
  { year: 1911, type: 'Census', title: 'Irish Census — Byrne family, Mountain View Terrace', src: 'NAI', note: 'Mary Kate Byrne, draperess, aged 19.' },
  { year: 1911, type: 'Census', title: 'Irish Census — Condon family, Kilmainham', src: 'NAI', note: 'John Patrick Condon (47, Barrister). Kathleen aged 10. Eight children at home.' },
  { year: 1912, type: 'BMD', title: 'Marriage — P.G. Duffy & Mary Catherine Byrne', src: 'GRO', citation: '5606871', note: 'Golden Bridge, Inchicore, 4 Sep 1912.' },
  { year: 1913, type: 'BMD', title: 'Birth — Thomas Joseph Duffy (signed "Gavan Duffy")', src: 'GRO', note: '25 Jun 1913, 66 South Circular Road.' },
  { year: 1916, type: 'BMD', title: 'Birth — Gladys May Duffy, ten days before the Rising', src: 'GRO', citation: '1555061', note: '14 Apr 1916, 66 St Michael’s Terrace.' },
  { year: 1917, type: 'BMD', title: 'Death cert — Thomas Joseph Duffy (founder)', src: 'GRO, Clontarf/Howth', note: 'Died 13 May 1917 at Tudor House, Clontarf. Myocarditis. Informant Gavan, present at death.' },
  { year: 1917, type: 'Probate', title: 'Probate — Thomas Joseph Duffy, £2,197', src: 'NAI Calendar of Wills', note: 'Executors: Patrick G. Duffy, Thomas B. Duffy, Rev John A. Duffy R.C.C.' },
  { year: 1919, type: 'BMD', title: 'Death cert — Catherine "Mary Kate" Duffy', src: 'GRO', citation: '4417657', note: 'Tudor House, Clontarf, 28 Feb 1919. Influenza, broncho-pneumonia. Informant Gavan, husband.' },
  { year: 1920, type: 'BMD', title: 'Marriage — P.G. Duffy & Kathleen Condon', src: "St Joseph's, Crumlin", note: '15 Sep 1920. Officiant Fr John A. Duffy OSA.' },
  { year: 1923, type: 'BMD', title: 'Birth — Olga Duffy', src: 'GRO', citation: '1474688', note: '30 Mar 1923, 36 Upper Mount Street nursing home. Home Queenstown Castle, Dalkey.' },
  { year: 1923, type: 'Newspaper', title: 'Birth notice — Olga Duffy', src: "Freeman's Journal, 30 Mar 1923", note: '"At Maglona, 36 Upper Mount street, the wife of Gavan Duffy, Queenstown Castle, Dalkey — a daughter."' },
  { year: 1925, type: 'Newspaper', title: 'Queenstown Castle sale notice', src: 'Irish Independent, 11 Jul 1925', note: 'Battersby & Co auction. Gavan advertised the house for auction in July 1925.' },
  { year: 1926, type: 'Census', title: 'Irish Free State Census — Newtownsmith, Dún Laoghaire', src: 'NAI', note: 'Gavan (44), Kathleen, Thomas, Gladys, Olga + servant Maud Brownson.' },
  { year: 1926, type: 'Census', title: 'Irish Free State Census — Thomas B. Duffy at Clontarf', src: 'NAI', note: 'Thomas B (40y6m), Sara (b. Co Cork), Thomas Jr, Freda, Laura + servant.' },
  { year: 1926, type: 'Census', title: 'Irish Free State Census — Condon family, Terenure', src: 'NAI', note: 'John Patrick Clerk and Superintendent Registrar of the Dublin Union, James’s Street.' },
  { year: 1931, type: 'Newspaper', title: 'Laguna Queens Publicity Ball — prize list', src: 'Irish Independent, 7 Feb 1931', note: 'Miss Condon of Queenstown Castle wins prize donated by a Duffy & Son of Thomas Street.' },
  { year: 1934, type: 'Newspaper', title: 'Partnership Suit: Tobacco-Growing Enterprise', src: 'Irish Press, 16 Jan 1934', note: 'Francis Condon "had grown tobacco in Canada". Confirms his Canadian agricultural years.' },
  { year: 1936, type: 'Newspaper', title: 'Death notices & obituary — John Patrick Condon', src: 'Irish Press, 27 Jan 1936', note: '"As a boy he was taught by the late Mr. Michael Cusack, founder of the G.A.A."' },
  { year: 1936, type: 'Probate', title: 'Statutory Notice to Creditors — John Patrick Condon', src: 'Irish Press, 10 Mar 1936', note: 'Probate granted 28 February 1936.' },
  { year: 1939, type: 'Newspaper', title: 'Pub licence transfer application', src: 'Irish Independent', note: '45/46 Thomas Street seven-day licence.' },
  { year: 1941, type: 'BMD', title: 'Marriage — Francis Condon & Teresa Roche', src: 'GRO', note: 'Blackrock, 2 Jul 1941. Confirms Condons took Queenstown Castle on after Gavan vacated.' },
  { year: 1941, type: 'Newspaper', title: 'Dublin Traders on Lottery Charge', src: 'Irish Press, 10 Oct 1941', note: 'Gavan among eight Thomas Street traders charged.' },
  { year: 1943, type: 'Newspaper', title: 'Queenstown Castle sold by private treaty', src: 'Irish Press, 31 Jul 1943', note: 'Albert MacArthur sale.' },
  { year: 1946, type: 'Newspaper', title: 'Queenstown Castle sold at auction for £4,350', src: 'Irish Press, 30 Nov 1946', note: 'Coliemore Road, Dalkey.' },
  { year: 1947, type: 'Newspaper', title: 'Queenstown Castle Hotel — excise licence application', src: 'Irish Independent, 20 Sep 1947', note: 'House converted to hotel under Martha Carney.' },
  { year: 1948, type: 'Newspaper', title: '"Alma", 3 Tubbermore Ave., Dalkey — Nursing classified', src: 'Irish Independent, 31 Aug 1948', note: 'Delia Tierney advertising her private nursing home, six years before she became informant at Gavan’s death.' },
  { year: 1954, type: 'BMD', title: 'Death cert — Patrick Gavan Duffy', src: 'GRO', citation: '4164986', note: 'Undercliffe, Killiney. Informant Delia Tierney, SRN SCM.' },
  { year: 1954, type: 'Newspaper', title: 'Obituary & funeral notice', src: 'Irish Independent & Irish Press', note: 'Buried Deansgrange. Mourners include Liam Cosgrave TD.' },
  { year: 1958, type: 'Newspaper', title: "Duffy's of Thomas Street: 75th Anniversary feature", src: 'Irish Independent, 25 Mar 1958', note: 'Full history of the firm.' },
  { year: 1965, type: 'Business', title: 'Gavan Duffy, Limited dissolved', src: 'CRO CORE', citation: 'Reg. No. 13000', note: 'Effective 20 April 1965.' },
  { year: 1984, type: 'Newspaper', title: 'Death notice — Kathleen Duffy', src: 'Evening Herald', note: 'Sacred Heart Hospital, Mullingar. Buried Collinstown Cemetery, Westmeath.' },
];
