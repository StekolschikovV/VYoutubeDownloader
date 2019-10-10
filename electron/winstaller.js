const electronInstaller = require('electron-winstaller');
try {
    await electronInstaller.createWindowsInstaller({
      appDirectory: './release',
      outputDirectory: './res',
      authors: 'Stekolschikov',
      exe: 'vyd.exe'
    });
    console.log('It worked!');
  } catch (e) {
    console.log(`No dice: ${e.message}`);
  }