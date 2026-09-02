# Logo Template Mass Generation Guide

This guide is for generating 300+ logo templates per category for SEO purposes. Use this with the seed script at `scripts/seed-templates.ts`.

## Overview

**Goal:** Generate 6,000+ unique logo templates (300+ per category × 20 categories) targeting long-tail SEO keywords.

**Target Categories:**
1. food-drink
2. tech-startup
3. health-fitness
4. creative-agency
5. ecommerce
6. education
7. finance
8. travel
9. music-entertainment
10. nature-eco
11. fashion-beauty
12. real-estate
13. gaming
14. sports
15. pets
16. legal
17. construction
18. automotive
19. nonprofit
20. photography

---

## Template Structure

Each template needs:
```typescript
{
  slug: string,           // URL-friendly, unique, SEO keyword focused
  name: string,           // Display name
  description: string,    // 1-2 sentences describing the template
  category: string,       // One of the 20 categories
  tags: string[],         // 3-5 relevant tags for search
  config: Partial<LogoConfig>,  // Logo configuration
  seoTitle: string,       // Page title (50-60 chars ideal)
  seoDescription: string, // Meta description (150-160 chars ideal)
  seoKeywords: string[],  // 3-5 target keywords
  featured: boolean,      // true for top templates per category
  sortOrder: number       // Lower = higher priority
}
```

---

## Generation Strategy Per Category

### 1. FOOD & DRINK (300+ templates)

**Sub-niches to cover:**
- Coffee shops (50+): minimalist coffee, vintage coffee, artisan coffee, espresso bar, coffee roaster, cold brew, latte art, third wave coffee, mobile coffee cart, coffee subscription
- Bakeries (40+): artisan bakery, french bakery, cupcake shop, donut shop, bread bakery, pastry shop, wedding cakes, gluten-free bakery, vegan bakery, pie shop
- Restaurants (50+): fine dining, casual dining, family restaurant, bistro, brasserie, steakhouse, seafood restaurant, farm-to-table, pop-up restaurant, ghost kitchen
- Fast food (30+): burger joint, taco stand, hot dog cart, fried chicken, sandwich shop, wrap bar, salad bar, bowl restaurant
- Bars & beverages (40+): wine bar, cocktail bar, speakeasy, rooftop bar, sports bar, juice bar, smoothie shop, bubble tea, kombucha brewery, mocktail bar
- Ethnic cuisines (50+): sushi restaurant, ramen shop, pho restaurant, thai restaurant, indian restaurant, mexican cantina, greek taverna, korean bbq, chinese restaurant, mediterranean grill
- Specialty (40+): ice cream parlor, gelato shop, chocolate shop, candy store, cheese shop, deli, butcher shop, fish market, farmers market vendor, food truck

**Icon variations:** Coffee, Croissant, UtensilsCrossed, Pizza, Beer, Wine, Citrus, IceCream, Fish, Leaf, ChefHat, Wheat, Cookie, Cake, Sandwich, Soup, Salad, Flame

**Color schemes:**
- Warm browns/creams for coffee/bakery
- Rich reds for restaurants
- Fresh greens for healthy options
- Vibrant colors for fast food
- Dark/gold for upscale dining
- Bright colors for desserts

**SEO keyword patterns:**
- `[style] [food-type] logo` (minimalist coffee shop logo)
- `[cuisine] restaurant logo` (japanese sushi restaurant logo)
- `[adjective] [business] logo maker` (modern bakery logo maker)
- `[location-style] [food] logo` (brooklyn style pizza logo)

---

### 2. TECH & STARTUP (300+ templates)

**Sub-niches to cover:**
- SaaS (50+): crm software, project management, hr software, accounting software, marketing automation, analytics platform, collaboration tool, productivity app, workflow automation, no-code platform
- AI/ML (40+): ai startup, machine learning, neural network, chatbot, computer vision, nlp platform, ai assistant, predictive analytics, ai automation
- Developer tools (40+): api platform, devops tool, ci/cd platform, code editor, version control, testing tool, debugging tool, monitoring service, cloud infrastructure
- Mobile apps (30+): ios app, android app, mobile game, utility app, social app, fitness app, finance app, travel app
- Fintech (30+): payment gateway, digital wallet, crypto exchange, banking app, investment platform, insurtech, regtech, lending platform
- Cybersecurity (30+): security software, vpn service, password manager, encryption tool, firewall, threat detection, identity management
- E-commerce tech (30+): shopify app, marketplace platform, inventory management, shipping software, pos system, dropshipping tool
- Emerging tech (50+): blockchain, web3, metaverse, vr/ar, iot platform, edge computing, quantum computing, robotics, drone tech, biotech

