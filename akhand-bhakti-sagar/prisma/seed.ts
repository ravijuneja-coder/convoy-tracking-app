import { PrismaClient, ContentType, PostStatus, VideoType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ─── Admin User ───────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@akhandbhaktisagar.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin@123';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      username: 'admin',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // ─── Categories ───────────────────────────────────────────────────────────
  const categoryData = [
    {
      name: 'Bhajan',
      slug: 'bhajan',
      description: 'भक्ति भजन - भगवान की स्तुति में गाए जाने वाले भक्ति गीत',
    },
    {
      name: 'Aarti',
      slug: 'aarti',
      description: 'आरती - देवी-देवताओं की पूजा में गाई जाने वाली आरती',
    },
    {
      name: 'Chalisa',
      slug: 'chalisa',
      description: 'चालीसा - चालीस चौपाइयों से बनी भक्ति रचनाएँ',
    },
    {
      name: 'Mantra',
      slug: 'mantra',
      description: 'मंत्र - पवित्र वैदिक और तांत्रिक मंत्र',
    },
    {
      name: 'Stotra',
      slug: 'stotra',
      description: 'स्तोत्र - देवताओं की स्तुति में रचित स्तोत्र',
    },
    {
      name: 'Bhakti Geet',
      slug: 'bhakti-geet',
      description: 'भक्ति गीत - आधुनिक और पारंपरिक भक्ति संगीत',
    },
    {
      name: 'Article',
      slug: 'article',
      description: 'लेख - धर्म, अध्यात्म और संस्कृति पर विचारशील लेख',
    },
    {
      name: 'Festival',
      slug: 'festival',
      description: 'त्योहार - हिंदू त्योहारों की जानकारी और महत्व',
    },
    {
      name: 'Katha',
      slug: 'katha',
      description: 'कथा - पुराणों और धर्मग्रंथों की पावन कथाएँ',
    },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoryData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[cat.slug] = created.id;
  }
  console.log(`✅ ${categoryData.length} categories seeded`);

  // ─── Deities ──────────────────────────────────────────────────────────────
  const deityData = [
    {
      name: 'Hanuman Ji',
      nameHindi: 'हनुमान जी',
      slug: 'hanuman-ji',
      description:
        'श्री हनुमान जी - बजरंगबली, पवनपुत्र, केसरीनंदन। रामभक्त हनुमान जी शक्ति, भक्ति और वैराग्य के प्रतीक हैं।',
      seoTitle: 'हनुमान जी - भजन, आरती, चालीसा | Akhand Bhakti Sagar',
    },
    {
      name: 'Shiva Ji',
      nameHindi: 'शिव जी',
      slug: 'shiva-ji',
      description:
        'भगवान शिव - महादेव, नीलकंठ, त्रिनेत्र। सृष्टि के संहारक और कल्याण के देवता।',
      seoTitle: 'शिव जी - भजन, आरती, मंत्र | Akhand Bhakti Sagar',
    },
    {
      name: 'Shri Krishna',
      nameHindi: 'श्री कृष्ण',
      slug: 'shri-krishna',
      description:
        'श्री कृष्ण - गोविंद, माखनचोर, मुरलीधर। प्रेम और भक्ति के परम अवतार।',
      seoTitle: 'श्री कृष्ण - भजन, आरती, भक्ति गीत | Akhand Bhakti Sagar',
    },
    {
      name: 'Shri Ram',
      nameHindi: 'श्री राम',
      slug: 'shri-ram',
      description:
        'श्री राम - मर्यादा पुरुषोत्तम, रघुनंदन, दशरथ नंदन। आदर्श पुरुष और धर्म के अवतार।',
      seoTitle: 'श्री राम - भजन, आरती, चालीसा | Akhand Bhakti Sagar',
    },
    {
      name: 'Mata Rani',
      nameHindi: 'माता रानी',
      slug: 'mata-rani',
      description:
        'माता रानी - दुर्गा, अम्बे, शेरावाली। शक्ति की देवी, जगदम्बा, सबकी माँ।',
      seoTitle: 'माता रानी - भजन, आरती, चालीसा | Akhand Bhakti Sagar',
    },
    {
      name: 'Ganesh Ji',
      nameHindi: 'गणेश जी',
      slug: 'ganesh-ji',
      description:
        'श्री गणेश जी - गणपति, विघ्नहर्ता, मंगलमूर्ति। विद्या, बुद्धि और समृद्धि के देवता।',
      seoTitle: 'गणेश जी - भजन, आरती, चालीसा | Akhand Bhakti Sagar',
    },
    {
      name: 'Sai Baba',
      nameHindi: 'साईं बाबा',
      slug: 'sai-baba',
      description:
        'शिरडी साईं बाबा - सबका मालिक एक। हिंदू-मुस्लिम एकता के प्रतीक संत।',
      seoTitle: 'साईं बाबा - भजन, आरती, भक्ति गीत | Akhand Bhakti Sagar',
    },
    {
      name: 'Radha Rani',
      nameHindi: 'राधा रानी',
      slug: 'radha-rani',
      description:
        'श्री राधा रानी - वृंदावन की रानी, कृष्ण की प्रिया, प्रेम की देवी।',
      seoTitle: 'राधा रानी - भजन, आरती | Akhand Bhakti Sagar',
    },
    {
      name: 'Vishnu Ji',
      nameHindi: 'विष्णु जी',
      slug: 'vishnu-ji',
      description:
        'भगवान विष्णु - नारायण, पालनहार, त्रिदेव के पालक। जगत के पालनकर्ता।',
      seoTitle: 'विष्णु जी - भजन, आरती, स्तोत्र | Akhand Bhakti Sagar',
    },
    {
      name: 'Durga Maa',
      nameHindi: 'दुर्गा माँ',
      slug: 'durga-maa',
      description:
        'माँ दुर्गा - नवदुर्गा, चण्डिका, महाशक्ति। असुरों का नाश करने वाली महादेवी।',
      seoTitle: 'दुर्गा माँ - भजन, आरती, चालीसा | Akhand Bhakti Sagar',
    },
  ];

  const deities: Record<string, string> = {};
  for (const deity of deityData) {
    const created = await prisma.deity.upsert({
      where: { slug: deity.slug },
      update: {},
      create: deity,
    });
    deities[deity.slug] = created.id;
  }
  console.log(`✅ ${deityData.length} deities seeded`);

  // ─── Posts ────────────────────────────────────────────────────────────────
  const now = new Date();

  const postsData: Array<{
    title: string;
    slug: string;
    contentType: ContentType;
    description: string;
    lyrics: string;
    status: PostStatus;
    publishedAt: Date;
    videoType: VideoType;
    videoUrl?: string;
    authorId: string;
    categoryId: string;
    deityId: string;
    seoTitle: string;
    seoKeywords: string;
    viewCount: number;
  }> = [
    // ── Hanuman Ji (5 posts) ────────────────────────────────────────────────
    {
      title: 'श्री हनुमान चालीसा',
      slug: 'shri-hanuman-chalisa',
      contentType: ContentType.CHALISA,
      description:
        'गोस्वामी तुलसीदास जी द्वारा रचित श्री हनुमान चालीसा - चालीस चौपाइयों से बनी यह पवित्र रचना हनुमान जी की महिमा का वर्णन करती है।',
      lyrics: `दोहा:
श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि।
बरनउँ रघुबर बिमल जसु, जो दायकु फल चारि॥
बुद्धिहीन तनु जानिके, सुमिरौं पवन-कुमार।
बल बुधि बिद्या देहु मोहिं, हरहु कलेस बिकार॥

चौपाई:
जय हनुमान ज्ञान गुन सागर।
जय कपीस तिहुँ लोक उजागर॥
राम दूत अतुलित बल धामा।
अंजनि-पुत्र पवनसुत नामा॥
महाबीर बिक्रम बजरंगी।
कुमति निवार सुमति के संगी॥
कंचन बरन बिराज सुबेसा।
कानन कुण्डल कुंचित केसा॥
हाथ बज्र औ ध्वजा बिराजै।
काँधे मूँज जनेऊ साजै॥
शंकर सुवन केसरी नन्दन।
तेज प्रताप महा जग वन्दन॥
विद्यावान गुनी अति चातुर।
राम काज करिबे को आतुर॥
प्रभु चरित्र सुनिबे को रसिया।
राम लखन सीता मन बसिया॥
सूक्ष्म रूप धरि सियहिं दिखावा।
बिकट रूप धरि लंक जरावा॥
भीम रूप धरि असुर संहारे।
रामचन्द्र के काज संवारे॥
लाय सजीवन लखन जियाये।
श्रीरघुबीर हरषि उर लाये॥
रघुपति कीन्ही बहुत बड़ाई।
तुम मम प्रिय भरतहि सम भाई॥
सहस बदन तुम्हरो जस गावैं।
अस कहि श्रीपति कण्ठ लगावैं॥
सनकादिक ब्रह्मादि मुनीसा।
नारद सारद सहित अहीसा॥
जम कुबेर दिगपाल जहाँ ते।
कबि कोबिद कहि सके कहाँ ते॥
तुम उपकार सुग्रीवहिं कीन्हा।
राम मिलाय राज-पद दीन्हा॥
तुम्हरो मन्त्र बिभीषन माना।
लंकेश्वर भए सब जग जाना॥
जुग सहस्र जोजन पर भानू।
लील्यो ताहि मधुर फल जानू॥
प्रभु मुद्रिका मेलि मुख माहीं।
जलधि लाँघि गये अचरज नाहीं॥
दुर्गम काज जगत के जेते।
सुगम अनुग्रह तुम्हरे तेते॥
राम दुआरे तुम रखवारे।
होत न आज्ञा बिनु पैसारे॥
सब सुख लहै तुम्हारी सरना।
तुम रच्छक काहू को डर ना॥
आपन तेज सम्हारो आपै।
तीनों लोक हाँक ते काँपै॥
भूत पिशाच निकट नहिं आवै।
महाबीर जब नाम सुनावै॥
नासै रोग हरै सब पीरा।
जपत निरन्तर हनुमत बीरा॥
संकट से हनुमान छुड़ावै।
मन क्रम बचन ध्यान जो लावै॥
सब पर राम तपस्वी राजा।
तिन के काज सकल तुम साजा॥
और मनोरथ जो कोई लावै।
सोई अमित जीवन फल पावै॥
चारों जुग परताप तुम्हारा।
है परसिद्ध जगत उजियारा॥
साधु सन्त के तुम रखवारे।
असुर निकन्दन राम दुलारे॥
अष्ट सिद्धि नव निधि के दाता।
अस बर दीन जानकी माता॥
राम रसायन तुम्हरे पासा।
सदा रहो रघुपति के दासा॥
तुम्हरे भजन राम को पावै।
जनम जनम के दुख बिसरावै॥
अन्त काल रघुबर पुर जाई।
जहाँ जन्म हरि-भक्त कहाई॥
और देवता चित्त न धरई।
हनुमत सेई सर्ब सुख करई॥
संकट कटै मिटै सब पीरा।
जो सुमिरै हनुमत बलबीरा॥
जय जय जय हनुमान गोसाईं।
कृपा करहु गुरुदेव की नाईं॥
जो सत बार पाठ कर कोई।
छूटहि बन्दि महा सुख होई॥
जो यह पढ़ै हनुमान चालीसा।
होय सिद्धि साखी गौरीसा॥
तुलसीदास सदा हरि चेरा।
कीजै नाथ हृदय मँह डेरा॥

दोहा:
पवन तनय संकट हरन, मंगल मूरति रूप।
राम लखन सीता सहित, हृदय बसहु सुर भूप॥`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      videoType: VideoType.YOUTUBE_URL,
      videoUrl: 'https://www.youtube.com/watch?v=ajjaDP9gZ4A',
      authorId: admin.id,
      categoryId: categories['chalisa'],
      deityId: deities['hanuman-ji'],
      seoTitle: 'श्री हनुमान चालीसा - पाठ, अर्थ और महत्व | Akhand Bhakti Sagar',
      seoKeywords: 'हनुमान चालीसा, hanuman chalisa, बजरंगबली, पवनपुत्र',
      viewCount: 15420,
    },
    {
      title: 'बजरंग बाण - श्री हनुमान जी की स्तुति',
      slug: 'bajrang-baan-hanuman',
      contentType: ContentType.STOTRA,
      description:
        'बजरंग बाण हनुमान जी का अत्यंत शक्तिशाली और प्रभावशाली स्तोत्र है। इसका पाठ करने से सभी संकट दूर होते हैं।',
      lyrics: `दोहा:
निश्चय प्रेम प्रतीति ते, विनय करें सनमान।
तेहि के कारज सकल शुभ, सिद्ध करें हनुमान॥

चौपाई:
जय हनुमंत संत हितकारी।
सुन लीजै प्रभु अरज हमारी॥
जन के काज विलंब न कीजै।
आतुर दौरि महा सुख दीजै॥
जैसे कूदि सिंधु महि पारा।
सुरसा बदन पैठि विस्तारा॥
आगे जाय लंकिनी रोका।
मारेहु लात गई सुर लोका॥
जाय विभीषन को सुख दीन्हा।
सीता निरखि परमपद लीन्हा॥
बाग उजारि सिन्धु महँ बोरा।
अति आतुर जमकातर तोरा॥
अक्षय कुमार मारि संहारा।
लूम लपेटि लंक को जारा॥
लाह लगाई लंका जरि गई।
राक्षस सेना सब मारि लई॥
मूर्छित लखन लिये दृढ़ धारी।
हँसि-हँसि पुनि पुनि रघुपति उर लारी॥
राम दुआरे तुम रखवारे।
होत न आज्ञा बिनु पैसारे॥

दोहा:
यह बजरंग बाण जो जापै।
सकल संकट प्रभु टारि न छापै॥
तुलसी रामचरन मन लाई।
हनुमत सेवा करहु भाई॥`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      videoType: VideoType.NONE,
      authorId: admin.id,
      categoryId: categories['stotra'],
      deityId: deities['hanuman-ji'],
      seoTitle: 'बजरंग बाण - पूर्ण पाठ | Akhand Bhakti Sagar',
      seoKeywords: 'बजरंग बाण, bajrang baan, हनुमान स्तोत्र, संकट मोचन',
      viewCount: 8930,
    },
    {
      title: 'हनुमान जी की आरती - आरती कीजे हनुमान लला की',
      slug: 'hanuman-aarti-lala-ki',
      contentType: ContentType.AARTI,
      description:
        'श्री हनुमान जी की प्रसिद्ध आरती जो प्रतिदिन मंदिरों में गाई जाती है। हनुमान जी को प्रसन्न करने के लिए इस आरती का पाठ करें।',
      lyrics: `आरती कीजे हनुमान लला की।
दुष्ट दलन रघुनाथ कला की॥

जाके बल से गिरिवर काँपै।
रोग दोष जाके निकट न झाँकै॥
अंजनि पुत्र महा बलदाई।
सन्तन के प्रभु सदा सहाई॥

आरती कीजे हनुमान लला की।
दुष्ट दलन रघुनाथ कला की॥

दे बीड़ा रघुपति तुरंत सिधाए।
लंका जारि सिया सुधि लाए॥
लंका सो कोट समुद्र सी खाई।
जात पवनसुत बार न लाई॥

आरती कीजे हनुमान लला की।
दुष्ट दलन रघुनाथ कला की॥

लंका जारत रावण डरायो।
राक्षस सेना को बल संहारे।
श्री रघुबीर के काज संवारे॥

आरती कीजे हनुमान लला की।
दुष्ट दलन रघुनाथ कला की॥

पैठि पाताल तोरि यमकारे।
अहिरावण की भुजा उखाड़े॥
बाँई भुजा असुर दल मारे।
दाहिनी भुज सब संत उबारे॥

आरती कीजे हनुमान लला की।
दुष्ट दलन रघुनाथ कला की॥

जय जय जय हनुमान गोसाईं।
कृपा करो गुरुदेव की नाईं॥`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      videoType: VideoType.NONE,
      authorId: admin.id,
      categoryId: categories['aarti'],
      deityId: deities['hanuman-ji'],
      seoTitle: 'हनुमान जी की आरती | Akhand Bhakti Sagar',
      seoKeywords: 'हनुमान आरती, hanuman aarti, बजरंगबली आरती',
      viewCount: 6540,
    },
    {
      title: 'मेरे हनुमान - भजन',
      slug: 'mere-hanuman-bhajan',
      contentType: ContentType.BHAJAN,
      description:
        'हनुमान जी को समर्पित एक अत्यंत मधुर और भाव-विभोर करने वाला भजन। इस भजन को सुनकर मन में शांति और आनंद की अनुभूति होती है।',
      lyrics: `मेरे हनुमान तुम सा कोई नहीं,
तुम बिन जीना मेरे हाँ नहीं॥

राम काज के तुम हो सेवक,
भक्ति भाव से सब लाज रखत।
जय जय हनुमान, जय जय भगवान,
तुम्हरी महिमा अपरम्पार॥

मेरे हनुमान तुम सा कोई नहीं...

पवनपुत्र तुम बल के सागर,
लंका जलाई एक ही बार।
सीता माता की खोज में गए,
राम भक्ति में एकाकार॥

मेरे हनुमान तुम सा कोई नहीं...

संकट मोचन नाम है तेरा,
दूर करो सब पीर हमारी।
शरण में आए हम बालक तेरे,
रखो लाज महाराज हमारी॥

मेरे हनुमान तुम सा कोई नहीं,
तुम बिन जीना मेरे हाँ नहीं॥`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      videoType: VideoType.YOUTUBE_URL,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      authorId: admin.id,
      categoryId: categories['bhajan'],
      deityId: deities['hanuman-ji'],
      seoTitle: 'मेरे हनुमान भजन | Akhand Bhakti Sagar',
      seoKeywords: 'हनुमान भजन, hanuman bhajan, बजरंगबली भजन',
      viewCount: 3210,
    },
    {
      title: 'श्री हनुमान अष्टक',
      slug: 'shri-hanuman-ashtak',
      contentType: ContentType.STOTRA,
      description:
        'श्री हनुमान अष्टक - आठ श्लोकों में हनुमान जी की महिमा का वर्णन करने वाला यह स्तोत्र अत्यंत फलदायी है।',
      lyrics: `बाल समय रवि भक्षि लियो तब,
तीनहुँ लोक भयो अँधियारो।
ताहि सों त्रास भयो जग को,
यह संकट काहु सों जात न टारो॥
देवन आनि करी बिनती तब,
छाड़ि दियो रवि कष्ट निवारो।
को नहिं जानत है जग में कपि,
संकटमोचन नाम तिहारो॥

बालि की त्रास कपीस बसें गिरि,
जात महाप्रभु पंथ निहारो।
चौकि महाभट लूटि लियो तब,
राम रखे तेहि ताहि उबारो॥
को नहिं जानत है जग में कपि,
संकटमोचन नाम तिहारो॥

अंगद के संग लेन गए सिय,
खोज कपीस यह बैन उचारो।
जीवत ना बचिहौ हम सो जु,
बिना सुधि लाए इहाँ पगु धारो॥
को नहिं जानत है जग में कपि,
संकटमोचन नाम तिहारो॥`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      videoType: VideoType.NONE,
      authorId: admin.id,
      categoryId: categories['stotra'],
      deityId: deities['hanuman-ji'],
      seoTitle: 'श्री हनुमान अष्टक | Akhand Bhakti Sagar',
      seoKeywords: 'हनुमान अष्टक, hanuman ashtak, संकट मोचन',
      viewCount: 2870,
    },

    // ── Shiva Ji (3 posts) ──────────────────────────────────────────────────
    {
      title: 'ॐ नमः शिवाय - महामंत्र',
      slug: 'om-namah-shivaya-mahamantra',
      contentType: ContentType.MANTRA,
      description:
        'ॐ नमः शिवाय पंचाक्षर मंत्र भगवान शिव का सबसे पवित्र और शक्तिशाली मंत्र है। इसके नियमित जाप से मन की शांति, शरीर की आरोग्यता और आत्मिक उन्नति होती है।',
      lyrics: `ॐ नमः शिवाय॥
ॐ नमः शिवाय॥
ॐ नमः शिवाय॥

नमः शिवाय शान्ताय कारणत्रय हेतवे।
निवेदयामि चात्मानं त्वं गतिः परमेश्वर॥

ॐ नमः शिवाय - अर्थ:
न - पृथ्वी तत्व
म - जल तत्व
शि - अग्नि तत्व
वा - वायु तत्व
य - आकाश तत्व

यह पाँच तत्वों का प्रतीक है जिनसे यह सृष्टि बनी है।
शिव इन पाँचों तत्वों के अधिपति हैं।

जाप विधि:
प्रतिदिन 108 बार या 1008 बार जाप करें।
रुद्राक्ष माला से जाप करना अत्यंत शुभ है।
शिवलिंग के सामने बैठकर जाप करें।

ॐ नमः शिवाय॥
हर हर महादेव॥
जय भोलेनाथ॥`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      videoType: VideoType.NONE,
      authorId: admin.id,
      categoryId: categories['mantra'],
      deityId: deities['shiva-ji'],
      seoTitle: 'ॐ नमः शिवाय - पंचाक्षर मंत्र | Akhand Bhakti Sagar',
      seoKeywords: 'ॐ नमः शिवाय, om namah shivaya, शिव मंत्र, महादेव मंत्र',
      viewCount: 12300,
    },
    {
      title: 'शिव तांडव स्तोत्रम्',
      slug: 'shiv-tandav-stotram',
      contentType: ContentType.STOTRA,
      description:
        'रावण रचित शिव तांडव स्तोत्रम् - संस्कृत साहित्य की एक अनुपम रचना जो भगवान शिव के तांडव नृत्य का वर्णन करती है।',
      lyrics: `जटाटवीगलज्जलप्रवाहपावितस्थले
गलेऽवलम्ब्य लम्बितां भुजंगतुंगमालिकाम्।
डमड्डमड्डमड्डमन्निनादवड्डमर्वयं
चकार चण्डताण्डवं तनोतु नः शिवः शिवम्॥

जटाकटाहसम्भ्रमभ्रमन्निलिम्पनिर्झरी
विलोलवीचिवल्लरीविराजमानमूर्धनि।
धगद्धगद्धगज्ज्वलल्ललाटपट्टपावके
किशोरचन्द्रशेखरे रतिः प्रतिक्षणं मम॥

धराधरेन्द्रनंदिनीविलासबन्धुबन्धुर
स्फुरद्दिगन्तसन्ततिप्रमोदमानमानसे।
कृपाकटाक्षधोरणीनिरुद्धदुर्धरापदि
क्वचिद्दिगम्बरे(ब्रे) मनो विनोदमेतु वस्तुनि॥

जटाभुजंगपिंगलस्फुरत्फणामणिप्रभा
कदम्बकुंकुमद्रवप्रलिप्तदिग्वधूमुखे।
मदान्धसिन्धुरस्फुरत्त्वगुत्तरीयमेदुरे
मनो विनोदमद्भुतं बिभर्तु भूतभर्तरि॥

सहस्रलोचनप्रभृत्यशेषलेखशेखर
प्रसूनधूलिधोरणीविधूसराङ्घ्रिपीठभूः।
भुजंगराजमालया निबद्धजाटजूटकः
श्रियैचिरायजायतां चकोरबन्धुशेखरः॥`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      videoType: VideoType.NONE,
      authorId: admin.id,
      categoryId: categories['stotra'],
      deityId: deities['shiva-ji'],
      seoTitle: 'शिव तांडव स्तोत्रम् - रावण रचित | Akhand Bhakti Sagar',
      seoKeywords: 'शिव तांडव, shiv tandav stotram, महादेव स्तोत्र, रावण कृत',
      viewCount: 9870,
    },
    {
      title: 'हर हर महादेव - शिव भजन',
      slug: 'har-har-mahadev-bhajan',
      contentType: ContentType.BHAJAN,
      description:
        'भगवान शिव की महिमा का गुणगान करने वाला यह भजन शिव भक्तों में अत्यंत लोकप्रिय है। सावन मास में इसे विशेष रूप से गाया जाता है।',
      lyrics: `हर हर महादेव, शंभू काशी विश्वनाथ गंगे।
हर हर महादेव, शंभू काशी विश्वनाथ गंगे॥

भोले बाबा नमो नमो,
काशी वाले नमो नमो,
हिमगिरि वाले नमो नमो,
महाकाल नमो नमो॥

हर हर महादेव, शंभू काशी विश्वनाथ गंगे॥

जटाजूट वाले बाबा,
नंदी के रखवाले बाबा,
त्रिशूल वाले बाबा,
डमरू वाले बाबा॥

हर हर महादेव, शंभू काशी विश्वनाथ गंगे॥

गौरी के स्वामी बाबा,
कार्तिक के दादा बाबा,
गणेश के पिता बाबा,
सर्प गले के बाबा॥

हर हर महादेव, शंभू काशी विश्वनाथ गंगे।
हर हर महादेव, शंभू काशी विश्वनाथ गंगे॥`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      videoType: VideoType.YOUTUBE_URL,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      authorId: admin.id,
      categoryId: categories['bhajan'],
      deityId: deities['shiva-ji'],
      seoTitle: 'हर हर महादेव शिव भजन | Akhand Bhakti Sagar',
      seoKeywords: 'महादेव भजन, shiv bhajan, बोले बम, सावन भजन',
      viewCount: 7650,
    },

    // ── Shri Krishna (3 posts) ──────────────────────────────────────────────
    {
      title: 'हरे कृष्ण महामंत्र',
      slug: 'hare-krishna-mahamantra',
      contentType: ContentType.MANTRA,
      description:
        'हरे कृष्ण महामंत्र - कलियुग में मुक्ति का सर्वश्रेष्ठ मार्ग। इस महामंत्र का जाप करने से मन की चंचलता दूर होती है और भगवान कृष्ण की कृपा प्राप्त होती है।',
      lyrics: `हरे कृष्ण हरे कृष्ण
कृष्ण कृष्ण हरे हरे।
हरे राम हरे राम
राम राम हरे हरे॥

हरे कृष्ण हरे कृष्ण
कृष्ण कृष्ण हरे हरे।
हरे राम हरे राम
राम राम हरे हरे॥

यह महामंत्र श्रीमद्भागवत में वर्णित है।
कलियुग में इस मंत्र का जाप सबसे सरल और
प्रभावशाली मुक्ति का मार्ग है।

जाप विधि:
तुलसी माला पर 108 बार जाप करें।
प्रातःकाल स्नान के बाद जाप करना उत्तम है।
मन को एकाग्र करके, कृष्ण के रूप का ध्यान करते हुए जाप करें।

राधे राधे॥
जय श्री कृष्ण॥`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      videoType: VideoType.NONE,
      authorId: admin.id,
      categoryId: categories['mantra'],
      deityId: deities['shri-krishna'],
      seoTitle: 'हरे कृष्ण महामंत्र - जाप विधि और महत्व | Akhand Bhakti Sagar',
      seoKeywords: 'हरे कृष्ण, hare krishna mahamantra, कृष्ण मंत्र, कलियुग मंत्र',
      viewCount: 11200,
    },
    {
      title: 'मुरली की धुन पर - कृष्ण भजन',
      slug: 'murli-ki-dhun-krishna-bhajan',
      contentType: ContentType.BHAJAN,
      description:
        'श्री कृष्ण की मुरली की मधुर धुन पर आधारित यह भजन भक्तों को वृंदावन की याद दिलाता है और मन में प्रेम और भक्ति का संचार करता है।',
      lyrics: `मुरली की धुन पर नाचे मेरा मन,
बृज के बाँसुरी वाले की याद आई रे॥

गोकुल की गलियों में, यमुना के तट पर,
राधा संग खेले कन्हाई।
मटकी फोड़ माखन खाए,
गोपियों के मन को भाई॥

मुरली की धुन पर नाचे मेरा मन...

पीली पितांबर, मोर मुकुट धारे,
वंशी बजाए गिरधारी।
नंदलाल मेरे दिल में बसे,
श्याम सुंदर बनवारी॥

मुरली की धुन पर नाचे मेरा मन...

राधे राधे जपो भाई,
कृष्ण कन्हैया की महिमा गाई।
वृंदावन की धूल माथे लगाओ,
भव सागर से हो जाओ पारे॥

मुरली की धुन पर नाचे मेरा मन,
बृज के बाँसुरी वाले की याद आई रे॥`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      videoType: VideoType.NONE,
      authorId: admin.id,
      categoryId: categories['bhajan'],
      deityId: deities['shri-krishna'],
      seoTitle: 'मुरली की धुन कृष्ण भजन | Akhand Bhakti Sagar',
      seoKeywords: 'कृष्ण भजन, krishna bhajan, मुरलीधर भजन, वृंदावन भजन',
      viewCount: 5430,
    },
    {
      title: 'श्री कृष्ण आरती - ॐ जय जगदीश हरे',
      slug: 'krishna-aarti-om-jai-jagdish-hare',
      contentType: ContentType.AARTI,
      description:
        'ॐ जय जगदीश हरे - यह भारत की सबसे प्रसिद्ध और सार्वभौमिक आरती है जो प्रतिदिन लाखों घरों में गाई जाती है।',
      lyrics: `ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे।
भक्त जनों के संकट, क्षण में दूर करे॥
ॐ जय जगदीश हरे॥

जो ध्यावे फल पावे, दुख विनशे मन का।
सुख सम्पत्ति घर आवे, कष्ट मिटे तन का॥
ॐ जय जगदीश हरे॥

मात पिता तुम मेरे, शरण गहूँ मैं किसकी।
तुम बिन और न दूजा, आस करूँ मैं जिसकी॥
ॐ जय जगदीश हरे॥

तुम पूरण परमात्मा, तुम अन्तर्यामी।
पारब्रह्म परमेश्वर, तुम सबके स्वामी॥
ॐ जय जगदीश हरे॥

तुम करुणा के सागर, तुम पालनकर्ता।
मैं मूर्ख खल कामी, कृपा करो भर्ता॥
ॐ जय जगदीश हरे॥

तुम हो एक अगोचर, सबके प्राण पति।
किस विधि मिलूँ दयामय, तुमको मैं कुमति॥
ॐ जय जगदीश हरे॥

दीनबंधु दुखहर्ता, तुम ठाकुर मेरे।
अपने हाथ उठाओ, द्वार पड़ा मैं तेरे॥
ॐ जय जगदीश हरे॥

विषय विकार मिटाओ, पाप हरो देवा।
श्रद्धा भक्ति बढ़ाओ, संतन की सेवा॥
ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे।
भक्त जनों के संकट, क्षण में दूर करे॥
ॐ जय जगदीश हरे॥`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      videoType: VideoType.NONE,
      authorId: admin.id,
      categoryId: categories['aarti'],
      deityId: deities['shri-krishna'],
      seoTitle: 'ॐ जय जगदीश हरे आरती | Akhand Bhakti Sagar',
      seoKeywords: 'जय जगदीश हरे, aarti, कृष्ण आरती, जगदीश आरती',
      viewCount: 14750,
    },

    // ── Shri Ram (3 posts) ──────────────────────────────────────────────────
    {
      title: 'श्री राम स्तुति - श्री रामचन्द्र कृपालु भज मन',
      slug: 'shri-ram-stuti-ramchandra-kripalu',
      contentType: ContentType.STOTRA,
      description:
        'गोस्वामी तुलसीदास जी द्वारा रचित श्री राम स्तुति - यह पद श्री राम के दिव्य स्वरूप का अत्यंत सुंदर वर्णन करती है।',
      lyrics: `श्रीरामचन्द्र कृपालु भज मन हरण भव भय दारुणम्।
नव कंज लोचन कंज मुख कर कंज पद कंजारुणम्॥

कंदर्प अगणित अमित छबि नव नील नीरद सुन्दरम्।
पटपीत मानहु तड़ित रुचि शुचि नौमि जनक सुतावरम्॥

भजु दीनबन्धु दिनेश दानव दैत्य वंश निकन्दनम्।
रघुनन्द आनन्दकन्द कोशल चन्द दशरथ नन्दनम्॥

शिर मुकुट कुण्डल तिलक चारु उदार अङ्ग विभूषणम्।
आजानुभुज शर-चाप-धर संग्राम जित खर-दूषणम्॥

इति वदति तुलसीदास शंकर शेष मुनि मन रंजनम्।
मम हृदय कंज निवास कुरु कामादि खल दल गंजनम्॥

मनु जाहिं राचेउ मिलिहि सो बरु सहज सुन्दर साँवरो।
करुना निधान सुजान सीलु सनेहु जानत रावरो॥

एहि भाँति गौरी असीस सुनत सिय सहित हियँ हरषी अली।
तुलसी भवानिहि पूजि पुनि पुनि मुदित मन मंदिर चली॥`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      videoType: VideoType.NONE,
      authorId: admin.id,
      categoryId: categories['stotra'],
      deityId: deities['shri-ram'],
      seoTitle: 'श्री राम स्तुति - तुलसीदास | Akhand Bhakti Sagar',
      seoKeywords: 'राम स्तुति, ram stuti, रामचंद्र कृपालु, तुलसीदास',
      viewCount: 8900,
    },
    {
      title: 'राम नाम की महिमा - भजन',
      slug: 'ram-naam-mahima-bhajan',
      contentType: ContentType.BHAJAN,
      description:
        'राम नाम की महिमा अपरम्पार है। इस भजन में राम नाम के जाप का महत्व बताया गया है जो भव सागर से पार करने में सक्षम है।',
      lyrics: `राम नाम की लूट है, लूट सको तो लूट।
अन्त काल पछताओगे, प्राण जायेंगे छूट॥

राम नाम की महिमा न्यारी,
जो जपे सो हो पार।
भव सागर से तारण हारा,
राम नाम आधार॥

राम नाम की लूट है...

सीता राम, जय राम, जय जय राम।
जपते रहो हर पल हर घड़ी यह नाम।
पापों से मिलेगी मुक्ति,
दुखों का होगा अंत।
राम नाम जपने से मिलती है,
मन को परम शांत॥

राम नाम की लूट है...

रघुपति राघव राजा राम,
पतित पावन सीता राम।
भेद नहीं है किसी में ईश्वर,
सबको सन्मति दे भगवान॥

राम नाम की लूट है, लूट सको तो लूट।
अन्त काल पछताओगे, प्राण जायेंगे छूट॥`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      videoType: VideoType.NONE,
      authorId: admin.id,
      categoryId: categories['bhajan'],
      deityId: deities['shri-ram'],
      seoTitle: 'राम नाम की महिमा भजन | Akhand Bhakti Sagar',
      seoKeywords: 'राम नाम, ram naam bhajan, रघुपति राघव, राम भजन',
      viewCount: 6780,
    },
    {
      title: 'श्री राम आरती',
      slug: 'shri-ram-aarti',
      contentType: ContentType.AARTI,
      description:
        'श्री राम जी की प्रिय आरती जो प्रतिदिन राम मंदिरों में गाई जाती है। इस आरती से प्रभु राम की विशेष कृपा प्राप्त होती है।',
      lyrics: `आरती कीजे रामचन्द्र की।
नाम सुमिरन रामचन्द्र की॥

जानकी जीवन सुखद रघुनन्दन,
भव भय खंडन, आनन्द के सागर।
दाशरथी राघव दशरथ नन्दन,
शरण गहूँ मैं मन में उर लागर॥

आरती कीजे रामचन्द्र की॥

हाथ धनुष बाण शोभित है अति,
राजीव नयन धरे पीतांबर।
सीता-लक्ष्मण सेवित रघुपति,
जय जय राम, जय जय रघुवर॥

आरती कीजे रामचन्द्र की॥

भरत शत्रुघ्न सुरेश निषादर,
हनुमत सेवक वानर-भालु।
जय जय रघुबर जय जय रामा,
तुम हो सुखद कृपालु दयालु॥

आरती कीजे रामचन्द्र की।
नाम सुमिरन रामचन्द्र की॥`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      videoType: VideoType.NONE,
      authorId: admin.id,
      categoryId: categories['aarti'],
      deityId: deities['shri-ram'],
      seoTitle: 'श्री राम आरती | Akhand Bhakti Sagar',
      seoKeywords: 'राम आरती, ram aarti, रघुनंदन आरती, रामचंद्र आरती',
      viewCount: 5620,
    },

    // ── Ganesh Ji (3 posts) ─────────────────────────────────────────────────
    {
      title: 'श्री गणेश चालीसा',
      slug: 'shri-ganesh-chalisa',
      contentType: ContentType.CHALISA,
      description:
        'श्री गणेश चालीसा - विघ्नहर्ता गणपति की महिमा का गुणगान करने वाली यह चालीसा किसी भी शुभ कार्य के प्रारंभ में पढ़ी जाती है।',
      lyrics: `दोहा:
जय गणपति सदगुण सदन, कविवर बदन कृपाल।
विघ्न हरण मंगल करण, जय जय गिरिजालाल॥

चौपाई:
जय जय जय गणपति गणराजू।
मंगल भरण करण शुभ काजू॥
जय गजबदन सदन सुखदाता।
विश्व विनायक बुद्धि विधाता॥
वक्र तुण्ड शुचि शुण्ड सुहावन।
तिलक त्रिपुण्ड भाल मन भावन॥
राजत मणि मुक्तन उर माला।
स्वर्ण मुकुट शिर नयन विशाला॥
पुस्तक पाणि कुठार त्रिशूलं।
मोदक भोग सुगन्धित फूलं॥
सुन्दर पीताम्बर तन साजित।
चरण पादुका मुनि मन राजित॥
धनि शिवसुवन षडानन भ्राता।
गौरी ललन विश्वविख्याता॥
ऋद्धि सिद्धि तव चँवर सुधारे।
मूषक वाहन सोहत द्वारे॥
कहौं जन्म शुभ कथा तुम्हारी।
अति शुचि पावन मंगलकारी॥

दोहा:
जो यह चालीसा पढ़े, ध्यान लगाय नित्य।
गणपति मिलें कृपा करें, सो भव उतरें नित्य॥`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      videoType: VideoType.NONE,
      authorId: admin.id,
      categoryId: categories['chalisa'],
      deityId: deities['ganesh-ji'],
      seoTitle: 'श्री गणेश चालीसा - पूर्ण पाठ | Akhand Bhakti Sagar',
      seoKeywords: 'गणेश चालीसा, ganesh chalisa, विघ्नहर्ता, गणपति चालीसा',
      viewCount: 7840,
    },
    {
      title: 'जय गणेश जय गणेश - आरती',
      slug: 'jai-ganesh-jai-ganesh-aarti',
      contentType: ContentType.AARTI,
      description:
        'श्री गणेश जी की सबसे लोकप्रिय आरती। गणेश चतुर्थी और प्रतिदिन की पूजा में यह आरती गाई जाती है।',
      lyrics: `जय गणेश जय गणेश जय गणेश देवा।
माता जाकी पार्वती पिता महादेवा॥

एकदन्त दयावन्त चार भुज धारी।
माथे सिन्दूर सोहे मूसे की सवारी॥
जय गणेश जय गणेश...

पान चढ़े फूल चढ़े और चढ़े मेवा।
लड्डुअन का भोग लगे सन्त करें सेवा॥
जय गणेश जय गणेश...

अन्धन को आँख देत कोढ़िन को काया।
बाँझन को पुत्र देत निर्धन को माया॥
जय गणेश जय गणेश...

'सूर' श्याम शरण आए सफल कीजे सेवा।
माता जाकी पार्वती पिता महादेवा॥
जय गणेश जय गणेश जय गणेश देवा॥`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      videoType: VideoType.NONE,
      authorId: admin.id,
      categoryId: categories['aarti'],
      deityId: deities['ganesh-ji'],
      seoTitle: 'जय गणेश देवा आरती | Akhand Bhakti Sagar',
      seoKeywords: 'गणेश आरती, ganesh aarti, जय गणेश, गणपति आरती',
      viewCount: 10230,
    },
    {
      title: 'गणपति बप्पा मोरया - भजन',
      slug: 'ganpati-bappa-morya-bhajan',
      contentType: ContentType.BHAJAN,
      description:
        'गणेश उत्सव में गाया जाने वाला यह भजन अत्यंत उत्साहजनक और आनंददायक है। गणपति बप्पा की जय-जयकार से वातावरण भक्तिमय हो जाता है।',
      lyrics: `गणपति बप्पा मोरया,
मंगल मूर्ति मोरया।
गणपति बप्पा मोरया,
पुढच्या वर्षी लवकर या॥

विघ्न हरण, मंगल करण,
सुख शांति दाता।
बुद्धि विधाता, गणपति देवा,
सबके रखवाला॥

गणपति बप्पा मोरया...

मोदक प्रिय, दूर्वा प्रिय,
शमी प्रिय गणेशा।
एकदंत गजानन,
जय जय गणेशा॥

गणपति बप्पा मोरया,
मंगल मूर्ति मोरया।
गणपति बप्पा मोरया,
पुढच्या वर्षी लवकर या॥`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      videoType: VideoType.NONE,
      authorId: admin.id,
      categoryId: categories['bhajan'],
      deityId: deities['ganesh-ji'],
      seoTitle: 'गणपति बप्पा मोरया भजन | Akhand Bhakti Sagar',
      seoKeywords: 'गणपति बप्पा मोरया, ganpati bappa morya, गणेश भजन',
      viewCount: 13560,
    },

    // ── Sai Baba (3 posts) ──────────────────────────────────────────────────
    {
      title: 'साईं बाबा की आरती - ॐ साईं राम',
      slug: 'sai-baba-aarti-om-sai-ram',
      contentType: ContentType.AARTI,
      description:
        'शिरडी साईं बाबा की प्रसिद्ध आरती जो प्रतिदिन शिरडी मंदिर में गाई जाती है। बाबा की इस आरती से मन को शांति और जीवन में सुख-समृद्धि मिलती है।',
      lyrics: `ॐ साईं राम, ॐ साईं राम,
ॐ साईं राम, जय जय साईं राम॥

आरती साईं बाबा की,
ॐ जय साईं राम।
सुख सम्पत्ति दाता दीनों के,
हरण करे हर काम॥
ॐ जय साईं राम॥

तुम हो तीनों लोकों के स्वामी,
साईं परम पिता।
जो भी तुम्हें ध्याता है बाबा,
सब दुख से छूट जाता॥
ॐ जय साईं राम॥

भक्त जनों के संकट हरता,
साईं दयालु महान।
कष्ट निवारण मंगल करण,
जय जय साईं भगवान॥
ॐ जय साईं राम॥

सबका मालिक एक है बाबा,
ऐसी है तेरी बात।
हिंदू मुस्लिम सिख ईसाई,
सब हैं तेरी संतान॥
ॐ जय साईं राम॥

ॐ साईं राम, ॐ साईं राम,
ॐ साईं राम, जय जय साईं राम॥`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      videoType: VideoType.NONE,
      authorId: admin.id,
      categoryId: categories['aarti'],
      deityId: deities['sai-baba'],
      seoTitle: 'साईं बाबा आरती - ॐ साईं राम | Akhand Bhakti Sagar',
      seoKeywords: 'साईं बाबा आरती, sai baba aarti, शिरडी आरती, ॐ साईं राम',
      viewCount: 9870,
    },
    {
      title: 'साईं तू है मेरा सहारा - भजन',
      slug: 'sai-tu-hai-mera-sahara-bhajan',
      contentType: ContentType.BHAJAN,
      description:
        'साईं बाबा की कृपा और उनके भक्तों पर उनके आशीर्वाद का वर्णन करने वाला यह भजन अत्यंत भाव-विभोर करने वाला है।',
      lyrics: `साईं तू है मेरा सहारा,
तेरे बिना मैं हूँ बेचारा।
शिरडी में तू विराजे बाबा,
तू ही मेरा है ईश्वर प्यारा॥

सबका मालिक एक है बाबा,
ऐसा कहते थे तुम बार-बार।
जाति-धर्म से ऊपर उठकर,
प्रेम बाँटते थे संसार॥

साईं तू है मेरा सहारा...

नाम लूँ तेरा सुबह शाम,
तू ही है मेरा राम।
श्रद्धा और सबूरी के बल पर,
पार लगाता हर एक काम॥

साईं तू है मेरा सहारा,
तेरे बिना मैं हूँ बेचारा।
शिरडी में तू विराजे बाबा,
तू ही मेरा है ईश्वर प्यारा॥`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      videoType: VideoType.NONE,
      authorId: admin.id,
      categoryId: categories['bhajan'],
      deityId: deities['sai-baba'],
      seoTitle: 'साईं तू है मेरा सहारा भजन | Akhand Bhakti Sagar',
      seoKeywords: 'साईं बाबा भजन, sai baba bhajan, शिरडी भजन, साईं नाम',
      viewCount: 6340,
    },
    {
      title: 'साईं चालीसा',
      slug: 'sai-chalisa',
      contentType: ContentType.CHALISA,
      description:
        'शिरडी साईं बाबा की महिमा का वर्णन करने वाली साईं चालीसा। इसका पाठ करने से बाबा की विशेष कृपा प्राप्त होती है।',
      lyrics: `दोहा:
साईं नाम मन में करो, साईं नाम जप नित्य।
साईं कृपा से होगा, तुम्हारा जीवन पवित्र॥

चौपाई:
जय जय जय साईं भगवाना,
शिरडी के तुम हो वरदाना।
नाम तुम्हारा सदा उचारूँ,
भव सागर से मैं पार उतारूँ॥
श्रद्धा और सबूरी बखान,
यह दो गुण हैं तेरी पहचान।
जो कोई तुझसे मन लगाई,
उसको दर्शन देते बाबाई॥
हिंदू मुस्लिम सिख ईसाई,
सबको तुमने गले लगाई।
जात-पात का भेद मिटाया,
एक प्रेम का पाठ पढ़ाया॥
द्वारका माई में विराजे,
नाना पुजारी सेवा साजे।
भक्त जनों के कष्ट हरता,
साईं नाम से दुख न रहता॥

दोहा:
जो यह चालीसा पढ़े, श्रद्धा भाव से नित्य।
साईं कृपा से उसके, घर में हो सुख नित्य॥`,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      videoType: VideoType.NONE,
      authorId: admin.id,
      categoryId: categories['chalisa'],
      deityId: deities['sai-baba'],
      seoTitle: 'साईं चालीसा - पूर्ण पाठ | Akhand Bhakti Sagar',
      seoKeywords: 'साईं चालीसा, sai chalisa, शिरडी साईं, साईं बाबा चालीसा',
      viewCount: 8120,
    },
  ];

  let postCount = 0;
  for (const post of postsData) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
    postCount++;
  }
  console.log(`✅ ${postCount} posts seeded`);

  // ─── Site Settings ────────────────────────────────────────────────────────
  const settingsData = [
    { key: 'siteName', value: 'Akhand Bhakti Sagar' },
    { key: 'siteNameHindi', value: 'अखंड भक्ति सागर' },
    { key: 'tagline', value: 'भक्ति का अखंड सागर - Devotional Content in Hindi' },
    { key: 'taglineHindi', value: 'भक्ति, ज्ञान और आध्यात्म का केंद्र' },
    { key: 'siteDescription', value: 'Akhand Bhakti Sagar is your ultimate destination for Hindu devotional content - bhajans, aartis, chalisas, mantras, and more in Hindi.' },
    { key: 'contactEmail', value: 'contact@akhandbhaktisagar.com' },
    { key: 'youtubeUrl', value: 'https://www.youtube.com/@akhandbhaktisagar' },
    { key: 'facebookUrl', value: 'https://www.facebook.com/akhandbhaktisagar' },
    { key: 'instagramUrl', value: 'https://www.instagram.com/akhandbhaktisagar' },
    { key: 'twitterUrl', value: 'https://www.twitter.com/akhandbhakti' },
    { key: 'postsPerPage', value: '12' },
    { key: 'enableComments', value: 'true' },
    { key: 'moderateComments', value: 'true' },
    { key: 'enableNewsletter', value: 'true' },
    { key: 'googleAnalyticsId', value: '' },
    { key: 'seoTitle', value: 'Akhand Bhakti Sagar - Hindi Devotional Content' },
    { key: 'seoDescription', value: 'भजन, आरती, चालीसा, मंत्र और अन्य भक्ति सामग्री हिंदी में पढ़ें और सुनें। Akhand Bhakti Sagar पर आपका स्वागत है।' },
    { key: 'footerText', value: '© 2024 Akhand Bhakti Sagar. सर्वाधिकार सुरक्षित।' },
    { key: 'maintenanceMode', value: 'false' },
  ];

  for (const setting of settingsData) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log(`✅ ${settingsData.length} site settings seeded`);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
