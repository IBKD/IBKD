
import { Language, PetitionContent } from './types';

export const INSTITUTIONS = [
  "Bundesministerium für Arbeit und Soziales (BMAS)",
  "Bundesministerium des Innern und für Heimat (BMI)",
  "Bundesagentur für Arbeit (BA), Zentrale Auslands- und Fachvermittlung (ZAV)",
  "Deutscher Industrie- und Handelskammertag (DIHK) / IHK FOSA",
  "Zentrale Servicestelle Berufsanerkennung (ZSBA)",
  "Diverse IHK deutschlandweit"
];

// Expanded License Classes
export const LICENSE_CLASSES = [
  "B", "BE", 
  "C1", "C1E", "C", "CE", 
  "D1", "D1E", "D", "DE", 
  "Fahrerkarte", "Code 95"
];

const LETTER_DE = `
Sehr geehrte Damen und Herren,

Deutschland steht in der Personen- und Güterbeförderung vor einem strukturellen Fachkräftemangel. Branchenverbände berichten von zehntausenden fehlenden Fahrerinnen und Fahrern – sowohl im LKW-Transport als auch im Bus- und Linienverkehr. Dieser Engpass gefährdet Versorgungssicherheit, Mobilität, Wirtschaftsstabilität und stellt zunehmend ein Risiko für die öffentliche Infrastruktur dar.

Wir vertreten eine wachsende Gruppe aus Transportunternehmen, Logistikbetrieben, Busunternehmen und qualifizierten Berufskraftfahrern beider Kategorien, die sich unserer Petition angeschlossen haben. Alle Beteiligten verfolgen dasselbe Ziel: die Fachkräfteeinwanderung im Verkehrssektor rechtssicher, verantwortungsvoll und praxisorientiert zu gestalten.

Aktuell scheitert die beschleunigte Integration erfahrener ausländischer Fahrerinnen und Fahrer jedoch an einer überproportionalen Hürde:
**den ausschließlich deutschsprachigen IHK-Prüfungen sowie den derzeit ausschließlich deutschsprachig angebotenen Kursen und Prüfungen zur beschleunigten Grundqualifikation (LKW – C/CE und Bus – D/D1).**

Obwohl viele Bewerberinnen und Bewerber über langjährige Fahrpraxis, internationale Befähigungsnachweise und einwandfreie Sicherheitsstandards verfügen, führt das rein deutschsprachige Kurs- und Prüfungsformat zu erheblichen Verzögerungen, Zusatzkosten und nicht selten zum Abbruch des gesamten Qualifizierungsprozesses.

Ein aktuelles Beispiel verdeutlicht zudem die staatliche Handlungsmöglichkeit: **Ukrainische Führerscheine werden im Rahmen des temporären Schutzes anerkannt, ohne dass eine Umschreibung erforderlich ist.** Diese Maßnahme zeigt, dass der Staat bei Bedarf pragmatische Lösungen entwickeln kann, um rechtlich komplexe Situationen zu entschärfen und Arbeitsmarktengpässe auszugleichen.

**Unsere zentralen Anliegen (für LKW- und Busfahrer gleichermaßen):**

**1. Mehrsprachige IHK-Prüfungen für alle Fahrerlaubnisklassen (C/CE und D/D1)**
Wir fordern, dass die IHK-Prüfungen zur Erwerbung der Fahrerqualifikation – ohne Abstriche bei Qualitäts- und Sicherheitsstandards – **in mehreren Sprachen** angeboten werden:
* Englisch
* Türkisch
* Arabisch
* Russisch
* sowie weitere relevante Migrationssprachen

Dies soll für alle Qualifikationen gelten: Güterkraftverkehr und Personenbeförderung.

**2. Mehrsprachige Kurse und Lernmaterialien für die beschleunigte Grundqualifikation**
Sowohl Kurse als auch Lernunterlagen und Prüfungen sollen **mehrsprachig** verfügbar sein. Derzeitige Monolingualität verhindert die Integration ausländischer Fahrer faktisch.

**3. Möglichkeit der Online-Durchführung im Herkunftsland**
Um Zeitverluste und Kosten zu reduzieren und Unternehmen schneller Planungssicherheit zu geben, soll ermöglicht werden:
* Online-Teilnahme am Kurs
* Durchführung im Herkunftsland
* Unterricht und Vorbereitung in der Muttersprache
* Prüfung weiterhin in Deutschland (ggf. mehrsprachig)

Dies beschleunigt nachweislich die Arbeitsaufnahme und entlastet Behörden, Unternehmen und Migranten gleichermaßen.

**Unsere Zielsetzung:**
* Schnellere Qualifizierung und Planbarkeit
* Reduktion unnötiger Sprachbarrieren
* Rechtssichere Integration ausländischer Fahrerinnen und Fahrer
* Entlastung von Speditions- und Busunternehmen, Arbeitsagenturen und Behörden
* Beschleunigung der Zuwanderung gemäß Fachkräfteeinwanderungsgesetz
* Stabilisierung der Transport-, Versorgungs- und Mobilitätsinfrastruktur in Deutschland

**Wir bitten daher um:**
* Prüfung eines mehrsprachigen Prüfungs- und Kursangebots
* Entwicklung von Übergangs- oder Pilotmodellen
* Einladung zu einem strukturierten Fachgespräch

Wir stehen jederzeit für Daten, Fallbeispiele, Branchenfeedback sowie Erfahrungsberichte zur Verfügung und sind bereit, aktiv an einer Lösung mitzuwirken.

Vielen Dank für Ihre Aufmerksamkeit und Ihre Bereitschaft, einen zentralen Wirtschaftsbereich nachhaltig zu stärken.

Mit freundlichen Grüßen,
**Initiative Berufskraftfahrer nach Deutschland**
`;

