// =============================================================================
// Database Seed Script
// Moroccan Art Platform
// =============================================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.$transaction([
    prisma.iconicImage.deleteMany(),
    prisma.artworkCity.deleteMany(),
    prisma.artworkTheme.deleteMany(),
    prisma.artistRelation.deleteMany(),
    prisma.artistMovement.deleteMany(),
    prisma.artistTheme.deleteMany(),
    prisma.artistCity.deleteMany(),
    prisma.savedSearch.deleteMany(),
    prisma.savedWork.deleteMany(),
    prisma.savedArtist.deleteMany(),
    prisma.apiKey.deleteMany(),
    prisma.user.deleteMany(),
    prisma.artwork.deleteMany(),
    prisma.artist.deleteMany(),
    prisma.movement.deleteMany(),
    prisma.theme.deleteMany(),
    prisma.city.deleteMany(),
  ]);

  console.log('🧹 Cleared existing data');

  // ==========================================================================
  // CITIES
  // ==========================================================================

  const cities = await Promise.all([
    prisma.city.create({
      data: {
        slug: 'casablanca',
        name: 'Casablanca',
        nameArabic: 'الدار البيضاء',
        region: 'Casablanca-Settat',
        country: 'Morocco',
        description: 'Morocco\'s largest city and economic capital. A major center for modern and contemporary art, home to numerous galleries and the birthplace of the Casablanca School.',
      },
    }),
    prisma.city.create({
      data: {
        slug: 'marrakech',
        name: 'Marrakech',
        nameArabic: 'مراكش',
        region: 'Marrakech-Safi',
        country: 'Morocco',
        description: 'Historic imperial city known for its vibrant arts scene, annual art biennale, and numerous galleries in the medina and Gueliz districts.',
      },
    }),
    prisma.city.create({
      data: {
        slug: 'tangier',
        name: 'Tangier',
        nameArabic: 'طنجة',
        region: 'Tanger-Tetouan-Al Hoceima',
        country: 'Morocco',
        description: 'Gateway between Africa and Europe, historically attracting international artists and writers. Home to a rich tradition of visual arts.',
      },
    }),
    prisma.city.create({
      data: {
        slug: 'rabat',
        name: 'Rabat',
        nameArabic: 'الرباط',
        region: 'Rabat-Salé-Kénitra',
        country: 'Morocco',
        description: 'Morocco\'s capital city, home to the Mohammed VI Museum of Modern and Contemporary Art and the National School of Fine Arts.',
      },
    }),
    prisma.city.create({
      data: {
        slug: 'fez',
        name: 'Fez',
        nameArabic: 'فاس',
        region: 'Fès-Meknès',
        country: 'Morocco',
        description: 'Ancient imperial city with a rich artistic heritage, known for traditional craftsmanship and contemporary art initiatives.',
      },
    }),
    prisma.city.create({
      data: {
        slug: 'tetouan',
        name: 'Tetouan',
        nameArabic: 'تطوان',
        region: 'Tanger-Tetouan-Al Hoceima',
        country: 'Morocco',
        description: 'Known for its Andalusian influence and the National Institute of Fine Arts, one of Morocco\'s oldest art schools.',
      },
    }),
    prisma.city.create({
      data: {
        slug: 'essaouira',
        name: 'Essaouira',
        nameArabic: 'الصويرة',
        region: 'Marrakech-Safi',
        country: 'Morocco',
        description: 'Coastal town known for its artistic community, galleries, and annual Gnaoua music festival.',
      },
    }),
    prisma.city.create({
      data: {
        slug: 'asilah',
        name: 'Asilah',
        nameArabic: 'أصيلة',
        region: 'Tanger-Tetouan-Al Hoceima',
        country: 'Morocco',
        description: 'Famous for its annual cultural festival featuring murals and public art throughout the medina.',
      },
    }),
    prisma.city.create({
      data: {
        slug: 'paris',
        name: 'Paris',
        region: 'Île-de-France',
        country: 'France',
        description: 'Major destination for Moroccan diaspora artists, home to significant Moroccan art collections and galleries.',
      },
    }),
    prisma.city.create({
      data: {
        slug: 'new-york',
        name: 'New York',
        region: 'New York',
        country: 'United States',
        description: 'Global art capital with growing representation of Moroccan contemporary artists.',
      },
    }),
  ]);

  const cityMap = Object.fromEntries(cities.map((c) => [c.slug, c]));
  console.log(`✅ Created ${cities.length} cities`);

  // ==========================================================================
  // THEMES
  // ==========================================================================

  const themes = await Promise.all([
    // Subject themes
    prisma.theme.create({
      data: {
        slug: 'portrait',
        name: 'Portrait',
        category: 'SUBJECT',
        description: 'Depictions of individuals, exploring identity, character, and social context.',
      },
    }),
    prisma.theme.create({
      data: {
        slug: 'landscape',
        name: 'Landscape',
        category: 'SUBJECT',
        description: 'Representations of Moroccan landscapes, from mountains to deserts to coastal scenes.',
      },
    }),
    prisma.theme.create({
      data: {
        slug: 'street',
        name: 'Street',
        category: 'SUBJECT',
        description: 'Urban scenes, street life, and everyday moments in Moroccan cities.',
      },
    }),
    prisma.theme.create({
      data: {
        slug: 'daily-life',
        name: 'Daily Life',
        category: 'SUBJECT',
        description: 'Scenes of everyday existence, domestic spaces, and quotidian activities.',
      },
    }),
    prisma.theme.create({
      data: {
        slug: 'ritual',
        name: 'Ritual',
        category: 'SUBJECT',
        description: 'Religious ceremonies, traditional practices, and cultural rituals.',
      },
    }),
    prisma.theme.create({
      data: {
        slug: 'body',
        name: 'Body',
        category: 'SUBJECT',
        description: 'Explorations of the human body, physicality, and corporeal experience.',
      },
    }),

    // Conceptual themes
    prisma.theme.create({
      data: {
        slug: 'identity',
        name: 'Identity',
        category: 'CONCEPT',
        description: 'Explorations of personal, cultural, and national identity in Moroccan context.',
      },
    }),
    prisma.theme.create({
      data: {
        slug: 'diaspora',
        name: 'Diaspora',
        category: 'CONCEPT',
        description: 'Experiences of migration, displacement, and transnational identity.',
      },
    }),
    prisma.theme.create({
      data: {
        slug: 'memory',
        name: 'Memory',
        category: 'CONCEPT',
        description: 'Personal and collective memory, nostalgia, and historical consciousness.',
      },
    }),
    prisma.theme.create({
      data: {
        slug: 'tradition-modernity',
        name: 'Tradition & Modernity',
        category: 'CONCEPT',
        description: 'Tensions and dialogues between traditional values and contemporary life.',
      },
    }),
    prisma.theme.create({
      data: {
        slug: 'colonialism',
        name: 'Colonialism',
        category: 'CONCEPT',
        description: 'Colonial history, its legacy, and post-colonial critique.',
      },
    }),
    prisma.theme.create({
      data: {
        slug: 'feminism',
        name: 'Feminism',
        category: 'CONCEPT',
        description: 'Women\'s experiences, gender politics, and feminist perspectives.',
      },
    }),
    prisma.theme.create({
      data: {
        slug: 'spirituality',
        name: 'Spirituality',
        category: 'CONCEPT',
        description: 'Religious devotion, mysticism, and spiritual dimensions of life.',
      },
    }),

    // Style themes
    prisma.theme.create({
      data: {
        slug: 'abstraction',
        name: 'Abstraction',
        category: 'STYLE',
        description: 'Non-representational art emphasizing form, color, and gesture.',
      },
    }),
    prisma.theme.create({
      data: {
        slug: 'figuration',
        name: 'Figuration',
        category: 'STYLE',
        description: 'Representational art depicting recognizable subjects and figures.',
      },
    }),
    prisma.theme.create({
      data: {
        slug: 'calligraphic',
        name: 'Calligraphic',
        category: 'STYLE',
        description: 'Art incorporating Arabic calligraphy, script, and sign systems.',
      },
    }),
    prisma.theme.create({
      data: {
        slug: 'expressionism',
        name: 'Expressionism',
        category: 'STYLE',
        description: 'Emotionally intense work prioritizing subjective experience.',
      },
    }),

    // Technique themes
    prisma.theme.create({
      data: {
        slug: 'documentary',
        name: 'Documentary',
        category: 'TECHNIQUE',
        description: 'Documentary approach capturing reality and social conditions.',
      },
    }),
    prisma.theme.create({
      data: {
        slug: 'staged',
        name: 'Staged',
        category: 'TECHNIQUE',
        description: 'Constructed or staged imagery with deliberate artistic direction.',
      },
    }),
    prisma.theme.create({
      data: {
        slug: 'mixed-media',
        name: 'Mixed Media',
        category: 'TECHNIQUE',
        description: 'Works combining multiple materials and techniques.',
      },
    }),
  ]);

  const themeMap = Object.fromEntries(themes.map((t) => [t.slug, t]));
  console.log(`✅ Created ${themes.length} themes`);

  // ==========================================================================
  // MOVEMENTS
  // ==========================================================================

  const movements = await Promise.all([
    prisma.movement.create({
      data: {
        slug: 'casablanca-school',
        name: 'Casablanca School',
        nameArabic: 'مدرسة الدار البيضاء',
        periodStart: 1962,
        periodEnd: 1974,
        description: 'A pivotal movement in Moroccan modern art emerging after independence. Founded around the Casablanca School of Fine Arts, artists sought to create a distinctly Moroccan modernism that rejected both orientalist clichés and uncritical Western imitation. Key figures emphasized research, experimentation, and engagement with Moroccan visual heritage.',
        keyCharacteristics: [
          'Rejection of orientalism and folklorism',
          'Integration of traditional Moroccan visual elements',
          'Emphasis on formal research and experimentation',
          'Engagement with international modernism',
          'Commitment to art education and public access',
        ],
        geographicScope: 'MOROCCO_ONLY',
        status: 'PUBLISHED',
      },
    }),
    prisma.movement.create({
      data: {
        slug: 'presence-plastique',
        name: 'Présence Plastique',
        periodStart: 1966,
        periodEnd: 1971,
        description: 'An artist collective formed in Casablanca that organized exhibitions and promoted contemporary Moroccan art. The group emphasized collective action and believed in art\'s social function.',
        keyCharacteristics: [
          'Collective organization and exhibition',
          'Social engagement through art',
          'Promotion of Moroccan contemporary art',
          'Cross-disciplinary collaboration',
        ],
        geographicScope: 'MOROCCO_ONLY',
        status: 'PUBLISHED',
      },
    }),
    prisma.movement.create({
      data: {
        slug: 'naive-art-morocco',
        name: 'Naïve Art Movement',
        periodStart: 1950,
        periodEnd: 1980,
        description: 'Self-taught artists working outside academic traditions, often depicting daily life, folklore, and spiritual themes with distinctive personal styles.',
        keyCharacteristics: [
          'Self-taught artistic practice',
          'Vivid colors and flattened perspective',
          'Folk and spiritual themes',
          'Personal symbolic language',
        ],
        geographicScope: 'MOROCCO_ONLY',
        status: 'PUBLISHED',
      },
    }),
    prisma.movement.create({
      data: {
        slug: 'contemporary-moroccan',
        name: 'Contemporary Moroccan Art',
        periodStart: 1990,
        description: 'The contemporary period marked by increased international visibility, diverse media, and engagement with global art discourse while maintaining connections to Moroccan identity and context.',
        keyCharacteristics: [
          'International exhibition presence',
          'Diverse media including video and installation',
          'Engagement with global contemporary art',
          'Critical examination of Moroccan society',
          'Diaspora perspectives',
        ],
        geographicScope: 'INTERNATIONAL',
        status: 'PUBLISHED',
      },
    }),
    prisma.movement.create({
      data: {
        slug: 'moroccan-photography-pioneers',
        name: 'Moroccan Photography Pioneers',
        periodStart: 1900,
        periodEnd: 1960,
        description: 'Early Moroccan photographers who documented the country during the colonial period and transition to independence, creating important historical records.',
        keyCharacteristics: [
          'Documentary photography',
          'Portrait studios',
          'Historical documentation',
          'Transition from colonial to post-colonial perspective',
        ],
        geographicScope: 'MOROCCO_ONLY',
        status: 'PUBLISHED',
      },
    }),
    prisma.movement.create({
      data: {
        slug: 'post-independence-modernism',
        name: 'Post-Independence Modernism',
        periodStart: 1956,
        periodEnd: 1985,
        description: 'The broader movement of Moroccan artists after independence seeking to define a national artistic identity while engaging with international modernism.',
        keyCharacteristics: [
          'Search for national artistic identity',
          'Dialogue with Western modernism',
          'Rejection of orientalist imagery',
          'Emphasis on formal innovation',
        ],
        geographicScope: 'MOROCCO_ONLY',
        status: 'PUBLISHED',
      },
    }),
  ]);

  const movementMap = Object.fromEntries(movements.map((m) => [m.slug, m]));
  console.log(`✅ Created ${movements.length} movements`);

  // ==========================================================================
  // ARTISTS
  // ==========================================================================

  const artists = await Promise.all([
    // Painters
    prisma.artist.create({
      data: {
        slug: 'farid-belkahia',
        name: 'Farid Belkahia',
        nameArabic: 'فريد بلكاهية',
        medium: 'PAINTING',
        birthYear: 1934,
        deathYear: 2014,
        nationality: 'Moroccan',
        moroccanConnection: 'BORN',
        biography: `Farid Belkahia was one of the most influential figures in modern Moroccan art. Born in Marrakech in 1934, he studied at the École des Beaux-Arts in Paris and later in Prague and Rome. In 1962, he became director of the Casablanca School of Fine Arts, where he led a revolutionary approach to art education.

Belkahia rejected easel painting and oil on canvas, instead working with copper, leather, and natural dyes—materials rooted in Moroccan craft traditions. His works often incorporated symbols from Berber culture, Arabic calligraphy, and pre-Islamic Moroccan heritage.

He was a founding member of the Casablanca School movement, which sought to create an authentic Moroccan modernism free from both Western imitation and orientalist clichés. His work has been exhibited internationally and is held in major collections worldwide.`,
        biographyShort: 'Pioneer of modern Moroccan art, leader of the Casablanca School, known for works on copper and leather incorporating Berber symbols.',
        activePeriodStart: 1955,
        activePeriodEnd: 2014,
        externalReferences: [
          { type: 'museum', title: 'Centre Pompidou Collection', url: 'https://www.centrepompidou.fr/' },
          { type: 'wikipedia', title: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Farid_Belkahia' },
        ],
        status: 'PUBLISHED',
        accessTier: 'FREE',
      },
    }),
    prisma.artist.create({
      data: {
        slug: 'mohamed-melehi',
        name: 'Mohamed Melehi',
        nameArabic: 'محمد المليحي',
        medium: 'PAINTING',
        birthYear: 1936,
        deathYear: 2020,
        nationality: 'Moroccan',
        moroccanConnection: 'BORN',
        biography: `Mohamed Melehi was a central figure in Moroccan modern art and a key member of the Casablanca School. Born in Asilah in 1936, he studied in Spain, Italy, and the United States, where he was influenced by hard-edge abstraction and Op Art.

Melehi is renowned for his iconic wave motif—undulating, colorful forms that became his signature. He co-founded the Asilah Cultural Festival in 1978, transforming the town into a center for public art and international cultural exchange.

As a professor at the Casablanca School of Fine Arts alongside Belkahia and Chabâa, he helped shape generations of Moroccan artists. His work synthesizes international modernism with Moroccan visual traditions.`,
        biographyShort: 'Key figure of the Casablanca School known for his iconic wave paintings and co-founding the Asilah Cultural Festival.',
        activePeriodStart: 1958,
        activePeriodEnd: 2020,
        externalReferences: [
          { type: 'archive', title: 'Mathaf Encyclopedia', url: 'https://encyclopedia.mathaf.org.qa/' },
        ],
        status: 'PUBLISHED',
        accessTier: 'FREE',
      },
    }),
    prisma.artist.create({
      data: {
        slug: 'mohamed-chabaa',
        name: 'Mohamed Chabâa',
        nameArabic: 'محمد شبعة',
        medium: 'PAINTING',
        birthYear: 1935,
        deathYear: 2013,
        nationality: 'Moroccan',
        moroccanConnection: 'BORN',
        biography: `Mohamed Chabâa was a painter, muralist, and art theorist who played a crucial role in defining Moroccan modern art. Born in Tangier in 1935, he studied in Tetouan and Paris before joining the Casablanca School of Fine Arts.

Chabâa's work evolved from geometric abstraction to socially engaged art, including large-scale public murals. He was deeply committed to making art accessible to all Moroccans, not just elites. His theoretical writings on Moroccan art identity remain influential.

He was instrumental in the Casablanca School movement and later became increasingly focused on public art and the democratization of artistic experience.`,
        biographyShort: 'Painter, muralist, and theorist of the Casablanca School, known for geometric abstraction and public art.',
        activePeriodStart: 1957,
        activePeriodEnd: 2013,
        status: 'PUBLISHED',
        accessTier: 'FREE',
      },
    }),
    prisma.artist.create({
      data: {
        slug: 'chaïbia-talal',
        name: 'Chaïbia Talal',
        nameArabic: 'الشعيبية طلال',
        medium: 'PAINTING',
        birthYear: 1929,
        deathYear: 2004,
        nationality: 'Moroccan',
        moroccanConnection: 'BORN',
        biography: `Chaïbia Talal was a self-taught painter who became one of Morocco's most celebrated artists. Born in 1929 in Chtouka, she began painting in her forties, encouraged by her son, the painter Ahmed Cherkaoui's friend.

Her vibrant, colorful paintings depict women, daily life, and festive scenes with a distinctive naïve style. Working without formal training, she developed a unique visual language that captured the essence of Moroccan popular life.

Chaïbia's work gained international recognition, and she exhibited widely in Europe and the Arab world. She remains an icon of Moroccan art, representing the power of authentic, untrained artistic vision.`,
        biographyShort: 'Self-taught painter celebrated for vibrant depictions of Moroccan women and daily life in a distinctive naïve style.',
        activePeriodStart: 1965,
        activePeriodEnd: 2004,
        status: 'PUBLISHED',
        accessTier: 'FREE',
      },
    }),
    prisma.artist.create({
      data: {
        slug: 'ahmed-cherkaoui',
        name: 'Ahmed Cherkaoui',
        nameArabic: 'أحمد الشرقاوي',
        medium: 'PAINTING',
        birthYear: 1934,
        deathYear: 1967,
        nationality: 'Moroccan',
        moroccanConnection: 'BORN',
        biography: `Ahmed Cherkaoui was a pioneering Moroccan painter whose brief career left a lasting impact on Moroccan modern art. Born in Boujad in 1934, he studied in Paris and Warsaw, developing a distinctive abstract style that incorporated Berber symbols and signs.

Cherkaoui's paintings synthesize international abstraction with Moroccan visual heritage, particularly tattoo motifs, textile patterns, and calligraphic elements. His approach prefigured much of what the Casablanca School would later pursue.

Tragically, he died in a car accident in 1967 at age 33, cutting short a career of immense promise. He is considered one of the founders of Moroccan modern painting.`,
        biographyShort: 'Pioneer of Moroccan modern painting, synthesizing abstraction with Berber symbols. Died tragically at 33.',
        activePeriodStart: 1956,
        activePeriodEnd: 1967,
        status: 'PUBLISHED',
        accessTier: 'FREE',
      },
    }),
    prisma.artist.create({
      data: {
        slug: 'mahi-binebine',
        name: 'Mahi Binebine',
        nameArabic: 'ماحي بينبين',
        medium: 'BOTH',
        birthYear: 1959,
        nationality: 'Moroccan',
        moroccanConnection: 'BORN',
        biography: `Mahi Binebine is a contemporary Moroccan artist and novelist based in Marrakech. Born in 1959, he lived in Paris and New York before returning to Morocco. His paintings often feature elongated, fragmented human figures.

Binebine's work explores themes of migration, the body, and human vulnerability. His sculptural paintings combine thick impasto with muted earth tones, creating powerful images of human forms in states of tension and transformation.

Also an acclaimed novelist, his books have been translated into multiple languages. His dual practice enriches both his visual and literary work with shared themes of displacement and identity.`,
        biographyShort: 'Contemporary painter and novelist known for elongated figures exploring migration and human vulnerability.',
        activePeriodStart: 1990,
        status: 'PUBLISHED',
        accessTier: 'FREE',
      },
    }),
    prisma.artist.create({
      data: {
        slug: 'lalla-essaydi',
        name: 'Lalla Essaydi',
        nameArabic: 'لالة السعدي',
        medium: 'PHOTOGRAPHY',
        birthYear: 1956,
        nationality: 'Moroccan-American',
        moroccanConnection: 'BORN',
        biography: `Lalla Essaydi is a Moroccan-born artist known for her large-scale photographs that challenge Western orientalist fantasies and explore the complexities of Arab female identity. Born in Morocco, she studied in Paris and Boston.

Her signature works feature women in domestic spaces, their bodies and surroundings covered in Arabic calligraphy written in henna. These images subvert the tradition of orientalist painting while reclaiming women's spaces and voices.

Essaydi's work is held in major collections including the British Museum and the Smithsonian. She has received numerous awards and her photographs command significant attention in the international art market.`,
        biographyShort: 'Moroccan-American artist creating photographs that challenge orientalism through calligraphy-covered female figures.',
        activePeriodStart: 1998,
        status: 'PUBLISHED',
        accessTier: 'FREE',
      },
    }),

    // Photographers
    prisma.artist.create({
      data: {
        slug: 'daoud-aoulad-syad',
        name: 'Daoud Aoulad-Syad',
        nameArabic: 'داود أولاد السيد',
        medium: 'PHOTOGRAPHY',
        birthYear: 1953,
        nationality: 'Moroccan',
        moroccanConnection: 'BORN',
        biography: `Daoud Aoulad-Syad is one of Morocco's most important photographers and filmmakers. Born in Marrakech in 1953, he studied cinema in Paris before returning to Morocco to pursue photography.

His black-and-white photographs capture Moroccan life with poetic sensitivity, from bustling medinas to quiet rural scenes. His work documents social change while maintaining an aesthetic refinement that elevates documentary to art.

As a filmmaker, he has directed several acclaimed features. His photographic work has been exhibited internationally and published in numerous books documenting Moroccan society.`,
        biographyShort: 'Photographer and filmmaker known for poetic black-and-white images of Moroccan life and society.',
        activePeriodStart: 1975,
        status: 'PUBLISHED',
        accessTier: 'FREE',
      },
    }),
    prisma.artist.create({
      data: {
        slug: 'hicham-benohoud',
        name: 'Hicham Benohoud',
        nameArabic: 'هشام بنوهود',
        medium: 'PHOTOGRAPHY',
        birthYear: 1968,
        nationality: 'Moroccan',
        moroccanConnection: 'BORN',
        biography: `Hicham Benohoud is a contemporary Moroccan photographer known for his conceptual and often surreal images. Born in Marrakech in 1968, he worked as an art teacher before focusing on photography.

His series "The Classroom" features staged photographs of schoolchildren in absurdist situations, questioning authority and educational systems. Other series explore domestic spaces, the body, and Moroccan social conventions.

Benohoud's work combines humor with social critique, using staging and manipulation to create images that are both playful and provocative. He has exhibited widely in Europe, the Middle East, and Africa.`,
        biographyShort: 'Contemporary photographer known for surreal, conceptual images questioning authority and social conventions.',
        activePeriodStart: 1998,
        status: 'PUBLISHED',
        accessTier: 'FREE',
      },
    }),
    prisma.artist.create({
      data: {
        slug: 'yto-barrada',
        name: 'Yto Barrada',
        nameArabic: 'يطو بارادا',
        medium: 'BOTH',
        birthYear: 1971,
        nationality: 'Moroccan-French',
        moroccanConnection: 'BORN',
        biography: `Yto Barrada is a Moroccan-French artist working in photography, film, and installation. Born in Paris in 1971, she grew up in Tangier, which features prominently in her work.

Her photographs and films examine Tangier's urban transformation, migration, and the complexities of postcolonial identity. Her work often focuses on overlooked subjects—palm trees, construction sites, waiting migrants—finding poetry in the margins.

Barrada founded the Cinémathèque de Tanger, an important cultural institution. Her work is in major international collections and she has exhibited at institutions including MoMA and Tate Modern.`,
        biographyShort: 'Moroccan-French artist exploring Tangier, migration, and postcolonial identity through photography and film.',
        activePeriodStart: 1998,
        status: 'PUBLISHED',
        accessTier: 'FREE',
      },
    }),
    prisma.artist.create({
      data: {
        slug: 'hassan-hajjaj',
        name: 'Hassan Hajjaj',
        nameArabic: 'حسن حجاج',
        medium: 'PHOTOGRAPHY',
        birthYear: 1961,
        nationality: 'Moroccan-British',
        moroccanConnection: 'BORN',
        biography: `Hassan Hajjaj is a Moroccan-British artist known for vibrant portraits that blend Moroccan and pop culture aesthetics. Born in Larache in 1961, he moved to London as a teenager and is self-taught as an artist.

His photographs feature subjects in colorful clothing against backdrops of Arabic product packaging, creating a distinctive "Moroccan Pop Art" aesthetic. He designs the clothing, sets, and frames, creating total environments.

Often called "the Andy Warhol of Marrakech," Hajjaj's work celebrates North African and African culture while challenging stereotypes. His portraits have been exhibited at the British Museum and Victoria & Albert Museum.`,
        biographyShort: 'Moroccan-British artist creating vibrant "Moroccan Pop Art" portraits blending African and Western aesthetics.',
        activePeriodStart: 1990,
        status: 'PUBLISHED',
        accessTier: 'FREE',
      },
    }),
    prisma.artist.create({
      data: {
        slug: 'leila-alaoui',
        name: 'Leila Alaoui',
        nameArabic: 'ليلى علوي',
        medium: 'PHOTOGRAPHY',
        birthYear: 1982,
        deathYear: 2016,
        nationality: 'Moroccan-French',
        moroccanConnection: 'BORN',
        biography: `Leila Alaoui was a Moroccan-French photographer and video artist whose work explored identity, migration, and cultural diversity. Born in Paris in 1982 to a Moroccan father and French mother, she studied photography in New York and London.

Her series "The Moroccans" documented diverse faces across Morocco, inspired by Irving Penn's portraits. "No Pasará" followed Sub-Saharan migrants in Morocco. Her video work explored the migrant experience with empathy and artistic vision.

Tragically, Alaoui was killed in the 2016 Ouagadougou terrorist attack while on assignment. She was 33 years old. Her foundation continues her work documenting migration and cultural identity.`,
        biographyShort: 'Photographer documenting Moroccan identity and migration. Killed tragically at 33 in the 2016 Ouagadougou attack.',
        activePeriodStart: 2006,
        activePeriodEnd: 2016,
        status: 'PUBLISHED',
        accessTier: 'FREE',
      },
    }),
    prisma.artist.create({
      data: {
        slug: 'mohamed-abouelouakar',
        name: 'Mohamed Abouelouakar',
        nameArabic: 'محمد أبو الوقار',
        medium: 'PAINTING',
        birthYear: 1939,
        nationality: 'Moroccan',
        moroccanConnection: 'BORN',
        biography: `Mohamed Abouelouakar is a Moroccan painter known for his abstract expressionist works. Born in Salé in 1939, he studied at the Casablanca School of Fine Arts and later in Paris.

His paintings feature dynamic compositions with bold colors and gestural brushwork. While abstract, his work often evokes Moroccan landscapes and light through color and texture.

Abouelouakar has exhibited throughout Morocco and internationally, contributing to the development of abstraction in Moroccan art while maintaining an individual voice distinct from the Casablanca School.`,
        biographyShort: 'Abstract expressionist painter known for dynamic compositions evoking Moroccan landscapes through color.',
        activePeriodStart: 1960,
        status: 'PUBLISHED',
        accessTier: 'FREE',
      },
    }),
    prisma.artist.create({
      data: {
        slug: 'mohamed-kacimi',
        name: 'Mohamed Kacimi',
        nameArabic: 'محمد القاسمي',
        medium: 'PAINTING',
        birthYear: 1942,
        deathYear: 2003,
        nationality: 'Moroccan',
        moroccanConnection: 'BORN',
        biography: `Mohamed Kacimi was a painter and writer whose lyrical abstract works earned him recognition as one of Morocco's most important modern artists. Born in Meknes in 1942, he was largely self-taught.

His paintings feature luminous colors and fluid forms that evoke natural phenomena—light, water, air. Kacimi's work is deeply poetic, reflecting his parallel practice as a writer and his engagement with Sufi mysticism.

He lived in Paris for many years but remained deeply connected to Morocco. His work is held in numerous public and private collections and he received Morocco's National Prize for Arts.`,
        biographyShort: 'Lyrical abstract painter and writer known for luminous works evoking light and natural phenomena.',
        activePeriodStart: 1965,
        activePeriodEnd: 2003,
        status: 'PUBLISHED',
        accessTier: 'FREE',
      },
    }),
  ]);

  const artistMap = Object.fromEntries(artists.map((a) => [a.slug, a]));
  console.log(`✅ Created ${artists.length} artists`);

  // ==========================================================================
  // ARTIST RELATIONSHIPS (Cities, Themes, Movements)
  // ==========================================================================

  // Artist-City relationships
  const artistCities = [
    { artist: 'farid-belkahia', city: 'marrakech', relation: 'BORN' },
    { artist: 'farid-belkahia', city: 'casablanca', relation: 'WORKED' },
    { artist: 'farid-belkahia', city: 'paris', relation: 'WORKED' },
    { artist: 'mohamed-melehi', city: 'asilah', relation: 'BORN' },
    { artist: 'mohamed-melehi', city: 'casablanca', relation: 'WORKED' },
    { artist: 'mohamed-chabaa', city: 'tangier', relation: 'BORN' },
    { artist: 'mohamed-chabaa', city: 'casablanca', relation: 'WORKED' },
    { artist: 'chaibia-talal', city: 'casablanca', relation: 'BASED' },
    { artist: 'ahmed-cherkaoui', city: 'casablanca', relation: 'WORKED' },
    { artist: 'ahmed-cherkaoui', city: 'paris', relation: 'WORKED' },
    { artist: 'mahi-binebine', city: 'marrakech', relation: 'BASED' },
    { artist: 'mahi-binebine', city: 'paris', relation: 'WORKED' },
    { artist: 'mahi-binebine', city: 'new-york', relation: 'WORKED' },
    { artist: 'lalla-essaydi', city: 'marrakech', relation: 'BORN' },
    { artist: 'lalla-essaydi', city: 'new-york', relation: 'BASED' },
    { artist: 'daoud-aoulad-syad', city: 'marrakech', relation: 'BORN' },
    { artist: 'hicham-benohoud', city: 'marrakech', relation: 'BASED' },
    { artist: 'yto-barrada', city: 'tangier', relation: 'BASED' },
    { artist: 'yto-barrada', city: 'paris', relation: 'BORN' },
    { artist: 'hassan-hajjaj', city: 'marrakech', relation: 'BASED' },
    { artist: 'leila-alaoui', city: 'paris', relation: 'BORN' },
    { artist: 'leila-alaoui', city: 'marrakech', relation: 'BASED' },
    { artist: 'mohamed-kacimi', city: 'fez', relation: 'BORN' },
    { artist: 'mohamed-kacimi', city: 'paris', relation: 'BASED' },
  ];

  await prisma.artistCity.createMany({
    data: artistCities.map((ac) => ({
      artistId: artistMap[ac.artist].id,
      cityId: cityMap[ac.city].id,
      relationType: ac.relation as any,
    })),
  });

  console.log(`✅ Created ${artistCities.length} artist-city relations`);

  // Artist-Theme relationships
  const artistThemes = [
    { artist: 'farid-belkahia', themes: ['abstraction', 'identity', 'tradition-modernity', 'calligraphic'] },
    { artist: 'mohamed-melehi', themes: ['abstraction', 'tradition-modernity'] },
    { artist: 'mohamed-chabaa', themes: ['abstraction', 'identity'] },
    { artist: 'chaibia-talal', themes: ['figuration', 'daily-life', 'feminism'] },
    { artist: 'ahmed-cherkaoui', themes: ['abstraction', 'calligraphic', 'identity'] },
    { artist: 'mahi-binebine', themes: ['figuration', 'body', 'diaspora', 'expressionism'] },
    { artist: 'lalla-essaydi', themes: ['feminism', 'identity', 'calligraphic', 'colonialism', 'staged'] },
    { artist: 'daoud-aoulad-syad', themes: ['documentary', 'street', 'daily-life'] },
    { artist: 'hicham-benohoud', themes: ['staged', 'identity', 'body'] },
    { artist: 'yto-barrada', themes: ['documentary', 'diaspora', 'colonialism', 'street'] },
    { artist: 'hassan-hajjaj', themes: ['portrait', 'identity', 'staged'] },
    { artist: 'leila-alaoui', themes: ['portrait', 'identity', 'diaspora', 'documentary'] },
    { artist: 'mohamed-kacimi', themes: ['abstraction', 'spirituality', 'landscape'] },
  ];

  for (const at of artistThemes) {
    await prisma.artistTheme.createMany({
      data: at.themes.map((t) => ({
        artistId: artistMap[at.artist].id,
        themeId: themeMap[t].id,
      })),
    });
  }

  console.log(`✅ Created artist-theme relations`);

  // Artist-Movement relationships
  const artistMovements = [
    { artist: 'farid-belkahia', movements: ['casablanca-school', 'post-independence-modernism'] },
    { artist: 'mohamed-melehi', movements: ['casablanca-school', 'presence-plastique', 'post-independence-modernism'] },
    { artist: 'mohamed-chabaa', movements: ['casablanca-school', 'presence-plastique'] },
    { artist: 'chaibia-talal', movements: ['naive-art-morocco'] },
    { artist: 'ahmed-cherkaoui', movements: ['post-independence-modernism'] },
    { artist: 'mahi-binebine', movements: ['contemporary-moroccan'] },
    { artist: 'lalla-essaydi', movements: ['contemporary-moroccan'] },
    { artist: 'hicham-benohoud', movements: ['contemporary-moroccan'] },
    { artist: 'yto-barrada', movements: ['contemporary-moroccan'] },
    { artist: 'hassan-hajjaj', movements: ['contemporary-moroccan'] },
    { artist: 'leila-alaoui', movements: ['contemporary-moroccan'] },
  ];

  for (const am of artistMovements) {
    await prisma.artistMovement.createMany({
      data: am.movements.map((m) => ({
        artistId: artistMap[am.artist].id,
        movementId: movementMap[m].id,
      })),
    });
  }

  console.log(`✅ Created artist-movement relations`);

  // Artist-Artist relationships
  const artistRelations = [
    { from: 'farid-belkahia', to: 'mohamed-melehi', type: 'COLLABORATED' },
    { from: 'farid-belkahia', to: 'mohamed-chabaa', type: 'COLLABORATED' },
    { from: 'mohamed-melehi', to: 'mohamed-chabaa', type: 'CONTEMPORARY' },
    { from: 'mahi-binebine', to: 'farid-belkahia', type: 'INFLUENCED_BY' },
    { from: 'yto-barrada', to: 'daoud-aoulad-syad', type: 'INFLUENCED_BY' },
  ];

  await prisma.artistRelation.createMany({
    data: artistRelations.map((ar) => ({
      fromArtistId: artistMap[ar.from].id,
      toArtistId: artistMap[ar.to].id,
      relationType: ar.type as any,
    })),
  });

  console.log(`✅ Created artist-artist relations`);

  // ==========================================================================
  // ARTWORKS
  // ==========================================================================

  const artworks = await Promise.all([
    // Belkahia works
    prisma.artwork.create({
      data: {
        slug: 'hommage-a-gaston-bachelard',
        title: 'Hommage à Gaston Bachelard',
        medium: 'PAINTING',
        year: 1984,
        technique: 'Pigments on leather stretched on wood',
        description: 'A tribute to the French philosopher, this work exemplifies Belkahia\'s mature style using leather as a support with natural pigments. The organic forms and earthy colors reflect his engagement with Moroccan materials and Berber symbolism.',
        artistId: artistMap['farid-belkahia'].id,
        movementId: movementMap['casablanca-school'].id,
        isIconic: true,
        status: 'PUBLISHED',
      },
    }),
    prisma.artwork.create({
      data: {
        slug: 'main-de-fatma',
        title: 'Main de Fatma',
        titleArabic: 'يد فاطمة',
        medium: 'PAINTING',
        year: 1990,
        technique: 'Pigments and henna on leather',
        description: 'A large-scale work incorporating the protective Hamsa hand symbol, rendered on prepared leather with natural pigments. The work connects contemporary artistic practice with traditional Moroccan talismanic imagery.',
        artistId: artistMap['farid-belkahia'].id,
        status: 'PUBLISHED',
      },
    }),

    // Melehi works
    prisma.artwork.create({
      data: {
        slug: 'composition-with-waves',
        title: 'Composition with Waves',
        medium: 'PAINTING',
        year: 1970,
        technique: 'Acrylic on canvas',
        description: 'One of Melehi\'s signature wave paintings, featuring his iconic undulating forms in vibrant colors. The work demonstrates his synthesis of Op Art influences with a personal visual language.',
        artistId: artistMap['mohamed-melehi'].id,
        movementId: movementMap['casablanca-school'].id,
        isIconic: true,
        status: 'PUBLISHED',
      },
    }),
    prisma.artwork.create({
      data: {
        slug: 'flame-waves',
        title: 'Flame Waves',
        medium: 'PAINTING',
        year: 1975,
        technique: 'Acrylic on canvas',
        description: 'A dynamic composition where the wave motif transforms into flame-like forms, demonstrating Melehi\'s exploration of rhythm and movement through color and form.',
        artistId: artistMap['mohamed-melehi'].id,
        status: 'PUBLISHED',
      },
    }),

    // Chaïbia works
    prisma.artwork.create({
      data: {
        slug: 'femmes-au-marche',
        title: 'Femmes au marché',
        medium: 'PAINTING',
        year: 1980,
        technique: 'Oil on canvas',
        description: 'A vibrant scene of women at a Moroccan market, painted in Chaïbia\'s characteristic bold colors and flattened perspective. The work celebrates the energy and color of everyday Moroccan life.',
        artistId: artistMap['chaibia-talal'].id,
        movementId: movementMap['naive-art-morocco'].id,
        isIconic: true,
        status: 'PUBLISHED',
      },
    }),

    // Cherkaoui works
    prisma.artwork.create({
      data: {
        slug: 'signes-berberes',
        title: 'Signes Berbères',
        medium: 'PAINTING',
        year: 1965,
        technique: 'Oil on canvas',
        description: 'An abstract composition incorporating Berber symbols and signs drawn from tattoo traditions and textile patterns. This work exemplifies Cherkaoui\'s synthesis of international abstraction with Moroccan visual heritage.',
        artistId: artistMap['ahmed-cherkaoui'].id,
        isIconic: true,
        status: 'PUBLISHED',
      },
    }),

    // Binebine works
    prisma.artwork.create({
      data: {
        slug: 'les-migrants',
        title: 'Les Migrants',
        medium: 'PAINTING',
        year: 2008,
        technique: 'Mixed media on canvas',
        description: 'A powerful work depicting fragmented human figures, addressing the theme of migration that is central to Binebine\'s practice. The elongated, vulnerable forms express the physical and psychological toll of displacement.',
        artistId: artistMap['mahi-binebine'].id,
        movementId: movementMap['contemporary-moroccan'].id,
        isIconic: true,
        status: 'PUBLISHED',
      },
    }),

    // Lalla Essaydi works
    prisma.artwork.create({
      data: {
        slug: 'converging-territories-1',
        title: 'Converging Territories #1',
        medium: 'PHOTOGRAPHY',
        year: 2003,
        technique: 'Chromogenic print',
        dimensions: '121.9 × 152.4 cm',
        description: 'Part of Essaydi\'s groundbreaking series, this photograph shows a woman in a domestic space, her body and surroundings covered in Arabic calligraphy written in henna. The work reclaims orientalist imagery while giving voice to Arab women.',
        artistId: artistMap['lalla-essaydi'].id,
        movementId: movementMap['contemporary-moroccan'].id,
        isIconic: true,
        status: 'PUBLISHED',
      },
    }),
    prisma.artwork.create({
      data: {
        slug: 'bullets-revisited-1',
        title: 'Bullets Revisited #1',
        medium: 'PHOTOGRAPHY',
        year: 2012,
        technique: 'Chromogenic print',
        description: 'From a later series where calligraphy is replaced by bullet casings, this work addresses violence and gender while maintaining Essaydi\'s signature staging of women in decorated spaces.',
        artistId: artistMap['lalla-essaydi'].id,
        status: 'PUBLISHED',
      },
    }),

    // Daoud Aoulad-Syad works
    prisma.artwork.create({
      data: {
        slug: 'marrakech-medina',
        title: 'Marrakech Medina',
        medium: 'PHOTOGRAPHY',
        year: 1985,
        technique: 'Gelatin silver print',
        description: 'A poetic black-and-white view of the Marrakech medina, capturing the interplay of light and shadow in the ancient streets. The image exemplifies Aoulad-Syad\'s documentary approach elevated by artistic sensitivity.',
        artistId: artistMap['daoud-aoulad-syad'].id,
        isIconic: true,
        status: 'PUBLISHED',
      },
    }),

    // Hicham Benohoud works
    prisma.artwork.create({
      data: {
        slug: 'the-classroom-1',
        title: 'The Classroom #1',
        medium: 'PHOTOGRAPHY',
        year: 2000,
        technique: 'C-print',
        description: 'From Benohoud\'s acclaimed series placing schoolchildren in absurdist situations. This staged photograph questions authority, education systems, and the construction of childhood.',
        artistId: artistMap['hicham-benohoud'].id,
        movementId: movementMap['contemporary-moroccan'].id,
        isIconic: true,
        status: 'PUBLISHED',
      },
    }),

    // Yto Barrada works
    prisma.artwork.create({
      data: {
        slug: 'ferry-tangier',
        title: 'Ferry, Tangier',
        medium: 'PHOTOGRAPHY',
        year: 2002,
        technique: 'C-print',
        description: 'A quiet image of the ferry between Tangier and Spain, addressing the theme of migration that runs through Barrada\'s work. The mundane subject becomes charged with significance as a threshold between Africa and Europe.',
        artistId: artistMap['yto-barrada'].id,
        movementId: movementMap['contemporary-moroccan'].id,
        isIconic: true,
        status: 'PUBLISHED',
      },
    }),
    prisma.artwork.create({
      data: {
        slug: 'palm-sign',
        title: 'Palm Sign',
        medium: 'PHOTOGRAPHY',
        year: 2010,
        technique: 'C-print',
        description: 'Part of Barrada\'s investigation of palm trees in Tangier as symbols of postcolonial urbanism and development. The image documents artificial palm decorations in the changing cityscape.',
        artistId: artistMap['yto-barrada'].id,
        status: 'PUBLISHED',
      },
    }),

    // Hassan Hajjaj works
    prisma.artwork.create({
      data: {
        slug: 'kesh-angels',
        title: 'Kesh Angels',
        medium: 'PHOTOGRAPHY',
        year: 2010,
        technique: 'Metallic lambda on dibond with wood and plastic crate frame',
        description: 'A vibrant series depicting women bikers in Marrakech, dressed in colorful djellabas and Nike sneakers. The work celebrates contemporary Moroccan women while subverting stereotypes. Framed in recycled crates, it exemplifies Hajjaj\'s pop aesthetic.',
        artistId: artistMap['hassan-hajjaj'].id,
        movementId: movementMap['contemporary-moroccan'].id,
        isIconic: true,
        status: 'PUBLISHED',
      },
    }),
    prisma.artwork.create({
      data: {
        slug: 'my-rock-stars-experimental-volume-1',
        title: 'My Rock Stars Experimental, Volume 1',
        medium: 'PHOTOGRAPHY',
        year: 2012,
        technique: 'Lambda print with custom frame',
        description: 'Portraits of African musicians and artists in Hajjaj\'s signature style, surrounded by colorful product packaging and African textiles. The series celebrates African creative culture.',
        artistId: artistMap['hassan-hajjaj'].id,
        status: 'PUBLISHED',
      },
    }),

    // Leila Alaoui works
    prisma.artwork.create({
      data: {
        slug: 'the-moroccans-1',
        title: 'The Moroccans #1',
        medium: 'PHOTOGRAPHY',
        year: 2011,
        technique: 'Lambda print',
        description: 'From Alaoui\'s celebrated series documenting the diversity of Moroccan faces and identities. Using a mobile studio, she created dignified portraits across the country, inspired by Irving Penn\'s approach but with a distinctly Moroccan sensibility.',
        artistId: artistMap['leila-alaoui'].id,
        movementId: movementMap['contemporary-moroccan'].id,
        isIconic: true,
        status: 'PUBLISHED',
      },
    }),
    prisma.artwork.create({
      data: {
        slug: 'no-pasara',
        title: 'No Pasará',
        medium: 'PHOTOGRAPHY',
        year: 2008,
        technique: 'Video and photographs',
        description: 'A multimedia project following Sub-Saharan migrants in Morocco, documenting their journeys and hopes. The title references the anti-fascist slogan, here applied to migration barriers.',
        artistId: artistMap['leila-alaoui'].id,
        status: 'PUBLISHED',
      },
    }),

    // Kacimi works
    prisma.artwork.create({
      data: {
        slug: 'lumiere-interieure',
        title: 'Lumière Intérieure',
        medium: 'PAINTING',
        year: 1995,
        technique: 'Oil on canvas',
        description: 'A luminous abstract work demonstrating Kacimi\'s mastery of color and light. The ethereal composition evokes both natural phenomena and spiritual transcendence.',
        artistId: artistMap['mohamed-kacimi'].id,
        isIconic: true,
        status: 'PUBLISHED',
      },
    }),
  ]);

  console.log(`✅ Created ${artworks.length} artworks`);

  // Artwork-Theme relationships
  const artworkThemes = [
    { artwork: 'hommage-a-gaston-bachelard', themes: ['abstraction', 'calligraphic', 'tradition-modernity'] },
    { artwork: 'main-de-fatma', themes: ['abstraction', 'spirituality', 'calligraphic'] },
    { artwork: 'composition-with-waves', themes: ['abstraction'] },
    { artwork: 'flame-waves', themes: ['abstraction'] },
    { artwork: 'femmes-au-marche', themes: ['figuration', 'daily-life', 'street'] },
    { artwork: 'signes-berberes', themes: ['abstraction', 'calligraphic', 'identity'] },
    { artwork: 'les-migrants', themes: ['figuration', 'diaspora', 'body', 'expressionism'] },
    { artwork: 'converging-territories-1', themes: ['staged', 'feminism', 'identity', 'calligraphic'] },
    { artwork: 'bullets-revisited-1', themes: ['staged', 'feminism', 'identity'] },
    { artwork: 'marrakech-medina', themes: ['documentary', 'street', 'landscape'] },
    { artwork: 'the-classroom-1', themes: ['staged', 'identity'] },
    { artwork: 'ferry-tangier', themes: ['documentary', 'diaspora'] },
    { artwork: 'palm-sign', themes: ['documentary', 'colonialism'] },
    { artwork: 'kesh-angels', themes: ['portrait', 'feminism', 'identity', 'staged'] },
    { artwork: 'my-rock-stars-experimental-volume-1', themes: ['portrait', 'identity', 'staged'] },
    { artwork: 'the-moroccans-1', themes: ['portrait', 'identity', 'documentary'] },
    { artwork: 'no-pasara', themes: ['documentary', 'diaspora'] },
    { artwork: 'lumiere-interieure', themes: ['abstraction', 'spirituality'] },
  ];

  const artworkMap = Object.fromEntries(artworks.map((a) => [a.slug, a]));

  for (const at of artworkThemes) {
    if (artworkMap[at.artwork]) {
      await prisma.artworkTheme.createMany({
        data: at.themes.map((t) => ({
          artworkId: artworkMap[at.artwork].id,
          themeId: themeMap[t].id,
        })),
      });
    }
  }

  console.log(`✅ Created artwork-theme relations`);

  // Artwork-City relationships
  const artworkCities = [
    { artwork: 'marrakech-medina', city: 'marrakech', type: 'DEPICTED' },
    { artwork: 'ferry-tangier', city: 'tangier', type: 'DEPICTED' },
    { artwork: 'palm-sign', city: 'tangier', type: 'DEPICTED' },
    { artwork: 'kesh-angels', city: 'marrakech', type: 'CREATED' },
    { artwork: 'the-moroccans-1', city: 'marrakech', type: 'CREATED' },
    { artwork: 'converging-territories-1', city: 'marrakech', type: 'CREATED' },
  ];

  for (const ac of artworkCities) {
    if (artworkMap[ac.artwork]) {
      await prisma.artworkCity.create({
        data: {
          artworkId: artworkMap[ac.artwork].id,
          cityId: cityMap[ac.city].id,
          relationType: ac.type as any,
        },
      });
    }
  }

  console.log(`✅ Created artwork-city relations`);

  // Create IconicImage details for iconic artworks
  const iconicDetails = [
    {
      artwork: 'converging-territories-1',
      subject: 'A woman in traditional domestic space',
      historicalContext: 'Created during the early 2000s when debates about orientalism and representation of Arab women intensified post-9/11.',
      culturalSignificance: 'This work became a touchstone for discussions about reclaiming orientalist imagery and giving voice to Arab women artists. It challenges the male gaze that dominated orientalist painting.',
      publicationHistory: ['Brooklyn Museum exhibition 2005', 'British Museum collection 2010', 'Smithsonian National Museum of African Art'],
    },
    {
      artwork: 'kesh-angels',
      subject: 'Young Moroccan women on motorcycles in colorful dress',
      historicalContext: 'Created in the 2010s as Morocco experienced rapid modernization and shifting gender dynamics.',
      culturalSignificance: 'The series challenged stereotypes about Muslim women and celebrated contemporary Moroccan youth culture, becoming an iconic representation of modern Morocco.',
      publicationHistory: ['Victoria and Albert Museum exhibition', 'Exhibited at Fondation Banque Populaire, Casablanca', 'Featured in British Museum "Africa Remix"'],
    },
    {
      artwork: 'the-moroccans-1',
      subject: 'Portrait of a Moroccan individual',
      historicalContext: 'Part of a nationwide documentation project capturing the diversity of Moroccan identity.',
      culturalSignificance: 'Alaoui\'s portraits gave dignity and visibility to everyday Moroccans, countering reductive stereotypes and celebrating national diversity.',
      publicationHistory: ['Exhibited at Maison Européenne de la Photographie, Paris', 'Published in "Leila Alaoui: I Wanted To Paint Them With Light"'],
    },
  ];

  for (const ic of iconicDetails) {
    if (artworkMap[ic.artwork]) {
      await prisma.iconicImage.create({
        data: {
          artworkId: artworkMap[ic.artwork].id,
          subject: ic.subject,
          historicalContext: ic.historicalContext,
          culturalSignificance: ic.culturalSignificance,
          publicationHistory: ic.publicationHistory,
        },
      });
    }
  }

  console.log(`✅ Created iconic image details`);

  // ==========================================================================
  // TEST USER (for future authentication testing)
  // ==========================================================================

  await prisma.user.create({
    data: {
      email: 'test@moroccoartarchive.com',
      name: 'Test User',
      tier: 'FREE',
    },
  });

  await prisma.user.create({
    data: {
      email: 'premium@moroccoartarchive.com',
      name: 'Premium User',
      tier: 'PREMIUM',
    },
  });

  await prisma.user.create({
    data: {
      email: 'institution@museum.org',
      name: 'Museum Institution',
      tier: 'INSTITUTIONAL',
    },
  });

  console.log(`✅ Created test users`);

  console.log('');
  console.log('🌱 Seed completed successfully!');
  console.log('');
  console.log('Summary:');
  console.log(`  - ${cities.length} cities`);
  console.log(`  - ${themes.length} themes`);
  console.log(`  - ${movements.length} movements`);
  console.log(`  - ${artists.length} artists`);
  console.log(`  - ${artworks.length} artworks`);
  console.log(`  - 3 test users`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