**Icon variations:** Rocket, Cloud, Brain, Terminal, Smartphone, Shield, BarChart3, Zap, Wifi, GitBranch, Plug, Boxes, LayoutGrid, CheckSquare, Video, Lock, Database, Server, Cpu, Globe

**Color schemes:**
- Purple/indigo gradients for AI/innovation
- Blue tones for trust/enterprise
- Green for growth/success
- Dark themes with neon accents for dev tools
- Gradient combinations for modern look

**SEO keyword patterns:**
- `[tech-type] startup logo` (ai startup logo)
- `[software-type] company logo` (saas company logo)
- `[industry] tech logo maker` (fintech logo maker)
- `modern [tech] logo` (modern devops logo)

---

### 3. HEALTH & FITNESS (300+ templates)

**Sub-niches to cover:**
- Gyms (50+): crossfit gym, bodybuilding gym, 24-hour gym, boutique gym, women's gym, senior fitness, functional fitness, strength training, powerlifting gym, home gym
- Yoga/Pilates (40+): yoga studio, hot yoga, vinyasa yoga, pilates studio, barre studio, meditation center, mindfulness app, breathwork studio
- Personal training (30+): personal trainer, online coach, fitness influencer, transformation coach, nutrition coach, wellness coach
- Medical/Clinical (40+): health clinic, medical practice, dental clinic, chiropractic, physical therapy, mental health, counseling, telehealth, urgent care
- Wellness (40+): spa, wellness center, massage therapy, acupuncture, holistic health, naturopathy, ayurveda, retreat center
- Sports medicine (30+): sports clinic, rehabilitation center, performance center, recovery studio, cryotherapy
- Nutrition (40+): nutritionist, dietitian, meal prep, supplement brand, health food store, organic market
- Mental health (30+): therapy practice, counseling center, psychology clinic, life coaching, mindset coaching

**Icon variations:** Dumbbell, Flower2, HeartPulse, Apple, Brain, Droplets, Stethoscope, Pill, Target, Activity, Heart, Leaf, Sun, Moon, Waves, Flame, Timer, Scale

**Color schemes:**
- Red/orange for energy/fitness
- Green for health/nutrition
- Purple/lavender for wellness/spa
- Blue for medical/clinical
- Pink/soft tones for women's fitness
- Earth tones for holistic health

**SEO keyword patterns:**
- `[fitness-type] gym logo` (crossfit gym logo)
- `[wellness-type] logo maker` (yoga studio logo maker)
- `[medical-type] clinic logo` (dental clinic logo)
- `[health-style] brand logo` (holistic health brand logo)

---

### 4. CREATIVE AGENCY (300+ templates)

**Sub-niches to cover:**
- Design studios (50+): graphic design, ui/ux design, web design, brand design, packaging design, motion design, 3d design, product design, interior design, industrial design
- Marketing agencies (50+): digital marketing, content marketing, social media agency, seo agency, ppc agency, email marketing, influencer marketing, growth agency, performance marketing
- Video/Film (40+): video production, film studio, animation studio, motion graphics, documentary, commercial production, music video, youtube production
- Photography (30+): photography studio, portrait photography, wedding photography, product photography, fashion photography, event photography
- Branding (40+): brand agency, naming agency, brand strategy, identity design, logo design, brand consulting
- Content (40+): content studio, podcast production, copywriting, blog writing, ebook publishing, course creation
- Advertising (30+): ad agency, creative agency, campaign agency, media buying, outdoor advertising
- PR/Communications (20+): pr agency, communications firm, crisis management, media relations

**Icon variations:** Palette, Brush, PenTool, Camera, Clapperboard, Sparkles, Layers, TrendingUp, Megaphone, Share2, Layout, Eye, Lightbulb, Pencil, Film, Image, Music, Mic

**Color schemes:**
- Black/white for minimalist design
- Vibrant gradients for creative
- Orange for marketing/energy
- Purple for creativity
- Multi-color for diverse creativity
- Monochrome for sophistication

**SEO keyword patterns:**
- `[creative-type] agency logo` (digital marketing agency logo)
- `[design-type] studio logo` (ui ux design studio logo)
- `creative [industry] logo maker` (creative video production logo maker)
- `[style] [creative-type] logo` (minimalist branding agency logo)

---

### 5. E-COMMERCE (300+ templates)

