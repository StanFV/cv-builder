import { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Printer,
  Briefcase,
  GraduationCap,
  Languages,
  Wrench,
  FileText,
  Settings,
  User,
  RefreshCw,
  FolderGit2,
  Mail,
  Phone,
  Globe,
  MapPin,
  CheckCircle,
  FileDown,
  FileUp,
} from 'lucide-react';

interface PersonalData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  summary: string;
  avatar: string;
}

interface SectionItem {
  id: string;
  title?: string;
  subtitle?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  name?: string;
  level?: string;
}

interface Section {
  id: string;
  type: string;
  title: string;
  visible: boolean;
  items: SectionItem[];
}

interface Config {
  template: string;
  accentColor: string;
  fontFamily: string;
  fontSize: string;
  showPhoto: boolean;
}

interface CvData {
  personal: PersonalData;
  sections: Section[];
  config: Config;
}

const VOORBEELD_DATA: CvData = {
  personal: {
    firstName: 'Sophie',
    lastName: 'de Vries',
    jobTitle: 'Senior UX/UI Designer & Front-end Developer',
    email: 'sophie.devries@email.nl',
    phone: '+31 6 12345678',
    website: 'www.sophiedevries.nl',
    address: 'Amsterdam, Nederland',
    summary:
      'Gedreven en creatieve UX/UI Designer met meer dan 5 jaar ervaring in het ontwerpen en bouwen van gebruiksvriendelijke webapplicaties. Sterk in het vertalen van complexe gebruikersbehoeften naar intuïtieve, visueel aantrekkelijke interfaces. Werkt graag op het snijvlak van design en technologie.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  sections: [
    {
      id: 'work',
      type: 'work',
      title: 'Werkervaring',
      visible: true,
      items: [
        {
          id: 'w1',
          title: 'Senior UX/UI Designer',
          subtitle: 'Digital Agency Apex',
          location: 'Utrecht',
          startDate: '2022-03',
          endDate: 'Heden',
          description:
            'Verantwoordelijk voor de UX/UI strategie van grote e-commerce cliënten. Leiden van design sprints en gebruikerstesten.',
        },
        {
          id: 'w2',
          title: 'Medior Web Designer & Developer',
          subtitle: 'Creative Pixel',
          location: 'Amsterdam',
          startDate: '2019-08',
          endDate: '2022-02',
          description:
            'Ontwerpen van responsive websites en interactieve prototypes. Ontwikkelen van custom WordPress- en React-frontends.',
        },
      ],
    },
    {
      id: 'education',
      type: 'education',
      title: 'Opleidingen',
      visible: true,
      items: [
        {
          id: 'e1',
          title: 'Master Communication & Information Sciences',
          subtitle: 'Vrije Universiteit Amsterdam',
          location: 'Amsterdam',
          startDate: '2017-09',
          endDate: '2019-06',
          description: 'Specialisatie in Human-Computer Interaction.',
        },
      ],
    },
    {
      id: 'skills',
      type: 'skills',
      title: 'Vaardigheden',
      visible: true,
      items: [
        { id: 's1', name: 'UI/UX Design', level: 'Expert' },
        { id: 's2', name: 'Figma', level: 'Expert' },
        { id: 's3', name: 'React & Tailwind', level: 'Gevorderd' },
      ],
    },
  ],
  config: {
    template: 'modern',
    accentColor: '#0ea5e9',
    fontFamily: 'font-sans',
    fontSize: 'medium',
    showPhoto: true,
  },
};

const LEEG_SJABLOON: CvData = {
  personal: {
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    summary: '',
    avatar: '',
  },
  sections: [
    { id: 'work', type: 'work', title: 'Werkervaring', visible: true, items: [] },
    { id: 'education', type: 'education', title: 'Opleidingen', visible: true, items: [] },
    { id: 'skills', type: 'skills', title: 'Vaardigheden', visible: true, items: [] },
  ],
  config: {
    template: 'classic',
    accentColor: '#1e3a8a',
    fontFamily: 'font-sans',
    fontSize: 'medium',
    showPhoto: false,
  },
};

