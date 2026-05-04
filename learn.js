// ═══════════════════════════════════════════════════
// ArchitexIQ — learn.js
// Full Learning Platform: Construction + Python Course
// Languages: English + Swahili
// ═══════════════════════════════════════════════════

// ═══════════════════════════════════════════════════
// MODULES DATA
// ═══════════════════════════════════════════════════
const MODULES = [
  // ── CONSTRUCTION MODULES ──
  {
    id: 'cm1', type: 'construction', icon: '🏗️', color: '#c9a84c',
    title: 'Material Estimation', desc: 'Mix ratios, volumes & quantities',
    lessons: [
      {
        title: 'Concrete Mix Ratios',
        content: `
          <h2>Concrete Mix Ratios</h2>
          <p>A concrete mix ratio tells you the proportion of <strong>cement, sand, and ballast</strong> to use when mixing concrete.</p>
          <div class="hl">🇰🇪 <strong>Kiswahili:</strong> Uwiano wa mchanganyiko wa saruji — jinsi ya kuchanganya saruji, mchanga na kokoto.</div>
          <p>The most common mix in Kenya:</p>
          <div class="fbox">1:2:4 = 1 cement : 2 sand : 4 ballast
1:1.5:3 = Strong (columns, beams)
1:3:6 = Mass concrete (foundations)
1:4:8 = Blinding (base layer)</div>
          <div class="hl">💡 More cement = stronger & more expensive concrete</div>
          <h3>Which mix to use?</h3>
          <p>Different structures need different strengths:</p>
          <div class="fbox">Columns & beams  → 1:1.5:3 (strongest)
Floor slabs       → 1:2:4  (standard)
Strip foundation  → 1:3:6  (mass)
Blinding layer    → 1:4:8  (cheapest)</div>
          <div class="swahili-note">🗣️ Swahili: Nguzo na boriti zinahitaji mchanganyiko wenye nguvu zaidi (1:1.5:3). Sakafu ya kawaida inatumia 1:2:4.</div>
        `
      },
      {
        title: 'Volume Calculation',
        content: `
          <h2>Calculating Concrete Volume</h2>
          <p>Before calculating materials, you must find the <strong>volume of concrete</strong> needed.</p>
          <div class="fbox">Wet Volume = Length × Width × Thickness
                   (all in metres)</div>
          <p>Then apply the <strong>dry volume factor of 1.54</strong>:</p>
          <div class="fbox">Dry Volume = Wet Volume × 1.54</div>
          <div class="hl">💡 Why 1.54? When dry materials (cement, sand, ballast) mix with water they compact and lose volume. 1.54 accounts for this.</div>
          <div class="swahili-note">🗣️ Swahili: Tunaongeza 1.54 kwa sababu vifaa vikaukavu vinashikana zaidi vikiunganishwa na maji.</div>
          <h3>Example / Mfano:</h3>
          <div class="fbox">Slab: 5m × 4m × 0.15m thick
Wet Volume  = 5 × 4 × 0.15 = 3.0 m³
Dry Volume  = 3.0 × 1.54   = 4.62 m³</div>
        `
      },
      {
        title: 'Calculating Cement Bags',
        content: `
          <h2>How Many Cement Bags?</h2>
          <p>One <strong>50kg cement bag = 0.035 m³</strong></p>
          <div class="fbox">For mix 1:2:4 (total parts = 7):

Cement m³ = (1 ÷ 7) × Dry Volume
Bags      = Cement m³ ÷ 0.035</div>
          <h3>Example / Mfano:</h3>
          <div class="fbox">Dry Volume = 4.62 m³

Cement m³ = (1/7) × 4.62 = 0.66 m³
Bags      = 0.66 ÷ 0.035  = 18.9
          → Round UP to 19 bags</div>
          <div class="hl">💡 Always round UP — never buy less cement than needed!</div>
          <div class="swahili-note">🗣️ Swahili: Daima piga hesabu juu — usipunguze mifuko ya saruji. Ni bora kuwa na ziada kuliko kukosekana.</div>
        `
      },
      {
        title: 'Sand & Ballast Quantities',
        content: `
          <h2>Sand & Ballast Calculation</h2>
          <div class="fbox">For mix 1:2:4 (total = 7):

Sand m³    = (2 ÷ 7) × Dry Volume
Ballast m³ = (4 ÷ 7) × Dry Volume</div>
          <h3>Example / Mfano:</h3>
          <div class="fbox">Dry Volume = 4.62 m³

Sand    = (2/7) × 4.62 = 1.32 m³
Ballast = (4/7) × 4.62 = 2.64 m³</div>
          <div class="hl">💡 Add 10% extra for wastage on all materials!</div>
          <div class="swahili-note">🗣️ Swahili: Ongeza asilimia 10 ya ziada kwa mchanga na kokoto kwa sababu ya upotevu wa vifaa.</div>
        `
      },
    ]
  },
  {
    id: 'cm2', type: 'construction', icon: '🧱', color: '#2ecc71',
    title: 'Walling & Masonry', desc: 'Machine-cut stones, mortar and walls',
    lessons: [
      {
        title: 'Machine-Cut Stones',
        content: `
          <h2>Machine-Cut Stones in Kenya</h2>
          <p>Machine-cut stones (<em>mawe ya mashine</em>) are the most popular walling material in Kenya.</p>
          <div class="hl">Standard size: <strong>390mm × 190mm × 190mm</strong></div>
          <div class="fbox">Stones per m² of wall = 12.5

Total Stones = Wall Area (m²) × 12.5</div>
          <h3>Example / Mfano:</h3>
          <div class="fbox">Wall: 10m long × 3m high
Area   = 10 × 3 = 30 m²
Stones = 30 × 12.5 = 375 stones</div>
          <div class="hl">💡 Add 5-10% extra for wastage and cutting</div>
          <div class="swahili-note">🗣️ Swahili: Kila mita ya mraba ya ukuta inahitaji mawe 12.5. Ongeza asilimia 5-10 kwa upotevu wa kukata.</div>
        `
      },
      {
        title: 'Mortar for Walling',
        content: `
          <h2>Mortar Calculation</h2>
          <p>Mortar fills the joints between stones. Use a <strong>1:4 cement:sand mix</strong> for walling.</p>
          <div class="fbox">Mortar volume ≈ 20% of total wall volume

Wall Volume  = Length × Thickness × Height
Mortar Vol   = Wall Volume × 0.20</div>
          <h3>Example / Mfano:</h3>
          <div class="fbox">Wall: 10m × 0.19m thick × 3m high
Wall Volume  = 10 × 0.19 × 3 = 5.7 m³
Mortar       = 5.7 × 0.20    = 1.14 m³

For 1:4 mix (total = 5):
Cement = (1/5) × 1.14 × 1.54 ÷ 0.035 ≈ 10 bags
Sand   = (4/5) × 1.14 × 1.54 ≈ 1.4 m³</div>
          <div class="swahili-note">🗣️ Swahili: Chokaa inachukua asilimia 20 ya nafasi yote ya ukuta. Tumia mchanganyiko 1:4 kwa kazi ya ujenzi wa kawaida.</div>
        `
      },
    ]
  },
  {
    id: 'cm3', type: 'construction', icon: '📋', color: '#4a9eff',
    title: 'BOQ Preparation', desc: 'Professional bill of quantities',
    lessons: [
      {
        title: 'What is a BOQ?',
        content: `
          <h2>Bill of Quantities (BOQ)</h2>
          <p>A BOQ is a document that lists ALL materials, labour and costs for a construction project.</p>
          <div class="hl">A good BOQ prevents disputes, controls costs and helps procurement.</div>
          <div class="fbox">Standard BOQ Sections:
1. Preliminaries (site setup)
2. Substructure (foundations)
3. Superstructure (walls, columns)
4. Roof (trusses, sheeting)
5. Finishes (plaster, tiles, paint)
6. External Works (fence, driveway)</div>
          <div class="swahili-note">🗣️ Swahili: BOQ ni orodha ya vifaa vyote, wafanyakazi na gharama za mradi wa ujenzi. Inasaidia kudhibiti bajeti.</div>
        `
      },
      {
        title: 'Reading BOQ Items',
        content: `
          <h2>BOQ Item Format</h2>
          <p>Every BOQ line follows this format:</p>
          <div class="fbox">Item | Description | Unit | Qty | Rate | Amount

A1 | Cement 50kg bags | Bags | 50 | 750  | 37,500
A2 | Quarry Sand      | m³   |  5 | 2500 | 12,500
A3 | Ballast          | m³   |  8 | 3000 | 24,000</div>
          <div class="hl">💡 Always check the UNIT before pricing — m², m³, bags, pcs all mean different things!</div>
          <div class="swahili-note">🗣️ Swahili: Angalia kipimo (unit) kwa kila kitu kabla ya kuweka bei. Tofauti kati ya m² na m³ ni kubwa sana!</div>
        `
      },
    ]
  },
  {
    id: 'cm4', type: 'construction', icon: '👷', color: '#9b59b6',
    title: 'Site Management', desc: 'Workers, safety & timelines',
    lessons: [
      {
        title: 'Site Safety Basics',
        content: `
          <h2>Construction Site Safety</h2>
          <p>In Kenya, site safety is governed by the <strong>Occupational Safety and Health Act (OSHA) 2007</strong>.</p>
          <div class="hl">Required PPE on every Kenyan site: Hard hat 🪖, Safety boots 👢, Reflective vest 🦺, Gloves 🧤</div>
          <h3>Common Site Hazards / Hatari za Kawaida:</h3>
          <div class="fbox">• Falls from height (scaffolding)
• Collapsed trenches / Mitaro kuanguka
• Electrical hazards
• Dust and silica inhalation
• Manual handling injuries</div>
          <div class="swahili-note">🗣️ Swahili: Usalama ni muhimu sana. Kila mfanyakazi anavaa vifaa vya kujilinda (PPE) kila wakati.</div>
        `
      },
      {
        title: 'Worker Rates in Kenya',
        content: `
          <h2>Kenyan Worker Daily Rates (2025)</h2>
          <div class="fbox">Fundi (Mason)    → KES 1,500 – 2,500/day
Carpenter        → KES 1,800 – 2,500/day
Labourer         → KES 700  – 1,000/day
Plumber          → KES 2,000 – 3,000/day
Electrician      → KES 2,000 – 3,000/day
Painter          → KES 1,200 – 2,000/day
Foreman          → KES 2,500 – 4,000/day</div>
          <div class="hl">💡 A good foreman multiplies every other worker's productivity!</div>
          <div class="swahili-note">🗣️ Swahili: Msimamizi mzuri ana thamani kubwa — anaweza kuongeza kazi ya wafanyakazi wote wengine mara kadhaa.</div>
        `
      },
      {
        title: 'Project Timeline Planning',
        content: `
          <h2>Planning a Construction Timeline</h2>
          <p>A realistic timeline for a 2-bedroom house in Kenya:</p>
          <div class="fbox">Phase 1: Site Preparation    → 1 week
Phase 2: Foundation          → 3 weeks
Phase 3: Ground Floor Slab   → 2 weeks
Phase 4: Walling             → 5 weeks
Phase 5: Roof Structure      → 3 weeks
Phase 6: Finishes & MEP      → 6 weeks
─────────────────────────────────────
TOTAL                        → 20 weeks (~5 months)</div>
          <div class="hl">💡 Always add 10-15% buffer time for delays, weather and material shortages!</div>
          <div class="swahili-note">🗣️ Swahili: Ongeza wiki 2-3 za ziada kwa ajili ya ucheleweshaji wa kawaida wa nyenzo na hali ya hewa.</div>
        `
      },
    ]
  },

  // ── PYTHON COURSE ──
  {
    id: 'py1', type: 'python', icon: '🐍', color: '#3776ab',
    title: 'Python — Introduction', desc: 'Variables, data types & your first program',
    lessons: [
      {
        title: 'What is Python? / Python ni Nini?',
        content: `
          <h2>Welcome to Python! 🐍</h2>
          <p>Python is one of the world's most popular programming languages. It's used for web development, AI, data analysis, automation and much more.</p>
          <div class="swahili-note">🗣️ Swahili: Python ni lugha ya programu maarufu duniani. Inatumika kwa tovuti, akili bandia, na uchambuzi wa data.</div>
          <div class="hl">Python reads almost like plain English — that's why it's perfect for beginners!</div>
          <h3>Your First Program / Programu Yako ya Kwanza:</h3>
          <div class="fbox">print("Hello, World!")
print("Karibu Kenya! 🇰🇪")
print("ArchitexIQ — Calculate. Learn. Build.")</div>
          <p><strong>Output:</strong></p>
          <div class="fbox">Hello, World!
Karibu Kenya! 🇰🇪
ArchitexIQ — Calculate. Learn. Build.</div>
          <div class="swahili-note">🗣️ Swahili: <strong>print()</strong> inaonyesha maandishi kwenye skrini. Hii ndiyo amri ya kwanza ya kujifunza Python.</div>
        `
      },
      {
        title: 'Variables / Vigeuzi',
        content: `
          <h2>Variables in Python</h2>
          <p>Variables are containers that store data you want to use later.</p>
          <div class="swahili-note">🗣️ Swahili: Vigeuzi ni makontena ya kuhifadhi taarifa. Kama sanduku la kuhifadhi kitu.</div>
          <div class="fbox"># Storing construction data
bags = 50
price_per_bag = 750
project_name = "My House"
is_complete = False

# Using variables
total_cost = bags * price_per_bag
print(total_cost)  # Output: 37500</div>
          <div class="hl">💡 Variable names cannot have spaces. Use underscore: price_per_bag ✅  price per bag ❌</div>
          <div class="swahili-note">🗣️ Swahili: Majina ya vigeuzi hayawezi kuwa na nafasi. Tumia alama ya chini badala yake: bei_kwa_mfuko ✅</div>
          <h3>Real Construction Example / Mfano wa Ujenzi:</h3>
          <div class="fbox">length = 5        # metres
width = 4         # metres  
thickness = 0.15  # metres

volume = length * width * thickness
print("Volume:", volume, "m³")
# Output: Volume: 3.0 m³</div>
        `
      },
      {
        title: 'Data Types / Aina za Data',
        content: `
          <h2>Python Data Types</h2>
          <p>Every value in Python has a type:</p>
          <div class="fbox"># int → whole numbers / nambari nzima
bags = 50
workers = 4

# float → decimal numbers / nambari za desimali
volume = 3.14
thickness = 0.15

# str → text / maandishi
name = "Kamau"
city = "Nairobi"

# bool → True or False / Kweli au Uongo
is_paid = True
is_complete = False</div>
          <div class="swahili-note">🗣️ Swahili:
• int = nambari nzima (50, 100, 1000)
• float = nambari za desimali (3.14, 0.15)
• str = maandishi ("Nairobi", "Kamau")
• bool = kweli/uongo (True, False)</div>
          <div class="hl">💡 Python automatically knows the type — you don't need to declare it!</div>
        `
      },
    ]
  },
  {
    id: 'py2', type: 'python', icon: '🐍', color: '#3776ab',
    title: 'Python — Operations & Input', desc: 'Math, operators and user input',
    lessons: [
      {
        title: 'Math Operations / Hesabu',
        content: `
          <h2>Python Math Operations</h2>
          <div class="fbox"># Basic operators / Wahusika wa msingi
10 + 5   = 15   # Addition / Kuongeza
10 - 5   = 5    # Subtraction / Kupunguza
10 * 5   = 50   # Multiplication / Kuzidisha
10 / 5   = 2.0  # Division / Kugawanya
10 ** 2  = 100  # Power / Nguvu
10 % 3   = 1    # Remainder / Baki</div>
          <div class="swahili-note">🗣️ Swahili: Python inatumia * kwa kuzidisha (si ×), na / kwa kugawanya (si ÷).</div>
          <h3>Construction Calculator / Kikokotoo cha Ujenzi:</h3>
          <div class="fbox">length = 5
width = 4
thickness = 0.15

# Calculate volume
wet_volume = length * width * thickness
dry_volume = wet_volume * 1.54

# Calculate cement bags (mix 1:2:4)
cement_m3 = (1/7) * dry_volume
bags = cement_m3 / 0.035
bags = round(bags)  # Round to whole number

print("Cement bags needed:", bags)
# Output: Cement bags needed: 19</div>
        `
      },
      {
        title: 'User Input / Ingizo la Mtumiaji',
        content: `
          <h2>Getting User Input</h2>
          <p>The <strong>input()</strong> function asks the user to type something.</p>
          <div class="swahili-note">🗣️ Swahili: Chaguo la <strong>input()</strong> linauliza mtumiaji kuandika kitu kwenye programu.</div>
          <div class="fbox">name = input("Enter your name: ")
print("Hello,", name)

# Output:
# Enter your name: Kamau
# Hello, Kamau</div>
          <h3>Construction Input Example / Mfano wa Ujenzi:</h3>
          <div class="fbox">length = float(input("Enter length (m): "))
width = float(input("Enter width (m): "))
thickness = float(input("Enter thickness (m): "))

volume = length * width * thickness
print("Volume:", volume, "m³")</div>
          <div class="hl">💡 Always use float() when expecting decimal numbers, int() for whole numbers only.</div>
          <div class="swahili-note">🗣️ Swahili: Tumia float() kwa nambari za desimali na int() kwa nambari nzima tu.</div>
        `
      },
    ]
  },
  {
    id: 'py3', type: 'python', icon: '🐍', color: '#3776ab',
    title: 'Python — Conditions', desc: 'if, elif, else statements',
    lessons: [
      {
        title: 'If Statements / Masharti',
        content: `
          <h2>Conditions in Python</h2>
          <p>Conditions let your program make decisions.</p>
          <div class="swahili-note">🗣️ Swahili: Masharti yanaruhusu programu yako kufanya maamuzi kama binadamu.</div>
          <div class="fbox">age = 18

if age >= 18:
    print("You can vote!")
else:
    print("Too young to vote")</div>
          <h3>Using elif / Kutumia elif:</h3>
          <div class="fbox">score = 75

if score >= 80:
    print("Excellent! / Bora sana!")
elif score >= 60:
    print("Good pass! / Umepita!")
elif score >= 40:
    print("Average / Wastani")
else:
    print("Failed / Umeshindwa")</div>
          <div class="hl">💡 Python uses indentation (4 spaces) to define what belongs inside the if block!</div>
          <div class="swahili-note">🗣️ Swahili: Python inatumia nafasi (spaces 4) kuonyesha nini kiko ndani ya sharti. Hii ni muhimu sana!</div>
        `
      },
      {
        title: 'Conditions in Construction / Masharti ya Ujenzi',
        content: `
          <h2>Real Construction Example</h2>
          <div class="fbox">def check_mix(mix_ratio):
    if mix_ratio == "1:1.5:3":
        return "High strength — use for columns"
    elif mix_ratio == "1:2:4":
        return "Standard — use for slabs"
    elif mix_ratio == "1:3:6":
        return "Mass concrete — use for foundations"
    else:
        return "Blinding — base layer only"

result = check_mix("1:2:4")
print(result)
# Output: Standard — use for slabs</div>
          <div class="swahili-note">🗣️ Swahili: Hii ni mfano wa jinsi ArchitexIQ inavyofanya maamuzi kuhusu aina ya mchanganyiko unaofaa kwa muundo tofauti.</div>
          <div class="hl">💡 This is exactly the logic inside ArchitexIQ's calculator!</div>
        `
      },
    ]
  },
  {
    id: 'py4', type: 'python', icon: '🐍', color: '#3776ab',
    title: 'Python — Loops', desc: 'for loops, while loops & iterations',
    lessons: [
      {
        title: 'For Loops / Mzunguko wa For',
        content: `
          <h2>For Loops in Python</h2>
          <p>Loops let you repeat code multiple times without writing it again.</p>
          <div class="swahili-note">🗣️ Swahili: Mzunguko unakuruhusu kurudia msimbo mara nyingi bila kuandika tena na tena.</div>
          <div class="fbox"># Count to 5
for i in range(5):
    print("Day", i + 1)

# Output:
# Day 1
# Day 2
# Day 3
# Day 4
# Day 5</div>
          <h3>Loop through a list / Pita kwenye orodha:</h3>
          <div class="fbox">materials = ["cement", "sand", "ballast", "stones"]

for item in materials:
    print("Material:", item)

# Output:
# Material: cement
# Material: sand
# Material: ballast
# Material: stones</div>
          <div class="swahili-note">🗣️ Swahili: Tunaweza kupita kwenye orodha ya vifaa na kuchapisha kila kimoja kimoja.</div>
        `
      },
      {
        title: 'While Loops / Mzunguko wa While',
        content: `
          <h2>While Loops</h2>
          <p>A while loop keeps running as long as a condition is True.</p>
          <div class="fbox">count = 0

while count < 5:
    print("Worker", count + 1, "checked in")
    count = count + 1

# Output:
# Worker 1 checked in
# Worker 2 checked in
# Worker 3 checked in
# Worker 4 checked in
# Worker 5 checked in</div>
          <div class="hl">⚠️ Always make sure the while loop will eventually stop! If count never changes, it runs forever.</div>
          <div class="swahili-note">🗣️ Swahili: Mzunguko wa while unaendelea kurudia mradi sharti ni kweli. Hakikisha utasimama hatimaye!</div>
        `
      },
      {
        title: 'Loops in Construction / Mzunguko wa Ujenzi',
        content: `
          <h2>Real Construction Loop Example</h2>
          <div class="fbox">workers = [
    {"name": "Kamau", "role": "Fundi",    "rate": 1800},
    {"name": "Otieno","role": "Labourer", "rate": 800},
    {"name": "Wanjiku","role":"Carpenter","rate": 2000},
]

days = 30
total_wages = 0

for worker in workers:
    wages = worker["rate"] * days
    total_wages = total_wages + wages
    print(worker["name"], "→ KES", wages)

print("Total wages: KES", total_wages)

# Output:
# Kamau  → KES 54000
# Otieno → KES 24000
# Wanjiku→ KES 60000
# Total wages: KES 138000</div>
          <div class="swahili-note">🗣️ Swahili: Hii ni jinsi ArchitexIQ inavyohesabu mishahara ya wafanyakazi wote kwa mzunguko mmoja tu.</div>
        `
      },
    ]
  },
  {
    id: 'py5', type: 'python', icon: '🐍', color: '#3776ab',
    title: 'Python — Functions', desc: 'Define and use reusable functions',
    lessons: [
      {
        title: 'What are Functions? / Kazi ni Nini?',
        content: `
          <h2>Functions in Python</h2>
          <p>A function is a reusable block of code. You define it once and use it many times.</p>
          <div class="swahili-note">🗣️ Swahili: Kazi ni sehemu ya msimbo inayoweza kutumika tena na tena. Inaandikwa mara moja, inatumika mara nyingi.</div>
          <div class="fbox">def greet(name):
    print("Hello,", name)
    print("Welcome to ArchitexIQ!")

# Call the function:
greet("Kamau")
greet("Wanjiku")

# Output:
# Hello, Kamau
# Welcome to ArchitexIQ!
# Hello, Wanjiku
# Welcome to ArchitexIQ!</div>
          <div class="hl">💡 def means "define". Always indent the function body with 4 spaces.</div>
        `
      },
      {
        title: 'Functions with Return / Kazi na Kurudi',
        content: `
          <h2>Functions that Return Values</h2>
          <div class="fbox">def calculate_volume(length, width, thickness):
    volume = length * width * thickness
    return volume

def calculate_bags(volume, mix_ratio=7):
    dry_volume = volume * 1.54
    cement_m3 = (1 / mix_ratio) * dry_volume
    bags = cement_m3 / 0.035
    return round(bags)

# Use the functions:
vol = calculate_volume(5, 4, 0.15)
bags = calculate_bags(vol)

print("Volume:", vol, "m³")
print("Cement bags:", bags)

# Output:
# Volume: 3.0 m³
# Cement bags: 19</div>
          <div class="swahili-note">🗣️ Swahili: <strong>return</strong> inarejesha thamani kutoka kwenye kazi. Hii ndiyo siri ya kazi zinazofaa zaidi.</div>
          <div class="hl">💡 This is EXACTLY how ArchitexIQ calculates materials internally! You just learned real production code!</div>
        `
      },
    ]
  },
  {
    id: 'py6', type: 'python', icon: '🐍', color: '#3776ab',
    title: 'Python — Lists & Dicts', desc: 'Storing and organizing data',
    lessons: [
      {
        title: 'Lists / Orodha',
        content: `
          <h2>Lists in Python</h2>
          <p>A list stores multiple values in one variable.</p>
          <div class="fbox">materials = ["cement", "sand", "ballast"]
prices    = [750, 2500, 3000]
workers   = ["Kamau", "Otieno", "Wanjiku"]

# Access items (starts at 0):
print(materials[0])  # cement
print(materials[1])  # sand
print(materials[2])  # ballast

# Add item:
materials.append("steel")
print(materials)
# ["cement","sand","ballast","steel"]</div>
          <div class="swahili-note">🗣️ Swahili: Orodha inahifadhi vitu vingi ndani ya kigeuzio kimoja. Nambari inaanza 0, si 1!</div>
        `
      },
      {
        title: 'Dictionaries / Kamusi',
        content: `
          <h2>Dictionaries in Python</h2>
          <p>A dictionary stores data as key:value pairs — like a real dictionary!</p>
          <div class="swahili-note">🗣️ Swahili: Kamusi inahifadhi data kama jina na thamani yake — kama kamusi ya kweli!</div>
          <div class="fbox">worker = {
    "name": "Kamau Njoroge",
    "role": "Fundi",
    "rate": 1800,
    "days": 30
}

# Access values:
print(worker["name"])  # Kamau Njoroge
print(worker["rate"])  # 1800

# Calculate wages:
wages = worker["rate"] * worker["days"]
print("Wages: KES", wages)  # KES 54000</div>
          <h3>List of Dictionaries / Orodha ya Kamusi:</h3>
          <div class="fbox">project = {
    "name": "2-Bedroom House",
    "location": "Nairobi",
    "budget": 500000,
    "weeks": 20,
    "complete": False
}

print(project["name"])    # 2-Bedroom House
print(project["budget"])  # 500000</div>
          <div class="swahili-note">🗣️ Swahili: Kamusi za Python zinatumika sana katika programu za ukweli kuhifadhi taarifa za miradi na wafanyakazi.</div>
        `
      },
    ]
  },
  {
    id: 'py7', type: 'python', icon: '🐍', color: '#3776ab',
    title: 'Python — Build a Calculator', desc: 'Apply everything to build a real tool',
    lessons: [
      {
        title: 'Full Construction Calculator in Python',
        content: `
          <h2>Building ArchitexIQ in Python! 🏗️</h2>
          <p>Let's combine everything we've learned to build a real construction calculator.</p>
          <div class="swahili-note">🗣️ Swahili: Tunachanganya kila kitu tulichojifunza kujenga kikokotoo cha ujenzi wa kweli!</div>
          <div class="fbox">def get_inputs():
    """Get dimensions from user"""
    print("=== ArchitexIQ Calculator ===")
    length = float(input("Length (m): "))
    width  = float(input("Width (m): "))
    thick  = float(input("Thickness (m): "))
    qty    = int(input("Quantity: "))
    return length, width, thick, qty

def calculate_materials(L, W, T, qty, mix="1:2:4"):
    """Calculate all materials needed"""
    parts = [int(x) for x in mix.split(":")]
    total = sum(parts)
    
    volume   = L * W * T * qty
    dry_vol  = volume * 1.54
    
    cement_bags = round((parts[0]/total * dry_vol) / 0.035)
    sand_m3     = round((parts[1]/total * dry_vol), 2)
    ballast_m3  = round((parts[2]/total * dry_vol), 2)
    
    return cement_bags, sand_m3, ballast_m3, volume

def calculate_cost(bags, sand, ballast, prices):
    """Calculate total cost"""
    cost = (bags * prices["cement"] +
            sand * prices["sand"] +
            ballast * prices["ballast"])
    return round(cost * 1.10)  # +10% wastage

def print_results(bags, sand, ballast, total_cost):
    """Display the results"""
    print("\n=== RESULTS ===")
    print(f"Cement:  {bags} bags")
    print(f"Sand:    {sand} m³")
    print(f"Ballast: {ballast} m³")
    print(f"TOTAL:   KES {total_cost:,}")

# ── Run the calculator ──
prices = {"cement": 750, "sand": 2500, "ballast": 3000}
L, W, T, qty = get_inputs()
bags, sand, ballast, vol = calculate_materials(L, W, T, qty)
cost = calculate_cost(bags, sand, ballast, prices)
print_results(bags, sand, ballast, cost)</div>
          <div class="hl">🎉 Congratulations! You just built ArchitexIQ's core logic in Python. This is real programming!</div>
          <div class="swahili-note">🗣️ Swahili: Hongera! Umejenga msingi wa ArchitexIQ kwa kutumia Python. Hii ni programu ya kweli!</div>
        `
      },
    ]
  },
];

