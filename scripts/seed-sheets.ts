import 'dotenv/config';
import { initializeSheets, writeSheet, SHEETS } from '../src/lib/db/sheets-client';

// Generate unique IDs
const id = () => crypto.randomUUID();

// Data
const cities = [
  { id: id(), slug: 'casablanca', name: 'Casablanca', nameAr: 'الدار البيضاء', region: 'Casablanca-Settat', country: 'Morocco', description: 'Economic capital and major artistic hub', latitude: 33.5731, longitude: -7.5898 },
  { id: id(), slug: 'marrakech', name: 'Marrakech', nameAr: 'مراكش', region: 'Marrakech-Safi', country: 'Morocco', description: 'Cultural capital, home to major galleries and biennale', latitude: 31.6295, longitude: -7.9811 },
  { id: id(), slug: 'tangier', name: 'Tangier', nameAr: 'طنجة', region: 'Tanger-Tetouan-Al Hoceima', country: 'Morocco', description: 'International crossroads with strong artistic heritage', latitude: 35.7595, longitude: -5.8340 },
  { id: id(), slug: 'rabat', name: 'Rabat', nameAr: 'الرباط', region: 'Rabat-Salé-Kénitra', country: 'Morocco', description: 'Capital city, home to national museums', latitude: 34.0209, longitude: -6.8416 },
  { id: id(), slug: 'fez', name: 'Fez', nameAr: 'فاس', region: 'Fès-Meknès', country: 'Morocco', description: 'Ancient imperial city with rich traditional heritage', latitude: 34.0181, longitude: -5.0078 },
  { id: id(), slug: 'tetouan', name: 'Tetouan', nameAr: 'تطوان', region: 'Tanger-Tetouan-Al Hoceima', country: 'Morocco', description: 'Home to the National Institute of Fine Arts', latitude: 35.5889, longitude: -5.3626 },
  { id: id(), slug: 'essaouira', name: 'Essaouira', nameAr: 'الصويرة', region: 'Marrakech-Safi', country: 'Morocco', description: 'Coastal artists\' community', latitude: 31.5085, longitude: -9.7595 },
  { id: id(), slug: 'asilah', name: 'Asilah', nameAr: 'أصيلة', region: 'Tanger-Tetouan-Al Hoceima', country: 'Morocco', description: 'Known for annual cultural festival and murals', latitude: 35.4653, longitude: -6.0341 },
  { id: id(), slug: 'paris', name: 'Paris', nameAr: 'باريس', region: 'Île-de-France', country: 'France', description: 'Major center for Moroccan diaspora artists', latitude: 48.8566, longitude: 2.3522 },
  { id: id(), slug: 'new-york', name: 'New York', nameAr: 'نيويورك', region: 'New York', country: 'USA', description: 'Contemporary art market hub', latitude: 40.7128, longitude: -74.0060 },
];

const themes = [
  { id: id(), slug: 'portrait', name: 'Portrait', nameAr: 'بورتريه', description: 'Representations of individuals', category: 'SUBJECT' },
  { id: id(), slug: 'landscape', name: 'Landscape', nameAr: 'منظر طبيعي', description: 'Natural and urban landscapes', category: 'SUBJECT' },
  { id: id(), slug: 'street', name: 'Street', nameAr: 'شارع', description: 'Street scenes and urban life', category: 'SUBJECT' },
  { id: id(), slug: 'daily-life', name: 'Daily Life', nameAr: 'الحياة اليومية', description: 'Scenes from everyday existence', category: 'SUBJECT' },
  { id: id(), slug: 'ritual', name: 'Ritual', nameAr: 'طقوس', description: 'Religious and cultural ceremonies', category: 'SUBJECT' },
  { id: id(), slug: 'body', name: 'Body', nameAr: 'الجسد', description: 'The human body as subject', category: 'SUBJECT' },
  { id: id(), slug: 'identity', name: 'Identity', nameAr: 'الهوية', description: 'Exploration of personal and national identity', category: 'CONCEPTUAL' },
  { id: id(), slug: 'diaspora', name: 'Diaspora', nameAr: 'الشتات', description: 'Migration and displacement themes', category: 'CONCEPTUAL' },
  { id: id(), slug: 'memory', name: 'Memory', nameAr: 'الذاكرة', description: 'Personal and collective memory', category: 'CONCEPTUAL' },
  { id: id(), slug: 'tradition-modernity', name: 'Tradition & Modernity', nameAr: 'التقليد والحداثة', description: 'Tension between old and new', category: 'CONCEPTUAL' },
  { id: id(), slug: 'colonialism', name: 'Colonialism', nameAr: 'الاستعمار', description: 'Colonial legacy and post-colonial critique', category: 'CONCEPTUAL' },
  { id: id(), slug: 'feminism', name: 'Feminism', nameAr: 'النسوية', description: 'Women\'s perspectives and gender issues', category: 'CONCEPTUAL' },
  { id: id(), slug: 'spirituality', name: 'Spirituality', nameAr: 'الروحانية', description: 'Religious and spiritual themes', category: 'CONCEPTUAL' },
  { id: id(), slug: 'abstraction', name: 'Abstraction', nameAr: 'التجريد', description: 'Non-representational art', category: 'STYLE' },
  { id: id(), slug: 'figuration', name: 'Figuration', nameAr: 'التشخيص', description: 'Representational human figures', category: 'STYLE' },
  { id: id(), slug: 'calligraphic', name: 'Calligraphic', nameAr: 'الخط', description: 'Arabic calligraphy influences', category: 'STYLE' },
  { id: id(), slug: 'expressionism', name: 'Expressionism', nameAr: 'التعبيرية', description: 'Emotional expressionist style', category: 'STYLE' },
  { id: id(), slug: 'documentary', name: 'Documentary', nameAr: 'وثائقي', description: 'Documentary approach', category: 'TECHNIQUE' },
  { id: id(), slug: 'staged', name: 'Staged', nameAr: 'مُعَد', description: 'Staged/constructed imagery', category: 'TECHNIQUE' },
  { id: id(), slug: 'mixed-media', name: 'Mixed Media', nameAr: 'وسائط متعددة', description: 'Combination of materials and techniques', category: 'TECHNIQUE' },
];

