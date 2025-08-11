Spotyy - PWA (MP3 & MP4)

How to use:
1. Unzip the folder.
2. Put media files in the /medias folder (optional) and add an index.json listing if you want server media to appear automatically.
   Example medias/index.json:
   [
     {"file":"song1.mp3","title":"Ma Chanson","type":"audio/mpeg","size":"3.4 MB"},
     {"file":"video1.mp4","title":"Clip","type":"video/mp4","size":"12.0 MB"}
   ]
3. Open the folder in VS Code and use Live Server, or run: python -m http.server
4. Visit the page in Chrome. Use the uploader to add local MP3/MP4 files (they're used via object URLs).
5. To install as PWA, use the install button when it appears or browser menu -> Install app.

Notes:
- When hosting online, put media files in the /medias folder so they can be served directly.
- The uploader uses createObjectURL so files added locally are not uploaded to the server.
