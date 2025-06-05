import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Palette, Loader2 } from 'lucide-react';

const BrandingSettings: React.FC = () => {
  const { themeConfig, updateThemeConfig } = useTheme();
  const [primaryColor, setPrimaryColor] = useState(themeConfig.primaryColor);
  const [roundedCorners, setRoundedCorners] = useState(themeConfig.roundedCorners);
  const [logoUrl, setLogoUrl] = useState(themeConfig.logoUrl);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateThemeConfig({
      primaryColor,
      roundedCorners,
      logoUrl
    });
    
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Branding Settings</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Primary Color
            </label>
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden"
                style={{ backgroundColor: primaryColor }}
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#3B82F6"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-10 w-10 border-0 p-0 cursor-pointer"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Choose a primary color for buttons and accents
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Corner Style
            </label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={roundedCorners}
                  onChange={() => setRoundedCorners(true)}
                  className="form-radio h-4 w-4 text-blue-600 dark:text-blue-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Rounded</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={!roundedCorners}
                  onChange={() => setRoundedCorners(false)}
                  className="form-radio h-4 w-4 text-blue-600 dark:text-blue-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Square</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Logo URL
            </label>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.svg"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter the URL of your company logo
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preview</h3>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            {/* Logo preview */}
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="max-w-full max-h-full" />
              ) : (
                <Palette size={20} className="text-gray-500 dark:text-gray-400" />
              )}
            </div>
            <span className="font-medium text-gray-900 dark:text-white">Your Brand</span>
          </div>
          
          {/* Button style preview */}
          <div className="space-y-4">
            <button
              style={{ 
                backgroundColor: primaryColor,
                borderRadius: roundedCorners ? '0.375rem' : '0'
              }}
              className="px-4 py-2 text-white shadow-sm hover:opacity-90"
            >
              Primary Button
            </button>
            
            <div 
              style={{ 
                borderColor: primaryColor,
                borderRadius: roundedCorners ? '0.375rem' : '0'
              }}
              className="p-4 border-2 border-opacity-50"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300">
                This is how your brand elements will look
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="inline-block animate-spin h-4 w-4 mr-2" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
};

export default BrandingSettings;