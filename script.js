// Spotyy - client script (supports mp3 & mp4)
// UI elements
const fileInput = document.getElementById('fileInput');
const fileLabelText = document.getElementById('fileLabelText');
const addBtn = document.getElementById('addBtn');
const gallery = document.getElementById('gallery');
const mediaName = document.getElementById('mediaName');
const installHint = document.getElementById('installHint');
const installBtn = document.getElementById('installBtn');
const searchInput = document.getElementById('searchInput');

fileInput.addEventListener('change', () => {
  const f = fileInput.files[0];
  fileLabelText.textContent = f ? f.name : 'Choisir des fichiers audio/vidéo';
});

// Theme toggle
function toggleTheme(){ document.body.classList.toggle('dark-mode'); }

// Basic detection for audio/video
function isMediaFile(file){
  if(!file) return false;
  const ext = (file.name||'').split('.').pop().toLowerCase();
  const mime = (file.type||'').toLowerCase();
  if(['mp3','wav','ogg','m4a','aac','flac'].includes(ext)) return true;
  if(['mp4','webm','mkv','mov','ogg'].includes(ext)) return true;
  if(mime.startsWith('audio/') || mime.startsWith('video/')) return true;
  return false;
}

function humanSize(bytes){ if(!bytes) return ''; if(bytes<1024) return bytes+' B'; let kb = Math.round(bytes/1024); if(kb<1024) return kb+' KB'; return (Math.round((kb/1024)*10)/10)+' MB'; }

function addAudio(){
  const files = Array.from(fileInput.files || []);
  if(files.length===0){ alert('Choisis d'abord un ou plusieurs fichiers'); return; }
  files.forEach(file => {
    if(!isMediaFile(file)){ alert('Fichier non supporté: '+file.name); console.log('Rejected', file); return; }
    const title = mediaName.value.trim() || file.name.replace(/\.[^/.]+$/, '');
    const url = URL.createObjectURL(file);
    const card = document.createElement('div'); card.className='card'; card.setAttribute('data-title', title.toLowerCase());
    const h = document.createElement('h3'); h.textContent = title;
    const thumb = document.createElement('div'); thumb.className='media-thumb'; thumb.textContent = (file.type.startsWith('video/')?'VID':'AUD');
    const info = document.createElement('div'); info.className='meta'; info.textContent = humanSize(file.size) + ' • ' + (file.type || 'type inconnu');
    card.appendChild(h); card.appendChild(thumb);
    if(file.type.startsWith('video/') || (file.name||'').toLowerCase().match(/\.(mp4|webm|mkv|mov)$/)){
      const v = document.createElement('video'); v.src = url; v.controls = true; v.playsInline = true; card.appendChild(v);
    } else {
      const a = document.createElement('audio'); a.src = url; a.controls = true; card.appendChild(a);
    }
    card.appendChild(info);
    gallery.prepend(card);
  });
  // reset inputs
  fileInput.value = ''; mediaName.value = '';
}

addBtn.addEventListener('click', addAudio);

// Search filter
function filterMedia(){
  const q = (searchInput.value||'').toLowerCase();
  document.querySelectorAll('.card').forEach(c=>{
    const t = c.getAttribute('data-title')||'';
    c.style.display = t.includes(q) ? 'block' : 'none';
  });
}

// PWA install prompt handling
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  installHint.style.display = 'block';
});
if(installBtn) installBtn.addEventListener('click', async ()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  console.log('Install choice', choice);
  installHint.style.display = 'none';
});

// small helper to load sample media from /medias if present (index.json)
async function loadServerList(){
  try{
    const res = await fetch('medias/index.json');
    if(!res.ok) return;
    const list = await res.json();
    list.forEach(item=>{
      const card = document.createElement('div'); card.className='card'; card.setAttribute('data-title', (item.title||'').toLowerCase());
      const h = document.createElement('h3'); h.textContent = item.title || item.file;
      const thumb = document.createElement('div'); thumb.className='media-thumb'; thumb.textContent = item.type && item.type.startsWith('video')? 'VID':'AUD';
      const info = document.createElement('div'); info.className='meta'; info.textContent = item.size ? item.size : '';
      card.appendChild(h); card.appendChild(thumb);
      if(item.type && item.type.startsWith('video')){
        const v=document.createElement('video'); v.src='medias/'+item.file; v.controls=true; v.playsInline=true; card.appendChild(v);
      } else {
        const a=document.createElement('audio'); a.src='medias/'+item.file; a.controls=true; card.appendChild(a);
      }
      card.appendChild(info);
      gallery.appendChild(card);
    });
  }catch(err){
    // no server list
    console.log('No server media list',err);
  }
}
loadServerList();