// ═══════════════════════════════════════════════════
// QUIZZES DATA
// ═══════════════════════════════════════════════════
const QUIZZES = [
  {
    id: 'q1', title: 'Concrete Mix Ratios', tag: 'construction', moduleId: 'cm1',
    questions: [
      { q: 'What does the mix ratio 1:2:4 mean?', opts: ['1 cement:2 ballast:4 sand', '1 cement:2 sand:4 ballast', '1 sand:2 cement:4 ballast', '1 ballast:2 cement:4 sand'], ans: 1, explain: 'Order is always Cement:Sand:Ballast. 1:2:4 = 1 part cement, 2 parts sand, 4 parts ballast.' },
      { q: 'Which mix ratio produces the STRONGEST concrete?', opts: ['1:4:8', '1:3:6', '1:2:4', '1:1.5:3'], ans: 3, explain: '1:1.5:3 has the highest cement proportion — strongest and most expensive.' },
      { q: 'Why do we multiply volume by 1.54?', opts: ['For water content', 'Unit conversion', 'Dry materials compress when mixed', 'Safety margin'], ans: 2, explain: 'When dry materials are mixed with water, they compact and lose volume. 1.54 compensates for this.' },
      { q: 'Slab 6m × 5m × 0.15m — what is the volume?', opts: ['4.5 m³', '4.0 m³', '5.5 m³', '3.5 m³'], ans: 0, explain: 'Volume = 6 × 5 × 0.15 = 4.5 m³' },
      { q: 'Which mix is best for blinding concrete?', opts: ['1:1.5:3', '1:2:4', '1:3:6', '1:4:8'], ans: 3, explain: '1:4:8 is used for blinding — low strength needed, saves cost.' },
    ]
  },
  {
    id: 'q2', title: 'Machine-Cut Stones', tag: 'construction', moduleId: 'cm2',
    questions: [
      { q: 'How many machine-cut stones per m² of wall?', opts: ['10', '12.5', '15', '8'], ans: 1, explain: 'Standard 390×190mm stones lay at 12.5 per square metre.' },
      { q: 'Wall is 15m × 3m. How many stones needed?', opts: ['450', '563', '600', '500'], ans: 1, explain: '15 × 3 = 45 m². 45 × 12.5 = 562.5, round up to 563.' },
      { q: 'What wastage percentage to add for stones?', opts: ['1%', '5-10%', '20%', '2%'], ans: 1, explain: 'Industry standard is 5-10% for cutting and breakage.' },
      { q: 'Standard machine-cut stone size?', opts: ['200×100×100mm', '390×190×190mm', '300×150×150mm', '450×200×200mm'], ans: 1, explain: 'Standard Kenyan machine-cut stone is 390mm × 190mm × 190mm.' },
    ]
  },
  {
    id: 'q3', title: 'Site Management', tag: 'construction', moduleId: 'cm4',
    questions: [
      { q: 'Required PPE on a Kenyan construction site?', opts: ['Only gloves', 'Hard hat and boots only', 'Hard hat, boots, vest, gloves', 'Just a hard hat'], ans: 2, explain: 'Full PPE: hard hat, safety boots, reflective vest, and gloves.' },
      { q: 'Typical daily rate for a Fundi in Kenya?', opts: ['KES 400-600', 'KES 1,500-2,500', 'KES 5,000-8,000', 'KES 500-800'], ans: 1, explain: 'Skilled fundis (masons) earn KES 1,500-2,500 per day (2025 rates).' },
      { q: 'Which law governs site safety in Kenya?', opts: ['Building Code 2010', 'OSHA 2007', 'NCA Act', 'Factories Act'], ans: 1, explain: 'The Occupational Safety and Health Act (OSHA) 2007.' },
    ]
  },
  {
    id: 'q4', title: 'Python Basics', tag: 'python', moduleId: 'py1',
    questions: [
      { q: 'What does print("Hello") do in Python?', opts: ['Saves to a file', 'Sends an email', 'Displays on screen', 'Deletes a variable'], ans: 2, explain: 'print() displays text or values on the screen/console.' },
      { q: 'Which data type is the value 750.5?', opts: ['int', 'str', 'bool', 'float'], ans: 3, explain: 'float is for decimal numbers. int is for whole numbers only.' },
      { q: 'Correct Python symbol for multiplication?', opts: ['×', 'x', '*', '•'], ans: 2, explain: 'Python uses * for multiplication. Example: 5 * 4 = 20' },
      { q: 'What is a variable in Python?', opts: ['A function', 'A container for storing data', 'A loop', 'A condition'], ans: 1, explain: 'A variable is a named container that stores data for use later in your program.' },
    ]
  },
  {
    id: 'q5', title: 'Python Loops & Functions', tag: 'python', moduleId: 'py4',
    questions: [
      { q: 'How do you start a for loop in Python?', opts: ['loop i in 5:', 'for i in range(5):', 'repeat 5 times:', 'while i<5:'], ans: 1, explain: 'Python uses "for i in range(n):" to loop n times.' },
      { q: 'What does return do in a function?', opts: ['Prints a value', 'Starts a loop', 'Sends a value back to the caller', 'Deletes a variable'], ans: 2, explain: 'return sends a value back from the function to wherever it was called.' },
      { q: 'What keyword starts a function in Python?', opts: ['function', 'func', 'def', 'define'], ans: 2, explain: '"def" defines a function in Python. Example: def my_function():' },
    ]
  },
  {
    id: 'q6', title: 'BOQ & Estimating', tag: 'construction', moduleId: 'cm3',
    questions: [
      { q: 'What does BOQ stand for?', opts: ['Book of Quality', 'Bill of Quantities', 'Budget of Quantities', 'Building Order Quote'], ans: 1, explain: 'BOQ = Bill of Quantities — a professional document listing all project costs.' },
      { q: '50 bags of cement × KES 750 = ?', opts: ['KES 35,000', 'KES 37,500', 'KES 40,000', 'KES 32,500'], ans: 1, explain: '50 × 750 = KES 37,500' },
      { q: 'Which section comes FIRST in a BOQ?', opts: ['Finishes', 'Roofing', 'Preliminaries', 'Walling'], ans: 2, explain: 'Preliminaries (site setup and mobilisation) always come first in a BOQ.' },
    ]
  },
];