**Sub-niches to cover:**
- Online stores (50+): shopify store, woocommerce store, amazon seller, etsy shop, ebay store, dropshipping store, print on demand, wholesale store
- Fashion e-commerce (40+): clothing store, shoe store, accessories shop, jewelry store, vintage clothing, streetwear, luxury fashion, sustainable fashion
- Electronics (30+): electronics store, gadget shop, phone accessories, computer parts, gaming gear, audio equipment
- Home & Living (40+): furniture store, home decor, kitchen store, bedding shop, outdoor furniture, smart home
- Beauty & Personal (30+): beauty store, skincare shop, makeup store, haircare, fragrance shop, men's grooming
- Food & Beverage (30+): gourmet food, coffee subscription, wine shop, snack box, meal kit, specialty foods
- Subscription boxes (30+): monthly box, curated subscription, mystery box, sample box, collector box
- Marketplace (30+): multi-vendor marketplace, b2b marketplace, service marketplace, rental marketplace
- D2C brands (20+): direct to consumer, brand store, artisan marketplace

**Icon variations:** ShoppingBag, Store, Package, Gift, ShoppingCart, CreditCard, Truck, Box, Tag, Percent, Crown, Scissors, Shirt, Watch, Sofa, Laptop

**Color schemes:**
- Purple for luxury/premium
- Orange for deals/energy
- Pink for beauty/fashion
- Blue for trust/electronics
- Green for eco-friendly
- Gold for luxury brands

**SEO keyword patterns:**
- `[product-type] store logo` (clothing store logo)
- `online [business] logo maker` (online boutique logo maker)
- `[platform] shop logo` (etsy shop logo)
- `[style] ecommerce logo` (minimalist ecommerce logo)

---

### 6. EDUCATION (300+ templates)

**Sub-niches to cover:**
- Online learning (50+): online course, e-learning platform, mooc, skill platform, certification course, masterclass, workshop, webinar platform
- K-12 (40+): elementary school, middle school, high school, charter school, private school, montessori, waldorf, homeschool
- Higher education (30+): university, college, community college, graduate school, business school, law school, medical school
- Tutoring (40+): tutoring service, test prep, sat prep, language tutoring, math tutoring, homework help, academic coaching
- Professional training (40+): corporate training, leadership development, sales training, compliance training, soft skills
- Coding/Tech education (40+): coding bootcamp, programming course, web development course, data science bootcamp, cybersecurity training
- Language learning (30+): language school, esl program, translation course, immersion program
- Early childhood (30+): preschool, daycare, kindergarten, early learning, play-based learning

**Icon variations:** GraduationCap, BookOpen, Code, Globe, Baby, Laptop, Users, Award, Target, Lightbulb, PenTool, Calculator, Microscope, Music, Palette, Trophy

**Color schemes:**
- Blue for trust/academic
- Green for growth/learning
- Yellow/orange for kids
- Purple for creativity
- Navy for professional
- Bright colors for early childhood

**SEO keyword patterns:**
- `[education-type] logo` (online course logo)
- `[school-type] logo maker` (coding bootcamp logo maker)
- `[subject] tutoring logo` (math tutoring logo)
- `[style] education logo` (modern university logo)

---

### 7. FINANCE (300+ templates)

**Sub-niches to cover:**
- Banking (40+): bank, credit union, online bank, neobank, community bank, commercial bank, investment bank
- Fintech (50+): payment app, digital wallet, money transfer, budgeting app, savings app, robo-advisor, trading app
- Investment (40+): investment firm, wealth management, hedge fund, private equity, venture capital, angel investing, portfolio management
- Insurance (40+): insurance company, health insurance, life insurance, auto insurance, home insurance, insurtech, insurance broker
- Accounting (40+): accounting firm, cpa, bookkeeping, tax preparation, payroll service, audit firm, forensic accounting
- Crypto/Blockchain (40+): crypto exchange, defi platform, nft marketplace, blockchain company, crypto wallet, token project
- Lending (30+): mortgage company, personal loans, business loans, microfinance, peer-to-peer lending, buy now pay later
- Financial planning (20+): financial advisor, retirement planning, estate planning, debt counseling

**Icon variations:** Wallet, Calculator, Coins, LineChart, CandlestickChart, Landmark, Umbrella, PiggyBank, CreditCard, DollarSign, TrendingUp, Shield, Key, Lock, Building

**Color schemes:**
- Green for money/growth
- Blue for trust/stability
- Navy/gold for premium
- Black/gold for luxury
- Orange for crypto
- Purple for fintech innovation

**SEO keyword patterns:**
- `[finance-type] company logo` (investment firm logo)
- `[fintech-type] app logo` (payment app logo)
- `[service] logo maker` (accounting firm logo maker)
- `[style] finance logo` (modern fintech logo)

---

### 8. TRAVEL (300+ templates)

