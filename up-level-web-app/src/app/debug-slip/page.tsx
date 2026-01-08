
'use client';

import { useState } from "react";
import { Upload, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function DebugSlipPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [payloadSize, setPayloadSize] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setResult(null);
        setPayloadSize("");

        // Resize & Convert to Base64
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Resize logic (Max 1000px)
                const MAX_SIZE = 1000;
                if (width > height) {
                    if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
                } else {
                    if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                const resizedBase64 = canvas.toDataURL('image/jpeg', 0.7); // Compress

                const sizeKb = Math.round(resizedBase64.length / 1024);
                setPayloadSize(`${sizeKb} KB`);
                setImagePreview(resizedBase64);

                try {
                    // Call API via Firebase Rewrite (v2.1)
                    const res = await fetch('/api/verify-slip', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            slipImage: resizedBase64,
                            userId: 'DEBUG_USER',
                            amount: 0
                        })
                    });

                    const data = await res.json();
                    setResult(data);

                } catch (error: any) {
                    setResult({ error: error.message });
                } finally {
                    setLoading(false);
                }
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen bg-[#0f1014] text-white p-8 font-mono">
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-indigo-400">🕵️ SlipOK Debugger</h1>
                <span className="bg-indigo-900 text-indigo-300 text-xs px-2 py-1 rounded border border-indigo-700">v2.1 (Stability Fix)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Input */}
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-800/50 hover:bg-slate-800 transition-colors">
                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                        <p className="text-slate-400 text-sm mb-4">Upload Slip Image to Verify</p>
                        <input type="file" onChange={handleFileChange} accept="image/*" disabled={loading} className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600" />
                    </div>

                    {imagePreview && (
                        <div className="rounded-xl overflow-hidden border border-slate-700 relative">
                            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{payloadSize}</div>
                            <img src={imagePreview} className="w-full object-contain max-h-[400px]" alt="Preview" />
                        </div>
                    )}
                </div>

                {/* Right: Result */}
                <div className="bg-[#15151a] rounded-xl border border-slate-700 p-6 overflow-x-auto">
                    <h2 className="text-sm font-bold text-slate-500 mb-4 uppercase flex justify-between">
                        API Response
                        {payloadSize && <span className="text-purple-400">Payload: {payloadSize}</span>}
                    </h2>

                    {loading ? (
                        <div className="flex items-center gap-2 text-indigo-400 animate-pulse">
                            <Loader2 className="animate-spin w-4 h-4" /> Analyzing Slip...
                        </div>
                    ) : result ? (
                        <div className="space-y-4">
                            <div className={`p-3 rounded-lg flex items-center gap-2 ${result.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {result.success ? <CheckCircle2 /> : <XCircle />}
                                <span className="font-bold">{result.success ? "VERIFIED VALID" : "VERIFICATION FAILED"}</span>
                            </div>

                            <pre className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
                    ) : (
                        <div className="text-slate-600 italic">Waiting for input...</div>
                    )}
                </div>
            </div>
        </div>
    );
}
