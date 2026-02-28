import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Camera, MapPin, Loader2, X } from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import { translations, Language } from '../lib/i18n';
import { cn } from '../lib/utils';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface ReportFormProps {
  lang: Language;
  onSuccess: () => void;
}

export default function ReportForm({ lang, onSuccess }: ReportFormProps) {
  const supabase = getSupabase();
  const t = translations[lang];
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'video/*': [] },
    maxFiles: 5
  } as any);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        setLocation([e.latlng.lat, e.latlng.lng]);
      },
    });
    return location ? <Marker position={location} /> : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return alert(t.pickLocation);
    setLoading(true);

    try {
      if (!supabase) throw new Error("Supabase not configured");
      // 1. Get IP Hash from server
      const ipRes = await fetch('/api/ip-hash');
      const { hash } = await ipRes.json();

      // 2. Upload files to Supabase Storage
      const mediaUrls: string[] = [];
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `reports/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('evidence')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('evidence')
          .getPublicUrl(filePath);
        
        mediaUrls.push(publicUrl);
      }

      // 3. Insert report into DB
      const { error: dbError } = await supabase
        .from('reports')
        .insert({
          title,
          description,
          category,
          latitude: location[0],
          longitude: location[1],
          media_urls: mediaUrls,
          ip_hash: hash,
          status: 'pending'
        });

      if (dbError) throw dbError;

      alert(t.success);
      onSuccess();
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('other');
      setLocation(null);
      setFiles([]);
      setPreviews([]);
    } catch (error) {
      console.error(error);
      alert(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
      <h2 className="text-2xl font-bold text-brand-red">{t.reportCorruption}</h2>
      
      <div className="space-y-2">
        <label className="text-sm font-semibold">{t.category}</label>
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-red outline-none"
        >
          {Object.entries(t.categories).map(([key, val]) => (
            <option key={key} value={key}>{val}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">{t.description}</label>
        <textarea 
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-red outline-none min-height-[120px]"
          placeholder={t.description}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">{t.location}</label>
        <div className="h-64 rounded-xl overflow-hidden border border-zinc-200 relative">
          <MapContainer center={[23.8103, 90.4125]} zoom={7} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker />
          </MapContainer>
          {!location && (
            <div className="absolute inset-0 bg-black/5 pointer-events-none flex items-center justify-center">
              <span className="bg-white px-4 py-2 rounded-full text-xs font-medium shadow-sm border border-zinc-200">
                {t.pickLocation}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">{t.evidence}</label>
        <div 
          {...getRootProps()} 
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
            isDragActive ? "border-brand-red bg-brand-red/5" : "border-zinc-200 hover:border-brand-red"
          )}
        >
          <input {...getInputProps()} />
          <Camera className="mx-auto h-12 w-12 text-zinc-400 mb-2" />
          <p className="text-sm text-zinc-500">Drag & drop or click to upload</p>
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-5 gap-2 mt-4">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200">
                <img src={src} className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button 
        disabled={loading}
        className="w-full py-4 bg-brand-red text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin" /> : null}
        {t.submit}
      </button>
    </form>
  );
}