**Sub-niches to cover:**
- Travel agencies (50+): travel agency, tour operator, luxury travel, adventure travel, eco travel, budget travel, group tours, solo travel, honeymoon planning
- Hotels/Accommodation (50+): hotel, resort, boutique hotel, hostel, vacation rental, airbnb, glamping, bed and breakfast, lodge, motel
- Airlines/Transport (30+): airline, charter flights, helicopter tours, cruise line, ferry service, train travel, bus tours
- Adventure/Outdoor (40+): adventure company, hiking tours, camping, safari, diving, skiing, surfing, climbing, kayaking
- Destinations (40+): beach resort, mountain retreat, city tours, island hopping, desert tours, rainforest tours
- Travel tech (30+): booking platform, travel app, itinerary planner, travel review, flight search, hotel booking
- Business travel (30+): corporate travel, business trips, conference planning, expense management
- Specialty travel (30+): culinary tours, wine tours, photography tours, wellness retreats, spiritual journeys

**Icon variations:** Plane, Building2, Tent, PlaneTakeoff, Ship, Train, Car, Compass, Map, MapPin, Mountain, Palmtree, Sun, Camera, Backpack, Globe, Anchor

**Color schemes:**
- Blue for sky/ocean
- Green for nature/eco
- Orange for adventure
- Gold for luxury
- Teal for tropical
- Earth tones for safari

**SEO keyword patterns:**
- `[travel-type] agency logo` (luxury travel agency logo)
- `[accommodation] logo maker` (boutique hotel logo maker)
- `[adventure-type] company logo` (hiking tour company logo)
- `[destination] travel logo` (beach resort logo)

---

### 9. MUSIC & ENTERTAINMENT (300+ templates)

**Sub-niches to cover:**
- Music production (50+): music producer, dj, beat maker, recording studio, mixing engineer, mastering studio, sound design, audio engineer
- Bands/Artists (40+): rock band, jazz ensemble, hip hop artist, electronic artist, solo artist, cover band, tribute band
- Record labels (30+): record label, indie label, electronic label, hip hop label, rock label, classical label
- Podcasts (40+): podcast, interview show, news podcast, comedy podcast, true crime, business podcast, tech podcast
- Live entertainment (40+): concert venue, music festival, nightclub, comedy club, theater, live streaming
- Audio/Radio (30+): radio station, internet radio, audio streaming, audiobook production, voice over
- Gaming/Streaming (40+): game streaming, esports, gaming channel, twitch channel, youtube gaming
- Events (30+): event planning, party planning, wedding dj, corporate events, festival production

**Icon variations:** Music, Mic, Headphones, Radio, Guitar, Drum, Piano, Disc3, Play, Volume2, Gamepad2, Video, Star, Sparkles, PartyPopper, Speaker

**Color schemes:**
- Purple/pink for electronic/modern
- Black/red for rock
- Gold/black for hip hop
- Neon colors for clubs
- Warm tones for acoustic
- Dark with accents for gaming

**SEO keyword patterns:**
- `[music-type] logo` (dj logo)
- `[entertainment-type] logo maker` (podcast logo maker)
- `[genre] band logo` (rock band logo)
- `[style] music logo` (electronic music producer logo)

---

### 10. NATURE & ECO (300+ templates)

**Sub-niches to cover:**
- Environmental (50+): environmental org, conservation, wildlife protection, ocean conservation, rainforest, climate action, carbon offset
- Sustainable business (50+): eco-friendly brand, sustainable fashion, zero waste, plastic-free, ethical brand, b-corp, green business
- Renewable energy (40+): solar company, wind energy, clean energy, ev charging, battery storage, green tech
- Organic/Natural (40+): organic farm, farmers market, natural products, herbal products, essential oils, organic skincare
- Outdoor/Nature (40+): national park, nature reserve, botanical garden, wildlife sanctuary, eco-tourism
- Recycling/Waste (30+): recycling company, waste management, composting, upcycling, circular economy
- Green building (30+): sustainable architecture, green construction, eco homes, passive house, leed certified
- Plant-based (20+): vegan brand, plant-based food, meat alternative, dairy-free

**Icon variations:** Leaf, TreeDeciduous, Sprout, Sun, Wind, Droplet, Recycle, Globe, Mountain, Flower, Bird, Fish, Bee, Butterfly, Cloud, Rainbow

**Color schemes:**
- Green (all shades) primary
- Blue for water/sky
- Brown/earth tones
- Yellow for solar
- White for clean
- Teal for ocean