const movements = [
  { id: id(), slug: 'casablanca-school', name: 'Casablanca School', nameAr: 'مدرسة الدار البيضاء', description: 'Pioneering movement seeking authentic Moroccan modernism, rejecting orientalism', periodStart: 1962, periodEnd: 1974 },
  { id: id(), slug: 'presence-plastique', name: 'Présence Plastique', nameAr: 'الحضور التشكيلي', description: 'Collective exhibitions emphasizing social engagement through art', periodStart: 1966, periodEnd: 1971 },
  { id: id(), slug: 'naive-art', name: 'Naïve Art Movement', nameAr: 'الفن الفطري', description: 'Self-taught artists with intuitive, colorful styles', periodStart: 1950, periodEnd: 1980 },
  { id: id(), slug: 'post-independence', name: 'Post-Independence Modernism', nameAr: 'حداثة ما بعد الاستقلال', description: 'National identity formation through dialogue with Western modernism', periodStart: 1956, periodEnd: 1985 },
  { id: id(), slug: 'photography-pioneers', name: 'Moroccan Photography Pioneers', nameAr: 'رواد التصوير المغربي', description: 'Early documentary photography from colonial to independence era', periodStart: 1900, periodEnd: 1960 },
  { id: id(), slug: 'contemporary', name: 'Contemporary Moroccan Art', nameAr: 'الفن المغربي المعاصر', description: 'International presence with diverse media and diaspora perspectives', periodStart: 1990, periodEnd: null },
];

// Store IDs for relationships
const cityMap: Record<string, string> = {};
cities.forEach(c => cityMap[c.slug] = c.id);

const themeMap: Record<string, string> = {};
themes.forEach(t => themeMap[t.slug] = t.id);

const movementMap: Record<string, string> = {};
movements.forEach(m => movementMap[m.slug] = m.id);