const ACCENT_COLORS = [
  { name: 'Sky Blue', hex: '#0ea5e9' },
  { name: 'Teal', hex: '#0f766e' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Deep Purple', hex: '#7c3aed' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Amber', hex: '#d97706' },
  { name: 'Chique Zwart', hex: '#18181b' },
];

export default function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cvData, setCvData] = useState<CvData>(() => {
    try {
      const saved = localStorage.getItem('cv_builder_data_local');
      return saved ? (JSON.parse(saved) as CvData) : VOORBEELD_DATA;
    } catch {
      return VOORBEELD_DATA;
    }
  });

  const [activeTab, setActiveTab] = useState('editor');
  const [activeSection, setActiveSection] = useState('personal');
  const [successMessage, setSuccessMessage] = useState('');
  const [pageGuides, setPageGuides] = useState<number[]>([]);
  const cvContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('cv_builder_data_local', JSON.stringify(cvData));
  }, [cvData]);

  useEffect(() => {
    const el = cvContainerRef.current;
    if (!el) return;
    const update = () => {
      const mmToPx = el.offsetWidth / 210;
      const pageHeightPx = 297 * mmToPx;
      const pages = Math.ceil(el.offsetHeight / pageHeightPx);
      setPageGuides(
        Array.from({ length: Math.max(0, pages - 1) }, (_, i) => (i + 1) * pageHeightPx)
      );
    };
    const observer = new ResizeObserver(update);
    observer.observe(el);
    update();
    return () => observer.disconnect();
  }, []);

  const triggerNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Weet je zeker dat je met een leeg CV wilt beginnen? Je huidige gegevens worden gewist.')) {
      setCvData(LEEG_SJABLOON);
      setActiveSection('personal');
      triggerNotification('CV gereset naar leeg sjabloon.');
    }
  };

  const handleLoadExample = () => {
    if (window.confirm('Dit overschrijft je huidige invoer. Wil je doorgaan?')) {
      setCvData(VOORBEELD_DATA);
      setActiveSection('personal');
      triggerNotification('Voorbeeldgegevens geladen!');
    }
  };

  const exportToJson = () => {
    try {
      const jsonString = JSON.stringify(cvData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = cvData.personal.lastName
        ? cvData.personal.lastName.replace(/\s+/g, '_')
        : 'Export';
      link.download = `CV_Backup_${fileName}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      triggerNotification('Back-up succesvol gedownload!');
    } catch (err) {
      console.error(err);
      alert('Er is een fout opgetreden bij het exporteren.');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const importFromJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.readAsText(file, 'UTF-8');
    fileReader.onload = (event) => {
      try {
        const result = (event.target as FileReader).result as string;
        const parsed = JSON.parse(result) as CvData;
        if (parsed.personal && parsed.sections && parsed.config) {
          setCvData(parsed);
          triggerNotification('Back-up succesvol geïmporteerd!');
        } else {
          alert('Dit lijkt geen geldig CV-Bouwer bestand te zijn.');
        }
      } catch {
        alert('Fout bij het lezen van het bestand. Mogelijk is het beschadigd of ongeldig.');
      }
    };
    e.target.value = '';
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePersonalChange = (field: keyof PersonalData, val: string) => {
    setCvData((prev) => ({ ...prev, personal: { ...prev.personal, [field]: val } }));
  };

  const handleConfigChange = (key: keyof Config, val: string | boolean) => {
    setCvData((prev) => ({ ...prev, config: { ...prev.config, [key]: val } }));
  };

  const addNewSection = (type: string) => {
    const titles: Record<string, string> = {
      work: 'Werkervaring',
      education: 'Opleidingen',
      skills: 'Vaardigheden',
      languages: 'Talen',
      projects: 'Projecten',
      custom: 'Certificaten / Overig',
    };
    const title = titles[type] ?? 'Nieuwe Sectie';
    const newSec: Section = {
      id: `${type}_${Date.now()}`,
      type,
      title,
      visible: true,
      items: [],
    };
    setCvData((prev) => ({ ...prev, sections: [...prev.sections, newSec] }));
    setActiveSection(newSec.id);
    triggerNotification(`Sectie "${title}" toegevoegd.`);
  };

  const deleteSection = (id: string) => {
    if (window.confirm('Weet je zeker dat je deze volledige sectie wilt verwijderen?')) {
      setCvData((prev) => ({
        ...prev,
        sections: prev.sections.filter((s) => s.id !== id),
      }));
      setActiveSection('personal');
      triggerNotification('Sectie succesvol verwijderd.');
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= cvData.sections.length) return;
    const updatedSections = [...cvData.sections];
    const temp = updatedSections[index];
    updatedSections[index] = updatedSections[nextIndex];
    updatedSections[nextIndex] = temp;
    setCvData((prev) => ({ ...prev, sections: updatedSections }));
  };

  const toggleSectionVisibility = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)),
    }));
  };

  const handleSectionTitleChange = (id: string, newTitle: string) => {
    setCvData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, title: newTitle } : s)),
    }));
  };

  const addItemToSection = (sectionId: string, type: string) => {
    let newItem: SectionItem;
    if (['work', 'education', 'projects', 'custom'].includes(type)) {
      newItem = {
        id: `item_${Date.now()}`,
        title: '',
        subtitle: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
      };
    } else {
      newItem = { id: `item_${Date.now()}`, name: '', level: 'Goed' };
    }
    setCvData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
      ),
    }));
  };

  const handleItemChange = (
    sectionId: string,
    itemId: string,
    field: keyof SectionItem,
    value: string
  ) => {
    setCvData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id === sectionId) {
          return {
            ...s,
            items: s.items.map((item) =>
              item.id === itemId ? { ...item, [field]: value } : item
            ),
          };
        }
        return s;
      }),
    }));
  };

  const deleteItemFromSection = (sectionId: string, itemId: string) => {
    setCvData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, items: s.items.filter((item) => item.id !== itemId) } : s
      ),
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handlePersonalChange('avatar', reader.result as string);
        triggerNotification('Profielfoto geüpload!');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900">

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              CV-Bouwer
            </h1>
          </div>

          <div className="flex items-center flex-wrap gap-2 justify-center w-full xl:w-auto">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Legen
            </button>
            <button
              onClick={handleLoadExample}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition mr-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Voorbeeld
            </button>
            <span className="h-6 w-px bg-slate-200 hidden sm:inline" />
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={importFromJson}
              className="hidden"
            />
            <button
              onClick={handleImportClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
            >
              <FileUp className="h-3.5 w-3.5" />
              Importeer Back-up
            </button>
            <button
              onClick={exportToJson}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition mr-2"
              title="Exporteer CV als .json bestand"
            >
              <FileDown className="h-3.5 w-3.5" />
              Exporteer Back-up
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-sm transition hover:shadow-md"
            >
              <Printer className="h-4 w-4" />
              Maak PDF
            </button>
          </div>
        </div>
      </header>

      {/* Mobiele navigatie tabbladen */}
      <div className="sm:hidden flex border-b border-slate-200 bg-white sticky top-[61px] z-30 print:hidden">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition ${
            activeTab === 'editor'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-slate-500'
          }`}
        >
          1. Gegevens & Stijl
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition ${
            activeTab === 'preview'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-slate-500'
          }`}
        >
          2. Live Voorbeeld
        </button>
      </div>

      <main className="max-w-[1400px] w-full mx-auto p-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 print:p-0 print:block">

        {/* SUCCES MELDING */}
        {successMessage && (
          <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 z-50 animate-bounce print:hidden">
            <CheckCircle className="h-5 w-5 text-teal-400" />
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
        )}

        {/* LINKER PANEL: EDITOR & STIJLEN */}
        <section
          className={`lg:col-span-5 flex flex-col gap-5 print:hidden ${
            activeTab === 'editor' ? 'block' : 'hidden sm:flex'
          }`}
        >
          {/* Layout & Vormgeving */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-4">
              <Settings className="h-4 w-4 text-teal-600" />
              Layout & Vormgeving
            </h2>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                CV Sjabloon Layout
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'modern', name: 'Modern', desc: 'Met gekleurde sidebar' },
                  { id: 'classic', name: 'Klassiek', desc: 'Traditioneel & Elegant' },
                  { id: 'minimal', name: 'Minimalistisch', desc: 'Schoon met witruimte' },
                  { id: 'creative', name: 'Creatief', desc: 'Speels & kleurrijk' },
                ].map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleConfigChange('template', tmpl.id)}
                    className={`p-2 rounded-lg border text-left transition flex flex-col ${
                      cvData.config.template === tmpl.id
                        ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/30'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-800">{tmpl.name}</span>
                    <span className="text-[10px] text-slate-500 leading-tight">{tmpl.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Accentkleur
              </label>
              <div className="flex flex-wrap gap-2">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => handleConfigChange('accentColor', c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`h-6 w-6 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
                      cvData.config.accentColor === c.hex
                        ? 'ring-2 ring-offset-2 ring-slate-800 scale-105'
                        : 'ring-1 ring-black/10'
                    }`}
                    title={c.name}
                  >
                    {cvData.config.accentColor === c.hex && (
                      <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Lettertype
                </label>
                <select
                  value={cvData.config.fontFamily}
                  onChange={(e) => handleConfigChange('fontFamily', e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-teal-500"
                >
                  <option value="font-sans">Sans-Serif (Modern)</option>
                  <option value="font-serif">Serif (Klassiek)</option>
                  <option value="font-mono">Monospace (Technisch)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Tekstgrootte
                </label>
                <select
                  value={cvData.config.fontSize}
                  onChange={(e) => handleConfigChange('fontSize', e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-teal-500"
                >
                  <option value="small">Compact</option>
                  <option value="medium">Standaard</option>
                  <option value="large">Groot</option>
                </select>
              </div>
            </div>
          </div>

          {/* Secties Editor */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex-1 flex flex-col">
            <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap gap-1">
              <button
                onClick={() => setActiveSection('personal')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeSection === 'personal'
                    ? 'bg-white text-teal-600 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:bg-white/50'
                }`}
              >
                <User className="h-3.5 w-3.5" /> Contact
              </button>

              {cvData.sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeSection === sec.id
                      ? 'bg-white text-teal-600 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:bg-white/50'
                  }`}
                >
                  <span className={`${sec.visible ? '' : 'line-through opacity-50'}`}>
                    {sec.title || '(Leeg)'}
                  </span>
                </button>
              ))}

              <div className="relative inline-block ml-auto group/add">
                <button className="flex items-center gap-1 bg-teal-50 text-teal-600 hover:bg-teal-100 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                  <Plus className="h-3.5 w-3.5" /> Sectie
                </button>
                <div className="absolute right-0 bottom-full mb-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1 hidden group-hover/add:block z-50">
                  <button
                    onClick={() => addNewSection('work')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <Briefcase className="h-3 w-3" /> Werkervaring
                  </button>
                  <button
                    onClick={() => addNewSection('education')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <GraduationCap className="h-3 w-3" /> Opleidingen
                  </button>
                  <button
                    onClick={() => addNewSection('skills')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <Wrench className="h-3 w-3" /> Vaardigheden
                  </button>
                  <button
                    onClick={() => addNewSection('languages')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <Languages className="h-3 w-3" /> Talen
                  </button>
                  <button
                    onClick={() => addNewSection('projects')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <FolderGit2 className="h-3 w-3" /> Projecten
                  </button>
                  <button
                    onClick={() => addNewSection('custom')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <FileText className="h-3 w-3" /> Aangepaste Sectie
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 flex-1 overflow-y-auto">
              {/* Persoonlijke gegevens */}
              {activeSection === 'personal' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Voornaam
                      </label>
                      <input
                        type="text"
                        value={cvData.personal.firstName}
                        onChange={(e) => handlePersonalChange('firstName', e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Achternaam
                      </label>
                      <input
                        type="text"
                        value={cvData.personal.lastName}
                        onChange={(e) => handlePersonalChange('lastName', e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Gewenste Functie
                    </label>
                    <input
                      type="text"
                      value={cvData.personal.jobTitle}
                      onChange={(e) => handlePersonalChange('jobTitle', e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        E-mailadres
                      </label>
                      <input
                        type="email"
                        value={cvData.personal.email}
                        onChange={(e) => handlePersonalChange('email', e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Telefoonnummer
                      </label>
                      <input
                        type="tel"
                        value={cvData.personal.phone}
                        onChange={(e) => handlePersonalChange('phone', e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Woonplaats / Regio
                      </label>
                      <input
                        type="text"
                        value={cvData.personal.address}
                        onChange={(e) => handlePersonalChange('address', e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Website / Portfolio
                      </label>
                      <input
                        type="text"
                        value={cvData.personal.website}
                        onChange={(e) => handlePersonalChange('website', e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Persoonlijk Profiel
                    </label>
                    <textarea
                      rows={3}
                      value={cvData.personal.summary}
                      onChange={(e) => handlePersonalChange('summary', e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-teal-500 resize-none"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">
                        Profielfoto
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cvData.config.showPhoto}
                          onChange={(e) => handleConfigChange('showPhoto', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-7 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600"></div>
                        <span className="ml-2 text-[10px] text-slate-500">Zichtbaar op CV</span>
                      </label>
                    </div>
                    {cvData.config.showPhoto && (
                      <div className="flex items-center gap-3">
                        {cvData.personal.avatar ? (
                          <img
                            src={cvData.personal.avatar}
                            className="h-10 w-10 rounded-full object-cover border border-slate-300"
                            alt="Avatar"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                            <User className="h-5 w-5" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="text-[10px] text-slate-600 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-slate-200 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sectie editors */}
              {cvData.sections.map((sec, secIdx) => {
                if (activeSection !== sec.id) return null;
                const isTextType = ['work', 'education', 'projects', 'custom'].includes(sec.type);

                return (
                  <div key={sec.id} className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <div className="flex gap-1">
                        <button
                          disabled={secIdx === 0}
                          onClick={() => moveSection(secIdx, 'up')}
                          className="p-1 hover:bg-white rounded disabled:opacity-30"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          disabled={secIdx === cvData.sections.length - 1}
                          onClick={() => moveSection(secIdx, 'down')}
                          className="p-1 hover:bg-white rounded disabled:opacity-30"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleSectionVisibility(sec.id)}
                          className="p-1 hover:bg-white rounded"
                        >
                          {sec.visible ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-rose-500" />
                          )}
                        </button>
                      </div>
                      <button
                        onClick={() => deleteSection(sec.id)}
                        className="text-[10px] bg-rose-50 text-rose-600 hover:bg-rose-100 px-2 py-1 rounded font-bold flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" /> Wissen
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Titel Sectie
                      </label>
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => handleSectionTitleChange(sec.id, e.target.value)}
                        className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-teal-500"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-[11px] font-bold text-slate-600">
                          Items ({sec.items.length})
                        </span>
                        <button
                          onClick={() => addItemToSection(sec.id, sec.type)}
                          className="text-[10px] bg-teal-600 text-white px-2 py-1 rounded flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" /> Voeg toe
                        </button>
                      </div>

                      {sec.items.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 bg-slate-50 rounded-lg border border-slate-200 relative group/item"
                        >
                          <button
                            onClick={() => deleteItemFromSection(sec.id, item.id)}
                            className="absolute right-2 top-2 p-1 text-slate-400 hover:text-rose-500 hover:bg-slate-200 rounded transition"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>

                          {isTextType ? (
                            <div className="space-y-2 mt-1">
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="Titel / Rol"
                                  value={item.title ?? ''}
                                  onChange={(e) =>
                                    handleItemChange(sec.id, item.id, 'title', e.target.value)
                                  }
                                  className="w-full text-[11px] border p-1.5 rounded focus:outline-teal-500"
                                />
                                <input
                                  type="text"
                                  placeholder="Bedrijf / School"
                                  value={item.subtitle ?? ''}
                                  onChange={(e) =>
                                    handleItemChange(sec.id, item.id, 'subtitle', e.target.value)
                                  }
                                  className="w-full text-[11px] border p-1.5 rounded focus:outline-teal-500"
                                />
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <input
                                  type="text"
                                  placeholder="Start (2020)"
                                  value={item.startDate ?? ''}
                                  onChange={(e) =>
                                    handleItemChange(sec.id, item.id, 'startDate', e.target.value)
                                  }
                                  className="w-full text-[11px] border p-1.5 rounded focus:outline-teal-500"
                                />
                                <input
                                  type="text"
                                  placeholder="Eind (Heden)"
                                  value={item.endDate ?? ''}
                                  onChange={(e) =>
                                    handleItemChange(sec.id, item.id, 'endDate', e.target.value)
                                  }
                                  className="w-full text-[11px] border p-1.5 rounded focus:outline-teal-500"
                                />
                                <input
                                  type="text"
                                  placeholder="Locatie"
                                  value={item.location ?? ''}
                                  onChange={(e) =>
                                    handleItemChange(sec.id, item.id, 'location', e.target.value)
                                  }
                                  className="w-full text-[11px] border p-1.5 rounded focus:outline-teal-500"
                                />
                              </div>
                              <textarea
                                placeholder="Omschrijving..."
                                rows={2}
                                value={item.description ?? ''}
                                onChange={(e) =>
                                  handleItemChange(sec.id, item.id, 'description', e.target.value)
                                }
                                className="w-full text-[11px] border p-1.5 rounded focus:outline-teal-500 resize-none"
                              />
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2 mt-1">
                              <input
                                type="text"
                                placeholder="Naam (Bijv. HTML)"
                                value={item.name ?? ''}
                                onChange={(e) =>
                                  handleItemChange(sec.id, item.id, 'name', e.target.value)
                                }
                                className="w-full text-[11px] border p-1.5 rounded focus:outline-teal-500"
                              />
                              <input
                                type="text"
                                placeholder="Niveau"
                                value={item.level ?? ''}
                                onChange={(e) =>
                                  handleItemChange(sec.id, item.id, 'level', e.target.value)
                                }
                                className="w-full text-[11px] border p-1.5 rounded focus:outline-teal-500"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* RECHTER PANEL: LIVE CV PREVIEW */}
        <section
          className={`lg:col-span-7 flex flex-col items-center justify-start ${
            activeTab === 'preview' ? 'block' : 'hidden sm:block'
          } print:block print:w-full`}
        >
          <div className="relative w-full max-w-[210mm] mx-auto print:max-w-full">
            <div
              id="cv-preview-container"
              ref={cvContainerRef}
              className={`w-full min-h-[297mm] bg-white shadow-lg border border-slate-200 rounded-md overflow-hidden print:shadow-none print:border-none print:rounded-none print:overflow-visible ${
                cvData.config.fontFamily === 'font-serif'
                  ? 'font-serif'
                  : cvData.config.fontFamily === 'font-mono'
                    ? 'font-mono'
                    : 'font-sans'
              } ${
                cvData.config.fontSize === 'small'
                  ? 'text-xs'
                  : cvData.config.fontSize === 'large'
                    ? 'text-base'
                    : 'text-sm'
              }`}
            >
            {/* 1. MODERN LAYOUT */}
            {cvData.config.template === 'modern' && (
              <div className="grid grid-cols-12 min-h-[297mm]">
                <div
                  style={{ backgroundColor: `${cvData.config.accentColor}15` }}
                  className="col-span-4 p-6 border-r border-slate-100 flex flex-col gap-6"
                >
                  <div className="text-center">
                    {cvData.config.showPhoto && cvData.personal.avatar && (
                      <img
                        src={cvData.personal.avatar}
                        className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-2"
                        style={{ borderColor: cvData.config.accentColor }}
                        alt="Avatar"
                      />
                    )}
                    <h2 className="font-extrabold text-lg leading-tight text-slate-900">
                      {cvData.personal.firstName} {cvData.personal.lastName}
                    </h2>
                    <p className="text-xs font-semibold mt-1 text-slate-600">
                      {cvData.personal.jobTitle}
                    </p>
                  </div>

                  <div className="space-y-3 text-slate-700 pt-4 border-t border-slate-200/50">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Contact
                    </h3>
                    {cvData.personal.email && (
                      <div className="flex gap-2 text-[11px]">
                        <Mail
                          className="h-3.5 w-3.5 shrink-0"
                          style={{ color: cvData.config.accentColor }}
                        />
                        <span className="break-all">{cvData.personal.email}</span>
                      </div>
                    )}
                    {cvData.personal.phone && (
                      <div className="flex gap-2 text-[11px]">
                        <Phone
                          className="h-3.5 w-3.5 shrink-0"
                          style={{ color: cvData.config.accentColor }}
                        />
                        <span>{cvData.personal.phone}</span>
                      </div>
                    )}
                    {cvData.personal.address && (
                      <div className="flex gap-2 text-[11px]">
                        <MapPin
                          className="h-3.5 w-3.5 shrink-0"
                          style={{ color: cvData.config.accentColor }}
                        />
                        <span>{cvData.personal.address}</span>
                      </div>
                    )}
                    {cvData.personal.website && (
                      <div className="flex gap-2 text-[11px]">
                        <Globe
                          className="h-3.5 w-3.5 shrink-0"
                          style={{ color: cvData.config.accentColor }}
                        />
                        <span className="break-all">{cvData.personal.website}</span>
                      </div>
                    )}
                  </div>

                  {cvData.sections
                    .filter((s) => s.visible && ['skills', 'languages'].includes(s.type))
                    .map((sec) => (
                      <div key={sec.id} className="pt-4 border-t border-slate-200/50">
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                          {sec.title}
                        </h3>
                        <div className="space-y-2">
                          {sec.items.map((item) => (
                            <div key={item.id} className="text-[11px]">
                              <div className="font-bold text-slate-800">{item.name}</div>
                              <div className="text-[9px] text-slate-500">{item.level}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>

                <div className="col-span-8 p-8 flex flex-col gap-6">
                  {cvData.personal.summary && (
                    <div>
                      <h3
                        className="text-[11px] font-bold uppercase tracking-wider mb-2"
                        style={{ color: cvData.config.accentColor }}
                      >
                        Profiel
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        {cvData.personal.summary}
                      </p>
                    </div>
                  )}

                  {cvData.sections
                    .filter((s) => s.visible && !['skills', 'languages'].includes(s.type))
                    .map((sec) => (
                      <div key={sec.id} className="space-y-3">
                        <h3
                          className="text-[11px] font-bold uppercase tracking-wider pb-1 border-b"
                          style={{
                            color: cvData.config.accentColor,
                            borderColor: `${cvData.config.accentColor}30`,
                          }}
                        >
                          {sec.title}
                        </h3>
                        <div className="space-y-4">
                          {sec.items.map((item) => (
                            <div key={item.id}>
                              <div className="flex justify-between items-baseline gap-1">
                                <div>
                                  <h4 className="font-bold text-slate-800 text-[12px]">
                                    {item.title}
                                  </h4>
                                  <span className="text-[10px] font-semibold text-slate-500">
                                    {item.subtitle}
                                  </span>
                                  {item.location && (
                                    <span className="text-[9px] text-slate-400">
                                      {' '}
                                      • {item.location}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[9px] font-bold text-slate-500 shrink-0">
                                  {item.startDate}{' '}
                                  {item.endDate && `– ${item.endDate}`}
                                </span>
                              </div>
                              {item.description && (
                                <p className="text-slate-600 text-[11px] mt-1 whitespace-pre-line leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* 2. KLASSIEK LAYOUT */}
            {cvData.config.template === 'classic' && (
              <div className="p-8 sm:p-10 flex flex-col gap-6">
                <div
                  className="text-center border-b pb-6"
                  style={{ borderColor: `${cvData.config.accentColor}30` }}
                >
                  <h2
                    className="font-extrabold text-2xl tracking-wide text-slate-900"
                    style={{ color: cvData.config.accentColor }}
                  >
                    {cvData.personal.firstName.toUpperCase()} {cvData.personal.lastName.toUpperCase()}
                  </h2>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mt-1">
                    {cvData.personal.jobTitle}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-4 text-[11px] text-slate-600">
                    {cvData.personal.email && <span>{cvData.personal.email}</span>}
                    {cvData.personal.phone && <span>{cvData.personal.phone}</span>}
                    {cvData.personal.address && <span>{cvData.personal.address}</span>}
                    {cvData.personal.website && <span>{cvData.personal.website}</span>}
                  </div>
                </div>

                {cvData.personal.summary && (
                  <div className="text-center max-w-2xl mx-auto">
                    <p className="text-slate-600 leading-relaxed italic text-[11px]">
                      &ldquo;{cvData.personal.summary}&rdquo;
                    </p>
                  </div>
                )}

                {cvData.sections
                  .filter((s) => s.visible)
                  .map((sec) => {
                    const isGrid = ['skills', 'languages'].includes(sec.type);
                    return (
                      <div key={sec.id} className="space-y-2">
                        <h3
                          className="text-[11px] font-extrabold uppercase tracking-widest pb-1 border-b-2"
                          style={{
                            color: cvData.config.accentColor,
                            borderColor: cvData.config.accentColor,
                          }}
                        >
                          {sec.title}
                        </h3>
                        {isGrid ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                            {sec.items.map((item) => (
                              <div key={item.id} className="text-[11px]">
                                <span className="font-bold text-slate-800">
                                  {item.name ?? item.title}
                                </span>
                                {item.level && (
                                  <span className="text-slate-500 font-medium">
                                    {' '}
                                    ({item.level})
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-4 pt-1">
                            {sec.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex flex-col sm:flex-row justify-between gap-2"
                              >
                                <div className="flex-1">
                                  <h4 className="font-bold text-slate-800 text-[12px]">
                                    {item.title}
                                  </h4>
                                  <div className="text-[10px] text-slate-600 font-medium">
                                    {item.subtitle} {item.location && `• ${item.location}`}
                                  </div>
                                  {item.description && (
                                    <p className="text-slate-600 text-[11px] mt-1 whitespace-pre-line leading-relaxed">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                <div className="text-[9px] font-bold text-slate-500 sm:text-right shrink-0">
                                  {item.startDate} {item.endDate && `– ${item.endDate}`}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}

            {/* 3. MINIMALISTISCH LAYOUT */}
            {cvData.config.template === 'minimal' && (
              <div className="p-8 sm:p-12 flex flex-col gap-8">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b pb-4 border-slate-100">
                  <div>
                    <h2 className="font-light text-2xl tracking-tight text-slate-900">
                      <strong className="font-semibold">{cvData.personal.firstName}</strong>{' '}
                      {cvData.personal.lastName}
                    </h2>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">
                      {cvData.personal.jobTitle}
                    </p>
                  </div>
                  <div className="text-slate-600 text-[10px] space-y-0.5 sm:text-right">
                    {cvData.personal.email && <div>{cvData.personal.email}</div>}
                    {cvData.personal.phone && <div>{cvData.personal.phone}</div>}
                    {cvData.personal.address && <div>{cvData.personal.address}</div>}
                    {cvData.personal.website && <div>{cvData.personal.website}</div>}
                  </div>
                </div>

                {cvData.personal.summary && (
                  <p
                    className="text-slate-600 leading-relaxed text-[11px] border-l-2 pl-4 py-1"
                    style={{ borderColor: cvData.config.accentColor }}
                  >
                    {cvData.personal.summary}
                  </p>
                )}

                <div className="space-y-6">
                  {cvData.sections
                    .filter((s) => s.visible)
                    .map((sec) => {
                      const isGrid = ['skills', 'languages'].includes(sec.type);
                      return (
                        <div key={sec.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6">
                          <div className="md:col-span-3">
                            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 md:text-right md:pt-1">
                              {sec.title}
                            </h3>
                          </div>
                          <div className="md:col-span-9 space-y-4">
                            {isGrid ? (
                              <div className="flex flex-wrap gap-x-3 gap-y-1">
                                {sec.items.map((item) => (
                                  <div key={item.id} className="text-[11px] flex items-center gap-1.5">
                                    <span className="font-bold text-slate-800">
                                      {item.name ?? item.title}
                                    </span>
                                    {item.level && (
                                      <span className="text-[9px] text-slate-400">
                                        • {item.level}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {sec.items.map((item) => (
                                  <div key={item.id}>
                                    <div className="flex items-baseline justify-between gap-2">
                                      <h4 className="font-bold text-slate-800 text-[12px]">
                                        {item.title}
                                      </h4>
                                      <span className="text-[9px] text-slate-400 font-semibold shrink-0">
                                        {item.startDate} {item.endDate && `– ${item.endDate}`}
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-semibold">
                                      {item.subtitle} {item.location && `• ${item.location}`}
                                    </div>
                                    {item.description && (
                                      <p className="text-slate-600 text-[11px] leading-relaxed whitespace-pre-line pt-1">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 4. CREATIEF LAYOUT */}
            {cvData.config.template === 'creative' && (
              <div className="flex flex-col">
                <div style={{ backgroundColor: cvData.config.accentColor }} className="h-3 w-full" />
                <div className="p-8 sm:p-10 flex flex-col gap-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-4 border-b border-slate-100">
                    {cvData.config.showPhoto && cvData.personal.avatar && (
                      <img
                        src={cvData.personal.avatar}
                        className="w-20 h-20 rounded-2xl object-cover shadow-sm rotate-2"
                        style={{ border: `3px solid ${cvData.config.accentColor}` }}
                        alt="Avatar"
                      />
                    )}
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="font-black text-2xl tracking-tight text-slate-900 leading-none">
                        {cvData.personal.firstName}{' '}
                        <span style={{ color: cvData.config.accentColor }}>
                          {cvData.personal.lastName}
                        </span>
                      </h2>
                      <p className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-wide">
                        {cvData.personal.jobTitle}
                      </p>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 mt-2 text-[10px] text-slate-500">
                        {cvData.personal.email && <span>{cvData.personal.email}</span>}
                        {cvData.personal.phone && <span>{cvData.personal.phone}</span>}
                        {cvData.personal.address && <span>{cvData.personal.address}</span>}
                      </div>
                    </div>
                  </div>

                  {cvData.personal.summary && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        {cvData.personal.summary}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8 space-y-5">
                      {cvData.sections
                        .filter((s) => s.visible && !['skills', 'languages'].includes(s.type))
                        .map((sec) => (
                          <div key={sec.id} className="space-y-3">
                            <h3
                              className="text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-2"
                              style={{ color: cvData.config.accentColor }}
                            >
                              <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: cvData.config.accentColor }}
                              />{' '}
                              {sec.title}
                            </h3>
                            <div
                              className="space-y-3 pl-3 border-l"
                              style={{ borderColor: `${cvData.config.accentColor}30` }}
                            >
                              {sec.items.map((item) => (
                                <div key={item.id} className="relative">
                                  <div
                                    className="absolute -left-[16px] top-1.5 h-1.5 w-1.5 rounded-full border bg-white"
                                    style={{ borderColor: cvData.config.accentColor }}
                                  />
                                  <div className="flex justify-between items-baseline gap-1">
                                    <h4 className="font-extrabold text-slate-800 text-[12px]">
                                      {item.title}
                                    </h4>
                                    <span className="text-[9px] font-bold text-slate-400 shrink-0">
                                      {item.startDate} {item.endDate && `– ${item.endDate}`}
                                    </span>
                                  </div>
                                  <div className="text-[10px] font-semibold text-slate-500">
                                    {item.subtitle} {item.location && `• ${item.location}`}
                                  </div>
                                  {item.description && (
                                    <p className="text-slate-600 text-[11px] mt-1 leading-relaxed whitespace-pre-line">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="md:col-span-4 space-y-5">
                      {cvData.sections
                        .filter((s) => s.visible && ['skills', 'languages'].includes(s.type))
                        .map((sec) => (
                          <div key={sec.id} className="space-y-2">
                            <h3
                              className="text-[11px] font-extrabold uppercase tracking-wider pb-1 border-b"
                              style={{
                                color: cvData.config.accentColor,
                                borderColor: `${cvData.config.accentColor}30`,
                              }}
                            >
                              {sec.title}
                            </h3>
                            <div className="space-y-2">
                              {sec.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="text-[11px] bg-slate-50 p-1.5 rounded border border-slate-100"
                                >
                                  <div className="font-bold text-slate-800">{item.name}</div>
                                  {item.level && (
                                    <div className="text-[9px] text-slate-500 font-semibold">
                                      {item.level}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>

            {/* Paginagidsen – alleen zichtbaar in de preview, niet bij printen */}
            {pageGuides.map((top, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 flex items-center gap-2 pointer-events-none print:hidden z-10"
                style={{ top: `${top}px` }}
              >
                <div className="flex-1 border-t-2 border-dashed border-slate-300" />
                <span className="text-[10px] bg-white text-slate-400 px-2 py-0.5 rounded border border-slate-200 shrink-0">
                  Pagina {i + 2}
                </span>
                <div className="flex-1 border-t-2 border-dashed border-slate-300" />
              </div>
            ))}
          </div>
        </section>
      </main>

    </div>
  );
}