**SEO keyword patterns:**
- `[eco-type] logo` (sustainable brand logo)
- `[green-business] logo maker` (solar company logo maker)
- `[environmental] organization logo` (wildlife conservation logo)
- `eco-friendly [industry] logo` (eco-friendly packaging logo)

---

### 11. FASHION & BEAUTY (300+ templates)

**Sub-niches to cover:**
- Fashion brands (50+): clothing brand, streetwear, luxury fashion, sustainable fashion, athleisure, vintage fashion, plus size, kids fashion
- Beauty/Cosmetics (50+): makeup brand, skincare, haircare, nail salon, lash studio, brow bar, beauty influencer
- Jewelry/Accessories (40+): jewelry brand, watch brand, sunglasses, handbags, scarves, hats, belts
- Hair salons (40+): hair salon, barbershop, hair colorist, extensions, natural hair, mens grooming
- Spas/Wellness (30+): day spa, nail spa, med spa, waxing studio, tanning salon, facial bar
- Boutiques (30+): clothing boutique, bridal boutique, consignment, vintage store, designer resale
- Personal styling (30+): personal stylist, wardrobe consultant, image consultant, fashion blogger
- Fragrance (30+): perfume brand, cologne, candle brand, aromatherapy, essential oils

**Icon variations:** Shirt, Gem, Scissors, Sparkles, Heart, Crown, Star, Flower, Droplet, Eye, Lips, Hand, Mirror, Brush, Palette

**Color schemes:**
- Pink/rose gold for beauty
- Black/white for luxury
- Gold for premium
- Pastels for soft aesthetics
- Bold colors for streetwear
- Nude tones for skincare

**SEO keyword patterns:**
- `[fashion-type] brand logo` (streetwear brand logo)
- `[beauty-type] logo maker` (skincare brand logo maker)
- `[salon-type] logo` (hair salon logo)
- `[style] fashion logo` (minimalist jewelry logo)

---

### 12. REAL ESTATE (300+ templates)

**Sub-niches to cover:**
- Residential (50+): real estate agent, realtor, real estate team, brokerage, buyer's agent, seller's agent, luxury realtor
- Commercial (40+): commercial real estate, office space, retail space, industrial property, warehouse
- Property management (40+): property manager, rental management, hoa management, landlord services, tenant services
- Development (40+): real estate developer, home builder, construction company, renovation, flipping
- Investment (30+): real estate investment, reit, crowdfunding, syndication, rental investment
- Specialty (40+): vacation rentals, student housing, senior living, affordable housing, co-living
- Services (30+): home staging, real estate photography, virtual tours, home inspection, appraisal
- Mortgage/Finance (30+): mortgage broker, title company, escrow, real estate attorney

**Icon variations:** Home, Building, Building2, Key, Door, Landmark, MapPin, Compass, Ruler, HardHat, Hammer, Trees, Sun, Bed, Bath

**Color schemes:**
- Blue for trust
- Green for growth
- Navy/gold for luxury
- Red for energy
- Earth tones for homes
- Gray for commercial

**SEO keyword patterns:**
- `[real-estate-type] logo` (luxury realtor logo)
- `[property-type] logo maker` (property management logo maker)
- `real estate [specialty] logo` (real estate investment logo)
- `[style] realtor logo` (modern real estate agent logo)

---

### 13. GAMING (300+ templates)

**Sub-niches to cover:**
- Game studios (50+): indie game studio, aaa studio, mobile game studio, casual games, puzzle games, rpg studio, fps studio, strategy games
- Esports (50+): esports team, esports org, tournament, league, gaming arena, esports event
- Streaming (50+): twitch streamer, youtube gaming, content creator, gaming influencer, variety streamer, speedrunner
- Gaming communities (30+): gaming clan, discord server, gaming forum, fan community, modding community
- Game development (30+): game developer, unity developer, unreal developer, game artist, sound designer
- Retro/Arcade (30+): retro gaming, arcade, vintage games, classic games, game collection
- VR/AR gaming (30+): vr games, ar games, metaverse, virtual worlds, simulation
- Tabletop (30+): board games, card games, tabletop rpg, miniatures, game cafe

**Icon variations:** Gamepad2, Joystick, Play, Trophy, Target, Swords, Shield, Crown, Star, Flame, Skull, Ghost, Rocket, Zap, Dices, Heart

**Color schemes:**
- Red/black for intense
- Purple/blue for esports
- Neon colors for streaming
- Dark with RGB accents
- Retro color palettes
- Green for matrix/hacker

**SEO keyword patterns:**
- `[game-type] studio logo` (indie game studio logo)
- `esports [type] logo` (esports team logo)
- `[streaming-type] logo maker` (twitch streamer logo maker)
- `gaming [style] logo` (gaming clan logo)