// ═══════════════════════════════════════════════════
// LEARN STATE
// ═══════════════════════════════════════════════════
let learnState = {
  view: 'list',
  currentModule: null,
  currentLesson: 0,
  currentQuiz: null,
  currentQ: 0,
  quizScore: 0,
  quizAnswered: false,
};

// ═══════════════════════════════════════════════════
// RENDER LEARN PAGE
// ═══════════════════════════════════════════════════
function renderLearn() {
  if (learnState.view === 'lesson') return renderLessonView();
  if (learnState.view === 'quiz') return renderQuizView();

  const progress = JSON.parse(localStorage.getItem('jp_prog') || '{}');
  const constructionMods = MODULES.filter(m => m.type === 'construction');
  const pythonMods = MODULES.filter(m => m.type === 'python');

  return `
  <div class="hero fade-up">
    <div class="hero-eyebrow">📚 Education</div>
    <h1 class="hero-title">Learn & <span class="gold">Master</span></h1>
    <p class="hero-sub">Construction & Python — English + Kiswahili</p>
  </div>

  <div class="section-header">🏗️ Construction Modules</div>
  ${constructionMods.map(m => moduleCard(m, progress)).join('')}

  <div class="section-header">🐍 Python Course (Beginner → Advanced)</div>
  <div class="card card-gold" style="margin-bottom:12px;">
    <div style="display:flex;align-items:center;gap:10px;">
      <div style="font-size:2rem;">🐍</div>
      <div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:1rem;font-weight:600;color:var(--gold3);">Full Python Course</div>
        <div style="font-size:0.72rem;color:var(--muted2);">7 modules · English + Kiswahili explanations</div>
      </div>
    </div>
  </div>
  ${pythonMods.map(m => moduleCard(m, progress)).join('')}

  <div class="section-header">🎯 Practice Quizzes</div>
  ${QUIZZES.map(q => `
    <div class="project-row" style="cursor:pointer;" onclick="startQuiz('${q.id}')">
      <div>
        <div class="pr-name">${q.title}</div>
        <div class="pr-meta">${q.questions.length} questions · ${q.tag}</div>
      </div>
      <div style="color:${progress['q_'+q.id] ? 'var(--green)' : 'var(--gold)'};font-weight:600;font-size:0.82rem;">
        ${progress['q_'+q.id] ? '✅ ' + progress['q_'+q.id] + '%' : '▶ Start'}
      </div>
    </div>`).join('')}
  `;
}

