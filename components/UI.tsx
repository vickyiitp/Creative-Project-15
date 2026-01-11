import React, { useEffect, useState } from 'react';
import { RefreshCw, Box, MousePointer2, X, Shield, FileText } from 'lucide-react';

/* --- HUD Component --- */
export const HUD: React.FC<{ 
    score: number; 
    volumeFilled: number; 
    totalVolume: number; 
    nextPieceColor: string;
    onReset: () => void;
}> = ({ score, volumeFilled, totalVolume, nextPieceColor, onReset }) => {
    
    const percentage = Math.round((volumeFilled / totalVolume) * 100);

    return (
        <div className="absolute top-0 left-0 right-0 p-4 md:right-auto md:w-72 flex flex-col gap-4 pointer-events-none z-20">
            {/* Main Stats Card */}
            <div className="bg-gray-900/90 border border-gray-700 p-4 rounded-xl shadow-2xl backdrop-blur-sm text-white pointer-events-auto transition-all duration-300">
                <div className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-4">
                    <div className="bg-orange-500/20 p-2 rounded-lg">
                        <Box className="text-orange-500 w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight leading-none">CARGO MASTER</h1>
                        <p className="text-[10px] text-gray-400 font-mono mt-1">SYSTEM ONLINE</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm text-gray-400 mb-1 font-medium">
                            <span>Efficiency</span>
                            <span className={`font-mono ${percentage > 80 ? 'text-green-400' : 'text-white'}`}>{percentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-orange-500 to-purple-600 transition-all duration-500 shadow-[0_0_10px_rgba(234,88,12,0.5)]"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-800/80 p-3 rounded-lg border border-gray-700">
                            <p className="text-[10px] text-gray-400 font-bold tracking-wider">UNITS</p>
                            <p className="text-2xl font-bold font-mono text-white tracking-tight">{score}</p>
                        </div>
                        <div className="bg-gray-800/80 p-3 rounded-lg border border-gray-700">
                            <p className="text-[10px] text-gray-400 font-bold tracking-wider">VOLUME</p>
                            <p className="text-2xl font-bold font-mono text-white tracking-tight">
                                {volumeFilled}<span className="text-sm text-gray-600">/{totalVolume}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Helper */}
            <div className="hidden md:block bg-gray-900/80 border border-gray-700 p-4 rounded-lg backdrop-blur-sm text-gray-300 text-sm pointer-events-auto">
                <div className="flex items-center gap-2 mb-3">
                    <MousePointer2 className="w-4 h-4 text-orange-400" />
                    <span className="font-bold text-white text-xs uppercase tracking-wider">Manual Controls</span>
                </div>
                <ul className="space-y-2 text-xs font-mono text-gray-400">
                    <li className="flex justify-between items-center bg-white/5 p-1.5 rounded">
                        <span>MOVE</span> 
                        <span className="text-white bg-gray-800 px-1.5 py-0.5 rounded">MOUSE</span>
                    </li>
                    <li className="flex justify-between items-center bg-white/5 p-1.5 rounded">
                        <span>PLACE</span> 
                        <span className="text-white bg-gray-800 px-1.5 py-0.5 rounded">CLICK / TAP</span>
                    </li>
                    <li className="flex justify-between items-center bg-white/5 p-1.5 rounded">
                        <span>ROTATE</span> 
                        <span className="text-white bg-gray-800 px-1.5 py-0.5 rounded">SPACE / 'R'</span>
                    </li>
                </ul>
            </div>
            
            <button 
                onClick={onReset}
                className="bg-red-600/90 hover:bg-red-600 text-white p-3 rounded-lg shadow-lg flex items-center justify-center gap-2 font-bold transition-all hover:scale-[1.02] active:scale-95 pointer-events-auto text-sm backdrop-blur-sm border border-red-500/20"
                aria-label="Reset Game"
            >
                <RefreshCw className="w-4 h-4" /> 
                <span className="hidden md:inline">FLUSH CONTAINER</span>
                <span className="md:hidden">RESET</span>
            </button>
        </div>
    );
};