const artists = [
  { id: id(), slug: 'farid-belkahia', name: 'Farid Belkahia', nameAr: 'فريد بلكاهية', medium: 'PAINTING', birthYear: 1934, deathYear: 2014, biographyShort: 'Pioneer of the Casablanca School, known for works on leather using natural pigments and Berber symbols.', biography: 'Farid Belkahia was a central figure in modern Moroccan art and a founder of the Casablanca School. He directed the École des Beaux-Arts in Casablanca from 1962-1974, transforming art education in Morocco.', activePeriodStart: 1955, activePeriodEnd: 2014, photoUrl: null, websiteUrl: null, status: 'PUBLISHED' },
  { id: id(), slug: 'mohamed-melehi', name: 'Mohamed Melehi', nameAr: 'محمد المليحي', medium: 'PAINTING', birthYear: 1936, deathYear: 2020, biographyShort: 'Co-founder of the Casablanca School, famous for his iconic wave motif and Op Art influences.', biography: 'Mohamed Melehi was instrumental in developing a distinctly Moroccan modernist aesthetic. His signature wave patterns became symbols of Moroccan contemporary art.', activePeriodStart: 1960, activePeriodEnd: 2020, photoUrl: null, websiteUrl: null, status: 'PUBLISHED' },
  { id: id(), slug: 'mohamed-chabaa', name: 'Mohamed Chabâa', nameAr: 'محمد شبعة', medium: 'PAINTING', birthYear: 1935, deathYear: 2013, biographyShort: 'Casablanca School co-founder known for geometric abstraction and public murals.', biography: 'Mohamed Chabâa combined geometric abstraction with social engagement, creating monumental public works that brought art to everyday Moroccan life.', activePeriodStart: 1960, activePeriodEnd: 2013, photoUrl: null, websiteUrl: null, status: 'PUBLISHED' },
  { id: id(), slug: 'chaibia-talal', name: 'Chaïbia Talal', nameAr: 'الشعيبية طلال', medium: 'PAINTING', birthYear: 1929, deathYear: 2004, biographyShort: 'Self-taught artist and leading figure of Moroccan naïve art, celebrated for vibrant depictions of women and daily life.', biography: 'Chaïbia Talal began painting at age 50, developing a distinctive style characterized by bold colors and intuitive compositions depicting Moroccan women and traditions.', activePeriodStart: 1979, activePeriodEnd: 2004, photoUrl: null, websiteUrl: null, status: 'PUBLISHED' },
  { id: id(), slug: 'ahmed-cherkaoui', name: 'Ahmed Cherkaoui', nameAr: 'أحمد الشرقاوي', medium: 'PAINTING', birthYear: 1934, deathYear: 1967, biographyShort: 'Influential painter who synthesized Berber signs with abstract expressionism.', biography: 'Despite his brief career, Ahmed Cherkaoui profoundly influenced Moroccan art by integrating traditional Berber symbols into modern abstract painting.', activePeriodStart: 1956, activePeriodEnd: 1967, photoUrl: null, websiteUrl: null, status: 'PUBLISHED' },
  { id: id(), slug: 'mahi-binebine', name: 'Mahi Binebine', nameAr: 'ماحي بينبين', medium: 'PAINTING', birthYear: 1959, deathYear: null, biographyShort: 'Contemporary painter and novelist exploring themes of migration and fragmented identity.', biography: 'Mahi Binebine\'s paintings feature fragmented human figures that speak to displacement, migration, and the search for identity in the modern world.', activePeriodStart: 1990, activePeriodEnd: null, photoUrl: null, websiteUrl: null, status: 'PUBLISHED' },
  { id: id(), slug: 'mohamed-kacimi', name: 'Mohamed Kacimi', nameAr: 'محمد القاسمي', medium: 'PAINTING', birthYear: 1942, deathYear: 2003, biographyShort: 'Lyrical abstractionist known for spiritual and meditative works.', biography: 'Mohamed Kacimi developed a contemplative abstract style infused with Sufi spirituality and poetic sensibility.', activePeriodStart: 1965, activePeriodEnd: 2003, photoUrl: null, websiteUrl: null, status: 'PUBLISHED' },
  { id: id(), slug: 'lalla-essaydi', name: 'Lalla Essaydi', nameAr: 'للا السعيدي', medium: 'PHOTOGRAPHY', birthYear: 1956, deathYear: null, biographyShort: 'Photographer challenging Orientalist imagery through calligraphy-covered female figures.', biography: 'Lalla Essaydi creates large-scale photographs featuring women covered in Arabic calligraphy, subverting Western Orientalist traditions and reclaiming Arab women\'s narratives.', activePeriodStart: 1998, activePeriodEnd: null, photoUrl: null, websiteUrl: null, status: 'PUBLISHED' },
  { id: id(), slug: 'daoud-aoulad-syad', name: 'Daoud Aoulad-Syad', nameAr: 'داود أولاد السيد', medium: 'PHOTOGRAPHY', birthYear: 1953, deathYear: null, biographyShort: 'Documentary photographer and filmmaker capturing Moroccan life in evocative black-and-white.', biography: 'Daoud Aoulad-Syad\'s photographs document Moroccan society with poetic sensitivity, often focusing on marginalized communities and vanishing traditions.', activePeriodStart: 1980, activePeriodEnd: null, photoUrl: null, websiteUrl: null, status: 'PUBLISHED' },
  { id: id(), slug: 'hicham-benohoud', name: 'Hicham Benohoud', nameAr: 'هشام بنوهود', medium: 'PHOTOGRAPHY', birthYear: 1968, deathYear: null, biographyShort: 'Conceptual photographer known for surreal staged classroom photographs.', biography: 'Hicham Benohoud\'s "Classroom" series features students in absurd, dreamlike scenarios that critique educational systems and social conformity.', activePeriodStart: 1998, activePeriodEnd: null, photoUrl: null, websiteUrl: null, status: 'PUBLISHED' },
  { id: id(), slug: 'yto-barrada', name: 'Yto Barrada', nameAr: 'إيتو برادة', medium: 'PHOTOGRAPHY', birthYear: 1971, deathYear: null, biographyShort: 'Multidisciplinary artist documenting Tangier\'s urban transformation and migration.', biography: 'Yto Barrada\'s work explores the tensions of globalization in Tangier, documenting urban change, migration dreams, and postcolonial identity.', activePeriodStart: 1998, activePeriodEnd: null, photoUrl: null, websiteUrl: null, status: 'PUBLISHED' },
  { id: id(), slug: 'hassan-hajjaj', name: 'Hassan Hajjaj', nameAr: 'حسان حجاج', medium: 'PHOTOGRAPHY', birthYear: 1961, deathYear: null, biographyShort: 'Pop artist creating vibrant portraits celebrating African and Arab aesthetics.', biography: 'Hassan Hajjaj, often called Morocco\'s Andy Warhol, creates exuberant portraits using African textiles, recycled materials, and consumer goods as frames and props.', activePeriodStart: 1990, activePeriodEnd: null, photoUrl: null, websiteUrl: null, status: 'PUBLISHED' },
  { id: id(), slug: 'leila-alaoui', name: 'Leila Alaoui', nameAr: 'ليلى العلوي', medium: 'PHOTOGRAPHY', birthYear: 1982, deathYear: 2016, biographyShort: 'Documentary photographer exploring Moroccan identity and Sub-Saharan migration.', biography: 'Leila Alaoui\'s poignant work documented Moroccan cultural identity and the human stories of migration before her tragic death in the 2016 Ouagadougou attack.', activePeriodStart: 2008, activePeriodEnd: 2016, photoUrl: null, websiteUrl: null, status: 'PUBLISHED' },
];

