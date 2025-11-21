import * as SettingsModel from '../models/settings.model.js';

export const getSettings = async (req, res) => {
  try {
    const settings = await SettingsModel.getAllSettings();
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get settings',
      error: error.message
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    console.log('Request method:', req.method);
    console.log('Request headers:', req.headers);
    console.log('Request body type:', typeof req.body);
    console.log('Request body:', req.body);
    console.log('Request body keys:', req.body ? Object.keys(req.body) : 'no keys');
    
    const settings = req.body;
    
    console.log('Received settings update request:', JSON.stringify(settings, null, 2));
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid settings data'
      });
    }

    const updateResult = await SettingsModel.updateMultipleSettings(settings);
    console.log('Settings updated in database successfully, result:', updateResult);
    
    // Small delay to ensure transaction is fully committed
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Get fresh settings from database
    const updatedSettings = await SettingsModel.getAllSettings();
    console.log('Retrieved updated settings from database:', JSON.stringify(updatedSettings, null, 2));
    
    // Verify each setting was actually updated
    const verification = {};
    for (const key of Object.keys(settings)) {
      const dbValue = updatedSettings[key];
      const expectedValue = settings[key];
      verification[key] = {
        expected: expectedValue,
        actual: dbValue,
        match: dbValue === expectedValue
      };
      if (dbValue !== expectedValue) {
        console.warn(`⚠️ Setting ${key} mismatch! Expected: ${expectedValue}, Got: ${dbValue}`);
      }
    }
    console.log('Settings verification:', verification);
    
    res.json({
      success: true,
      data: updatedSettings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message
    });
  }
};