/* --- Game Over Modal --- */
export const GameOverModal: React.FC<{
    isOpen: boolean;
    score: number;
    percentage: number;
    onRestart: () => void;
}> = ({ isOpen, score, percentage, onRestart }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-gray-900 border-2 border-orange-500 p-8 md:p-10 rounded-3xl max-w-md w-full text-center shadow-[0_0_100px_rgba(255,102,0,0.2)] animate-scale-in">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-2 italic tracking-tighter">FULL CAPACITY</h2>
                <div className="h-1 w-24 bg-orange-500 mx-auto mb-6 rounded-full"></div>
                <p className="text-gray-400 mb-8 font-mono text-sm">SHIPMENT MANIFEST GENERATED</p>
                
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-gray-800/50 p-6 rounded-2xl border border-white/5">
                        <p className="text-xs text-gray-500 font-bold mb-1">TOTAL BOXES</p>
                        <p className="text-4xl font-mono font-bold text-white tracking-tighter">{score}</p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-2xl border border-white/5">
                        <p className="text-xs text-gray-500 font-bold mb-1">EFFICIENCY</p>
                        <p className={`text-4xl font-mono font-bold tracking-tighter ${percentage > 90 ? 'text-green-500' : 'text-orange-500'}`}>{percentage}%</p>
                    </div>
                </div>

                <button 
                    onClick={onRestart}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-4 rounded-xl text-lg transition-all hover:shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:-translate-y-1 active:translate-y-0"
                >
                    PROCESS NEXT SHIPMENT
                </button>
            </div>
        </div>
    );
};

/* --- Legal Modal --- */
export const LegalModal: React.FC<{
    type: 'privacy' | 'terms' | null;
    onClose: () => void;
}> = ({ type, onClose }) => {
    if (!type) return null;

    const title = type === 'privacy' ? 'Privacy Policy' : 'Terms of Service';
    const Icon = type === 'privacy' ? Shield : FileText;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-500/10 p-2 rounded-lg">
                            <Icon className="w-5 h-5 text-orange-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white">{title}</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto text-gray-300 text-sm leading-relaxed space-y-4 custom-scrollbar">
                    {type === 'privacy' ? (
                        <>
                            <p><strong>Last Updated: 2025</strong></p>
                            <p>Cargo Master 3D ("we", "our", or "us") respects your privacy. This Privacy Policy explains how we handle your information.</p>
                            <h3 className="text-white font-bold mt-4">1. Data Collection</h3>
                            <p>We do not collect any personal data. This game runs entirely in your browser. No game data, scores, or interactions are sent to any server.</p>
                            <h3 className="text-white font-bold mt-4">2. Local Storage</h3>
                            <p>We may use your browser's Local Storage to save your high score or game settings locally on your device. You can clear this at any time via your browser settings.</p>
                            <h3 className="text-white font-bold mt-4">3. Third-Party Services</h3>
                            <p>We may use basic analytics (like Google Analytics) to track anonymous page views to improve performance.</p>
                        </>
                    ) : (
                        <>
                            <p><strong>Last Updated: 2025</strong></p>
                            <h3 className="text-white font-bold mt-4">1. Acceptance of Terms</h3>
                            <p>By accessing Cargo Master 3D, you agree to be bound by these Terms of Service.</p>
                            <h3 className="text-white font-bold mt-4">2. Usage License</h3>
                            <p>Permission is granted to temporarily play the materials (information or software) on Cargo Master 3D's website for personal, non-commercial transitory viewing only.</p>
                            <h3 className="text-white font-bold mt-4">3. Disclaimer</h3>
                            <p>The materials on Cargo Master 3D's website are provided on an 'as is' basis. We make no warranties, expressed or implied.</p>
                        </>
                    )}
                </div>

                <div className="p-4 border-t border-gray-800 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="bg-white text-black font-bold px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};