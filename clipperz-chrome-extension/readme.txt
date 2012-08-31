To verify that extension works use this steps (as per http://code.google.com/chrome/webstore/docs/get_started_simple.html#step4):
 - Bring up the extensions management page by clicking the wrench icon and choosing Tools > Extensions.
 - If Developer mode has a + by it, click the +.
 - The + changes to a -, and more buttons and information appear.
 - Click the "Load unpacked extension" button.
 - A file dialog appears.
 - In the file dialog, choose the "clipperz-chrome-extension" directory.

To archive extension for deployment you can simply use Google Chrome.
Open extensions management page in Developer mode as described above and click "Pack extension" button.
Please refer this link for details: http://code.google.com/chrome/extensions/packaging.html.

Usage
=====
Please go to extension Options (right-click on the extension icon in the toolbar and select Options) and enter Nested Labels Separator.
For example: if this separator is set to "\" (without quotes) and your entry title is "Folder\Title" your entry will show up as

Folder
  |
  +-Title