const artistMap: Record<string, string> = {};
artists.forEach(a => artistMap[a.slug] = a.id);

const artworks = [
  { id: id(), slug: 'hommage-gaston-bachelard', title: 'Hommage à Gaston Bachelard', titleAr: 'تحية لغاستون باشلار', artistId: artistMap['farid-belkahia'], medium: 'PAINTING', year: 1984, yearEnd: null, description: 'Copper and natural pigments on leather, featuring Berber symbols', dimensions: '150 x 200 cm', materialsAndTechniques: 'Copper, natural pigments on stretched leather', currentLocation: 'Private Collection', imageUrl: null, isIconic: true, movementId: movementMap['casablanca-school'], status: 'PUBLISHED' },
  { id: id(), slug: 'composition-waves', title: 'Composition with Waves', titleAr: 'تكوين مع الأمواج', artistId: artistMap['mohamed-melehi'], medium: 'PAINTING', year: 1970, yearEnd: null, description: 'Iconic wave motif in vibrant colors, Op Art influenced', dimensions: '120 x 180 cm', materialsAndTechniques: 'Acrylic on canvas', currentLocation: 'Museum of Modern Art, Rabat', imageUrl: null, isIconic: true, movementId: movementMap['casablanca-school'], status: 'PUBLISHED' },
  { id: id(), slug: 'femmes-au-marche', title: 'Femmes au marché', titleAr: 'نساء في السوق', artistId: artistMap['chaibia-talal'], medium: 'PAINTING', year: 1985, yearEnd: null, description: 'Vibrant scene of women at the market in characteristic naïve style', dimensions: '100 x 130 cm', materialsAndTechniques: 'Oil on canvas', currentLocation: 'Private Collection', imageUrl: null, isIconic: true, movementId: movementMap['naive-art'], status: 'PUBLISHED' },
  { id: id(), slug: 'signes-berberes', title: 'Signes Berbères', titleAr: 'علامات أمازيغية', artistId: artistMap['ahmed-cherkaoui'], medium: 'PAINTING', year: 1965, yearEnd: null, description: 'Abstract composition integrating traditional Berber symbols', dimensions: '130 x 97 cm', materialsAndTechniques: 'Oil on canvas', currentLocation: 'Private Collection', imageUrl: null, isIconic: true, movementId: movementMap['post-independence'], status: 'PUBLISHED' },
  { id: id(), slug: 'les-migrants', title: 'Les Migrants', titleAr: 'المهاجرون', artistId: artistMap['mahi-binebine'], medium: 'PAINTING', year: 2000, yearEnd: null, description: 'Fragmented figures representing displaced people', dimensions: '200 x 180 cm', materialsAndTechniques: 'Mixed media on canvas', currentLocation: 'Artist Collection', imageUrl: null, isIconic: true, movementId: movementMap['contemporary'], status: 'PUBLISHED' },
  { id: id(), slug: 'lumiere-interieure', title: 'Lumière Intérieure', titleAr: 'نور داخلي', artistId: artistMap['mohamed-kacimi'], medium: 'PAINTING', year: 1990, yearEnd: null, description: 'Meditative abstract work with spiritual undertones', dimensions: '150 x 150 cm', materialsAndTechniques: 'Oil on canvas', currentLocation: 'Private Collection', imageUrl: null, isIconic: true, movementId: movementMap['post-independence'], status: 'PUBLISHED' },
  { id: id(), slug: 'converging-territories-1', title: 'Converging Territories #1', titleAr: 'أقاليم متقاربة', artistId: artistMap['lalla-essaydi'], medium: 'PHOTOGRAPHY', year: 2003, yearEnd: null, description: 'Woman covered in Arabic calligraphy, challenging Orientalist imagery', dimensions: '122 x 152 cm', materialsAndTechniques: 'Chromogenic print', currentLocation: 'Multiple editions', imageUrl: null, isIconic: true, movementId: movementMap['contemporary'], status: 'PUBLISHED' },
  { id: id(), slug: 'marrakech-medina', title: 'Marrakech Medina', titleAr: 'مدينة مراكش', artistId: artistMap['daoud-aoulad-syad'], medium: 'PHOTOGRAPHY', year: 1995, yearEnd: null, description: 'Black-and-white street scene from the old medina', dimensions: '50 x 60 cm', materialsAndTechniques: 'Silver gelatin print', currentLocation: 'Artist Archive', imageUrl: null, isIconic: true, movementId: null, status: 'PUBLISHED' },
  { id: id(), slug: 'classroom-1', title: 'The Classroom #1', titleAr: 'الفصل الدراسي', artistId: artistMap['hicham-benohoud'], medium: 'PHOTOGRAPHY', year: 1994, yearEnd: null, description: 'Surreal staged photograph of students in absurd situation', dimensions: '120 x 150 cm', materialsAndTechniques: 'C-print', currentLocation: 'Multiple editions', imageUrl: null, isIconic: true, movementId: movementMap['contemporary'], status: 'PUBLISHED' },
  { id: id(), slug: 'ferry-tangier', title: 'Ferry, Tangier', titleAr: 'العبّارة، طنجة', artistId: artistMap['yto-barrada'], medium: 'PHOTOGRAPHY', year: 2002, yearEnd: null, description: 'View of the Strait of Gibraltar, symbol of migration dreams', dimensions: '80 x 100 cm', materialsAndTechniques: 'C-print', currentLocation: 'Multiple editions', imageUrl: null, isIconic: true, movementId: movementMap['contemporary'], status: 'PUBLISHED' },
  { id: id(), slug: 'kesh-angels', title: 'Kesh Angels', titleAr: 'ملائكة مراكش', artistId: artistMap['hassan-hajjaj'], medium: 'PHOTOGRAPHY', year: 2010, yearEnd: null, description: 'Marrakech women bikers in colorful pop aesthetic', dimensions: 'Variable', materialsAndTechniques: 'Metallic lambda print, wood and metal frame with found objects', currentLocation: 'Multiple editions', imageUrl: null, isIconic: true, movementId: movementMap['contemporary'], status: 'PUBLISHED' },
  { id: id(), slug: 'the-moroccans-1', title: 'The Moroccans #1', titleAr: 'المغاربة', artistId: artistMap['leila-alaoui'], medium: 'PHOTOGRAPHY', year: 2011, yearEnd: null, description: 'Portrait from the series documenting Moroccan identity across regions', dimensions: '150 x 100 cm', materialsAndTechniques: 'C-print', currentLocation: 'Multiple editions', imageUrl: null, isIconic: true, movementId: movementMap['contemporary'], status: 'PUBLISHED' },
];