const LETTER_TR = `
Sayın Yetkili,

Almanya; gerek yük taşımacılığı (LKW), gerekse şehir içi ve şehirlerarası yolcu taşımacılığı (Otobüs) alanlarında ciddi bir şoför açığıyla karşı karşıyadır. Sektör raporları, on binlerce sürücünün eksik olduğunu ve durumun giderek kötüleştiğini göstermektedir. Bu eksiklik; tedarik zincirlerini, toplumsal mobiliteyi, ekonomik istikrarı ve kamu hizmetlerinin sürekliliğini tehlikeye atmaktadır.

Hazırladığımız bu petisyona destek veren lojistik firmaları, taşımacılık şirketleri, otobüs işletmeleri ve hem kamyon hem otobüs kategorisindeki profesyonel sürücüler adına yazıyoruz. Amacımız, Almanya’ya nitelikli göçü güvenli, hızlı ve uygulanabilir hale getirmektir.

Bugün yabancı mesleki sürücülerin entegrasyonu özellikle **sadece Almanca olarak sunulan IHK sınavları ve hızlandırılmış temel yeterlilik kursları** nedeniyle ciddi ölçüde zorlaşmaktadır.

Birçok aday; uluslararası ehliyetlere, uzun yıllara dayanan tecrübeye ve güvenlik standartlarına sahip olmasına rağmen, Almanca sınırlaması süreci uzatmakta, maliyeti artırmakta ve çoğu zaman göç sürecinin tamamen yarım kalmasına sebep olmaktadır.

Ayrıca, **Ukrayna sürücü belgelerinin geçici koruma kapsamında Almanya’da tanınması**, devletin ihtiyaç halinde pratik ve hızlı çözümler üretebileceğini göstermektedir. Bu örnek, benzer kolaylaştırıcı adımların sürücü yeterlilik süreçlerinde de mümkün olduğunu açıkça ortaya koymaktadır.

**Taleplerimiz (hem LKW hem Otobüs sürücüleri için):**

**1. Tüm IHK Sınavlarının Çok Dilli Hale Getirilmesi (C/CE ve D/D1)**
Sınavların aşağıdaki dillerde yapılabilmesini talep ediyoruz:
* İngilizce
* Türkçe
* Arapça
* Rusça
* ve diğer yaygın göçmen dilleri

**2. Hızlandırılmış Temel Yeterlilik Kurs ve Materyallerinin Çok Dilli Olması**
Kursların, eğitim materyallerinin ve sınavların birden fazla dilde sunulması gerekmektedir.

**3. Kursların Adayın Ülkesinde Çevrim İçi Olarak Yapılabilmesi**
Adayların zaman kaybetmemesi için:
* Kursun çevrim içi yapılabilmesi
* Kendi ülkesinden katılım
* Eğitim materyallerinin adayın ana dilinde olması
* Sınavın Almanya’da yapılması
talep edilmektedir.

**Hedeflerimiz:**
* Daha hızlı ve öngörülebilir yeterlilik süreci
* Dil bariyerlerinin azaltılması
* Yabancı sürücülerin yasal ve güvenli entegrasyonu
* Şirketlerin ve kurumların idari yükünün azaltılması
* Nitelikli göçün hızlandırılması
* Almanya’nın lojistik ve ulaşım altyapısının korunması

**Talep Edilen Resmi Adımlar:**
* Çok dilli sınav ve kurs formatının incelenmesi
* Geçici çözümler ve pilot uygulamalar
* Konuyla ilgili resmi bir istişare toplantısı

Sektör verilerini, gerçek vaka örneklerini ve saha geri bildirimlerini sunmaya hazır olduğumuzu belirtiriz.

Saygılarımızla,
**Initiative Berufskraftfahrer nach Deutschland**
`;

