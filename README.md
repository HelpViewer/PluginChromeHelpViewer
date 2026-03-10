# PluginChromeHelpViewer

HelpViewer integration plugin for Chromium engine - Chrome/Edge browser.

## Functionality

1. The plugin checks for **window.hvHelpFile** configuration in your PWA/web app.
2. If found, a new ❔ item appears in the **right-click context menu**.
3. Clicking ❔ opens a **HelpViewer tab** with content based on the **element ID** and **routing** (per config).
4. No config means no ❔ item shown.

To enable HelpViewer integration, follow these steps:

1. Install the plugin in developer mode (Chrome Web Store submission not available).
2. Add config to your PWA/web app.
3. Create help file with chapter files matching your element IDs (e.g., downP-TopicTree.md) and routing configuration.

## Browser Extension installation

1. Call **git clone https://github.com/HelpViewer/PluginChromeHelpViewer** in some folder on your local disk.
2. Open extensions panel - **chrome://extensions/**
3. Turn on **Developer mode** on right top corner
4. Click button **Load unpacked** on left top line
5. Select your folder from step 1
6. You will see **HelpViewer Help Integration 1.0** in your **All Extensions** list.

## Application installation

Define globally in your application:

```javascript
var hvHelpFile = {
  file: 'hlp-user/Help-__.zip',
  viewer: 'https://helpviewer.github.io/index.html',
  routing: false
  //, extension: '.md'
  //, offset: 0
}
```

### Configuration keys

| Key | Meaning |
| --- | --- |
| file | Help file or repository raw reading path |
| viewer | URI with your copy of **HelpViewer**. **Default: https://helpviewer.github.io/index.html** |
| routing | If routing is true, then URI route is part of requested help file chapter file name |
| extension | Chapter file name extension. **Default: .md** |
| offset | Left-side routing parts offset. **Default: 0** |

### Example

When running the application from URI **file:///C:/Repos/HelpViewer/index.html** for element ID **downP-TopicTree**, the routing generates these URLs:

| routing | Result URI |
| --- | --- |
| false | https://helpviewer.github.io/index.html?d=hlp-user%2FHelp-__.zip&p=downP-TopicTree.md |
| true | https://helpviewer.github.io/index.html?d=hlp-user%2FHelp-__.zip&p=C--Repos-HelpViewer-index-html-downP-TopicTree.md |