const artworkMap: Record<string, string> = {};
artworks.forEach(a => artworkMap[a.slug] = a.id);

// Relationship data
const artistCities = [
  { artistId: artistMap['farid-belkahia'], cityId: cityMap['marrakech'], relationType: 'BORN' },
  { artistId: artistMap['farid-belkahia'], cityId: cityMap['casablanca'], relationType: 'BASED' },
  { artistId: artistMap['farid-belkahia'], cityId: cityMap['paris'], relationType: 'WORKED' },
  { artistId: artistMap['mohamed-melehi'], cityId: cityMap['asilah'], relationType: 'BORN' },
  { artistId: artistMap['mohamed-melehi'], cityId: cityMap['casablanca'], relationType: 'BASED' },
  { artistId: artistMap['mohamed-chabaa'], cityId: cityMap['tangier'], relationType: 'BORN' },
  { artistId: artistMap['mohamed-chabaa'], cityId: cityMap['casablanca'], relationType: 'BASED' },
  { artistId: artistMap['chaibia-talal'], cityId: cityMap['casablanca'], relationType: 'BASED' },
  { artistId: artistMap['ahmed-cherkaoui'], cityId: cityMap['casablanca'], relationType: 'BASED' },
  { artistId: artistMap['ahmed-cherkaoui'], cityId: cityMap['paris'], relationType: 'WORKED' },
  { artistId: artistMap['mahi-binebine'], cityId: cityMap['marrakech'], relationType: 'BORN' },
  { artistId: artistMap['mahi-binebine'], cityId: cityMap['paris'], relationType: 'BASED' },
  { artistId: artistMap['mohamed-kacimi'], cityId: cityMap['rabat'], relationType: 'BASED' },
  { artistId: artistMap['lalla-essaydi'], cityId: cityMap['marrakech'], relationType: 'BORN' },
  { artistId: artistMap['lalla-essaydi'], cityId: cityMap['new-york'], relationType: 'BASED' },
  { artistId: artistMap['daoud-aoulad-syad'], cityId: cityMap['marrakech'], relationType: 'BASED' },
  { artistId: artistMap['hicham-benohoud'], cityId: cityMap['marrakech'], relationType: 'BASED' },
  { artistId: artistMap['yto-barrada'], cityId: cityMap['tangier'], relationType: 'BORN' },
  { artistId: artistMap['yto-barrada'], cityId: cityMap['tangier'], relationType: 'BASED' },
  { artistId: artistMap['hassan-hajjaj'], cityId: cityMap['marrakech'], relationType: 'BASED' },
  { artistId: artistMap['leila-alaoui'], cityId: cityMap['paris'], relationType: 'BORN' },
  { artistId: artistMap['leila-alaoui'], cityId: cityMap['marrakech'], relationType: 'BASED' },
];