const LETTER_EN = `
Dear Sir or Madam,

Germany is experiencing a significant shortage of professional drivers in both freight transport (C/CE) and passenger transport (D/D1). Industry data confirms that tens of thousands of truck and bus drivers are missing, putting supply chains, mobility, economic stability and public infrastructure at risk.

We represent a growing coalition of logistics companies, transport operators, bus companies and qualified professional drivers who have joined this petition. Our shared mission is to make skilled migration in the transport sector lawful, safe, fast and practical.

Currently, the integration of foreign professional drivers is severely hindered by one major barrier:
**the exclusively German-language IHK examinations and the German-only accelerated qualification courses (basic qualification) for truck and bus drivers.**

Many candidates have extensive driving experience, valid international certificates and full compliance with safety standards, yet the monolingual exam and training structure causes delays, higher costs and often leads to the complete abandonment of the process.

Furthermore, the **recognition of Ukrainian driver’s licenses under temporary protection** demonstrates that the German state is fully capable of implementing pragmatic solutions when required. This precedent clearly shows that administrative relief is possible.

**Key Demands (for both LKW and Bus Drivers):**

**1. Multilingual IHK Examinations (C/CE and D/D1)**
We request that all qualification exams be offered in:
* English
* Turkish
* Arabic
* Russian
* and other relevant migration languages

**2. Multilingual Training & Materials for the Accelerated Basic Qualification**
Training courses and exam materials should be provided in multiple languages to ensure real accessibility.

**3. Online Participation and Training from the Candidate’s Home Country**
To accelerate deployment and reduce cost and time loss:
* Online course participation
* Training from abroad
* Learning materials in the candidate’s native language
* Final examination in Germany (preferably multilingual)

**Objectives:**
* Faster and more predictable qualification pathways
* Reduction of unnecessary language barriers
* Safe and lawful integration of foreign drivers
* Reduced administrative burden for companies and authorities
* Acceleration of skilled migration
* Stabilisation of Germany’s transport and mobility infrastructure

**Requested Actions:**
* Feasibility study for multilingual exams and training
* Temporary or pilot-based regulatory solutions
* Invitation to a structured expert dialogue

We are prepared to provide sector data, case studies and stakeholder feedback at any time.

Sincerely,
**Initiative Berufskraftfahrer nach Deutschland**
`;