function moduleCard(m, progress) {
  const prog = progress['m_' + m.id] || 0;
  return `
  <div class="module-card" onclick="openModule('${m.id}')">
    <div class="mod-header">
      <div class="mod-icon" style="background:${m.color}22;">${m.icon}</div>
      <div class="mod-info">
        <h3>${m.title}</h3>
        <p>${m.desc}</p>
      </div>
    </div>
    <div class="prog-bar"><div class="prog-fill" style="width:${prog}%;background:${m.color};"></div></div>
    <div class="prog-labels"><span>${m.lessons.length} lessons</span><span>${prog}% complete</span></div>
  </div>`;
}

function openModule(id) {
  const mod = MODULES.find(m => m.id === id);
  if (!mod) return;
  learnState.currentModule = mod;
  learnState.currentLesson = 0;
  learnState.view = 'lesson';
  // Mark started
  const progress = JSON.parse(localStorage.getItem('jp_prog') || '{}');
  progress['m_' + id] = Math.max(progress['m_' + id] || 0, 20);
  localStorage.setItem('jp_prog', JSON.stringify(progress));
  render();
}

function renderLessonView() {
  const mod = learnState.currentModule;
  const lesson = mod.lessons[learnState.currentLesson];
  const hasMore = learnState.currentLesson < mod.lessons.length - 1;
  const relatedQuiz = QUIZZES.find(q => q.moduleId === mod.id);

  // Mark progress
  const progress = JSON.parse(localStorage.getItem('jp_prog') || '{}');
  progress['m_' + mod.id] = Math.round(((learnState.currentLesson + 1) / mod.lessons.length) * 100);
  localStorage.setItem('jp_prog', JSON.stringify(progress));

  return `
  <button class="back-btn" onclick="learnState.view='list';render()">← Back to Modules</button>
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
    <div style="font-size:1.4rem;">${mod.icon}</div>
    <div>
      <div style="font-size:0.62rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px;">${mod.title}</div>
      <div style="font-size:0.82rem;font-weight:600;">Lesson ${learnState.currentLesson + 1} of ${mod.lessons.length}</div>
    </div>
    <div style="margin-left:auto;">
      <div style="height:4px;width:80px;background:var(--border2);border-radius:2px;overflow:hidden;">
        <div style="height:100%;width:${((learnState.currentLesson+1)/mod.lessons.length)*100}%;background:${mod.color};border-radius:2px;"></div>
      </div>
    </div>
  </div>
  <div class="card lesson-content">${lesson.content}</div>
  ${hasMore ? `<button class="btn btn-outline" style="margin-bottom:8px;" onclick="learnState.currentLesson++;render()">Next Lesson →</button>` : ''}
  ${relatedQuiz ? `<button class="btn btn-gold" onclick="startQuiz('${relatedQuiz.id}')">🎯 Take Quiz</button>` : ''}
  `;
}