const artistThemes = [
  { artistId: artistMap['farid-belkahia'], themeId: themeMap['abstraction'] },
  { artistId: artistMap['farid-belkahia'], themeId: themeMap['tradition-modernity'] },
  { artistId: artistMap['farid-belkahia'], themeId: themeMap['identity'] },
  { artistId: artistMap['mohamed-melehi'], themeId: themeMap['abstraction'] },
  { artistId: artistMap['mohamed-chabaa'], themeId: themeMap['abstraction'] },
  { artistId: artistMap['chaibia-talal'], themeId: themeMap['daily-life'] },
  { artistId: artistMap['chaibia-talal'], themeId: themeMap['figuration'] },
  { artistId: artistMap['chaibia-talal'], themeId: themeMap['feminism'] },
  { artistId: artistMap['ahmed-cherkaoui'], themeId: themeMap['abstraction'] },
  { artistId: artistMap['ahmed-cherkaoui'], themeId: themeMap['calligraphic'] },
  { artistId: artistMap['mahi-binebine'], themeId: themeMap['diaspora'] },
  { artistId: artistMap['mahi-binebine'], themeId: themeMap['identity'] },
  { artistId: artistMap['mahi-binebine'], themeId: themeMap['figuration'] },
  { artistId: artistMap['mohamed-kacimi'], themeId: themeMap['spirituality'] },
  { artistId: artistMap['mohamed-kacimi'], themeId: themeMap['abstraction'] },
  { artistId: artistMap['lalla-essaydi'], themeId: themeMap['feminism'] },
  { artistId: artistMap['lalla-essaydi'], themeId: themeMap['colonialism'] },
  { artistId: artistMap['lalla-essaydi'], themeId: themeMap['calligraphic'] },
  { artistId: artistMap['lalla-essaydi'], themeId: themeMap['body'] },
  { artistId: artistMap['daoud-aoulad-syad'], themeId: themeMap['documentary'] },
  { artistId: artistMap['daoud-aoulad-syad'], themeId: themeMap['daily-life'] },
  { artistId: artistMap['daoud-aoulad-syad'], themeId: themeMap['street'] },
  { artistId: artistMap['hicham-benohoud'], themeId: themeMap['staged'] },
  { artistId: artistMap['hicham-benohoud'], themeId: themeMap['identity'] },
  { artistId: artistMap['yto-barrada'], themeId: themeMap['diaspora'] },
  { artistId: artistMap['yto-barrada'], themeId: themeMap['documentary'] },
  { artistId: artistMap['yto-barrada'], themeId: themeMap['landscape'] },
  { artistId: artistMap['hassan-hajjaj'], themeId: themeMap['portrait'] },
  { artistId: artistMap['hassan-hajjaj'], themeId: themeMap['identity'] },
  { artistId: artistMap['hassan-hajjaj'], themeId: themeMap['tradition-modernity'] },
  { artistId: artistMap['leila-alaoui'], themeId: themeMap['identity'] },
  { artistId: artistMap['leila-alaoui'], themeId: themeMap['diaspora'] },
  { artistId: artistMap['leila-alaoui'], themeId: themeMap['documentary'] },
  { artistId: artistMap['leila-alaoui'], themeId: themeMap['portrait'] },
];