export const CONTENT: Record<Language, PetitionContent> = {
  [Language.DE]: {
    title: "Initiative für Mehrsprachige IHK-Prüfungen",
    subtitle: "Gegen den Fahrermangel: Qualifikation beschleunigen, Lieferketten sichern.",
    institutionsTitle: "Gerichtet an:",
    institutions: INSTITUTIONS,
    cta: "Jetzt Unterschreiben",
    calloutTitle: "Setzen Sie heute ein Zeichen.",
    calloutSubtitle: "Schließen Sie sich Unternehmen und Fahrern an, die für eine bessere Zukunft eintreten.",
    supportersText: "Unterstützer",
    roles: {
      representative: "Unternehmens-Vertreter",
      individual: "Privatperson / Fahrer"
    },
    formTitles: { driver: "Berufskraftfahrer", company: "Unternehmen" },
    fields: {
      name: "Vollständiger Name",
      dob: "Geburtsdatum",
      license: "Vorhandene Führerscheine",
      sector: "Einsatzbereich / Branche",
      sectorOptions: {
        freight: "Güterkraftverkehr (LKW)",
        passenger: "Personenverkehr (Bus)",
        both: "Beides"
      },
      street: "Straße & Hausnummer",
      zip: "PLZ",
      city: "Stadt / Ort",
      owner: "Name Inhaber/Geschäftsführer",
      company: "Unternehmensname",
      legalForm: "Unternehmensform (z.B. GmbH)",
      trucks: "Fahrzeuge (LKW/Bus)",
      demand: "Aktueller Bedarf an Fahrern",
      email: "E-Mail-Adresse",
      phone: "Telefonnummer",
      privacyLabel: "Ich habe die Datenschutzerklärung gelesen und bin mit der Verarbeitung meiner Daten einverstanden."
    },
    errors: {
      required: "Dieses Feld ist erforderlich.",
      invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      invalidPhone: "Bitte geben Sie eine gültige Telefonnummer ein.",
      invalidDate: "Bitte geben Sie ein gültiges Datum ein.",
      duplicate: "Sie haben diese Petition bereits unterschrieben. Vielen Dank für Ihre Unterstützung!",
      privacyRequired: "Bitte stimmen Sie den Datenschutzbestimmungen zu."
    },
    letterSubject: "Betreff: Petition zur Entschärfung der Zugangshürden und mehrsprachigen Gestaltung der IHK-Prüfung",
    letterBody: LETTER_DE,
    successMessage: "Vielen Dank für Ihre Unterstützung!",
    shareTitle: "Teilen Sie die Initiative",
    shareMessage: "Ich habe unterschrieben! Mehrsprachige IHK-Prüfungen für Berufskraftfahrer jetzt! #InitiativeBKD",
    securityNote: "Ihre Daten werden sicher gespeichert und ausschließlich für den Zweck dieser Petition verwendet.",
    requirementNote: "Die vollständige Angabe von Name, Geburtsdatum und Kontaktdaten ist zwingend erforderlich, um die Echtheit der Unterschrift zu verifizieren.",
    legal: {
      imprint: "Impressum",
      privacy: "Datenschutz",
      back: "Zurück"
    },
    auth: {
      loginTitle: "Admin Login",
      emailPlaceholder: "admin@example.com",
      passwordPlaceholder: "Passwort",
      loginBtn: "Anmelden",
      logoutBtn: "Abmelden",
      loginError: "Anmeldung fehlgeschlagen. Bitte prüfen Sie Ihre Daten."
    },
    adminPanel: {
      title: "Admin Panel: Initiative BKD",
      dashboard: {
        total: "Unterschriften Gesamt",
        freight: "Güterverkehr (LKW)",
        passenger: "Personenverkehr (Bus)",
        views: "Seitenaufrufe"
      },
      filter: {
        searchPlaceholder: "Suchen (Name, Firma, E-Mail)...",
        statusAll: "Alle Status",
        statusNew: "Neu",
        statusVerified: "Verifiziert",
        statusDuplicate: "Dublette"
      },
      team: {
        tabTitle: "Team / Rechte",
        addTitle: "Neuen Admin hinzufügen",
        emailLabel: "E-Mail Adresse",
        roleLabel: "Rolle",
        addBtn: "Hinzufügen",
        tableEmail: "Admin E-Mail",
        tableRole: "Berechtigung",
        tableAdded: "Hinzugefügt am",
        roleSuper: "Super-Admin (Vollzugriff)",
        roleAdmin: "Admin (Nur Lesen/Status)"
      },
      tables: {
        companies: "Unternehmen",
        drivers: "Berufskraftfahrer",
        emptyCompanies: "Keine Unternehmen gefunden.",
        emptyDrivers: "Keine Fahrer gefunden.",
        cols: {
          status: "Status",
          company: "Firma / Rechtsform",
          owner: "Inhaber",
          contact: "Kontakt",
          fleet: "Flotte / Bedarf",
          actions: "Aktionen",
          name: "Name",
          location: "Wohnort",
          licenses: "Führerscheine",
          sector: "Sektor"
        }
      }
    }
  },
  [Language.EN]: {
    title: "Initiative for Multilingual IHK Exams",
    subtitle: "Combating the driver shortage: Accelerate qualification, secure supply chains.",
    institutionsTitle: "Addressed to:",
    institutions: INSTITUTIONS,
    cta: "Sign Petition",
    calloutTitle: "Make a difference today.",
    calloutSubtitle: "Join companies and drivers uniting for a better future.",
    supportersText: "Supporters",
    roles: {
      representative: "Company Representative",
      individual: "Individual / Driver"
    },
    formTitles: { driver: "Professional Driver", company: "Company" },
    fields: {
      name: "Full Name",
      dob: "Date of Birth",
      license: "Current Licenses",
      sector: "Sector",
      sectorOptions: {
        freight: "Freight Transport (Truck)",
        passenger: "Passenger Transport (Bus)",
        both: "Both"
      },
      street: "Street Address",
      zip: "Zip Code",
      city: "City",
      owner: "Owner/CEO Name",
      company: "Company Name",
      legalForm: "Legal Form (e.g., Ltd)",
      trucks: "Fleet Size (Trucks/Buses)",
      demand: "Current Driver Demand",
      email: "Email Address",
      phone: "Phone Number",
      privacyLabel: "I have read the privacy policy and agree to the processing of my data."
    },
    errors: {
      required: "This field is required.",
      invalidEmail: "Please enter a valid email address.",
      invalidPhone: "Please enter a valid phone number.",
      invalidDate: "Please enter a valid date.",
      duplicate: "You have already signed this petition. Thank you for your support!",
      privacyRequired: "You must agree to the privacy policy."
    },
    letterSubject: "Subject: Petition for Reduced Qualification Barriers and Multilingual IHK Examinations",
    letterBody: LETTER_EN,
    successMessage: "Thank you for your support!",
    shareTitle: "Share the Initiative",
    shareMessage: "I signed! Multilingual IHK exams for professional drivers now! #InitiativeBKD",
    securityNote: "Your data is stored securely and used solely for the purpose of this petition.",
    requirementNote: "Providing full name, date of birth, and contact details is mandatory to verify the authenticity of the signature.",
    legal: {
      imprint: "Imprint",
      privacy: "Privacy Policy",
      back: "Back"
    },
    auth: {
      loginTitle: "Admin Login",
      emailPlaceholder: "admin@example.com",
      passwordPlaceholder: "Password",
      loginBtn: "Login",
      logoutBtn: "Logout",
      loginError: "Login failed. Please check your credentials."
    },
    adminPanel: {
      title: "Admin Panel: Initiative BKD",
      dashboard: {
        total: "Total Signatures",
        freight: "Freight (Truck)",
        passenger: "Passenger (Bus)",
        views: "Page Views"
      },
      filter: {
        searchPlaceholder: "Search name, company, email...",
        statusAll: "All Status",
        statusNew: "New",
        statusVerified: "Verified",
        statusDuplicate: "Duplicate"
      },
      team: {
        tabTitle: "Team / Permissions",
        addTitle: "Add New Admin",
        emailLabel: "Email Address",
        roleLabel: "Role",
        addBtn: "Add Admin",
        tableEmail: "Admin Email",
        tableRole: "Permission",
        tableAdded: "Added On",
        roleSuper: "Super Admin (Full Access)",
        roleAdmin: "Admin (Read/Status Only)"
      },
      tables: {
        companies: "Companies",
        drivers: "Drivers",
        emptyCompanies: "No companies found.",
        emptyDrivers: "No drivers found.",
        cols: {
          status: "Status",
          company: "Company / Legal Form",
          owner: "Owner",
          contact: "Contact",
          fleet: "Fleet / Demand",
          actions: "Actions",
          name: "Name",
          location: "Location",
          licenses: "Licenses",
          sector: "Sector"
        }
      }
    }
  },
  [Language.TR]: {
    title: "Çok Dilli IHK Sınavları Girişimi",
    subtitle: "Sürücü kıtlığına karşı: Nitelik sürecini hızlandırın, tedarik zincirlerini güvence altına alın.",
    institutionsTitle: "Muhatap Kurumlar:",
    institutions: INSTITUTIONS,
    cta: "İmzala",
    calloutTitle: "Bugün bir fark yaratın.",
    calloutSubtitle: "Daha iyi bir gelecek için birleşen şirketlere ve sürücülere katılın.",
    supportersText: "Destekleyenler",
    roles: {
      representative: "Şirket Temsilcisi",
      individual: "Özel Kişi / Sürücü"
    },
    formTitles: { driver: "Profesyonel Sürücü", company: "Şirket" },
    fields: {
      name: "Ad Soyad",
      dob: "Doğum Tarihi",
      license: "Mevcut Ehliyetler",
      sector: "Sektör",
      sectorOptions: {
        freight: "Yük Taşımacılığı (TIR/Kamyon)",
        passenger: "Yolcu Taşımacılığı (Otobüs)",
        both: "Her İkisi"
      },
      street: "Cadde ve Kapı No",
      zip: "Posta Kodu",
      city: "Şehir / İlçe",
      owner: "Sahibi/Müdür Adı",
      company: "Şirket Adı",
      legalForm: "Şirket Türü",
      trucks: "Araç Sayısı (Kamyon/Otobüs)",
      demand: "Mevcut Sürücü İhtiyacı",
      email: "E-Posta Adresi",
      phone: "Telefon Numarası",
      privacyLabel: "Gizlilik politikasını okudum ve verilerimin işlenmesini kabul ediyorum."
    },
    errors: {
      required: "Bu alan zorunludur.",
      invalidEmail: "Lütfen geçerli bir e-posta adresi giriniz.",
      invalidPhone: "Lütfen geçerli bir telefon numarası giriniz.",
      invalidDate: "Lütfen geçerli bir tarih giriniz.",
      duplicate: "Bu dilekçeyi zaten imzaladınız. Desteğiniz için teşekkürler!",
      privacyRequired: "Gizlilik politikasını kabul etmelisiniz."
    },
    letterSubject: "Konu: TIR ve Kamyon Şoförlüğü Nitelik Sınavının Çok Dilli Hale Getirilmesi",
    letterBody: LETTER_TR,
    successMessage: "Desteğiniz için teşekkür ederiz!",
    shareTitle: "Girişimi Paylaş",
    shareMessage: "İmzaladım! Profesyonel sürücüler için çok dilli IHK sınavları hemen şimdi! #InitiativeBKD",
    securityNote: "Verileriniz güvenli bir şekilde saklanır ve yalnızca bu dilekçe amacıyla kullanılır.",
    requirementNote: "İmzanın gerçekliğini doğrulamak için ad, doğum tarihi ve iletişim bilgilerinin eksiksiz girilmesi zorunludur.",
    legal: {
      imprint: "Künye",
      privacy: "Gizlilik Politikası",
      back: "Geri"
    },
    auth: {
      loginTitle: "Yönetici Girişi",
      emailPlaceholder: "admin@example.com",
      passwordPlaceholder: "Parola",
      loginBtn: "Giriş Yap",
      logoutBtn: "Çıkış Yap",
      loginError: "Giriş başarısız. Lütfen bilgilerinizi kontrol edin."
    },
    adminPanel: {
      title: "Yönetici Paneli: Initiative BKD",
      dashboard: {
        total: "Toplam İmza",
        freight: "Yük (Kamyon)",
        passenger: "Yolcu (Otobüs)",
        views: "Sayfa Görüntüleme"
      },
      filter: {
        searchPlaceholder: "Ara (İsim, Şirket, E-posta)...",
        statusAll: "Tüm Durumlar",
        statusNew: "Yeni",
        statusVerified: "Doğrulanmış",
        statusDuplicate: "Çift Kayıt"
      },
      team: {
        tabTitle: "Ekip / Yetkiler",
        addTitle: "Yeni Yönetici Ekle",
        emailLabel: "E-Posta Adresi",
        roleLabel: "Rol",
        addBtn: "Yönetici Ekle",
        tableEmail: "Yönetici E-Posta",
        tableRole: "Yetki",
        tableAdded: "Eklendiği Tarih",
        roleSuper: "Süper Yönetici (Tam Erişim)",
        roleAdmin: "Yönetici (Sadece Okuma)"
      },
      tables: {
        companies: "Şirketler",
        drivers: "Sürücüler",
        emptyCompanies: "Şirket bulunamadı.",
        emptyDrivers: "Sürücü bulunamadı.",
        cols: {
          status: "Durum",
          company: "Şirket / Tür",
          owner: "Sahibi",
          contact: "İletişim",
          fleet: "Filo / Talep",
          actions: "İşlemler",
          name: "İsim",
          location: "Konum",
          licenses: "Ehliyetler",
          sector: "Sektör"
        }
      }
    }
  }
};
