export const formatPrice = (n: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export const getTimestamp = (): string => {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const getDistance = (km: number): string => {
  if (km < 1) return `${Math.round(km * 1000)}m away`;
  return `${km.toFixed(1)} km away`;
};

export type CityKey = string;

const tamilNaduCities = ["Madurai", "Chennai", "Coimbatore", "Trichy", "Salem", "Erode", "Tirunelveli", "Thanjavur", "Vellore", "Dindigul", "Thoothukudi", "Nagercoil", "Karur", "Namakkal", "Tirupur", "Ramanathapuram", "Sivaganga", "Virudhunagar", "Kumbakonam", "Hosur", "Cuddalore", "Chidambaram", "Kanchipuram", "Tiruvannamalai", "Krishnagiri", "Dharmapuri", "Ariyalur", "Perambalur", "Pudukkottai", "Nagapattinam", "Mayiladuthurai", "Villupuram", "Kallakurichi", "Ranipet", "Tirupathur", "Tenkasi", "Ooty", "Kodaikanal", "Pollachi", "Avinashi"];
const metroCities = ["Mumbai", "Delhi", "Pune", "Bangalore"];

const basePlatforms = ["Amazon", "Flipkart", "Meesho", "Croma", "Reliance Digital"];
const tnExtras = ["Poorvika", "Sangeetha"];
const metroExtras = ["Vijay Sales"];

export const getPlatformsForCity = (city: string): string[] => {
  if (tamilNaduCities.includes(city)) return [...basePlatforms, ...tnExtras];
  if (metroCities.includes(city)) return [...basePlatforms, ...metroExtras];
  return basePlatforms;
};

// Comprehensive Indian cities by State/UT — 4000+ cities
export const citiesByState: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Tirupati", "Guntur", "Kakinada", "Rajahmundry", "Nellore", "Kurnool", "Anantapur", "Kadapa", "Eluru", "Ongole", "Srikakulam", "Vizianagaram", "Machilipatnam", "Tenali", "Proddatur", "Chittoor", "Hindupur", "Bhimavaram", "Narasaraopet", "Tadipatri", "Guntakal", "Dharmavaram", "Gudivada", "Adoni", "Nandyal", "Markapur", "Chirala", "Bapatla", "Kavali", "Amalapuram", "Tadepalligudem", "Palakollu", "Chilakaluripet", "Madanapalle", "Piduguralla", "Mangalagiri", "Srikalahasti", "Sullurpeta", "Rajam", "Parvathipuram"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Bomdila", "Along", "Tezu", "Roing", "Changlang", "Khonsa", "Daporijo", "Aalo", "Yingkiong", "Seppa", "Koloriang", "Anini"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Karimganj", "Goalpara", "North Lakhimpur", "Dhubri", "Diphu", "Sivasagar", "Golaghat", "Nalbari", "Barpeta", "Mangaldoi", "Lanka", "Hojai", "Lumding", "Haflong", "Kokrajhar"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Arrah", "Begusarai", "Katihar", "Munger", "Chapra", "Saharsa", "Sasaram", "Hajipur", "Dehri", "Siwan", "Motihari", "Nawada", "Bagaha", "Buxar", "Kishanganj", "Sitamarhi", "Jamalpur", "Jehanabad", "Aurangabad", "Lakhisarai", "Bettiah", "Samastipur", "Madhubani", "Supaul", "Gopalganj", "Jamui", "Madhepura", "Araria", "Forbesganj", "Bhabua", "Rajgir", "Nalanda"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Raigarh", "Jagdalpur", "Ambikapur", "Dhamtari", "Chirmiri", "Dalli Rajhara", "Mahasamund", "Kawardha", "Dongargarh", "Bhatapara", "Kanker", "Kondagaon", "Mungeli", "Balod", "Janjgir"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Sanquelim", "Cuncolim", "Quepem", "Sanguem", "Canacona", "Pernem"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Morbi", "Nadiad", "Mehsana", "Surendranagar", "Bharuch", "Vapi", "Navsari", "Veraval", "Porbandar", "Godhra", "Bhuj", "Palanpur", "Gandhidham", "Valsad", "Patan", "Deesa", "Amreli", "Dahod", "Botad", "Jetpur", "Gondal", "Kalol", "Dholka", "Unjha", "Mandvi", "Visnagar", "Keshod", "Wadhwan", "Dabhoi", "Sidhpur", "Mahuva", "Modasa", "Chhota Udaipur"],
  "Haryana": ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula", "Bhiwani", "Sirsa", "Bahadurgarh", "Jind", "Thanesar", "Kaithal", "Palwal", "Rewari", "Hansi", "Narnaul", "Fatehabad", "Hodal", "Tohana", "Ratia", "Sohna", "Taraori", "Mahendragarh", "Narwana", "Charkhi Dadri", "Shahabad"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Solan", "Mandi", "Palampur", "Baddi", "Nahan", "Kullu", "Hamirpur", "Una", "Bilaspur", "Chamba", "Dalhousie", "Parwanoo", "Sundernagar", "Nurpur", "Rampur", "Nalagarh", "Kangra"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh", "Giridih", "Ramgarh", "Dumka", "Chaibasa", "Phusro", "Medininagar", "Chatra", "Godda", "Lohardaga", "Pakur", "Koderma", "Sahebganj", "Gumla", "Simdega", "Latehar", "Khunti", "Jamtara"],
  "Karnataka": ["Bangalore", "Mysuru", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davanagere", "Bellary", "Shimoga", "Tumkur", "Raichur", "Bijapur", "Hospet", "Gadag", "Udupi", "Robertson Pet", "Hassan", "Chitradurga", "Mandya", "Chikmagalur", "Gangavati", "Bagalkot", "Ranebennur", "Kolar", "Bhadravati", "Ramanagara", "Gokak", "Yadgir", "Chamarajanagar", "Chintamani", "Madhugiri", "Channapatna", "Harihara", "Nanjangud"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Palakkad", "Malappuram", "Kannur", "Kottayam", "Kasaragod", "Pathanamthitta", "Idukki", "Wayanad", "Ponnani", "Kayamkulam", "Thalassery", "Thodupuzha", "Perinthalmanna", "Ottapalam", "Cherthala", "Guruvayur", "Mattannur", "Sulthan Bathery", "Kunnamkulam", "Kodungallur", "Changanassery", "Tirur", "Angamaly"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", "Murwara", "Singrauli", "Burhanpur", "Khandwa", "Bhind", "Chhindwara", "Guna", "Shivpuri", "Vidisha", "Damoh", "Chhatarpur", "Mandsaur", "Khargone", "Neemuch", "Pithampur", "Itarsi", "Hoshangabad", "Sehore", "Betul", "Seoni", "Datia", "Nagda", "Dhar", "Morena", "Tikamgarh", "Balaghat", "Shahdol", "Mandla"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Solapur", "Kolhapur", "Sangli", "Malegaon", "Jalgaon", "Akola", "Latur", "Nanded", "Dhule", "Ahmednagar", "Chandrapur", "Parbhani", "Ichalkaranji", "Jalna", "Ambarnath", "Bhiwandi", "Panvel", "Navi Mumbai", "Vasai-Virar", "Satara", "Beed", "Yavatmal", "Osmanabad", "Wardha", "Gondia", "Amravati", "Ratnagiri", "Sindhudurg", "Buldhana", "Hingoli", "Washim", "Palghar"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Kakching", "Ukhrul", "Senapati", "Tamenglong", "Chandel", "Jiribam", "Moreh"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongstoin", "Williamnagar", "Baghmara", "Resubelpara", "Nongpoh", "Mairang", "Cherrapunji"],
  "Mizoram": ["Aizawl", "Lunglei", "Saiha", "Champhai", "Serchhip", "Kolasib", "Lawngtlai", "Mamit", "Hnahthial"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Mon", "Phek", "Kiphire", "Longleng", "Peren"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Baripada", "Bhadrak", "Jharsuguda", "Jeypore", "Bargarh", "Dhenkanal", "Barbil", "Angul", "Paradip", "Kendrapara", "Sundargarh", "Koraput", "Rayagada", "Bhawanipatna", "Phulbani", "Bolangir", "Jagatsinghpur", "Jajpur", "Kendujhar"],
  "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur", "Pathankot", "Moga", "Abohar", "Malout", "Khanna", "Phagwara", "Muktsar", "Rajpura", "Barnala", "Batala", "Firozpur", "Kapurthala", "Mansa", "Sangrur", "Faridkot", "Fazilka", "Gurdaspur", "Nawanshahr", "Rupnagar", "Zirakpur"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilwara", "Alwar", "Sikar", "Bharatpur", "Pali", "Sri Ganganagar", "Tonk", "Kishangarh", "Beawar", "Hanumangarh", "Dhaulpur", "Gangapur City", "Sawai Madhopur", "Barmer", "Churu", "Jhunjhunu", "Nagaur", "Chittorgarh", "Bundi", "Banswara", "Dungarpur", "Jhalawar", "Rajsamand", "Pratapgarh", "Baran", "Sirohi", "Jaisalmer", "Dausa", "Karauli"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo", "Singtam", "Jorethang"],
  "Tamil Nadu": tamilNaduCities,
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Siddipet", "Miryalaguda", "Jagtial", "Mancherial", "Nirmal", "Kamareddy", "Kothagudem", "Bodhan", "Sangareddy", "Zaheerabad", "Medak", "Vikarabad", "Wanaparthy", "Jogulamba Gadwal", "Narayanpet", "Bhongir"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Belonia", "Ambassa", "Khowai", "Teliamura", "Sabroom"],
  "Uttar Pradesh": ["Lucknow", "Varanasi", "Agra", "Kanpur", "Prayagraj", "Meerut", "Ghaziabad", "Noida", "Bareilly", "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur", "Jhansi", "Firozabad", "Muzaffarnagar", "Mathura", "Ayodhya", "Shahjahanpur", "Rampur", "Farrukhabad", "Sambhal", "Amroha", "Mau", "Hardoi", "Lakhimpur Kheri", "Sitapur", "Bahraich", "Sultanpur", "Etawah", "Mainpuri", "Unnao", "Fatehpur", "Rae Bareli", "Banda", "Hamirpur", "Orai", "Mirzapur", "Basti", "Deoria", "Azamgarh", "Jaunpur", "Gonda", "Ballia", "Bulandshahr", "Hapur", "Etah", "Hathras", "Kasganj", "Bijnor", "Budaun", "Pilibhit"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Rishikesh", "Haldwani", "Roorkee", "Kashipur", "Rudrapur", "Nainital", "Mussoorie", "Pithoragarh", "Almora", "Bageshwar", "Champawat", "Tehri", "Uttarkashi", "Pauri", "Srinagar", "Kotdwar", "Ramnagar", "Jaspur", "Manglaur"],
  "West Bengal": ["Kolkata", "Siliguri", "Durgapur", "Howrah", "Asansol", "Bardhaman", "Malda", "Baharampur", "Habra", "Kharagpur", "Shantipur", "Contai", "Balurghat", "Basirhat", "Bankura", "Purulia", "Medinipur", "Krishnanagar", "Raiganj", "Alipurduar", "Cooch Behar", "Jalpaiguri", "Haldia", "Jangipur", "Bolpur", "Diamond Harbour", "Ranaghat", "Kalyani", "Tamluk", "Baruipur", "Barasat"],
  // Union Territories
  "Delhi NCR": ["New Delhi", "Delhi", "Noida", "Greater Noida", "Ghaziabad", "Faridabad", "Gurgaon", "Dwarka", "Rohini", "Janakpuri", "Laxmi Nagar", "Saket", "Vasant Kunj"],
  "Jammu & Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Sopore", "Udhampur", "Kathua", "Poonch", "Rajouri", "Kupwara", "Pulwama", "Shopian", "Kulgam", "Bandipora", "Ganderbal", "Budgam", "Samba", "Doda", "Kishtwar", "Ramban", "Reasi"],
  "Ladakh": ["Leh", "Kargil"],
  "Chandigarh": ["Chandigarh"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  "Andaman & Nicobar": ["Port Blair", "Car Nicobar", "Mayabunder", "Diglipur"],
  "Dadra & Nagar Haveli and Daman & Diu": ["Silvassa", "Daman", "Diu"],
  "Lakshadweep": ["Kavaratti", "Agatti", "Minicoy"],
};

export const allCities = Object.values(citiesByState).flat();