const artistMovements = [
  { artistId: artistMap['farid-belkahia'], movementId: movementMap['casablanca-school'] },
  { artistId: artistMap['farid-belkahia'], movementId: movementMap['presence-plastique'] },
  { artistId: artistMap['mohamed-melehi'], movementId: movementMap['casablanca-school'] },
  { artistId: artistMap['mohamed-melehi'], movementId: movementMap['presence-plastique'] },
  { artistId: artistMap['mohamed-chabaa'], movementId: movementMap['casablanca-school'] },
  { artistId: artistMap['mohamed-chabaa'], movementId: movementMap['presence-plastique'] },
  { artistId: artistMap['chaibia-talal'], movementId: movementMap['naive-art'] },
  { artistId: artistMap['ahmed-cherkaoui'], movementId: movementMap['post-independence'] },
  { artistId: artistMap['mahi-binebine'], movementId: movementMap['contemporary'] },
  { artistId: artistMap['mohamed-kacimi'], movementId: movementMap['post-independence'] },
  { artistId: artistMap['lalla-essaydi'], movementId: movementMap['contemporary'] },
  { artistId: artistMap['hicham-benohoud'], movementId: movementMap['contemporary'] },
  { artistId: artistMap['yto-barrada'], movementId: movementMap['contemporary'] },
  { artistId: artistMap['hassan-hajjaj'], movementId: movementMap['contemporary'] },
  { artistId: artistMap['leila-alaoui'], movementId: movementMap['contemporary'] },
];

const artistRelations = [
  { fromArtistId: artistMap['farid-belkahia'], toArtistId: artistMap['mohamed-melehi'], relationType: 'CONTEMPORARY' },
  { fromArtistId: artistMap['farid-belkahia'], toArtistId: artistMap['mohamed-chabaa'], relationType: 'COLLABORATED' },
  { fromArtistId: artistMap['mohamed-melehi'], toArtistId: artistMap['mohamed-chabaa'], relationType: 'CONTEMPORARY' },
  { fromArtistId: artistMap['ahmed-cherkaoui'], toArtistId: artistMap['farid-belkahia'], relationType: 'CONTEMPORARY' },
];

const artworkThemes = [
  { artworkId: artworkMap['hommage-gaston-bachelard'], themeId: themeMap['abstraction'] },
  { artworkId: artworkMap['hommage-gaston-bachelard'], themeId: themeMap['tradition-modernity'] },
  { artworkId: artworkMap['composition-waves'], themeId: themeMap['abstraction'] },
  { artworkId: artworkMap['femmes-au-marche'], themeId: themeMap['daily-life'] },
  { artworkId: artworkMap['femmes-au-marche'], themeId: themeMap['feminism'] },
  { artworkId: artworkMap['signes-berberes'], themeId: themeMap['abstraction'] },
  { artworkId: artworkMap['signes-berberes'], themeId: themeMap['calligraphic'] },
  { artworkId: artworkMap['les-migrants'], themeId: themeMap['diaspora'] },
  { artworkId: artworkMap['les-migrants'], themeId: themeMap['figuration'] },
  { artworkId: artworkMap['lumiere-interieure'], themeId: themeMap['spirituality'] },
  { artworkId: artworkMap['lumiere-interieure'], themeId: themeMap['abstraction'] },
  { artworkId: artworkMap['converging-territories-1'], themeId: themeMap['feminism'] },
  { artworkId: artworkMap['converging-territories-1'], themeId: themeMap['colonialism'] },
  { artworkId: artworkMap['converging-territories-1'], themeId: themeMap['calligraphic'] },
  { artworkId: artworkMap['marrakech-medina'], themeId: themeMap['street'] },
  { artworkId: artworkMap['marrakech-medina'], themeId: themeMap['documentary'] },
  { artworkId: artworkMap['classroom-1'], themeId: themeMap['staged'] },
  { artworkId: artworkMap['classroom-1'], themeId: themeMap['identity'] },
  { artworkId: artworkMap['ferry-tangier'], themeId: themeMap['diaspora'] },
  { artworkId: artworkMap['ferry-tangier'], themeId: themeMap['landscape'] },
  { artworkId: artworkMap['kesh-angels'], themeId: themeMap['portrait'] },
  { artworkId: artworkMap['kesh-angels'], themeId: themeMap['feminism'] },
  { artworkId: artworkMap['the-moroccans-1'], themeId: themeMap['identity'] },
  { artworkId: artworkMap['the-moroccans-1'], themeId: themeMap['portrait'] },
];