function startQuiz(qId) {
  const quiz = QUIZZES.find(q => q.id === qId);
  if (!quiz) return;
  learnState.currentQuiz = quiz;
  learnState.currentQ = 0;
  learnState.quizScore = 0;
  learnState.quizAnswered = false;
  learnState.view = 'quiz';
  render();
}

function renderQuizView() {
  const quiz = learnState.currentQuiz;

  // Show result screen
  if (learnState.currentQ >= quiz.questions.length) {
    const pct = JSON.parse(localStorage.getItem('jp_prog') || '{}')['q_' + quiz.id] || 0;
    const passed = pct >= 60;
    return `
    <button class="back-btn" onclick="learnState.view='list';render()">← Back</button>
    <div class="card" style="text-align:center;padding:32px 20px;">
      <div style="font-size:3rem;margin-bottom:12px;">${passed ? '🏆' : '📚'}</div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:var(--gold3);">${passed ? 'Excellent!' : 'Keep Studying'}</div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:700;color:${passed ? 'var(--green)' : 'var(--red)'};margin:16px 0;">${pct}%</div>
      <div style="color:var(--muted2);font-size:0.86rem;margin-bottom:24px;">${learnState.quizScore} of ${quiz.questions.length} correct</div>
      <button class="btn btn-gold" style="margin-bottom:8px;" onclick="startQuiz('${quiz.id}')">🔄 Retry Quiz</button>
      <button class="btn btn-outline" onclick="learnState.view='list';render()">← All Modules</button>
    </div>`;
  }

  const q = quiz.questions[learnState.currentQ];
  const pct = Math.round((learnState.currentQ / quiz.questions.length) * 100);

  return `
  <button class="back-btn" onclick="learnState.view='list';render()">← Back</button>
  <div style="display:flex;justify-content:space-between;font-size:0.74rem;color:var(--muted);margin-bottom:6px;">
    <span>Q${learnState.currentQ + 1}/${quiz.questions.length}</span>
    <span style="color:var(--green);">Score: ${learnState.quizScore}/${learnState.currentQ}</span>
  </div>
  <div style="height:4px;background:var(--border2);border-radius:2px;overflow:hidden;margin-bottom:14px;">
    <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--gold),var(--gold2));border-radius:2px;transition:width 0.3s;"></div>
  </div>
  <div class="card">
    <div style="font-size:0.62rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:7px;">Question ${learnState.currentQ + 1}</div>
    <div style="font-family:'Cormorant Garamond',serif;font-size:1rem;font-weight:600;margin-bottom:14px;line-height:1.4;color:var(--gold3);">${q.q}</div>
    ${q.opts.map((opt, i) => `<div class="option" id="opt${i}" onclick="answerQuiz(${i})"><div class="opt-letter">${'ABCD'[i]}</div>${opt}</div>`).join('')}
    <div id="quizFeedback"></div>
  </div>`;
}

