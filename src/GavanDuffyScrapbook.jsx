import React, { useState, useEffect } from 'react';
import { Scroll, Users, Compass, Heart, Home, Building2, FileText, ChevronRight, X, MapPin, Calendar, Ship, Scissors } from 'lucide-react';

export default function GavanDuffyScrapbook() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Fonts are loaded directly in index.html so the typography is in place before paint.

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Scroll },
    { id: 'family', label: 'Family', icon: Users },
    { id: 'canada', label: 'Canada', icon: Compass },
    { id: 'women', label: 'The Women', icon: Heart },
    { id: 'places', label: 'Places', icon: Home },
    { id: 'shop', label: 'The Shop', icon: Building2 },
    { id: 'archive', label: 'Archive', icon: FileText },
  ];

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
      desc: 'The last house. Not a suburban villa but a piece of serious Victorian architecture: designed 1861 by **Deane and Woodward**, the same firm behind the Kildare Street Club, the Museum Building at Trinity College Dublin, and the Oxford Museum. Benjamin Woodward himself, the Ruskinian half of the partnership, drew Undercliff as one of his last works before his early death. The first lease was registered on 13 February 1861 for Francis Robinson, and the Killiney History Society calls Undercliff "undoubtedly Woodward\'s work and the apparent prototype" from which the neighbouring houses on Strathmore Road were derived. L-shaped plan, triangular porch, **two turrets** (one containing the secondary staircase with a triangular dormer, the other on the garden side wrapped in first-floor balconies), a triangular fanlight over the front door, granite architrave in the style of the Kildare Street Club, triple-arched dining-room windows with tall shafts, naturalistically carved stone capitals. Three acres of grounds, a gate lodge, a walled kitchen garden and a tennis court. **Bono lives a few doors away today; Strathmore, the mansion opposite, was for decades the Canadian ambassador\'s residence.** Gavan, who grew up above a shop in the Liberties and sailed steerage to Canada as a ranch hand at 22, bought his way into this in his late sixties. He lived at Undercliff no more than five or six years before he died there on 19 June 1954. He was attended at the end by **Delia Tierney, SRN SCM**, a State Registered Nurse and State Certified Midwife who ran a small private nursing home at "Alma", 3 Tubbermore Avenue, Dalkey, less than two miles away. She had been in practice there since at least 1948, and was evidently engaged to nurse Gavan at home through his final illness. She was the informant on his death cert. Kathleen put the house on the auction market five months later, November 1954. The 1948 auction advert shows the lease still had 408 years to run at £26 a year.\n\n**References:** Killiney History Society page on Undercliff — https://killineyhistory.ie/undercliff/ — includes a photograph of the house c.1997, an 1888 hand-drawn Ordnance Survey map detail showing the site, and a clipping from the **Freeman\'s Journal, Thursday 9 June 1887**. The clipping turned out NOT to be a property notice but a small classified for the sale of a carriage placed by the then-occupant: *"CARRIAGE; for Sale a canoe-shaped Open Carriage, very light and in good order, built by H F Brown and Co, of Redmond\'s hill. Apply C B Undercliffe, Killiney, where it can be seen."* Useful inadvertently because it identifies the 1887 occupant by initials only — **C.B.** — bridging the gap between Francis Robinson (the 1861 lessee) and A. Malcolm (the 1937 owner) by one resident still to be named. The advert image is here: https://killineyhistory.ie/wp-content/uploads/2021/07/The_Freeman_s_Journal_Thu__Jun_9__1887_-1024x173.jpg',
    },
    calgary: {
      name: 'Calgary & Southern Alberta',
      era: '1903–c.1910',
      desc: 'A frontier cattle town of 4,400 people when Gavan arrived off the CPR train in 1903. Surrounded by the great ranches — Bar U, Cochrane, Walrond, Oxley, Quorn. Seven years here, working as a ranch hand. He came home with stories, bow legs, and probably a pair of boots.',
    },
  };

  // Timeline tone colours: birth (sage), death (slate, recurring motif), love (rose),
  // business (gold), travel (deep teal), work (taupe), home (warm earth), scandal (rust).
  const toneColour = (t) => ({
    birth: '#4a5d3a', death: '#4a3a3f', love: '#a86b6b',
    business: '#b08d3f', travel: '#2f4858', work: '#6b5137',
    home: '#5d4e3a', scandal: '#8b4513', family: '#6b4a3a',
  }[t] || '#3d2817');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f4ebd8 0%, #ebe0c8 100%)',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0.2 0 0 0 0 0.15 0 0 0 0 0.1 0 0 0 0.08 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)'/%3E%3C/svg%3E"), linear-gradient(180deg, #f4ebd8 0%, #ebe0c8 100%)`,
      fontFamily: "'EB Garamond', Georgia, serif",
      color: '#2a1f1a',
    }}>
      {/* Header */}
      <header style={{ borderBottom: '2px double #7a3b2e', padding: '2rem 1.25rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#7a3b2e', margin: 0 }}>
          An Archive of the Life of
        </p>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 900,
          fontSize: 'clamp(2.2rem, 7vw, 3.5rem)',
          margin: '0.3rem 0 0.2rem',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          color: '#2a1f1a',
        }}>
          Patrick Gavan Duffy
        </h1>
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '1rem', margin: 0, color: '#7a3b2e' }}>
          Draper of Thomas Street &middot; 1880 — 1954
        </p>
        {/* Drapery motif: thread-and-button. The button at the centre has four thread holes;
            the curves on either side suggest thread feeding through it. A nod to four generations of drapers. */}
        <svg viewBox="0 0 220 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: 'block', margin: '1rem auto 0', width: 'min(220px, 65vw)', height: 'auto' }}>
          <path d="M2,12 Q40,5 80,12 T100,12" stroke="#7a3b2e" strokeWidth="0.8" fill="none" />
          <path d="M218,12 Q180,19 140,12 T120,12" stroke="#7a3b2e" strokeWidth="0.8" fill="none" />
          <circle cx="110" cy="12" r="6" fill="#f4ebd8" stroke="#7a3b2e" strokeWidth="0.9" />
          <circle cx="110" cy="12" r="4.4" fill="none" stroke="#7a3b2e" strokeWidth="0.4" />
          <circle cx="107.5" cy="9.5" r="0.6" fill="#7a3b2e" />
          <circle cx="112.5" cy="9.5" r="0.6" fill="#7a3b2e" />
          <circle cx="107.5" cy="14.5" r="0.6" fill="#7a3b2e" />
          <circle cx="112.5" cy="14.5" r="0.6" fill="#7a3b2e" />
        </svg>
      </header>

      {/* Tab strip */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(244, 235, 216, 0.96)',
        backdropFilter: 'blur(6px)',
        borderBottom: '1px solid #8b6f47',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        <div style={{ display: 'flex', gap: '0', padding: '0.5rem 0.5rem', minWidth: 'max-content' }}>
          {tabs.map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.6rem 0.9rem',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '0.95rem',
                  fontStyle: active ? 'normal' : 'italic',
                  fontWeight: active ? 700 : 400,
                  background: 'transparent',
                  border: 'none',
                  color: active ? '#7a3b2e' : '#6b5137',
                  borderBottom: active ? '2px solid #7a3b2e' : '2px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>
      </nav>

      <main style={{ maxWidth: '780px', margin: '0 auto', padding: '1.5rem 1.25rem 4rem' }}>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ textAlign: 'center', margin: '1rem 0 2rem' }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '1.15rem', lineHeight: 1.6, color: '#3d2817' }}>
                "Any fool can make money,<br/>but it takes a wise man to keep it."
              </p>
              <p style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: '#7a3b2e', marginTop: '0.5rem' }}>
                — A FAVOURITE SAYING OF HIS FATHER
              </p>
            </div>

            <section style={{ background: 'rgba(255,255,255,0.4)', border: '1px solid #c4a77d', padding: '1.5rem', marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.5rem', marginTop: 0, marginBottom: '0.8rem', color: '#7a3b2e' }}>
                The Man
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, margin: '0 0 0.9rem' }}>
                Born in Dublin in 1880 to the founder of one of the best-known drapery shops in the city, baptised Patritius Joran Duffy at St Catherine&apos;s, Meath Street, that January. Grew up above the shop at 44 Thomas Street. At the age of twenty-three, boarded the SS Parisian for Canada and spent seven years working as a ranch hand in Alberta before returning to the family trade.
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, margin: '0 0 0.9rem' }}>
                Married a draper's assistant in 1912, had two children, lost her to the 1919 flu, remarried an eighteen-year-old barrister's daughter in 1920, and had two more. Raised the second family between grand coastal houses in Dalkey, Dún Laoghaire and Killiney.
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                Ran Duffy's of Thomas Street for nearly forty years, building it from a single-door shop into a five-building department store with his own name over it by the end. Up in court once on a lottery charge. A future Taoiseach came to his funeral.
              </p>
            </section>

            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.5rem', marginBottom: '1rem', color: '#7a3b2e', borderBottom: '1px solid #c4a77d', paddingBottom: '0.4rem' }}>
              A Life in Events
            </h2>

            <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
              {/* Stitched seam down the timeline gutter, in lieu of a plain rule. A drapery touch. */}
              <div style={{
                position: 'absolute',
                left: '0.45rem',
                top: '0.5rem',
                bottom: '0.5rem',
                width: '1px',
                backgroundImage: 'linear-gradient(to bottom, #8b6f47 0, #8b6f47 4px, transparent 4px, transparent 8px)',
                backgroundSize: '1px 8px',
              }} />
              {timeline.map((e, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: '1.2rem' }}>
                  <div style={{
                    position: 'absolute', left: '-1.5rem', top: '0.35rem',
                    width: '0.9rem', height: '0.9rem', borderRadius: '50%',
                    background: toneColour(e.tone),
                    border: '2px solid #f4ebd8',
                    boxShadow: '0 0 0 1px ' + toneColour(e.tone),
                  }} />
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em', color: toneColour(e.tone) }}>
                    {e.year}
                  </div>
                  <div style={{ fontSize: '1rem', lineHeight: 1.5, color: '#2a1f1a' }}>
                    {e.event}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAMILY */}
        {activeTab === 'family' && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.6rem', marginTop: '0.5rem', marginBottom: '0.3rem', color: '#7a3b2e' }}>
              The Duffy Family
            </h2>
            <p style={{ fontStyle: 'italic', color: '#6b5137', marginTop: 0, marginBottom: '1rem', fontSize: '0.95rem' }}>
              Tap any name to read more.
            </p>

            <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#3d2817', marginBottom: '1.5rem' }}>
              Three generations of Dublin drapers, marrying milliners and barristers&apos; daughters, raising priests and nuns and Adelaide emigrants between the famine and the Free State.
            </p>

            {/* Founder and his wife */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <PersonCard person="thomas_sr" people={people} onClick={setSelectedPerson} featured />
              <PersonCard person="mary_duffy" people={people} onClick={setSelectedPerson} featured />
            </div>

            {/* Thomas Sr's unmarried sister */}
            <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#6b5137', margin: '1rem 0 0.4rem', textAlign: 'center' }}>
              Thomas's sister, in the household
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', maxWidth: '260px', margin: '0 auto' }}>
              <PersonCard person="lizzie" people={people} onClick={setSelectedPerson} small faded />
            </div>

            <Connector />

            {/* Gavan and his siblings */}
            <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#6b5137', margin: '0.5rem 0 0.4rem', textAlign: 'center' }}>
              Six children, four to adulthood
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <PersonCard person="gavan" people={people} onClick={setSelectedPerson} featured />
              <PersonCard person="thomas_b" people={people} onClick={setSelectedPerson} />
              <PersonCard person="lily" people={people} onClick={setSelectedPerson} small />
              <PersonCard person="john_duffy" people={people} onClick={setSelectedPerson} small />
              <PersonCard person="aloysius" people={people} onClick={setSelectedPerson} small />
            </div>

            <Connector />

            {/* Two wives side by side */}
            <div style={{ textAlign: 'center', marginBottom: '0.5rem', fontFamily: "'Special Elite', monospace", fontSize: '0.65rem', letterSpacing: '0.25em', color: '#7a3b2e' }}>
              ⬦ MARRIED TWICE ⬦
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <PersonCard person="mary_catherine" people={people} onClick={setSelectedPerson} tint="#f3d9d9" />
              <PersonCard person="kathleen" people={people} onClick={setSelectedPerson} tint="#e6ead8" />
            </div>

            <Connector />

            <div style={{ textAlign: 'center', marginBottom: '0.5rem', fontFamily: "'Special Elite', monospace", fontSize: '0.65rem', letterSpacing: '0.25em', color: '#7a3b2e' }}>
              ⬦ FOUR CHILDREN ⬦
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <PersonCard person="thomas_jr" people={people} onClick={setSelectedPerson} tint="#f3d9d9" small />
              <PersonCard person="gladys" people={people} onClick={setSelectedPerson} tint="#f3d9d9" small />
              <PersonCard person="olga" people={people} onClick={setSelectedPerson} tint="#e6ead8" small highlight />
              <PersonCard person="george" people={people} onClick={setSelectedPerson} tint="#e6ead8" small />
            </div>

            <div style={{ marginTop: '2.5rem', borderTop: '1px dashed #8b6f47', paddingTop: '1.5rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.2rem', color: '#7a3b2e' }}>
                Mary Catherine's Line
              </h3>
              <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#6b5137', marginTop: 0 }}>
                Policemen and a river pilot. The rural Irish line.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <PersonCard person="benjamin" people={people} onClick={setSelectedPerson} small />
                <PersonCard person="catherine_whelan" people={people} onClick={setSelectedPerson} small />
                <PersonCard person="john_byrne" people={people} onClick={setSelectedPerson} small faded />
                <PersonCard person="martin_whelan" people={people} onClick={setSelectedPerson} small faded />
              </div>
            </div>

            <div style={{ marginTop: '2rem', borderTop: '1px dashed #8b6f47', paddingTop: '1.5rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.2rem', color: '#7a3b2e' }}>
                Kathleen's Line
              </h3>
              <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#6b5137', marginTop: 0 }}>
                A Meath barrister, a Carlow mother, ten children.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <PersonCard person="john_condon" people={people} onClick={setSelectedPerson} small />
                <PersonCard person="anna_mary" people={people} onClick={setSelectedPerson} small />
              </div>
              <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#6b5137', marginTop: '1rem', marginBottom: '0.4rem' }}>
                Kathleen's siblings
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <PersonCard person="eileen_condon" people={people} onClick={setSelectedPerson} small />
                <PersonCard person="francis_condon" people={people} onClick={setSelectedPerson} small />
                <PersonCard person="other_condons" people={people} onClick={setSelectedPerson} small faded />
              </div>
            </div>
          </div>
        )}

        {/* CANADA */}
        {activeTab === 'canada' && (
          <div>
            <div style={{
              background: 'linear-gradient(135deg, #2f4858 0%, #1a2f3a 100%)',
              color: '#f4ebd8',
              padding: '2rem 1.5rem',
              marginBottom: '1.5rem',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <Ship size={100} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.08 }} />
              <p style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.65rem', letterSpacing: '0.25em', opacity: 0.7, margin: 0 }}>
                THE CROSSING
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '2rem', margin: '0.3rem 0 0.2rem', lineHeight: 1 }}>
                SS Parisian
              </h2>
              <p style={{ fontStyle: 'italic', fontSize: '1rem', opacity: 0.85, margin: 0 }}>
                Allan Line &middot; Liverpool → Quebec &middot; May 1903
              </p>
            </div>

            <section style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.3rem', color: '#7a3b2e' }}>
                The Ship
              </h3>
              <p style={{ lineHeight: 1.7 }}>
                Built in 1881 by R. Napier and Sons of Glasgow. 5,395 tons, 441 feet long, steel hulled, single-screw. She was briefly the largest steel steamer afloat and the first Atlantic liner fitted with bilge keels. By 1902 the Marconi Company had installed wireless telegraphy; in 1899 she'd been re-engined. When Gavan boarded her, she was a freshly-refitted, 22-year-old ship at the top of her game.
              </p>
              <p style={{ lineHeight: 1.7 }}>
                Two years after his voyage, in March 1905, she was rammed and sunk in Halifax harbour by the German steamer Albano. She settled on the bottom at pier 2 in shallow water, was raised and repaired, and served another nine years. On the night of 14 April 1912 she was in wireless contact with the Titanic, relaying ice warnings. She was scrapped in Italy in 1914.
              </p>
              <p style={{ lineHeight: 1.7, fontSize: '0.88rem', fontStyle: 'italic', color: '#6b5137', borderLeft: '2px solid #c4a77d', paddingLeft: '0.8rem' }}>
                Photographs of the Parisian survive in several collections. The National Museums Liverpool hold a dockside photograph from her Allan Line years. The Norway Heritage collection and Heritage-Ships image archive both carry broadside views. The Maine Memory Network has a c.1890 photograph of her at Portland, Maine, one of her regular ports. When Gavan walked up her gangway at Liverpool on 15 May 1903 she looked much as she does in these photographs: black hull, white superstructure, two tall buff funnels with black tops, and four masts still carrying vestigial sail rigging from her early years.
              </p>
            </section>

            <section style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid #c4a77d', padding: '1.2rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.1rem', color: '#7a3b2e', marginTop: 0 }}>
                The Manifest Entry
              </h3>
              <table style={{ width: '100%', fontSize: '0.95rem', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    ['Name', 'Patrick Duffy'],
                    ['Age', '23 years'],
                    ['Occupation', 'Junior draper'],
                    ['Place of birth', 'Dublin'],
                    ['Ship', 'SS Parisian'],
                    ['Port of arrival', 'Quebec'],
                    ['Date', 'May 1903'],
                    ['Class', 'Second cabin'],
                    ['Ultimate destination', 'Calgary'],
                  ].map(([k, v], i) => (
                    <tr key={i} style={{ borderBottom: i < 8 ? '1px dashed #c4a77d' : 'none' }}>
                      <td style={{ padding: '0.4rem 0.5rem 0.4rem 0', fontFamily: "'Special Elite', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', color: '#7a3b2e', verticalAlign: 'top', width: '45%' }}>{k.toUpperCase()}</td>
                      <td style={{ padding: '0.4rem 0' }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.3rem', color: '#7a3b2e' }}>
                Calgary, 1903
              </h3>
              <p style={{ lineHeight: 1.7 }}>
                A frontier cattle town of about 4,400 people. A stop on the Canadian Pacific Railway, gateway to the great Alberta ranching country. The big ranches were on its doorstep: <em>Bar U, Cochrane, Walrond, Oxley, Quorn, A7</em>. A 22-year-old junior draper from Dublin did not buy a ticket to Calgary in 1903 to work in drapery. There were no drapery jobs there. He went to work cattle.
              </p>
              <p style={{ lineHeight: 1.7 }}>
                The family firm confirmed it in the 1958 seventy-fifth anniversary feature: <em>"Patrick Gavan Duffy had spent his youth travelling extensively. He worked for a while as a cowboy on a Canadian ranch."</em> He was there for seven years before returning to Dublin, where he appears on the April 1911 census back at home, aged 29, a draper's assistant once more.
              </p>
            </section>

            <section style={{ borderLeft: '3px solid #b08d3f', paddingLeft: '1rem', fontStyle: 'italic', color: '#5d4e3a' }}>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                In 1891, Harry Longabaugh was a horse breaker at the Bar U ranch, before he became better known as the Sundance Kid. If Gavan worked at the Bar U, he was on the same ranch twelve years after him.
              </p>
            </section>

            <section style={{ background: 'rgba(122, 59, 46, 0.06)', border: '1px solid #a86b6b', padding: '1.2rem', marginTop: '2rem', marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.65rem', letterSpacing: '0.25em', color: '#7a3b2e', margin: 0 }}>
                A POSSIBLE TRACE
              </p>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.3rem', color: '#7a3b2e', margin: '0.3rem 0 0.6rem' }}>
                Variegated Jags, Calgary 1907
              </h3>
              <p style={{ lineHeight: 1.7 }}>
                The <em>Calgary Herald</em> of <strong>Wednesday 14 August 1907</strong>, page 1, ran a column called <em>"Variegated Jags &mdash; Mixed Bunch Greeted Court &mdash; Some Came in Rigs and Some Had Price"</em>: a slightly arch round-up of the morning's drunkenness arraignments before Magistrate Smith. One of the named was a <strong>Patrick Duffy</strong>, who <em>"admitted he had more than he could comfortably navigate with and handed over $3.50"</em>. He sits between Montgomery Bell, fined five dollars for imbibing too freely, and Thomas Price, who claimed not to remember a thing.
              </p>
              <p style={{ lineHeight: 1.7 }}>
                It is the <strong>only</strong> Patrick Duffy mention in the entire <em>Calgary Herald</em> across 1903 to 1910. The date sits squarely in his Alberta years, he was twenty-six, the right age for a young cowboy in town to spend his pay, and Calgary in mid-August was the late-summer round-up break when ranch hands came in to do exactly that. The match is plausible, not certain. There is no occupation, address or further identifier in the column. We can never prove it was him from this single line; we can only say that no other Patrick Duffy appears in Calgary's paper of record across his seven Alberta years, and that this one fits.
              </p>
            </section>

            <div style={{
              background: 'linear-gradient(135deg, #2f4858 0%, #1a2f3a 100%)',
              color: '#f4ebd8',
              padding: '2rem 1.5rem',
              marginTop: '2rem',
              marginBottom: '1.5rem',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <Ship size={100} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.08 }} />
              <p style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.65rem', letterSpacing: '0.25em', opacity: 0.7, margin: 0 }}>
                THE RETURN
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '2rem', margin: '0.3rem 0 0.2rem', lineHeight: 1 }}>
                SS Campania
              </h2>
              <p style={{ fontStyle: 'italic', fontSize: '1rem', opacity: 0.85, margin: 0 }}>
                Cunard Line &middot; New York &rarr; Liverpool &middot; 14 April 1910
              </p>
            </div>

            <section style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.3rem', color: '#7a3b2e' }}>
                The Ship Home
              </h3>
              <p style={{ lineHeight: 1.7 }}>
                After almost seven years on the prairies, Gavan came home not on the slow Allan Line that had taken him out, but on Cunard's flagship express service. The <strong>RMS Campania</strong>, twin-screw, 12,950 tons, two enormous funnels, was one of the fastest liners on the North Atlantic in her day. She had won the Blue Riband in 1893, and even at seventeen years old in 1910 she still made the New York to Liverpool crossing in just under six days.
              </p>
              <p style={{ lineHeight: 1.7 }}>
                He travelled in third class, as a single Irish adult, and gave his occupation as <strong>"Storekeeper"</strong> &mdash; not "draper", not "ranch hand". A reasonable description from a man returning to take over a family shop, and a hint that the seven Alberta years had not been one continuous stretch of cattle work. He had bought a ticket on Cunard's express service, not steerage on a slow boat: he had savings and he was in a hurry.
              </p>
              <p style={{ lineHeight: 1.7 }}>
                From New York to Calgary by Canadian Pacific train was four nights. Whether he came south through Montana on a US line or east to Montreal and then down through New England we may never know &mdash; the US border crossing record exists in the St Albans Lists but is locked behind a US-records subscription tier. Either way, by mid-April 1910 he was off the Cunarder at the Princes Landing Stage, Liverpool, with the night boat to Dublin a short walk away.
              </p>
            </section>

            <section style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid #c4a77d', padding: '1.2rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.1rem', color: '#7a3b2e', marginTop: 0 }}>
                The Return Manifest Entry
              </h3>
              <table style={{ width: '100%', fontSize: '0.95rem', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    ['Name', 'Patrick Duffy'],
                    ['Class', 'Third'],
                    ['Profession, Occupation or Calling', 'Storekeeper'],
                    ['Ethnic column', 'Irish, adult, single'],
                    ['Ship', 'SS Campania (Cunard, official no. 102086)'],
                    ['Port of departure', 'New York'],
                    ['Port of arrival', 'Liverpool'],
                    ['Date', '14 April 1910'],
                  ].map(([k, v], i) => (
                    <tr key={i} style={{ borderBottom: i < 7 ? '1px dashed #c4a77d' : 'none' }}>
                      <td style={{ padding: '0.4rem 0.5rem 0.4rem 0', fontFamily: "'Special Elite', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', color: '#7a3b2e', verticalAlign: 'top', width: '45%' }}>{k.toUpperCase()}</td>
                      <td style={{ padding: '0.4rem 0' }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ lineHeight: 1.6, fontSize: '0.85rem', color: '#6b5137', fontStyle: 'italic', margin: '0.8rem 0 0' }}>
                Source: UK and Ireland, Incoming Passenger Lists, 1878-1960 (BT26), April 1910 Liverpool arrivals, image 88 of 297. The National Archives, Kew, via Ancestry collection 1518, record 29534914.
              </p>
            </section>

            <section style={{ borderLeft: '3px solid #b08d3f', paddingLeft: '1rem', fontStyle: 'italic', color: '#5d4e3a', marginBottom: '1rem' }}>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                Out on the SS Parisian, Allan Line, second cabin, junior draper, May 1903. Home on the SS Campania, Cunard, third class, storekeeper, April 1910. The round trip is closed. He was not yet twenty-nine.
              </p>
            </section>
          </div>
        )}

        {/* WOMEN */}
        {activeTab === 'women' && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.6rem', marginTop: '0.5rem', color: '#7a3b2e' }}>
              The Two Wives
            </h2>

            <article style={{ background: 'linear-gradient(180deg, #f3d9d9 0%, #ead0d0 100%)', padding: '1.5rem', marginTop: '1.5rem', border: '1px solid #a86b6b' }}>
              <p style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.65rem', letterSpacing: '0.25em', color: '#7a3b2e', margin: 0 }}>
                THE FIRST WIFE
              </p>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.6rem', margin: '0.2rem 0 0.1rem', color: '#4a1a1a' }}>
                Mary Catherine Byrne
              </h3>
              <p style={{ fontStyle: 'italic', margin: '0 0 1rem', color: '#7a3b2e' }}>c.1892 – 28 February 1919</p>
              <p style={{ lineHeight: 1.7, margin: '0 0 0.8rem' }}>
                <strong>Mary Kate</strong>, as she was known on the 1911 census, was a draper's assistant herself — listed simply as "draperess", aged 19, at her mother's house at 10 Mountain View Terrace, South Circular Road. Her father Benjamin was a DMP policeman, dead by 1911; her widowed mother Catherine Whelan, a Kilkenny dressmaker by trade, ran the household and raised five children into respectable Dublin clerking and civil-service work.
              </p>
              <p style={{ lineHeight: 1.7, margin: '0 0 0.8rem' }}>
                She and Gavan married at Golden Bridge, Inchicore, on 4 September 1912. They had Thomas in 1913 and Gladys in 1916. They were living on the South Circular Road through the Rising. In February 1919 she died of influenza complicated by broncho-pneumonia at Tudor House, a private nursing home in Clontarf. She was twenty-seven. Gavan, who had moved the household to Herbert Lodge in Dalkey by then, reported the death himself.
              </p>
              <p style={{ lineHeight: 1.7, margin: 0 }}>
                She was one of the young adults the third wave of the 1918–19 pandemic took. Thomas was six when his mother died. Gladys was three.
              </p>
            </article>

            <article style={{ background: 'linear-gradient(180deg, #e6ead8 0%, #dde1cc 100%)', padding: '1.5rem', marginTop: '1.5rem', border: '1px solid #7a8a5d' }}>
              <p style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.65rem', letterSpacing: '0.25em', color: '#4a5d3a', margin: 0 }}>
                THE SECOND WIFE
              </p>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.6rem', margin: '0.2rem 0 0.1rem', color: '#2d3a1a' }}>
                Kathleen Mary Condon
              </h3>
              <p style={{ fontStyle: 'italic', margin: '0 0 1rem', color: '#4a5d3a' }}>c.1902 – 13 May 1984</p>
              <p style={{ lineHeight: 1.7, margin: '0 0 0.8rem' }}>
                A barrister's daughter from 73 Greenmount Road, Terenure. Her father John Patrick Condon was a member of the Irish Bar. She was described on the 1920 marriage cert as a "Lady", meaning of independent means. She was eighteen or nineteen. Gavan was thirty-eight, a widower with two small children.
              </p>
              <p style={{ lineHeight: 1.7, margin: '0 0 0.8rem' }}>
                They married on 15 September 1920 at St Joseph's, Crumlin. Eighteen months after Mary Catherine's death. The witnesses were <em>Thomas B. Duffy</em> (Gavan's brother) and <em>Eileen J. Condon</em> (Kathleen's sister). The officiant was Fr John A. Duffy OSA — an Augustinian priest who was almost certainly a relation of Gavan's.
              </p>
              <p style={{ lineHeight: 1.7, margin: 0 }}>
                She had Olga in 1923 and George a few years later. Outlived Gavan by thirty years. Died at the Sacred Heart Hospital, Ballinderry, near Mullingar, in May 1984 and was buried at Collinstown Cemetery, Co. Westmeath — not beside Gavan at Deansgrange.
              </p>
            </article>
          </div>
        )}

        {/* PLACES */}
        {activeTab === 'places' && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.6rem', marginTop: '0.5rem', color: '#7a3b2e' }}>
              The Houses
            </h2>
            <p style={{ fontStyle: 'italic', color: '#6b5137', marginTop: 0, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              From the Liberties to the sea. Tap any address to read more.
            </p>

            {Object.entries(places).map(([key, p]) => (
              <button
                key={key}
                onClick={() => setSelectedPlace(key)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  background: 'rgba(255,255,255,0.45)',
                  border: '1px solid #c4a77d',
                  padding: '1rem 1.1rem',
                  marginBottom: '0.7rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  color: 'inherit',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.7)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.45)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.1rem', margin: 0, color: '#2a1f1a', flex: 1 }}>
                    {p.name}
                  </h3>
                  <span style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.7rem', color: '#7a3b2e', whiteSpace: 'nowrap' }}>
                    {p.era}
                  </span>
                </div>
                <p style={{ margin: '0.4rem 0 0', fontSize: '0.92rem', color: '#5d4e3a', lineHeight: 1.5 }}>
                  {p.desc.substring(0, 120)}{p.desc.length > 120 ? '…' : ''}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* SHOP */}
        {activeTab === 'shop' && (
          <div>
            <div style={{
              background: '#2a1f1a',
              color: '#f4ebd8',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              marginBottom: '1.5rem',
              border: '3px double #b08d3f',
            }}>
              <p style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.65rem', letterSpacing: '0.3em', margin: 0, color: '#b08d3f' }}>
                42 · 43 · 44 · 45 · 46 THOMAS STREET
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '2.5rem', fontWeight: 700, margin: '0.4rem 0 0.3rem', color: '#f4ebd8' }}>
                Duffy's
              </h2>
              <p style={{ fontSize: '0.9rem', margin: 0, color: '#d4c9a8', letterSpacing: '0.1em' }}>
                OF DUBLIN &middot; EST. 1883
              </p>
              {/* A row of fabric swatches: a quiet nod to a draper's sample book. */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '1.1rem' }} aria-hidden="true">
                {[
                  '#7a3b2e', '#b08d3f', '#4a5d3a', '#2f4858',
                  '#8b6f47', '#6b4a3a', '#a86b6b', '#3d2817',
                ].map((c, i) => (
                  <span key={i} style={{
                    display: 'inline-block',
                    width: '14px',
                    height: '18px',
                    background: c,
                    border: '1px solid rgba(244, 235, 216, 0.4)',
                  }} />
                ))}
              </div>
            </div>

            <section style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.3rem', color: '#7a3b2e' }}>
                Out of Misfortune Came Opportunity
              </h3>
              <p style={{ lineHeight: 1.7 }}>
                On <strong>Wednesday 14 September 1870</strong>, the Irish Mail train crashed at Tamworth. Father Healy, a Catholic priest returning to Ireland, was drowned. The engine-driver and stoker were killed. Twenty-seven passengers were on the train; nine were injured. One of the names in the published roll of the injured was <strong>Thomas Duffey, of Dublin</strong> (the <em>Derry Journal</em>, 17 September 1870). He was a young Dublin haberdashery buyer travelling to London on company business. He took the compensation and saved it.
              </p>
              <p style={{ lineHeight: 1.7 }}>
                Thirteen years later, in 1883, he leased No. 44 Thomas Street from Monsieur and Madame Jules Bouvier of Geneva at £50 a year, and opened <em>Thomas Duffy, Draper and Milliner</em>. The ground itself had been leased to Charles Eastwood by the Earl of Meath in 1697.
              </p>
            </section>

            <section style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.3rem', color: '#7a3b2e' }}>
                The Founder
              </h3>
              <p style={{ lineHeight: 1.7 }}>
                <strong>Thomas Duffy</strong> in his swallow-tailed coat and tall silk hat was a familiar figure in Dublin of the 1900s. His resemblance to the Prince of Wales (later Edward VII) was so striking that Dubliners occasionally doffed their hats to him in the street by mistake. Justice of the Peace. Elected a Poor Law Guardian in 1905. Stood unsuccessfully against W.T. Cosgrave, the future founder of Cumann na nGaedheal, for Dublin Corporation around 1908.
              </p>
              <p style={{ lineHeight: 1.7 }}>
                He retired in 1917, aged 73, handing the firm to his sons <strong>Thomas B.</strong> and <strong>Patrick Gavan</strong>. He died in 1918.
              </p>
            </section>

            <section style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.3rem', color: '#7a3b2e' }}>
                Gavan's Reign: 1918 – 1954
              </h3>
              <p style={{ lineHeight: 1.7 }}>
                Thomas B. left around 1918 to found his own drapery at North Earl Street — <em>T. B. Duffy &amp; Co., Ltd.</em>, which still trades today as <strong>Duffy's Curtains</strong> under his descendants. Gavan took sole charge of Thomas Street.
              </p>
              <p style={{ lineHeight: 1.7 }}>
                Over the next forty years he expanded from No. 44 through Nos. 42, 43, 45 and 46, knocking the buildings together. In 1939 he applied for the transfer of a seven-day pub licence attached to 45/46 (pragmatism, not thirst). In 1948 he registered as <em>Gavan Duffy Ltd.</em>, putting his own name over the door and bringing his daughters <strong>Gladys</strong> (Chairman) and <strong>Olga</strong> (Director) onto the board.
              </p>
            </section>

            <section style={{ background: 'rgba(122, 59, 46, 0.08)', border: '1px solid #a86b6b', padding: '1.2rem', marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: '#7a3b2e', margin: 0 }}>
                FROM THE IRISH PRESS, 10 OCT 1941
              </p>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.2rem', margin: '0.3rem 0 0.6rem' }}>
                Dublin Traders on Lottery Charge
              </h4>
              <p style={{ lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                Eight Thomas Street traders appeared in the Dublin District Court yesterday, on a charge of organising a sale of tickets in a lottery not authorised by law. They were: Cornelius Lee, William Henry Sheridan, <strong>Patrick Gavan Duffy</strong>, William Gordon, drapers; Patrick Sheeran, furniture merchant; Patrick J. Rogers, grocer; Richard Phillips, fish and poultry merchant; Laurence Kennedy, meal and flour merchant…
              </p>
            </section>

            <section>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.3rem', color: '#7a3b2e' }}>
                The End
              </h3>
              <p style={{ lineHeight: 1.7 }}>
                Gavan died at Undercliffe, Killiney, on 19 June 1954. The shop placed a notice in the Irish Independent: <em>"Owing to the death of Patrick Gavan Duffy (R.I.P.), the premises Gavan Duffy, Ltd., 42/46 Thomas Street will be closed until Wednesday, 23rd June 1954."</em> His funeral at St Anne's, Shankill, was attended by Liam Cosgrave TD (future Taoiseach), P. Dockrell TD, E. Rooney TD, Senator Frank Hugh O'Donnell, Alderman P.S. Doyle, army officers and the entire staff of Gavan Duffy Ltd.
              </p>
              <p style={{ lineHeight: 1.7 }}>
                In 1958 the firm celebrated 75 years of trading with a full newspaper feature. <strong>Gladys</strong> was Chairman of Directors; <strong>Olga</strong> was Director. The shop kept trading into the 1960s. <strong>Gavan Duffy, Limited (CRO No. 13000) was finally dissolved on 20 April 1965</strong>, eleven years after Gavan\'s death and seven after the anniversary, when his daughters wound it up.
              </p>
            </section>
          </div>
        )}

        {/* ARCHIVE */}
        {activeTab === 'archive' && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.6rem', marginTop: '0.5rem', color: '#7a3b2e' }}>
              Documents Found
            </h2>
            <p style={{ fontStyle: 'italic', color: '#6b5137', marginTop: 0, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Primary source documents gathered for this archive.
            </p>

            {[
              { year: 1903, title: 'SS Parisian passenger manifest', src: 'Library & Archives Canada', note: 'Patrick Duffy, 23, junior draper, Dublin, destination Calgary. Second cabin.', type: 'Migration' },
              { year: 1907, title: 'Calgary Herald — "Variegated Jags" police court column', src: 'Calgary Herald, Wednesday 14 August 1907, page 1', note: 'A Patrick Duffy fined $3.50 in police court for being drunk in public, "admitted he had more than he could comfortably navigate with". The only Patrick Duffy mentioned in the Calgary Herald across the entire 1903-1910 period. Date and place fit Gavan\'s Alberta years and a 26-year-old cowboy in town for the late-summer round-up break, but the column gives no occupation, age or address: the identification is plausible rather than certain. Recorded here as a possible trace.', type: 'Newspaper' },
              { year: 1910, title: 'SS Campania return passenger manifest (BT26)', src: 'UK and Ireland, Incoming Passenger Lists, 1878-1960 (The National Archives, Kew)', ref: 'Ancestry coll. 1518 record 29534914; image 88 of 297, Liverpool April 1910', note: 'Patrick Duffy, third class, profession "Storekeeper", Irish, single, adult. Cunard SS Campania, official no. 102086, New York to Liverpool, arriving 14 April 1910. Closes the round trip with the 1903 SS Parisian outbound. The Cunard express service (six-day crossing) and the third-class booking suggest a young man with savings, in a hurry to be home. The "Storekeeper" entry rather than "Draper" or "Ranch hand" hints that the seven Alberta years were not all on the range.', type: 'Migration' },
              { year: 1911, title: 'Irish Census — Byrne family', src: 'National Archives of Ireland', note: '10 Mountain View Terrace. Mary Kate Byrne, draperess, aged 19. Whelan cousin living with the family.', type: 'Census' },
              { year: 1912, title: 'Marriage cert — Patrick Gavan Duffy & Mary Catherine Byrne', src: 'General Register Office', ref: '5606871', note: 'Golden Bridge, Inchicore. 4 September 1912. Fathers: Thomas Duffy, draper; Benjamin Byrne, ex-police sergeant.', type: 'BMD' },
              { year: 1913, title: 'Birth cert — Thomas Joseph Duffy', src: 'GRO', note: '25 June 1913, 66 South Circular Road. Father signs "Gavan Duffy".', type: 'BMD' },
              { year: 1916, title: 'Birth cert — Gladys May Duffy', src: 'GRO', ref: '1555061', note: '14 April 1916, 66 St Michael\'s Terrace. Ten days before the Easter Rising.', type: 'BMD' },
              { year: 1919, title: 'Death cert — Catherine (Mary Kate) Duffy', src: 'GRO', ref: '4417657', note: 'Tudor House, Clontarf. Influenza, broncho-pneumonia. Informant Gavan Duffy, husband, Herbert Lodge, Dalkey.', type: 'BMD' },
              { year: 1920, title: 'Marriage cert — Patrick Gavan Duffy & Kathleen Condon', src: 'GRO', note: 'St Joseph\'s, Crumlin. 15 September 1920. Father of bride: John Patrick Condon, Barrister.', type: 'BMD' },
              { year: 1923, title: 'Birth cert — Olga Duffy', src: 'GRO', ref: '1474688', note: '30 March 1923 at 36 Upper Mount Street (nursing home). Home: Queenstown Castle, Dalkey.', type: 'BMD' },
              { year: 1926, title: 'Irish Free State Census', src: 'National Archives of Ireland', note: 'Newtownsmith, Dún Laoghaire. Gavan (44, draper, own account), Kathleen, Thomas, Gladys, Olga + servant Maud Brownson.', type: 'Census' },
              { year: 1926, title: 'Irish Free State Census — Thomas B. Duffy\'s household', src: 'National Archives of Ireland', note: 'Clontarf, Dublin. Schedule 64. Thomas Duffy (40y6m, Head, Draper, Employer, b. Dublin City), Sara Duffy (35y11m, Wife, b. Co Cork, married 9 years = April 1917, 3 children born 3 living), Thomas Jr (7, son, at school, b. Clontarf), Freda (5y5m, daughter, b. Clontarf), Laura (1y+, daughter, b. Clontarf), + Bridget Tuite (34, servant, b. Gowran, Co Kilkenny). Confirms Thomas B\'s marriage to Sara in April 1917, one month before his father\'s death, and gives three new first cousins once removed: Thomas Jr, Freda and Laura Duffy.', type: 'Census' },
              { year: 1939, title: 'Pub licence transfer application', src: 'Irish Independent', note: '45/46 Thomas Street seven-day licence.', type: 'Newspaper' },
              { year: 1941, title: 'Dublin Traders on Lottery Charge', src: 'Irish Press', note: 'Gavan among eight Thomas Street traders charged. Outcome reserved.', type: 'Newspaper' },
              { year: 1948, title: '"Alma", 3 Tubbermore Ave., Dalkey — Nursing & Accouchement classified', src: 'Irish Independent, 31 August 1948', note: 'Under "NURSING & ACCOUCHEMENT" heading: "NURSE, S.R.N., S.C.M., can accommodate convalescent, semi-convalescent, or elderly patients in own home. \'Alma,\' 3 Tubbermore Ave., Dalkey." This is Delia Tierney advertising her private nursing home, six years before she became informant at Gavan\'s death. SRN + SCM = State Registered Nurse + State Certified Midwife.', type: 'Newspaper' },
              { year: 1954, title: 'Death cert — Patrick Gavan Duffy', src: 'GRO', ref: '4164986', note: 'Undercliffe, Killiney. Informant Delia Tierney, "Alma", Tubbermore Road, Dalkey. Delia Tierney is now identified: a State Registered Nurse and State Certified Midwife (SRN, SCM) who ran a small private nursing home for convalescent and elderly patients at "Alma", 3 Tubbermore Avenue, Dalkey, from around 1947 onward (classifieds confirm her presence at that address in Irish Independent 31 August 1948, and the house had been sold vacant in Irish Independent 23 August 1947). She was Gavan\'s professional private nurse in his final illness, attending him at home at Undercliff. Her own address appears on the cert because, as the medically qualified informant, her residence was the one recorded.', type: 'BMD' },
              { year: 1954, title: 'Obituary & funeral notice', src: 'Irish Independent & Irish Press', note: 'Buried Deansgrange. Mourners include Liam Cosgrave TD.', type: 'Newspaper' },
              { year: 1958, title: "Duffy's of Thomas Street: 75th Anniversary feature", src: 'Irish Independent, 25 March 1958', note: 'Full history of the firm, founder\'s biography, cowboy detail confirmed, Gladys as Chairman and Olga as Director named.', type: 'Newspaper' },
              { year: 1984, title: 'Death notice — Kathleen Duffy', src: 'Evening Herald', note: 'Died Sacred Heart Hospital, Mullingar. Buried Collinstown Cemetery, Westmeath.', type: 'Newspaper' },
              { year: 1901, title: 'Irish Census — Duffy family', src: 'National Archives of Ireland', note: '44 Thomas Street. Thomas Duffy (56, draper, born Dublin City), Mary (45, wife), and five children at home: Gavan (20, draper), Lillie (18), Thomas Jr (15), John (13), plus sister-in-law Lizzie Duffy (39, housekeeper) and six female drapery assistants living above the shop.', type: 'Census' },
              { year: 1911, title: 'Irish Census — Duffy family', src: 'National Archives of Ireland', note: '44 Thomas Street. Thomas Duffy (64, Magistrate (Draper), widower, 26 years married, 6 children born, 4 living). Gavan (30, draper, single, back from Alberta). Thomas B (28, draper). Aloysius (21, Student — Visitor). Lily (27). Five female drapery assistant boarders.', type: 'Census' },
              { year: 1911, title: 'Irish Census — Byrne family', src: 'National Archives of Ireland', note: '10 Mountain View Terrace. Mary Kate Byrne, draperess, aged 19. Whelan cousin living with the family.', type: 'Census' },
              { year: 1911, title: 'Irish Census — Condon family', src: 'National Archives of Ireland', note: '90 South Circular Road, Kilmainham. John Patrick Condon (47, Barrister-at-law not practising, Clerk of Poor Law Union, born Co Meath), wife Anna Mary (44, née Whyte), 8 children at home including Kathleen Mary aged 10 and Francis Xavier aged 6. Sister-in-law Harriett Whyte (dressmaker, Carlow) and servant Mary Drennan (Cavan).', type: 'Census' },
              { year: 1926, title: 'Irish Free State Census — Condon family', src: 'National Archives of Ireland', note: '22 Greenmount Road, Terenure. John Patrick now Clerk and Superintendent Registrar, Commissioners of the Dublin Union, James\'s Street. Places his workplace about 400 yards from Gavan\'s Thomas Street shop.', type: 'Census' },
              { year: 1941, title: 'Marriage cert — Francis Condon & Teresa Roche', src: 'GRO', note: 'Blackrock RC church, 2 July 1941. Francis: Builder\'s Foreman, of Queenstown Castle, Dalkey. Father John Condon. Teresa of 3 Ardeen Terrace, Blackrock. Confirms the Condons took Queenstown Castle on after Gavan vacated it.', type: 'BMD' },
              { year: 1917, title: 'Death cert — Thomas Joseph Duffy (founder)', src: 'GRO, Clontarf/Howth Registrar\'s District, No. 100', note: 'Died 13 May 1917 at Tudor House, Clontarf. Age 74, widower, draper. Cause: myocarditis (5 days) and pulmonary oedema, certified. Informant: Gavan Duffy, son, present at death. Same nursing home where Mary Catherine Byrne died two years later.', type: 'BMD' },
              { year: 1917, title: 'Probate grant — Thomas Joseph Duffy', src: 'National Archives of Ireland, Calendar of Wills & Administrations', note: 'Probate granted 18 July 1917 in Dublin. Effects £2,197 0s 5d. Executors: Patrick G. Duffy, Thomas B. Duffy (drapers) and the Rev. John A. Duffy R.C.C. Confirms Rev John A. Duffy as a brother rather than a distant relative.', type: 'Probate' },
              { year: 1870, title: 'Fatal Accident to the Irish Mail Train — Tamworth', src: 'Freeman\'s Journal, 15 September 1870, and Derry Journal, 17 September 1870', note: 'Reports the Tamworth rail crash of Wednesday 14 September 1870. Irish Mail train from Dublin/Holyhead to London derailed at 25 mph when pointsman Alfred Evans sent it into a siding. Engine-driver Samuel Taylor and stoker William Davis killed. Father Healy, Catholic priest, drowned. Among the published list of injured passengers: "Thomas Duffey, of Dublin" (Derry Journal names list, 17 Sept 1870). "Duffey" is a known variant spelling of Duffy in Irish civil records. Confirms the family tradition that Thomas Duffy was injured in the Tamworth crash and received compensation that helped fund the Thomas Street drapery.', type: 'Newspaper' },
              { year: 1870, title: 'Tamworth Inquest — Verdict of Manslaughter', src: 'Drogheda Conservative, 1 October 1870', note: 'The coroner\'s inquiry at Tamworth returned a verdict of manslaughter against Alfred Evans, the pointsman whose stopped watch sent the Irish Mail into the siding. "It was impossible for the jury, upon the evidence given at the inquest, to arrive at any other conclusion." This means the crash was officially found to be culpable — not misadventure — establishing LNWR vicarious liability for compensation of injured passengers including Thomas Duffy. Evans would have been committed for trial at the next Warwickshire Assizes.', type: 'Newspaper' },
              { year: 1875, title: 'Marriage cert — Thomas Duffy & Mary Flynn', src: 'Roman Catholic Church of St Kevin, Dublin (civil registration)', note: 'Married 24 November 1875 at St Kevin\'s, Registrar\'s District possibly Dublin South City, Union of South Dublin. Thomas Duffy, full age, Bachelor, Draper of Thomas Street, son of Patrick Duffy (Surveyor). Mary Flynn, full age, Spinster, Milliner of South Circular Road, daughter of Patrick Flynn (Tailor). Witnesses Thomas Smyth and Christina Flynn (bride\'s sister). Celebrated by Rev James Baxter. This cert completely rewrites the founder story — Thomas was a draper on Thomas Street EIGHT YEARS before the 1883 date traditionally given for the shop\'s founding. Also gives us two new great-great-great-grandfathers: Patrick Duffy (Surveyor) and Patrick Flynn (Tailor).', type: 'BMD' },
              { year: 1880, title: 'Baptism record — Patritius Joran Duffy', src: 'St Catherine\'s RC, Meath Street, Dublin (irishgenealogy.ie)', ref: 'DU-RC-BA-505126, page 140, entry 2200', note: 'Baptised at St Catherine\'s, Meath Street, in January 1880. Father Thomas Duffy, mother Maria Flynn, address "1 Thoms" (Thomas Street). Godparents Jacobi Claffey and Josephina Sterry. Officiating priest E. Dukay. The "Joran" middle name in the index is almost certainly an indexer\'s misreading of "Gavan" in cursive Latin. CRITICAL: this puts his actual birth in late 1879 or January 1880, not 1881. The GRO civil registration was filed in 1881 but every later age record (23 on the May 1903 manifest, 30 on the April 1911 census, 74 at death in June 1954) confirms an 1880 birth.', type: 'Church' },
              { year: 1881, title: 'Birth cert — Patrick Gavan Duffy', src: 'GRO', ref: '1590441', note: 'Civil registration filed in 1881 of a child born late 1879 or January 1880. The "Gavan" calling-name goes back to the register entry.', type: 'BMD' },
              { year: 1903, title: 'SS Parisian arrival at Quebec', src: 'Montreal Gazette, Monday 25 May 1903, page 10, shipping arrivals column', note: '"Steamship Parisian arrived at 3 p.m. Saturday, and left for Montreal at 10 p.m. today." Pins Gavan\'s first sight of Canada to 3 p.m. on Saturday 23 May 1903 at Quebec City. An eight-day Atlantic crossing from Liverpool. Newspapers.com image 419863109.', type: 'Newspaper' },
              { year: 1965, title: 'Gavan Duffy, Limited dissolved', src: 'Companies Registration Office (CRO CORE)', ref: 'Reg. No. 13000', note: 'Status: Dissolved. Effective date 20 April 1965. Eleven years after Gavan\'s death and seven years after the 1958 anniversary feature, Gladys (Chairman) and Olga (Director) wound up the firm. The 1948 founding directors and original registered office sit behind a paid CRO Company Printout (€3.50).', type: 'Business' },
              { year: 1903, title: 'Death cert — Mary Duffy (Gavan\'s mother)', src: 'GRO', ref: '4594706', note: 'Died 30 May 1903 at 44 Thomas Street, aged 45, of angina pectoris after only 3 hours\' illness. A sudden heart attack. Occupation: Dressmaker. Informant: T.B. Duffy, Son, Present at Death. Died two weeks after Gavan sailed for Canada — he was mid-Atlantic or already on the prairies when she died.', type: 'BMD' },
              { year: 1880, title: 'Marriage cert — Benjamin Byrne & Catherine Whelan', src: 'GRO', ref: '8036271', note: 'St Canice\'s, Kilkenny. Benjamin: policeman. Catherine: dressmaker. Fathers: John Byrne (pilot), Martin Whelan (policeman, deceased).', type: 'BMD' },
              { year: 1851, title: 'Fashionable Intelligence — Arrivals at Dalkey', src: 'Freeman\'s Journal, 6 June 1851', note: 'Earliest known mention of Queenstown Castle. Season lets listed, among them: "Alexander Kirkpatrick, Esq., J.P., Mrs. Kirkpatrick, and family, at Queenstown Castle." So the house existed and was being let to Dublin society for the summer by 1851, a decade before Undercliff was built.', type: 'Newspaper' },
              { year: 1878, title: 'Marriage notice — James Milo Burke', src: 'The Nation, 7 September 1878', note: '"James Milo Burke, Esq., J.P., Queenstown Castle, Dalkey" as witness/relation at a society wedding. Confirms Milo Burke (J.P., later D.L.) in residence at Queenstown Castle from at least 1878.', type: 'Newspaper' },
              { year: 1883, title: 'Marriage notice — Martin John Burke (son of Milo)', src: 'Belfast Newsletter, 24 December 1883', note: '"Martin John Burke, only son of Milo Burke, Esq., of Queenstown Castle, Dalkey, County Dublin" married Elizabeth Jane Barron-Stanton at St Helens, Holywood, Co Down by special licence, 22 Dec 1883. Anchors the Burke family at Queenstown Castle in the early 1880s.', type: 'Newspaper' },
              { year: 1908, title: 'Auction of Springfield House & Queenstown Castle', src: 'Irish Independent, 9 July 1908', note: '"THE CHARMING SEASIDE RESIDENCES, known as SPRINGFIELD HOUSE, DALKEY, And QUEENSTOWN CASTLE, DALKEY. Both held in Fee Simple... Re J. MILO BURKE, Esq., J.P., D.L., Deceased." Joseph F. Keogh auctioneer. So Milo Burke had died shortly before this date; both houses were held freehold by him.', type: 'Newspaper' },
              { year: 1909, title: 'Auction of contents of Queenstown Castle', src: 'Irish Independent, 11 March 1909', note: '"BEING THE CONTENTS OF QUEENSTOWN CASTLE, DALKEY. Re MILO BURKE, DECEASED." McMullan & Cox auctioneers, 30 Bachelor\'s Walk. 12 March 1909. Antique and modern furniture, old Sheffield plate, china, glass, pictures. The dispersal of Milo Burke\'s effects.', type: 'Newspaper' },
              { year: 1923, title: 'Birth notice — Olga Duffy', src: 'Freeman\'s Journal, 30 March 1923', note: '"DUFFY — March 26, 1923, at Maglona, 36 Upper Mount street, Dublin, the wife of Gavan Duffy, Queenstown Castle, Dalkey — a daughter." Confirms Gavan publicly used Queenstown Castle as his home address in 1923 and that Olga was actually born at Maglona nursing home on Upper Mount Street rather than at the house.', type: 'Newspaper' },
              { year: 1925, title: 'Queenstown Castle sale notice', src: 'Irish Independent, 11 & 18 July 1925', note: 'Battersby & Co auction. "B. & CO. QUEENSTOWN CASTLE, DALKEY. 23rd JULY. POSSESSION. HELD FREE OF RENT FOR EVER." 3 acres, lounge hall, drawing room with conservatory, dining room, study, 6 bedrooms, bathroom, servant\'s room, tiled kitchen, wash-house, pantries, coach-house, stabling, boat-house, electric bells, gas. **Gavan advertised the house for auction in July 1925.** The advert does not reveal who bought it. By April 1926 the Duffys had moved to Newtownsmith. The family story is that John Patrick Condon bought the house from Gavan — the auction may have been the mechanism, or the sale may have been by private treaty around the same date. Registry of Deeds memorial needed to confirm.', type: 'Newspaper' },
              { year: 1931, title: 'Laguna Queens Publicity Ball — prize list', src: 'Irish Independent, 7 February 1931', note: '"Duffy and Son, Gramophones and Records — Presented by Messrs. Duffy and Son, Thomas St. — Miss Condon, Queenstown Castle, Dalkey." A Miss Condon of Queenstown Castle won a prize donated by a Duffy and Son firm on Thomas Street (possibly Gavan\'s shop branching into gramophones, possibly a different Duffy). Socially links the Condons at Queenstown Castle to Thomas Street commerce in 1931.', type: 'Newspaper' },
              { year: 1934, title: 'Partnership Suit: Tobacco-Growing Enterprise', src: 'Irish Press, 16 January 1934', note: 'Dublin Circuit Court. Judge Davitt ruled Francis Condon, Queenstown Castle, Dalkey, and Mrs F. Harrison, Shanganagh Grove, Ballybrack, were the sole partners in a 1933 tobacco-growing venture at Shanganagh. Condon "had grown tobacco in Canada" and contributed his experience. Proceeds £318, split evenly. The Harrisons had alleged six partners; Condon rebutted and won. Confirms Francis\'s Canadian agricultural years.', type: 'Newspaper' },
              { year: 1936, title: 'Death notices & obituary — John Patrick Condon', src: 'Irish Press, 27, 28 & 29 January 1936', note: 'Died at Queenstown Castle, Dalkey, 26 January 1936, aged ~72. Three separate notices. Obituary (27 Jan): "As a boy he was taught by the late Mr. Michael Cusack, founder of the G.A.A." Early member of the Christian Brothers\' Past Pupils\' Union, associated with the Gaelic League. Funeral to Glasnevin. Chief mourners include Mrs. A. Condon (widow); Messrs A., J., John, F., Jas. and Jos. Condon (sons — five names, more than the 1911 census showed at home); Misses M. and E. Condon (daughters); Misses M. and H. Whyte (aunts, Anna\'s sisters); J. Grandy, M. Conway and Miss B. Conway (cousins); Mr J. E. Condon, Clerk, Dublin Union (nephew, succeeded him at work); Mr P. Crowley (brother-in-law). At funeral: Mrs K. Duffy (Kathleen), Mr G. Duffy (son-in-law, Gavan). Also attending: W. T. Cosgrave, T.D.', type: 'Newspaper' },
              { year: 1936, title: 'Statutory Notice to Creditors — John Patrick Condon', src: 'Irish Press, 10 March 1936', note: 'Frederick J. Mangan, Solicitor, 31 Dame Street, acting for the Executrices. Probate granted 28 February 1936. Claims against the estate by 14 April 1936. Confirms: late of Queenstown Castle, Dalkey; Barrister-at-Law; died 26 January 1936.', type: 'Probate' },
              { year: 1943, title: 'Queenstown Castle sold by private treaty', src: 'Irish Press, 31 July 1943', note: '"Mr. Albert MacArthur has carried through the following sales by private treaty — 34 Dame St... Queenstown Castle, Dalkey; ‘The Downs Manor,’ Delgany..." The sale of Queenstown Castle by the Condon family or a subsequent owner in mid-1943.', type: 'Newspaper' },
              { year: 1946, title: 'Queenstown Castle sold at auction for £4,350', src: 'Irish Press, 30 November 1946', note: '"Queenstown Castle, Coliemore Road, Dalkey, has been sold for £4,350. Standing on a ¼ acre, it has a private boat slip and bathing place. Six bed-rooms, lounge and three reception rooms... Property is freehold. P.L.V. £45." Note the stated size here is 1/4 acre rather than 3 acres — either sub-divided or misreported.', type: 'Newspaper' },
              { year: 1947, title: 'Queenstown Castle Hotel — excise licence application', src: 'Irish Independent, 20 September 1947', note: '"In the Matter of an Application by Martha Carney, of Queenstown Castle Hotel, Coliemore Road, Dalkey... to apply to the Court at Dublin on the 10th day of October, 1947, for a Certificate to entitle and enable her to obtain a new Excise Licence to sell beer, cider, spirits, wines..." By 1947 the house had been converted to Queenstown Castle Hotel and was under Martha Carney\'s management.', type: 'Newspaper' },
            ].sort((a,b) => a.year - b.year).map((doc, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.45)',
                border: '1px solid #c4a77d',
                padding: '0.9rem 1rem',
                marginBottom: '0.6rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.6rem' }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1rem', color: '#2a1f1a' }}>
                    {doc.title}
                  </div>
                  <div style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.72rem', color: '#7a3b2e', whiteSpace: 'nowrap' }}>
                    {doc.year}
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', fontFamily: "'Special Elite', monospace", letterSpacing: '0.1em', color: '#6b5137', marginTop: '0.1rem' }}>
                  {doc.type.toUpperCase()} &middot; {doc.src}{doc.ref ? ` · ref ${doc.ref}` : ''}
                </div>
                <p style={{ margin: '0.4rem 0 0', fontSize: '0.92rem', lineHeight: 1.5, color: '#5d4e3a' }}>
                  {doc.note}
                </p>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Person modal */}
      {selectedPerson && (
        <Modal onClose={() => setSelectedPerson(null)}>
          <p style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: '#7a3b2e', margin: 0 }}>
            {people[selectedPerson].role?.toUpperCase()}
          </p>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.6rem', margin: '0.3rem 0 0.2rem', color: '#2a1f1a' }}>
            {people[selectedPerson].name}
          </h3>
          {people[selectedPerson].dates && (
            <p style={{ fontStyle: 'italic', color: '#7a3b2e', margin: '0 0 1rem' }}>
              {people[selectedPerson].dates}
            </p>
          )}
          <PhotoSlot photo={people[selectedPerson].photo} alt={people[selectedPerson].name} />
          {(people[selectedPerson].story || 'More research needed.').split('\n\n').map((para, i) => (
            <p key={i} style={{ lineHeight: 1.7, fontSize: '1rem', margin: i === 0 ? '0 0 1rem' : '0 0 1rem' }}>
              {renderInline(para)}
            </p>
          ))}
        </Modal>
      )}

      {/* Place modal */}
      {selectedPlace && (
        <Modal onClose={() => setSelectedPlace(null)}>
          <p style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', color: '#7a3b2e', margin: 0 }}>
            <MapPin size={11} style={{ display: 'inline', marginRight: '0.3rem' }} />
            {places[selectedPlace].era}
          </p>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.5rem', margin: '0.3rem 0 1rem', color: '#2a1f1a' }}>
            {places[selectedPlace].name}
          </h3>
          {places[selectedPlace].images && places[selectedPlace].images.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: places[selectedPlace].images.length > 1 ? '1fr 1fr' : '1fr', gap: '0.6rem', marginBottom: '1rem' }}>
              {places[selectedPlace].images.map((img, i) => (
                <figure key={i} style={{ margin: 0 }}>
                  <img src={img.src} alt={img.caption} style={{ width: '100%', height: 'auto', border: '1px solid #8b6f47', display: 'block', background: '#ede2c4' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  {img.caption && (
                    <figcaption style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.65rem', color: '#6b5137', marginTop: '0.3rem', fontStyle: 'italic', lineHeight: 1.4 }}>
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
          {places[selectedPlace].desc.split('\n\n').map((para, i) => (
            <p key={i} style={{ lineHeight: 1.7, fontSize: '1rem', margin: i === 0 ? '0 0 1rem' : '0 0 1rem' }}>
              {renderInline(para)}
            </p>
          ))}
        </Modal>
      )}

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #c4a77d',
        marginTop: '3rem',
        padding: '2rem 1.25rem 1.5rem',
        textAlign: 'center',
        fontFamily: "'Special Elite', monospace",
        fontSize: '0.7rem',
        letterSpacing: '0.15em',
        color: '#6b5137',
        lineHeight: 1.8,
      }}>
        <div style={{ marginBottom: '0.6rem', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '1rem', letterSpacing: 0, color: '#7a3b2e' }}>
          &mdash; Compiled with love and a paper trail &mdash;
        </div>
        <div>An archive of Patrick Gavan Duffy &middot; 1880&ndash;1954</div>
        <div style={{ marginTop: '0.4rem', opacity: 0.7 }}>Last updated May 2026</div>
      </footer>
    </div>
  );
}

// --- Sub-components ---

// Photo slot with graceful placeholder if no photo is supplied
function PhotoSlot({ photo, alt }) {
  if (photo) {
    return (
      <figure style={{ margin: '0 0 1rem', float: 'right', marginLeft: '1rem', maxWidth: '40%' }}>
        <img src={photo} alt={alt} style={{ width: '100%', height: 'auto', border: '1px solid #8b6f47', display: 'block', background: '#ede2c4' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      </figure>
    );
  }
  // Tasteful Victorian-style silhouette frame when no photo is supplied.
  return (
    <figure style={{
      float: 'right',
      marginLeft: '1rem',
      marginBottom: '0.6rem',
      width: '35%',
      minHeight: '160px',
      border: '1px solid #8b6f47',
      background: 'linear-gradient(180deg, #ede2c4 0%, #d9c79a 100%)',
      boxShadow: 'inset 0 0 0 4px #f4ebd8, inset 0 0 0 5px #8b6f47',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.6rem',
      margin: '0 0 0.6rem 1rem',
    }}>
      <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" style={{ width: '70%', height: 'auto' }} aria-label={`Silhouette placeholder for ${alt || 'family member'}`}>
        <ellipse cx="50" cy="40" rx="18" ry="22" fill="#7a3b2e" opacity="0.55" />
        <path d="M20,130 C20,90 30,72 50,72 C70,72 80,90 80,130 Z" fill="#7a3b2e" opacity="0.55" />
      </svg>
    </figure>
  );
}

// Lightweight inline renderer: handles **bold** and bare URLs as clickable links.
function renderInline(text) {
  // Split on URLs first, keeping them as tokens
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      urlRegex.lastIndex = 0; // reset regex state
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: '#7a3b2e', textDecoration: 'underline', wordBreak: 'break-all' }}>
          {part}
        </a>
      );
    }
    // Handle **bold** within non-URL segments
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((bp, j) => {
      if (bp.startsWith('**') && bp.endsWith('**')) {
        return <strong key={`${i}-${j}`}>{bp.slice(2, -2)}</strong>;
      }
      return <React.Fragment key={`${i}-${j}`}>{bp}</React.Fragment>;
    });
  });
}

function PersonCard({ person, people, onClick, featured, tint, small, faded, highlight }) {
  const p = people[person];
  return (
    <button
      onClick={() => onClick(person)}
      style={{
        display: 'block', width: '100%', textAlign: 'left',
        background: tint || 'rgba(255,255,255,0.55)',
        border: highlight ? '2px solid #b08d3f' : '1px solid #8b6f47',
        padding: small ? '0.7rem 0.8rem' : '1rem 1.1rem',
        cursor: 'pointer',
        fontFamily: 'inherit',
        color: 'inherit',
        opacity: faded ? 0.75 : 1,
        transition: 'all 0.2s',
        position: 'relative',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {highlight && (
        <div style={{ position: 'absolute', top: '-10px', right: '8px', background: '#b08d3f', color: '#f4ebd8', fontSize: '0.6rem', padding: '2px 6px', fontFamily: "'Special Elite', monospace", letterSpacing: '0.1em' }}>
          GRANDMOTHER
        </div>
      )}
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: featured ? 700 : 600,
        fontSize: featured ? '1.15rem' : small ? '0.95rem' : '1.05rem',
        lineHeight: 1.2,
        color: '#2a1f1a',
      }}>
        {p.name}
      </div>
      {p.dates && (
        <div style={{ fontSize: '0.78rem', fontStyle: 'italic', color: '#6b5137', marginTop: '0.2rem' }}>
          {p.dates}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: "'Special Elite', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', color: '#7a3b2e', marginTop: '0.4rem' }}>
        READ MORE <ChevronRight size={10} />
      </div>
    </button>
  );
}

function Connector() {
  return (
    <div style={{ textAlign: 'center', color: '#8b6f47', fontSize: '1rem', lineHeight: 1, margin: '0.1rem 0' }}>│</div>
  );
}

function Modal({ children, onClose }) {
  // Close on Escape, lock body scroll while open.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(42, 31, 26, 0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        zIndex: 100,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#f4ebd8',
          border: '2px solid #7a3b2e',
          padding: '2.2rem 1.5rem 1.8rem',
          maxWidth: '480px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          position: 'relative',
          fontFamily: "'EB Garamond', Georgia, serif",
          color: '#2a1f1a',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          autoFocus
          style={{
            position: 'absolute', top: '0.6rem', right: '0.6rem',
            background: 'rgba(244, 235, 216, 0.9)',
            border: '1px solid #7a3b2e',
            cursor: 'pointer',
            color: '#7a3b2e',
            width: '2rem', height: '2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%',
            transition: 'background 0.15s, transform 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#7a3b2e'; e.currentTarget.style.color = '#f4ebd8'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(244, 235, 216, 0.9)'; e.currentTarget.style.color = '#7a3b2e'; }}
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}
