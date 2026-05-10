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
    { year: '13 May 1917', event: 'Father Thomas Joseph Duffy dies at Tudor House, Clontarf, aged 74, of myocarditis. Gavan is present at the death. The family had taken the run of the house — Tudor House was a private residence, not a nursing home', tone: 'death' },
    { year: '27 Feb 1919', event: 'Mary Catherine dies of influenza at Tudor House, Clontarf, aged 27. Civil registration the next day. Funeral private', tone: 'death' },
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
      story: 'Born Dublin City c.1843. Son of **Patrick Duffy, Surveyor** — a respectable skilled profession that means Thomas didn\'t come from nothing; he came from a professional Dublin family. A young Dublin haberdashery buyer travelling to London in September 1870 when the Irish Mail train crashed at Tamworth. Thirteen passengers were injured, Thomas among them. He received compensation. Already styling himself **"Draper of Thomas Street"** by 24 November 1875, when he married **Mary Flynn**, milliner, at St Kevin\'s Catholic Church — **eight years earlier than the 1883 date** traditionally given for the shop\'s founding. So either he was already an employed draper on Thomas Street well before 1883, or the shop at No. 44 existed earlier than we had been told. The 1883 date may refer to a specific event: a freehold or lease acquisition, a shopfront refit, or a formal opening. In 1883 he formally leased 44 Thomas Street from Monsieur and Madame Jules Bouvier of Geneva at £50 a year. The shop was known as Thomas Duffy, Draper and Milliner. Mary was still living when the shop opened and the "Milliner" half of the name may well refer to her own trade. Together they had six children, four of whom survived. A Justice of the Peace, Poor Law Guardian (elected 1905), and by the 1911 census he styled himself **Magistrate**. So closely resembled Edward VII that Dubliners doffed their hats to him by mistake. Stood unsuccessfully against W.T. Cosgrave for Dublin Corporation around 1908. Died 13 May 1917 at **Tudor House, Oulton Road, Clontarf**, after five days of myocarditis and pulmonary oedema. His heart gave out. Informant at the death was Gavan, present at the end. Twenty-one months later Gavan would bring his own dying first wife Mary Catherine to the same address. **Tudor House was not, despite long family memory, a formal nursing home** — the newspaper trail traces a sequence of private occupants there from 1905 onwards (the Birneys, A. G. Worcester, the Healys, the Downes, Mrs Hughes), with no mention of medical staff or convalescent advertising in any year. The Duffys had taken on the run of the house twice for end-of-life care, with private nursing brought in to attend; the press of 1 March 1919 calls it "their residence." Thomas left an estate of £2,197 (roughly £1.2–1.5 million today), administered by his three sons as joint executors: Gavan, Thomas B and Rev John A. Duffy.',
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
      story: 'Born c.1886 (aged 40 in April 1926). **Married Sara of Co Cork in April 1917** — about a month before his father died. Thomas B was co-executor of his father\'s 1917 will. Used his inheritance to found **Duffy\'s of North Earl Street in 1918**, a specialist curtain and soft-furnishing firm.\n\n**The Clontarf connection.** The 1926 Irish Free State Census places the Thomas B household at **Howth Road, DED Clontarf West**. Aged 40 (Thomas), 35 (Sara), with three children — **Thomas Jr** age 7 (b. c.1918–19, named after his late grandfather), **Freda** age 5 (b. c.1920–21), and **Laura** (an infant, no age recorded, most likely born early 1926). Plus one resident female servant, **Bridget Tuite**, age 34, single, Roman Catholic. So Thomas B was a Clontarf resident continuously from at least his 1917 marriage. The eight years between marriage and the 1926 census place him firmly in the same Dublin suburb where his father died at Tudor House on Oulton Road in May 1917 and where Mary Catherine Byrne died at the same address in February 1919. Howth Road and Oulton Road are within a mile of each other — Tudor House and Thomas B\'s Howth Road house were neighbouring streets in the same parish. He was almost certainly the local intermediary through whom the family arranged the use of Tudor House for end-of-life care, twice in 21 months — through Clontarf Catholic-circle introductions rather than direct Duffy tenancy. Whether he himself spent his earliest married months at Tudor House before moving to Howth Road is an open question that only his 1917 marriage cert or his father\'s probate executor declaration would settle.',
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
      dates: 'c.1892 – 27 February 1919',
      role: "Gavan's first wife. Great-grandmother of Thomas and Gladys.",
      story: 'A draper\'s assistant herself, listed as "draperess" on the 1911 census aged 19. Daughter of Benjamin Byrne, a DMP policeman, and Catherine Whelan, a Kilkenny dressmaker. Raised at 10 Mountain View Terrace, South Circular Road. Married Gavan at Golden Bridge, Inchicore, in September 1912. Had Thomas in 1913 and Gladys in 1916. **Died of influenza and broncho-pneumonia at Tudor House, Oulton Road, Clontarf, on Thursday 27 February 1919, aged 27.** The civil registration in the GRO is dated the following day, 28 February. Gavan, who had been at Herbert Lodge in Dalkey in earlier 1919, had moved with her to Tudor House in her final weeks; the *Evening Telegraph* death notice describes Tudor House as **"their residence,"** which fits the wider picture — Tudor House was a private home, not a nursing facility, but the Duffys had taken on its run for an end-of-life period (the same way Gavan\'s father had died there 21 months earlier). Funeral was held privately.\n\n**The press piece the next day in the *Evening Telegraph* (1 March 1919) headed "Dublin Draper\'s Bereavement"** identifies Gavan as proprietor of the drapery firm, then trading as **"Messrs. Duffy and Sons, Thomas Street and South Great George\'s Street."** Confirms the second premises was an established arm of the firm by 1919, and Gavan was already publicly running the business two years after his father\'s 1917 death.',
    },
    kathleen: {
      name: 'Kathleen Mary Condon',
      dates: 'c.1900 – 1984',
      role: 'Gavan\'s second wife. Your great-grandmother.',
      story: 'One of at least nine surviving children of John Patrick Condon and Anna Mary Whyte. Raised at 90 South Circular Road, Kilmainham, in a crowded Catholic household with a barrister-administrator father, a Carlow-born mother, seven or eight siblings, and a live-in Cavan servant. The family later moved to 73 Greenmount Road, Terenure, which is where she was living when she married Gavan in September 1920 at St Joseph\'s, Crumlin. She was 19, he was 38, a widower with two small children. Mother of Olga (1923) and George. Outlived Gavan by thirty years. Died at the Sacred Heart Hospital, Ballinderry, near Mullingar in May 1984, buried at Collinstown Cemetery in Westmeath — which now makes sense, as her father was born in Co Meath.',
    },
    thomas_jr: {
      name: 'Thomas Joseph "Tom" Duffy',
      dates: 'b. 25 June 1913',
      role: 'Eldest son, first marriage. Emigrated to Adelaide c.1938; married Sheila Macklin of Wattle Park.',
      story: 'Born 25 June 1913 at 66 South Circular Road. **Named Thomas Joseph after his grandfather**, not Thomas after his grandfather and Joseph after a saint as we first guessed. His grandfather Thomas Joseph Duffy was alive when he was born, still running the Thomas Street shop. The family naming pattern is exact: firstborn grandson gets the full name of the paternal grandfather. Lost his mother Mary Catherine to the 1919 flu at age six. Raised from age seven by his stepmother Kathleen, who was four years older than his eventual half-brother George.\n\n**Emigration: c.1938.** A *Mail (Adelaide)* article of 2 August 1947 reporting the arrival of his sisters Olga and Gladys in South Australia notes that *"Tom had not seen his sisters for nine years"* — placing his last visit home in 1938 and his emigration around then, age 25. He was 24 in 1938; the firm at Thomas Street wouldn\'t be formally registered as Gavan Duffy Ltd. for another decade. He left **before** the firm became a limited company.\n\n**Adelaide, marriage and family.** Trove (the Australian newspaper archive) carries ten Adelaide social-column references to "Mr. and Mrs. Tom Duffy" between 1946 and 1950. The 7 December 1946 *Mail* society piece reveals that **his wife was Sheila Macklin**, daughter of the Macklin family of Wattle Park, Adelaide (Mr. and Mrs. H. V. Macklin per the 1950 *News* coverage; possibly also referred to as Bruce Macklin). They married in the early 1940s and **had at least one baby by December 1946**. The Macklins hosted a New Year\'s Eve party for "about 160 friends" at Wattle Park in late 1946, with Tom and Sheila in the centre of the social register; by March 1950 Mrs Tom Duffy was hosting tennis afternoons at the Wattle Park home for visiting British aviators.\n\n**The Wattle Park life.** Wattle Park is a leafy inner-eastern suburb of Adelaide, about 7 km from the city centre, full of large interwar houses on tree-lined streets. The Macklins were established and well-connected; Tom married into a comfortable Adelaide family within the Catholic-Australian middle class. He was the natural heir to the Thomas Street drapery, but by 1948 his half-sisters Gladys (Chairman) and Olga (Director) had taken the board seats. Something either pushed him out or he walked. The 1947 visit by his half-sisters — sailing from Liverpool to Sydney on the **P&O liner SS Stratheden**, then connecting to Adelaide, then planning Melbourne, Sydney and Tasmania in September before returning to Adelaide for the Australian summer — was likely a long-overdue family reconciliation visit, ten years after his emigration.\n\n**Survived his father.** Listed alongside his sister Olga and brother George as one of "two sons" surviving Patrick Gavan Duffy in the 1954 *Irish Press* obituary. Adelaide to Dublin in three days was not a trip he could make for the funeral.',
    },
    gladys: {
      name: 'Gladys May Duffy',
      dates: '14 April 1916 – 2005',
      role: 'Daughter, first marriage. Chairman of Gavan Duffy Ltd; later proprietor of Quality Blinds.',
      story: 'Born 14 April 1916 at 66 St Michael\'s Terrace, South Circular Road — ten days before the Easter Rising began less than a mile away. An unusually English/Protestant-associated name for a Catholic Dublin daughter. **Lost her mother Mary Catherine to the 1919 flu when she was two years and ten months old.** Family tradition holds that she was sent to the **Dominican sisters in Wicklow** (probably the Siena Convent boarding school at Wicklow Town) at around three or four, an unusually young placement that fits the immediate circumstances — a widowed Dublin draper with a toddler daughter and a six-year-old son, unable to raise a small girl in a shop on Thomas Street. She likely stayed with the Dominicans until the family home was re-established under Kathleen from about 1922, because by the April 1926 census she was back at home in Newtownsmith, Dún Laoghaire, aged ten. Never married (listed as "Miss" at her father\'s 1954 funeral, and still "Miss" in a 1997 newspaper acknowledgement).\n\n**The war years — Red Cross, Paris.** A *Mail (Adelaide)* society column of 2 August 1947 (the article reporting her arrival in South Australia to visit her brother Tom) reveals what no Irish source records: *"During the war Gladys worked with the Red Cross and was in Paris for some time before returning home, where she worked until the end of the war."* Ireland was officially neutral during the Emergency, but the Irish Red Cross and the Knights of Malta did do wartime work into France through Catholic relief networks. Gladys, in her late twenties, served with them, including a Paris posting, before returning to Dublin to work until V-E Day in May 1945. The exact length of the Paris stay and the organisation that posted her are not yet confirmed; the Irish Red Cross archive in Cabra is the place to chase it.\n\n**The drapery board.** Chaired the family firm as Chairman of Directors from 1948 onward. The Dominican formation, plus four years of Red Cross work, would have given her the discipline and presence to chair a drapery board at 32.\n\n**Before the firm closed, she had the successor entity ready.** The CRO public register shows that the business name **\"QUALITY BLINDS\"** (No. 39191) was registered to an individual proprietor on **18 March 1964** — eight months before Gavan Duffy Ltd. went into voluntary liquidation in November 1964. Gladys had the parent firm she chaired wound up and the successor business name on the register before the year was out. This is a small but striking piece of commercial choreography. By March 1965 she was at **86 Capel Street, Dublin 1** (an Evening Herald classified entry of 1 March 1965 carries the brief line *"GLADYS DUFFY (Miss), 86 Capel St., Dublin"*). She didn\'t simply retire to the blinds business; she invented and traded.\n\n**The 1968 Baby Changing Table.** A women\'s-pages feature in the Evening Herald of 10 October 1968 reports that **"a piece of equipment called a \'Baby Changing Table\' has been launched on the market by Miss Gladys Duffy"** — an idea, the article says, "new to Ireland but used in a somewhat similar form on the Continent." Designed with four pockets for soap, pins and towels, *"especially tested and designed to ensure that a child couldn\'t possibly fall."* Sold through **Roches Stores, Barretts, the Baby Carriage Store and Staveley\'s of Parnell Street** for 69 shillings and sixpence. So at 52, three years after the firm wound up, Gladys was importing and adapting Continental baby furniture for the Irish market, with retail distribution across four Dublin shops.\n\n**Quality Blinds Limited, 1975–2007.** Through the 1970s she shifted from the baby-table niche to the Holland-blind specialty — the part of the family firm she knew best from twenty years on the board — and on **15 April 1975** she incorporated **QUALITY BLINDS LIMITED** (CRO 51091) as a private limited company. Within four weeks the *Evening Herald* feature (19 May 1975) was carrying her in print: *"There was a tremendous trade in Holland blinds years ago,"* she tells the reporter, *"my grandfather had founded a lucrative drapery business in Thomas Street, Dublin. The place closed some years ago, after a flourishing 75-year run. An important sector of that firm\'s business had lain in the roller-blind field…"* The launch of the limited company likely occasioned the press piece. By 1997 the family acknowledgements in *Evening Herald* death notices thank "the management and staff of **Quality Blinds** … Miss Gladys Duffy and Mrs Olga Ward," placing the two sisters together in the blinds trade more than thirty years after Thomas Street closed. The company filed annual returns through 2004, then went dormant after Gladys\'s 2005 death and was formally **dissolved on 23 February 2007**.\n\n**Civic life.** From at least 1969 to at least 1981 Gladys served as **Honorary Treasurer (later Honorary Secretary) of the National Association for the Aged**, 80 Marlborough Street, Dublin 1. Christmas notices and appeals over twelve years in the *Evening Herald*, *Irish Press* and *Irish Independent* are signed in her name. Her telephone number in 1969 was 808606 — a south-county Dublin prefix consistent with Killiney or Dalkey, suggesting she lived south of the city while working a charity desk on the north side.\n\n**Died in 2005, aged 89.**',
    },
    olga: {
      name: 'Olga Duffy',
      dates: '30 March 1923 – 2016',
      role: 'Your grandmother. Daughter, second marriage. Director, Gavan Duffy Ltd.',
      story: 'Born at a private nursing home at 36 Upper Mount Street, family home at Queenstown Castle, Dalkey. An exotic name for 1923 Dublin (Grand Duchess Olga Romanov murdered just five years before; Princess Olga of Greece in the society papers). Listed as "Miss" at her father\'s funeral in June 1954, so married William F. Ward after that date. **Died in 2016, aged 92 or 93.**',
    },
    george: {
      name: 'George Gavan Duffy',
      dates: '1937 – 13 December 2012',
      role: 'Youngest son, second marriage. Abbey-trained theatrical designer; painter; Africa years; "free spirit."',
      story: '**Born in Dublin in 1937**, fourteen years after his elder half-sister Olga and when his father Patrick Gavan Duffy was 56 or 57. The youngest of Gavan\'s four surviving children. Carried his father\'s middle name as his own and used the full **George Gavan Duffy** professionally throughout his life — at no small cost given the prior fame of the Treaty signatory and Supreme Court judge of the same name (1882–1951), who confused his press notices in search results regularly.\n\n**Theatre, 1965–1998.** First evidence of him in print is a **world premiere of his own play in June 1965** — most likely *Search the Wide Street* — running for at least two weeks, starring Emmet Bergin and Arthur O\'Sullivan. From there he turned to design. By 1967 he was credited as designer "courtesy of the Abbey Theatre" on tour productions of John B. Keane plays around Ireland. By November 1968 the Eblana Theatre in Dublin was running an evening play directed by Barry Cassin (with Eileen Lemass, Helen Robinson, Cecil Sheehan and Desmond Perry) and a Christmas pantomime (*Jack and the Beanstalk*, directed by Jack Cruise) — both with "Design by George Gavan Duffy" in the press advertisements. The *Midland Tribune* introducing the Birr Stage Guild\'s 1968 production of a costume play described him as "**one of Ireland\'s leading theatrical designers, whose work for the Dublin Theatre Festival was highly praised.**" Programmes for further productions in Cork and Tipperary through 1969 confirm a steady design career. He was still designing as late as 1998, when *Midland Tribune* praised *"the beautifully imaginative settings by George Gavan Duffy and Jimmy Devoy"* in a Marian Hall, Birr, production of an Abbey Theatre piece.\n\n**Africa, 1970s–1990s.** Between his Dublin theatre years and his Cork painting years, George spent **more than fifteen years in Africa — South Africa and Namibia**. The 12 January 2013 *Westmeath Examiner* obituary names both countries explicitly. The earlier *Topic* notice describes him as a "free spirit" who "spent many years living in Africa." The Hegarty Antiques biography of his later exhibition — written by gallery owner Ted Hegarty, almost certainly with George\'s direct input — gives us the line in his own voice: **"George is a free spirit, he travelled to Africa to spend a weekend and stayed for fifteen years!"**\n\n**The Namibian paintings.** The Hegarty exhibition catalogue lists 24 oil-on-canvas works, and the titles trace the country he came to know. *Khomas Hochlands "Namib"* (the Khomas Highlands surrounding Windhoek). *On the Way to Rehoboth* (the historic Baster town south of Windhoek). *Knowing the Secret of Khomasdhal* (the township in Windhoek). *A cry from the heart of the Brandberg People* and *Legend of White Lady!* (the sacred Brandberg mountain, with its famous prehistoric rock painting). *Skeleton Coast — many hopes were stranded here. Last Outpost of a forgotten Empire. Giant Dunes. Sandstorm. Rondavels. Namaqualand (No Water Land).* He painted the desert, the apartheid-era townships, the German-colonial outposts, the Skeleton Coast where ships went to die. He engaged Namibian places and Namibian peoples with seriousness, not as an exotic tourist.\n\n**The artistic lineage he claimed.** The Hegarty bio names the painters whose work he positioned himself alongside: **Mainie Jellett (1897–1944)**, the Dublin-Lhote-Gleizes-trained modernist abstract painter, whose dictum — *"the filling of a given space according to its shape, rhythmically and harmoniously"* — shaped his compositional thinking; **George Russell (AE) (1867–1935)**, the Irish mystic, poet and painter; and contemporaries **Martin Finnin** and **Tom Byrne**, both painters with strong spiritual dimensions. The exhibition catalogue opens with two epigraphs: Mainie Jellett\'s *"We sought the inner principle and not the outward appearance"* and Henri Amiel\'s *"The great artist is the simplifier."* Half the show was abstract African landscape, half was non-representational work on Christian themes — *When Michael stands Forth*, *Cicero!*, *Vernal Equinox*. *Theatre Cat and Company*, the title of one of the canvases, is a quiet wink to his earlier life on the Abbey stage.\n\n**Painting and Compostela, 1990s onwards.** Returning to Ireland, he moved first to **Glanmire, Co. Cork**, and turned to visual art. His painting cycle *Hommages 2001* — inspired by the Book of Kells and the Irish illuminated annals, but visibly influenced (per his obituary) by *"the worlds of opera, ballet and drama both in Ireland and abroad"* — was first shown at **Bantry House**, then at **Riverstown House, Glanmire**, in July 2001 and ran to 1 September 2001. The *Irish Examiner* review noted the artist "is in pursuit of the essence of the work of the ancient illustrators." His paintings turned up regularly in the Cork art-auction circuit thereafter — Auction Galleries on Weir Street, Bandon; Atelier Stothers Gallery in Midleton — between 2006 and 2009, alongside Markey Robinson, Marie Carroll, Norman Teeling and others. Deeply religious; **walked the Camino de Santiago to Compostela on multiple pilgrimages.**\n\n**Death.** Died **Thursday 13 December 2012** at his home, **Templefanum, Castlepollard, Co. Westmeath**, age 75. He had moved north from Cork to Westmeath in his later years, drawn to the countryside near Lough Lene where his mother Kathleen Condon had been buried in 1984. **Requiem Mass at St Mary\'s Church, Collinstown, on Saturday 15 December 2012** (concelebrated by Rev Fr Walsh PP, Collinstown, and Rev Fr Moore PP, Castlepollard), and **buried at St Mary\'s Cemetery, Collinstown — alongside his mother.** Survived by his sister Olga (Mrs Ward), brother-in-law William F. Ward, and nieces. Both the *Topic* (3 Jan 2013) and the *Westmeath Examiner* (12 Jan 2013) carry obituaries; the Westmeath Examiner one (https://irishnewsarchive.com/?a=d&d=WME20130112.1.16) is the fuller of the two.',
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
      role: "Kathleen's father. Barrister at Law; Clerk of the South Dublin Union; pupil of Michael Cusack; old schoolfellow of Father O'Growney.",
      story: "**Born in Co Meath, c.1864, third son of Michael Smith Condon**, gentleman, of Middle Mountjoy Street, Dublin. The father's identification comes from the King's Inns admission notice carried in both the *Evening Herald* of 1 November 1897 and the *Irish Daily Independent* of 2 November 1897, which describes the new barrister in the standard form: *\"John Patrick Condon, third son of Michael Smith Condon, of Middle Mountjoy Street, in the City of Dublin, gentleman.\"* In 1897-newspaper usage, \"gentleman\" means a man of independent income rather than a working tradesman. So the family had moved from a Meath origin to a respectable Dublin address by John Patrick's late twenties, with at least two older brothers — one of whom is the likely father of his eventual successor at the Union, **J. E. Condon**.\n\n**A schoolfellow of Father Eugene O'Growney.** The *Freeman's Journal* of 28 September 1903 carries a routine list of South Dublin Union Board of Guardians and describes him as *\"John Patrick Condon, B.L., Clerk of the Union; an old schoolfellow of Father O'Growney's.\"* Father Eugene O'Growney (1863–1899) was the author of the Gaelic League's *Simple Lessons in Irish*, the primer that launched the Irish-language revival as a mass movement, and was Vice-President of the Gaelic League. He was born at Ballyfallon near Athboy, Co Meath, in the same year as John Patrick, so the shared school is almost certainly in the Athboy area or at **St Finian's diocesan college, Navan**, the Catholic boys' school for Co Meath in the 1870s. This explains beautifully why John Patrick was an early member of the Gaelic League: he had grown up alongside its principal author.\n\n**As a boy he was also taught by Michael Cusack**, founder of the GAA, per both his obituaries (Cusack taught in various Dublin schools in the 1870s before founding the GAA in 1884). And he was *\"one of the earliest members of the Christian Brothers' Past Pupils' Union,\"* per the *Irish Press* obituary — the CBPPU was set up in Dublin in the 1880s, so being among its earliest members fits with him having been at a Christian Brothers school in the late 1870s, which in turn fits with the move from Co Meath to Middle Mountjoy Street and a Dublin schooling.\n\n**Career at the Dublin Union.** Admitted to the Bar in November 1897, but never took briefs because he held the senior salaried post of **Clerk of the South Dublin Union** at James's Street, the enormous workhouse complex that later became St Kevin's Hospital and, eventually, St James's. He was already in that post by 1901, signing statutory union notices in the *Irish Daily Independent* of 4 and 5 November 1901 and the *Freeman's Journal* of 19 February 1902. **He held the post for at least thirty years.** Both 1936 obituaries make clear he had **retired from the Clerkship a few years before his death**, not died in post as the family record had assumed. By 7 April 1932 his nephew **J. E. Condon** was already the Clerk of the Union (per *Irish Press*), so John Patrick had retired by then, in his late sixties. By November 1934 J. E. Condon's title had been modernised to **Secretary, Board of Assistance** following the Local Government Act 1925. The Condon family kept the senior administrative chair at the Dublin Union and its successor body for at least four decades, c.1900 to 1941.\n\n**The Cosgrave connection sharpened.** W. T. Cosgrave attended John Patrick's funeral. The connection is much closer than civic-administrative network. Cosgrave had personally fought inside the South Dublin Union during Easter Week 1916: he commanded a small detachment that held the Board Room above the main James's Street arch, was cut off from Eamonn Ceannt and Cathal Brugha in the Nurses' Home, and had to bore mouseholes through partition walls to maintain communication. So when Cosgrave attended the 1936 funeral he was not merely a politician paying respects to a senior civil servant: he had personally fought a six-day battle inside the building John Patrick administered. It sharpens the question of whether the two men met during the Rising itself. The Bureau of Military History witness statement WS 297 by **Annie Mannion**, Assistant Matron at the Union during Easter Week, is the most likely place to put John Patrick's name on the Rising directly.\n\n**Residential history.** Married Anna Mary Whyte in 1898 (likely on irishgenealogy.ie civil registers). Early married years at **2 Westland Villas, Tyrconnell Road, Inchicore** (confirmed by the *Evening Herald* birth notice of 20 February 1901). At **90 South Circular Road, Kilmainham** by the 1911 census, walking distance from the Union. At **22 Greenmount Road, Terenure** by the 1926 census. At **Queenstown Castle, Coliemore Road, Dalkey** certainly by 1934. **Died there on 26 January 1936**, aged about 72.\n\n**The two obituaries**, *Evening Herald* 27 January 1936 (\"Former Clerk of Dublin Union\") and *Irish Press* 27 January 1936 (\"Mr. J. P. Condon, B.L.\"), confirm the Cusack and Christian Brothers details, and add that he was *\"very popular with all with whom he came into contact in the discharge of his official duties. Journalists, whose duty brought them to the meetings of the Board, always found him exceedingly considerate and helpful.\"*\n\n**The funeral** took place from the **Church of the Assumption, Dalkey**, after 10 o'clock Mass on Tuesday 28 January 1936, celebrated by Rev J. Creedon C.C., proceeding to **Glasnevin Cemetery**. \"A large attendance,\" per the *Evening Herald* of 28 January 1936. Statutory creditors' notices ran in both papers on 10 March 1936; probate was granted 28 February 1936. Here is the detail that recasts Gavan's courtship: **Gavan's shop at 44 Thomas Street and John Patrick's workplace at James's Street were about four hundred yards apart**, on the same thoroughfare through the Liberties. They worked within a short walk of each other for decades. Gavan was not some stranger who turned up in Terenure to marry the barrister's daughter in 1920. He and John Patrick Condon had almost certainly known each other, at least by sight and reputation, since Gavan was a boy above the shop.",
    },
    j_e_condon: {
      name: 'J. E. Condon',
      dates: 'fl. 1932 – 1941',
      role: "Kathleen's first cousin. Inherited the senior administrative chair at the Dublin Union and its successor body.",
      story: "**The nephew successor.** When John Patrick Condon retired from the Clerkship of the South Dublin Union in his late sixties, the post passed to his nephew J. E. Condon — almost certainly the son of one of John Patrick's two older brothers (the brother's identity unconfirmed, settleable through the Dublin Board of Assistance staff records at the National Archives or J. E.'s own death notice).\n\nAlready Clerk of the Union by **7 April 1932** (*Irish Press*). At his uncle's death in January 1936 the Board recorded a vote of sympathy to him explicitly as nephew successor. By **17 November 1934** his title was modernised to **Secretary, Board of Assistance**, the body that replaced the Board of Guardians under the Local Government Act 1925; he held it alongside such figures as Professor Agnes O'Farrelly, Seamus Hughes of 2RN (the early Irish radio station), and the Wicklow County Council chairman — a Catholic civic-establishment circle similar in flavour to his uncle's. He held the post until at least **June 1941**.\n\nThe Condon family therefore kept the senior administrative chair at the Dublin Union and its successor body for at least four decades, from c.1900 to 1941.",
    },
    anna_mary: {
      name: 'Anna Mary Whyte',
      dates: 'c.1867 – before April 1976',
      role: "Kathleen's mother. Of Co Carlow.",
      story: "Born about 1867 in Co Carlow. Married John Patrick Condon in 1898 aged about 31. Bore ten children, nine surviving infancy.\n\n**Residential history**, now firmly traced. Early married years at **2 Westland Villas, Tyrconnell Road, Inchicore**. At **90 South Circular Road, Kilmainham** by the 1911 census, with her sister **Harriett Whyte**, a Carlow dressmaker of 30, and a Cavan servant **Mary Drennan**. At **22 Greenmount Road, Terenure** by the 1926 census. Certainly at **Queenstown Castle, Coliemore Road, Dalkey** by 1934. **Widowed in January 1936.** Still at Queenstown Castle in May 1937 when her youngest son Joseph Raphael married Mary Satterthwaite at Holy Cross Church, Hurlingham (per *Irish Independent*, 22 May 1937).\n\n**Sold Queenstown Castle by private treaty in or around July 1943**, aged about 76. The *Irish Press* of 31 July 1943, page 3, reports under \"Property Sales\": *\"Mr. Albert MacArthur has carried through the following sales by private treaty: 34 Dame St.; freehold residential property. Queenstown Castle, Dalkey; 'The Downs Manor,' Delgany, on 160 acres; 11 Harcourt St., and two residences in Pembroke St.\"* Her departure from Queenstown Castle is therefore precisely placed: July 1943, age 76. The house then operated as a guesthouse with no owner's name listed by 1944.\n\nWhere she went after Queenstown Castle, and the date of her death, are still being chased — the most fruitful next route is the civil death registers at irishgenealogy.ie filtered to \"Condon\" in the South Dublin or Rathdown registration district from 1943 onwards. By **April 1976** she was definitely dead: she is referred to as *\"late of Queenstown Castle, Dalkey\"* in the death notice of her son Jim.",
    },
    francis_condon: {
      name: 'Francis Xavier "F.X." Condon',
      dates: 'b. c.1905 – before April 1976',
      role: "Kathleen's younger brother. Builder's Foreman.",
      story: "Age 6 on the 1911 census at Kilmainham. Still at the Condon family home at Queenstown Castle, Dalkey, in 1941, when he married Teresa Roche, daughter of Timothy Roche (civil servant), at Blackrock Roman Catholic church on 2 July. Builder's Foreman by trade despite his barrister father. The F.X. Condon at Gavan's 1954 funeral.\n\n**A 1934 court case, with a small correction.** A *small* correction to the family record: the Irish Press of 16 January 1934, page 2, reports a Dublin Circuit Court partnership case, *Tobacco-Growing Enterprise In Co. Dublin* — **the venture was in Co Dublin, not Canada**. Judge Davitt ruled that **Francis Condon, of Queenstown Castle, Dalkey, and Mrs F. Harrison of Shanganagh Grove, Ballybrack**, were the sole partners in a tobacco-growing venture embarked on in February 1933, and each was entitled to half the proceeds. So Francis was at Queenstown Castle with his parents at the time, and his business partner was a neighbour up the coast at Ballybrack. The context is that 1933–34 was the height of De Valera's Economic War with Britain, and the Fianna Fáil government was actively encouraging Irish tobacco growing as part of import substitution. The Canada element in the family memory may be a separate later episode in Francis's life, or a confusion with parallel international tobacco-trade discussions reported in 1934.\n\nBy April 1976 Francis had died: he is not among the surviving siblings listed in his brother Jim's death notice.",
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
      story: 'From the 1911 census: **John Patrick Jr.** (b. c.1902, later went on to take a Master of Arts at Trinity College Dublin and lived with his father at Queenstown Castle), **Agnes Gertrude** (b. c.1904), **Anna Mary Jr.** (b. c.1907), **James Edmond "Jim"** (b. c.1908), **Joseph Raphael** (b. c.1910, married Mary Satterthwaite of Roehampton in May 1937 at Holy Cross Church, Hurlingham, London). Plus one more living child not at home on census night, and one who had died before 1911. Nine Condon siblings survived infancy.\n\n**Jim Condon\'s 1976 death notice fixes the survival list.** The *Irish Independent* of 27 April 1976 carries the death notice for James Edmond Condon, who died on **25 April 1976** at the County Hospital, Mullingar, *"second youngest son of J. P. Condon, B.L. and Mrs. Condon, late of Queenstown Castle, Dalkey."* The funeral was at **St Mary\'s Church, Collinstown, Co. Westmeath** — the same parish where Kathleen and George would later be buried. Surviving siblings listed are *"brothers John and Joe, sister Kathleen, relatives and friends."*\n\nSo by April 1976, of John Patrick and Anna Mary\'s nine or ten children, only **three were still alive**: John Patrick Junior, Joseph Raphael (the one who married in Hurlingham in 1937), and **Kathleen Mary** (Mrs Gavan Duffy, who would herself die in May 1984 and be buried at Collinstown). Eileen, Agnes, Anna Mary Junior, Francis Xavier and at least one other had all predeceased Jim. Anna Mary herself is described in the 1976 notice as *"late of Queenstown Castle"* — confirming she had also died by then.',
    },
  };

  const places = {
    thomas_st: {
      name: '42–46 Thomas Street',
      era: '1883–1954',
      desc: "The shop. Founded by Thomas Duffy in 1883 at No. 44, expanded through the 1900s across five adjoining buildings. In the heart of the Liberties, between the South Dublin Union and the Guinness brewery. Home above the shop for young Gavan. Witnessed the 1916 Rising on its doorstep, the Civil War, the Emergency. Still the registered address of Gavan Duffy Ltd. at his death.\n\nNewsprint scraps from the run of the firm: in October 1890 the shop supplied the **official commemorative badge of the Father Mathew Centenary** committee, green-and-gold Irish poplin at twopence a piece — a city-scale official commission seven years after the lease was signed. By December 1918 the firm was trading as drapers across Nos. 42, 43 and 44, with a separate millinery branch on South Great George's Street. In August 1939 Gavan applied for the seven-day pub-licence transfer for the premises (heard 28 September 1939). On 21 June 1954, the Monday after his death, the firm posted a black-bordered notice in the *Irish Press*: *\"Owing to the death of Patrick Gavan Duffy (R.I.P.), the premises Gavan Duffy, Ltd., 42/46 Thomas Street will be closed until Wednesday 23rd June, 1954.\"* A two-day mourning closure for the proprietor.",
    },
    south_georges: {
      name: '44 & 45 South Great George\'s Street',
      era: 'by 1918 – c.1922',
      desc: "A second Duffy premises, on the south side of the Liffey near Dublin Castle. The 13 December 1918 Evening Telegraph trade ad announces the firm as **\"DRAPERS, 42, 43, 44 THOMAS STREET\"** with a companion business **\"MILLINERS, 44 & 45 STH. GT. GEORGES ST., DUBLIN.\"** So by late 1918 Patrick Gavan Duffy was running two premises: the established drapery on Thomas Street and a separate millinery a mile away on South Great George's Street.\n\nThe second branch survived the 1916 Rising but ran into the Civil War. In August 1922, while O'Connell Street was burning and the Battle of Dublin shaping the new state, Patrick Gavan Duffy appears on a published compensation list at his South Great George's Street address, awarded **£55** for damage there (roughly €4,000 in today's money). The branch likely closed soon after; by 1939 the public licence application names only Thomas Street.",
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
      name: 'Herbert Lodge, Coliemore Road, Dalkey',
      era: '1919',
      desc: "Gavan's address when he reported Mary Catherine's death in February 1919. Herbert Lodge sits on Coliemore Road, Dalkey — the same seafront road as Queenstown Castle, three minutes' walk from Dalkey railway station. A semi-detached marine residence with three reception rooms, four family bedrooms, and large gardens front and rear, built (per the 1878 Freeman's Journal auction listing) to face the Leslie estate, with a sister property called Percy Lodge next door. The household had moved to the coast for Mary Catherine's health, likely for air and quiet, but she was already in a Clontarf nursing home by the end.",
    },
    tudor_house: {
      name: 'Tudor House, Oulton Road, Clontarf',
      era: '1917 & 1919',
      desc: '**Tudor House on Oulton Road, Clontarf was a private residence, not a nursing home in any formal sense** — though the family used it twice as one. The newspaper trail traces a sequence of well-connected private occupants: William Birney (1905), George Birney the solicitor running for Clontarf council on Lord Ardilaun\'s nomination (1908), A. G. Worcester (1914), Mr Healy and his cup-winning golfer sons (1926), M. Downes (1954), Mrs Hughes (1970). It is never advertised as a nursing home, never carries the name of a matron or doctor in residence, and is paired with adjoining Beechfield House on 2½ acres when finally sold at auction in 1967.\n\nThe Duffys used Tudor House twice for end-of-life care, twenty-one months apart. **Gavan\'s father Thomas died here on 13 May 1917, of myocarditis after a five-day illness, with Gavan present at the death.** Twenty-one months later, when Gavan\'s own first wife Mary Catherine fell seriously ill with influenza in early 1919, he brought her there too. **The 1 March 1919 *Evening Telegraph* press piece on her death describes Tudor House as "their residence" — not as a nursing home.** The most likely mechanism for both deaths happening at the same Clontarf address is a family connection through **Thomas B. Duffy, Gavan\'s younger brother**, who married in April 1917 (a month before his father died) and is on the 1926 Free State Census living at **Howth Road, Clontarf West** — within a mile of Oulton Road, in the same parish. Thomas B was a Clontarf resident from at least his 1917 marriage onwards, and was almost certainly the local intermediary who arranged the use of Tudor House through neighbourhood Catholic-circle introductions (the Birneys, Healys and Worcesters of Clontarf moved in the same J.P. and council circles). Whether Thomas B himself spent his earliest married months at Tudor House before settling at Howth Road is an open question that only the 1917 marriage cert or his father\'s probate executor declaration would settle.\n\nThe house went on quietly thereafter. Sold at auction with Beechfield House in May 1967, sold again in July 1995. By the 1990s it was a private residence on the Clontarf seafront like any other.',
    },
    upper_mount: {
      name: '36 Upper Mount Street',
      era: '1923',
      desc: "A private maternity nursing home in Georgian Dublin 2, run by Martha Conaty. Where Olga was born on 30 March 1923. Not the family home — just the lying-in address.",
    },
    queenstown: {
      name: 'Queenstown Castle, Coliemore Road, Dalkey',
      era: 'c.1920s–40s',
      desc: "Gavan and Kathleen's first proper marital home together, after they left Thomas Street in the early 1920s. A castellated marine residence on Coliemore Road, the seafront road overlooking Dalkey Sound and Dalkey Island. Olga was born from here in 1923. By 1926 they had moved on to Newtownsmith in Dún Laoghaire. After the Duffys vacated, the Condons took the house on. Kathleen's brother Francis gave Queenstown Castle as his address on his 1941 marriage cert, so the house passed from son-in-law to father-in-law's household within a decade. Whether Gavan sold it on to John Patrick Condon, let it to him, or something else, a Registry of Deeds or Valuation Office search would settle. Either way, the flow goes Duffy first, Condon after, not the other way round.\n\nNewspaper traces fill in the rest. By April 1941 the house was being advertised semi-furnished to let at £132 a year (a big Dalkey rent for the time, Anna Mary Whyte newly widowed). **In or around July 1943, Anna Mary sold Queenstown Castle by private treaty through the estate agent Albert MacArthur** — the *Irish Press* of 31 July 1943, page 3, lists it under \"Property Sales\" alongside 34 Dame Street, The Downs Manor at Delgany on 160 acres, 11 Harcourt Street and two residences in Pembroke Street. She was 76. By September 1947 Martha Carney had bought it and was applying for a hotel licence — Queenstown Castle Hotel ran through the 1950s. By 1973 it was already subdivided into several residential units; sold again at auction in 1973 and again c.1990 to Jim Delaney of the Dalkey Island Hotel, who converted it into the six luxury apartments it remains today. On the market for €1.3 million in January 2004.",
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
      desc: 'The last house. Not a suburban villa but a piece of serious Victorian architecture: designed 1861 by **Deane and Woodward**, the same firm behind the Kildare Street Club, the Museum Building at Trinity College Dublin, and the Oxford Museum. Benjamin Woodward himself, the Ruskinian half of the partnership, drew Undercliff as one of his last works before his early death. The first lease was registered on 13 February 1861 for Francis Robinson, and the Killiney History Society calls Undercliff "undoubtedly Woodward\'s work and the apparent prototype" from which the neighbouring houses on Strathmore Road were derived. L-shaped plan, triangular porch, **two turrets** (one containing the secondary staircase with a triangular dormer, the other on the garden side wrapped in first-floor balconies), a triangular fanlight over the front door, granite architrave in the style of the Kildare Street Club, triple-arched dining-room windows with tall shafts, naturalistically carved stone capitals. Three acres of grounds, a gate lodge, a walled kitchen garden and a tennis court. **Bono lives a few doors away today; Strathmore, the mansion opposite, was for decades the Canadian ambassador\'s residence.** Gavan, who grew up above a shop in the Liberties and sailed steerage to Canada as a ranch hand at 22, bought his way into this in his late sixties. He lived at Undercliff no more than five or six years before he died there on 19 June 1954. He was attended at the end by **Delia Tierney, SRN SCM**, a State Registered Nurse and State Certified Midwife who ran a small private nursing home at "Alma", 3 Tubbermore Avenue, Dalkey, less than two miles away. She had been in practice there since at least 1948, and was evidently engaged to nurse Gavan at home through his final illness. She was the informant on his death cert. Kathleen put the house on the auction market five months later, November 1954. The 1948 auction advert shows the lease still had 408 years to run at £26 a year.\n\nHis funeral at **St Anne\u2019s, Shankill** was attended by **Liam Cosgrave TD** (future Taoiseach), P. Dockrell TD, E. Rooney TD, Senator Frank Hugh O\u2019Donnell, Alderman P.S. Doyle, army officers and the entire staff of Gavan Duffy Ltd. He was buried at Deansgrange.\n\n**After the Duffys:** Kathleen sold Undercliff at auction in November 1954, five months after Gavan died. The buyer was **FX Buckley, the Dublin meat merchant**. By October 1964 Mrs Buckley was advertising for a cook at Undercliff, Strathmore Road, Killiney. The Buckleys held the house for forty-two years and put it back to auction in May 1996, where it sold for over £960,000 — the *Evening Herald* coverage notes that "whoever buys Undercliff on Strathmore Road will get the added bonus of having superstar Bono as a neighbour."\n\n**References:** Killiney History Society page on Undercliff — https://killineyhistory.ie/undercliff/ — includes a photograph of the house c.1997, an 1888 hand-drawn Ordnance Survey map detail showing the site, and a clipping from the **Freeman\'s Journal, Thursday 9 June 1887**. The clipping turned out NOT to be a property notice but a small classified for the sale of a carriage placed by the then-occupant: *"CARRIAGE; for Sale a canoe-shaped Open Carriage, very light and in good order, built by H F Brown and Co, of Redmond\'s hill. Apply C B Undercliffe, Killiney, where it can be seen."* Useful inadvertently because it identifies the 1887 occupant by initials only — **C.B.** — bridging the gap between Francis Robinson (the 1861 lessee) and A. Malcolm (the 1937 owner) by one resident still to be named. The advert image is here: https://killineyhistory.ie/wp-content/uploads/2021/07/The_Freeman_s_Journal_Thu__Jun_9__1887_-1024x173.jpg',
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
                  "In February 1919 the third wave of the influenza pandemic took her. She was twenty-seven. Gavan, by then living at Herbert Lodge in Dalkey, brought her with him to Tudor House on Oulton Road, Clontarf — the same private residence where his own father had died of myocarditis 21 months earlier. The press described it as their residence: a place the family had taken the run of, with private nursing brought in to attend, twice in less than two years. Thomas was six. Gladys was three.",
                ]}
                marginalia={[
                  { kicker: 'Two children', body: 'Thomas Joseph, b. 25 Jun 1913. Gladys May, b. 14 Apr 1916.' },
                  { kicker: 'Tudor House', body: 'Gavan’s father died here in May 1917. Twenty-one months later, his wife died here of the flu. The same private residence, taken on by the family for end-of-life care, twice in less than two years.', italic: true },
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

          <Route path="/the-children" element={
            <LegacyPage people={people} setSelectedPerson={setSelectedPerson} />
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
    { id: 'children', label: 'The Children', path: '/the-children' },
    { id: 'places', label: 'Places & Houses', path: '/places' },
    { id: 'archive', label: 'Sources', path: '/sources', count: 88 },
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
        <Link to="/the-children" style={{ fontFamily: FD, fontSize: 16, color: C.oxblood, textDecoration: 'none', borderBottom: `1px solid ${C.oxblood}`, paddingBottom: 2 }}>
          The Children →
        </Link>
        <Link to="/places" style={{ fontFamily: FD, fontSize: 16, color: C.oxblood, textDecoration: 'none', borderBottom: `1px solid ${C.oxblood}`, paddingBottom: 2 }}>
          Places & Houses →
        </Link>
        <Link to="/sources" style={{ fontFamily: FD, fontSize: 16, color: C.oxblood, textDecoration: 'none', borderBottom: `1px solid ${C.oxblood}`, paddingBottom: 2 }}>
          The Sources (88) →
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
  const G1 = 70, G2 = 270, G3 = 520;
  // Wives row sits at y = G2 + 130 = 400, with cards 88px tall (so bottom at 488).
  // G3 must therefore be > 488 to keep the children clear of the wives.
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
        <svg width={1240} height={660} style={{ display: 'block', minWidth: 1240 }}>
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
            {['john_condon', 'anna_mary', 'eileen_condon', 'francis_condon', 'j_e_condon', 'other_condons'].map(id => (
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

// ── The Children — a legacy page showing each child's later life ───────────
function LegacyPage({ people, setSelectedPerson }) {
  // The four surviving children, in birth order, with a tight vignette
  // pulling the most evocative biographical thread for each. Click-throughs
  // open the full bio modal (same data, deeper read).
  const vignettes = [
    {
      id: 'thomas_jr',
      initial: 'I',
      eyebrow: '1913 — 1980s · Adelaide',
      kicker: 'The eldest son who left',
      title: 'Tom of Wattle Park',
      body: [
        "Thomas Joseph Duffy junior — Tom — was born on 25 June 1913 above 66 South Circular Road, named for his grandfather the founder. He was six when his mother Mary Catherine died in the 1919 flu, seven when his father remarried, twenty-five when he left.",
        "He emigrated to Adelaide around 1938. The exact year is fixed by a *Mail (Adelaide)* society column of August 1947 reporting his sisters' arrival from Dublin: Tom, the column noted, *\"had not seen his sisters for nine years.\"* He left in the year the Civil Service was hiring, the GAA was reorganising, the firm at Thomas Street still called itself Duffy & Sons. He left before the limited company was even imagined.",
        "By the mid-1940s he had married **Sheila Macklin** of Wattle Park — a leafy inner-eastern suburb of Adelaide — daughter of the H. V. Macklin family. They had a baby by December 1946. The Macklins hosted a New Year's Eve party for one hundred and sixty friends at Wattle Park that year, with Mr and Mrs Tom Duffy in the centre of the social register; by March 1950 Mrs Tom Duffy was hosting tennis afternoons at the same house for visiting British aviators.",
        "The natural heir to Thomas Street had built a different life on a different continent. By 1948, when Gavan Duffy Ltd. was formally registered with Gladys as Chairman and Olga as Director, Tom did not appear on the board.",
      ],
    },
    {
      id: 'gladys',
      initial: 'II',
      eyebrow: '1916 — 2005 · Dublin',
      kicker: 'The chairman who became a blind-maker',
      title: 'Gladys May, who saw three lives',
      body: [
        "Four lives in one: the convent girl raised by Dominicans at Wicklow after her mother died in the flu; the wartime Red Cross worker posted to Paris and back; the chairman of a Dublin drapery firm; and, after the firm closed, an entrepreneur in her own right who marketed and sold things she had a hand in inventing.",
        "Her wartime years emerge only in a single line of an Adelaide newspaper, August 1947: *\"During the war Gladys worked with the Red Cross and was in Paris for some time before returning home, where she worked until the end of the war.\"* Ireland was officially neutral; the Irish Red Cross and the Knights of Malta did Catholic relief work in occupied France. Gladys, in her late twenties, was among them.",
        "Three years later she was on the board of Gavan Duffy Ltd. as Chairman of Directors, age 32. She held the chair for sixteen years. When the firm went into voluntary liquidation in November 1964, an *Evening Herald* classified of 1 March 1965 records her at a new address: **86 Capel Street, Dublin 1**. The CRO public register shows she had set the successor up before the wind-down: the business name **\"Quality Blinds\"** (CRO 39191) was registered to her on **18 March 1964** — eight months before Gavan Duffy Ltd. wound up. She had the new entity ready before the old one closed.",
        "She did not retire. In October 1968 the *Evening Herald* introduced its readers to **\"a piece of equipment called a 'Baby Changing Table' which has been launched on the market by Miss Gladys Duffy\"** — an idea, the paper explained, *\"new to Ireland but used in a somewhat similar form on the Continent.\"* Pockets for soap and pins, *\"especially tested and designed to ensure that a child couldn't possibly fall,\"* sold through Roches Stores, Barretts, the Baby Carriage Store and Staveley's of Parnell Street for 69s. 6d. By 1975 she had pivoted to the part of the family firm she knew best — the Holland-blind specialty — and built **Quality Blinds** out of it. *\"There was a tremendous trade in Holland blinds years ago,\"* she told an *Evening Herald* feature on 19 May 1975. *\"An important sector of that firm's business had lain in the roller-blind field…\"* By 1997 the family acknowledgements name her, with Olga, in the same breath as Quality Blinds.",
        "From 1969 to at least 1981 she was Honorary Treasurer and then Honorary Secretary of the **National Association for the Aged** at 80 Marlborough Street, signing Christmas appeals in the *Evening Herald*, *Irish Press* and *Irish Independent* for over a decade. Phone number 808606 — a south-county Dublin code, almost certainly Killiney or Dalkey.",
        "Never married. Listed as \"Miss\" at her father's funeral in 1954 and still \"Miss\" in print 43 years later. **Died 2005, aged 89.**",
      ],
    },
    {
      id: 'olga',
      initial: 'III',
      eyebrow: '1923 — 2016 · Dalkey',
      kicker: 'The director who married late and outlived them all',
      title: 'Olga, Mrs Ward',
      body: [
        "Born 30 March 1923 at the private nursing home at 36 Upper Mount Street, with the family home given as Queenstown Castle, Dalkey. The youngest of the daughters and the elder of the second-marriage children.",
        "Director of Gavan Duffy Ltd. from 1948 alongside her sister, when she was 25 and Gladys 32. Listed as \"Miss\" at her father's funeral in June 1954, so married William F. Ward after that date.",
        "Travelled to Adelaide with Gladys in 1947 on the P&O liner **SS Stratheden**, the first peacetime sailings out of Tilbury since the war. They visited Tom and Sheila at Wattle Park, took on Melbourne, Sydney and Tasmania in September, and returned to Adelaide for the Australian summer. A long voyage with a long-overdue family visit at the end of it.",
        "Outlived her sister by eleven years and her brother George by four. **Died in 2016, aged 92 or 93.**",
      ],
    },
    {
      id: 'george',
      initial: 'IV',
      eyebrow: '1937 — 13 December 2012 · Westmeath',
      kicker: 'The youngest son, Abbey designer, painter, free spirit',
      title: 'George Gavan Duffy',
      body: [
        "Born in Dublin in 1937, fourteen years after Olga, when his father was 56 or 57. The youngest, and named with his father's middle name as part of his own.",
        "First a man of the theatre. By 1965 he had a play of his own running at the Gaiety; by 1967 he was credited as designer \"courtesy of the Abbey Theatre\" on a tour of John B. Keane. By November 1968 the *Midland Tribune* called him **\"one of Ireland's leading theatrical designers, whose work for the Dublin Theatre Festival was highly praised.\"** Through the 1968 Christmas season the Eblana ran an evening play and a pantomime back-to-back with his name above both. He was still designing in 1998.",
        "**Then he went to Africa for a weekend and stayed for fifteen years.** That line is from the Hegarty Antiques exhibition catalogue, written almost certainly with George's own hand on the page. The 12 January 2013 *Westmeath Examiner* obituary names the countries — **South Africa and Namibia** — and adds that his art was *\"influenced by the worlds of opera, ballet and drama both in Ireland and abroad.\"* The connecting thread between his two careers is operatic stagecraft.",
        "**The places he painted.** The Hegarty exhibition catalogue lists 24 oil-on-canvas works. The titles trace the Namibia he came to know: *Khomas Hochlands \"Namib\"*; *On the Way to Rehoboth*; *Knowing the Secret of Khomasdhal*; *A cry from the heart of the Brandberg People*; *Legend of White Lady!*; *Skeleton Coast — many hopes were stranded here*; *Last Outpost of a forgotten Empire*; *Giant Dunes*; *Sandstorm*; *Rondavels*. He painted the desert, the apartheid-era townships, the Brandberg massif with its prehistoric rock paintings, the Skeleton Coast where ships went to die. Half the show was African landscape, half non-representational Christian work. *Theatre Cat and Company*, the title of one of the canvases, is a quiet wink to his earlier life on the Abbey stage.",
        "**The lineage he claimed.** The Hegarty bio names his lodestars: **Mainie Jellett (1897–1944)**, the Dublin-Lhote-Gleizes-trained modernist whose dictum *\"the filling of a given space according to its shape, rhythmically and harmoniously\"* shaped his compositional thinking, and **George Russell (AE) (1867–1935)**, the mystic poet-painter. Two epigraphs ran above the catalogue: Jellett's *\"We sought the inner principle and not the outward appearance\"* and Henri Amiel's *\"The great artist is the simplifier.\"*",
        "Returning to Ireland, he worked first from Glanmire, Co. Cork, exhibiting at Bantry House and Riverstown House. Deeply religious. **Walked the Camino de Santiago to Compostela on multiple pilgrimages.** Described in his *Topic* obituary as a \"free spirit.\"",
        "**Died at Templefanum, Castlepollard, Co. Westmeath, on Thursday 13 December 2012.** Buried alongside his mother Kathleen at St Mary's Cemetery, Collinstown — a few miles from where she died at Sacred Heart Hospital, Mullingar, in 1984. Survived by his sister Olga, his brother-in-law William F. Ward, and his nieces.",
      ],
    },
  ];

  return (
    <section style={{ padding: '0 0 60px' }}>
      {/* Dark gradient banner — matches the FamilyTree visual treatment */}
      <div style={{ background: `linear-gradient(180deg, ${C.ink} 0%, #2c211b 100%)`, color: C.cream, padding: '52px 28px 44px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.15,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        }} />
        <div style={{ position: 'relative', maxWidth: 880 }}>
          <p style={{ fontFamily: FM, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.gold, margin: 0 }}>Chapter — The Children</p>
          <h2 style={{ fontFamily: FD, fontWeight: 900, fontSize: 'clamp(2rem, 4.4vw, 3rem)', margin: '8px 0 6px', color: C.cream, letterSpacing: '-0.02em' }}>
            After Gavan: <span style={{ fontStyle: 'italic', color: C.gold }}>four lives</span>
          </h2>
          <p style={{ fontFamily: FD, fontStyle: 'italic', fontSize: 17, color: '#d4c9a8', margin: '0 0 4px', maxWidth: 720 }}>
            Adelaide, Dublin, Killiney, Castlepollard. A drapery firm, a chairman, a Red Cross posting, an Abbey Theatre, fifteen years in Namibia, a Holland-blind business, a Wattle Park marriage, a Camino pilgrimage. What four children made of the inheritance.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '40px 28px 0' }}>
        {vignettes.map((v, i) => (
          <article key={v.id} style={{ borderBottom: i === vignettes.length - 1 ? 'none' : `1px solid ${C.rule}`, padding: i === 0 ? '0 0 48px' : '48px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 24, alignItems: 'start' }}>
              <div>
                <div style={{ fontFamily: FM, fontSize: 10, letterSpacing: '0.3em', color: C.taupe }}>CHILD</div>
                <div style={{ fontFamily: FD, fontWeight: 900, fontSize: 38, lineHeight: 1, color: C.oxblood, marginTop: 4 }}>{v.initial}</div>
                <div style={{ width: 28, height: 2, background: C.oxblood, margin: '12px 0' }} />
                <div style={{ fontFamily: FM, fontSize: 10, letterSpacing: '0.18em', color: C.taupe, lineHeight: 1.4 }}>{v.eyebrow}</div>
              </div>
              <div>
                <p style={{ fontFamily: FM, fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.oxblood, margin: 0 }}>{v.kicker}</p>
                <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 'clamp(1.6rem, 3vw, 2rem)', lineHeight: 1.1, margin: '8px 0 18px', color: C.ink, letterSpacing: '-0.01em' }}>{v.title}</h3>
                {v.body.map((para, j) => (
                  <p key={j} style={{ fontSize: '1.05rem', lineHeight: 1.7, margin: '0 0 14px', color: C.ink, textWrap: 'pretty' }}>
                    {renderInline(para)}
                  </p>
                ))}
                <button onClick={() => setSelectedPerson(v.id)} style={{ marginTop: 10, fontFamily: FM, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.oxblood, background: 'transparent', border: 'none', borderBottom: `1px solid ${C.oxblood}`, padding: '4px 0', cursor: 'pointer' }}>
                  Read the full biography →
                </button>
              </div>
            </div>
          </article>
        ))}
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
  { year: 1890, type: 'Newspaper', title: 'Thomas Duffy supplies the Father Mathew Centenary badge', src: "Freeman's Journal, 11 Oct 1890, p.2", note: 'Trade advertisement: official commemorative badge of the Father Mathew Centenary committee, "supplied direct from the manufacturer, Thomas Duffy, 44 Thomas Street." Green-and-gold Irish poplin, twopence each. The shop was already a city-scale manufacturer seven years after the 1883 lease.' },
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
  { year: 1918, type: 'Newspaper', title: 'Trade ad — Drapers, 42, 43, 44 Thomas Street; Milliners, 44 & 45 South Great George’s Street', src: 'Evening Telegraph, 13 Dec 1918, p.3', note: 'Confirms the firm already occupied three buildings on Thomas Street by late 1918, and was running a millinery branch on the south side at 44 & 45 South Great George’s Street. Two premises, not one.' },
  { year: 1919, type: 'BMD', title: 'Death cert — Catherine "Mary Kate" Duffy', src: 'GRO', citation: '4417657', note: 'Died 27 Feb 1919 at Tudor House, Clontarf. Influenza, broncho-pneumonia. Civil registration filed 28 Feb. Informant Gavan, husband.' },
  { year: 1919, type: 'Newspaper', title: 'Death notice — Mary Catherine, wife of Gavan Duffy', src: 'Evening Telegraph, 28 Feb 1919, p.3', note: '"DUFFY (Dublin) — February 27, 1919, at her residence, Tudor House, Clontarf, Mary [Catherine] wife of Gavan Duffy, after a short illness; deeply regretted. R.I.P. Funeral private." Confirms 27 February as the death date.' },
  { year: 1919, type: 'Newspaper', title: '"Dublin Draper\'s Bereavement"', src: 'Evening Telegraph, 1 Mar 1919, p.3', note: '"Deep and widespread regret will be felt for Mr Gavan Duffy, proprietor of the well-known drapery firm, Messrs. Duffy and Sons, Thomas Street and South Great George\'s Street, on the death of his wife." Confirms the firm\'s 1919 trading name as "Duffy and Sons" with two premises.' },
  { year: 1974, type: 'Directory', title: 'Quality Blinds at 86 Capel St., Dublin 1', src: "Thom's Commercial Directory of Dublin, 1974 (askaboutireland.ie)", note: 'Listed under the BLINDS trade heading: "Quality Blinds, 86 Capel St., Dublin 1." Independently confirms the address Gladys had been at since 1965, eleven years before incorporating Quality Blinds Limited in 1975. Same listing in the 1978 edition.' },
  { year: 1905, type: 'Newspaper', title: 'Tudor House, Clontarf — was always a private residence', src: 'Belfast Newsletter (1905), Evening Herald (1926), Irish Independent (1954), Evening Herald (1970)', note: 'Tudor House was never a nursing home. Newspaper trail of occupants: William Birney (1905), George Birney solicitor (1908, ran for Clontarf council on Lord Ardilaun\'s nomination), A. G. Worcester (1914), Mr Healy (1926), M. Downes (1954), Mrs Hughes (1970). The Duffys took the run of the house twice for end-of-life care (1917 and 1919) — likely renting from the then-occupant, with private nursing brought in. The 1 March 1919 Evening Telegraph press piece calls it "their residence."' },
  { year: 1920, type: 'BMD', title: 'Marriage — P.G. Duffy & Kathleen Condon', src: "St Joseph's, Crumlin", note: '15 Sep 1920. Officiant Fr John A. Duffy OSA.' },
  { year: 1922, type: 'Newspaper', title: 'Civil War compensation list — £55 awarded for damage at 44 South Great George’s Street', src: 'Evening Herald, 15 Aug 1922, p.2', note: 'A list of compensation awards published in August 1922 (during the Battle of Dublin and the destruction of O’Connell Street) names "Patrick Gavan Duffy, 44 Sth. Great George’s Street — £55." So the South Great George’s Street millinery branch was damaged in the Civil War. Roughly €4,000 in today’s money.' },
  { year: 1923, type: 'BMD', title: 'Birth — Olga Duffy', src: 'GRO', citation: '1474688', note: '30 Mar 1923, 36 Upper Mount Street nursing home. Home Queenstown Castle, Dalkey.' },
  { year: 1923, type: 'Newspaper', title: 'Birth notice — Olga Duffy', src: "Freeman's Journal, 30 Mar 1923", note: '"At Maglona, 36 Upper Mount street, the wife of Gavan Duffy, Queenstown Castle, Dalkey — a daughter."' },
  { year: 1925, type: 'Newspaper', title: 'Queenstown Castle sale notice', src: 'Irish Independent, 11 Jul 1925', note: 'Battersby & Co auction. Gavan advertised the house for auction in July 1925.' },
  { year: 1926, type: 'Census', title: 'Irish Free State Census — Newtownsmith, Dún Laoghaire', src: 'NAI', note: 'Gavan (44), Kathleen, Thomas, Gladys, Olga + servant Maud Brownson.' },
  { year: 1926, type: 'Census', title: 'Irish Free State Census — Thomas B. Duffy at Howth Road, Clontarf West', src: 'NAI 1926 census, search-the-1926-census, online', note: 'Thomas (40), Sara (35), Thomas Jr (7), Freda (5), Laura (infant) + Bridget Tuite servant (34). All Roman Catholic. Howth Road, DED Clontarf West — within a mile of Tudor House on Oulton Road where Thomas senior (1917) and Mary Catherine (1919) had died. Strong evidence Thomas B was the family\'s Clontarf connection.' },
  { year: 1926, type: 'Census', title: 'Irish Free State Census — Condon family, Terenure', src: 'NAI', note: 'John Patrick Clerk and Superintendent Registrar of the Dublin Union, James’s Street.' },
  { year: 1931, type: 'Newspaper', title: 'Laguna Queens Publicity Ball — prize list', src: 'Irish Independent, 7 Feb 1931', note: 'Miss Condon of Queenstown Castle wins prize donated by a Duffy & Son of Thomas Street.' },
  { year: 1934, type: 'Newspaper', title: 'Partnership Suit: Tobacco-Growing Enterprise', src: 'Irish Press, 16 Jan 1934', note: 'Francis Condon "had grown tobacco in Canada". Confirms his Canadian agricultural years.' },
  { year: 1897, type: 'Newspaper', title: "John Patrick Condon admitted to the Bar — names father Michael Smith Condon of Middle Mountjoy Street", src: "Evening Herald, 1 Nov 1897 + Irish Daily Independent, 2 Nov 1897", note: '"John Patrick Condon, third son of Michael Smith Condon, of Middle Mountjoy Street, in the City of Dublin, gentleman." The single line gives four new facts: father identified, Dublin address pinned, "gentleman" status, and the third-son birth order.' },
  { year: 1901, type: 'Newspaper', title: "JPC signing as Clerk of the South Dublin Union", src: "Irish Daily Independent, 4–5 Nov 1901; Freeman's Journal, 19 Feb 1902", note: 'Statutory union notices signed "JOHN PATRICK CONDON, Clerk of the Union, Boardroom, James\'s Street, Dublin." Already in post by November 1901, before he was 38.' },
  { year: 1903, type: 'Newspaper', title: "JPC named as old schoolfellow of Father O'Growney", src: "Freeman's Journal, 28 Sep 1903", note: 'Names him as "John Patrick Condon, B.L., Clerk of the Union; an old schoolfellow of Father O\'Growney\'s." O\'Growney was author of the Gaelic League\'s Simple Lessons in Irish, born Athboy, Co Meath, in the same year. School almost certainly Athboy or St Finian\'s College, Navan — replaces the earlier "probably O\'Connell School in Dublin" guess.' },
  { year: 1932, type: 'Newspaper', title: "J. E. Condon already Clerk of the Union — JPC retired by 1932", src: 'Irish Press, 7 Apr 1932', note: 'JPC\'s nephew J. E. Condon recorded as Clerk of the Union by 7 April 1932, so JPC had retired by then in his late sixties. Both 1936 obituaries confirm he had retired "a few years ago," not died in post.' },
  { year: 1934, type: 'Newspaper', title: 'Francis Condon tobacco partnership case — venture in Co Dublin not Canada', src: 'Irish Press, 16 Jan 1934, p.2', note: 'Tobacco-Growing Enterprise In Co. Dublin. Judge Davitt ruled in Dublin Circuit Court that Francis Condon, of Queenstown Castle, Dalkey, and Mrs F. Harrison of Shanganagh Grove, Ballybrack, were sole partners in a tobacco-growing venture started Feb 1933 — context: De Valera\'s Economic War with Britain. Earlier "Canadian tobacco" framing of this case in family memory is a confusion.' },
  { year: 1934, type: 'Newspaper', title: 'J. E. Condon as Secretary, Board of Assistance', src: 'Irish Press, 17 Nov 1934', note: 'JPC\'s nephew\'s title now modernised to "Secretary, Board of Assistance" (the body that replaced the Board of Guardians under the Local Government Act 1925). Held alongside Professor Agnes O\'Farrelly, Seamus Hughes of 2RN, and the Wicklow County Council chairman.' },
  { year: 1936, type: 'Newspaper', title: 'Death notices & obituary — John Patrick Condon', src: 'Evening Herald, 27 Jan 1936, p.10 + Irish Press, 27 Jan 1936, p.8', note: 'Two full obituaries. Evening Herald: "Former Clerk of the Dublin Union… one of the best-known public officials in the country… A pupil of the late Michael Cusack, founder of the G.A.A." Irish Press: "one of the EARLIEST members of the Christian Brothers\' Past Pupils\' Union…  As a boy he was taught by the late Mr. Michael Cusack." Both confirm he had retired some years before death.' },
  { year: 1936, type: 'Newspaper', title: 'Funeral — Church of the Assumption, Dalkey, to Glasnevin', src: 'Evening Herald, 28 Jan 1936, p.3', note: 'Funeral after 10 o\'clock Mass on Tuesday 28 January 1936, celebrated by Rev J. Creedon C.C., proceeding to Glasnevin Cemetery. "A large attendance."' },
  { year: 1936, type: 'Newspaper', title: 'South Dublin Union Board sympathy to nephew successor', src: 'Irish Press, 30 Jan 1936', note: '"The Board voted sympathy to Mr. J. E. Condon, Clerk, on the death of his uncle, Mr. J. P. Condon, B.L., formerly a clerk of the union." Confirms J. E. Condon as Kathleen\'s first cousin and inheritor of the senior administrative chair.' },
  { year: 1936, type: 'Probate', title: 'Statutory Notice to Creditors — John Patrick Condon', src: 'Irish Press, 10 Mar 1936', note: 'Probate granted 28 February 1936.' },
  { year: 1937, type: 'Newspaper', title: 'Vote of condolence on death of P. Crowley, Director of Irish Tourist Association', src: 'Irish Press, 17 Mar 1937', note: 'Plausible but unverified that this is the same P. Crowley who attended John Patrick\'s 1936 funeral as brother-in-law (which would mean Anna Mary\'s sister married into a Crowley family of civic standing).' },
  { year: 1943, type: 'Newspaper', title: 'Anna Mary sells Queenstown Castle by private treaty', src: 'Irish Press, 31 Jul 1943, p.3', note: 'Property Sales: "Mr. Albert MacArthur has carried through the following sales by private treaty: 34 Dame St.; freehold residential property. Queenstown Castle, Dalkey; \'The Downs Manor,\' Delgany, on 160 acres; 11 Harcourt St., and two residences in Pembroke St." Anna Mary was 76 at the sale.' },
  { year: 1976, type: 'Newspaper', title: 'Death notice — James Edmond "Jim" Condon', src: 'Irish Independent, 27 Apr 1976', note: 'Died 25 April 1976 at the County Hospital, Mullingar; "second youngest son of J. P. Condon, B.L. and Mrs. Condon, late of Queenstown Castle, Dalkey." Funeral at St Mary\'s Church, Collinstown, Co Westmeath. Surviving siblings: brothers John and Joe, sister Kathleen. Pins down which Condon children outlived Jim — only three.' },
  { year: 1990, type: 'Newspaper', title: 'Sunday Independent retrospective on Queenstown Castle', src: 'Sunday Independent, 5 Aug 1990, p.31', note: 'Traces residents over time. After JPC, the house was at the Board of National Education in Marlborough Street, with John Patrick Junior living with him as a Master of Arts of Trinity College. By 1944 listed as a guesthouse with no owner\'s name.' },
  { year: 1939, type: 'Newspaper', title: 'Public notice — pub-licence transfer application', src: 'Irish Independent, 22 Aug 1939, p.1', note: '"I, Patrick Gavan Duffy, of 42 to 44 Thomas Street, Dublin, do intend to apply at the next Annual Licensing District Court… for a Certificate." Hearing scheduled for 28 September 1939.' },
  { year: 1941, type: 'BMD', title: 'Marriage — Francis Condon & Teresa Roche', src: 'GRO', note: 'Blackrock, 2 Jul 1941. Confirms Condons took Queenstown Castle on after Gavan vacated.' },
  { year: 1941, type: 'Newspaper', title: 'Eight Thomas Street traders charged with running an unauthorised lottery', src: 'Irish Press, 10 Oct 1941, p.3', note: 'Cornelius Lee, William Henry Sheridan, Patrick Gavan Duffy and William Gordon (drapers); Patrick Sheeran (furniture); Patrick J. Rogers (grocer); Richard Phillips (fish & poultry); Laurence Kennedy (meal & flour). Star Printing Works, 21 Drury Street, summoned for aiding and abetting.' },
  { year: 1943, type: 'Newspaper', title: 'Queenstown Castle sold by private treaty', src: 'Irish Press, 31 Jul 1943', note: 'Albert MacArthur sale.' },
  { year: 1946, type: 'Newspaper', title: 'Queenstown Castle sold at auction for £4,350', src: 'Irish Press, 30 Nov 1946', note: 'Coliemore Road, Dalkey.' },
  { year: 1947, type: 'Newspaper', title: 'Queenstown Castle Hotel — excise licence application', src: 'Irish Independent, 20 Sep 1947', note: 'House converted to hotel under Martha Carney.' },
  { year: 1948, type: 'Newspaper', title: '"Alma", 3 Tubbermore Ave., Dalkey — Nursing classified', src: 'Irish Independent, 31 Aug 1948', note: 'Delia Tierney advertising her private nursing home, six years before she became informant at Gavan’s death.' },
  { year: 1954, type: 'BMD', title: 'Death cert — Patrick Gavan Duffy', src: 'GRO', citation: '4164986', note: 'Undercliffe, Killiney. Informant Delia Tierney, SRN SCM.' },
  { year: 1954, type: 'Newspaper', title: 'Death notice pinning the date — 19 June 1954', src: 'Irish Independent, 22 Jun 1954, p.7', note: '"DUFFY (Killiney) — June 19, 1954. Patrick Gavan Duffy, beloved husband of Kathleen Duffy, at his residence, Undercliffe, Killiney; deeply regretted by his sorrowing wife and family." Funeral 22 June from St Anne’s, Shankill, to Deansgrange.' },
  { year: 1954, type: 'Newspaper', title: 'Mourning closure notice — shop closed Mon 21 to Wed 23 June', src: 'Irish Press, 21 Jun 1954, p.14', note: '"OWING TO THE DEATH OF PATRICK GAVAN DUFFY (R.I.P.), the premises GAVAN DUFFY, LTD., 42/46 THOMAS STREET WILL BE CLOSED UNTIL WEDNESDAY 23rd JUNE, 1954." A two-day closure as a mark of respect.' },
  { year: 1954, type: 'Newspaper', title: 'Obituary article and full funeral report', src: 'Irish Independent, 21 Jun 1954, p.3 + Irish Press, 21 & 23 Jun 1954', note: 'Press obit: "in business in Dublin for over 60 years… proprietor of the wholesale and retail drapery firm, Messrs. Duffy and Sons." Funeral mourners include widow Kathleen, daughters Gladys and Olga, sons George and Thomas, brother Thomas B, with Liam Cosgrave TD attending.' },
  { year: 1958, type: 'Newspaper', title: 'Thomas B. Duffy obituary — confirms PGD’s "cowboy on a Canadian ranch" years and the Tamworth crash', src: 'Irish Press / Irish Independent, 25 Mar 1958', note: 'On the death of Gavan’s younger brother Thomas B (founder of Duffy’s of North Earl Street), the article describes the founding of the firm "shattered by the sound of the founder’s train crash at Tamworth," and notes Gavan "spent his youth travelling extensively. Among other employments, he worked for a while as a cowboy on a Canadian ranch. A keen horseman…" Family lore confirmed in print by contemporaries.' },
  { year: 1964, type: 'Newspaper', title: 'Voluntary liquidation notice — Gavan Duffy Limited', src: 'Irish Independent / Irish Press, 4 Nov 1964, p.16', note: '"GAVAN DUFFY LIMITED (IN VOLUNTARY LIQUIDATION). TAKE NOTICE that a General Meeting of the Company will be held on Friday, the 4th of December, 1964, at 11.30 a.m. at the offices of Messrs. Monks & Gaynor, Solicitors, 27 Molesworth Street." Gladys had run the firm for ten years after Gavan’s death; voluntary liquidation declared November 1964; final dissolution April 1965.' },
  { year: 1965, type: 'Newspaper', title: 'Gladys at 86 Capel Street, Dublin', src: 'Evening Herald, 1 Mar 1965, p.8', note: '"GLADYS DUFFY (Miss), 86 Capel St., Dublin." Four months after the firm\'s voluntary liquidation, Gladys is at a north-side address — the start of her successor career as a blind trader.' },
  { year: 1964, type: 'Business', title: '"Quality Blinds" registered as a business name eight months before Gavan Duffy Ltd. wound up', src: 'CRO Business Name 39191', note: 'Registered 18 March 1964; sole-proprietor type; status still "Normal" today. Gladys had the successor entity in place eight months before voluntary liquidation of the parent firm in November 1964.' },
  { year: 1968, type: 'Newspaper', title: 'Gladys launches a Baby Changing Table on the Irish market', src: 'Evening Herald, 10 Oct 1968, p.9', note: '"A piece of equipment called a \'Baby Changing Table\' has been launched on the market by Miss Gladys Duffy… new to Ireland but used in a somewhat similar form on the Continent. 4 pockets for soap, pins, towel… especially tested and designed to ensure that a child couldn\'t possibly fall." Sold via Roches Stores, Barretts, the Baby Carriage Store, and Staveley\'s of Parnell Street for 69s. 6d.' },
  { year: 1975, type: 'Business', title: 'Quality Blinds Limited incorporated', src: 'CRO No. 51091', note: 'Private limited company by shares incorporated 15 April 1975 — four weeks before the Evening Herald feature interviewing Gladys. Filed annual returns through 2004; formally dissolved 23 February 2007, two years after her death. 53 documents on file in the CRO archive.' },
  { year: 1965, type: 'Newspaper', title: 'World premiere of George Gavan Duffy\'s play', src: 'Evening Herald, 15 Jun 1965, p.10', note: 'Theatre advertisement: "Nightly 8 o\'c. Retained 2nd Week. World Premiere — Emmet Bergin in [a play] by George Gavan Duffy, with Garry Alexander, Sheila O\'Sullivan, Maria Andioa, Raymond Mackin and Arthur O\'Sullivan." George\'s authorial debut, age 28.' },
  { year: 1965, type: 'Business', title: 'Gavan Duffy, Limited dissolved', src: 'CRO CORE', citation: 'Reg. No. 13000', note: 'Effective 20 April 1965.' },
  { year: 1967, type: 'Newspaper', title: 'George Gavan Duffy designs Abbey Theatre tour of John B. Keane', src: 'Offaly Independent, 16 Dec 1967, p.8', note: '"A Play with Music by JOHN B. KEANE. Settings by GEORGE GAVAN DUFFY (Courtesy of the Abbey Theatre)." George at 30, designing for the Abbey on tour.' },
  { year: 1968, type: 'Newspaper', title: '"One of Ireland\'s leading theatrical designers"', src: 'Midland Tribune, 16 Nov 1968, p.11', note: 'Birr Stage Guild costume-play feature: "The sets are being designed and painted by George Gavan Duffy, one of Ireland\'s leading theatrical designers, whose work for the Dublin Theatre Festival was highly praised."' },
  { year: 1975, type: 'Newspaper', title: 'Gladys interviewed about the Holland-blind trade', src: 'Evening Herald, 19 May 1975, p.6', note: '"There was a tremendous trade in Holland blinds years ago," says Gladys Duffy, whose grandfather had founded a lucrative drapery business in Thomas Street, Dublin. The place closed some years ago, after a flourishing 75-year run. An important sector of that firm\'s business had lain in the roller-blind field…"' },
  { year: 1981, type: 'Newspaper', title: 'Gladys, Honorary Secretary, National Association for the Aged', src: 'Irish Independent / Irish Press, 22 Dec 1981, p.8', note: 'Christmas thanks-message signed Gladys Duffy, Hon Sec, 80 Marlborough Street, Dublin 1. Service to the Association continued from at least 1969.' },
  { year: 1997, type: 'Newspaper', title: 'Gladys & Olga both alive, both linked to Quality Blinds', src: 'Evening Herald, 18 Sep 1997, p.102', note: 'A bereavement acknowledgement names "the management and staff of Quality Blinds, Miss Gladys Duffy and Mrs Olga Ward, who had a special Mass offered for Kitty." Gladys (81) still "Miss"; Olga (74) now Mrs Ward; the Holland-blind continuation of the firm carrying the name "Quality Blinds."' },
  { year: 2001, type: 'Newspaper', title: 'George Gavan Duffy — Hommages 2001 exhibition', src: 'Irish Examiner, 25 Aug 2001, p.16', note: '"Paintings by George Gavan Duffy, Glanmire, Cork until September 1. GEORGE Gavan Duffy was born in Dublin in 1937." Book-of-Kells-and-Irish-annals-inspired works at Riverstown House, Glanmire, following an earlier 2001 show at Bantry House.' },
  { year: 2008, type: 'Web', title: 'Hegarty Antiques exhibition catalogue & biography', src: 'hegartyantiques.com (Skibbereen, West Cork)', note: 'Twenty-four oil-on-canvas paintings: Khomas Hochlands, Brandberg, Skeleton Coast, Khomasdal, Rehoboth, the White Lady. Biography (by Ted Hegarty) names Mainie Jellett and George Russell (AE) as lodestars and quotes George\'s own line: "He travelled to Africa to spend a weekend and stayed for fifteen years!"' },
  { year: 1946, type: 'Newspaper', title: 'Mr & Mrs Tom Duffy of Wattle Park welcome new year — Sheila née Macklin', src: 'The Mail (Adelaide), 7 Dec 1946, p.11', note: '"Macklin and Mr. and Mrs. Tom Duffy — she was Sheila Macklin." Reveals Tom\'s wife as Sheila Macklin of the Wattle Park Macklin family; New Year\'s Eve party for 160 friends at the Macklin home.' },
  { year: 1946, type: 'Newspaper', title: 'A baby in the Duffy household by December 1946', src: 'The Mail (Adelaide), 28 Dec 1946, p.7', note: '"...Mr. and Mrs. Bruce Macklin, at their home at Wattle Park... MRS. TOM DUFFY, Mr. Duffy, and baby." Tom and Sheila had at least one child by late 1946.' },
  { year: 1947, type: 'Newspaper', title: 'Olga & Gladys arrive Adelaide on the SS Stratheden — Gladys\'s war revealed', src: 'The Mail (Adelaide), 2 Aug 1947, p.11', note: '"It has been an exciting week for Olga and Gladys Duffy, who arrived from Dublin in the Stratheden. Tom had not seen his sisters for nine years. They are staying at the South and plan to go to Melbourne, Sydney, and Tasmania in September. During the war Gladys worked with the Red Cross and was in Paris for some time before returning home, where she worked until the end of the war." Trove article 55896039.' },
  { year: 1950, type: 'Newspaper', title: 'Mrs Tom Duffy hosts tennis for visiting UK aviator', src: 'News (Adelaide), 24 & 29 March 1950', note: 'Mrs Tom Duffy of Wattle Park hosting tennis afternoons for a visiting British air woman; the Macklin family at the centre of the Adelaide social register through the late 1940s and early 1950s.' },
  { year: 2012, type: 'Newspaper', title: 'Death of George Gavan Duffy — full Westmeath Examiner obituary', src: 'Westmeath Examiner, 12 Jan 2013, p.16', note: '"The north Westmeath community, and that of the wider art world, was saddened to learn of the death on Thursday December 13, of Mr George Gavan Duffy, Templefanum, Castlepollard… George was a native of Dublin… spent more than 15 years in Africa — South Africa and Namibia, and his art was influenced by the worlds of opera, ballet and drama both in Ireland and abroad… He was deeply religious, and enjoyed frequent pilgrimages to Compostella." Buried St Mary\'s Cemetery, Collinstown — alongside his mother Kathleen.' },
  { year: 2012, type: 'Newspaper', title: 'Death of George Gavan Duffy — earlier Topic notice ("free spirit")', src: 'Topic / Topic Westmeath, 3 Jan 2013, p.37', note: 'A shorter notice the week before the Westmeath Examiner one. "Described as being a \'free spirit\' George had spent many years living in Africa and also enjoyed frequent pilgrimages to Compostela." Survived by sister, brother-in-law, nieces.' },
  { year: 1984, type: 'Newspaper', title: 'Death notice — Kathleen Duffy, 13 May 1984', src: 'Evening Herald / Irish Independent, 15 May 1984', note: '"DUFFY (Mullingar) — May 13, 1984, at the Sacred Heart Hospital, Ballinderry. Kathleen, relict of Patrick Gavan Duffy, Undercliffe, Killiney." Funeral to Collinstown Cemetery, Westmeath.' },
  { year: 1996, type: 'Newspaper', title: 'Undercliff sold for £960,000+ at auction — formerly the FX Buckley family home', src: 'Evening Herald, 27 May 1996 + Irish Independent, 30 May 1996', note: 'After Kathleen sold Undercliff in November 1954, the house was bought by FX Buckley, the Dublin meat merchant, who held it until May 1996. Sold at auction for over £960,000. Bono was already a Killiney neighbour by then.' },
];