---

### 14. SPORTS (300+ templates)

**Sub-niches to cover:**
- Team sports (50+): soccer team, basketball team, football team, baseball team, hockey team, volleyball, rugby, cricket
- Individual sports (40+): tennis, golf, swimming, track and field, cycling, triathlon, boxing, mma
- Fitness sports (40+): crossfit, powerlifting, bodybuilding, weightlifting, obstacle racing, functional fitness
- Water sports (30+): surfing, swimming, diving, sailing, kayaking, water polo, rowing
- Winter sports (30+): skiing, snowboarding, ice hockey, figure skating, curling
- Outdoor sports (30+): hiking, climbing, trail running, mountain biking, camping, fishing
- Youth sports (30+): little league, youth soccer, kids sports, sports camp, junior athletics
- Sports business (50+): sports agency, sports marketing, athlete management, sports media, sports tech, fitness brand

**Icon variations:** Trophy, Medal, Target, Dumbbell, Bike, Waves, Mountain, Flag, Timer, Award, Star, Shield, Flame, Footprints, Ball

**Color schemes:**
- Team colors (customizable)
- Red for energy/power
- Blue for water sports
- Green for field sports
- Orange for action
- Gold for champions

**SEO keyword patterns:**
- `[sport] team logo` (soccer team logo)
- `[sport] club logo maker` (tennis club logo maker)
- `[sports-type] brand logo` (fitness brand logo)
- `[style] sports logo` (modern basketball logo)

---

### 15. PETS (300+ templates)

**Sub-niches to cover:**
- Pet stores (40+): pet shop, pet supplies, pet food, pet accessories, aquarium store, reptile store
- Veterinary (50+): vet clinic, animal hospital, emergency vet, mobile vet, specialty vet, holistic vet
- Grooming (40+): dog grooming, cat grooming, mobile grooming, pet spa, self-serve wash
- Training (40+): dog training, puppy training, obedience school, agility training, service dog training
- Pet care (40+): pet sitting, dog walking, pet boarding, doggy daycare, house sitting
- Breeding/Adoption (30+): dog breeder, cat breeder, rescue, shelter, adoption agency
- Pet products (30+): pet food brand, pet toy brand, pet clothing, pet tech, pet furniture
- Specialty (30+): exotic pets, bird store, horse stable, farm animals, wildlife rehabilitation

**Icon variations:** PawPrint, Dog, Cat, Bird, Fish, Rabbit, Heart, Stethoscope, Bone, Bowl, Home, Scissors, Leash, Collar

**Color schemes:**
- Pink/purple for grooming
- Green for veterinary
- Blue for pet stores
- Orange for playful
- Earth tones for natural
- Bright colors for toys

**SEO keyword patterns:**
- `[pet-type] shop logo` (pet store logo)
- `[service] logo maker` (dog grooming logo maker)
- `[animal] [service] logo` (cat boarding logo)
- `pet [business] logo` (pet sitting logo)

---

### 16. LEGAL (300+ templates)

**Sub-niches to cover:**
- Law firms (50+): law firm, attorney, lawyer, legal practice, law office, legal group, law partners
- Practice areas (100+): personal injury, criminal defense, family law, divorce attorney, immigration lawyer, bankruptcy, estate planning, real estate law, business law, intellectual property, employment law, tax attorney, medical malpractice, civil litigation, environmental law
- Legal services (50+): legal aid, paralegal, notary, court reporter, legal consultant, mediation, arbitration
- Corporate legal (40+): corporate counsel, in-house legal, compliance, contract law, m&a attorney, securities law
- Legal tech (30+): legal software, case management, e-discovery, legal research, contract automation
- Specialty (30+): international law, maritime law, entertainment law, sports law, cannabis law, cyber law

**Icon variations:** Scale, Gavel, Book, Building, Shield, FileText, Briefcase, Scroll, Pen, Landmark, Balance, Lock

**Color schemes:**
- Navy/gold traditional
- Black/white classic
- Blue for trust
- Burgundy for prestige
- Gray for corporate
- Green for environmental law

**SEO keyword patterns:**
- `[practice-area] lawyer logo` (personal injury lawyer logo)
- `law firm logo maker` (corporate law firm logo maker)
- `[specialty] attorney logo` (immigration attorney logo)
- `[style] legal logo` (modern law firm logo)

---

### 17. CONSTRUCTION (300+ templates)

