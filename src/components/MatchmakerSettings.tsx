'use client';
import React from 'react';

interface MatchmakerSettingsProps {
  servicesWeight: number;
  specialtiesWeight: number;
  personnelWeight: number;
  onChange: (newConfig: { servicesWeight: number; specialtiesWeight: number; personnelWeight: number }) => void;
  title?: string;
  subtitle?: string;
}

export function MatchmakerSettings({
  servicesWeight,
  specialtiesWeight,
  personnelWeight,
  onChange,
  title = "Algorithmic Weights",
  subtitle = "Adjust the global weights for the matchmaking algorithm. They must always sum to 100%."
}: MatchmakerSettingsProps) {
  
  const handleSliderChange = (changedKey: 'servicesWeight' | 'specialtiesWeight' | 'personnelWeight', newValue: number) => {
    let s = servicesWeight;
    let sp = specialtiesWeight;
    let p = personnelWeight;
    
    let oldVal = 0;
    if (changedKey === 'servicesWeight') oldVal = s;
    if (changedKey === 'specialtiesWeight') oldVal = sp;
    if (changedKey === 'personnelWeight') oldVal = p;

    const diff = newValue - oldVal;
    
    // The keys that were NOT changed
    const others = (['servicesWeight', 'specialtiesWeight', 'personnelWeight'] as const).filter(k => k !== changedKey);
    
    let val1 = others[0] === 'servicesWeight' ? s : (others[0] === 'specialtiesWeight' ? sp : p);
    let val2 = others[1] === 'servicesWeight' ? s : (others[1] === 'specialtiesWeight' ? sp : p);
    
    const sumOthers = val1 + val2;
    
    let newVal1 = 0;
    let newVal2 = 0;
    
    if (sumOthers === 0) {
      // If others are 0, split evenly
      const rem = 100 - newValue;
      newVal1 = Math.round(rem / 2);
      newVal2 = rem - newVal1;
    } else {
      // Proportional deduction
      newVal1 = Math.max(0, Math.round(val1 - diff * (val1 / sumOthers)));
      newVal2 = Math.max(0, 100 - newValue - newVal1);
    }
    
    if (changedKey === 'servicesWeight') { s = newValue; }
    else if (changedKey === 'specialtiesWeight') { sp = newValue; }
    else if (changedKey === 'personnelWeight') { p = newValue; }
    
    if (others[0] === 'servicesWeight') { s = newVal1; }
    else if (others[0] === 'specialtiesWeight') { sp = newVal1; }
    else if (others[0] === 'personnelWeight') { p = newVal1; }
    
    if (others[1] === 'servicesWeight') { s = newVal2; }
    else if (others[1] === 'specialtiesWeight') { sp = newVal2; }
    else if (others[1] === 'personnelWeight') { p = newVal2; }

    onChange({ servicesWeight: s, specialtiesWeight: sp, personnelWeight: p });
  };

  return (
    <div className="card p-lg mb-lg">
      <h3 className="font-semibold text-lg mb-xs">{title}</h3>
      <p className="text-muted text-sm mb-lg">{subtitle}</p>
      
      <div className="flex flex-col gap-md">
        <div>
          <div className="flex justify-between mb-xs">
            <label className="text-sm font-medium">Services Weight</label>
            <span className="text-sm text-brand font-bold">{servicesWeight}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            value={servicesWeight}
            onChange={(e) => handleSliderChange('servicesWeight', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-xs">
            <label className="text-sm font-medium">Specialties Weight</label>
            <span className="text-sm text-brand font-bold">{specialtiesWeight}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            value={specialtiesWeight}
            onChange={(e) => handleSliderChange('specialtiesWeight', parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between mb-xs">
            <label className="text-sm font-medium">Personnel (Therapist) Weight</label>
            <span className="text-sm text-brand font-bold">{personnelWeight}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            value={personnelWeight}
            onChange={(e) => handleSliderChange('personnelWeight', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="flex justify-between mt-sm p-sm rounded bg-gray-50 border border-gray-200">
          <span className="text-sm font-medium text-gray-700">Total Sum:</span>
          <span className="text-sm font-bold text-gray-900">{servicesWeight + specialtiesWeight + personnelWeight}%</span>
        </div>
      </div>
    </div>
  );
}
