#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

module.exports = function (context) {
  const xcode = require('xcode');
  const iosPlatform = path.join(context.opts.projectRoot, 'platforms', 'ios');
  const files = fs.readdirSync(iosPlatform);
  const pbxprojFile = files.find(f => f.endsWith('.xcodeproj'));
  if (!pbxprojFile) return;

  const projectPath = path.join(iosPlatform, pbxprojFile, 'project.pbxproj');
  const project = xcode.project(projectPath);
  project.parseSync();

  const configs = project.pbxXCBuildConfigurationSection();

  for (const key in configs) {
    if (typeof configs[key] === 'object') {
      const config = configs[key];
      if (config.buildSettings) {
        config.buildSettings.LD_RUNPATH_SEARCH_PATHS = '$(inherited)';
      }
    }
  }

  fs.writeFileSync(projectPath, project.writeSync());
  console.log('✅ LD_RUNPATH_SEARCH_PATHS forçado para $(inherited)');
};