**Sub-niches to cover:**
- General construction (50+): construction company, general contractor, building company, construction crew, project management
- Residential (50+): home builder, home renovation, remodeling, addition, custom homes, spec homes
- Commercial (40+): commercial construction, office building, retail construction, industrial construction
- Trades (80+): electrician, plumber, hvac, roofing, flooring, painting, carpentry, masonry, concrete, welding, drywall, insulation, siding, windows, doors, fencing, landscaping, paving
- Specialty (40+): demolition, excavation, foundation, framing, finishing, green building, historic restoration
- Heavy construction (20+): road construction, bridge building, infrastructure, civil engineering
- Equipment (20+): equipment rental, tool rental, crane service, hauling, material supply

**Icon variations:** HardHat, Hammer, Wrench, Home, Building, Ruler, Zap, Droplet, Flame, Truck, Crane, Shovel, Drill, Saw, Brick

**Color schemes:**
- Yellow/black for safety
- Orange for construction
- Blue for plumbing/hvac
- Green for landscaping
- Red for electrical
- Gray for industrial

**SEO keyword patterns:**
- `[trade] logo` (electrician logo)
- `[construction-type] company logo` (roofing company logo)
- `[service] contractor logo maker` (plumbing contractor logo maker)
- `[style] construction logo` (modern home builder logo)

---

### 18. AUTOMOTIVE (300+ templates)

**Sub-niches to cover:**
- Dealerships (40+): car dealership, used cars, new cars, luxury cars, trucks, motorcycles, rv dealer
- Repair/Service (60+): auto repair, mechanic, oil change, tire shop, brake service, transmission, auto body, collision repair, paint shop
- Specialty service (50+): car detailing, car wash, window tinting, audio installation, performance tuning, custom cars, restoration
- Parts/Accessories (40+): auto parts, car accessories, performance parts, aftermarket, wheels, tires
- Rental/Leasing (30+): car rental, truck rental, exotic car rental, car subscription, fleet management
- Electric vehicles (30+): ev dealer, ev charging, electric car service, hybrid specialist
- Commercial (30+): fleet service, commercial vehicles, trucking, logistics, transport
- Motorsports (20+): racing team, car club, track day, drag racing, rally

**Icon variations:** Car, Truck, Wrench, Gauge, Fuel, Battery, Zap, Key, Shield, Star, Tool, Engine, Wheel, Flag

**Color schemes:**
- Red for performance
- Blue for service
- Black for luxury
- Yellow for taxis/rental
- Green for eco/ev
- Orange for energy

**SEO keyword patterns:**
- `[auto-service] logo` (car detailing logo)
- `[vehicle-type] dealer logo` (motorcycle dealer logo)
- `auto [service] logo maker` (auto repair logo maker)
- `[style] automotive logo` (modern car wash logo)

---

### 19. NONPROFIT (300+ templates)

**Sub-niches to cover:**
- Charity (50+): charity, foundation, nonprofit, 501c3, giving, philanthropy, humanitarian, relief
- Social causes (60+): poverty, hunger, homelessness, education, healthcare, disability, veterans, elderly, children, refugees
- Environmental (40+): environmental, conservation, wildlife, ocean, climate, sustainability, renewable
- Health (40+): disease research, mental health, addiction recovery, patient support, healthcare access
- Community (40+): community center, neighborhood, civic, volunteer, mutual aid, social services
- Arts & Culture (30+): arts nonprofit, museum, cultural center, historic preservation, public art
- Religious (20+): church, mosque, synagogue, temple, religious charity, faith-based
- Advocacy (20+): advocacy, policy, human rights, civil rights, social justice, equality

**Icon variations:** Heart, HandHeart, Users, Globe, Home, Book, Leaf, Shield, Star, Sun, Hand, Gift, Ribbon, Circle

**Color schemes:**
- Blue for trust
- Green for environment
- Red for urgency/health
- Purple for compassion
- Orange for energy
- Earth tones for community