function answerQuiz(i) {
  if (learnState.quizAnswered) return;
  learnState.quizAnswered = true;
  const q = learnState.currentQuiz.questions[learnState.currentQ];
  const correct = i === q.ans;
  if (correct) learnState.quizScore++;

  document.getElementById('opt' + i).classList.add(correct ? 'correct' : 'wrong');
  document.getElementById('opt' + q.ans).classList.add('correct');

  const fb = document.getElementById('quizFeedback');
  fb.innerHTML = `<div style="padding:10px 14px;border-radius:10px;font-size:0.8rem;margin-top:7px;background:${correct ? 'rgba(26,158,92,0.08)' : 'rgba(220,38,38,0.08)'};color:${correct ? 'var(--green)' : 'var(--red)'};border:1px solid ${correct ? 'rgba(26,158,92,0.3)' : 'rgba(220,38,38,0.3)'};">${correct ? '✅ Correct! ' : '❌ Wrong. '}${q.explain}</div>`;

  setTimeout(() => {
    const total = learnState.currentQuiz.questions.length;
    const newScore = learnState.quizScore;
    learnState.currentQ++;
    learnState.quizAnswered = false;
    if (learnState.currentQ >= total) {
      const pct = Math.round((newScore / total) * 100);
      const progress = JSON.parse(localStorage.getItem('jp_prog') || '{}');
      progress['q_' + learnState.currentQuiz.id] = pct;
      localStorage.setItem('jp_prog', JSON.stringify(progress));
      const scores = JSON.parse(localStorage.getItem('jp_scores') || '[]');
      scores.push(pct);
      localStorage.setItem('jp_scores', JSON.stringify(scores));
    }
    render();
  }, 2200);
}