const artworkCities = [
  { artworkId: artworkMap['hommage-gaston-bachelard'], cityId: cityMap['casablanca'], relationType: 'CREATED' },
  { artworkId: artworkMap['composition-waves'], cityId: cityMap['casablanca'], relationType: 'CREATED' },
  { artworkId: artworkMap['femmes-au-marche'], cityId: cityMap['casablanca'], relationType: 'DEPICTED' },
  { artworkId: artworkMap['marrakech-medina'], cityId: cityMap['marrakech'], relationType: 'DEPICTED' },
  { artworkId: artworkMap['ferry-tangier'], cityId: cityMap['tangier'], relationType: 'DEPICTED' },
  { artworkId: artworkMap['kesh-angels'], cityId: cityMap['marrakech'], relationType: 'DEPICTED' },
];

const iconicImages = [
  { id: id(), artworkId: artworkMap['converging-territories-1'], subject: 'Woman in harem setting covered in Arabic calligraphy', composition: 'Central figure against patterned background', colorPalette: 'Warm earth tones, henna colors', technique: 'Large-format photography with hand-applied calligraphy', historicalContext: 'Response to Orientalist paintings of Arab women', significance: 'Pioneering work in postcolonial feminist art photography', interpretation: 'Reclaiming Arab women\'s narratives by making the body a surface for their own words' },
  { id: id(), artworkId: artworkMap['kesh-angels'], subject: 'Moroccan women on motorcycles in designer djellabas', composition: 'Dynamic group portrait with pop-art framing', colorPalette: 'Vibrant primary colors, African prints', technique: 'Studio photography with found-object frames', historicalContext: 'Part of ongoing celebration of Marrakech street culture', significance: 'Redefines global perception of Moroccan women', interpretation: 'Celebrates contemporary Moroccan identity that embraces both tradition and modernity' },
  { id: id(), artworkId: artworkMap['the-moroccans-1'], subject: 'Portrait of Moroccan individual in traditional dress', composition: 'Classical portrait format against neutral background', colorPalette: 'Natural tones, rich textile colors', technique: 'Large-format portrait photography', historicalContext: 'Part of documentary series across Morocco', significance: 'Humanistic documentation of Moroccan diversity', interpretation: 'Celebrates the dignity and diversity of Moroccan identity' },
];

async function seed() {
  console.log('Initializing sheets...');
  await initializeSheets();

  console.log('Seeding cities...');
  await writeSheet(SHEETS.CITIES, cities);

  console.log('Seeding themes...');
  await writeSheet(SHEETS.THEMES, themes);

  console.log('Seeding movements...');
  await writeSheet(SHEETS.MOVEMENTS, movements);

  console.log('Seeding artists...');
  await writeSheet(SHEETS.ARTISTS, artists);

  console.log('Seeding artworks...');
  await writeSheet(SHEETS.ARTWORKS, artworks);

  console.log('Seeding artist-city relations...');
  await writeSheet(SHEETS.ARTIST_CITIES, artistCities);

  console.log('Seeding artist-theme relations...');
  await writeSheet(SHEETS.ARTIST_THEMES, artistThemes);

  console.log('Seeding artist-movement relations...');
  await writeSheet(SHEETS.ARTIST_MOVEMENTS, artistMovements);

  console.log('Seeding artist relations...');
  await writeSheet(SHEETS.ARTIST_RELATIONS, artistRelations);

  console.log('Seeding artwork-theme relations...');
  await writeSheet(SHEETS.ARTWORK_THEMES, artworkThemes);

  console.log('Seeding artwork-city relations...');
  await writeSheet(SHEETS.ARTWORK_CITIES, artworkCities);

  console.log('Seeding iconic images...');
  await writeSheet(SHEETS.ICONIC_IMAGES, iconicImages);

  console.log('✅ Seed complete!');
  console.log(`   - ${cities.length} cities`);
  console.log(`   - ${themes.length} themes`);
  console.log(`   - ${movements.length} movements`);
  console.log(`   - ${artists.length} artists`);
  console.log(`   - ${artworks.length} artworks`);
}

seed().catch(console.error);