**SEO keyword patterns:**
- `[cause] nonprofit logo` (environmental nonprofit logo)
- `charity logo maker` (children's charity logo maker)
- `[organization-type] logo` (community center logo)
- `[style] nonprofit logo` (modern foundation logo)

---

### 20. PHOTOGRAPHY (300+ templates)

**Sub-niches to cover:**
- Portrait (50+): portrait photographer, headshot, family portrait, senior portrait, baby photography, maternity, boudoir
- Wedding (40+): wedding photographer, engagement, bridal, elopement, destination wedding
- Commercial (50+): product photography, food photography, architectural, real estate photography, fashion photography, advertising
- Event (40+): event photographer, concert, sports photography, corporate event, party photography
- Fine art (30+): fine art photography, gallery, art prints, abstract, landscape, nature
- Lifestyle (30+): lifestyle photographer, brand photography, influencer, content creator
- Documentary (30+): documentary, photojournalism, street photography, travel photography, wildlife
- Technical (30+): drone photography, 360 photography, virtual tour, time-lapse, video production

**Icon variations:** Camera, Focus, Aperture, Image, Film, Eye, Sun, Moon, Mountain, Heart, Star, Frame, Lens, Flash

**Color schemes:**
- Black/white for classic
- Gold for luxury
- Pink for wedding
- Colorful for lifestyle
- Dark for moody
- Clean white for commercial

**SEO keyword patterns:**
- `[photography-type] logo` (wedding photographer logo)
- `[style] photography logo maker` (minimalist portrait logo maker)
- `[specialty] photographer logo` (food photographer logo)
- `photography studio logo` (commercial photography studio logo)

---

## Config Variation Strategies

### Background Modes
1. **Solid colors** - Single background color
2. **Gradients** - Two-color gradients at various angles (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°)

### Border Radius Variations
- `[0]` - Sharp corners (professional, corporate)
- `[12]` - Slight rounding (modern)
- `[24]` - Medium rounding (friendly)
- `[40]` - More rounded (approachable)
- `[64]` - Very rounded (soft)
- `[100]` - Circle/pill (playful)

### Stroke Width Variations
- `[1]` - Thin (elegant, minimal)
- `[1.5]` - Light (balanced)
- `[2]` - Medium (standard)
- `[2.5]` - Bold (strong)
- `[3]` - Heavy (impactful)

### Border Variations
- No border (clean)
- `[1]` thin border
- `[2]` medium border
- `[3]` thick border
- Same color as icon
- Contrasting color

### Shadow Variations
- No shadow (flat)
- Subtle shadow (`shadowBlur: [20], shadowOpacity: [0.1]`)
- Medium shadow (`shadowBlur: [24], shadowOpacity: [0.15]`)
- Strong shadow (`shadowBlur: [30], shadowOpacity: [0.25]`)
- Colored glow (matching icon color)

### Icon Color Modes
1. **Solid** - Single color
2. **Gradient** - Two-color gradient on icon

---

## Slug Naming Convention

Format: `[modifier]-[niche]-[style]-logo`

Examples:
- `minimalist-coffee-shop-logo`
- `modern-tech-startup-logo`
- `vintage-bakery-logo`
- `luxury-law-firm-logo`
- `bold-crossfit-gym-logo`
- `elegant-wedding-photographer-logo`
- `playful-pet-grooming-logo`
- `professional-accounting-firm-logo`

Modifiers:
- Style: minimalist, modern, vintage, retro, classic, elegant, bold, playful, professional, corporate, creative, artistic, clean, sleek, rustic, industrial
- Color: dark, light, colorful, monochrome, neon, pastel, vibrant, muted
- Aesthetic: premium, luxury, budget, affordable, boutique, artisan, handcrafted

---

## Implementation Steps

1. **Create category-specific template files** in `scripts/templates/`:
   - `food-drink-templates.ts`
   - `tech-startup-templates.ts`
   - etc.

2. **Use icon variety** - Each category should use 15-20 different icons

3. **Use color variety** - 20+ unique color schemes per category

4. **Use style variety** - Mix of:
   - Minimalist (no border, clean)
   - Bold (thick strokes, strong colors)
   - Elegant (thin strokes, premium colors)
   - Playful (rounded, bright colors)
   - Professional (sharp corners, muted colors)

5. **Run seed script** for each category batch

6. **Verify SEO** - Check meta titles/descriptions are unique and keyword-rich

---

## Quality Checklist

For each template, verify:
- [ ] Slug is unique and SEO-optimized
- [ ] Name is clear and descriptive
- [ ] Description is compelling (1-2 sentences)
- [ ] Tags are relevant (3-5 tags)
- [ ] Config produces a visually appealing logo
- [ ] SEO title is 50-60 characters
- [ ] SEO description is 150-160 characters
- [ ] SEO keywords target long-tail searches
- [ ] Colors are harmonious
- [ ] Icon matches the business type

---

## Batch Generation Command

```bash
# Generate templates for a specific category
bun run scripts/generate-category-templates.ts --category=food-drink --count=300

# Seed all templates
bun run scripts/seed-templates.ts

# Verify template count
bun run scripts/verify-templates.ts
```

---

## Notes

- Prioritize long-tail keywords that have search volume but low competition
- Each template should be visually distinct
- Featured templates (top 5-10 per category) should be the highest quality
- Use actual business names as inspiration for realistic templates
- Consider seasonal/trending niches (e.g., "ghost kitchen", "virtual event")
- Update templates periodically based on search trends
