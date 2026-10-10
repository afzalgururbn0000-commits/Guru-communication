// GURU COMMUNICATION BUSINESS CONFIGURATION DATA
(function() {
  const config = {
    businessName: "Guru Communication",
    tagline: "Repair. Refurbish. Upgrade. Equip.",
    positioning: "Expert Mobile Repairing & Professional Repair Technology Under One Roof.",
    phone: "+91 70513 83473",
    whatsapp: "917051383473",
    email: "contact@gurucommunication.com",
    address: "Opp. Punjab National Bank (PNB), Near Bus Stand Market, Ramban, Jammu & Kashmir - 182148",
    openingHours: "Mon - Sat: 10:00 AM - 09:00 PM | Sunday: Closed",
    googleMapsUrl: "https://www.google.com/maps/place/Guru+Communication/@33.2378014,75.2378984,909m/data=!3m2!1e3!4b1!4m6!3m5!1s0x391dc3a435da446b:0x70ff042584d68217!8m2!3d33.2377969!4d75.2404733!16s%2Fg%2F11kn0m6s7y",

    stats: [
      { value: 10, label: "Years Experience", suffix: "+" },
      { value: 5000, label: "Repairs Completed", suffix: "+" },
      { value: 1000, label: "Happy Customers", suffix: "+" },
      { value: 100, label: "Quality Focus", suffix: "%" }
    ],

    services: [
      { id: "mob-repair", icon: "smartphone", title: "Mobile Repairing", desc: "Professional multi-brand diagnosis and precision hardware repair for all Android and iOS smartphones.", link: "services.html" },
      { id: "iphone-repair", icon: "apple", title: "iPhone Repair Lab", desc: "Advanced Apple hardware, Face ID alignment, True Tone recovery, and motherboard micro-soldering.", link: "iphone-repair.html" },
      { id: "display-rep", icon: "monitor", title: "Display Replacement", desc: "Original Grade OLED & Fluid AMOLED display glass installations with zero touch latency calibration.", link: "services.html" },
      { id: "battery-rep", icon: "battery-charging", title: "Battery Replacement", desc: "High-capacity OEM battery swaps with battery health calibration and thermal protection.", link: "services.html" },
      { id: "charging-rep", icon: "zap", title: "Charging Port Repair", desc: "Type-C connector, flex ribbon, power IC troubleshooting and high-speed fast charging restoration.", link: "services.html" },
      { id: "mobo-repair", icon: "cpu", title: "Motherboard IC Repair", desc: "Advanced BGA micro-soldering, CPU reballing, Audio IC loop repair, and power IC replacement.", link: "services.html" },
      { id: "water-damage", icon: "droplets", title: "Water Damage Repair", desc: "Ultrasonic chemical decontamination bath, short circuit removal, and component restoration.", link: "services.html" },
      { id: "software-sol", icon: "code-2", title: "Software Solutions", desc: "Firmware flashing, OS unbricking, bootloop fixes, network unlock, and diagnostics.", link: "services.html" },
      { id: "oca-refurbish", icon: "layers", title: "OCA Screen Refurbishing", desc: "Edge & flat screen glass separation, vacuum OCA lamination & bubble-free autoclave finishing.", link: "machinery.html" },
      { id: "accessories", icon: "headphones", title: "Mobile Accessories", desc: "65W GaN fast chargers, Kevlar braided cables, UV tempered glass, and MagSafe cases.", link: "accessories.html" }
    ],

    iphoneServices: [
      { title: "Screen & True Tone", desc: "True Tone EEPROM restoration & OEM OLED glass lamination.", icon: "smartphone" },
      { title: "Battery Health Swap", desc: "OEM battery swap with spot welding for 100% health display.", icon: "battery" },
      { title: "Charging Flex Cable", desc: "Type-C / Lightning port replacement with audio connector fix.", icon: "zap" },
      { title: "Face ID Diagnostics", desc: "TrueDepth dot projector alignment & infrared sensor fix.", icon: "scan-face" },
      { title: "Camera & OIS Sensor", desc: "Sapphire lens swap and optical image stabilizer repair.", icon: "camera" },
      { title: "Speaker & Earpiece", desc: "Acoustic mesh ultrasonic cleansing & audio amplifier fix.", icon: "volume-2" },
      { title: "Motherboard Sandwich", desc: "Layered board separation, short clear & NAND memory upgrade.", icon: "cpu" },
      { title: "Baseband & Audio IC", desc: "Fix 'No Service' baseband errors and greyed-out speaker IC.", icon: "microchip" },
      { title: "Laser Back Glass", desc: "Precision auto-focus fiber laser rear glass removal.", icon: "sparkles" }
    ],

    machinery: [
      {
        id: "ymt-oca-1",
        name: "YMT Automatic OCA Vacuum Laminating Machine",
        category: "OCA Machinery",
        desc: "Built-in silent vacuum pump and bubble remover. Engineered for both flat and edge OLED displays up to 7.9 inches.",
        specs: ["PLC Touchscreen Control", "Working Pressure: 0.4 - 0.6 Mpa", "Power: 800W High Efficiency", "1-Year Warranty & Service"],
        badge: "Best Seller",
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "laser-glass-1",
        name: "20W Fiber Laser Back Glass Separation Machine",
        category: "Laser Machinery",
        desc: "High precision auto-focus laser machine for safe, heat-free iPhone back glass and bezel frame removal.",
        specs: ["Laser Power: 20W Fiber", "Wireless PC / App Control", "Precision Auto-Focusing", "Integrated Fume Filtration"],
        badge: "Precision Tech",
        image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ymt-separator-1",
        name: "YMT Micro-Pneumatic Screen Separator",
        category: "Separators",
        desc: "Dual built-in vacuum suction with digital PID temperature controller for seamless wire glass cutting.",
        specs: ["Temp Range: 0 - 150°C", "Dual Vacuum Pumps", "Anti-Slip Silicone Mat", "Digital LED Controller"],
        badge: "Essential Lab Tool",
        image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "autoclave-bubble-1",
        name: "YMT High Pressure Autoclave De-bubbler",
        category: "De-bubbler",
        desc: "Industrial pneumatic pressure chamber for 100% micro-bubble elimination on refurbished displays.",
        specs: ["Chamber: 20cm x 30cm", "Max Pressure: 0.8 Mpa", "Safety Lock Valve", "Quick Release Valve"],
        badge: "High Capacity",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80"
      }
    ],

    spareParts: [
      { name: "Original Grade OLED Displays", category: "Displays", badge: "A+ Grade", img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80", desc: "Tested panels for iPhone, Samsung, OnePlus & Xiaomi." },
      { name: "OEM High Capacity Batteries", category: "Batteries", badge: "Zero Cycle", img: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80", desc: "Original capacity cells with built-in thermal safety protection." },
      { name: "Micro Soldering BGA ICs", category: "Chips", badge: "Original IC", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80", desc: "Power IC, Audio IC, Baseband, Touch & Charging management ICs." },
      { name: "Type-C Fast Charging Flex Cables", category: "Flex Cables", badge: "Tested", img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80", desc: "Original connector flex ribbons supporting USB PD and clear microphones." },
      { name: "Mitsubishi OCA Optical Glue Sheets", category: "OCA Sheets", badge: "250 Micron", img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80", desc: "Ultra-clear optical adhesive film for bubble-free curved and flat lamination." },
      { name: "0.009mm Insulated Jumper Wire & Flux", category: "Micro Soldering", badge: "High Purity", img: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80", desc: "Non-conductive enameled copper wire & no-clean BGA soldering flux paste." }
    ],

    accessories: [
      { title: "GaN 65W Super Fast Charger", category: "Chargers", desc: "Dual Type-C + USB PD fast charging for flagship phones, tablets & laptops.", badge: "Fast Charge", img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80" },
      { title: "Braided 240W Type-C Cable", category: "Cables", desc: "Ultra durable Kevlar braided cable supporting 480Mbps data and 240W power.", badge: "Ultra Durable", img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80" },
      { title: "9H Curved UV Glass Guard", category: "Tempered Glass", desc: "Edge-to-edge optical liquid full glue tempered glass with oleophobic coating.", badge: "Drop Defense", img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80" },
      { title: "MagSafe Shockproof Armor Case", category: "Covers", desc: "Military-grade drop protection with strong N52 neodymium magnetic ring.", badge: "MagSafe Ready", img: "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=600&q=80" },
      { title: "Wireless ANC Earbuds Pro", category: "Audio", desc: "Hybrid Active Noise Cancellation with deep bass and 32-hour playback.", badge: "Hi-Fi Sound", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80" },
      { title: "360° Aluminum Desktop Stand", category: "Stands", desc: "Precision CNC carved aluminum foldable phone and tablet desk mount.", badge: "Ergonomic", img: "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=600&q=80" }
    ],

    refurbishedPhones: [
      { brand: "Apple", model: "iPhone 14 Pro", storage: "256 GB", condition: "Pristine (Grade A+)", batteryHealth: "95%", warranty: "6 Months Warranty", badge: "Featured Flagship" },
      { brand: "Apple", model: "iPhone 13", storage: "128 GB", condition: "Flawless Condition", batteryHealth: "91%", warranty: "6 Months Warranty", badge: "Popular Pick" },
      { brand: "Samsung", model: "Galaxy S23 Ultra", storage: "256 GB / 12GB RAM", condition: "Mint Condition", batteryHealth: "100%", warranty: "6 Months Warranty", badge: "Android King" }
    ],

    reviews: [
      { name: "Rahul Sharma", service: "iPhone 13 Pro Max Display Refurbishing", rating: 5, comment: "My iPhone display glass was shattered. Guru Communication refurbished it with original OCA lamination. Saved 60% compared to a whole screen replacement!" },
      { name: "Amit Verma", service: "YMT OCA Machine Purchase", rating: 5, comment: "Purchased the YMT OCA laminator for my commercial repair lab. Outstanding machinery quality, and the team provided thorough technical guidance." },
      { name: "Priya Patel", service: "Water Damage Motherboard Repair", rating: 5, comment: "My phone was dead after water ingress and other shops said it was unfixable. Guru Communication restored it within 24 hours with full data intact!" },
      { name: "Vikram Singh", service: "iPhone Face ID & Battery Calibration", rating: 5, comment: "100% genuine quality. Battery health displays properly and Face ID works like new. The best repair laboratory in the region." }
    ]
  };

  window.GURU_CONFIG = config;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG: config };
  }
})();
